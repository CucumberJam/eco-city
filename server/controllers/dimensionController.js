const dimension = require('../db/models/dimension');
const catchAsyncErrorHandler = require('../utils/catchAsync');
const AppError = require("../utils/appError");
const {removeCreatedFields} = require("./authController");

const getDimensions = catchAsyncErrorHandler(async (req, res, next) => {
    const dimensions = await dimension.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt', 'deletedAt']},
    });
    if(!dimensions) return next(new AppError('Failed to get dimensions', 400));
    return res.status(200).json({
        status: 'success',
        data: dimensions
    });
});
const createDimension = catchAsyncErrorHandler(async(req, res, next)=>{
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

module.exports = {getDimensions, createDimension};