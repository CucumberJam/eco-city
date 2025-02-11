'use server';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import {authRoutes, DEFAULT_LOGIN_REDIRECT} from "@/routes";
import {FNS_URL} from "@/app/_lib/URLS";
import { redirect } from 'next/navigation'
import {revalidatePath} from "next/cache";
const getOptions = (token, method = 'GET')=>{
    return {
        method: method,
        headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    }
}
export async function signInAction(formData) {
    try {
        const res = await signIn('credentials', {
            email: formData.get('email'),
            password: formData.get('password'),
            redirect: DEFAULT_LOGIN_REDIRECT,
        });
        if(res) return {success: true, data: res};
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return {success: false, message: 'Неверные данные'};
                case 'CallbackRouteError':
                    return {success: false, message: (error.cause.err.toString() === 'Error: Error: Неверные email или пароль') ?
                    'Неверные email или пароль' : error.cause.err.toString()};
                default:
                    return {success: false, message: error.message};
            }
        }
        return {success: false, message: error.message};
    }
}
export async function createDialog(token, secondUserId){
    if(!secondUserId) return;
    try{
        const options = getOptions(token, 'POST');
        options.body = JSON.stringify({secondUserId: +secondUserId});
        const res = await fetch(`${process?.env?.SERVER_URL}api/v1/dialogs`, options);
        const data = await res.json();
        if(data.status !== 'success'){
            if(checkToken(data.message)) throw Error(data.message)
            else throw Error(data.message)
        }
        return {success: true, data: data.data};
    }catch (e) {
        console.log(e);
        return {success: false, data: e.message};
    }
}
export async function getDialogs(id, token){
    if(!id) return;
    try{
        const options = getOptions(token);
        const res = await fetch(`${process?.env?.SERVER_URL}api/v1/dialogs`, options);
        const data = await res.json();
        console.log('Response from dialogs: ', data)
        if(data.status === 'fail'){
            throw Error(data.message)
        }
        return {status: 'success', data: data.data};
    }catch (e) {
        console.log(e);
        return {status: 'error', data: e.message};
    }
}
export async function getDialogById(token, dialogId){
    if(!dialogId || !token) return;
    try{
        const options = getOptions(token);
        const res = await fetch(`${process?.env?.SERVER_URL}api/v1/dialogs/${dialogId}`, options);
        const data = await res.json();
        if(data.status !== 'success'){
            if(checkToken(data.message)) throw Error(data.message)
            else throw Error(data.message)
        }
        return {status: 'success', data: data.data};
    }catch (e) {
        console.log(e);
        return {status: 'error', message: e.message};
    }
}
export async function getAdvertsOfUser(userId, token, offset = 0, limit = 10){
    if(!userId) return;
    const paramsObj = {offset: offset, limit: limit};
    const searchParams = new URLSearchParams(paramsObj);
    try{
        const options = getOptions(token);
        const res = await fetch(`${process?.env?.SERVER_URL}api/v1/adverts/${userId}?${searchParams.toString()}`, options);
        const data = await res.json();
        if(data.status !== 'success'){
            if(checkToken(data.message)) throw Error(data.message)
            else throw Error(data.message)
        }
        return {status: 'success', data: data.data};
    }catch (e) {
        console.log(e);
        return {status: 'error', message: e.message};
    }
}
export async function getAdverts(paramsObj, token){ //params = {wastes, wasteTypes, cityId}
    try{
        const options = getOptions(token);
        const searchParams = new URLSearchParams(paramsObj);
        const res = await fetch(`${process?.env?.SERVER_URL}api/v1/adverts/?${searchParams.toString()}`, options);
        const data = await res.json();
        //console.log('Response from Adverts: ', data);
        if(data.status !== 'success'){
            if(checkToken(data.message)) throw Error(data.message)
            else throw Error(data.message)
        }
        return {status: 'success', data: data.data};
    }catch (e) {
        console.log(e);
        return {status: 'error', message: e.message};
    }
}
export async function getResponsesOfUser(userId, token, offset = 0, limit = 10){
    if(!userId) return;
    const paramsObj = {offset: offset, limit: limit};
    const searchParams = new URLSearchParams(paramsObj);
    try{
        const options = getOptions(token);
        const res = await fetch(`${process?.env?.SERVER_URL}api/v1/responses/${userId}?${searchParams.toString()}`, options);
        const data = await res.json();
        if(data.status !== 'success'){
            if(checkToken(data.message)) throw Error(data.message)
            else throw Error(data.message)
        }
        return {status: 'success', data: data.data};
    }catch (e) {
        console.log(e);
        return {status: 'error', message: e.message};
    }
}
export async function getOtherResponses(token, offset = 0, limit = 10, adverts = null){
    const paramsObj = {offset: offset, limit: limit};
    if(adverts) paramsObj.adverts = adverts;
    const searchParams = new URLSearchParams(paramsObj);
    try{
        const options = getOptions(token);
        const res = await fetch(`${process?.env?.SERVER_URL}api/v1/responses/?${searchParams.toString()}`, options);
        const data = await res.json();
        if(data.status !== 'success'){
            if(checkToken(data.message)) throw Error(data.message)
            else throw Error(data.message)
        }
        const response = {
            status: 'success', data: data.data
        }
        if(!adverts) response.advertsIds = data.advertsIds;
        return response;
    }catch (e) {
        console.log(e);
        return {status: 'error', message: e.message};
    }
}
export async function getResponseById(token, responseId){
    if(!responseId || !token) return;
    try{
        const options = getOptions(token);
        const res = await fetch(`${process?.env?.SERVER_URL}api/v1/responses/response/${responseId}`, options);
        const data = await res.json();
        if(data.status !== 'success'){
            if(checkToken(data.message)) throw Error(data.message)
            else throw Error(data.message)
        }
        return {status: 'success', data: data.data};
    }catch (e) {
        console.log(e);
        return {status: 'error', message: e.message};
    }
}
export async function updateResponseByAdvertId(token, advertId, responseId, status){
    if(!responseId || !token || !advertId || !status) return;
    try{
        const searchParams = new URLSearchParams({id: responseId, status});
        const options = getOptions(token, 'PUT');
        const res = await fetch(`${process?.env?.SERVER_URL}api/v1/responses/${advertId}?${searchParams.toString()}`, options);
        if(!res.ok || res.status === 400){
            const data = await res.json();
            return {success: false, message: data?.error.message ? data?.error.message : (status === 'Отклонено' ? 'Ошибка при отклонении отклика' : 'Ошибка при согласовании отклика')};
        }
        return {success: true};
    }catch (e) {
        console.log(e);
        return {success: false, message: e.message};
    }
}
export async function removeResponse(responseId, token){
    if(!responseId) return {success: false, message: 'Параметр id отклика не был передан'};
    try{
        const options = getOptions(token, 'DELETE');
        const res = await fetch(`${process?.env?.SERVER_URL}api/v1/responses/${responseId}`, options);
        const data = await res.json();
        if(data.status !== 'success'){
            if(checkToken(data.message)) throw Error(data.message)
            else throw Error(data.message)
        }
        return {success: true, data: data.data};
    }catch (e) {
        console.log(e);
        return {success: false, message: e.message};
    }
}
export async function fetchCompanyByOGRN(ogrn, useApiFNS = true){
    try{
        if(useApiFNS){
            const data = await fetch(`${FNS_URL}?req=${ogrn}&key=${process.env.FNS_KEY}`)
            const res = await data.json();
            console.log(res)
            if(ogrn.length === 13 ? res?.items[0]?.['ЮЛ'] : res?.items[0]?.['ИП']){
                return {success: true, data: ogrn.length === 13 ? res.items[0]['ЮЛ'] : res?.items[0]?.['ИП'], useApiFNS}
            }else return {success: false, message: 'Ошибка получения данных о компании'}
        }else{
            const url = "http://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party";
            const options = {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Token " + process.env.FNS_KEY_2
                },
                body: JSON.stringify({
                    query: ogrn,
                    type: ogrn.length === 13 ? "LEGAL" : "INDIVIDUAL"
                })
            }

            const data = await fetch(url, options);
            const res = await data.json();
            if(res?.suggestions?.length === 0 || !res?.suggestions[0]?.value || !res?.suggestions[0]?.data){
                return {success: false, message: 'Нет данных о компании с таким ОГРН'}
            }else {
                const data = {
                    name: res.suggestions[0].value,
                    address: res.suggestions[0].data.address.unrestricted_value || res.suggestions[0].data.address.value,
                    status: res.suggestions[0].data.state.status || 'ACTIVE'
                }
                return {success: true, data: data, useApiFNS}
            }
        }
    }catch (e) {
        console.log(e);
        return {success: false, message: 'Ошибка получения данных о компании'}
    }
}
export async function signUpAction(params){
    try{
        const response = await fetch(`${process?.env?.SERVER_URL}api/v1/auth/signup`,{
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(params),
        });
        return await response.json();
    }catch (e) {
        return {success: false, message: e.message};
    }
}
export async function createAdvertAction(formData, token){
    const options = getOptions(token, 'POST');
    options.body = JSON.stringify({
        formData
    });
    try{
        const res = await fetch(`${process?.env?.SERVER_URL}api/v1/adverts`, options);
        const data = await res.json();
        console.log('Response from advert - create: ', data);
        if(res.status === 400 || !res.ok){
            return {status: 'error', message: data.message};
        }
        if(data.status === 'fail' || data.status === 400){
            return {status: 'error', message: data.message.endsWith('is not valid JSON') ? 'Тело запроса передано не в формате JSON' : data.message};
        }
        if(data.status === 'success') return {status: 'success', data: data.data};
        else return {status: 'error', message: data.message};
    }catch (e) {
        console.log(e);
        return {status: 'error', message: e.message};
    }
}
export async function createResponseAction(formData, token){
    const options = getOptions(token, 'POST');
    options.body = JSON.stringify({
        formData
    });
    try{
        const res = await fetch(`${process?.env?.SERVER_URL}api/v1/responses`, options);
        const data = await res.json();
        console.log('Response from response - create: ', data);
        if(res.status === 400 || !res.ok){
            return {status: 'error', message: data.message};
        }
        if(data.status === 'fail' || data.status === 400){
            return {status: 'error', message: data.message.endsWith('is not valid JSON') ? 'Тело запроса передано не в формате JSON' : data.message};
        }
        if(data.status === 'success') return {status: 'success', data: data.data};
        else return {status: 'error', message: data.message};
    }catch (e) {
        console.log(e);
        return {status: 'error', message: e.message === 'Failed to fetch' ? 'Ошибка сети' : e.message};
    }
}
function checkToken(errorMessage){
    if(errorMessage === 'Invalid token') {
        redirect(authRoutes[0]);
        return true;
    }
    return false
}

export async function revalidateServerData(urlPath = '/account/messages/responses', type = 'page', redirectPath){
    try {
        revalidatePath(urlPath, type);
        redirect(redirectPath);
    }catch (e) {
        console.log(e.message)
    }
}