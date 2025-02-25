"use client";
import useErrors from "@/app/_hooks/useErrors";
import {useEffect, useState} from "react";
import FormStatus from "@/app/_ui/form/FormStatus";
import FormButton from "@/app/_ui/form/FormButton";
import FormColumnBlock from "@/app/_ui/form/FormColumnBlock";
import FormRowBlock from "@/app/_ui/form/FormRowBlock";
import FormItem from "@/app/_ui/form/FormItem";
import {Button} from "flowbite-react";
import Column from "@/app/_ui/general/Column";
import {fetchCompanyByOGRN} from "@/app/_lib/actions/global";
import {getNameAddress, getUserWorkTime, prepareName} from "@/app/_lib/helpers";
import {FormSelectUnique} from "@/app/_ui/form/FormSelectUnique";
import useRolesWastes from "@/app/_hooks/useRolesWastes";
import {getAdvertsOfUser} from "@/app/_lib/actions/adverts";
import {showUserAdverts, showUserResponses, workingDays as defaultWorkDays} from "@/app/_store/constants";
import {getResponsesOfUser} from "@/app/_lib/actions/responses";
import FormAnnounce from "@/app/_ui/form/FormAnnounce";
import FormSelectMultiple from "@/app/_ui/form/FormSelectMultiple";
import useFormWastes from "@/app/_hooks/useFormWastes";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import useDebounce from "@/app/_hooks/useDebounce";
import FormMapBlock from "@/app/_ui/form/FormMapBlock";
import FormHiddenInput from "@/app/_ui/form/FormHiddenInput";
import FormWorkTime from "@/app/_ui/form/FormWorkTime";
import useWorkTime from "@/app/_hooks/useWorkTime";

export default function EditForm({userData}){
    const {errMessage, hasError} = useErrors();
    const [isDisabled, setIsDisabled] = useState(true);
    const [warning, setWarning] = useState('');
    const [isRegisterSucceeded, setIsRegisterSucceeded] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const [changeAddress, setChangeAddress] = useState(false);
    const [latitude, setLatitude] = useState(userData?.latitude ? Number.parseFloat(userData.latitude) : 0);
    const [longitude, setLongitude] = useState(userData?.latitude ? Number.parseFloat(userData.longitude)  : 0);

    useEffect( () => {
        const messages = [];
        async function check() {
            if (showUserAdverts(userData.role)) {
                const res = await getAdvertsOfUser();
                const {success, data} = res;
                if (success && data.count > 0) messages.push('публикации');
            }
            if (showUserResponses(userData.role)) {
                const res = await getResponsesOfUser();
                const {success, data} = res;
                if (success && data.count > 0) messages.push('отклики');
            }
            return messages;
        }

        check().then(res => {
            if(res.length === 0){
                setIsDisabled(false);
            }else {
                const message = `У вас имеются активные ${messages.join(', ')}, поэтому Вы не можете изменить роль, город или отключить имеющиеся отходы`
                setWarning(message);
            }
        }).catch(err => hasError('default', err.message));
    }, []);
    async function handleForm(event){
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = formData.get('name');
        console.log(name)
        const address = formData.get('address');
        console.log(address)
        const latitude = formData.get('latitude');
        const longitude = formData.get('longitude');
        console.log(latitude)
        console.log(userData.latitude)
        console.log(longitude)
        console.log(userData.longitude)
    }

    return (
        <>
        {(isDisabled && warning) && <FormAnnounce type='warning' message={warning}/>}
        <FormStatus isRegisterSucceeded={isRegisterSucceeded}
                    errMessage={errMessage}
                    successMessage='Данные успешно изменены'
                    isFetching={isFetching}>
            <form className='m-auto flex flex-col space-y-4 items-end pb-2'
                  onSubmit={handleForm}>
                <FormRowBlock>
                    <FormColumnBlock>
                        <FormNameAddressBlock ogrnUserName={userData.name}
                                              ogrnUserAddress={userData.address}
                                              userOgrn={userData.ogrn}
                                              errorHandler={hasError}/>
                        <FormRoleBlock userRole={userData.role}
                                       isDisabled={isDisabled}/>
                        <FormWastesBlock userWastes={userData.wastes}
                                         userWasteTypes={userData.wasteTypes}
                                         isDisabled={isDisabled}/>
                        <FormPhoneEmailWeb userPhone={userData.phone}
                                           userEmail={userData.email}
                                           userWeb={userData.email}
                                           errorHandler={hasError}/>
                    </FormColumnBlock>
                    <FormColumnBlock>
                        <FormMapPosition userCityId={userData.cityId}
                                         needsChangeAddress={changeAddress}
                                         changeAddressHandler={() => setChangeAddress(!changeAddress)}
                                         isDisabled={false}/>
                        <FormHiddenInput value={longitude} name='longitude' />
                        <FormHiddenInput value={latitude} name='latitude' />
                        <FormWork userWorkDays={userData.workingDays}
                                  userWorkStarts={userData.workingHourStart}
                                  userWorkEnds={userData.workingHourEnd}
                                  errorHandler={hasError}/>
                    </FormColumnBlock>
                </FormRowBlock>
                {changeAddress && (
                    <FormRowBlock>
                        <FormMapBlock latitude={latitude}
                                      latitudeHandler={setLatitude}
                                      longitude={longitude}
                                      longitudeHandler={setLongitude}/>
                    </FormRowBlock>
                )}
                <FormRowBlock>
                    <FormColumnBlock>
                        <FormButton title='Отмена'
                                    typeBtn="reset"/>
                    </FormColumnBlock>
                    <FormColumnBlock>
                        <FormButton title='Сохранить'
                                    typeBtn="submit"/>
                    </FormColumnBlock>
                </FormRowBlock>
            </form>
        </FormStatus>
        </>
    );
}
function FormNameAddressBlock({ogrnUserName, ogrnUserAddress, userOgrn, errorHandler}){
    const [isFetching, setIsFetching] = useState(false)
    const [userName, setUserName] = useState(ogrnUserName)
    const [userAddress, setUserAddress] = useState(ogrnUserAddress)
    async function updateAddressAndName(){
        setIsFetching(true);
        const res = await fetchCompanyByOGRN(userOgrn);
        if(res.success){
            const [name, address] = getNameAddress(res.data, userOgrn.length === 13);
            if(userName !== name) setUserName(name);
            if(userAddress !== address) setUserAddress(address);
        }else{
            errorHandler('default', res.message);
        }
        setIsFetching(false);
    }
    return (
        <Column width={'w-fit items-start border-b border-b-gray-400 pb-3'}>
            <FormItem label='Наименование:'
                      htmlName='name'
                      type='text'
                      defaultVal={userName}
                      placeholder='Введите ОГРН из ЕГРЮЛ'
                      isDisabled={true}
                      value={userName}
                      isControlled={true}
                      changeHandler={setUserName}
                      isLoading={isFetching}/>
            <FormItem label='Адрес:'
                      htmlName='address'
                      type='text'
                      defaultVal={userAddress}
                      placeholder='Введите ОГРН из ЕГРЮЛ'
                      isDisabled={true}
                      isControlled={true}
                      value={userAddress}
                      changeHandler={setUserAddress}
                      isLoading={isFetching}/>
            <div className='flex justify-end items-center my-3'>
                <Button size="xs" onClick={updateAddressAndName}
                        disabled={isFetching}>
                    Обновить данные из ЕГРЮЛ
                </Button>
            </div>
        </Column>
    );
}

function FormRoleBlock({userRole, isDisabled}){
    const {roles} = useRolesWastes();
    const [role, setRole] = useState('');
    const label = prepareName(roles.find(el => el.name === userRole)?.label);

    return (
        <>
            {isDisabled ? (
                    <FormItem label='Ваша роль'
                           htmlName='waste'
                           defaultVal={label}
                           isDisabled={true}/>
                ) : (
                <FormSelectUnique label='Роль:'
                                  htmlName='role'
                                  key='role'
                                  options={roles}
                                  changeHandler={chosenRole => setRole(prev => chosenRole.name)}/>
                )}
        </>
    );
}

function FormWastesBlock({userWastes, userWasteTypes, isDisabled}){
    const {wastes, wasteTypes} = useGlobalUIStore((state) => state);
    const {showedWasteTypes, pickWaste, pickWasteType,
        getChosenWastesAndTypes} = useFormWastes(isDisabled ? wastes.filter(el => !userWastes.includes(el.id)): wastes);
    const {wastes: chosenWastes = [], wasteTypes: chosenWastesTypes = []} = getChosenWastesAndTypes();
    return (
        <>
            <input type='hidden' name='wastes' value={chosenWastes}/>
            <input type='hidden' name='wasteTypes' value={chosenWastesTypes}/>
            <FormSelectMultiple label='отходы:'
                                htmlName='waste'
                                key='waste'
                                styleBlock={{width: '200px', margin: '0 auto'}}
                                options={isDisabled ?
                                    wastes.filter(el => !userWastes.includes(el.id)): wastes}
                                pickHandler={(item, res)=>
                                    pickWaste(item, res, isDisabled ?
                                        wasteTypes.filter(el => !userWasteTypes.includes(el.id)): wasteTypes)}/>
            {showedWasteTypes.length > 0 && (
                <FormSelectMultiple label='типы отходы:'
                                    htmlName='wasteTypes'
                                    key='wasteTypes'
                                    styleBlock={{width: '200px', margin: '0 auto'}}
                                    options={showedWasteTypes}
                                    pickHandler={pickWasteType}/>
            )}
        </>
    );
}

function FormPhoneEmailWeb({errorHandler, userEmail, userPhone, userWeb}){
    const {debounceCheck} = useDebounce(errorHandler);
    return (
        <>
            <FormItem label='Email:'
                      htmlName='email'
                      type='email'
                      defaultVal={userEmail}
                      placeholder='Укажите свою почту'
                      keyUpHandler={debounceCheck.email}/>
            <FormItem label='Телефон:'
                      htmlName='phone'
                      type='phone'
                      defaultVal={userPhone}
                      placeholder='+7...'
                      keyUpHandler={debounceCheck.phone}/>
            <FormItem label='Web-site:'
                      htmlName='website'
                      type='website'
                      defaultVal={userWeb && userWeb}
                      placeholder="www.e-commerce.com"
                      keyUpHandler={debounceCheck.website}/>
        </>
    );
}

function FormMapPosition({userCityId, isDisabled,
                                 needsChangeAddress,
                                 changeAddressHandler}){
    const {currentCity, cities} = useGlobalUIStore((state) => state);
    const [chosenCity, setChosenCity] = useState(+userCityId);
    const userCityName = cities.find(el => el.id === userCityId).name;

    return (
        <>
            {isDisabled ? <FormItem label='Ваш город:'
                       htmlName='city'
                       type='text'
                       defaultVal={userCityName}
                       value={userCityName}
                       isDisabled={true}
                       isControlled={true}/>
            : <FormSelectUnique label='Ваш город:' htmlName='city'
                                style={{marginTop: 0}}
                              defaultVal={currentCity}
                              hiddenValue={chosenCity}
                              key='city'
                              options={cities}
                              changeHandler={chosenCity =>  setChosenCity(chosenCity.id)}/>
            }
            <div className='w-full flex justify-end items-center my-3 border-b border-b-gray-400 pb-8'>
                <Button size="xs" onClick={changeAddressHandler}>
                    {(!needsChangeAddress) ? 'Указать новое местоположение' : 'Сохранить адрес'}
                </Button>
            </div>
            <input type='hidden' name='chosen-city' value={chosenCity}/>
        </>
    );
}

function FormWork({errorHandler, userWorkDays, userWorkStarts, userWorkEnds}){
    const [isShow, setIsShown]= useState(false);
    const {getWorkTimeFormData, changeWorkDays} = useWorkTime(errorHandler, getUserWorkTime(userWorkDays, userWorkStarts, userWorkEnds));
    const {workingDays, workingHourStart, workingHourEnd} = getWorkTimeFormData();
    const options = defaultWorkDays.map((el, inx) => ({...el, checked: userWorkDays.includes(el.id - 1)}))
 return (
     <>
         {isShow && <FormWorkTime workDaysHandler={changeWorkDays}
                                  optionsProps={options}
                                  startTimes={userWorkStarts}
                                  endTimes={userWorkEnds}/>}
         <div className='w-full flex justify-end items-center my-3 border-b border-b-gray-400 pb-8'>
             <Button size="xs" onClick={() => setIsShown(!isShow)}>
                 {(!isShow) ? 'Изменить рабочее время' : 'Сохранить рабочее время'}
             </Button>
         </div>
         <input type='hidden' name='workingDays' value={workingDays}/>
         <input type='hidden' name='workingHourStart' value={workingHourStart}/>
         <input type='hidden' name='workingHourEnd' value={workingHourEnd}/>
     </>
 );
}