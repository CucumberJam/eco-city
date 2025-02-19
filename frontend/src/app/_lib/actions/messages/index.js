'use server';
import {getRequestOptions, getUserId, requestWrap} from "@/app/_lib/helpers";
import {apiServerRoutes} from "@/routes";

/**
 * Метод возвращает коллекцию сообщений по id диалога с учетом пагинации
 * @param {number} dialogId - id диалога
 * @param {number} offset - количество строк в коллекции БД для пропуска
 * @param {number} limit - максимальное количество строк в коллекции БД для получения
 **/
export async function getMessagesByDialogId(dialogId, offset = 0, limit = 10){
    if(!dialogId) return;
    const options = await getRequestOptions();
    const searchParams = new URLSearchParams({offset, limit});
    return  await requestWrap({
        options,
        route: `${process?.env?.SERVER_URL}${apiServerRoutes.messages}${dialogId}?${searchParams.toString()}`
    });
}

/**
 * Метод создает новое сообщение
 * @param {object} dialog - объект диалога
 * @param {object} formData - объект данных
 * @param {number} formData.dialogId - id диалога
 * @param {string} formData.text - текст сообщения
 **/
export async function createMessageToDialog(dialog, formData){
    if(!dialog?.id || !dialog?.firstUserId || !dialog?.secondUserId || !formData) return {success: false, message: 'Для создания сообщения не представлено данных самого диалога'};
    const options = await getRequestOptions(null, 'POST');
    const userId = await getUserId();
    formData.toUserId = +dialog.firstUserId === +userId ? dialog.secondUserId : dialog.firstUserId;
    options.body = JSON.stringify(formData);
    return  await requestWrap({
        options,
        route: `${process?.env?.SERVER_URL}${apiServerRoutes.messages}`
    });
}