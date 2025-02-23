"use server";
import {apiServerRoutes} from "@/routes";
import {requestWrap} from "@/app/_lib/helpers";

/**
 * Метод возвращает коллекцию авторизованных пользователей с учетом параметров
 * @param {object} params - объект параметров, по которым фильтруются пользователи
 * @param {number} params.userId - авторизованного пользователя (не обязателен)
 * @param {number} params.cityId - id города (не обязателен)
 * @param {string} params.query - запрос поисковой строки (не обязателен)
 * @param {[number]} params.wastes - id видов отходов (не обязателен)
 * @param {[number]} params.wasteTypes - id подвидов отходов (не обязателен)
 * @param {[string]} params.roles - имена ролей пользователей (не обязателен)
 * @param {number} params.offset - количество строк в БД для отступа
 * @param {number} params.limit - количество строк в БД для получения
 **/
export async function getUsersByParams(params){
    const searchParams = new URLSearchParams(params);
    return  await requestWrap({
        cache: 'no-store',
        route: `${process?.env?.SERVER_URL}${apiServerRoutes.users}?${searchParams.toString()}`
    });
}

/**
 * Метод возвращает авторизованного пользователя по его email, ОГРН или телефону
 * @param {object} params - объект параметров
 * @param {string} params.email - email пользователя
 * @param {number} params.ogrn - ОГРН пользователя
 * @param {number} params.phone - телефон пользователя
 **/
export async function getUserByEmailPhoneOGRN(params){
    const {email, ogrn, phone} = params;
    if(!email && !ogrn && !phone) return {success: false, message: 'Не представлено email, ОГРН или телефон'}
    const searchParams = new URLSearchParams(params);
    return  await requestWrap({route:
            `${process?.env?.SERVER_URL}${apiServerRoutes.users}user/?${searchParams.toString()}`
    });
}