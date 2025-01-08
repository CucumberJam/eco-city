const catchAsyncErrorHandler = require("../utils/catchAsync");
const advert = require("../db/models/advert");
const user = require("../db/models/user");
const {Op} = require("sequelize");
const AppError = require("../utils/appError");
const {removeCreatedFields} = require("./authController");
function queryMaker(queryObject, notAdmin = true){
    const obj = {};
    //userName includes
    const nums = ['amount', 'price', 'totalPrice'];
    const bools = ['isPickedUp', 'priceWithDelivery'];
    const strings = ['userName','userRole', 'address'];
    const wastes = ['wastes', 'wasteTypes'];

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
                {[Op.contains]: queryObject[key]} : queryObject[key];
        } else obj.key = queryObject[key];
    }
    return obj;
}

// получить  заявки других участников:
const getAdverts = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.user?.id;
    const adverts = await advert.findAndCountAll({
        where: {
            userId: { // только чужие объявления
                [Op.ne]: userId
            },
            cityId: +req.query?.cityId || +req?.user?.cityId,
            ...queryMaker(req.query),
            finishDate: {
                [Op.gt]: new Date(), // актуальные
            }
        },
        include: user,
        attributes: {exclude: ['deletedAt']},
        offset: 0,
        limit: 10,
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
        offset: 0,
        limit: 10,
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
    const newAdvert = await advert.create({
        userId: +req?.user?.id,
        userName: req?.user?.name,
        address: req?.body?.address || req?.user?.address,
        longitude: req?.body?.longitude || req?.user?.longitude,
        latitude: req?.body?.latitude || req?.user?.latitude,
        userRole: req?.user?.role,
        cityId: +req?.body?.cityId || +req?.user?.cityId,
        waste: req?.body?.waste,
        wasteType: req?.body?.wasteType || null,
        dimension: req?.body?.dimension,
        amount: req?.body?.amount || 1.0,
        price: req?.body?.price || 0.0,
        totalPrice: req?.body?.totalPrice || 0.0,
        isPickedUp: req?.body?.isPickedUp || true,
        photos: req?.body?.photos || null,
        comment: req?.body?.comment || null,
        finishDate: req?.body?.finishDate,
        priceWithDelivery: req?.body?.priceWithDelivery || false,
    });
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

module.exports = {getAdvertsByUserId, getAdverts, createAdvert, updateAdvertById}