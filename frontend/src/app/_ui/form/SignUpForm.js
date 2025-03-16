'use client';
import {useEffect, useState} from "react";
import FormItem from "@/app/_ui/form/FormItem";
import FormButton from "@/app/_ui/form/FormButton";
import {USE_FNS2} from "@/app/_lib/URLS";
import {FormSelectUnique} from "@/app/_ui/form/FormSelectUnique";
import FormSelectMultiple from "@/app/_ui/form/FormSelectMultiple";
import useErrors from "@/app/_hooks/useErrors";
import useDebounce from "@/app/_hooks/useDebounce";
import useFormWastes from "@/app/_hooks/useFormWastes";
import FormItemMap from "@/app/_ui/form/FormItemMap";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import FormWorkTime from "@/app/_ui/form/FormWorkTime";
import useWorkTime from "@/app/_hooks/useWorkTime";
import {signUpAction} from "@/app/_lib/actions/auth";
import FormAnnounce from "@/app/_ui/form/FormAnnounce";
import {Progress, Spinner} from "flowbite-react";
import useSignUpForm from "@/app/_hooks/useSignUpForm";
import {ChevronLeftIcon} from "@heroicons/react/24/outline";
export default function SignUpForm() {
    const {currentUser, setCurrentUser,
        roles, wastes, wasteTypes, currentCity, cities} = useGlobalUIStore((state) => state);

    const [isFetching, setIsFetching] = useState(false);
    const {errMessage, hasError} = useErrors();
    const [isRegisterSucceeded, setIsRegisterSucceeded] = useState(false);

    const {isFetchingOGRN, ogrnUserName, ogrnUserAddress, debounceCheck} = useDebounce(hasError);
    const {signUpForm, signUpFormDispatch, checkStep7, checkFormData,
        getFormObjectWithPassword} = useSignUpForm(hasError);

    useEffect(() => {
        if (currentUser) setCurrentUser(null);
    }, []);

    async function handleForm(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        if(signUpForm.step < 7) {
            await signUpFormDispatch(signUpForm.step, formData);
            return;
        }
        try {
            if(!checkStep7(formData)) return;
            await signUpFormDispatch(signUpForm.step, formData);
            const dataObj = getFormObjectWithPassword(formData);
            const res = checkFormData(formData);
            if(!res.success){
                await signUpFormDispatch(res.data[0]);
                hasError?.('default', 'Заполните обязательные поля');
                return;
            }

            setIsFetching(prev => true);
            const response = await signUpAction(dataObj);
            if (response?.status !== 'success' && response.message !== "NEXT_REDIRECT") {
                throw new Error(response.message);
            } else {
                setIsFetching(prev => false);
                setIsRegisterSucceeded(true);
                await signUpFormDispatch(8);
            }
        } catch (e) {
            setIsFetching(prev => false);
            hasError?.('default', e.message);
        }
    }

    return (
        <FormWrapper progress={signUpForm.progress}
                     errMessage={errMessage}
                     isFetching={isFetching}
                     isRegisterSucceeded={isRegisterSucceeded}
                     handleSubmit={handleForm}>

            {signUpForm.step === 1 && <FormStep1 debounceCheck={debounceCheck.ogrn}
                                                 isFetchingOGRN={isFetchingOGRN}
                                                 ogrnUserAddress={ogrnUserAddress}
                                                 ogrnUserName={ogrnUserName}/>}
            {signUpForm.step === 2 && <FormStep2 currentCity={currentCity}
                                                 cities={cities}
                                                 backHandler={signUpFormDispatch}/>}
            {signUpForm.step === 3 && <FormStep3 roles={roles}
                                                 backHandler={signUpFormDispatch}/>}
            {signUpForm.step === 4 && <FormState4 wastes={wastes}
                                                  wasteTypes={wasteTypes}
                                                  backHandler={signUpFormDispatch}/>}
            {signUpForm.step === 5 && <FormState5 debounceCheckWebsite={debounceCheck.website}
                                                  debounceCheckEmail={debounceCheck.email}
                                                  debounceCheckPhone={debounceCheck.phone}
                                                  backHandler={signUpFormDispatch}/>}
            {signUpForm.step === 6 && <FormState6 hasError={hasError}
                                                  backHandler={signUpFormDispatch}/>}
            {(!isFetching && signUpForm.step === 7) && <FormState7 backHandler={signUpFormDispatch}/>}
            {isFetching && <div className='my-0 mx-auto flex justify-items-center py-2'>
                <Spinner size={"xl"}/>
            </div>}
        </FormWrapper>
    );

}
function FormWrapper({
                         progress = 0,
                         errMessage,
                         handleSubmit,
                         isRegisterSucceeded = false,
                         children}){
    return (
        <div className='flex flex-col space-y-8'>
            {!isRegisterSucceeded && <Progress progress={progress}/>}
            <div className='flex px-10 '>
                <form className='w-[600px] flex flex-col space-y-4 items-start'
                      onSubmit={handleSubmit}>
                    {errMessage.length > 0 && <FormAnnounce message={errMessage}/>}
                    {isRegisterSucceeded && <FormAnnounce message="Регистрация прошла успешно"
                                                          type='success'
                                                          href='/login'
                                                          linkTitle='Войти в личный кабинет'/>}
                    {children}
                </form>
            </div>
        </div>
    );
}
function FormStep1({debounceCheck, ogrnUserName, ogrnUserAddress, isFetchingOGRN}){

    return (
        <>
            <FormTitle title="Введите ОГРН Вашей компании (ОГРНИП для ИП):"
                       showBackIcon={false}/>
            <FormItem label='ОГРН:'
                      htmlName='ogrn'
                      type='text'
                      keyUpHandler={(event) => debounceCheck(event, !USE_FNS2)}/>
            <FormItem label='Наименование:'
                      htmlName='name'
                      type='text'
                      defaultVal={ogrnUserName}
                      placeholder='Введите ОГРН из ЕГРЮЛ'
                      isDisabled={true}
                      isLoading={isFetchingOGRN}/>
            <FormItem label='Адрес:'
                      htmlName='address'
                      type='text'
                      defaultVal={ogrnUserAddress}
                      placeholder='Введите ОГРН из ЕГРЮЛ'
                      isDisabled={true}
                      isLoading={isFetchingOGRN}/>

            <FormButtonContinue conditionDisable={isFetchingOGRN || ogrnUserName === '' || ogrnUserAddress === ''}
                                disableTip="Укажите ОГРН Вашей компании (ИП)"/>
        </>
    );
}
function FormStep2({backHandler, currentCity, cities}){
    const [latitude, setLatitude] = useState( 0);
    const [longitude, setLongitude] = useState( 0);
    const [chosenCity, setChosenCity] = useState(0);

    return (
        <>
            {currentCity && <input type='hidden' name='current-city' value={currentCity.id}/>}
            <input type='hidden' name='chosen-city' value={chosenCity}/>
            <input type='hidden' name='longitude' value={longitude}/>
            <input type='hidden' name='latitude' value={latitude}/>

            <FormTitle title="Укажите местоположение Вашей компании:"
                       backClickHandler={()=> backHandler(1)}/>
            <FormSelectUnique label='Ваш город:' htmlName='city'
                              defaultVal={currentCity}
                              key='city'
                              options={cities}
                              changeHandler={chosenCity =>  setChosenCity(chosenCity.id)}/>

            <FormItemMap isPosSet={!!latitude && !!longitude}
                         changePositionHandler={chosenPos => {
                setLatitude(chosenPos.lat);
                setLongitude(chosenPos.lng)
            }}/>
            <FormButtonContinue conditionDisable={!currentCity || !latitude || !longitude}
                                disableTip="Укажите Ваше местоположение"/>
        </>
    );
}
function FormStep3({roles, backHandler}){
    const [role, setRole] = useState(roles[0]?.name || '');
    return (
        <>
            {role && <input type='hidden'
                            name='role'
                            value={role}/>}
            <div className='flex flex-col w-full'>
                <FormTitle title="Укажите Вашу роль в переработке вторсырья:"
                           backClickHandler={()=> backHandler(2)}/>
                <div className='flex items-center justify-between mt-1 mb-5'>
                    <div className='flex flex-col space-y-2'>
                        <div className='pt-5'>
                            <FormSelectUnique label='Роль:' htmlName='role' key='role'
                                              options={roles}
                                              changeHandler={chosenRole => setRole(prev => chosenRole.name)}/>
                        </div>
                    </div>
                </div>
                <FormButtonContinue conditionDisable={!role}
                                    disableTip="Укажите Вашу Роль в переработке отходов"/>
            </div>
        </>
    );
}
function FormState4({wastes, wasteTypes, backHandler}){
    const {showedWasteTypes, pickWaste, pickWasteType,
        getChosenWastesAndTypes} = useFormWastes(wastes);
    const {wastes: chosenWastes = [], wasteTypes: chosenWastesTypes = []} = getChosenWastesAndTypes();

    return (
        <>
            <input type='hidden' name='wastes' value={chosenWastes}/>
            <input type='hidden' name='wasteTypes' value={chosenWastesTypes}/>
            <FormTitle title="Выберете виды отходов, с которыми Вы работаете:"
                       backClickHandler={()=> backHandler(3)}/>
            <FormSelectMultiple label='отходы:'
                                htmlName='waste'
                                key='waste'
                                options={wastes}
                                pickHandler={(item, res)=> pickWaste(item, res, wasteTypes)}/>
            {showedWasteTypes.length > 0 && (
                <FormSelectMultiple label='типы отходы:'
                                    htmlName='wasteTypes'
                                    key='wasteTypes'
                                    options={showedWasteTypes}
                                    pickHandler={pickWasteType}/>
            )}
            <FormButtonContinue conditionDisable={chosenWastes.length === 0}
                                disableTip="Укажите виды отходов, на которых Вы специализируетесь"/>
        </>
    );
}
function FormState5({debounceCheckWebsite, debounceCheckEmail, debounceCheckPhone, backHandler}){
    return (
        <>
            <FormTitle title="Укажите свои контакты:"
                       backClickHandler={()=> backHandler(4)}/>
            <FormItem label='Email:'
                      htmlName='email'
                      type='email'
                      placeholder='Укажите свою почту'
                      keyUpHandler={debounceCheckEmail}/>
            <FormItem label='Телефон:'
                      htmlName='phone'
                      type='phone'
                      placeholder='+7...'
                      keyUpHandler={debounceCheckPhone}/>
            <FormItem label='Web-site:'
                      htmlName='website'
                      type='website'
                      placeholder="www.e-commerce.com"
                      keyUpHandler={debounceCheckWebsite}/>
            <FormButtonContinue conditionDisable={false}/>
        </>
    );
}
function FormState6({hasError, backHandler}){
    const {getWorkTimeFormData, changeWorkDays} = useWorkTime(hasError);
    const {workingDays, workingHourStart, workingHourEnd} = getWorkTimeFormData();
    return (
        <div className='flex flex-col w-full'>
            <input type='hidden' name='workingDays' value={workingDays}/>
            <input type='hidden' name='workingHourStart' value={workingHourStart}/>
            <input type='hidden' name='workingHourEnd' value={workingHourEnd}/>
            <FormTitle title="Укажите режим работы:"
                       backClickHandler={()=> backHandler(5)}/>
            <FormWorkTime workDaysHandler={changeWorkDays}/>
            <FormButtonContinue conditionDisable={false}/>
        </div>
    );
}
function FormState7({backHandler}){
    return (
        <div className='flex flex-col w-full space-y-4'>
            <FormTitle title="Укажите пароль:"
                       backClickHandler={()=> backHandler(6)}/>
            <FormItem label='Пароль:'
                      htmlName='password'
                      type='password'/>
            <FormItem label='Подтвердите пароль:'
                      htmlName='confirmPassword'
                      type='password'/>
            <FormButton title='Завершить'
                        typeBtn="submit"
                        isDisabled={false}/>
        </div>
    );
}
function FormButtonContinue({conditionDisable = false, disableTip}){
    return (
        <FormButton title='Далее'
                    typeBtn="submit"
                    isDisabled={conditionDisable}
                    disableTip={disableTip}/>
    );
}
function FormTitle({title, showBackIcon = true, backClickHandler = null}){
    const styles = 'flex items-center space-x-1 relative';
    return (
        <div className={showBackIcon ? `${styles} right-6`: `${styles}`}>
            {showBackIcon && <ChevronLeftIcon
                className='w-[24px] cursor-pointer rounded transition ease-out delay-100 hover:bg-stone-100'
                onClick={backClickHandler ? backClickHandler : undefined}/>}
            <h3 className='text-green-50 font-bold'>{title}</h3>
        </div>
    );

}
