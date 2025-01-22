'use server';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import {DEFAULT_LOGIN_REDIRECT} from "@/routes";
import {FNS_URL} from "@/app/_lib/URLS";
import {getUserByEmail} from "@/app/_lib/data-service";

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

export async function getDialogs(id, token){
    if(!id) return;
    try{
        const res = await fetch(`${process?.env?.SERVER_URL}api/v1/dialogs`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
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