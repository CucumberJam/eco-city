'use client';
import DialogNewMessage from "@/app/_ui/account/dialogs/DialogNewMessage";
import {CheckCircleIcon, CheckIcon} from '@heroicons/react/24/outline'
import {useRef, useState} from "react";
import {useMessages} from "@/app/_context/MessagesProvider";
import {Badge, Spinner} from "flowbite-react";
export default function DialogMessages({showErrorHandler = () => {}, userId}){
    return (
        <>
            <div className='flex flex-col justify-end h-full w-full overflow-y-auto relative'>
                <MessageList userId={userId}/>
            </div>
            <DialogNewMessage showError={showErrorHandler}/>
        </>

    );
}
function MessageList({userId}){
    const {messages, fetchAndSetMessages} = useMessages();
    const [isFetching, setIsFetching] = useState(false);
    const [errMessage, setErrMessage] = useState('');
    const listRef = useRef(null);
    const refShowScroll = useRef(null);

    async function showMoreHandler(){
        if(messages.rows.length < messages.count){
            setIsFetching(prev => true)
            const res = await fetchAndSetMessages?.(messages.rows[0]?.dialogId, 0, messages.rows.length + 10);
            setIsFetching(prev => false)
            if(!res.success) {
                setErrMessage(res.message || 'Ошибка при получении сообщений');
                setTimeout(()=>{
                    setErrMessage('');
                }, 3000);
            }
        }
        refShowScroll.current = true;
    }

    if(!messages?.rows || messages?.rows?.length === 0) return null;

    return (
        <>
            {((!isFetching && !errMessage) && (messages?.rows?.length < messages?.count))
                && (
                <Badge color='green'
                       className='absolute top-5 z-10 left-[45%] cursor-pointer
                       py-2 px-3
                       hover:bg-green-300 hover:text-white
                       transition-colors'
                       onClick={showMoreHandler}>
                    Показать еще
                </Badge>
            )}
            {isFetching && <Spinner className='absolute top-5 z-10 left-[45%]'/>}
            {errMessage && <Badge color='failure'>{errMessage}</Badge>}
            <ul ref={listRef} className={`${refShowScroll?.current ? 'overflow-y-auto ' : ' ' } my-3 mx-3 flex flex-col items-start space-y-3`}>
            {messages?.rows?.map(el => (
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
                        <ShowDateOfMessage date={el?.createdAt}/>
                    </div>
                </li>
            ))}
        </ul>
        </>
    )
};
function ShowDateOfMessage({date}){
    const today = new Date();
    const messageDate = new Date(date);
    const showDateOrTime =  ((today.getFullYear() === messageDate.getFullYear())
            && (today.getMonth() === messageDate.getMonth()) &&
            (today.getDate() === messageDate.getDate())) ? today.toLocaleTimeString().substring(0, 5) :
            messageDate.toLocaleDateString();

    return (
        <span className='text-gray-500 text-sm'>
            {showDateOrTime}
        </span>
    );
}