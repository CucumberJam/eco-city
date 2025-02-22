const catchAsyncErrorHandler = require("../utils/catchAsync");
const advert = require("../db/models/advert");
const user = require("../db/models/user");
const {Op} = require("sequelize");
const AppError = require("../utils/appError");
const {removeCreatedFields} = require("./authController");
const response = require("../db/models/response");
/**
 * Метод возвращает список публикаций других участников
 * для пользователя с ролью RECYCLER / ADMIN / RECEIVER
 * с учетом пагинации
 * @param {number} req.query.cityId - id города (не обязателен)
 * @param {[number]} req.query.wastes - id видов отходов (не обязателен)
 * @param {[number]} req.query.wasteTypes - id подвидов отходов (не обязателен)
 * @param {number} req.query.offset - количество строк в БД для отступа
 * @param {number} req.query.limit - количество строк в БД для получения
 * @desc Get other participants adverts
 * @route GET/api/v1/adverts/
 * @access Private
 **/
const getAdverts = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.user?.id;
    const options = {
        userId: { // только чужие объявления
            [Op.ne]: userId
        },
        status: 'На рассмотрении',
        cityId: +req.query?.cityId || +req?.user?.cityId,
        finishDate: {
            [Op.gt]: new Date(), // актуальные
        }
    };
    if(req.query?.wasteTypes){
        options[Op.or] = {
            waste: req.query?.wastes.split(',').map(el => +el),
            wasteType: req.query?.wasteTypes.split(',').map(el => +el)
        }
    }else{
        options.waste = {
            [Op.or]: req.query?.wastes.split(',').map(el => +el)
        }
    }
    const adverts = await advert.findAndCountAll({
        where: options,
        include: {
            model: user,
            attributes: {
                exclude: ['password', 'deletedAt', 'updatedAt', 'createdAt']
            },
        },
        attributes: {
            exclude: ['userName', 'userRole','deletedAt']
        },
        offset: req.query?.offset || 0,
        limit: req.query?.limit || 10,
        order: [
            ['updatedAt', 'DESC'],
        ],
    });
    if(!adverts) return next(new AppError("Failed to get adverts", 400));
    return res.status(200).json({
        status: 'success',
        data: adverts
    });
});

/**
 * Метод возвращает список публикаций пользователя
 * с ролью PRODUCER / ADMIN / RECEIVER
 * с учетом пагинации
 * @param {number} req.query.cityId - id города (не обязателен)
 * @param {[number]} req.query.wastes - id видов отходов (не обязателен)
 * @param {[number]} req.query.wasteTypes - id подвидов отходов (не обязателен)
 * @param {string} req.query.query - запрос в поисковой строке (не обязателен)
 * @param {number} req.query.offset - количество строк в БД для отступа
 * @param {number} req.query.limit - количество строк в БД для получения
 * @desc Get user's adverts
 * @route GET/api/v1/adverts/:userId
 * @access Private
 **/
const getAdvertsByUserId = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.user?.id;
    if(+req?.params?.userId !== userId) return next(new AppError("User id doesn't match url-params", 400));
    let {offset, limit, cityId, wastes, wasteTypes, query} = req?.query;
    const options = { userId: userId};
    if(wasteTypes && wastes){
        options[Op.or] = {
            waste: wastes.split(',')?.map(el => +el),
            wasteType: wasteTypes.split(',').map(el => +el)
        }
    }else if(wastes){
        options.waste = wastes.split(',').map(el => +el)
    }
    if(cityId) options.cityId = +cityId;

    const includesCreature = {
        model: user,
        attributes: {
            exclude: ['password', 'deletedAt', 'updatedAt', 'createdAt']
        },
    }
    if(query) {
        includesCreature.where = {
            name: {
                [Op.iLike]: `%${query}%`
            }
        }
    }

    const adverts = await advert.findAndCountAll({
        where: options,
        attributes: {
            exclude: ['userName', 'userRole', 'deletedAt']
        },
        offset: +offset || 0,
        limit: +limit || 10,
        order: [
            ['updatedAt', 'DESC'],
        ],
        include: includesCreature,
    });

    if(!adverts) return next(new AppError("Failed to get user's adverts", 400));
    return res.status(200).json({
        status: 'success',
        data: {
            count: adverts.count,
            rows: adverts.rows,
        }
    });
});

/**
 * Метод создаёт публикацию пользователя с ролью PRODUCER / ADMIN / RECEIVER
 * @param {object} req.body.formData - данные для создания публикации
 * @desc Post user's new advert
 * @route POST/api/v1/adverts
 * @access Private
 **/
const createAdvert = catchAsyncErrorHandler(async (req, res, next) => {
    const formData = req?.body?.formData;
    if(!formData) return next(new AppError('Failed to create new advert: no body in request', 400));
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
    if(!newAdvert) return next(new AppError('Failed to create new advert', 400));
    const result = removeCreatedFields(newAdvert, null, false);
    return res.status(200).json({
        status: 'success',
        data: result
    });
});

/**
 * Метод изменяет публикацию пользователя по её id
 * @param {number} req.params.advertId - id публикаций Пользователя
 * @desc Update user's advert by id
 * @route PATCH/api/v1/adverts/:advertId
 * @access Private
 **/
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
    return res.status(400).json({
        status: 'success',
        data: updatedAdvert
    });
});

/**
 * Метод удаляет публикацию пользователя, если статус 'На рассмотрении'
 * @param {number} req.params.advertId - id публикации Пользователя
 * @desc Delete user's advert if it's status === "On recognition"
 * @route DELETE/api/v1/adverts/:advertId
 * @access Private
 **/
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

/**
 * Метод возвращает публикацию пользователя по id вместе с откликами
 * @param {number} req.params.advertId - id публикации
 * @desc Get advert by id
 * @route GET/api/v1/adverts/advert/:advertId
 * @access Private
 **/
const getAdvertById = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.user?.id;
    const advertId = +req?.params?.advertId;
    if(!advertId) return next(new AppError("Не представлено id публикации", 400));
    const found = await advert.findOne({
        where: {
            id: advertId
        },
        attributes: {
            exclude: ['userName', 'userRole', 'deletedAt']
        },
        include: {
            model: user,
            attributes: {
                exclude: ['password', 'deletedAt', 'updatedAt', 'createdAt']
            },
        }
    });
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
            exclude: ['deletedAt', 'userName', 'userRole', 'userId']
        },
        order: [
            ['updatedAt', 'DESC'],
        ],
        include: {
            model: user,
            attributes: {
                exclude: ['password', 'deletedAt', 'updatedAt', 'createdAt']
            },
        },
        offset: req.query?.offset || 0,
        limit: req.query?.limit || 10,
    });
    console.log(responsesOfAdvert)
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