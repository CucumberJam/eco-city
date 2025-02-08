const catchAsyncErrorHandler = require("../utils/catchAsync");
const response = require("../db/models/response");
const AppError = require("../utils/appError");
const advert = require("../db/models/advert");
const {removeCreatedFields} = require("./authController");
const {Op} = require("sequelize");

// Получить отклики других участников на свои заявки
// (PRODUCER, ADMIN, RECEIVER):
const getOtherResponses = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.user?.id;
    let adverts = req?.query?.adverts;
    if(!adverts || adverts?.length === 0){
        adverts = await advert.findAll({
            attributes: {
                exclude: ['deletedAt'],
                include: ['id']
            },
            where: { // только id своих актуальных объявлений (в работе):
                userId: userId,
                status: {
                    [Op.ne]: 'Исполнено'
                },
            },
            order: [
                ['updatedAt', 'DESC'],
            ],
        });
    }
    if(!adverts) return next(new AppError("Failed to get adverts", 400));

    const responsesByAdverts = await response.findAndCountAll({
        where: {
            advertId: [adverts] // get advertId
        },
        attributes: {
            exclude: ['deletedAt']
        },
        order: [
            ['updatedAt', 'DESC'],
        ],
        offset: req.query?.offset || 0,
        limit: req.query?.limit || 10,
    });
    if(!responsesByAdverts) return next(new AppError("Failed to get other responses by user's adverts", 400));

    const responseObj = {
        status: 'success',
        data: {
            count: responsesByAdverts.count,
            rows: responsesByAdverts.rows,
        },
    }
    if(!req?.query?.adverts || req?.query?.adverts?.length === 0){
        responseObj.advertsIds = adverts;
    }
    return res.status(200).json(responseObj);
});
// Получить только свои отклики (ADMIN, RECYCLER, RECEIVER):
const getResponsesByUserId = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.user?.id;
    if(+req?.params?.userId !== userId) return next(new AppError("User id doesn't match url-params", 400));

    const responses = await response.findAndCountAll({
        where: {
            userId: userId,
        },
        include: advert,
        attributes: {exclude: ['deletedAt']},
        offset: req.query?.offset || 0,
        limit: req.query?.limit || 10,
        order: [
            ['updatedAt', 'DESC'],
        ],
    });
    if(!responses) return next(new AppError("Failed to get user's responses", 400));
    return res.status(200).json({
        status: 'success',
        data: responses //{ count, rows }
    });
});

// Публиковать отклики на заявки других участников (ADMIN, RECYCLER, RECEIVER):
const createResponse = catchAsyncErrorHandler(async (req, res, next) => {
    const formData = req?.body?.formData;
    if(!formData) return;
    const newResponse = await response.create({
        advertId: +formData.advertId,
        status: 'На рассмотрении',
        userId: +req?.user?.id,
        userName: req?.user?.name,
        address: req?.body?.address || req?.user?.address,
        longitude: req?.body?.longitude || req?.user?.longitude,
        latitude: req?.body?.latitude || req?.user?.latitude,
        userRole: req?.user?.role,
        price: +formData?.price || 0.0,
        totalPrice: +formData?.totalPrice || 0.0,
        comment: formData?.comment || null
    });
    if(!newResponse) return next(new AppError('Failed to create new response', 400));
    const result = removeCreatedFields(newResponse, null, false);
    return res.status(200).json({
        status: 'success',
        data: result
    });
});

// Изменить отклик (только владелец объявления, на которое был подан отклик в случае его согласования):
const updateResponseByAdvertId = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.user?.id;
    const advertId = +req?.params.advertId;
    const {id, status} = req.query;

    //убедились что пользователь действительно владелец объявления:
    const foundAdvert = await advert.findOne({
        where:{
            id: advertId,
            userId
        }
    });
    if(!foundAdvert) return next(new AppError("Advert doesn't belong to user", 400));

    //изменить отклик, поменяв его статус ('Отклонено', 'Принято', 'Исполнено'):
    const updatedResponse = await response.update({status}, {
        where: {
            id: id,
            advertId: advertId,
        }
    });
    if(!updatedResponse) return next(new AppError('Failed to update response to advert by id', 400));

    //изменить объявление, поменяв его статус ('Принято', 'Исполнено'):
    if(status === 'Отклонено'){
        return res.status(204).json({
            status: 'success',
            data: updatedResponse
        });
    }
    const updatedAdvert = await advert.update({status}, {
        where: {
            id: advertId
        }
    });
    if(!updatedAdvert) return next(new AppError('Failed to update advert by advert id', 400));

    return res.status(204).json({
        status: 'success',
        data: updatedResponse
    });
});

// Удалить отклик может только его владелец (если он не согласован):
const deleteResponse = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.user?.id;
    const responseId = +req?.params?.responseId;
    const deletedResponse = await response.destroy({
        where: {
            id: responseId,
            userId,
            status: ['На рассмотрении', 'Отклонено'], // Shorthand syntax for Op.in: https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#shorthand-syntax-for-opin
        },
    });
    if(!deletedResponse) return next(new AppError("Failed to delete response of user", 400));
    return res.status(200).json({
        status: 'success',
        data: deletedResponse
    });
});

module.exports = {
    getOtherResponses,
    getResponsesByUserId,
    createResponse,
    updateResponseByAdvertId,
    deleteResponse,
}