'use client';
import {useRouter} from "next/navigation";
import {useEffect, useMemo, useState} from "react";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import useDimensions from "@/app/_hooks/useDimensions";
import useErrors from "@/app/_hooks/useErrors";
import {createAdvert, updateAdvert} from "@/app/_lib/actions/adverts";
import {hasAdvertCreateFormErrors} from "@/app/_lib/data-service";
import {prepareName} from "@/app/_lib/helpers";

import {CheckIcon} from "@heroicons/react/24/outline";
import {widthInputAdvertForm} from "@/app/_store/constants";
import {Checkbox, Datepicker, Button, Textarea, ToggleSwitch} from "flowbite-react";

import FormButton from "@/app/_ui/form/FormButton";
import {FormSelectUnique} from "@/app/_ui/form/FormSelectUnique";
import FormItem from "@/app/_ui/form/FormItem";
import FormHiddenInput from "@/app/_ui/form/FormHiddenInput";
import FormInputLabel from "@/app/_ui/form/FormInputLabel";
import FormItemMap from "@/app/_ui/form/FormItemMap";
import FormStatus from "@/app/_ui/form/FormStatus";

export default function AdvertForm({
                                       isEdit = false,
                                       dataObject,
                                       btnLeftLabel = 'Очистить',
                                       btnRightLabel = 'Опубликовать',
                                       successMessage = 'Отклик на заявку направлен'

}){
    const router = useRouter();
    const {wastes, wasteTypes, currentCity, dimensions} = useGlobalUIStore((state) => state);
    const {errMessage, hasError} = useErrors();
    const [isRegisterSucceeded, setIsRegisterSucceeded] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const [changeAddress, setChangeAddress] = useState(false);

    const [latitude, setLatitude] = useState(Number.parseFloat(dataObject.latitude));
    const [longitude, setLongitude] = useState( Number.parseFloat(dataObject.longitude));

    const currentWasteLabel = dataObject?.waste ? prepareName(wastes.find(el => el.id === dataObject.waste).name) : null;
    const currentWasteTypeLabel = dataObject?.wasteType ? prepareName(wasteTypes.find(el => el.id === dataObject.wasteType).name) : null;
    async function handleForm(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const check = hasAdvertCreateFormErrors(formData, currentCity, dataObject, wasteTypes, hasError);
        if(check.hasErrors || !check?.data) return;
        try{
            setIsFetching(true);
            const response = isEdit ? await updateAdvert(check.data, dataObject.id) : await createAdvert(check.data);
            if(response?.success){
                setIsFetching(false);
                setIsRegisterSucceeded(true);
                setTimeout(()=>{
                    router.push('/account/messages/adverts');
                }, 1000);
            }
            else if (!response?.success && response.message !== "NEXT_REDIRECT") {
                throw new Error(response.message);
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
                        successMessage={successMessage}
                        isFetching={isFetching}>
                <form className='w-[700px] flex flex-col space-y-4 items-end'
                      onSubmit={handleForm}>
                    <FormRowBlock>
                        <FormColumnBlock>
                            {!isEdit ? <FormWasteBlock wastes={wastes}
                                             wasteTypes={wasteTypes}
                                             userDataWastes={dataObject.wastes}
                                             userDataWasteTypes={dataObject.wasteTypes}
                                             widthBlock={widthInputAdvertForm}/> :
                            <>
                                <FormItem label='Отходы:'
                                          width='w-[220px]'
                                          htmlName='waste'
                                          value={+dataObject?.waste}
                                          defaultVal={currentWasteLabel}
                                          isDisabled={true}/>
                                {dataObject?.wasteType && <FormItem label='Вид отходов:'
                                           width='w-[220px]'
                                           htmlName='wasteType'
                                           value={+dataObject?.wasteType}
                                           defaultVal={currentWasteTypeLabel}
                                           isDisabled={true}/>}
                            </>}
                            <FormDimensionBlock dimensionFromApi={dimensions}
                                                widthBlock={widthInputAdvertForm}
                                                currentDimensionId={dataObject?.dimension}/>
                            <FormPriceCountBlock currentPrice={parseFloat(dataObject?.price) || null}
                                                 currentAmount={parseInt(dataObject?.amount) || null}
                                                 currentTotalPrice={parseFloat(dataObject?.totalPrice) || null}
                                                 errorHandler={hasError}/>
                            <FormCommentBlock currentComment={dataObject?.comment}/>
                            <FormFileLoader/>
                        </FormColumnBlock>
                        <FormColumnBlock>
                            <FormDateBlock currentDate={dataObject?.finishDate}/>
                            <FormAddressBlock userAddress={dataObject.address}
                                              currentPickedUp={dataObject?.isPickedUp}
                                              currentPriceWithDelivery={dataObject?.priceWithDelivery}
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
                            <FormButton title={btnLeftLabel}
                                        typeBtn="reset"/>
                        </FormColumnBlock>
                        <FormColumnBlock>
                            <FormButton title={btnRightLabel}
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
function FormDimensionBlock({dimensionFromApi, widthBlock, currentDimensionId = null}){
    const {dimensions, formDimension, setFormDimension} = useDimensions(dimensionFromApi, currentDimensionId);
    if(dimensions.length === 0) return null;
    const styles = {width: `${widthBlock}px`, height: "35px", paddingTop: "0.2rem", borderRadius: "0.3rem"}
    return (
        <>
            <FormSelectUnique label='Мера измерения:'
                              withLabel={false} styleBlock={styles}
                              checkRightPosition={false}
                              htmlName='dimension'
                              key='dimension-opt'
                              defaultVal={dimensionFromApi.find(el => el.id === +formDimension)}
                              options={dimensions}
                              hiddenValue={currentDimensionId ? currentDimensionId : formDimension}
                              changeHandler={(chosenDimension)=> setFormDimension(chosenDimension?.id + '')}/>

        </>
    );
}
function FormPriceCountBlock({
                                 errorHandler = null,
                                 currentAmount = null,
                                 currentPrice = null,
                                 currentTotalPrice = null
}){
    const [amount, setAmount] = useState(currentAmount ? currentAmount : 1);
    const [price, setPrice] = useState(currentPrice ? currentPrice : 0.0);
    const [totalPrice, setTotalPrice] = useState(currentTotalPrice ? currentTotalPrice : 0.0);
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
                    defaultVal={amount}
                    type='number'
                    changeHandler={event => changeCalculation(event.target.value, 'amount')}/>
            </div>
            <div className={style}>
                <CheckIcon style={{width: '25px', color: 'green', marginRight: '8px', opacity: isChecked ? '100%' : '0'}}/>
                <FormItem label='Цена (шт.):'
                          htmlName='price'
                          defaultVal={price}
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
function FormAddressBlock({
                              userAddress = '',
                              currentPickedUp = null,
                              currentPriceWithDelivery = null,
                              width = ' w-[220px] ',
                              needsChangeAddress,
                              changeAddressHandler}){

    const [pickedUp, setPickedUp] = useState(true);
    const [notPickedUp, setNotPickedUp] = useState(false);
    const [priceWithDelivery, setPriceWithDelivery] = useState(true);

    const [address, setAddress] = useState(userAddress);

    useEffect(()=>{
        if(currentPickedUp === true || currentPickedUp === false){
            setPickedUp(currentPickedUp);
            setNotPickedUp(!currentPickedUp);
        }
    }, [currentPickedUp]);

    useEffect(() => {
        if(currentPriceWithDelivery === true || currentPriceWithDelivery === false){
            setPriceWithDelivery(currentPriceWithDelivery);
        }
    }, [currentPriceWithDelivery]);
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
                          defaultChecked={priceWithDelivery}
                          className="mr-2"
                          onChange={(event)=> setPriceWithDelivery(event.target.checked)}/>
                <FormInputLabel label='Доставка включена в стоимость'
                                htmlName='isPickedUp'
                                styleWide={true}/>
            </div>}
        </div>
    );
}
function FormDateBlock({width = ' w-[220px]', currentDate = null}){
    const today = new Date();

    const styles = `space-y-2 ${width}`
    const [date, setDate] = useState(currentDate ? new Date(Date.parse(currentDate)) : today);
    function changeDate(dateType){
        setDate(dateType);
    }
    return (
        <div className={styles}>
            <FormInputLabel label='Срок приема заявок:'
                            htmlName='finishDate'
                            styleWide={true}/>
            <FormHiddenInput name='finishDate'
                             type='date'
                             value={today > date ? today : date}
                             changeHandler={e=> setDate(e.target.value)}/>
            <Datepicker  language={'ru'}
                         minDate={today}
                         value={today > date ? today : date}
                         labelTodayButton="Сегодня"
                         labelClearButton="Отменить"
                         weekStart={1}
                         onChange={changeDate}/>
        </div>
    );
}
function FormCommentBlock({width = ' w-[253px]', currentComment = null}){
    const [comment, setComment] = useState(currentComment ? currentComment : '');
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