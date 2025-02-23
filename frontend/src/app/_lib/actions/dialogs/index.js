'use server';
import {apiServerRoutes} from "@/routes";
import {getRequestOptions, requestWrap} from "@/app/_lib/helpers";

/**
 * Метод возвращает коллекцию диалогов пользователя
 **/
export async function getUserDialogs(){
    const options = await getRequestOptions();
    return  await requestWrap({
        options,
        route: `${process?.env?.SERVER_URL}${apiServerRoutes.dialogs}`
    });
}

/**
 * Метод возвращает диалог по его id
 * @param {number} dialogId - id диалога
 **/
export async function getDialogById(dialogId){
    if(!dialogId) return {success: false, message: 'id диалога не представлено'};
    const options = await getRequestOptions();
    return  await requestWrap({
        options,
        route: `${process?.env?.SERVER_URL}${apiServerRoutes.dialogs}${dialogId}`
    });
}

/**
 * Метод помечает диалог прочитанным по его id
 * @param {number} dialogId - id диалога
 **/
export async function makeDialogRead(dialogId){
    if(!dialogId) return {success: false, message: 'id диалога не представлено'};
    const options = await getRequestOptions(null, 'POST');
    return  await requestWrap({
        options,
        route: `${process?.env?.SERVER_URL}${apiServerRoutes.dialogs}${dialogId}`
    });
}

/**
 * Метод создает новый диалог
 * @param {number} secondUserId - id собеседника
 **/
export async function createDialog(secondUserId){
    if(!secondUserId) return {success: false, message: 'id собеседника не представлено'};
    const options = await getRequestOptions(null, 'POST');
    options.body = JSON.stringify({secondUserId: +secondUserId});
    return  await requestWrap({
        options,
        route: `${process?.env?.SERVER_URL}${apiServerRoutes.dialogs}`
    });
}
