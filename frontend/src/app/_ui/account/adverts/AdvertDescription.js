"use client";
import {useMemo, useState} from "react";
import { useRouter } from 'next/navigation';
import {useModal} from "@/app/_context/ModalContext";
import usePaginatedItems from "@/app/_hooks/usePaginatedItems";
import useErrors from "@/app/_hooks/useErrors";

import {getResponsesByAdvertId, updateResponseByAdvertId} from "@/app/_lib/actions/responses";
import {removeAdvertById, updateAdvert} from "@/app/_lib/actions/adverts";
import NoDataBanner from "@/app/_ui/general/NoDataBanner";
import AdvertInfoLarge from "@/app/_ui/account/adverts/AdvertInfoLarge";
import AdvertActions from "@/app/_ui/account/adverts/AdvertActions";
import ResponseList from "@/app/_ui/account/responses/ResponseList";
import ResponseDescription from "@/app/_ui/account/responses/ResponseDescription";
import {ModalView} from "@/app/_ui/general/ModalView";
import AdvertForm from "@/app/_ui/form/AdvertForm";
import ResponseInfo from "@/app/_ui/account/responses/ResponseInfo";
import Title from "@/app/_ui/general/Title";
import {Button} from "flowbite-react";
import FormAnnounce from "@/app/_ui/form/FormAnnounce";

export default function AdvertDescription({advert, responses}){
    const router = useRouter();
    const {errMessage, hasError} = useErrors();
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    const [activeResponse, setActiveResponse] = useState(null);
    const {currentOpen, close, open} = useModal();

    const acceptedResponse = useMemo(()=>{
        if(advert.status === 'На рассмотрении' || advert.status === 'Отклонено') return null;
        return responses.rows.find(el => el.status === advert.status);
    }, [advert?.status, responses?.rows?.length]);

    const showPerformBtn = useMemo(()=>{
        if(!acceptedResponse || advert.status === 'На рассмотрении' || advert.status === 'Отклонено') return false;
        return new Date(advert.finishDate) < new Date();
    }, [advert?.finishDate, acceptedResponse]);

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
    async function revalidate(payload, status = 'Отклонено' || 'Принято' || 'Исполнено'){
        const res = await fetchAndSetItems();
        if(!res.success){
            hasError?.('default', res.message);
            return;
        }
        advert.status = (status ===  'Отклонено') ? 'На рассмотрении' : status;
    }
    async function makeAdvertPerformed(){
        setLoading(prev =>true);
        try {
            const res = await updateResponseByAdvertId(advert.id, acceptedResponse?.id, 'Исполнено');
            setLoading(prev =>false);
            if(!res?.success){
                throw new Error(res?.message || 'Ошибка при изменении статуса публикации')
            }
        }catch (e) {
            setLoading(prev =>false);
            hasError?.('default', e.message);
        }
    }
    async function makeAdvertHistory(){
        setLoading(prev =>true);
        try {
            const res = await updateAdvert({status: 'Отклонено'}, advert.id)
            setLoading(prev =>false);
            if(!res?.success){
                throw new Error(res?.message || 'Ошибка при изменении статуса публикации')
            }
        }catch (e) {
            setLoading(prev =>false);
            hasError?.('default', e.message);
        }
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
                    {!showPerformBtn ? (
                        <div className='h-fit mt-8'>
                        <ResponseList responses={items}
                                      title="Отклики на публикацию"
                                      pagination={pagination}
                                      changePagePagination={changePagination}
                                      pickUpAdvertHandler={(response) => {
                                          open(response.id);
                                          setActiveResponse(prev => response);
                                      }}/>
                    </div>) :(
                        <Button className='mt-5'
                                onClick={makeAdvertHistory}
                                disabled={loading}>
                            Переместить публикацию в &quot;Архив&quot;
                        </Button>
                    )}
                </>
            }
            {(!isEdit && advert.status === 'Отклонено') && (
                <>
                    <FormAnnounce type='history'
                                  message='Публикация перенесена в архив'
                                  topSpace='mt-0 self'/>
                    <NoDataBanner title='На публикацию откликов не поступило'/>
                </>
            )}

            {(!isEdit && (advert.status === 'Принято' || advert.status === 'Исполнено')) && (
                <div className='flex flex-col mt-5 mr-12'>
                    <div className='flex items-start w-full justify-between'>
                        <div className='flex items-end justify-center h-full'>
                            <FormAnnounce type={advert.status === 'Принято' ? 'success' : 'history'}
                                          message={advert.status === 'Принято' ? 'Согласован отклик:' : 'Исполнен отклик:'}
                                          topSpace='mt-0 self'/>
                        </div>
                        {(advert.status === 'Принято' && showPerformBtn) && (
                            <Button onClick={makeAdvertPerformed}
                                    disabled={loading}>
                                Изменить статус публикации на &quot;Исполнено&quot;
                            </Button>
                        )}
                    </div>
                    <ResponseInfo response={acceptedResponse} isUser={false}/>
                </div>)}


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