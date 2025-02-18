'use client';
import DialogNewMessage from "@/app/_ui/account/dialogs/DialogNewMessage";
import {CheckCircleIcon, CheckIcon} from '@heroicons/react/24/outline'
import {useEffect, useMemo, useRef, useState} from "react";
import {getLastIndexOfMessageList} from "@/app/_lib/helpers";
import {useMessages} from "@/app/_context/MessagesProvider";
export default function DialogMessages({showErrorHandler = () => {}, userId}){
    return (
        <>
            <div className='flex flex-col justify-end h-full w-full overflow-y-auto'>
                <MessageList userId={userId}/>
            </div>
            <DialogNewMessage showError={showErrorHandler}/>
        </>

    );
}
function MessageList({userId}){
    //toUserId, userId === author
    const {messages} = useMessages();

    const [shownMessages, setShownMessages] = useState([...messages.rows]);
    const ref = useRef(null);
    const refShowScroll = useRef(null);

    useEffect(()=>{
        console.log(messages.rows);
        if(!ref.current) return;

        const heightOfList = ref.current.offsetHeight; //
        const heightOfParentBlock = ref.current.parentElement.offsetHeight; //584

        if(heightOfList > heightOfParentBlock){
            refShowScroll.current = true;
            const indexOfLastNotShownMessage = getLastIndexOfMessageList(heightOfList, heightOfParentBlock, messages);
            setShownMessages(prev => messages.rows.slice(indexOfLastNotShownMessage));
        }
    }, [messages.rows.length]); //ref.current

    if(messages.rows.length === 0) return null;

    return <ul ref={ref} className={`${refShowScroll?.current ? 'overflow-y-auto ' : ' ' } my-3 mx-3 flex flex-col items-start space-y-3`}>
        {shownMessages.map(el => (
            <li key={el.id} className={`w-fit ${+userId === +el.userId ? 'self-end' : 'self-start'}`}>
                <div className='cursor-pointer flex items-center space-x-1
                                 bg-white py-1 px-2 rounded-2xl relative'>
                    <p className='py-3 px-2 max-w-60 whitespace-break-spaces'>
                        {el.text}
                    </p>
                    {(+el.userId === +userId) && (
                        <>
                            {el.isRead ? <CheckCircleIcon className='w-4 text-accent-10 z-10 absolute bottom-1 right-2'/>
                                : <CheckIcon className={`${el.isRead ? 'text-blue-500 ' : 'text-gray-500 '} w-4 z-10 absolute bottom-1 right-1`}/>
                            }
                        </>
                    )}
                    <ShowDateOfMessage date={el.updatedAt || el?.createdAt}/>
                </div>
            </li>
        ))}
    </ul>
};
function ShowDateOfMessage({date}){
    const today = new Date();
    const messageDate = new Date(date);
    if((today.getFullYear() === messageDate.getFullYear())
        && (today.getMonth() === messageDate.getMonth()) &&
        (today.getDate() === messageDate.getDate())) return (
        <span className='text-gray-500 text-sm'>
            {today.toLocaleTimeString().substring(0, 5)}
        </span>
    );

    return (
        <span className='text-gray-500 text-sm'>
            {messageDate.toLocaleDateString()}
        </span>
    );
}