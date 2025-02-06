const catchAsyncErrorHandler = require("../utils/catchAsync");
const response = require("../db/models/response");
const AppError = require("../utils/appError");
const advert = require("../db/models/advert");
const {removeCreatedFields} = require("./authController");

// Получить отклики других участников на свои заявки (PRODUCER, ADMIN, RECEIVER):
/* на фронте сделать логику:
- получить Ids своих объявлений
- получить все отклики, где есть Ids
const getResponses = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.user?.id;

    // получить Ids своих объявлений
    const adverts = await advert.findAll({
        where: {
            userId: userId,
        },
        attributes: ['id', 'finishDate'],
    });
    if(!adverts) return next(new AppError("Failed to get adverts of user", 400));

    // получить все отклики, где есть Ids
    let responses = [];
    const advertsObjs = JSON.parse(adverts)?.data; // adverts = {status,data :[{}, {}, {}]}
    for await(const advertsObj of advertsObjs){
        const responsesByAdvertId = await response.findAll({
            where: {
                advertId: advertsObj?.id
            },
            attributes: {
                exclude: ['deletedAt']
            }
        });
        if(responsesByAdvertId){
            responses = responses.concat(responsesByAdvertId);
        }
    }
    return res.status(200).json({
        status: 'success',
        data: responses
    });
});*/
const getResponsesByAdvertId = catchAsyncErrorHandler(async (req, res, next) => {
    const responsesByAdvertId = await response.findAll({
        where: {
            advertId: +req.params?.advertId // get advertId
        },
        attributes: {
            exclude: ['deletedAt']
        }
    });
    if(!responsesByAdvertId) return next(new AppError("Failed to get responses of user by advert id", 400));

    return res.status(200).json({
        status: 'success',
        data: responsesByAdvertId
    });


});
// Получить только свои отклики (ADMIN, RECYCLER, RECEIVER):
const getResponsesByUserId = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.user?.id;
    const responses = await response.findAndCountAll({
        where: {
            userId: userId,
        },
        include: advert,
        attributes: {exclude: ['deletedAt']},
        offset: 10,
        limit: 0,
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
    getResponsesByAdvertId,
    getResponsesByUserId,
    createResponse,
    updateResponseByAdvertId,
    deleteResponse,
}