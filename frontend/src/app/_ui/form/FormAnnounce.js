import {ExclamationCircleIcon, CheckBadgeIcon, ExclamationTriangleIcon} from "@heroicons/react/24/outline";
import Link from "next/link";

const styles = {
    block: {
        common: 'flex gap-1 items-center justify-center mb-5 rounded  my-0 mx-auto px-2 py-1',
        error: 'bg-red-200',
        success: 'bg-green-200',
        warn: 'bg-orange-200'
    },
    icon: {
        common: 'h-5 w-5 ',
        error: 'text-red-500',
        success: 'text-green-500',
        warn: 'text-orange-500'
    },
    message: {
        common: 'text-lg',
        error: 'text-red-600',
        success: 'text-green-600',
        warn: 'text-orange-600'
    },
};
export default function FormAnnounce({message, type = 'error', href = null, linkTitle = ''}){
    if(type === 'warning') return (
        <div className='mx-auto w-[90%] flex justify-center mt-10 text-center'>
            <div className="flex flex-col">
                <div className={`${styles.block.common} ${styles.block.warn}`}>
                    <ExclamationTriangleIcon className={`${styles.icon.common} ${styles.icon.warn}`}/>
                    <div className={`${styles.message.common} ${styles.message.warn}`}>
                        {message}
                    </div>
                </div>
                {href && <div className='mx-0 my-auto flex justify-items-center w-full mt-2'>
                    <Link href={href} className='flex justify-center text-center w-full hover:underline'>{linkTitle}</Link>
                </div>}
            </div>
        </div>
    )
    else if(type === 'success') return (
        <div className='w-full flex justify-center mt-10'>
            <div className="flex flex-col">
                <div className={`${styles.block.common} ${styles.block.success}`}>
                    <CheckBadgeIcon className={`${styles.icon.common} ${styles.icon.success}`}/>
                    <div className={`${styles.message.common} ${styles.message.success}`}>
                        {message}
                    </div>
                </div>
            {href && <div className='mx-0 my-auto flex justify-items-center w-full mt-2'>
                <Link href={href} className='flex justify-center text-center w-full hover:underline'>{linkTitle}</Link>
            </div>}
            </div>
        </div>
    )
    else return (
        <div className={`${styles.block.common} ${styles.block.error} text-center`}>
            <ExclamationCircleIcon className={`${styles.icon.common} ${styles.icon.error}`}/>
            <div className={`${styles.message.common} ${styles.message.error}`}>
                {message}
            </div>
            {href && <Link href={href}>{linkTitle}</Link>}
        </div>);
}