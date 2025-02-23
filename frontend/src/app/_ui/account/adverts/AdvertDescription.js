"use client";
import {useState} from "react";
import { useRouter } from 'next/navigation';
import {useModal} from "@/app/_context/ModalContext";
import usePaginatedItems from "@/app/_hooks/usePaginatedItems";
import useErrors from "@/app/_hooks/useErrors";

import {getResponsesByAdvertId} from "@/app/_lib/actions/responses";
import {removeAdvertById} from "@/app/_lib/actions/adverts";
import NoDataBanner from "@/app/_ui/general/NoDataBanner";
import AdvertInfoLarge from "@/app/_ui/account/adverts/AdvertInfoLarge";
import AdvertActions from "@/app/_ui/account/adverts/AdvertActions";
import ResponseList from "@/app/_ui/account/responses/ResponseList";
import ResponseDescription from "@/app/_ui/account/responses/ResponseDescription";
import {ModalView} from "@/app/_ui/general/ModalView";
import AdvertForm from "@/app/_ui/form/AdvertForm";

export default function AdvertDescription({advert, responses}){
    const router = useRouter();
    const {errMessage, hasError} = useErrors();
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    const [activeResponse, setActiveResponse] = useState(null);
    const {currentOpen, close, open} = useModal();

    const {
        items,
        pagination,
        changePagination,
        fetchAndSetItems
    } = usePaginatedItems({
        apiItems: responses,
        fetchFunc: getResponsesByAdvertId,
        additionalArgs: {
            advertId: advert.id,
        }
    });

    if(!advert) return <NoDataBanner title={`Нет данных о публикации`}/>

    async function deleteAdvert(){
        setLoading(prev =>true);
        const res = await removeAdvertById(advert.id);

        setLoading(prev => false);
        if(res.success){
            setSuccess(prev => true);

            setTimeout(()=>{
                setSuccess(prev => false);
                router.push('/account/messages/adverts')
            }, 1000);
        }else{
            hasError('default', res?.message || 'Ошибка при удалении публикации')
        }

    }

    async function revalidate(payload, status = 'Отклонено' || 'Принято'){
        const res = await fetchAndSetItems();
        if(!res.success){
            hasError?.('default', res.message);
            return;
        }
        advert.status = (status ===  'Отклонено') ? 'На рассмотрении' : 'Принято';
    }

    return (
        <>
            {!isEdit ? <>
                <AdvertInfoLarge advert={items?.length > 0 ? items[0].advert : advert}
                                 isUser={true}/>
            </> : (
                <div className='flex flex-col items-center space-y-4 mt-4'>
                    <h2 className="text-3xl font-semibold">Ваша публикация на сбыт отходов</h2>
                    <AdvertForm dataObject={advert}
                                isEdit={true}
                                btnLeftLabel='Отменить'
                                btnRightLabel='Сохранить'
                                successMessage='Заявка изменена'/>
                </div>
            )}
            {(!isEdit && advert.status === 'На рассмотрении') &&
                <>
                    <ActionsBtnsBox>
                        <AdvertActions loading={loading}
                                       success={success}
                                       errMessage={errMessage}
                                       rightLabel='Удалить'
                                       handleRight={deleteAdvert}
                                       leftLabel='Редактировать'
                                       handleLeft={() => setIsEdit(true)}/>
                    </ActionsBtnsBox>
                    <div className='h-fit mt-8'>
                        <ResponseList responses={items}
                                      title="Отклики на публикацию"
                                      pagination={pagination}
                                      changePagePagination={changePagination}
                                      pickUpAdvertHandler={(response)=> {
                                          open(response.id);
                                          setActiveResponse(prev => response);
                                      }}/>
                    </div>
                </>
            }
            <ModalView isOpen={currentOpen === activeResponse?.id}
                       title="Отклик на сбыт отходов"
                       handleClose={()=> {
                           setActiveResponse?.(null);
                           close();
                       }}>
                <ResponseDescription response={activeResponse}
                                     revalidateData={revalidate}
                                     isUser={false}/>
            </ModalView>

        </>
    );
}
function ActionsBtnsBox({children}){
    return (
        <div className="flex items-center justify-center w-[30%] mt-3">
            {children}
        </div>
    );
}