import dimension from '../db/models/dimension.js';
import catchAsyncErrorHandler from '../utils/catchAsync.js';
import AppError from "../utils/appError.js";
import {removeCreatedFields} from "./authController.js";

export const getDimensions = catchAsyncErrorHandler(async (req, res, next) => {
    const dimensions = await dimension.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt', 'deletedAt']},
    });
    if(!dimensions) return next(new AppError('Failed to get dimensions', 400));
    return res.status(200).json({
        status: 'success',
        data: dimensions
    });
});
export const createDimension = catchAsyncErrorHandler(async(req, res, next)=>{
    const newDimension = await dimension.create({
        fullName: req.body.fullName,
        shortName: req.body.shortName || null
    });
    if(!newDimension) return next(new AppError('Failed to create the new dimension', 400));
    const result = removeCreatedFields(newDimension);

    return res.status(201).json({
        status: 'success',
        data: result
    })
});
