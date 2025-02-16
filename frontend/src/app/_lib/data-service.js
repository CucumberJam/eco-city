const serverAPI = 'http://localhost:4000/'
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
export async function getAdverts(userId, token){
    console.log(userId);
    if(!userId) return;
    try{
        const options = getOptions(token);
        const res = await fetch(`${process?.env?.SERVER_URL  || serverAPI}api/v1/adverts/${userId}`, options);
        const data = await res.json();
        console.log('Response from Adverts: ', data)
        if(data.status !== 'success'){
            throw Error(data.message)
        }
        return {status: 'success', data: data.data};
    }catch (e) {
        console.log(e);
        return {status: 'error', message: e.message};
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

export function hasAdvertCreateFormErrors(formData, currentCity, userData, wasteTypes, errorHandler){
    let params = {}
    // check address:
    params = setAddress(params, formData, userData.address, currentCity, errorHandler);
    if(!params) return;
/*    let isPickedUp = formData.get('isPickedUp');
    const address = formData.get('address');
    const latitude =  formData.get('latitude');
    const longitude = formData.get('longitude');
    const priceWithDelivery = formData.get('priceWithDelivery');
    if(isPickedUp === 'true'){
        //check priceWithDelivery:
        formData.set('priceWithDelivery', 'false');
        if(errorHandler('advert', {type: 'address', currentCity, userAddress: userData.address, address, latitude, longitude})) return {hasErrors: true};;
    }
    params.address = address;
    params.latitude = +latitude;
    params.longitude = +longitude;
    formData.append('cityId', currentCity.id);
    params.cityId = +currentCity.id;
    params.isPickedUp = isPickedUp === 'true';
    params.priceWithDelivery = params.isPickedUp ? false : (priceWithDelivery === 'true');*/

    // check amount:
    params = setObjectFormItem(params, formData, errorHandler, 'amount', true);
    if(!params) return {hasErrors: true};
/*    const amount = formData.get('amount');
    if(errorHandler('advert', {type: 'amount', value: amount})) return {hasErrors: true};
    params.amount = +amount;*/

    // check price:
    params = setObjectFormItem(params, formData, errorHandler, 'price', true);
    if(!params) return {hasErrors: true};

    params = setObjectFormItem(params, formData, errorHandler, 'totalPrice', true);
    if(!params) return {hasErrors: true};
/*    const price = formData.get('price');
    if(errorHandler('advert', {type: 'price', value: price})) return {hasErrors: true};
    const totalPrice = formData.get('totalPrice');
    if(errorHandler('advert', {type: 'price', value: totalPrice})) return {hasErrors: true};
    params.price = parseFloat(price);
    params.totalPrice = parseFloat(totalPrice);*/

    // check wastes:
    params = setObjectFormItem(params, formData, errorHandler, 'waste', true, 'wasteType', false, true);
    //params = setWastes(params, formData, errorHandler);
    if(!params) return {hasErrors: true};

    //setDefaultWasteType(formData, wasteTypes, userData.wasteTypes, userData.wastes);
/*    let waste = formData.get('waste') + '';
    const wasteType = formData.get('wasteType');
    if(errorHandler('advert', {type: 'waste', waste})) return {hasErrors: true};
    params.waste = +waste;
    params.wasteType = wasteType ? +wasteType : null;*/

    // check dimension:
    params = setObjectFormItem(params, formData, errorHandler, 'dimension', true);
    if(!params) return {hasErrors: true};
    /*const dimension = formData.get('dimension');
    if(errorHandler('advert', {type: 'dimension', dimension})) return {hasErrors: true};
    params.dimension = +dimension;*/

    // check finishDate:
    params = setObjectFormItem(params, formData, errorHandler, 'finishDate');
    if(!params) return {hasErrors: true};
/*    const finishDate = formData.get('finishDate');
    if(errorHandler('advert', {type: 'finishDate', finishDate})) return {hasErrors: true};
    params.finishDate = finishDate;*/

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