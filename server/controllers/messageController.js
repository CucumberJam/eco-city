const catchAsyncErrorHandler = require("../utils/catchAsync");
const message = require("../db/models/message");
const dialog = require("../db/models/dialog");
const user = require("../db/models/user");
const AppError = require("../utils/appError");
const {Op} = require("sequelize");
const {removeCreatedFields} = require("./authController");

const getMessages = catchAsyncErrorHandler(async (req, res, next) => {
    const userId = +req?.user?.id;
    const dialogId = +req?.params.dialogId;

    const messages = await message.findAndCountAll({
        where: {
            dialogId,
            [Op.or]: [{ userId: userId }, { toUserId: userId }],
        },
        include: user,
        attributes: {exclude: ['deletedAt']},
        offset: req.query?.offset || 0,
        limit: req.query?.limit || 10,
        order: [
            ['createdAt', 'DESC'],
        ],
    });

    if(!messages) return next(new AppError('Failed to get all dialogs', 400));
    return res.status(200).json({
        status: 'success',
        data: messages //{ count, rows }
    });
});
const postMessage = catchAsyncErrorHandler(async (req, res, next)=>{
    const userId = +req?.user?.id;
    const { dialogId, text, toUserId } = req.body;
    const newMessage = await message.create({
        dialogId: +dialogId, text, userId, toUserId: +toUserId
    });
    if(!newMessage) return next(new AppError('Failed to create new message', 400));
    console.log(newMessage);
    const result = removeCreatedFields(newMessage, null, false);

    // we need to update dialog - set isRead = false:
    //const updatedDialog = await dialog.update({isRead: false}, {where: {dialogId}});
    //if(!updatedDialog) return next(new AppError('Failed to update dialog bc of new message', 400));

    return res.status(200).json({
        status: 'success',
        data: result
    });
});
const updateMessage = catchAsyncErrorHandler(async (req, res, next)=>{
    const userId = +req?.user?.id;
    const messageId = +req?.params?.messageId;
    const needsSetToRead = req.body?.isRead || false;
    let updatedMessage;
    if(needsSetToRead){ // update interlocutor's message - isRead = true, and dialog isRead = true
        updatedMessage = await message.update({isRead: true}, {
            where: {
                id: messageId,
                toUserId: userId,
            },
        });
    }else{ // update user's message (text)
        updatedMessage = await message.update({text: req.body?.text}, {
            where: {
                id: messageId,
                userId: userId,
            },
        });
    }
    if(!updatedMessage) return next(new AppError('Failed to update message', 400));
    if(needsSetToRead){
        const updatedDialog = await dialog.update({isRead: true}, {
            where: {
                dialogId: +req.body?.dialogId
            }
        });
        if(!updatedDialog) return next(new AppError('Failed to update dialog of message (set to isRead)', 400));
    }
    return res.status(204).json({
        status: 'success',
        data: updatedMessage
    });
});

module.exports = {getMessages, postMessage, updateMessage}