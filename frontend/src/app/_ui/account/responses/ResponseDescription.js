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
import {removeResponse} from "@/app/_lib/actions";
import useErrors from "@/app/_hooks/useErrors";
import {useRouter} from "next/navigation";

export default function ResponseDescription({response, userToken}){
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

    return (
            <ResponseColumn width="w-full py-2 px-4 ">
                <ResponseColumn width="w-full ">
                    <ResponseRow style=" items-center justify-between">
                        <ResponseTitle title="Публикация на сбыт отходов:"/>
                        <Badge color={statusColorsFlowBite[colorIndex]}
                               className='w-32 py-2 px-3 font-bold'>
                            {response.status}
                        </Badge>
                    </ResponseRow>
                    <TableCompanyName name={response.advert.userName}
                                      role={response.advert.userRole}
                                      height="h-[60px]" width="w-[60px]"
                                      nameFontSize="text-[16px]" roleFontSize="text-[14px]"/>
                    <ResponseRow className='flex items-start w-full space-x-4'>
                        <ResponseColumn space="space-y-6">
                            <ResponseColumn>
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
                                <ResponseSubTitle label="Комментарий автора: " subTitle={response.advert.comment}/>
                                <ResponseSubTitle label="Последнее обновление: " subTitle={new Date(response.advert.updatedAt).toLocaleDateString()}/>
                                <ResponseSubTitle label="Дата окончания подачи заявок: " subTitle={new Date(response.advert.finishDate).toLocaleDateString()}/>
                            </ResponseColumn>
                            <ResponseColumn>
                                <ResponseTitle/>
                                <ResponseSubTitle label="Дата подачи: " subTitle={new Date(response.createdAt).toLocaleDateString()}/>
                                <ResponseSubTitle label="Комментарий: " subTitle={response.comment}/>
                                <ResponseSubTitle label="Цена (руб/шт): " subTitle={response.price}/>
                                <ResponseSubTitle label="Стоимость (руб): " subTitle={response.totalPrice}/>
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
                            <Button style={{marginTop: '40px'}}
                                    onClick={()=> open(modalName.response)}>
                                Отменить отклик
                            </Button>
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
                              subTitle = null, Tag = null}){
    return (
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