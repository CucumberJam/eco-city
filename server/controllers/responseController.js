import catchAsyncErrorHandler from "../utils/catchAsync.js";
import response from "../db/models/response.js";
import AppError from "../utils/appError.js";
import advert from "../db/models/advert.js";
import user from "../db/models/user.js";
import {removeCreatedFields} from "./authController.js";
import {Op, Sequelize} from "sequelize";
import getDBFilterByDatePeriod from "../utils/helpers.js";

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
export const getOtherResponses = catchAsyncErrorHandler(async (req, res, next) => {
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
export const getResponsesByUserId = catchAsyncErrorHandler(async (req, res, next) => {
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
        result.late = await response.count({
            where: {
                userId: +userId,
                status: status,
            },
            include: {
                model: advert,
                required: true, // INNER JOIN
                where: {
                    finishDate: {
                        [Op.lt]: Sequelize.literal('CURRENT_DATE')
                    },
                },
            }
        });
        result.coming = await response.count({
            where: {
                userId: +userId,
                status: status,
            },
            include: {
                model: advert,
                required: true, // INNER JOIN
                where: {
                    finishDate: {
                        [Op.gte]: Sequelize.literal('CURRENT_DATE')
                    },
                },
            }
        });
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
export const createResponse = catchAsyncErrorHandler(async (req, res, next) => {
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
export const updateResponseByAdvertId = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.user?.id;
    const advertId = +req?.params.advertId;
    const {id, status} = req.query; //status ='Отклонено' | 'Принято'
    //console.log('currentResponseId: ', id)

    //убедились что пользователь действительно владелец объявления:
    const foundAdvert = await advert.findByPk(advertId);
    //console.log('foundAdvert: ', foundAdvert.dataValues)

    if(!foundAdvert) return next(new AppError("Публикация была удалена", 400));
    if(+foundAdvert?.dataValues?.userId !== +userId) return next(new AppError("Публикация не принадлежит Пользователю", 400));

    //'На рассмотрении', 'Архив = Отклонено', 'Принято', 'Исполнено'
    const advertOldStatus = foundAdvert?.dataValues?.status;
    //console.log('advertOldStatus: ', advertOldStatus);

    if(advertOldStatus === 'Исполнено' || advertOldStatus === 'Отклонено'){
        // если у объявления статус "Исполнено" или 'Архив',
        // то отмена
        return res.status(400).send({
            success: false,
            message: advertOldStatus === 'Исполнено'  ? 'Заявка уже исполнена' : 'Заявка уже в архиве'
        });
    }

    if(advertOldStatus === 'Принято'){
        //  найти отклик со статусом аналогичным как у объявления,
        const oldResponse = await response.findOne({
            where: {
                advertId: +advertId,
                status: 'Принято'
            }
        });
        //console.log('oldResponse: ', oldResponse?.dataValues);

        if(oldResponse){ // обновить статус у старого отклика, если это другой отклик
            //  проверить id старого и нового откликов
            const oldResponseId = +oldResponse.dataValues?.id;
            const oldResponseStatus = oldResponse.dataValues?.status;
            //console.log('Is previous accepted response the same as current: ', oldResponseId === +id);
            //console.log('Has previous accepted response the same status as current do: ', oldResponseStatus === status);
            if(oldResponseId === +id){ // это один и тот же отклик
                //  если статус один и тот же то ничего
                if(oldResponseStatus === status){
                    return res.status(400).send({
                        success: false,
                        message: 'У данного отклика уже установлен такой статус'
                    });
                }
            }else{ //  если id у старого и нового отклика разные
                //  изменить статус старого отклика на "Отклонено"
                const updatedOldResponse = await response.update({status: 'Отклонено'}, {
                    where: {
                        id: oldResponseId,
                    }
                });
                //console.log('updatedOldResponse: ', updatedOldResponse);
                if(!updatedOldResponse) return next(new AppError('Ошибка при обновлении чужого отклика на данную публикацию', 400));
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
    //console.log('updatedResponse: ', updatedResponse);
    if(!updatedResponse) return next(new AppError('Ошибка при обновлении отклика', 400));

    //изменить объявление, поменяв его статус ('Принято', 'Исполнено', 'Архив'):
    const updatedAdvert = await advert.update(
        {status: status === 'Отклонено' ? 'На рассмотрении' : status},
        {
        where: {
            id: +advertId
        }
    });
    //console.log('updatedAdvert: ', updatedAdvert);
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
export const deleteResponse = catchAsyncErrorHandler(async (req, res, next) => {
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
export const getResponseById = catchAsyncErrorHandler(async (req, res, next)=>{
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
                    exclude: ['deletedAt']
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
export const getResponsesByAdvertId = catchAsyncErrorHandler(async (req, res, next) => {
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

