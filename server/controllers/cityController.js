import catchAsyncErrorHandler from "../utils/catchAsync.js";
import city from "../db/models/city.js";
import AppError from "../utils/appError.js";
import {removeCreatedFields} from "./authController.js";

export const getCities = catchAsyncErrorHandler(async (req, res, next) => {
    const cities = await city.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt', 'deletedAt']},
    });
    if(!cities) return next(new AppError('Failed to get cities', 400));
    return res.status(200).json({
        status: 'success',
        data: cities
    });
});
export const createCity = catchAsyncErrorHandler(async(req, res, next)=>{
    const { name, region, engName, engRegion, latitude, longitude } = req.body;
    const newCity = await city.create({name, region, engName, engRegion, latitude, longitude});
    if(!newCity) return next(new AppError('Failed to create the city', 400));
    const result = removeCreatedFields(newCity);

    return res.status(201).json({
        status: 'success',
        data: result
    })
});