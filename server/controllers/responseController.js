const catchAsyncErrorHandler = require("../utils/catchAsync");
const response = require("../db/models/response");
const AppError = require("../utils/appError");
const advert = require("../db/models/advert");
const user = require("../db/models/user");
const {removeCreatedFields} = require("./authController");
const {Op, Sequelize} = require("sequelize");
const getDBFilterByDatePeriod = require("../utils/helpers");

/**
 * Метод возвращает список откликов других участников
 * на заявки пользователя с ролью PRODUCER / ADMIN / RECEIVER
 * с учетом пагинации
 * @param {[string]} req.query.adverts - id публикаций Пользователя (не обязателен)
 * @param {number} req.query.cityId - id города (не обязателен)
 * @param {[number]} req.query.wastes - id видов отходов (не обязателен)
 * @param {[number]} req.query.wasteTypes - id подвидов отходов (не обязателен)
 * @param {string} req.query.query - запрос в поисковой строке (не обязателен)
 * @param {number} req.query.offset - количество строк в БД для отступа
 * @param {number} req.query.limit - количество строк в БД для получения
 * @desc Get responses of other participants on user's adverts
 * @route GET/api/v1/responses
 * @access Private
 **/
const getOtherResponses = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.user?.id;
    let {adverts, offset, limit, cityId, wastes, wasteTypes, query} = req?.query;
    if(!adverts || adverts?.length === 0){
        const options = { // только id своих актуальных объявлений (в работе):
            userId: userId,
            status: {
                [Op.ne]: 'Исполнено'
            }
        };
        if(wasteTypes && wastes){
            options[Op.or] = {
                waste: wastes.split(',')?.map(el => +el),
                wasteType: wasteTypes.split(',').map(el => +el)
            }
        }else if(wastes){
            options.waste = wastes.split(',').map(el => +el)
        }
        if(cityId) options.cityId = +cityId;
        adverts = await advert.findAll({
            attributes: ['id'],
            where: options,
            order: [
                ['updatedAt', 'DESC'],
            ],
        });
        if(!adverts) return next(new AppError("Ошибка при получении id публикаций пользователя", 400));
        adverts = adverts?.map(el => +el.dataValues.id);
    }else {
        adverts = adverts?.split(',')?.map(el => +el);
    }
    const options = {
        advertId: adverts, // get advertId
        userId: {
            [Op.ne]: userId
        },
    };

    const includesCreatures = [
        {
            model: advert,
            attributes: {
                exclude: ['userName', 'userRole', 'deletedAt']
            },
            include:{
                model: user,
                attributes: {
                    exclude: ['password', 'deletedAt', 'updatedAt', 'createdAt']
                },
            }
        },
        {
            model: user,
            attributes: {
                exclude: ['password', 'deletedAt', 'updatedAt', 'createdAt']
            },
        }
    ]
    if(query) {
        includesCreatures[1].where = {
            name: {
                [Op.iLike]: `%${query}%`
            }
        }
    }
    const responsesByAdverts = await response.findAndCountAll({
        where: options,
        attributes: {
            exclude: ['deletedAt', 'userName', 'userRole', 'userId']
        },
        order: [
            ['updatedAt', 'DESC'],
        ],
        offset: +offset || 0,
        limit: +limit || 10,
        include: includesCreatures
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

/**
 * Метод возвращает список откликов пользователя
 * с ролью RECYCLER / ADMIN / RECEIVER на заявки других участников
 * с учетом пагинации
 * @param {number} req.query.offset - количество строк в БД для отступа
 * @param {number} req.query.limit - количество строк в БД для получения
 * @desc Get user's responses
 * @route GET/api/v1/responses/:userId
 * @access Private
 **/
const getResponsesByUserId = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.user?.id;
    if(+req?.params?.userId !== +userId) return next(new AppError("id пользователя не соответствует url-param", 400));
    let {offset, limit, status, period, needStats} = req?.query;
    const options = {userId: userId}
    if(status) options.status = status;
    const modelAdvert =  {
            model: advert,
            attributes: {
                exclude: ['userName', 'userRole', 'deletedAt']
            },
            include: {
                model: user,
                attributes: {
                    exclude: ['password', 'deletedAt', 'updatedAt', 'createdAt']
                },
            }
    };
    if(period){
        modelAdvert.where = {
            finishDate: getDBFilterByDatePeriod(+period)
        }
    }
    const responses = await response.findAndCountAll({
        where: options,
        attributes: {
            exclude: ['deletedAt', 'userName', 'userRole', 'userId']
        },
        offset: +offset || 0,
        limit: +limit || 10,
        order: [
            ['updatedAt', 'DESC'],
        ],
        include: [
            modelAdvert,
            {
                model: user,
                attributes: {
                    exclude: ['password', 'deletedAt', 'updatedAt', 'createdAt']
                },
            }
        ]
    });
    if(!responses) return next(new AppError("Ошибка при получении откликов пользователя", 400));

    const result = {
        count: responses.count,
        rows: responses.rows,
    }
    // посчитать количество просроченных и актуальных
    if(needStats === 'true'){
        const late = await response.count({
            where: {
                userId: +userId,
                status: status,
            },
            include: {
                model: advert,
               // required: true, // INNER JOIN
                where: {
                    finishDate: {
                        [Op.lt]: Sequelize.literal('CURRENT_DATE')
                    },
                },
            }
        });
        if(late) result.late = late;
        const coming = await response.count({
            where: {
                userId: +userId,
                status: status,
            },
            include: {
                model: advert,
                //required: true, // INNER JOIN
                where: {
                    finishDate: {
                        [Op.gte]: Sequelize.literal('CURRENT_DATE')
                    },
                },
            }
        });
        if(coming) result.coming = coming;
    }

    return res.status(200).json({
        status: 'success',
        data: result
    });
});
/**
 * Метод создаёт отклик пользователя с ролью RECYCLER / ADMIN / RECEIVER
 * на публикацию другого участника
 * @param {object} req.body.formData - данные для создания отклика
 * @desc Post user's new response to other participant's advert
 * @route POST/api/v1/responses
 * @access Private
 **/
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

/**
 * Метод изменяет статус отклика другого участника по id публикации пользователя
 * с возможным изменением статуса самой публикации
 * @param {number} req.params.advertId - id публикаций Пользователя
 * @param {number} req.query.id - id отклика другого участника
 * @param {string} req.query.status - статус отклика другого участника
 * @desc Update other participant's response by user's advert id
 * @route PATCH/api/v1/responses/:advertId
 * @access Private
 **/
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
    if(!foundAdvert) return next(new AppError("Публикация не принадлежит Пользователю", 400));

    // если у объявления статус "Исполнено", то отмена
    if(foundAdvert?.dataValues?.status === 'Исполнено'){
        return res.status(400).send({
            success: false,
            error: {
                message: 'Заявка уже исполнена'
            }
        });
    }
    if(foundAdvert?.dataValues?.status !== 'На рассмотрении'){
        //  найти отклик со статусом аналогичным как у объявления,
        const oldResponse = await response.findOne({
            where: {
                advertId: +advertId,
                status: ['Отклонено', 'Принято']
            }
        });
        if(oldResponse){
            //  проверить id старого и нового откликов,
            if(+oldResponse.dataValues?.id === +id){ // это один и тот же отклик
                //  если статус один и тот же то ничего
                if(oldResponse.dataValues?.status === status){
                    return res.status(400).send({
                        success: false,
                        error: {
                            message: 'У данного отклика уже установлен такой статус'
                        }
                    });
                }
            }else{ //  если id у старого и нового отклика разные
                //  изменить статус старого отклика на "Отклонено" - если статус старого и нового отклика "Принято"
                if(oldResponse.dataValues?.status === 'Принято' && status === 'Принято'){
                    const updatedOldResponse = await response.update({status: 'Отклонено'}, {
                        where: {
                            id: +oldResponse.dataValues?.id,
                        }
                    });
                    if(!updatedOldResponse) return next(new AppError('Ошибка при обновлении чужого отклика на данную публикацию', 400));
                }
            }
        }
    }

    //изменить отклик, поменяв его статус ('Отклонено', 'Принято', 'Исполнено'):
    const updatedResponse = await response.update({status}, {
        where: {
            id: +id,
            advertId: +advertId,
        }
    });
    if(!updatedResponse) return next(new AppError('Ошибка при обновлении отклика', 400));

    //изменить объявление, поменяв его статус ('Принято', 'Исполнено'):
    const updatedAdvert = await advert.update(
        {status: status === 'Отклонено' ? 'На рассмотрении' : status},
        {
        where: {
            id: advertId
        }
    });
    if(!updatedAdvert) return next(new AppError('Ошибка при обновлении публикации по отклику', 400));

    return res.status(200).json({
        status: 'success',
        data: updatedResponse
    });
});

/**
 * Метод удаляет отклик пользователя, если статус отклик не равен "Согласовано"
 * @param {number} req.params.responseId - id отклика Пользователя
 * @desc Delete user's response if it's status != "Accepted"
 * @route DELETE/api/v1/responses/:responseId
 * @access Private
 **/
const deleteResponse = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.user?.id;
    const responseId = +req?.params?.responseId;

    if(!responseId) return next(new AppError("Параметр id отклика не был передан", 400));

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

/**
 * Метод возвращает отклик пользователя по его id
 * @param {number} req.params.responseId - id отклика пользователя
 * @desc Get user's response by id
 * @route GET/api/v1/responses/response/:responseId
 * @access Private
 **/
const getResponseById = catchAsyncErrorHandler(async (req, res, next)=>{
    const responseId = +req?.params?.responseId;
    if(!responseId) return next(new AppError("No response id presented", 400));

    const found = await response.findOne({
        where: {
            id: responseId
        },
        attributes: {
            exclude: ['deletedAt', 'userName', 'userRole', 'userId']
        },
        include: [
            {
                model: advert,
                attributes: {
                    exclude: ['userName', 'userRole', 'deletedAt']
                },
            },
            {
                model: user,
                attributes: {
                    exclude: ['password', 'deletedAt', 'updatedAt', 'createdAt']
                },
            }
        ]
    });
    if(!found) return next(new AppError(`Failed to get response №${responseId}`, 400));

    return res.status(200).json({
        status: 'success',
        data: found
    });
});

/**
 * Метод возвращает список откликов на публикацию по id
 * с учетом пагинации
 * @param {number} req.params.advertId - id публикации
 * @param {number} req.query.offset - количество строк в БД для отступа
 * @param {number} req.query.limit - количество строк в БД для получения
 * @desc Get responses by advert id
 * @route GET/api/v1/responses/advert/:advertId
 * @access Private
 **/
const getResponsesByAdvertId = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.user?.id;
    const advertId = +req?.params?.advertId;
    if(!advertId) return next(new AppError("Не представлено id публикации", 400));
    const responsesByAdvertId = await response.findAndCountAll({
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
        offset: req.query?.offset || 0,
        limit: req.query?.limit || 10,
        include: [
            {
                model: advert,
                attributes: {
                    exclude: ['userName', 'userRole', 'deletedAt']
                },
                include: {
                    model: user,
                    attributes: {
                        exclude: ['password', 'deletedAt', 'updatedAt', 'createdAt']
                    },
                }
            },
            {
                model: user,
                attributes: {
                    exclude: ['password', 'deletedAt', 'updatedAt', 'createdAt']
                },
            }
        ]
    });
    if(!responsesByAdvertId) return next(new AppError("Ошибка получения откликов по Id публикации", 400));

    return res.status(200).json({
        status: 'success',
        data: responsesByAdvertId // {count, rows}
    });
});

module.exports = {
    getOtherResponses,
    getResponsesByUserId,
    createResponse,
    updateResponseByAdvertId,
    deleteResponse,
    getResponseById,
    getResponsesByAdvertId,
}