import catchAsyncErrorHandler from "../utils/catchAsync.js";
import waste from "../db/models/waste.js";
import wasteType from "../db/models/wasteType.js";
import AppError from "../utils/appError.js";
import {removeCreatedFields} from './authController.js';
export const getWastes = catchAsyncErrorHandler(async (req, res, next) => {
    let wastes = await waste.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt', 'deletedAt']},
    });
    if(!wastes) return next(new AppError('Failed to get wastes', 400));
    return res.status(200).json({
        status: 'success',
        data: wastes
    });
});
export const createWaste = catchAsyncErrorHandler(async(req, res, next)=>{
    const { name } = req.body;

    const newWaste = await waste.create({name});
    if(!newWaste) return next(new AppError('Failed to create the waste', 400));
    const result = removeCreatedFields(newWaste);

    return res.status(201).json({
        status: 'success',
        data: result
    })
});
export const getWasteTypesByWasteId = catchAsyncErrorHandler(async(req, res, next)=>{
    const types = await wasteType.findAll({
        where: {
            typeId: +req.params?.wasteId // get wasteId
        },
        attributes: {exclude: ['createdAt', 'updatedAt', 'deletedAt']},
    });
    if(!types) return next(new AppError('Failed to get waste types', 400));
    return res.status(200).json({
        status: 'success',
        data: types
    });
});
export const getWasteTypes = catchAsyncErrorHandler(async(req, res, next)=>{
    const types = await wasteType.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt', 'deletedAt']},
    });
    if(!types) return next(new AppError('Failed to get waste types', 400));
    return res.status(200).json({
        status: 'success',
        data: types
    });
});
export const createWasteType = catchAsyncErrorHandler(async(req, res, next)=>{
    const { name, typeId } = req.body;
    const newWasteType = await wasteType.create({name, typeId});
    if(!newWasteType) return next(new AppError('Failed to create the wasteType', 400));

    const updatedWaste = await waste.update({hasTypes: true}, {
        where: {
            id: typeId,
        }
    });
    if(!updatedWaste) return next(new AppError('Failed to update waste', 400));

    const result = removeCreatedFields(newWasteType);
    return res.status(201).json({
        status: 'success',
        data: result
    })
});