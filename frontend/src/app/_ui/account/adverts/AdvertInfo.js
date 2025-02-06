"use client";
import {useRouter} from "next/navigation";
import {useState} from "react";
import useErrors from "@/app/_hooks/useErrors";
import {prepareName} from "@/app/_lib/helpers";
import {createResponseAction} from "@/app/_lib/actions";

import {Textarea} from "flowbite-react";
import UserRoleCircle from "@/app/_ui/general/userRoleCircle";
import FormItem from "@/app/_ui/form/FormItem";
import FormInputLabel from "@/app/_ui/form/FormInputLabel";
import FormButton from "@/app/_ui/form/FormButton";
import MapAddressPoint from "@/app/_ui/map/MapAddressPoint";
import FormStatus from "@/app/_ui/form/FormStatus";

const wrapStyles = `space-y-6 text-base
                        leading-relaxed
                        text-gray-500
                        dark:text-gray-400
                        flex flex-col items-center w-full`;
const col = 'flex flex-col';
const rowSpace = "flex items-center justify-center space-x-2";
const cardBlockStyles = 'flex items-center justify-between';

export default function AdvertInfo({
                                       advert,
                                       wastesAPI, wasteTypesAPI,
                                       dimensionsAPI, rolesAPI,
                                       token,
                                   }){
    const router = useRouter();

    const wasteName = prepareName(wastesAPI?.find(el => +el.id === +advert.waste)?.name || '');
    const wasteTypeName = prepareName(wasteTypesAPI.find(el => +el.id === +advert?.wasteType)?.name || '');
    const userDimensionLabel = dimensionsAPI.find(el => +el.id === +advert.dimension).shortName;
    const roleName = prepareName(rolesAPI.find(el => el.name === advert.userRole).label)

    const {errMessage, hasError} = useErrors();
    const [isRegisterSucceeded, setIsRegisterSucceeded] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    async function sendResponse(event){
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const price = formData.get('price');
        if(hasError('advert', {type: 'price', value: Number(price)})) return;
        const totalPrice = formData.get('totalPrice');
        const comment = formData.get('comment');
        const data = {
            advertId: +advert.id,
            price: parseFloat(+price),
            totalPrice: parseFloat(+totalPrice),
            comment
        }
        try{
            setIsFetching(true);
            const response = await createResponseAction(data, token);
            setIsFetching(false);
            if (response?.status !== 'success' && response.message !== "NEXT_REDIRECT") {
                throw new Error(response.message);
            } else {
                setIsRegisterSucceeded(true);
                setTimeout(()=>{
                    router.push('/account/messages/responses');
                }, 500);
            }
        }catch (e) {
            console.log(e);
            setIsFetching(prev => false);
            hasError?.('default', e.message);
        }

    }

    return (
        <div className={wrapStyles}>
            <FormStatus isRegisterSucceeded={isRegisterSucceeded}
                        errMessage={errMessage}
                        isFetching={isFetching}>
                    <AdvertCard name={advert.userName}
                                role={roleName}
                                address={advert.address}
                                waste={wasteName} wasteType={wasteTypeName}
                                amount={advert.amount}
                                dimension={userDimensionLabel}
                                price={advert.price} totalPrice={advert.totalPrice}
                                finishDate={advert.finishDate}
                                isPickedUp={advert.isPickedUp} priceWithDelivery={advert.priceWithDelivery}/>

                    <div className={`flex items-start w-full ${advert.isPickedUp ? 'justify-between' : 'justify-center'}`}>
                        {advert.isPickedUp &&  <div>
                            <MapAddressPoint position={[+advert?.latitude, +advert?.longitude]}
                                             address={advert.address} width='w-[330px]'
                                             height='h-[300px]'/>
                        </div>}
                        <AdvertResponse amount={advert.amount}
                                        action={sendResponse}/>
                    </div>
            </FormStatus>
        </div>
    );
}
function AdvertCard({
                        name, role, address,
                        waste, wasteType = null,
                        amount, dimension,
                        price, totalPrice,
                        finishDate,
                        isPickedUp, priceWithDelivery
                    }){
    return (
        <div className={`w-full text-sm ${col} border border-gray-200 py-4 px-2 rounded`}>
            <div className={`space-x-2 ${cardBlockStyles}`}>

                <div className={`w-[45%] self-start ${rowSpace}`}>
                    <UserRoleCircle role={role}
                                    height='h-[35px]'
                                    width='w-[35px]'/>
                    <div className={`${col} justify-center`}>
                        <p className="font-bold">{name}</p>
                        <span className="text-gray-500">{role}</span>
                    </div>
                </div>

                <div className={`relative ${col}`}>
                    <p className={`absolute text-base z-2 top-[-2px] right-1 italic font-bold ${isPickedUp ? 'text-blue-500' : 
                        (priceWithDelivery ? 'text-primary-10' : 'text-red-10')}`}>
                        {isPickedUp ? 'Самовывоз' :
                        (priceWithDelivery ?
                            'Доставка включена в стоимость' :
                            'Доставка не включена в стоимость')}
                    </p>
                    <AdvertCardItem title="Адрес:"
                                    value={address}/>
                </div>

            </div>

            <div className={`space-x-4 flex justify-between items-start mt-4`}>
                <div className={`w-full space-x-2 flex justify-between items-start`}>
                    <AdvertCardItem title="Вид отходов:"
                                    value={waste}
                                    addValue={wasteType}
                                    />
                    <AdvertCardItem title="Цена:"
                                    value={price + ' руб.'}
                                    textCentered={true}/>
                    <AdvertCardItem title="Кол-во:"
                                    value={amount}
                                    textCentered={true}/>
                    <AdvertCardItem title="Ед.изм.:"
                                    value={dimension}
                                    textCentered={true}/>

                </div>

                <div className={`w-full flex justify-end space-x-2`}>
                    <AdvertCardItem title="Стоимость:"
                                    value={totalPrice + ' руб.'}/>
                    <AdvertCardItem title="Срок подачи заявки:"
                                    value={new Date(finishDate).toLocaleDateString()}/>
                </div>

            </div>
        </div>
    );
}
function AdvertCardItem({title, value, addValue = null, textCentered = false}){
    return (
        <div className={col}>
            <p className="text-base text-gray-500">{title}</p>
            <p className={`font-bold ${textCentered ? 'text-center' : 'text-left'}`}>{value}</p>
            {addValue && <span className={`${textCentered ? 'text-center' : 'text-left'}`}>
                {addValue}
            </span>
            }
        </div>
    );
}

function AdvertResponse({amount = 1, action}){
    const [price, setPrice] = useState(1.00);
    const [totalPrice, setTotalPrice] = useState(1.00);
    const [comment, setComment] = useState('');
    function calculate(value){
        if(Number(value) < 0) return;
        setPrice(Number(value));
        setTotalPrice(amount * value);
    }
    return (
        <form onSubmit={action}
              className="flex flex-col space-y-1  w-[250px] h-full">
            <h5 className="text-black font-bold">Укажите свое предложение:</h5>
            <FormItem label='Цена (шт.):'
                      htmlName='price'
                      defaultVal={price}
                      type='number' addType="decimal"
                      changeHandler={event => calculate(event.target.value)}/>
            <FormItem
                label='Стоимость (руб.):'
                htmlName='totalPrice' type='number' addType="decimal"
                isDisabled={true}
                isControlled={true}
                value={totalPrice}
                changeHandler={setTotalPrice}/>

            <FormInputLabel label='Комментарии:'
                            htmlName='comment'
                            styleWide={true}/>
            <Textarea id='comment' placeholder="..."
                      name="comment"
                      value={comment}
                      onChange={event => setComment(event.target.value)}/>

            <div className="h-10"></div>

            <FormButton title='Откликнуться'
                        typeBtn="submit"
                        size=' py-2 px-10 '/>
        </form>
    );
}
