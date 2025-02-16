"use client";
import NoDataBanner from "@/app/_ui/general/NoDataBanner";
import DialogMenu from "@/app/_ui/account/dialogs/DialogMenu";
import DialogMessages from "@/app/_ui/account/dialogs/DialogMessages";
import {useMessages} from "@/app/_context/MessagesProvider";
import {useEffect} from "react";
import useErrors from "@/app/_hooks/useErrors";
import FormAnnounce from "@/app/_ui/form/FormAnnounce";

export default function DialogContainer({
                                            dialogs = [],
                                            firstDialogMessages = null,
                                            userId,
}){
    const {initMessagesOfCurrentAdvert, getDialog} = useMessages();
    const {errMessage, hasErrors}= useErrors();

    useEffect(()=>{
        initMessagesOfCurrentAdvert({
            dialogData: dialogs[0],
            messages: firstDialogMessages
        }).catch(err => hasErrors('default', err.message));
    }, []);
    async function pickDialog(dialogId){
        if(dialogId === getDialog?.()?.id) return;
        const res = await initMessagesOfCurrentAdvert({dialogId});
        if(!res?.success) hasErrors('default', res.message);
    }
    return (
        <DialogBox>
            <DialogMenu dialogs={dialogs}
                        pickDialog={pickDialog}/>
            <DialogChatView>
                {errMessage && <ErrorAnnounceWrap error={errMessage}/>}
                {(!dialogs || dialogs.length === 0) && <NoDataBanner title='У вас пока нет чатов с другими участниками'/>}
                {(dialogs?.length > 0 && firstDialogMessages) && <DialogMessages messages={firstDialogMessages}
                                                                                 showError={hasErrors}
                                                                                 userId={userId}/>}
            </DialogChatView>
        </DialogBox>
    );
}
function DialogBox({children}){
    return (
        <main className='relative top-[-9px] right-[-18px] w-full flex h-full'>
            {children}
        </main>
    );
}
function DialogChatView({children}){
    return <section className='relative w-full bg-gray-100'>{children}</section>
}
function ErrorAnnounceWrap({error}){
    return <div className='absolute top-20 left-[40%] bg-white border-r-2 flex justify-items-center'>
        <FormAnnounce message={error}/>
    </div>
}