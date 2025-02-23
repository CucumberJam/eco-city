/*const serverAPI = 'http://localhost:4000/'
const getOptions = (token, method = 'GET')=>{
    return {
        method: method,
        headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    }
}

export const getCities = async ()=> {
    try{
        const res = await fetch(`${process?.env?.SERVER_URL || serverAPI}api/v1/cities`);
        const data = await res.json();
        return (data.status) ? {status: 'success', data: data.data} : {status: 'error', data: data.message};
    }catch (e) {
        console.log(e);
        return {status: 'error', data: e.message};
    }
}
export const getRoles = async ()=> {
    try{
        const res = await fetch(`${process?.env?.SERVER_URL || serverAPI}api/v1/roles`);
        const data = await res.json();
        return (data.status) ? {status: 'success', data: data.data} : {status: 'error', data: data.message};
    }catch (e) {
        console.log(e);
        return {status: 'error', data: e.message};
    }
}
export const getDimensions = async ()=> {
    try{
        const res = await fetch(`${process?.env?.SERVER_URL  || serverAPI}api/v1/dimensions`);
        const data = await res.json();
        return (data.status) ? {status: 'success', data: data.data} : {status: 'error', data: data.message};
    }catch (e) {
        console.log(e);
        return {status: 'error', data: e.message};
    }
}
export const getWastes = async ()=> {
    try{
        const res = await fetch(`${process?.env?.SERVER_URL  || serverAPI}api/v1/wastes`);
        const data = await res.json();
        return (data.status) ? {status: 'success', data: data.data} : {status: 'error', data: data.message};
    }catch (e) {
        console.log(e);
        return {status: 'error', data: e.message};
    }
}
export const getWasteTypes = async ()=> {
    try{
        const res = await fetch(`${process?.env?.SERVER_URL  || serverAPI}api/v1/wastes/types/`);
        const data = await res.json();
        return (data.status) ? {status: 'success', data: data.data} : {status: 'error', data: data.message};
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
}*/

export function hasAdvertCreateFormErrors(formData, currentCity, userData, wasteTypes, errorHandler){
    let params = {}
    // check address:
    params = setAddress(params, formData, userData.address, currentCity, errorHandler);
    if(!params) return;

    // check amount:
    params = setObjectFormItem(params, formData, errorHandler, 'amount', true);
    if(!params) return {hasErrors: true};

    // check price:
    params = setObjectFormItem(params, formData, errorHandler, 'price', true);
    if(!params) return {hasErrors: true};

    params = setObjectFormItem(params, formData, errorHandler, 'totalPrice', true);
    if(!params) return {hasErrors: true};

    // check wastes:
    params = setObjectFormItem(params, formData, errorHandler, 'waste', true, 'wasteType', false, true);
    if(!params) return {hasErrors: true};

    // check dimension:
    params = setObjectFormItem(params, formData, errorHandler, 'dimension', true);
    if(!params) return {hasErrors: true};

    // check finishDate:
    params = setObjectFormItem(params, formData, errorHandler, 'finishDate');
    if(!params) return {hasErrors: true};

    params.comment = formData.get('comment');

    params.photos = null;

    return {hasErrors: false, data: params};
}
function setAddress(obj, formData, dataAddress, currentCity, errorHandler){
    const isPickedUp = formData.get('isPickedUp');
    let address = formData.get('address');
    let priceWithDelivery = formData.get('priceWithDelivery');
    const longitude = formData.get('longitude');
    const latitude = formData.get('latitude');

    if(!address){
        obj.address = dataAddress;
    }else  obj.address = address;

    if(isPickedUp === 'true') {
        if(errorHandler('advert', {type: 'address', currentCity, userAddress: dataAddress, address, latitude, longitude})) return null;
    }
    obj.latitude = +latitude;
    obj.longitude = +longitude;
    obj.cityId = +currentCity.id;
    obj.isPickedUp = isPickedUp === 'true';
    obj.priceWithDelivery = obj.isPickedUp ? false : (priceWithDelivery === 'true');

    return obj;
}
function setObjectFormItem(obj, formData, errorHandler,
                           itemName = 'finishDate',
                           isNumber = false,
                           addItemName = null,
                           hasAddItemErrorHandler = false,
                           isAddNumber = false,
                           ){
    const value = formData.get(itemName);
    if(errorHandler('advert', {type: itemName, value})) return null;
    obj[itemName] = isNumber ? Number(value) : value;
    if(addItemName){
        const value = formData.get(addItemName);
        if(hasAddItemErrorHandler){
            if(errorHandler('advert', {type: addItemName, value})) return null;
        }
        obj[addItemName] = value ? isAddNumber ? Number(value) : value : null;
    }
    return obj;
}