"use client";
import NoDataBanner from "@/app/_ui/general/NoDataBanner";
import DialogMenu from "@/app/_ui/account/dialogs/DialogMenu";
import DialogMessages from "@/app/_ui/account/dialogs/DialogMessages";
import {useMessages} from "@/app/_context/MessagesProvider";
import {useEffect} from "react";
import useErrors from "@/app/_hooks/useErrors";
import FormAnnounce from "@/app/_ui/form/FormAnnounce";

export default function DialogContainer({
                                            dialogsAPI = [],
                                            firstDialogMessages = null,
                                            userId,
}){
    const {initMessagesOfCurrentAdvert, getDialog, dialogs} = useMessages();
    const {errMessage, hasError}= useErrors();

    useEffect(()=>{
        initMessagesOfCurrentAdvert({
            dialogData: dialogsAPI[0],
            messages: firstDialogMessages,
            dialogs: dialogsAPI
        }).catch(err => hasError('default', err.message));
    }, []);
    async function pickDialog(dialogId){
        if(dialogId === getDialog?.()?.id) return;
        const res = await initMessagesOfCurrentAdvert({dialogId});
        if(!res?.success) hasErrors('default', res?.message || 'Ошибка при выборе диалога');
    }

    return (
        <DialogBox>
            <DialogMenu dialogs={dialogs}
                        currentOpenDialog={getDialog()?.id}
                        pickDialog={pickDialog}/>
            <DialogChatView>
                {errMessage && <ErrorAnnounceWrap error={errMessage}/>}
                {(dialogs.length === 0) && <NoDataBanner title='У вас пока нет чатов с другими участниками'/>}
                {dialogs?.length > 0 && <DialogMessages showErrorHandler={hasError}
                                                        userId={userId}/>}
            </DialogChatView>
        </DialogBox>
    );
}
function DialogBox({children}){
    return (
        <main className='relative md:top-[-9px]  md:right-[-18px] w-full flex h-full'>
            {children}
        </main>
    );
}
function DialogChatView({children}){
    return <section className='relative w-full  max-h-[700px] md:max-h-[650px]
    bg-gray-100 flex flex-col justify-between overflow-hidden'>
        {children}
    </section>
}
function ErrorAnnounceWrap({error}){
    return <div className='absolute top-20 left-[40%] bg-white border-r-2 flex justify-items-center'>
        <FormAnnounce message={error}/>
    </div>
}