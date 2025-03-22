const AppError = require("../utils/appError");
const sendErrorDev = (err, res)=> {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    const message  = err.message;
    const stack = err.stack;

    return res.status(statusCode).json({
        status, message, stack,
    })
}
const sendErrorProd = (err, res)=> {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    const message  = err.message;

    if(err.isOperational){
        return res.status(statusCode).json({
            status, message,
        })
    }
    return res.status(500).json({
        status: 'error',
        message: 'Smth went wrong'
    })
}
const globalErrorHandler = (err, req, res, next) => {
    if(err.name === 'SequelizeDatabaseError'){
        err = new AppError(err.parent, 400);
    }
    if(err.name === 'JsonWebTokenError'){
        err = new AppError('Invalid token', 401);
    }
    if(err.name === 'SequelizeValidationError'){
        err = new AppError(err.parent, 400);
    }
    if(err.name === 'SequelizeUniqueConstraintError'){
        err = new AppError(err.parent, 400);
    }
    if(process.env.NODE_ENV === 'development'){
        return sendErrorDev(err, res);
    }
    sendErrorProd(err, res);
}
module.exports = globalErrorHandler;