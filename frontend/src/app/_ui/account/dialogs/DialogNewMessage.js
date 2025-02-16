'use client';
import {CiPaperplane} from "react-icons/ci";
import {TextInput} from "flowbite-react";
import {useState} from "react";
import {useMessages} from "@/app/_context/MessagesProvider";

export default function DialogNewMessage({showError}){
    const [newMessage, setNewMessage] = useState('');
    const {addNewMessage} = useMessages();
    async function sendMessage(){
        if(newMessage.trim().length === 0) return;

        const res = await addNewMessage(newMessage.trim());
        if(!res?.success){
            showError('default', res?.message || 'Ошибка при добавлении сообщения')
        } else setNewMessage('');
    }
    return (
        <div className=' w-full bg-white py-3 px-2 mx-auto my-0'>
            <TextInput id="search"
                       type="text"
                       placeholder="Введите сообщение"
                       sizing="md"
                       value={newMessage}
                       rightIcon={CiPaperplane} shadow
                       className="w-full cursor-pointer"
                       onChange={e=>setNewMessage(e.target.value)}
                       onKeyDown={async(e) => {
                           if(e.key === "Enter") await sendMessage();
                           else if(e.key === "Escape") setNewMessage('');
                       }}/>
        </div>
    );
}