const user = require('../db/models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const catchAsyncErrorHandler = require('../utils/catchAsync');
const AppError = require("../utils/appError");
const generateToken = (payload)=>{
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })
}

const signup = catchAsyncErrorHandler(async(req, res, next)=> {
    const body = req.body;
    const newUser = await user.create({
        name: body.name,
        website: body.website || null,
        ogrn: +body.ogrn,
        role: body.role,
        cityId: +body.cityId || 2,
        wastes: body.wastes,
        wasteTypes: body.wasteTypes,
        address: body.address,
        latitude: body.latitude || null,
        longitude: body.longitude || null,
        workingHourStart: body.workingHourStart || null,
        workingHourEnd: body.workingHourEnd || null,
        workingDays: body.workingDays || null,
        phone: +body.phone,
        email: body.email,
        password: body.password,
        confirmPassword: body.confirmPassword,
    });
    if(!newUser) return next(new AppError('Failed to create a new user', 400));

    const result = removeCreatedFields(newUser, ['password']);
    result.token = generateToken({
        id: result.id
    });
    return res.status(201).json({
        status: 'success',
        data: result
    });
});
const login = catchAsyncErrorHandler(async(req, res, next)=>{
    const {email, password} = req.body;
    if(!email || !password) return next(new AppError('Please provide email and password', 400));
    const result = await user.findOne({
        where: {email},
        attributes: {exclude: ['createdAt', 'updatedAt', 'deletedAt']},
    });
    if(!result || !(await bcrypt.compare(password, result.password))){
        return next(new AppError('Incorrect email or password', 400));
    }
    const token = generateToken({
        id: result.id,
    })
    return res.status(400).json({
        status: 'success',
        token,
        data: result
    });
});
const authentication = catchAsyncErrorHandler(async(req, res, next)=>{
    // 1. get token from headers:
    let idToken = '';
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        idToken = req.headers.authorization.split(' ')[1];
    }
    if(!idToken) return next(new AppError('Please login to get access', 401));

    // 2. token verification:
    const tokenDetails = await jwt.verify(idToken, process.env.JWT_SECRET_KEY);
    /*function(err){
        if (err.name === 'TokenExpiredError') {
            return next(new AppError(err.message, 400));
        }
    }*/
    // 3. get the user details from db and add to req object
    const freshUser = await user.findByPk(tokenDetails.id);
    if(!freshUser) return next(new AppError('User no longer exists', 400));
    req.user = freshUser.dataValues;
    return next();
})
const restrictTo = (...userRole) => {
    return (req, res, next) => {
        if (!userRole.includes(req.user.role)) {
            return next(new AppError("You don't have permission to perform this action", 403));
        }
        return next();
    };
}
function checkAdmin(role, next){
    if(!['ADMIN'].includes(role)) return next(new AppError('Invalid user type', 400));
}
function removeCreatedFields(newObj, fieldsToDelete = null, withCreatedAt = true){
    const result = newObj.toJSON();
    delete result.deletedAt;
    delete result.updatedAt;
    if(withCreatedAt) delete result.createdAt;
    if(fieldsToDelete){
        for(const fieldName of fieldsToDelete){
            delete result[fieldName];
        }
    }
    return result;
}
module.exports = {signup, login, authentication, restrictTo, checkAdmin, removeCreatedFields};