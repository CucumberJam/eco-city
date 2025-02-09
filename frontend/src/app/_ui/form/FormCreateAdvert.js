'use client';
import {useRouter} from "next/navigation";
import {useMemo, useState} from "react";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import useDimensions from "@/app/_hooks/useDimensions";
import useErrors from "@/app/_hooks/useErrors";
import {createAdvertAction} from "@/app/_lib/actions";
import {hasAdvertCreateFormErrors} from "@/app/_lib/data-service";

import {CheckIcon} from "@heroicons/react/24/outline";
import {widthInputAdvertForm} from "@/app/_store/constants";
import {Checkbox, Datepicker, Button, Textarea, ToggleSwitch,Spinner} from "flowbite-react";

import FormButton from "@/app/_ui/form/FormButton";
import {FormSelectUnique} from "@/app/_ui/form/FormSelectUnique";
import FormItem from "@/app/_ui/form/FormItem";
import FormHiddenInput from "@/app/_ui/form/FormHiddenInput";
import FormInputLabel from "@/app/_ui/form/FormInputLabel";
import FormItemMap from "@/app/_ui/form/FormItemMap";
import FormStatus from "@/app/_ui/form/FormStatus";

export default function FormCreateAdvert({userData, userToken}){
    const router = useRouter();
    const {wastes, wasteTypes, currentCity, dimensions} = useGlobalUIStore((state) => state);

    const {errMessage, hasError} = useErrors();
    const [isRegisterSucceeded, setIsRegisterSucceeded] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const [changeAddress, setChangeAddress] = useState(false);
    const [latitude, setLatitude] = useState(Number.parseFloat(userData.latitude));
    const [longitude, setLongitude] = useState( Number.parseFloat(userData.longitude));

    async function handleForm(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const check = hasAdvertCreateFormErrors(formData, currentCity, userData, wasteTypes, hasError);
        if(check.hasErrors || !check?.data) return;
        try{
            setIsFetching(true);
            const response = await createAdvertAction(check.data, userToken);
            if (response?.status !== 'success' && response.message !== "NEXT_REDIRECT") {
                throw new Error(response.message);
            } else {
                setIsFetching(false);
                setIsRegisterSucceeded(true);
                setTimeout(()=>{
                    router.push('/account/messages/adverts');
                }, 500);
            }
        }catch (e) {
            console.log(e);
            setIsFetching(prev => false);
            hasError?.('default', e.message);
        }
    }

    return (
        <>
        <FormStatus isRegisterSucceeded={isRegisterSucceeded}
                    errMessage={errMessage}
                    isFetching={isFetching}>
            <form className='w-[700px] flex flex-col space-y-4 items-end'
                  onSubmit={handleForm}>
                <FormRowBlock>
                    <FormColumnBlock>
                        <FormWasteBlock wastes={wastes}
                                        wasteTypes={wasteTypes}
                                        userDataWastes={userData.wastes}
                                        userDataWasteTypes={userData.wasteTypes}
                                        widthBlock={widthInputAdvertForm}/>
                        <FormDimensionBlock dimensionFromApi={dimensions}
                                            widthBlock={widthInputAdvertForm}/>
                        <FormPriceCountBlock errorHandler={hasError}/>
                        <FormCommentBlock/>
                        <FormFileLoader/>
                    </FormColumnBlock>
                    <FormColumnBlock>
                        <FormDateBlock/>
                        <FormAddressBlock userAddress={userData.address}
                                          needsChangeAddress={changeAddress}
                                          changeAddressHandler={() => setChangeAddress(!changeAddress)}/>
                        <FormHiddenInput name='longitude'
                                         id='longitude'
                                         value={longitude}
                                         changeHandler={setLongitude}/>
                        <FormHiddenInput name='latitude'
                                         id='latitude'
                                         value={latitude}
                                         changeHandler={setLatitude}/>
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
                        <FormButton title='Очистить'
                                    typeBtn="reset"/>
                    </FormColumnBlock>
                    <FormColumnBlock>
                        <FormButton title='Опубликовать'
                                    typeBtn="submit"/>
                    </FormColumnBlock>
                </FormRowBlock>
            </form>
        </FormStatus>
        </>
    );
}
function FormRowBlock({children}) {
    return (
        <div className='self-center w-[90%] flex justify-center space-x-1'>
            {children}
        </div>
    );
}
function FormColumnBlock({children}){
    return (
        <div className='w-full py-2 px-3 h-fit
                        flex flex-col items-center space-y-4'>
            {children}
        </div>
    );
}
function FormWasteBlock({userDataWastes, userDataWasteTypes, wastes, wasteTypes, widthBlock}){
    const userWastes = useMemo(()=>{
        return wastes?.filter(el => userDataWastes?.includes(el.id)) || [];
    }, [userDataWastes?.length]);
    const [chosenWaste, setChosenWaste] = useState(userWastes[0]);

    const [chosenWasteType, setChosenWasteType] = useState(null);


    const userWasteTypes = useMemo(()=>{
        const array = wasteTypes?.filter(el => userDataWasteTypes?.includes(el.id) && +el.typeId === +chosenWaste.id) || [];
        if(array.length > 0) setChosenWasteType(array[0]);
        return array;
    }, [userDataWasteTypes.length, chosenWaste?.id]);

    const styles = {width: `${widthBlock}px`, height: "35px", paddingTop: "0.2rem", borderRadius: "0.3rem"}
    return (
        <>
            <FormSelectUnique label='Вид отходов:'
                              withLabel={false}
                              styleBlock={styles}
                              checkRightPosition={false}
                              htmlName='waste'
                              key='waste'
                              defaultVal={userWastes[0]}
                              options={userWastes}
                              hiddenValue={chosenWaste?.id + ''}
                              changeHandler={(chosenWaste)=> setChosenWaste(chosenWaste)}/>


            {(+chosenWaste?.id === userWasteTypes?.[0]?.typeId) && (
                <FormSelectUnique label='Тип отходов:'
                               withLabel={false}
                               styleBlock={styles}
                               checkRightPosition={false}
                               htmlName='wasteType'
                               key={chosenWaste.id}
                               defaultVal={userWasteTypes[0]}
                               options={userWasteTypes}
                               hiddenValue={chosenWasteType?.id + ''}
                               changeHandler={(chosenWasteType) => setChosenWasteType(chosenWasteType)}/>)}
        </>
    );
}
function FormDimensionBlock({dimensionFromApi, widthBlock}){
    const {dimensions, formDimension, setFormDimension} = useDimensions(dimensionFromApi);
    if(dimensions.length === 0) return null;
    const styles = {width: `${widthBlock}px`, height: "35px", paddingTop: "0.2rem", borderRadius: "0.3rem"}
    return (
        <>
            <FormSelectUnique label='Мера измерения:'
                              withLabel={false} styleBlock={styles}
                               checkRightPosition={false}
                               htmlName='dimension'
                               key='dimension-opt'
                               defaultVal={dimensions[0]}
                               options={dimensions}
                               hiddenValue={formDimension}
                               changeHandler={(chosenDimension)=> setFormDimension(chosenDimension?.id + '')}/>

        </>
    );
}
function FormPriceCountBlock({errorHandler = null}){
    const [amount, setAmount] = useState(1);
    const [price, setPrice] = useState(0.0);
    const [totalPrice, setTotalPrice] = useState(0.0);
    const [isChecked, setIsChecked] = useState(false);
    function changeCalculation(value, type){
        if(errorHandler?.('advert', {type, value: +value})) {
            setIsChecked(false);
            return;
        }
        if(type === 'amount') {
            setAmount(value);
            setTotalPrice(price * value);
        } else {
            setPrice(value);
            setTotalPrice(amount * value);
        }
        setIsChecked(true);
    }
    const style = 'w-[253px] self-start flex items-center'
    return (
        <>
            <div className={style}>
                <CheckIcon style={{width: '25px', color: 'green', marginRight: '8px', opacity: isChecked ? '100%' : '0' }}/>
                <FormItem
                    label='Кол-во:'
                    htmlName='amount'
                    defaultVal={1}
                    type='number'
                    changeHandler={event => changeCalculation(event.target.value, 'amount')}/>
            </div>
            <div className={style}>
                <CheckIcon style={{width: '25px', color: 'green', marginRight: '8px', opacity: isChecked ? '100%' : '0'}}/>
                <FormItem label='Цена (шт.):'
                          htmlName='price'
                          defaultVal={0}
                          type='number' addType="decimal"
                          changeHandler={event => changeCalculation(event.target.value, 'price')}/>
            </div>
            <div className={style}>
                <CheckIcon style={{width: '25px', color: 'green', marginRight: '8px', opacity: isChecked ? '100%' : '0'}}/>
                <FormItem label='Стоимость(руб.):'
                      htmlName='totalPrice'
                      isControlled={true}
                      value={totalPrice}
                      type='number' addType="decimal"
                      isDisabled={true}/>
            </div>
        </>
    );
}
function FormFileLoader(){
    const isChecked = false;
    const style = 'w-[253px] self-start flex items-center'
    return (
        <div className={style}>
            <CheckIcon style={{width: '25px', color: 'green', marginRight: '8px', opacity: isChecked ? '100%' : '0' }}/>
            <FormInputLabel label='Загрузить фото'
                            htmlName='photos'
                            styleWide={true}/>

            <Button size='xs' className='ml-3 w-[50px]'
                    disabled={true}>+</Button>
        </div>
    );
}
function FormAddressBlock({userAddress = '',
                              width = ' w-[220px] ',
                              needsChangeAddress,
                              changeAddressHandler}){

    const [pickedUp, setPickedUp] = useState(true);
    const [notPickedUp, setNotPickedUp] = useState(false);
    const [priceWithDelivery, setPriceWithDelivery] = useState(true);

    const [address, setAddress] = useState(userAddress);

    const styles = `flex flex-col space-y-2 ${width}`;
    function onChange(value, type = 'pickUp'){
        if(type === 'pickUp'){
            setPickedUp(value);
            setNotPickedUp(!value);
        }else{
            setNotPickedUp(value);
            setPickedUp(!value);
        }
    }

    return (
        <div className={styles}>
            <div className='flex flex-col space-y-2'>
               <FormHiddenInput name='isPickedUp'
                                 id='isPickedUp'
                                 value={pickedUp} changeHandler={setPickedUp}/>
                <ToggleSwitch checked={pickedUp} label="Самовывоз"
                              onChange={onChange}/>
                <ToggleSwitch checked={notPickedUp} label="Доставка"
                              onChange={(val)=> onChange(val, 'notPickUp')}/>
            </div>
            {pickedUp && <div className='relative right-2 w-full ml-[5px] mt-3'>
                <FormHiddenInput name='address'
                                 id='address'
                                 value={address}
                                 changeHandler={setAddress}/>
                <FormInputLabel label={pickedUp ? 'Адрес самовывоза:' : 'Адрес доставки:'}
                                htmlName='isPickedUp'
                                styleWide={true}/>
                <Textarea id='address'
                          name="address"
                          value={address}
                          className='min-h-[80px]'
                          disabled={!needsChangeAddress}
                          onChange={(event) => setAddress(event.target.value)}/>
                <div className='flex justify-end items-center my-3'>
                    <Button size="xs" onClick={changeAddressHandler}>
                        {(!needsChangeAddress) ? 'Указать другой' : 'Сохранить адрес'}
                    </Button>
                </div>
            </div>}
            <FormHiddenInput name='priceWithDelivery'
                             id='priceWithDelivery'
                             value={priceWithDelivery}
                             changeHandler={setPriceWithDelivery}/>
            {!pickedUp && <div className='flex items-center'>
                <Checkbox id="priceWithDelivery"
                          defaultChecked
                          className="mr-2"
                          onChange={(event)=> setPriceWithDelivery(event.target.checked)}/>
                <FormInputLabel label='Доставка включена в стоимость'
                                htmlName='isPickedUp'
                                styleWide={true}/>
            </div>}
        </div>
    );
}
function FormDateBlock({width = ' w-[220px]'}){
    const styles = `space-y-2 ${width}`
    const [date, setDate] = useState(new Date());
    function changeDate(dateType){
        setDate(dateType);
    }
    return (
        <div className={styles}>
            <FormInputLabel label='Срок приема заявок:'
                            htmlName='finishDate'
                            styleWide={true}/>
            <FormHiddenInput name='finishDate'
                             value={date}
                             changeHandler={e=> setDate(e.target.value)}/>
            <Datepicker  language={'ru'}
                         labelTodayButton="Сегодня"
                         labelClearButton="Отменить"
                         weekStart={1}
                         onChange={changeDate}/>
        </div>
    );
}
function FormCommentBlock({width = ' w-[253px]'}){
    const [comment, setComment] = useState('');
    const styles = `pl-[30px] self-start flex flex-col space-y-2 ${width}`
    return (
        <div className={styles}>
            <FormInputLabel label='Комментарии:'
                            htmlName='comment'
                            styleWide={true}/>
            <FormHiddenInput name='comment'
                             value={comment}
                             changeHandler={setComment}/>
            <Textarea id='comment' placeholder="..."
                      value={comment}
                      onChange={e=> setComment(e.target.value)}/>

        </div>
    );
}
function FormMapBlock({latitude, latitudeHandler, longitude, longitudeHandler}){
    return <div className="w-[90%]">
        <FormItemMap isPosSet={!!latitude && !!longitude}
                     pickedUpPos={[latitude, longitude]}
                     changePositionHandler={chosenPos => {
                         latitudeHandler(+chosenPos?.lat || 0);
                         longitudeHandler(+chosenPos?.lng  || 0)
                     }}/>
    </div>
}