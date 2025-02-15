const catchAsyncErrorHandler = require("../utils/catchAsync");
const advert = require("../db/models/advert");
const user = require("../db/models/user");
const {Op} = require("sequelize");
const AppError = require("../utils/appError");
const {removeCreatedFields} = require("./authController");
const response = require("../db/models/response");
function queryMaker(queryObject, notAdmin = true){
    const obj = {};
    //userName includes
    const nums = ['amount', 'price', 'totalPrice'];
    const bools = ['isPickedUp', 'priceWithDelivery'];
    const strings = ['userName','userRole', 'address'];
    const wastes = ['waste', 'wasteType'];

    //foo=bar&foo=qux => { wastes: [ 'стекло', 'пластик' ] }
    // foo=bar  => { wastes: 'стекло' }
    for(const key in queryObject){
        if(nums.includes(key)){
            obj.key = Number(queryObject[key]);
        }else if(bools.includes(key)){
            obj.key = Boolean(queryObject[key]);
        }else if(strings.includes(key)){
            if(key === 'userName' || key === 'address'){ //means they are searching by search
                obj.key = {
                    [Op.iLike]: `%${queryObject[key]}%`,
                }
            }
            obj.key = queryObject[key];
        }else if(wastes.includes(key)){
            // https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#postgres-only-range-operators
            obj.key = Array.isArray(queryObject[key]) ?
                {
                    [Op.or]: queryObject[key]
                } : queryObject[key];
        } else obj.key = queryObject[key];
    }
    return obj;
}

// получить заявки других участников:
const getAdverts = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.user?.id;
    const options = {
        userId: { // только чужие объявления
            [Op.ne]: userId
        },
        waste: {
            [Op.or]: req.query?.wastes.split(',').map(el => +el)
        },
        status: 'На рассмотрении',
        cityId: +req.query?.cityId || +req?.user?.cityId,
        finishDate: {
            [Op.gt]: new Date(), // актуальные
        }
    };
    if(req.query?.wasteTypes){
        options.wasteType = {
            [Op.or]: req.query?.wasteTypes.split(',').map(el => +el)
        }
    }
    const adverts = await advert.findAndCountAll({
        where: options,
        include: user,
        attributes: {exclude: ['deletedAt']},
        offset: req.query?.offset || 0,
        limit: req.query?.limit || 10,
        order: [
            ['updatedAt', 'DESC'],
        ],
    });
    if(!adverts) return next(new AppError("Failed to get adverts", 400));
    return res.status(200).json({
        status: 'success',
        data: adverts //{ count, rows }
    });
});

const getAdvertsByUserId = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.user?.id;
    if(+req?.params?.userId !== userId) return next(new AppError("User id doesn't match url-params", 400));

    const adverts = await advert.findAndCountAll({
        where: {
            userId: userId,
        },
        attributes: {exclude: ['deletedAt']},
        offset: req.query?.offset || 0,
        limit: req.query?.limit || 10,
        order: [
            ['createdAt', 'DESC'],
        ],
    });
    if(!adverts) return next(new AppError("Failed to get user's adverts", 400));
    return res.status(200).json({
        status: 'success',
        data: {
            count: adverts.count,
            rows: adverts.rows,
        } //{ count, rows }
    });
});

const createAdvert = catchAsyncErrorHandler(async (req, res, next) => {
    const formData = req?.body?.formData;
    if(!formData) return next(new AppError('Failed to create new advert: no body in request', 400));
    console.log(req?.user);
    const newAdvert = await advert.create({
        userId: +req?.user?.id,
        userName: req?.user?.name,
        address: formData.address || req?.user?.address,
        longitude: +formData.longitude || +req?.user?.longitude,
        latitude: +formData.latitude || +req?.user?.latitude,
        userRole: req?.user?.role,
        cityId: +formData.cityId || +req?.user?.cityId,
        waste: +formData.waste,
        wasteType: +formData?.wasteType || null,
        dimension: +formData.dimension,
        amount: +formData.amount || 1.0,
        price: +formData.price || 0.0,
        totalPrice: +formData.totalPrice || 0.0,
        isPickedUp: formData?.isPickedUp,
        photos: formData?.photos || null,
        comment: formData?.comment || null,
        finishDate: new Date(Date.parse(formData.finishDate)),
        priceWithDelivery: formData?.priceWithDelivery,
    });
    console.log(newAdvert);
    if(!newAdvert) return next(new AppError('Failed to create new advert', 400));
    const result = removeCreatedFields(newAdvert, null, false);
    return res.status(200).json({
        status: 'success',
        data: result
    });
});

const updateAdvertById = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.user?.id;
    const advertId = +req?.params.advertId;
    const updatedAdvert = await advert.update({...req.body}, {
        where: {
            id: advertId,
            userId: userId,
        }
    });
    if(!updatedAdvert) return next(new AppError('Failed to update advert', 400));
    return res.status(204).json({
        status: 'success',
        data: updatedAdvert
    });
});
const deleteAdvertById = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.user?.id;
    const advertId = +req?.params.advertId;
    if(! advertId) return next(new AppError('Не представлено Id публикации для удаления', 400));
    const deletedAdvert = await advert.destroy({
        where: {
            id: advertId,
            userId: userId,
            status: ['На рассмотрении'], // Shorthand syntax for Op.in: https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#shorthand-syntax-for-opin
        },
    });
    if(!deletedAdvert) return next(new AppError('Ошибка при удалении публикации', 400));

    return res.status(200).json({
        status: 'success',
        data: deletedAdvert
    });
});

const getAdvertById = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.user?.id;
    const advertId = +req?.params?.advertId;
    if(!advertId) return next(new AppError("Не представлено id публикации", 400));
    const found = await advert.findByPk(advertId);
    if(!found) return next(new AppError(`Нет данных о публикации с таким id`, 400));
    const resObj = {
        status: 'success',
        data: found
    }
    const responsesOfAdvert = await response.findAndCountAll({
        where: {
            advertId: advertId, // get advertId
            userId: {
                [Op.ne]: userId
            },
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
    if(responsesOfAdvert) resObj.responses = responsesOfAdvert;
    return res.status(200).json(resObj);
});

module.exports = {
    getAdvertsByUserId,
    getAdverts,
    createAdvert,
    updateAdvertById,
    getAdvertById,
    deleteAdvertById
}