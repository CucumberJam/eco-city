'use client';
import {accountTabs} from "@/app/_store/constants";
import {useTab} from "@/app/_context/TabContext";
import {useState} from "react";
import {ArrowLeftIcon} from "@heroicons/react/24/outline";
export default function AccountSidebar(){
    const {tab, tabOptions, selectedTabOpt, selectTabOpt} = useTab();
    const [isOpen, setIsOpen] = useState(true);

    if(tab === accountTabs[0].name) return null;

    if(!isOpen) return (
        <div className='w-[6px] bg-primary-10 h-full cursor-pointer'
            onMouseEnter={()=> setIsOpen(true)}></div>
    );
    return (
        <aside className='pt-4 px-3 pb-2 md:w-34 flex
                         border-r border-grey-5
                         flex-col justify-between h-full'>
            <button className=' self-center mb-4 w-[20px] cursor-pointer hover:text-gray-300 transition-colors'
                    onClick={()=> setIsOpen(false)}>
                <ArrowLeftIcon/>
            </button>
            <ul className='text-xs flex flex-col space-y-3'>
                {tabOptions.map(el => (
                    <SidebarItem key={el.name}
                                 item={el}
                                 active={selectedTabOpt === el.name}
                                 clickHandler={selectTabOpt}/>
                ))}
            </ul>
        </aside>
    );
}
function SidebarItem({item, clickHandler, active = false}){
    const activeStyle = 'border text-primary-10 border-primary-1';
    const commonStyle = ' rounded-lg ' +
        'md:h-[90px] md:w-[94px] py-3 px-2 transition-colors flex flex-col items-center justify-center ' +
        'space-y-2 cursor-pointer hover:text-accent-10 hover:border-accent-10';
    return (
        <li className={active ? `${commonStyle} ${activeStyle}` : `${commonStyle}`}
            onClick={()=> clickHandler(item.name)}>
            <div className='w-[30px] self-center'>{item.icon}</div>
            <p className='hidden md:block text-center'>{item.name}</p>
        </li>
    );
}