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
    if(!secondUserId) return next(new AppError('Не был передан параметр второго участника диалога', 400));

    let result;

    const existDialog = await dialog.findOne({
        where: {
            firstUserId: userId,
            secondUserId: +secondUserId
        },
        attributes: {exclude: ['createdAt', 'deletedAt']},
    });
    if(existDialog){
        return res.status(200).json({
            status: 'success',
            data: existDialog
        });
    }
    const newDialog = await dialog.create({
        firstUserId: userId,
        secondUserId
    });
    if(!newDialog) return next(new AppError('Failed to create new dialog', 400));
    result = removeCreatedFields(newDialog);
    return res.status(200).json({
        status: 'success',
        data: result
    });
});
const getDialogById = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.user?.id;
    const dialogId = +req?.params?.dialogId;
    if(!dialogId) return next(new AppError("Не представлено id диалога", 400));
    const found = await dialog.findOne({
        where: {
            id: dialogId,
            [Op.or]: [{ firstUserId: userId }, { secondUserId: userId }]
        },
        attributes: {exclude: ['deletedAt', 'updatedAt']},
        include: user
    });
    if(!found) return next(new AppError(`Ошибка получения диалога №${dialogId}`, 400));

    return res.status(200).json({
        status: 'success',
        data: found
    });
});

module.exports = {getDialogs, createDialog, getDialogById}