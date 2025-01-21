export function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}
export const isEqual = (arr) =>{
    const copy = new Set(arr);
    return copy.size === 1;
}
export const hasWeekDays = (workingDays, workingStartHours, workingEndHours) => {
    if(!workingDays.includes(0) || !workingDays.includes(1) || !workingDays.includes(2) || !workingDays.includes(3) || !workingDays.includes(4)) return false;
    if(!isEqual(workingStartHours.slice(0, 5))) return false;
    return isEqual(workingEndHours.slice(0, 5));
}
export const hasWeekendDays = (workingDays, workingStartHours, workingEndHours) => {
    if(!workingDays.includes(5) || !workingDays.includes(6)) return false;
    if(!isEqual(workingStartHours.slice(5))) return false;
    return isEqual(workingEndHours.slice(5));
}
export const getWastes = (userWastes, userWasteTypes, wastesAPI, wasteTypesAPI)=> {
    let userWasteTypeCopy = new Set (userWasteTypes);
    const arr = [];
    wastesAPI.forEach(waste => {
        if (userWastes.includes(waste.id)) {
            waste.children = [];
            if (userWasteTypeCopy.size > 0) {
                userWasteTypeCopy.forEach(wasteType => {
                    const found = wasteTypesAPI.find(el => el.id === wasteType);
                    if (found?.typeId === waste.id) waste.children.push({...found});
                    if (found) userWasteTypeCopy.delete(found.id);
                })
            }
            arr.push({...waste});
        }
    });
    return arr;
}
function removeSlash(str){
    const regExpr = /\\/g
    return str.replace(regExpr, '');
}
const featureNamesFNS = {
    company: {
        name: 'НаимСокрЮЛ',
    },
    person: {
        name: 'ФИОПолн',
    }
}
export function getNameAddress(data, isCompany = true, useApiFNS = true){
    const name = removeSlash(useApiFNS ?
        (isCompany ? data?.[featureNamesFNS.company.name] : data?.[featureNamesFNS.person.name] || '')
        : data.name);
    const address = useApiFNS ?
        (isCompany ? data?.['Адрес']?.['АдресПолн'] : data?.['Адрес']?.['Индекс'] + ' ' + data?.['Адрес']?.['АдресПолн'])
        : data.address;
    return [name, address]
}
export function prepareName(str){
    return str.substring(0,1).toUpperCase() + str.substring(1).toLowerCase();
}
export function validateRegisterFormData(data){
    const formData = new FormData(event.currentTarget);
    //validation:
    const ogrn = formData.get('ogrn');
    if(!ogrn) return {success: false, message: 'Поле ОГРН должно быть заполнено'};

    const name = formData.get('name');
    if(!name) return {success: false, message: 'Поле Наименование должно быть заполнено'};

    const address = formData.get('address');
    if(!address) return {success: false, message: 'Поле Адрес должно быть заполнено'};

    const city = formData.get('city');
    if(!city) return {success: false, message: 'Поле Город должно быть заполнено'};

}