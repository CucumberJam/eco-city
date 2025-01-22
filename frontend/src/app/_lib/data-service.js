const serverAPI = 'http://localhost:4000/'
export const getCities = async ()=> {
    try{
        const res = await fetch(`${process?.env?.SERVER_URL}api/v1/cities`);
        const data = await res.json();
        return (data.status) ? {status: 'success', data: data.data} : {status: 'error', data: data.message};
    }catch (e) {
        console.log(e);
        return {status: 'error', data: e.message};
    }
}
export const getRoles = async ()=> {
    try{
        const res = await fetch(`${process?.env?.SERVER_URL}api/v1/roles`);
        const data = await res.json();
        if(data.status) return data.data;
    }catch (e) {
        console.log(e);
        return {status: 'error', data: e.message};
    }
}
export const getWastes = async ()=> {
    try{
        const res = await fetch(`${process?.env?.SERVER_URL}api/v1/wastes`);
        const data = await res.json();
        if(data.status) return data.data;
    }catch (e) {
        console.log(e);
        return {status: 'error', data: e.message};
    }
}
export const getWasteTypes = async ()=> {
    try{
        const res = await fetch(`${process?.env?.SERVER_URL}api/v1/wastes/types/`);
        const data = await res.json();
        if(data.status) return data.data;
    }catch (e) {
        console.log(e);
        return {status: 'error', data: e.message};
    }
}
export async function getUsers(params){
    const query = new URLSearchParams(params);
    try{
        const res = await fetch(`${process?.env?.SERVER_URL || serverAPI}api/v1/users?${query.toString()}`);
        const data = await res.json();
        return (data.status) ? {status: 'success', data: data.data} : {status: 'error', data: data.message};
    }catch (e) {
        console.log(e);
        return {status: 'error', data: e.message};
    }
}
export async function getUserByEmailOrOGRN(params){
    const email = params?.email;
    const ogrn = params?.ogrn;
    const phone = params?.phone;
    if(!email && !ogrn && !phone) return;
    let options = {};
    if(email) options.email = email;
    if(ogrn) options.ogrn = ogrn;
    if(phone) options.phone = phone;
    try{
        const res = await fetch(`${serverAPI}api/v1/users`, {
            method: 'POST',
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(options),
            redirect: "follow"
        });
        const data = await res.json();
        return (data.status === 'fail') ? {status: 'error', data: data.message} : {status: 'success', data: data.data};
    }catch (e) {
        console.log(e);
        return {status: 'error', data: e.message};
    }
}
export async function getUserById(id){
    if(!id) return;
    try{
        const res = await fetch(`${process?.env?.SERVER_URL || serverAPI}api/v1/users/${id}`);
        const data = await res.json();
        return (data.status === 'fail') ? {status: 'error', data: data.message} : {status: 'success', data: data.data};
    }catch (e) {
        console.log(e);
        return {status: 'error', data: e.message};
    }
}
export async function loginAPI(email, password){
    if(!email || !password) return;
    try{
        const res = await fetch(`${process?.env?.SERVER_URL || serverAPI}api/v1/auth/login`, {
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
