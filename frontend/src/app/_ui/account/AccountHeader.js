"use client";
import {ChevronLeftIcon} from "@heroicons/react/24/outline";
import {accountTabs} from "@/app/_store/constants";
import {useTab} from "@/app/_context/TabContext";
import Link from "next/link";
import {useMemo} from "react";

export default function AccountHeader(){
    const {mode, pathName, router} = useTab();

    return (
        <header className='px-4 py-4
                           border-b border-t border-grey-5
                           flex items-center justify-between'>
            <HeaderBack mode={mode}
                        pathName={pathName}
                        clickHandler={()=> router.back()}/>
            <HeaderMenu linkValue={pathName}/>
        </header>
    );
}
function HeaderBack({pathName, mode, clickHandler}){
    return (
        <div className='flex items-center space-x-2'>
            {pathName !== accountTabs[0].href &&
                <ChevronLeftIcon className='w-[20px] cursor-pointer hover:text-gray-300 transition-colors'
                                 onClick={clickHandler}/>
            }
           {/* {mode !== 'all' && <p>{mode}</p>}*/}
        </div>
    );
}
function HeaderMenu({linkValue}){
    return (
        <ul className='flex items-center space-x-4'>
            {accountTabs.map((el, index) => (
                <HeaderMenuItem key={el.name}
                                item={el}
                                link={linkValue}/>
            ))}
        </ul>
    );
}
function HeaderMenuItem({item, link = '/account'}){
    const activeStyle = 'text-primary-10';
    const commonStyle = 'transition-colors flex flex-col items-center justify-center space-y-1 cursor-pointer hover:text-accent-10'

    const active = useMemo(()=>{
        if(item.href === link) return true;
        else if(item?.menu){
            const menuHrefs = item.menu.map(el => el.href);
            return menuHrefs.includes(link);
        } else return false;
    }, [link]);
    return (
        <li>
            <Link href={item.href} className={active ? `${activeStyle} ${commonStyle}` : `${commonStyle} `}>
                <div className='w-[30px] self-center'>{item.icon}</div>
                <div className='hidden md:block'>{item.name}</div>
            </Link>
        </li>
    );
};