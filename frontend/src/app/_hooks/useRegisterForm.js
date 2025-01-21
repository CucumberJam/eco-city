import {useReducer, useState} from "react";

const registerFormState = {
    isFetching: false,
    isRegisterSucceeded: false,
    role: '',
    city: 0,
    position: null,
}
function registerFormReducer(prevFormState, action){
    switch (action.type){
        case 'change-city': {
            return {
                ...prevFormState,
                city: action.payload.cityId,
            }
        }
        case 'change-role': {
            return {
                ...prevFormState,
                role: action.payload.role,
            }
        }
        case 'change-position': {
            return {
                ...prevFormState,
                position: action.payload.position,
            }
        }
        case 'clear': {
            return {
                ...registerFormState
            }
        }
        default: {
            throw Error('Неизвестное действие с формой регистрации: ' + action.type);
        }
    }
}
export default function useRegisterForm(errorCallbackFunc){
    const [registerForm, registerFormDispatch] = useReducer(registerFormReducer, {...registerFormState});

    function hasError(type, payload){
        if(errorCallbackFunc('form', { type, payload})) {
            return true;
        }
    }
    function validateRegisterFormData({
                                          formData, defaultCity, defaultRole,
                                          workingDays, workingHourStart, workingHourEnd,
                                          wastes, wasteTypes}){ //wastes, wasteTypes
        let cityId, role;
        if(registerForm.city === 0) {
            registerFormDispatch({type: 'change-city', payload: {cityId: defaultCity.id}});
            cityId = defaultCity.id;
        } else cityId = registerForm.city;
        formData.append('city', cityId);

        if(registerForm.role === '') {
            registerFormDispatch({type: 'change-role', payload: {role: defaultRole.name}});
            role = defaultRole.name;
        } else role = registerForm.role;
        formData.append('role', role);

        if(!registerForm.position || registerForm.position?.latitude || registerForm.position?.longitude){
            errorCallbackFunc('default', 'Укажите местоположение на карте')
            return;
        }
        formData.append('latitude', registerForm.position.latitude);
        formData.append('longitude', registerForm.position.longitude);

        const keysComposables = ['wastes', 'wasteTypes', 'workingDays', 'workingHourStart', 'workingHourEnd'];
        const valueComposables = [wastes, wasteTypes, workingDays, workingHourStart, workingHourEnd]
        for(let i = 0; i < keysComposables.length; i++){
            formData.append(keysComposables[i], valueComposables[i] || []);
        }

        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        if(errorCallbackFunc('form', 'password', {password, confirmPassword})) return;

        const keysFormData = ['ogrn', 'name', 'address', 'city', 'role', 'email', 'phone', 'website'];
        for(const key of keysFormData){
            const value = formData.get(key);
            if(hasError(key, value)) return;
        }
        return formData;
    }

    return {validateRegisterFormData, registerFormDispatch};
}