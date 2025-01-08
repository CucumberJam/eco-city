const catchAsyncErrorHandler = require("../utils/catchAsync");
const dialog = require("../db/models/dialog");
const AppError = require("../utils/appError");
const {Op} = require("sequelize");
const {removeCreatedFields} = require("./authController");
const user = require("../db/models/user");

const getDialogs = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.user?.id;

    const dialogs = await dialog.findAll({
        where: {
            [Op.or]: [{ firstUserId: userId }, { secondUserId: userId }],
        },
        include: user,
        attributes: {exclude: ['updatedAt', 'deletedAt']},
    });
    if(!dialogs) return next(new AppError('Failed to get all dialogs', 400));
    return res.status(200).json({
        status: 'success',
        data: dialogs
    });
});
const createDialog = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.user?.id;
    const { secondUserId } = req.body;
    const newDialog = await dialog.create({
        firstUserId: userId,
        secondUserId
    });
    if(!newDialog) return next(new AppError('Failed to create new dialog', 400));
    const result = removeCreatedFields(newDialog);
    return res.status(200).json({
        status: 'success',
        data: result
    });
});

module.exports = {getDialogs, createDialog}