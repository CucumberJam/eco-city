"use client";
import {ChevronLeftIcon} from "@heroicons/react/24/outline";
import {accountTabs} from "@/app/_store/constants";
import {useTab} from "@/app/_context/TabContext";

export default function AccountHeader(){
    const {mode, tab, setTab, setTabBack} = useTab();
    return (
        <header className='px-4 py-4
                           border-b border-t border-grey-5
                           flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
                {tab !== accountTabs[0].name &&
                    <ChevronLeftIcon className='w-[20px] cursor-pointer hover:text-gray-300 transition-colors'
                                     onClick={setTabBack}/>
                }
                {mode !== 'all' && <p>{mode}</p>}
            </div>
            <HeaderMenu tabValue={tab} setTabHandler={setTab}/>
        </header>
    );
}
function HeaderMenu({tabValue, setTabHandler}){
    return (
        <ul className='flex items-center space-x-4'>
            {accountTabs.map((el, index) => (
                <HeaderMenuItem key={el.name}
                                item={el}
                                active={tabValue === el.name}
                                clickHandler={setTabHandler}/>
            ))}
        </ul>
    );
}
function HeaderMenuItem({item, clickHandler, active = false}){
    const activeStyle = 'text-primary-10';
    const commonStyle = 'transition-colors flex flex-col items-center justify-center space-y-1 cursor-pointer hover:text-accent-10'
    return (
        <li className={active ? `${activeStyle} ${commonStyle}` : `${commonStyle} `}
            onClick={()=> clickHandler(item.name)}>
            <div className='w-[30px] self-center'>{item.icon}</div>
            <div className='hidden md:block'>{item.name}</div>
        </li>
    );
}