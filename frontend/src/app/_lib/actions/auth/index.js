'use server';
import {AuthError} from "next-auth";
import {DEFAULT_LOGIN_REDIRECT} from "@/routes";
import {signIn} from "@/auth";

/**
 * Метод регистрирует нового участника
 * @param {object} params - объект данных для регистрации
 **/
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

/**
 * Метод авторизует участника
 * @param {object} formData - объект данных для авторизации
 **/
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

/**
 * Метод авторизует участника, используется в слое авторизации Next.js
 * @param {string} email - email пользователя
 * @param {string} password - password пользователя
 **/

export async function loginAPI(email, password){
    if(!email || !password) return;
    try{
        const res = await fetch(`${process?.env?.SERVER_URL}api/v1/auth/login`, {
            method: 'POST',
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({email: email, password: password}),
            redirect: "follow"
        });
        const data = await res.json();
        if(data.status === 'fail') return {status: 'error', message: (data.message === 'Incorrect email or password' ? 'Неверные email или пароль' : data.message)};
        return  {status: 'success', token: data.token, data: data.data};
    }catch (e) {
        return {status: 'error', message: e.message};
    }
}