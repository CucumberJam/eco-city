"use server";
import {getRequestOptions, getUserId, requestWrap} from "@/app/_lib/helpers";
import {apiServerRoutes} from "@/routes";

/**
 * Метод возвращает список откликов пользователя с учетом пагинации
 * @param {number} offset - количество строк в коллекции БД для пропуска
 * @param {number} limit - максимальное количество строк в коллекции БД для получения
 **/
export async function getResponsesOfUser(offset = 0, limit = 10){
    const userId = await getUserId();
    const options = await getRequestOptions();
    const searchParams = new URLSearchParams({offset, limit});
    return  await requestWrap({
        options,
        route: `${process?.env?.SERVER_URL}${apiServerRoutes.responses}${userId}?${searchParams.toString()}`
    });
}

/**
 * Метод возвращает список откликов других участников с учетом пагинации
 * @param {number} offset - количество строк в коллекции БД для пропуска
 * @param {number} limit - максимальное количество строк в коллекции БД для получения
 * @param {null} adverts - коллекция публикаций пользователя
 **/
export async function getOtherResponses(offset = 0, limit = 10, adverts = null){
    const options = await getRequestOptions();
    const paramsObj = {offset: offset, limit: limit};
    if(adverts) paramsObj.adverts = adverts;
    const searchParams = new URLSearchParams(paramsObj);
    return  await requestWrap({
        options,
        route: `${process?.env?.SERVER_URL}${apiServerRoutes.responses}?${searchParams.toString()}`
    });
}

/**
 * Метод возвращает отклик по его id
 * @param {number} responseId - id отклика
 **/
export async function getResponseById(responseId){
    if(!responseId) return {success: false, message: 'id отклика не представлено'};
    const options = await getRequestOptions();
    return  await requestWrap({
        options,
        route: `${process?.env?.SERVER_URL}${apiServerRoutes.responses}response/${responseId}`
    });
}

/**
 * Метод изменяет отклик по id публикации, на которую он был дан
 * @param {number} advertId - id публикации
 * @param {number} responseId - id отклика
 * @param {string} status - статус отклика
 **/
export async function updateResponseByAdvertId(advertId, responseId, status){
    if(!responseId) return {success: false, message: 'id отклика не представлено'};
    if(!advertId) return {success: false, message: 'id публикации отклика не представлено'};
    if(!status) return {success: false, message: 'статуса отклика не представлено'};
    const options = await getRequestOptions(null, 'PUT');
    const searchParams = new URLSearchParams({id: responseId, status});
    return  await requestWrap({
        options,
        route: `${process?.env?.SERVER_URL}${apiServerRoutes.responses}${advertId}?${searchParams.toString()}`
    });
}

/**
 * Метод удаляет отклик по его id
 * @param {number} responseId - id отклика
 **/
export async function removeResponse(responseId){
    if(!responseId) return {success: false, message: 'Параметр id отклика не был передан'};
    const options = await getRequestOptions(null, 'DELETE');
    return  await requestWrap({
        options,
        route: `${process?.env?.SERVER_URL}${apiServerRoutes.responses}${responseId}`
    });
}

/**
 * Метод возвращает коллекцию откликов по id публикации с учетом пагинации
 * @param {number} offset - количество строк в коллекции БД для пропуска
 * @param {number} limit - максимальное количество строк в коллекции БД для получения
 * @param {object} additionalObj - дополнительные параметры
 **/
export async function getResponsesByAdvertId(offset = 0, limit = 10, additionalObj){
    const {advertId} = additionalObj;
    if(!advertId) return {success: false, message: 'Параметр id публикации не был передан'};
    const options = await getRequestOptions();
    const paramsObj = {offset: offset, limit: limit};
    const searchParams = new URLSearchParams(paramsObj);
    return  await requestWrap({
        options,
        route: `${process?.env?.SERVER_URL}${apiServerRoutes.responses}advert/${advertId}?${searchParams.toString()}`
    });
}

/**
 * Метод создает новый отклик
 * @param {object} formData - объект данных
 * @param {number} formData.advertId - id публикации
 * @param {number} formData.price - цена
 * @param {number} formData.totalPrice - стоимость
 * @param {string} formData.comment - комментарий
 **/
export async function createResponse(formData){
    const options = await getRequestOptions(null, 'POST');
    options.body = JSON.stringify({formData});
    return  await requestWrap({
        options,
        route: `${process?.env?.SERVER_URL}${apiServerRoutes.responses}`
    });
}