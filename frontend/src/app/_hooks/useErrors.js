import {useState} from "react";
import {REG_EXPR_EMAIL, REG_EXPR_PHONE, REG_EXPR_WEBSITES} from "@/app/_store/constants";

export default function useErrors(){
    const [errMessage, setErrMessage] = useState('');

    function showError(mes){
        setErrMessage(prev => mes);
        setTimeout(()=>{
            setErrMessage(prev => '')
        }, 3000)
    }
    function hasError(command, payload){
        const errorHandler = {
            length: (payload) =>{
                if(payload.trim().length !== 13 && payload.trim().length !== 15){
                    showError('ОГРН должен быть 13 символов (ОГРНИП 15)');
                    return true;
                }
            },
            type: (payload) =>{
                const parsed = Number.parseInt(payload);
                if (Number.isNaN(parsed)) {
                    showError('ОГРН/ОГРНИП должен состоять из чисел');
                    return true;
                }
            },
            api: (payload) => {
                if(!payload?.success || !payload?.data) {
                    showError(payload?.message || 'Ошибка получения данных о компании');
                    return true;
                }
            },
            status:(payload) => {
                if((payload.useApiFNS && payload?.data?.['Статус'] !== "Действующее") ||
                    (!payload.useApiFNS && payload.data.status !== 'ACTIVE')){
                    showError('Компания должна быть действующей');
                    return true;
                }
            },
            workDay: (payload) => {
                switch (payload.type){
                    case 'add':
                        if(!payload.payload) {
                            showError('Нет данных о добавляемом рабочем дне');
                            return true;
                        }else if(!payload.payload.id){
                            showError('Нет данных об id добавляемого рабочего дня');
                            return true;
                        }else if(!payload.payload?.name) {
                            showError('Нет данных об названии добавляемого рабочего дня');
                            return true;
                        }else if(!payload.payload?.start) {
                            showError('Нет данных о начале добавляемого рабочего дня');
                            return true;
                        }else if(!payload?.payload?.end){
                            showError('Нет данных об окончании добавляемого рабочего дня');
                            return true;
                        }
                        break;
                    case 'remove':
                        if(!payload?.payload || !payload.payload?.id){
                            showError('Нет данных об удаляемом рабочем дне');
                            return true;
                        }
                        break;
                    case 'change':
                        if(!payload?.payload || !payload.payload?.id){
                            showError('Нет данных об изменяемом рабочем дне');
                            return true;
                        }else if(!payload?.payload?.start || !payload.payload?.end){
                            showError('Нет данных об изменяемом времени рабочего дня');
                            return true;
                        }
                        break;
                }
            },
            form: (payload) => {
                switch (payload.type){
                    case 'ogrn':
                        if(!payload?.payload) {
                            showError('Поле ОГРН должно быть заполнено');
                            return true;
                        }else if(payload.payload.trim().length !== 13 && payload.payload.trim().length !== 15){
                            showError('ОГРН должен быть 13 символов (ОГРНИП 15)');
                            return true;
                        }else if(Number.isNaN(Number.parseInt(payload.payload))) {
                            showError('ОГРН/ОГРНИП должен состоять из чисел');
                            return true;
                        }
                        break;
                    case 'name':
                        if(!payload.payload) {
                            showError('Поле Наименование должно быть заполнено');
                            return true;
                        }
                        break;
                    case 'address':
                        if(!payload.payload) {
                            showError('Поле Адрес должно быть заполнено');
                            return true;
                        }
                        break;
                    case 'city':
                        if(!payload?.payload?.cityId) {
                            showError('Город должен быть выбран');
                            return true;
                        }else if(!payload?.payload?.longitude || !payload?.payload?.longitude) {
                            showError('Местоположение должно быть указано');
                            return true;
                        }
                        break;
                    case 'role':
                        if(!payload.payload.role) {
                            showError('Поле Роль должно быть заполнено');
                            return true;
                        }
                        break;
                    case 'website':
                        if(payload.payload.website && !REG_EXPR_WEBSITES.test(payload.payload?.website)) {
                            showError('Некорректный адрес сайта');
                            return true;
                        }
                        break;
                    case 'email':
                        if(!payload?.payload?.email) {
                            showError('Заполните адрес почты');
                            return true;
                        }
                        const res = REG_EXPR_EMAIL.test(payload.payload.email)
                        if(!res) {
                            showError('Некорректный адрес почты');
                            return true;
                        }
                        break;
                    case 'phone':
                        if(!payload?.payload?.phone) {
                            showError('Заполните номер телефона');
                            return true;
                        }
                        if(!REG_EXPR_PHONE.test(payload.payload.phone)) {
                            showError('Некорректный номер телефона: +79991114488');
                            return true;
                        }
                        break;
                    case 'password':
                        if(payload?.payload?.password?.length < 6){
                            showError('Пароль должен быть минимум 6 символов');
                            return true;
                        }else if(payload?.payload?.password !== payload?.payload?.confirmPassword){
                            showError('Пароли не совпадают');
                            return true;
                        }
                        break;
                }
            },
            advert: (payload) => {
                switch (payload.type){
                    case 'amount':
                        if(payload.value < 1){
                            showError('Количество не может быть 0 или отрицательным!');
                            return true;
                        }
                        break;
                    case 'price':
                        if(payload.value < 0){
                            showError('Стоимость не может быть отрицательной!');
                            return true;
                        }
                        break;
                    case 'address':
                        if(payload?.userAddress !== payload?.address && (payload?.latitude === 0 || payload?.longitude === 0)){
                            showError('В связи со сменой адреса, укажите его на карте!');
                            return true;
                        }
                        if(Math.floor(+payload?.latitude) !== Math.floor(Number.parseFloat(payload?.currentCity?.latitude))
                            || Math.floor(+payload?.longitude) !== Math.floor(Number.parseFloat(payload?.currentCity?.longitude))){
                            showError('Указанный Вами адрес на карте не соответствует текущему городу');
                            return true;
                        }
                        break;
                    case 'waste':
                        console.log(payload)
                        if(!payload?.value || (typeof(payload?.value === 'string') && payload?.value?.length === 0)){
                            showError('Выберите вид отходов');
                            return true;
                        }
                        break;
                    case 'dimension':
                        if(!payload?.value){
                            showError('Укажите единицу измерения');
                            return true;
                        }
                        break;
                    case 'finishDate':
                        const formDate = new Date(Date.parse(payload.value));
                        const today = new Date();
                        const formDateYear = formDate.getFullYear();
                        const todayYear = today.getFullYear();
                        if(formDateYear < todayYear){
                            showError('Дата окончания не может быть раньше текущего года');
                            return true;
                        }else{ //formDateYear > todayYear || formDateYear === todayYear
                            const formDateMonth = formDate.getMonth();
                            const todayMonth = today.getMonth();
                            if(formDateMonth < todayMonth && formDateYear === todayYear){
                                showError('Дата окончания не может быть раньше текущего месяца');
                                return true;
                            }else{
                                // formDateMonth > todayMonth &&  formDateYear === todayYear
                                // formDateMonth < todayMonth && formDateYear < todayYear
                                // formDateMonth === todayMonth && formDateYear === todayYear
                                const formDateDay = formDate.getDate();
                                const todayDay = today.getDate();
                                // formDateDay <= todayDay && formDateMonth === todayMonth && formDateYear === todayYear
                                if(formDateDay <= todayDay && formDateMonth === todayMonth && formDateYear === todayYear){
                                    showError('Дата окончания не может быть раньше сегодня');
                                    return true;
                                }
                            }
                        }
                        break;
                }
            },
            default: (payload)=>{
                showError(payload);
                return true;
            },
        }
        return errorHandler[command](payload);
    }

    return {errMessage, hasError};
}