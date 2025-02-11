"use client";
import NoDataBanner from "@/app/_ui/general/NoDataBanner";
import TableCompanyName from "@/app/_ui/general/table/TableCompanyName";
import {Badge, Button} from "flowbite-react";
import {advertStatuses, modalName, statusColorsFlowBite} from "@/app/_store/constants";
import TableCompanyWastes from "@/app/_ui/general/table/TableCompanyWastes";
import MapAddressPoint from "@/app/_ui/map/MapAddressPoint";
import TableCompanyDimension from "@/app/_ui/general/table/TableCompanyDimension";
import {useModal} from "@/app/_context/ModalContext";
import {ModalView} from "@/app/_ui/general/ModalView";
import DeliveryStatus from "@/app/_ui/general/DeliveryStatus";
import {useState} from "react";
import FormStatus from "@/app/_ui/form/FormStatus";
import {createDialog, removeResponse, updateResponseByAdvertId} from "@/app/_lib/actions";
import useErrors from "@/app/_hooks/useErrors";
import {useRouter} from "next/navigation";

export default function ResponseDescription({response, userToken, isUser = true, revalidateData = null}){
    const router = useRouter()
    const {currentOpen, close, open} = useModal();
    const {errMessage, hasError} = useErrors();
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const colorIndex = advertStatuses.findIndex(state => state === response.status);

    if(!response) return <NoDataBanner title={`Нет данных об отклике`}/>
    async function deleteResponse(){
        setLoading(prev => true);
        try{
            const res = await removeResponse(+response.id, userToken);
            if(!res?.success){
                throw new Error(res?.message || 'Ошибка удаления отклика')
            }else{
                setLoading(prev => false);
                setSuccess(true);
                setTimeout(()=>{
                    close();
                    router.push('/account/messages/responses');
                }, 1000);
            }
        }catch (e) {
            setLoading(prev => false);
            hasError?.('default', e.message);
            close();
        }
    }
    async function sendLetter(){
        setLoading(prev => true);
        try{
            const res = await createDialog(userToken, response.userId);
            if(!res?.success){
                throw new Error(res?.message || 'Ошибка при создании диалога')
            }else{
                setLoading(prev => false);
                setSuccess(true);
                setTimeout(()=>{
                    close();
                    router.push(`/account/messages/dialogs/${res.data.id}`);
                }, 1000);
            }
        }catch (e) {
            setLoading(prev => false);
            hasError?.('default', e.message);
            close();
        }
    }
    async function updateResponse(isAccepted = true){
        const status = (isAccepted) ? advertStatuses[2] : advertStatuses[1];
        setLoading(prev => true);
        try{
            const res = await updateResponseByAdvertId(userToken, response.advert.id, response.id, status);
            if(!res?.success){
                throw new Error(res?.message || 'Ошибка при согласовании отклика')
            }else{
                await revalidateData?.(false);
                setLoading(prev => false);
                setSuccess(true);
                setTimeout(async ()=>{
                    close();
                }, 1000);
            }
        }catch (e) {
            setLoading(prev => false);
            hasError?.('default', e.message);
        }
    }
    return (
            <ResponseColumn width="w-full pb-2 px-4 ">
                <ResponseColumn width="w-full ">
                    {isUser &&<ResponseRow style=" items-center justify-between">
                        <ResponseTitle title="Публикация на сбыт отходов:"/>
                        <Badge color={statusColorsFlowBite[colorIndex]}
                               className='w-32 py-2 px-3 font-bold'>
                            {response.status}
                        </Badge>
                    </ResponseRow>}
                    {isUser && <TableCompanyName name={response.advert.userName}
                                       role={response.advert.userRole}
                                       height="h-[60px]" width="w-[60px]"
                                       nameFontSize="text-[16px]" roleFontSize="text-[14px]"/>}
                    <ResponseRow className='flex items-start w-full space-x-4'>
                        <ResponseColumn space="space-y-6">
                            <ResponseColumn style={{position: 'relative'}}>
                                {!isUser && <Badge color={statusColorsFlowBite[colorIndex]}
                                                   className=' absolute top-[20px] right-20
                                                   w-32 py-2 px-3 font-bold self-end flex justify-center text-center'>
                                    {response.status}
                                </Badge>}
                                <ResponseRow style=" w-fit space-x-2">
                                    <ResponseSubTitle label="Отходы: "/>
                                    <TableCompanyWastes userWasteId={response.advert.waste} col={false}
                                                        userWasteTypeId={response.advert.wasteType}/>
                                </ResponseRow>
                                <ResponseSubTitle label="Количество: " subTitle={response.advert.amount}/>
                                <div className='flex items-center space-x-2'>
                                    <ResponseSubTitle label="Ед.изм.: "/>
                                    <TableCompanyDimension userDimensionId={response.advert.dimension}/>
                                </div>
                                <ResponseSubTitle label="Цена (руб/шт): " subTitle={response.advert.price}/>
                                <ResponseSubTitle label="Стоимость (руб): " subTitle={response.advert.totalPrice}/>
                                {response.advert.comment && <ResponseSubTitle label="Комментарий автора: " subTitle={response.advert.comment}/>}
                                <ResponseSubTitle label="Последнее обновление: " subTitle={new Date(response.advert.updatedAt).toLocaleDateString()}/>
                                <ResponseSubTitle label="Дата окончания подачи заявок: " subTitle={new Date(response.advert.finishDate).toLocaleDateString()}/>
                            </ResponseColumn>
                            <ResponseColumn>
                                <ResponseTitle title={isUser ? 'Мое предложение:' : 'Предложение участника'}/>
                                {!isUser && <TableCompanyName name={response.userName}
                                                   role={response.userRole}
                                                   height="h-[60px]" width="w-[60px]"
                                                   nameFontSize="text-[16px]" roleFontSize="text-[14px]"/>}
                                <ResponseSubTitle label="Дата подачи: " subTitle={new Date(response.createdAt).toLocaleDateString()}/>
                                <ResponseSubTitle label="Комментарий: " subTitle={response.comment}/>
                                <ResponseSubTitle label="Цена (руб/шт): " subTitle={response.price}
                                                                            advertPrice={response.advert.price}/>
                                <ResponseSubTitle label="Стоимость (руб): " subTitle={response.totalPrice}
                                                  advertPrice={response.advert.totalPrice}/>
                            </ResponseColumn>
                        </ResponseColumn>
                        <ResponseColumn width="w-[60%] ">
                            <ResponseRow>
                                <ResponseSubTitle label="Адрес: "
                                                  subTitle={response.advert.address}
                                                  tag={<br/>} labelStyle=" w-[73%] "/>
                                <DeliveryStatus isPickedUp={response.advert.isPickedUp}
                                                priceWithDelivery={response.advert.priceWithDelivery}/>
                            </ResponseRow>
                            <MapAddressPoint style={{zIndex: '0'}}
                                             address={response.advert.address}
                                             width = 'w-[100%]'
                                             height=' h-[250px]'
                                             zIndex=" z-0"
                                             position={[+response.advert.latitude,  +response.advert.longitude]}/>
                            {isUser ? <Button style={{marginTop: '40px'}}
                                     onClick={() => open(modalName.response)}>
                                Отменить отклик
                            </Button> : (
                                <ResponseRow style={`items-center w-full ${loading ? ' justify-center mt-12 pt-10' : ' justify-between space-x-3'}`}>
                                    <FormStatus isFetching={loading}
                                                errMessage={errMessage}
                                                isRegisterSucceeded={success}
                                                successMessage="Успешно">
                                        <ResponseColumn width="w-full space-y-6 ">
                                            <Button color='green' size="sm"
                                                    style={{marginTop: '40px'}}
                                                    onClick={sendLetter}>
                                                Написать сообщение
                                            </Button>
                                            <ResponseRow style="justify-between space-x-3">
                                                <Button color='gray' className='w-36'
                                                        onClick={()=> updateResponse(false)}>
                                                    Отклонить
                                                </Button>
                                                <Button className='w-36'
                                                        onClick={updateResponse}>
                                                    Принять
                                                </Button>
                                            </ResponseRow>
                                        </ResponseColumn>
                                    </FormStatus>
                                </ResponseRow>
                                )}
                        </ResponseColumn>
                    </ResponseRow>
                </ResponseColumn>
                <ModalView isOpen={currentOpen === modalName.response}
                            title="Сведения о заявке"
                            handleClose={close}>
                    <ResponseRow style=" items-center justify-center w-full">
                        <FormStatus isFetching={loading}
                                    errMessage={errMessage}
                                    isRegisterSucceeded={success} successMessage="Отклик успешно удален">
                            <ResponseColumn width="w-full ">
                                <p>Вы уверены, что хотите отозвать свой отклик на данную заявку?</p>
                                <Button className="self-end"
                                        onClick={deleteResponse}>
                                    Удалить
                                </Button>
                            </ResponseColumn>
                        </FormStatus>
                    </ResponseRow>
                </ModalView>
            </ResponseColumn>
    );
}
function ResponseTitle({title = 'Мое предложение:'}){
    return <h2 className="font-bold text-2xl mb-3">{title}</h2>
}
function ResponseSubTitle({label = 'Комментарий: ', labelStyle = '',
                              subTitle = null, Tag = null, advertPrice = null, }){

    return (advertPrice) ? (
        <div className='flex items-center w-full justify-start space-x-3'>
            <p className={`font-bold ${labelStyle}`}>{label}</p>
            <ResponsePrice fontSize="text-base" advertTotalPrice={advertPrice}
                           responseTotalPrice={+subTitle}/>
        </div>
    ) : (
        <p className={`font-bold ${labelStyle}`}>
            {label}
            {Tag && (
                {Tag}
            )}
            {subTitle && <span className="font-normal">
                {subTitle}
            </span>}
        </p>
    );
}
export function ResponsePrice({responseTotalPrice, advertTotalPrice, fontSize = 'text-sm'}){
    return (
        <Badge className={`w-fit my-0 mx-auto py-1 px-2 text-center ${fontSize}`}
               color={responseTotalPrice > advertTotalPrice ? 'success' :
                   (advertTotalPrice === responseTotalPrice ? 'indigo' : 'failure')}>
            {responseTotalPrice}
        </Badge>
    );
}
function ResponseColumn({children, space = 'space-y-2', width = 'w-fit '}){
    return (
        <div className={`${width} flex flex-col ${space}`}>
            {children}
        </div>
    );
}
function ResponseRow({children, style = 'items-start space-x-2'}){
    return (
        <div className={`flex ${style}`}>
            {children}
        </div>
    );
}