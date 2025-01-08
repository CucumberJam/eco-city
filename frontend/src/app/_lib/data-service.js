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