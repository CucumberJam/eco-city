const catchAsyncErrorHandler = require("../utils/catchAsync");
const user = require("../db/models/user");
const {Op} = require("sequelize");
const AppError = require("../utils/appError");
const response = require("../db/models/response");

/**
 * Метод возвращает список авторизованных пользователей
 * с учетом пагинации
 * @param {number} req.query.userId - авторизованного пользователя (не обязателен)
 * @param {number} req.query.cityId - id города (не обязателен)
 * @param {string} req.query.query - запрос поисковой строки (не обязателен)
 * @param {[number]} req.query.wastes - id видов отходов (не обязателен)
 * @param {[number]} req.query.wasteTypes - id подвидов отходов (не обязателен)
 * @param {[string]} req.query.roles - имена ролей пользователей
 * @param {number} req.query.offset - количество строк в БД для отступа
 * @param {number} req.query.limit - количество строк в БД для получения
 * @desc Get participants by filter
 * @route GET/api/v1/users/
 * @access Public
 **/
const getUsers = catchAsyncErrorHandler(async (req, res, next) => {
    const {userId, cityId, query, roles, wastes, wasteTypes, offset, limit} = req.query;
    const options = {};
    if(userId) options.id = {[Op.ne]: +userId};
    if(cityId) options.cityId = +cityId;
    if(query) options.name = { [Op.iLike]: `%${query}%`}
    if(wastes && wasteTypes){
        options[Op.or] = {
            wastes: {[Op.overlap]: wastes.split(',').map(el => +el)},
            wasteTypes: {[Op.overlap]: wasteTypes.split(',').map(el => +el)}
        }
    }else if(wastes){
        options.wastes = {[Op.overlap]: wastes.split(',').map(el => +el)};
    }
    if(roles) options.role = roles.split(',');
    else options.role = {[Op.ne]: 'ADMIN'}

    const users = await user.findAndCountAll({
        where: options,
        attributes: {exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt']},
        order: [['updatedAt', 'DESC'],],
        offset: +offset || 0,
        limit: +limit || 10,
    });
    if(!users) return next(new AppError('Пользователей с такими параметрами не найдено', 400));
    return res.status(200).json({
        status: 'success',
        data: users
    });
});

/**
 * Метод изменяет данные об авторизованном пользователе
 * @param {string} req.body.name - имя пользователя (не обязателен)
 * @param {string} req.body.address - адрес пользователя (не обязателен)
 * @param {number} req.body.latitude - широта на карте (не обязателен)
 * @param {number} req.body.longitude - долгота на карте (не обязателен)
 * @param {string} req.body.role - роль (не обязателен)
 * @param {number} req.body.cityId - id города пользователя (не обязателен)
 * @param {[number]} req.body.wastes - список id видов отходов (не обязателен)
 * @param {[number]} req.body.wasteTypes - список id подвидов отходов (не обязателен)
 * @param {string} req.body.email - email (не обязателен)
 * @param {number} req.body.phone - телефон (не обязателен)
 * @param {string} req.body.website - website (не обязателен)
 * @param {[number]} req.body.workingDays - список рабочих дней недели (не обязателен)
 * @param {[string]} req.body.workingHourStart - список начала рабочего дня (не обязателен)
 * @param {[string]} req.body.workingHourEnd - список окончания рабочего дня (не обязателен)
 * @desc Update auth user data
 * @route Post/api/v1/users/user
 * @access Private
 **/
const updateUser = catchAsyncErrorHandler(async (req, res, next) =>{
    if(Object.keys(req.body).length === 0) return next(new AppError('Параметров для изменения данных о Пользователе не передано', 400));
    const userId = +req?.user?.id;
    console.log(req.body);
    const updatedUser = await user.update({...req.body}, {
        where: {id: +userId}
    });
    if(!updatedUser) return next(new AppError('Ошибка при обновлении данных о Пользователе', 400));

    return res.status(200).json({
        status: 'success',
        data: updatedUser
    });
})
/**
 * Метод возвращает авторизованного пользователя по id
 * @param {number} req.params.id - id пользователя
 * @desc Get participant by id
 * @route GET/api/v1/users/:id
 * @access Private
 **/
const getUserById = catchAsyncErrorHandler(async (req, res, next) => {
    const paramsId = +req?.params?.id
    const userId = +req?.user?.id;
    if(paramsId !== userId) return next(new AppError('Данные о пользователе не могут быть предоставлены', 400));
    const found = await user.findOne({
        where:{
            id: userId
        },
        attributes: {
            exclude: ['password', 'deletedAt', 'updatedAt', 'createdAt']
        },
    });
    if(!found) return next(new AppError('Failed to get user', 400));
    return res.status(200).json({
        status: 'success',
        data: found
    });
});

/**
 * Метод возвращает авторизованного пользователя по email, ОГРН или телефону
 * @param {number} req.query.email - email авторизованного пользователя
 * @param {number} req.query.ogrn - ОГРН авторизованного пользователя
 * @param {[number]} req.query.phone - id видов отходов (не обязателен)
 * @desc Get participants by email, ogrn or phone
 * @route GET/api/v1/users/user
 * @access Public
 **/
const getUserByEmailOrOGRN = catchAsyncErrorHandler(async (req, res, next) => {
    const {email, ogrn, phone} = req.query;
    if(!email && !ogrn && !phone) return next(new AppError(`Не представлено email, ОГРН или телефон`, 400));
    let options = {};
    if(email) options.email = email;
    if(ogrn) options.ogrn = ogrn;
    if(phone) options.phone = phone;

    const found = await user.findOne({
        where: options,
        attributes: {exclude: ['createdAt', 'updatedAt', 'deletedAt']},
    });
    if(!found) return next(new AppError(`Пользователь с ${email ? email : (ogrn ? ogrn: phone)} не найден`, 400));
    return res.status(200).json({
        status: 'success',
        data: found
    });
});

/**
 * Метод возвращает список администраторов
 * @param {number} req.query.cityId - id города
 * @desc Get admins
 * @route GET/api/v1/admins
 * @access Private
 **/
const getAdmins = catchAsyncErrorHandler(async (req, res, next) => {
    const {cityId} = req.query;
    const admins = await user.findAll({
        where: {
            role: 'ADMIN',
            cityId: +cityId
        },
        attributes: {exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt']},
    });
    if(!admins) return next(new AppError('Failed to get all admins', 400));
    return res.status(200).json({
        status: 'success',
        data: admins
    });
});

module.exports = {getUsers, updateUser,
    getAdmins, getUserById, getUserByEmailOrOGRN};