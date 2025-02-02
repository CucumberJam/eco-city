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
export const getDimensions = async ()=> {
    try{
        const res = await fetch(`${process?.env?.SERVER_URL}api/v1/dimensions`);
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
export async function getAdverts(userId, token){
    console.log(userId);
    if(!userId) return;
    try{
        const options = getOptions(token);
        const res = await fetch(`${process?.env?.SERVER_URL}api/v1/adverts/${userId}`, options);
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
    const params = {}
    // check address:
    const isPickedUp = formData.get('isPickedUp');
    const address = formData.get('address');
    const latitude =  formData.get('latitude');
    const longitude = formData.get('longitude');
    const priceWithDelivery = formData.get('priceWithDelivery');
    if(isPickedUp){
        //check priceWithDelivery:
        formData.set('priceWithDelivery', 'false');
        if(isPickedUp && errorHandler('advert', {type: 'address', currentCity, userAddress: userData.address, address, latitude, longitude})) return;
    }
    params.address = address;
    params.latitude = +latitude;
    params.longitude = +longitude;
    formData.append('cityId', currentCity.id);
    params.cityId = +currentCity.id;
    params.isPickedUp = isPickedUp === 'true';
    params.priceWithDelivery = isPickedUp ? false : (priceWithDelivery === 'true');

    // check amount:
    const amount = formData.get('amount');
    if(errorHandler('advert', {type: 'amount', value: amount})) return {hasErrors: true};
    params.amount = +amount;

    // check price:
    const price = formData.get('price');
    if(errorHandler('advert', {type: 'price', value: price})) return {hasErrors: true};
    const totalPrice = formData.get('totalPrice');
    if(errorHandler('advert', {type: 'price', value: totalPrice})) return {hasErrors: true};
    params.price = parseFloat(price);
    params.totalPrice = parseFloat(totalPrice);

    // check wastes:
    setDefaultWasteType(formData, wasteTypes, userData.wasteTypes, userData.wastes);
    const wastes = formData.get('waste');
    const wasteType = formData.get('wasteType');
    if(errorHandler('advert', {type: 'waste', wastes})) return {hasErrors: true};
    params.waste = +wastes;
    params.wasteType = wasteType ? +wasteType : null;

    // check dimension:
    const dimension = formData.get('dimension');
    if(errorHandler('advert', {type: 'dimension', dimension})) return {hasErrors: true};
    params.dimension = +dimension;

    // check finishDate:
    const finishDate = formData.get('finishDate');
    if(errorHandler('advert', {type: 'finishDate', finishDate})) return {hasErrors: true};
    params.finishDate = finishDate;

    params.comment = formData.get('comment');

    params.photos = null;

    return {hasErrors: false, data: params};
}
function setDefaultWasteType(formData, wasteTypesAPI, userWasteTypes, userWastes){
    const waste = formData.get('waste');
    if(!waste){
        formData.set('waste', userWastes[0]);
    }
    const wasteType = formData.get('wasteType');
    if(wasteType) return;

    const array = wasteTypesAPI.filter(el => userWasteTypes?.includes(el.id) && +el.typeId === +waste) || [];
    if(array.length > 0) {
        formData.set('wasteType', array[0]?.id);
    }
}