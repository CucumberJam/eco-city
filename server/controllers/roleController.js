import catchAsyncErrorHandler from "../utils/catchAsync.js";
import role from "../db/models/role.js";
import AppError from "../utils/appError.js";
import {removeCreatedFields} from "./authController.js";
import {Op} from "sequelize";

export const getRoles = catchAsyncErrorHandler(async (req, res, next) => {
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
export const createRole = catchAsyncErrorHandler(async(req, res, next)=>{
    const { name, label } = req.body;
    const newRole = await role.create({name, label});
    if(!newRole) return next(new AppError('Failed to create the role', 400));
    const result = removeCreatedFields(newRole);

    return res.status(201).json({
        status: 'success',
        data: result
    })
});