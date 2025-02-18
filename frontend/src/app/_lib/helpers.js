import {redirect} from "next/navigation";
import {apiServerRoutes, authRoutes} from "@/routes";
import {auth} from "@/auth";
import {revalidatePath} from "next/cache";

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
export function preparePagination(oldPagination, newPagination){
    const {newPage, newOffset, newLimit} = newPagination;
    const {currentPage, limit: currentLimit, offset: currentOffset} = oldPagination;

    let updatedOffset, updatedLimit, updatedPage;
    // change Page:
    if(newPage !== currentPage){
        if((newPage - currentPage) < 0){ // go back:
            updatedOffset = currentOffset - Math.abs(newPage - currentPage) * currentLimit;
        }else if((newPage - currentPage) > 0){  //go forward:
            updatedOffset = currentOffset + (newPage - currentPage)  * currentLimit;
        }
        updatedLimit = currentLimit;
        updatedPage = newPage;
    }else{ //change Limit:
        if(currentPage === 1){
            updatedPage = currentPage;
            updatedOffset = 0;
        }else{
            if(newLimit > currentLimit){ // bigger
                updatedPage =  currentPage / Math.ceil((newLimit / currentLimit));
                updatedOffset = updatedPage === 1 ? 0: (updatedPage - 1) *  newLimit
            }else if(newLimit < currentLimit){ //smaller
                updatedPage = Math.ceil(currentOffset / newLimit) + 1;
                updatedOffset = currentOffset;
            }
        }
        updatedLimit = newLimit;
    }
    return {updatedOffset, updatedLimit, updatedPage};
}
export async function getRequestOptions(token = null, method = 'GET'){
    token = token ? token : await getToken();
    return {
        method: method,
        headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    }
}
export function checkToken(errorMessage){
    if(errorMessage === 'Invalid token') {
        redirect(authRoutes[0]);
        return true;
    }
    return false
}
export async function getToken(){
    const session = await auth();
    return session?.accessToken;
}
export async function getUserId(){
    const session = await auth();
    return session?.user?.id;
}
export async function requestWrap({options, route}){
    try{
        const res = await fetch(route, options);
        if(res.status === 401 && !res.ok){
            throw Error('Please login to get access')
        }
        const data = await res.json();
        if(data.status !== 'success'){
            if(checkToken(data.message)) throw Error(data.message)
            else throw Error(data.message)
        }
        return {success: true, data: data.data};
    }catch (e) {
        let redirect = null
        if(e.message === 'Please login to get access'){
            redirect = {
                revalidatePath: '/',
                revalidateForm: 'layout',
                redirect: true,
                redirectPath: '/login'
            }
        }
        return {success: false, message: e.message, redirect};
    }
}

export function getLastIndexOfMessageList(heightOfList, heightOfParentBlock, items){
    // 1 строка 56px высота элемента
    // 2 строка 80px высота элемента
    // 3 строка 104px высота элемента

    // 1 строка 24px, остальное пространство 32px
    // 1 строка 29 символов
    const oneLine = 29;
    const messBlockHeight = 32;
    const oneLineHeight = 24;
    const marginBottomSpace = 12;
    let accHeight = 0;
    for(let i = 0; i < items.length-1; i++){
        const length = items[i].text.length;
        const lines = Math.ceil(length / oneLine);
        const heightOfMessBlock = messBlockHeight + oneLineHeight * lines;
        accHeight += heightOfMessBlock + marginBottomSpace;
        if(heightOfList - accHeight <= heightOfParentBlock) return i+1;
    }
}