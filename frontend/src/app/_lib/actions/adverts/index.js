"use server";
import {getRequestOptions, getUserId, requestWrap} from "@/app/_lib/helpers";
import {apiServerRoutes} from "@/routes";

const otherAdvertsDefaultParams = {
    wastes: [],
    wasteTypes: [],
    cityId: 0,
    offset: 0,
    limit: 10,
}

/**
 * Метод возвращает список публикаций пользователя с учетом пагинации
 * @param {object} params - параметры для фильтров
 * @param {number} offset - количество строк в коллекции БД для пропуска
 * @param {number} limit - максимальное количество строк в коллекции БД для получения
 **/
export async function getAdvertsOfUser(offset = 0, limit = 10, params = null){
    const userId = await getUserId();
    const options = await getRequestOptions();
    let paramsObj = {offset: offset, limit: limit};
    paramsObj = {...paramsObj, ...params}
    const searchParams = new URLSearchParams(paramsObj);
    return  await requestWrap({
        options,
        route: `${process?.env?.SERVER_URL}${apiServerRoutes.adverts}${userId}?${searchParams.toString()}`
    });
}

/**
 * Метод возвращает список публикаций других участников
 * @param {[number]} params.wastes - коллекция id отходов
 * @param {[number]} params.wasteTypes - коллекция id отходов
 * @param {number} params.cityId - id города
 * @param {number} params.offset - количество строк в коллекции БД для пропуска
 * @param {number} params.limit - максимальное количество строк в коллекции БД для получения
 **/
export async function getAdverts(params = otherAdvertsDefaultParams){ //params = {wastes, wasteTypes, cityId}
    const options = await getRequestOptions();
    const searchParams = new URLSearchParams(params);
    return  await requestWrap({
        options,
        route: `${process?.env?.SERVER_URL}${apiServerRoutes.adverts}?${searchParams.toString()}`
    });
}

/**
 * Метод удаляет публикацию по её id
 * @param {number} advertId - id публикации
 **/
export async function removeAdvertById(advertId){
    if(!advertId) return {success: false, message: 'Параметр id публикации не был передан'};
    const options = await getRequestOptions(null, 'DELETE');
    return  await requestWrap({
        options,
        route: `${process?.env?.SERVER_URL}${apiServerRoutes.adverts}${advertId}`
    });
}

/**
 * Метод возвращает публикацию по её id
 * @param {number} advertId - id публикации
 **/
export async function getAdvertById(advertId){
    if(!advertId) return {success: false, message: 'Параметр id публикации не был передан'};
    const options = await getRequestOptions(null, 'GET');
    return  await requestWrap({
        options,
        route: `${process?.env?.SERVER_URL}${apiServerRoutes.adverts}advert/${advertId}`
    });
}

/**
 * Метод создает новую публикацию
 * @param {number} formData.latitude - ширина местоположения
 * @param {number} formData.longitude - долгота местоположения
 * @param {number} formData.cityId - id города
 * @param {boolean} formData.isPickedUp - самовывоз
 * @param {boolean} formData.priceWithDelivery - цена с доставкой
 * @param {number} formData.amount - количество
 * @param {number} formData.price - цена
 * @param {number} formData.totalPrice - стоимость
 * @param {number} formData.dimension - id измерения
 * @param {number} formData.waste - id отхода
 * @param {number} formData.wasteType - id вида отходов
 * @param {Date} formData.finishDate - дата окончания подачи заявок
 * @param {string} formData.comment - комментарий
 * @param {[string]} formData.photos - коллекция адресов картинок
 *
 **/
export async function createAdvert(formData){
    if(!formData) return {success: false, message: 'Данные формы для создания публикации не были переданы'};
    const options = await getRequestOptions(null, 'POST');
    options.body = JSON.stringify({formData});
    return  await requestWrap({
        options,
        route: `${process?.env?.SERVER_URL}${apiServerRoutes.adverts}`
    });
}

/**
 * Метод изменяет публикацию
 * @param {object} formData - объект с данными
 * @param {number} formData.latitude - ширина местоположения
 * @param {number} formData.longitude - долгота местоположения
 * @param {number} formData.cityId - id города
 * @param {boolean} formData.isPickedUp - самовывоз
 * @param {boolean} formData.priceWithDelivery - цена с доставкой
 * @param {number} formData.amount - количество
 * @param {number} formData.price - цена
 * @param {number} formData.totalPrice - стоимость
 * @param {number} formData.dimension - id измерения
 * @param {number} formData.waste - id отхода
 * @param {number} formData.wasteType - id вида отходов
 * @param {Date} formData.finishDate - дата окончания подачи заявок
 * @param {string} formData.comment - комментарий
 * @param {[string]} formData.photos - коллекция адресов картинок
 * @param {number} advertId - id публикации
 **/
export async function updateAdvert(formData, advertId){
    if(!formData) return {success: false, message: 'Данные формы для создания публикации не были переданы'};
    if(!advertId) return {success: false, message: 'Параметр id публикации не был передан'};
    const options = await getRequestOptions(null, 'PATCH');
    options.body = JSON.stringify(formData);
    return  await requestWrap({
        options,
        route: `${process?.env?.SERVER_URL}${apiServerRoutes.adverts}${advertId}`
    });
}