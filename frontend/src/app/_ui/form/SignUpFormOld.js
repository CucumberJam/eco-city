'use client';
import {useEffect, useState} from "react";
import {FormItem} from "@/app/_ui/form/FormItem";
import FormButton from "@/app/_ui/form/FormButton";
import {USE_FNS2} from "@/app/_lib/URLS";
import {FormSelectUnique} from "@/app/_ui/form/FormSelectUnique";
import useCities from "@/app/_hooks/useCities";
import useRolesWastes from "@/app/_hooks/useRolesWastes";
import FormSelectMultiple from "@/app/_ui/form/FormSelectMultiple";
import useErrors from "@/app/_hooks/useErrors";
import useDebounce from "@/app/_hooks/useDebounce";
import useFormWastes from "@/app/_hooks/useFormWastes";
import FormItemMap from "@/app/_ui/form/FormItemMap";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import FormWorkTime from "@/app/_ui/form/FormWorkTime";
import useWorkTime from "@/app/_hooks/useWorkTime";
import {signUpAction} from "@/app/_lib/actions";
import FormAnnounce from "@/app/_ui/form/FormAnnounce";
import useRegisterForm from "@/app/_hooks/useRegisterForm";

export default function SignUpForm({citiesAPI, rolesAPI, wastesApi, wasteTypesApi}){
    const {currentCity, cities} = useCities(citiesAPI, false);
    const {roles, wastes, wasteTypes} = useRolesWastes(rolesAPI, wastesApi, wasteTypesApi);
    const {showedWasteTypes, pickWaste, pickWasteType, getChosenWastesAndTypes} = useFormWastes();
    const {errMessage, hasError} = useErrors();
    const {isFetchingOGRN, ogrnUserName, ogrnUserAddress, debounceCheck} = useDebounce(hasError);
    const [isFetching, setIsFetching] = useState(false);
    const [isRegisterSucceeded, setIsRegisterSucceeded] = useState(false);

    const {currentUser, setCurrentUser} = useGlobalUIStore((state) => state);
    const {getWorkTimeFormData, changeWorkDays} = useWorkTime(hasError);
    const {registerFormDispatch, validateRegisterFormData} = useRegisterForm(hasError);

    useEffect(()=>{
        if(currentUser) setCurrentUser(null);
    }, []);

    async function handleSubmit(event){
        event.preventDefault();

        const {workingDays, workingHourStart, workingHourEnd} = getWorkTimeFormData();
        const {wastes, wasteTypes} = getChosenWastesAndTypes();

        const formBody = validateRegisterFormData({
            formData: new FormData(event.currentTarget),
            defaultCity: currentCity,
            defaultRole: roles[0],
            workingDays, workingHourStart, workingHourEnd,
            wastes, wasteTypes
        });
        if(!formBody) return;
        try{
            setIsFetching(prev => true);
            const response = await signUpAction(formBody);
            if(!response?.success && response.message !== "NEXT_REDIRECT"){
                throw new Error(response.message);
            }else {
                setIsFetching(prev => false);
                setIsRegisterSucceeded(true);
                registerFormDispatch({type: 'clear'});
                // clear data:
            }
        }catch (e) {
            setIsFetching(prev => false);
            hasError?.('default', e.message);
        }
    }

    return (
        <form className='w-[600px] flex flex-col space-y-4 items-start'
              onSubmit={handleSubmit}>
            {errMessage.length > 0 && <FormAnnounce message={errMessage}/>}
            {isRegisterSucceeded && <FormAnnounce message="Регистрация прошла успешно"
                                                  type='success'
                                                  href='/login'
                                                  linkTitle='Войти в личный кабинет'/>}
            <FormItem label='ОГРН:'
                      htmlName='ogrn'
                      type='text'
                      defaultVal="1137232013533 | 321723200066765"
                      keyUpHandler={(event) => debounceCheck.ogrn(event, !USE_FNS2)}/>
            <FormItem label='Наименование:' htmlName='name' type='text'
                      defaultVal={ogrnUserName}
                      placeholder='Введите ОГРН из ЕГРЮЛ'
                      isDisabled={true}
                      isLoading={isFetchingOGRN}/>
            <FormItem label='Адрес:' htmlName='address' type='text'
                      defaultVal={ogrnUserAddress}
                      placeholder='Введите ОГРН из ЕГРЮЛ'
                      isDisabled={true}
                      isLoading={isFetchingOGRN}/>
            {currentCity && <>
                <FormSelectUnique label='Город:' htmlName='city'
                                  defaultVal={currentCity}
                                  key='city'
                                  options={cities}
                                  changeHandler={(chosenCity => registerFormDispatch({type: 'change-city', payload: {cityId: chosenCity.id}}))}/>
                <FormSelectUnique label='Роль:' htmlName='role' key='role'
                                  options={roles}
                                  changeHandler={chosenRole => registerFormDispatch({type: 'change-role',  payload: {role: chosenRole.name}})}/>

                <FormSelectMultiple label='отходы:' htmlName='waste' key='waste'
                                    options={wastes}
                                    pickHandler={(item, res)=> pickWaste(item, res, wasteTypes)}/>
                {showedWasteTypes.length > 0 && <FormSelectMultiple
                                    label='типы отходы:' htmlName='wasteTypes' key='wasteTypes'
                                     options={showedWasteTypes}
                                     pickHandler={pickWasteType}/>}
            </>}
            <FormItem label='Email:' htmlName='email' type='email' defaultVal="cucumber12@bk.ru" placeholder='Укажите свою почту'/>
            <FormItem label='Телефон:' htmlName='phone' type='phone' defaultVal="+79097378441" placeholder='+7...'/>
            <FormItem label='Web-site:' htmlName='website'
                      type='website' placeholder="www.blabla.com"
                        keyUpHandler={debounceCheck.website}/>
            <FormItemMap changePositionHandler={(chosenPos) =>
                registerFormDispatch({type: 'change-position',  payload: {latitude: chosenPos.lat, longitude: chosenPos.lng}})}/>
            <FormWorkTime workDaysHandler={changeWorkDays}/>
            <FormItem label='Пароль:' htmlName='password' type='password' defaultVal="test1234"/>
            <FormItem label='Подтвердите пароль:' htmlName='confirmPassword' type='password' defaultVal="test1234"/>

            <FormButton title='Зарегистрироваться' typeBtn="submit"
                        isDisabled={isFetching}/>
        </form>
    );
}