import {useReducer} from "react";
import {workingDaysDB} from "@/app/_store/constants";
import {getUserByEmailPhoneOGRN} from "@/app/_lib/actions/users";

const signUpFormState = {
    step: 1,
    progress: 0,
    ogrn: '',
    name: '',
    address: '', //1
    cityId: 0,
    latitude: null,
    longitude: null, // 2
    role: '', // 3
    wastes: null,
    wasteTypes: null, //4
    email: '',
    phone: 0,
    website: null, //5
    workingDays: null,
    workingHourStart: null,
    workingHourEnd: null, //6
    password: '',
    confirmPassword: '',//7
}
const progressSteps = {
    1: 0,
    2: 10,
    3: 30,
    4: 45,
    5: 60,
    6: 75,
    7: 85,
    8: 100
}
const dictionarySteps = {
    ogrn: {step:1 , required: true, progress: progressSteps[1]},
    name: {step:1 , required: true, progress: progressSteps[1]},
    address: {step:1 , required: true, progress: progressSteps[1]},
    cityId: {step:2 , required: true, progress: progressSteps[2]},
    latitude: {step:2 , required: true, progress: progressSteps[2]},
    longitude:{step:2 , required: true, progress: progressSteps[2]},
    role: {step:3 , required: true, progress: progressSteps[3]},
    wastes: {step:4 , required: true, progress: progressSteps[4]},
    wasteTypes:{step:4 , required: false, progress: progressSteps[4]},
    email: {step:5 , required: true, progress: progressSteps[5]},
    phone: {step:5 , required: true, progress: progressSteps[5]},
    website: {step:5 , required: false, progress: progressSteps[5]},
    workingDays: {step:6 , required: true, progress: progressSteps[6]},
    workingHourStart: {step:6 , required: true, progress: progressSteps[6]},
    workingHourEnd: {step:6 , required: true, progress: progressSteps[6]},
    password: {step:7 , required: true, progress: progressSteps[7]},
    confirmPassword: {step:7 , required: true, progress: progressSteps[7]},
}
function signUpFormReducer(prevFormState, action){
    switch (action.type){
        case 'change-step': {
            return {
                ...prevFormState,
                step: action.step,
                progress: progressSteps[action.step]
            }
        }
        case 'complete-step-1': {
            return {
                ...prevFormState,
                ogrn: action.payload.ogrn,
                name: action.payload.name,
                address: action.payload.address,
                step: 2,
                progress: progressSteps[2],
            }
        }
        case 'complete-step-2': {
            return {
                ...prevFormState,
                cityId: action.payload.cityId,
                latitude: action.payload.latitude,
                longitude: action.payload.longitude,
                step: 3,
                progress: progressSteps[3],
            }
        }
        case 'complete-step-3': {
            return {
                ...prevFormState,
                role: action.payload.role,
                step: 4,
                progress: progressSteps[4],
            }
        }
        case 'complete-step-4': {
            return {
                ...prevFormState,
                wastes: action.payload.wastes,
                wasteTypes: action.payload.wasteTypes,
                step: 5,
                progress: progressSteps[5],
            }
        }
        case 'complete-step-5': {
            return {
                ...prevFormState,
                email: action.payload.email,
                phone: action.payload.phone,
                website: action.payload.website,
                step: 6,
                progress: progressSteps[6],
            }
        }
        case 'complete-step-6': {
            return {
                ...prevFormState,
                workingDays: action.payload.workingDays,
                workingHourStart: action.payload.workingHourStart,
                workingHourEnd: action.payload.workingHourEnd,
                step: 7,
                progress: progressSteps[7],
            }
        }
        case 'complete-step-7':{
            return {
                ...prevFormState,
                password: action.payload.password,
                confirmPassword: action.payload.confirmPassword,
                step: 8,
                progress: progressSteps[8],
            }

        }
        case 'complete-step-8':{
            return {
                ...signUpFormState,
            }
        }
        default: {
            throw Error('Неизвестное действие с формой регистрации: ' + action.type);
        }
    }
}
export default function useSignUpForm(errorCallbackFunc){
    const [signUpForm, dispatch] = useReducer(signUpFormReducer, {...signUpFormState});

    async function signUpFormDispatch(step, data = null){
        if(!data){ //step to go back
            dispatch({type: 'change-step', step: step});
            return ;
        }
        switch (step){
            case 1: {
                const name = data.get('name');
                const ogrn = data.get('ogrn');
                const address = data.get('address');
                if(errorCallbackFunc('form', {type: 'ogrn', payload: ogrn}) ||
                    errorCallbackFunc('form', {type: 'name', payload: name}) ||
                    errorCallbackFunc('form', {type: 'address', payload: address})) return;

                try{
                    const isUserExist = await getUserByEmailPhoneOGRN({ogrn: ogrn});
                    if(isUserExist.success) {
                        errorCallbackFunc('default', 'Пользователь с таким ОГРН уже зарегистрирован');
                        return;
                    }else{
                        if(!isUserExist?.message?.endsWith('не найден')){
                            errorCallbackFunc('default', isUserExist.message);
                        }
                    }
                }catch (e) {
                    errorCallbackFunc('default', e.message);
                }

                dispatch({type: 'complete-step-1', payload: {ogrn, name, address}});
                break;
            }
            case 2: {
                const currentCityId = data.get('current-city');
                const chosenCityId = data.get('chosen-city');
                const cityId = chosenCityId !== '0' ? +chosenCityId : +currentCityId;
                const longitude = +data.get('longitude');
                const latitude = +data.get('latitude');
                if(errorCallbackFunc('form', {type: 'city', payload: {cityId, longitude, latitude}})) return;
                dispatch({type: 'complete-step-2', payload: {cityId, longitude, latitude}});
                break;
            }
            case 3: {
                const role = data.get('role');
                if(errorCallbackFunc('form', {type: 'role', payload: {role}})) return;
                dispatch({type: 'complete-step-3', payload: {role}});
                break;
            }
            case 4: {
                let wastes = data.get('wastes')?.split(',').map(el=>+el);
                let wasteTypes = data.get('wasteTypes')?.split(',').map(el=>+el);
                if(wastes.length === 0) {
                    errorCallbackFunc('default', 'Выберите вид отходов');
                    return
                }
                dispatch({type: 'complete-step-4', payload: {wastes, wasteTypes}});
                break;
            }
            case 5: {
                const email = data.get('email');
                let phone = data.get('phone');
                const website = data.get('website');

                if(errorCallbackFunc('form', {type: 'email', payload: {email}})) return;
                if(errorCallbackFunc('form', {type: 'phone', payload: {phone}})) return;
                if(errorCallbackFunc('form', {type: 'website', payload: {website}})) return;

                phone = phone.startsWith('+') ? +phone.substring(1) : +phone;
                try{
                    const isUserExistWithEmail = await getUserByEmailPhoneOGRN({email: email});
                    if(isUserExistWithEmail.success) {
                        errorCallbackFunc('default', 'Пользователь с таким email уже зарегистрирован');
                        return;
                    }
                    const isUserExistWithPhone = await getUserByEmailPhoneOGRN({phone: phone});
                    if(isUserExistWithPhone.success) {
                        errorCallbackFunc('default', 'Пользователь с таким телефоном уже зарегистрирован');
                        return;
                    }
                }catch (e) {
                    errorCallbackFunc('default', e.message);
                    return;
                }

                dispatch({type: 'complete-step-5', payload: {email, phone, website}});
                break;
            }
            case 6: {
                let workingDays = data.get('workingDays')?.split(',');
                const workingHourStart = data.get('workingHourStart')?.split(',');
                const workingHourEnd = data.get('workingHourEnd')?.split(',');
                if(workingDays.length === 0){
                    errorCallbackFunc('default', 'Заполните режим работы');
                    return;
                }
                workingDays = workingDays.map(el => workingDaysDB[el]);
                dispatch({type: 'complete-step-6', payload: {workingDays, workingHourStart, workingHourEnd}})
                break;
            }
            case 7: {
                const password = data.get('password');
                const confirmPassword = data.get('confirmPassword');
                dispatch({type: 'complete-step-7', payload: {password, confirmPassword}});
                return {success: true}
            }
            case 8: {
                dispatch({type: 'complete-step-8'});
            }
        }
    }

    function getPassword(formData){
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        return {password, confirmPassword};
    }
    function checkFormData(data){
        const steps = new Set();
        for(const key in dictionarySteps){
           // Если поле обязательно для заполнения и оно не заполнено, добавить его step в обязательные шаги
            if(dictionarySteps[key].required &&
                (data.hasOwnProperty(key) && data[key] !== signUpFormState[key])){
                steps.add(dictionarySteps[key].step)
            }
        }
        return (steps.size > 0) ? {success: false, data: Array.from(steps)} : {success: true}
    }
    function getFormObjectWithPassword(data){
        const {password, confirmPassword} = getPassword(data);
        const formData = Object.assign({}, signUpForm);
        formData.password = password;
        formData.confirmPassword = confirmPassword;
        return formData;
    }
    function checkStep7(formData){
        const {password, confirmPassword} = getPassword(formData);
        if(errorCallbackFunc('form', {type: 'password', payload: {password, confirmPassword}})) {
            return false;
        }
        return true;
    }

    return {signUpForm, signUpFormDispatch, checkStep7, checkFormData, getFormObjectWithPassword};
}