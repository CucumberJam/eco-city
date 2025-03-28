import catchAsyncErrorHandler from "../utils/catchAsync.js";
import message from "../db/models/message.js";
import dialog from "../db/models/dialog.js";
import user from "../db/models/user.js";
import AppError from "../utils/appError.js";
import {Op} from "sequelize";
import {removeCreatedFields} from "./authController.js";
export const getMessages = catchAsyncErrorHandler(async (req, res, next) => {
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
        data: { count: messages.count, rows: messages.rows.reverse() }
    });
});
export const postMessage = catchAsyncErrorHandler(async (req, res, next)=>{
    const userId = +req?.user?.id;
    const { dialogId, text, toUserId } = req.body;
    const newMessage = await message.create({
        dialogId: +dialogId, text, userId, toUserId: +toUserId
    });
    if(!newMessage) return next(new AppError('Failed to create new message', 400));

    const updatedDialog = await dialog.update({
        isRead: false
    }, {
        where: {
            id: dialogId
        }
    });
    if(!updatedDialog) return next(new AppError('Ошибка при обновлении статуса диалога на "Непрочитанный"', 400));

    const result = removeCreatedFields(newMessage, null, false);
    return res.status(200).json({
        status: 'success',
        data: result
    });
});
export const updateMessage = catchAsyncErrorHandler(async (req, res, next)=>{
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