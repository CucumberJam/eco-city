"use client";
import {createContext, useContext, useRef, useState} from "react";
import {createMessageToDialog, getMessagesByDialogId} from "@/app/_lib/actions/messages";
import {getDialogById} from "@/app/_lib/actions/dialogs";

const MessagesContext = createContext();

function MessagesProvider({children}) {
    const [dialogs, setDialogs] = useState([]);
    const dialog = useRef(null);
    const [messages, setMessages] = useState([]);
    async function addNewMessage(payload){
        const newMessage = {
            dialogId: dialog.current.id,
            text: payload,
        }
        const res = await createMessageToDialog(dialog.current, newMessage);

        if(res.success){
            setMessages(prev => ({
                count: prev.count + 1,
                rows: [...prev.rows, res.data]
            }));
            dialog.current.isRead = false;
            const updatedDialogs = dialogs.map( el => (el.id === dialog.current.id) ? {... dialog.current} : el)
            setDialogs(prev => [...updatedDialogs]);
            return {success: true};

        }else return res;
    }
    const getDialog = ()=> dialog.current;
    async function fetchAndSetMessages(dialogId){
        if(!dialogId) return {success: false, message: 'Id диалога не представлено'}
        const res = await getMessagesByDialogId(dialogId);
        if(res.success) {
            setMessages(prev => res.data);
            return {success: true}
        }else return res;
    }
    async function initMessagesOfCurrentAdvert({
                                                   dialogData = null,
                                                   messages = null,
                                                   dialogId = null,
                                                   dialogs = null
                                               }){
        if(dialogData) {
            if(dialogs) setDialogs(prev => [...dialogs]);
            dialog.current = {...dialogData};
            if(messages){
                setMessages(prev => messages);
                return {success: true}
            }else return await fetchAndSetMessages(dialogData?.id);
        }else if(!dialogData && dialogId){ // fetch dialog by Id:
            const res = await getDialogById(dialogId);
            if(res.success) return await fetchAndSetMessages(dialogData.id);
            else return res;
        } else return {success: false, message: 'Не представлено никаких данных для диалога'};
    }

    return (
        <MessagesContext.Provider value={{
            dialog,
            getDialog,
            messages,
            initMessagesOfCurrentAdvert,
            addNewMessage,
            dialogs
        }}>
            {children}
        </MessagesContext.Provider>
    );
}
function useMessages(){
    const context = useContext(MessagesContext);
    if(context === undefined) throw new Error('Messages context was used outside provider');
    return context;
}
export {MessagesProvider, useMessages};