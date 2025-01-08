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
                    userWasteTypeCopy.delete(found.id);
                })
            }
            arr.push({...waste});
        }
    });
    return arr;
}