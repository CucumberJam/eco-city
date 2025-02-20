const catchAsyncErrorHandler = require("../utils/catchAsync");
const user = require("../db/models/user");
const {Op} = require("sequelize");
const AppError = require("../utils/appError");

function queryMaker(queryObject, notAdmin = true){
    const obj = {};
    const nums = ['id', 'ogrn', 'cityId', 'phone'];
    const wastes = ['wastes', 'wasteTypes', 'role'];
    const str = ['email']

    //foo=bar&foo=qux => { wastes: [ 'стекло', 'пластик' ] }
    // foo=bar  => { wastes: 'стекло' }
    for(const key in queryObject){
        if(nums.includes(key)){
            obj[key] = Number(queryObject[key]);
        }else if(str.includes(key)){
            obj[key] = queryObject[key];
        }else if(wastes.includes(key)){
            // https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#postgres-only-range-operators
            obj[key] = Array.isArray(queryObject[key]) ?
                {[Op.contains]: queryObject[key]} : queryObject[key];
        } else obj[key] = queryObject[key];
    }
    if(notAdmin){
        obj.role = {[Op.not]: 'ADMIN'}
    }
    return obj;
}

const getAllUsers = catchAsyncErrorHandler(async (req, res, next) => {
    const users = await user.findAndCountAll({
        where: queryMaker(req.query),
        attributes: {exclude: ['createdAt', 'updatedAt', 'deletedAt']},
        order: [
            ['updatedAt', 'DESC'],
        ],
        offset: req.query?.offset || 0,
        limit: req.query?.limit || 10,
    });
    if(!users) return next(new AppError('Failed to get all users', 400));
    return res.status(200).json({
        status: 'success',
        data: users
    });
});
const getUserById = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.params?.id
    const found = await user.findByPk(userId);
    if(!found) return next(new AppError('Failed to get user', 400));
    return res.status(200).json({
        status: 'success',
        data: found
    });
});
const getUserByEmailOrOGRN = catchAsyncErrorHandler(async (req, res, next) => {
    const email = req.body?.email;
    const ogrn = req.body?.ogrn;
    const phone = req.body?.phone;
    let options = {};
    if(email) options.email = email;
    if(ogrn) options.ogrn = ogrn;
    if(phone) options.phone = phone;

    const found = await user.findOne({
        where: options,
        attributes: {exclude: ['createdAt', 'updatedAt', 'deletedAt']},
    });
    if(!found) return next(new AppError(`Failed to get user by ${email ? email : (ogrn ? ogrn: phone)}`, 400));
    /*if(password !== found.password){
        return next(new AppError('Incorrect email or password', 400));
    }*/
    return res.status(200).json({
        status: 'success',
        data: found
    });
});

const getUsersByReceiver = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.user?.id;
    const {cityId, wastes, wasteTypes, offset, limit} = req.query;
    if(!wastes) return next(new AppError('Ошибка получения участников для Приемщика (отсутствуют виды отходов)', 400));

    const options = {
        userId: {
            [Op.ne]: userId
        },
        cityId: +cityId || +req?.user?.cityId,
        wastes: {
            [Op.contains]: wastes.split(',').map(el => +el)
        },
    };
    if(wasteTypes){
        options.wasteTypes = {
            [Op.contains]: wasteTypes.split(',').map(el => +el)
        }
    }
    const partners = await user.findAndCountAll({
        where: options,
        attributes: {exclude: ['password', 'confirmPassword', 'createdAt', 'updatedAt', 'deletedAt']},
        offset: offset || 0,
        limit: limit || 10,
        order: [
            ['updatedAt', 'DESC'],
        ],
    });
    if(!partners) return next(new AppError('Ошибка получения участников для Приемщика', 400));
    return res.status(200).json({
        status: 'success',
        data: partners // {count, rows}
    });
});
const getUsersByRecycler = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.user?.id;
    const {cityId, wastes, wasteTypes, offset, limit} = req.query;
    if(!wastes) return next(new AppError('Ошибка получения участников для Переработчика (отсутствуют виды отходов)', 400));
    const options = {
        userId: {
            [Op.ne]: userId
        },
        role: {
            [Op.eq]: ['PRODUCER', 'RECEIVER']
        },
        cityId: +cityId || +req?.user?.cityId,
        wastes: {
            [Op.contains]: wastes.split(',').map(el => +el)
        },
    };
    if(wasteTypes){
        options.wasteTypes = {
            [Op.contains]: wasteTypes.split(',').map(el => +el)
        }
    }

    const partners = await user.findAndCountAll({
        where: options,
        attributes: {exclude: ['password', 'confirmPassword', 'createdAt', 'updatedAt', 'deletedAt']},
        offset: offset || 0,
        limit: limit || 10,
        order: [
            ['updatedAt', 'DESC'],
        ],
    });
    if(!partners) next(new AppError('Ошибка получения участников для Переработчика', 400));
    return res.status(200).json({
        status: 'success',
        data: partners
    });
});
const getUsersByProducer = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.user?.id;
    const {cityId, wastes, wasteTypes, offset, limit} = req.query;
    if(!wastes) return next(new AppError('Ошибка получения участников для Производителя (отсутствуют виды отходов)', 400));
    const options = {
        userId: {
            [Op.ne]: userId
        },
        role: {
            [Op.eq]: ['RECYCLER', 'RECEIVER']
        },
        cityId: +cityId || +req?.user?.cityId,
        wastes: {
            [Op.contains]: wastes.split(',').map(el => +el)
        },
    };
    if(wasteTypes){
        options.wasteTypes = {
            [Op.contains]: wasteTypes.split(',').map(el => +el)
        }
    }

    const partners = await user.findAndCountAll({
        where: options,
        attributes: {exclude: ['password', 'confirmPassword', 'createdAt', 'updatedAt', 'deletedAt']},
        offset: offset || 0,
        limit: limit || 10,
        order: [
            ['updatedAt', 'DESC'],
        ],
    });
    if(!partners) next(new AppError('Ошибка получения участников для Производителя', 400));
    return res.status(200).json({
        status: 'success',
        data: partners
    });
});

const getAllAdmins = catchAsyncErrorHandler(async (req, res, next) => {
    //checkAdmin(req?.user?.role, next);

    const admins = await user.findAll({
        where: {
            role: 'ADMIN',
            ...queryMaker(req.query, false),
        },
        attributes: {exclude: ['createdAt', 'updatedAt', 'deletedAt']},
    });
    if(!admins) return next(new AppError('Failed to get all admins', 400));
    return res.status(200).json({
        status: 'success',
        data: admins
    });
});

module.exports = {getAllUsers,
    getUsersByReceiver, getUsersByRecycler, getUsersByProducer,
    getAllAdmins, getUserById, getUserByEmailOrOGRN};