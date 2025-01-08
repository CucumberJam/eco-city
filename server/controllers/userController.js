const catchAsyncErrorHandler = require("../utils/catchAsync");
const user = require("../db/models/user");
const {Op} = require("sequelize");
const AppError = require("../utils/appError");

function queryMaker(queryObject, notAdmin = true){
    const obj = {};
    const nums = ['id', 'ogrn', 'cityId', 'phone'];
    const wastes = ['wastes', 'wasteTypes'];

    //foo=bar&foo=qux => { wastes: [ 'стекло', 'пластик' ] }
    // foo=bar  => { wastes: 'стекло' }
    for(const key in queryObject){
        if(nums.includes(key)){
            obj[key] = Number(queryObject[key]);
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
    const users = await user.findAll({
        where: queryMaker(req.query),
        attributes: {exclude: ['createdAt', 'updatedAt', 'deletedAt']},
    });
    if(!users) return next(new AppError('Failed to get all users', 400));
    return res.status(200).json({
        status: 'success',
        data: users
    });
});
const getReceivers = catchAsyncErrorHandler(async (req, res, next) => {
    const receivers = await user.findAll({
        where:{
            role: 'RECEIVER',
            ...queryMaker(req.query),
        },
        attributes: {exclude: ['createdAt', 'updatedAt', 'deletedAt']},
    });
    if(!receivers) return next(new AppError('Failed to get receivers', 400));
    return res.status(200).json({
        status: 'success',
        data: receivers
    });
});
const getProviders = catchAsyncErrorHandler(async (req, res, next) => {
    const providers = await user.findAll({
        where:{
            role: 'PROVIDER',
            ...queryMaker(req.query),
        },
        attributes: {exclude: ['createdAt', 'updatedAt', 'deletedAt']},
    });
    if(!providers) next(new AppError('Failed to get providers by city', 400));
    return res.status(200).json({
        status: 'success',
        data: providers
    });
});
const getProducers = catchAsyncErrorHandler(async (req, res, next) => {
    const producers = await user.findAll({
        where:{
            role: 'PRODUCER',
            ...queryMaker(req.query),
        },
        attributes: {exclude: ['createdAt', 'updatedAt', 'deletedAt']},
    });
    if(!producers) next(new AppError('Failed to get producers by city', 400));
    return res.status(200).json({
        status: 'success',
        data: producers
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
    getReceivers, getProviders, getProducers,
    getAllAdmins};