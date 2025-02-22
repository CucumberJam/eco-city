const catchAsyncErrorHandler = require("../utils/catchAsync");
const dialog = require("../db/models/dialog");
const AppError = require("../utils/appError");
const {Op} = require("sequelize");
const {removeCreatedFields} = require("./authController");
const user = require("../db/models/user");
const message = require("../db/models/message");

const getDialogs = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.user?.id;

    const dialogs = await dialog.findAll({
        where: {
            [Op.or]: [{ firstUserId: userId }, { secondUserId: userId }],
        },
        include: {
            model: user,
            attributes: {
                exclude: ['password', 'deletedAt', 'updatedAt', 'createdAt']
            },
        },
        attributes: {exclude: ['deletedAt']},
        order: [
            ['updatedAt', 'DESC'],
        ],
    });
    if(!dialogs) return next(new AppError('Ошибка при получении диалогов', 400));
    let userData;
    if(dialogs.length > 0){
        const userOfFirstDialog = dialogs?.[0].dataValues.user.dataValues
        if(+userId === +userOfFirstDialog?.id){
            const oppositeUserId = dialogs?.[0]?.dataValues?.firstUserId === userId ?
                dialogs?.[0]?.dataValues?.secondUserId : dialogs?.[0]?.dataValues?.firstUserId;

            const found = await user.findOne({
                where:{
                    id: oppositeUserId
                },
                attributes: {
                    exclude: ['password', 'deletedAt', 'updatedAt', 'createdAt']
                },
            });
            if(!found) return next(new AppError('Ошибка при получении собеседника в диалоге', 400));
            dialogs[0].dataValues.user.dataValues = found;
        }
    }
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
        attributes: {exclude: ['deletedAt']},
        include: user
    });
    if(!found) return next(new AppError(`Ошибка получения диалога №${dialogId}`, 400));
    const userOfDialog = found.dataValues.user.dataValues;
    if(+userId === +userOfDialog?.id){
        const oppositeUserId = found.dataValues?.firstUserId === userId ?
            found.dataValues?.secondUserId : found.dataValues?.firstUserId;

        const foundUser = await user.findOne({
            where:{
                id: oppositeUserId
            },
            attributes: {
                exclude: ['password', 'deletedAt', 'updatedAt', 'createdAt']
            },
        });

        if(!foundUser) return next(new AppError('Ошибка при получении собеседника в диалоге', 400));
        found.dataValues.user.dataValues = foundUser;
    }

    return res.status(200).json({
        status: 'success',
        data: found
    });
});

const updateDialogById = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.user?.id;
    const dialogId = +req?.params?.dialogId;
    //const {isRead} = req.query;
    const updatedDialog = await dialog.update({
        isRead: true
    }, {
        where: {
            id: dialogId,
            [Op.or]: [{ firstUserId: userId }, { secondUserId: userId }]
        }
    });
    if(!updatedDialog) return next(new AppError(`Ошибка при изменении статуса диалога на ${isRead ? 'прочитанный' : 'не прочитанный' }`, 400));

    const updatedMessages = await message.update({
        isRead: true
    }, {
        where: {
            dialogId,
            toUserId: userId, //messages of interlocutor
        },
    });
    return res.status(200).json({
        status: 'success',
        data: updatedDialog
    });
})

module.exports = {getDialogs, createDialog, getDialogById, updateDialogById}