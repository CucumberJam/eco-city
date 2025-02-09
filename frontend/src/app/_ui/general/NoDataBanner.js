import {Banner} from "flowbite-react";
import {MdAnnouncement} from "react-icons/md";

export default function NoDataBanner({title}){
    return (
        <Banner>
            <div className="flex w-full justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                <div className="mx-auto flex items-center">
                    <div className="flex flex-col items-center space-y-2
                text-sm font-normal text-gray-500
                dark:text-gray-400">
                        <p className="font-bold">{title}</p>
                        <div className='flex items-center space-x-2'>
                            <MdAnnouncement className="mr-4 h-4 w-4" />
                            <span className="[&_p]:inline">Нет данных ...&nbsp;</span>
                        </div>
                    </div>
                </div>
            </div>
        </Banner>
    );
}