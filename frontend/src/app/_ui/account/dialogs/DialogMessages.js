'use client';
import DialogNewMessage from "@/app/_ui/account/dialogs/DialogNewMessage";
import {CheckCircleIcon, CheckIcon} from '@heroicons/react/24/outline'
import {memo} from "react";
export default function DialogMessages({messages, showError, userId}){
    return (
        <div className='flex flex-col w-full justify-between h-full'>
            <div className='h-[90%]'>
                {messages?.rows?.length > 0 && <MessageList messages={messages?.rows}
                                                            userId={userId}/>}
            </div>
            <DialogNewMessage showError={showError}/>
        </div>
    );
}
const MessageList = memo(function MessageList({messages, userId}){
    //toUserId, userId === author
    return <ul className='my-3 mx-3 flex flex-col items-start space-y-3'>
        {messages.map(el => (
            <li key={el.id} className={`w-fit ${+userId === +el.userId ? 'self-end' : 'self-start'}`}>
                <div className='cursor-pointer flex items-center space-x-1
                                 bg-white py-1 px-2 rounded-2xl relative'>
                    <p className='py-3 px-2 max-w-60 whitespace-break-spaces'>
                        {el.text}
                    </p>
                    {(el.isRead && el.userId !== userId) && <CheckCircleIcon className='w-4 text-accent-10 z-10 absolute top-9 right-2'/>}
                    {+el.userId === +userId && <CheckIcon className='w-4 text-gray-500 z-10 absolute top-9 right-1'/>}
                    <ShowDateOfMessage date={el.updatedAt || el?.createdAt}/>
                </div>
            </li>
        ))}
    </ul>
});
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