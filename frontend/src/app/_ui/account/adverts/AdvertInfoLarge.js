import Title from "@/app/_ui/general/Title";
import Row from "@/app/_ui/general/Row";
import TableCompanyName from "@/app/_ui/general/table/TableCompanyName";
import Column from "@/app/_ui/general/Column";
import Subtitle from "@/app/_ui/general/Subtitle";
import TableCompanyWastes from "@/app/_ui/general/table/TableCompanyWastes";
import TableCompanyDimension from "@/app/_ui/general/table/TableCompanyDimension";
import DeliveryStatus from "@/app/_ui/general/DeliveryStatus";
import MapAddressPoint from "@/app/_ui/map/MapAddressPoint";
import Status from "@/app/_ui/general/Status";

export default function AdvertInfoLarge({
                                            advert,
                                            isUser,
                                            responseStatusComponent = null,
                                            responseComponent = null,
                                            responseActionsComponent = null,
                                            }){
    return (
        <Column width="w-full ">
            {isUser && <>
                <Row style=" items-center justify-between">
                    <Title title="Публикация на сбыт отходов:"/>
                    <Status status={advert.status}/>
                </Row>
            </>}
            <Row className='flex items-start w-full space-x-4'>
                <Column space="space-y-6">
                    <Column style={{position: 'relative'}}>
                        {isUser && <>
                            <TableCompanyName name={advert.userName}
                                              role={advert.userRole}
                                              height="h-[60px]" width="w-[60px]"
                                              nameFontSize="text-[16px]" roleFontSize="text-[14px]"/>
                            {responseStatusComponent}
                        </>}
                        <Row style=" w-fit space-x-2">
                            <Subtitle label="Отходы: "/>
                            <TableCompanyWastes userWasteId={advert.waste} col={false}
                                                userWasteTypeId={advert.wasteType}/>
                        </Row>
                        <Subtitle label="Количество: " subTitle={advert.amount}/>
                        <div className='flex items-center space-x-2'>
                            <Subtitle label="Ед.изм.: "/>
                            <TableCompanyDimension userDimensionId={advert.dimension}/>
                        </div>
                        <Subtitle label="Цена (руб/шт): " subTitle={advert.price}/>
                        <Subtitle label="Стоимость (руб): " subTitle={advert.totalPrice}/>
                        {advert.comment && <Subtitle label="Комментарий автора: " subTitle={advert.comment}/>}
                        <Subtitle label="Последнее обновление: " subTitle={new Date(advert.updatedAt).toLocaleDateString()}/>
                        <Subtitle label="Дата окончания подачи заявок: " subTitle={new Date(advert.finishDate).toLocaleDateString()}/>
                    </Column>
                    {responseComponent}
                </Column>
                <Column width="w-[60%] ">
                    <Row>
                        <Subtitle label="Адрес: "
                                  subTitle={advert.address}
                                  tag={<br/>} labelStyle=" w-[73%] "/>
                        <DeliveryStatus isPickedUp={advert.isPickedUp}
                                        priceWithDelivery={advert.priceWithDelivery}/>
                    </Row>
                    <MapAddressPoint style={{zIndex: '0'}}
                                     address={advert.address}
                                     width = 'w-[100%]'
                                     height=' h-[250px]'
                                     zIndex=" z-0"
                                     position={[+advert.latitude,  +advert.longitude]}/>
                    {responseActionsComponent}
                </Column>
            </Row>
        </Column>
    );
}