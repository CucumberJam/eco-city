"use client";
import {useReducer} from "react";
function workDaysReducer(prevWorkDays, action) {
    switch (action.type){
        case 'add': {
            return [...prevWorkDays, {
                id: action.payload.id,
                name: action.payload.name,
                start: action.payload.start,
                end: action?.payload?.end
            }];
        }
        case 'change': {
            return prevWorkDays.map(workDay =>
                (workDay.id === action.payload.id) ? action.payload : workDay);
        }
        case 'remove': {
            return prevWorkDays.filter(workDay => workDay.id !== action.payload.id);
        }
        default: {
            throw Error('Неизвестное действие с рабочим временем: ' + action.type);
        }
    }
}
export default function useWorkTime(errorCallbackFunc,
                                    initialTime = []){
    const [chosenWorkDays, dispatch] = useReducer(workDaysReducer, initialTime);
    function hasError(type, payload){
        if(errorCallbackFunc('workDay', { type, payload})) {
            return true;
        }
    }
    function doDispatch(type, payload = null){
        try{
            const params = {type: type};
            if(payload) params.payload = payload;
            dispatch(params);
            return true;
        }catch (e) {
            errorCallbackFunc('default', e.message);
            return false;
        }
    }
    function changeWorkDays(params){
        const type = params.type;
        const payload = params?.payload || null;

        if(type === 'add'){
            if(hasError(type, payload)) return;
            const found = chosenWorkDays.find(elem => elem === payload.id);
            if(found) return; // check if already has new item in array:
            doDispatch(type, payload);
            return;
        }
        const found = chosenWorkDays.find(elem => elem.id === payload.id);
        if(!found) return;
        if(hasError(type, payload)) return;
        doDispatch(type, payload ? payload : null);
    }
    const getWorkTimeFormData = () => {
        const workingHourStart= [], workingHourEnd= [],  workingDays = [];
        const sortedArr = chosenWorkDays?.sort((a, b) => a.id - b.id);

        for(const item of sortedArr){
            workingDays.push(item.name);
            workingHourStart.push(item.start);
            workingHourEnd.push(item.end);
        }

        return {workingDays, workingHourStart, workingHourEnd};
    }

    return {getWorkTimeFormData, changeWorkDays};
}