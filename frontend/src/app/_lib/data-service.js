import {itemsCheckUpdateUser, workingDaysDB} from "@/app/_store/constants";
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

export function checkUpdateUser(formData, userData, isDisabled, errorHandler){
    let params = {};
    const doubles = [];
    for(const name of itemsCheckUpdateUser.names){
        if(itemsCheckUpdateUser.workNames.includes(name)){
            params = checkUpdateUserWork(userData, params, formData, name, name === 'workingDays', doubles)
        }else{
            const needErrorCheck = itemsCheckUpdateUser.needsErrorCheck.includes(name);
            const includesInNotDisabled = itemsCheckUpdateUser.namesIfNotDisabled.includes(name);
            if(!includesInNotDisabled || (includesInNotDisabled && !isDisabled)){
                params = checkUpdateUserItem(userData, params, formData, name, needErrorCheck ? errorHandler : null);
                if(!params) return {success: false};
            }
        }
    }

    const wastes = formData.get('wastes');
    const wasteTypes = formData.get('wasteTypes');
    if(wastes) params.wastes = isDisabled ? Array.from(new Set([...userData.wastes, ...wastes.split(',').map(el => +el)])).sort() : wastes.split(',').map(el => +el);
    if(wasteTypes) params.wasteTypes = isDisabled ? Array.from(new Set([...userData.wasteTypes, ...wasteTypes.split(',').map(el => +el)])).sort() : wasteTypes.split(',').map(el => +el);

    const res = Object.keys(params).length === 0 ? null : params;
    return {success: true, data: res}
}
function checkUpdateUserItem(userData, params, formData, itemName,
                             errorHandler = null){
    const item = formData.get(itemName);
    if(errorHandler && errorHandler('form', {type: itemName, payload: { [itemName]: item}})) return null;
    if(userData[itemName] !== item) params[itemName] = item;
    return params;
}
function checkUpdateUserWork(userData, params, formData, itemName, isDays = false, doubles = null){
    let item = formData.get(itemName);
    console.log(item)
    if(isDays)  item = item.split(',').map(el => workingDaysDB[el]).join(',')
    if(userData[itemName].join(',') !== item){
        let res = item.split(',');
        if(isDays) {
            res = res.map(el => +el);
            doubles = getDoublesInArray(res);
            if(doubles.length > 0) res = Array.from(new Set(res));
        }else{
            if(doubles.length > 0){
                for(const double of doubles){
                    res = res.splice(double, 1);
                }
            }
        }
        params[itemName] = res;
    }
    return params;
}
function getDoublesInArray(numbers){
    const countItems = {};
    for (const item of numbers) {
        countItems[item] = countItems[item] ? countItems[item] + 1 : 1;
    }
    return Object.keys(countItems).filter((item) => countItems[item] > 1).map(el => +el);
}