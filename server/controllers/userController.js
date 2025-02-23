const catchAsyncErrorHandler = require("../utils/catchAsync");
const user = require("../db/models/user");
const {Op} = require("sequelize");
const AppError = require("../utils/appError");

/**
 * Метод возвращает список авторизованных пользователей
 * с учетом пагинации
 * @param {number} req.query.userId - авторизованного пользователя (не обязателен)
 * @param {number} req.query.cityId - id города (не обязателен)
 * @param {string} query - запрос поисковой строки (не обязателен)
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
    if(!users) return next(new AppError('Failed to get all users', 400));
    return res.status(200).json({
        status: 'success',
        data: users
    });
});

/**
 * Метод возвращает авторизованного пользователя по id
 * @param {number} req.params.id - id пользователя
 * @desc Get participant by id
 * @route GET/api/v1/users/:id
 * @access Public
 **/
const getUserById = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.params?.id
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

module.exports = {getUsers,
    getAdmins, getUserById, getUserByEmailOrOGRN};