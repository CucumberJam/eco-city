const catchAsyncErrorHandler = require("../utils/catchAsync");
const role = require("../db/models/role");
const AppError = require("../utils/appError");
const {removeCreatedFields} = require("./authController");
const {Op} = require("sequelize");

const getRoles = catchAsyncErrorHandler(async (req, res, next) => {
    const roles = await role.findAll({
        where: { name: { [Op.not]: 'ADMIN' }
        },
        attributes: {exclude: ['createdAt', 'updatedAt', 'deletedAt']},
    });
    if(!roles) return next(new AppError('Failed to get roles', 400));
    return res.status(200).json({
        status: 'success',
        data: roles
    });
});
const createRole = catchAsyncErrorHandler(async(req, res, next)=>{
    const { name, label } = req.body;
    const newRole = await role.create({name, label});
    if(!newRole) return next(new AppError('Failed to create the role', 400));
    const result = removeCreatedFields(newRole);

    return res.status(201).json({
        status: 'success',
        data: result
    })
});
module.exports = {getRoles, createRole};