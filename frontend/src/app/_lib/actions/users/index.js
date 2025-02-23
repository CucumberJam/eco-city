"use server";
import {apiServerRoutes} from "@/routes";
import {getPublicPostOptions, requestWrap} from "@/app/_lib/helpers";

/**
 * Метод возвращает коллекцию авторизованных пользователей с учетом параметров
 * @param {object} params - объект параметров, по которым фильтруются пользователи
 **/
export async function getUsersByParams(params){
    const searchParams = new URLSearchParams(params);
    return  await requestWrap({route:
            `${process?.env?.SERVER_URL}${apiServerRoutes.users}?${searchParams.toString()}`
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