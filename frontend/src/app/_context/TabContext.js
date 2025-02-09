'use client';
import { useRouter } from 'next/navigation'
import {createContext, useContext, useEffect, useState} from "react";
import {accountTabs, internalTabOptionStates} from "@/app/_store/constants";
import {usePathname} from "next/navigation";

const TabContext = createContext();
function TabProvider({children}){
    const router = useRouter()
    const pathName = usePathname();

    const [mode, setMode] = useState('all');
    const [tabOptions, setTabOptions] = useState([]);
    const [selectedInternTabOpt, selectInternTabOpt] = useState(internalTabOptionStates['Мои']);

    useEffect(()=>{
        if(mode === 'all' || pathName === '/account' || !pathName.startsWith('/account')) return;
        const hrefSlugs = pathName.split('/').slice(1);
        const foundTab = accountTabs.slice(1).find(el => el.href === `/${hrefSlugs[0]}/${hrefSlugs[1]}`);
        if(foundTab && foundTab.menu){
            setTabOptions(foundTab.menu);
            if(hrefSlugs.length >= 2){
                let firstShownOption;
                if(hrefSlugs.length === 2){
                    firstShownOption = foundTab.menu.find(el => !el.hasOwnProperty('permits') || el.permits.includes(mode));
                }else if(hrefSlugs.length === 3){
                    const internalTab = hrefSlugs[2]; //responses
                    firstShownOption = foundTab.menu.find(el => {
                        const lastHref =  el.href.split('/')[2];
                        if(lastHref === internalTab) return el;
                    });
                }
                if(firstShownOption){
                    selectInternTabOpt(firstShownOption?.personalRights?.[mode]?.[0]|| 0);
                    router.replace(firstShownOption.href);
                }

            }
        }
    }, [pathName, mode]);

    return (
        <TabContext.Provider value={{
            tabOptions,
            mode, setMode,
            selectedInternTabOpt, selectInternTabOpt,
            router, pathName}}>
            {children}
        </TabContext.Provider>
    );
}
function useTab(){
    const context = useContext(TabContext);
    if(context === undefined) throw new Error('Tab context was used outside provider');
    return context;
}
export {TabProvider, useTab};