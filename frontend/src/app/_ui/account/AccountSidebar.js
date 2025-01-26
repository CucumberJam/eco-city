'use client';
import {accountTabs} from "@/app/_store/constants";
import {useTab} from "@/app/_context/TabContext";
import {useMemo, useRef, useState} from "react";
import {ArrowLeftIcon} from "@heroicons/react/24/outline";
import {useOnClickOutside} from "usehooks-ts";
import {ListGroup} from "flowbite-react";
export default function AccountSidebar(){
    const {tab, tabOptions, selectedTabOpt, selectTabOpt, mode, setInternalTabOption} = useTab();
    const [isOpen, setIsOpen] = useState(true);

    const filteredTabOptions = tabOptions.filter(option => !option.hasOwnProperty('permits') || option.permits.includes(mode));
        useMemo(()=>{
        return tabOptions.filter(option => !option.hasOwnProperty('permits') || option.permits.includes(mode));
    }, [mode, tabOptions]);


    if(tab === accountTabs[0].name || mode === 'all') return null;

    if(!isOpen) return (
        <div className='w-[6px] bg-primary-10 h-full cursor-pointer'
            onMouseEnter={()=> setIsOpen(true)}></div>
    );

    return (
        <aside className='pt-4 px-3 pb-2 md:w-34 flex
                         border-r border-grey-5
                         flex-col justify-between h-full'>
            <button className=' self-center mb-4 w-[20px] cursor-pointer hover:text-gray-300 transition-colors'
                     onClick={() => setIsOpen(false)}>
                <ArrowLeftIcon/>
            </button>
            <ul className='text-xs flex flex-col space-y-3'>
                {filteredTabOptions.map(el =>  (
                    <SidebarItem key={el.name}
                                 item={el}
                                 mode={mode}
                                 active={selectedTabOpt?.name === el.name}
                                 clickHandler={selectTabOpt}
                                 selectInternalOption={setInternalTabOption}/>
                ))}
            </ul>
        </aside>
    );
}
function SidebarItem({item, clickHandler, mode, selectInternalOption, active = false}){
    const [showOptions, setShowOptions] = useState(false);
    const ref = useRef(null);
    const activeStyle = 'border text-primary-10 border-primary-1';
    const commonStyle = ' rounded-lg relative ' +
        'md:h-[90px] md:w-[94px] py-3 px-2 transition-colors flex flex-col items-center justify-center ' +
        'space-y-2 cursor-pointer hover:text-accent-10 hover:border-accent-10';

    const haveOptions = useMemo(()=>{
        return item.hasOwnProperty('rights') && item?.personalRights?.[mode]?.length > 1;
    }, []);

    function showOptionsHandler(){
        if(haveOptions) setShowOptions(true);
        clickHandler(item);
    }
    useOnClickOutside(ref, ()=> setShowOptions(prev => false));
    return (

        <li className={active ? `${commonStyle} ${activeStyle}` : `${commonStyle}`}
            ref={ref}
            onClick={showOptionsHandler}>
            <div className='w-[30px] self-center'>{item.icon}</div>
            <p className='hidden md:block text-center'>{item.name}</p>
            {(showOptions && haveOptions) && <div className='absolute left-28
                                                              flex justify-center'>
                <ListGroup className="w-48">
                    {item?.personalRights[mode].map((el, index) => (
                        <ListGroup.Item key={index}
                                        onClick={()=> selectInternalOption(item.rights[index])}>
                            {item.rights[index]}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>}
        </li>
    );
}