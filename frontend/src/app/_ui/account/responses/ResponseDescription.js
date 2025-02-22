"use client";
import NoDataBanner from "@/app/_ui/general/NoDataBanner";
import {Button} from "flowbite-react";
import {advertStatuses, modalName} from "@/app/_store/constants";
import {useModal} from "@/app/_context/ModalContext";
import {ModalView} from "@/app/_ui/general/ModalView";
import {useState} from "react";
import FormStatus from "@/app/_ui/form/FormStatus";
import {removeResponse, updateResponseByAdvertId} from "@/app/_lib/actions/responses";
import {createDialog} from "@/app/_lib/actions/dialogs";
import useErrors from "@/app/_hooks/useErrors";
import {useRouter} from "next/navigation";
import Column from "@/app/_ui/general/Column";
import Row from "@/app/_ui/general/Row";
import AdvertInfoLarge from "@/app/_ui/account/adverts/AdvertInfoLarge";
import ResponseInfo from "@/app/_ui/account/responses/ResponseInfo";
import Status from "@/app/_ui/general/Status";
import ResponseActions from "@/app/_ui/account/responses/ResponseActions";

export default function ResponseDescription({response, isUser = true, revalidateData = ()=> null}){
    const router = useRouter()
    const {currentOpen, close, open} = useModal();
    const {errMessage, hasError} = useErrors();
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    if(!response) return <NoDataBanner title={`Нет данных об отклике`}/>
    async function deleteResponse(){
        setLoading(prev => true);
        try{
            const res = await removeResponse(+response.id);
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
            const res = await createDialog(response.user.id);
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
            const res = await updateResponseByAdvertId(response.advert.id, response.id, status);
            if(!res?.success){
                throw new Error(res?.message || 'Ошибка при согласовании отклика')
            }else{
                await revalidateData(false, status);
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
            <Column width="w-full pb-2 px-4 ">
                <AdvertInfoLarge advert={response.advert}
                                 isUser={isUser}
                                 responseComponent={<ResponseInfo response={response} isUser={isUser}/>}
                                 responseStatusComponent={isUser ? null : <Status status={response.status} style={' absolute top-[20px] right-20 self-end flex justify-center text-center'}/>}
                                 responseActionsComponent={<ResponseActions isUser={isUser}
                                                                            status={response.status}
                                                                            errMessage={errMessage}
                                                                            success={success}
                                                                            loading={loading}
                                                                            handleSend={sendLetter}
                                                                            handleUpdate={updateResponse}/>}/>
                <ModalView isOpen={currentOpen === modalName.response}
                            title="Сведения о заявке"
                            handleClose={close}>
                    <Row style=" items-center justify-center w-full">
                        <FormStatus isFetching={loading}
                                    errMessage={errMessage}
                                    isRegisterSucceeded={success} successMessage="Отклик успешно удален">
                            <Column width="w-full ">
                                <p>Вы уверены, что хотите отозвать свой отклик на данную заявку?</p>
                                <Button className="self-end"
                                        onClick={deleteResponse}>
                                    Удалить
                                </Button>
                            </Column>
                        </FormStatus>
                    </Row>
                </ModalView>
            </Column>
    );
}