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
    const [selectedInternTabOpt, selectInternTabOpt] = useState(internalTabOptionStates['Свои']);

    useEffect(()=>{
        if(mode === 'all' || pathName === '/account' || !pathName.startsWith('/account')) return;
        const hrefSlugs = pathName.split('/').slice(1);
        const foundTab = accountTabs.slice(1).find(el => el.href === `/${hrefSlugs[0]}/${hrefSlugs[1]}`);
        if(foundTab && foundTab.menu){
            setTabOptions(foundTab.menu);
            if(hrefSlugs.length === 2){
                const firstShownOption = foundTab.menu.find(el => !el.hasOwnProperty('permits') || el.permits.includes(mode));
                router.replace(firstShownOption.href);
            }
        }
    }, [pathName, mode]);
    function setInternalTabOption(action){
        const str = action.split(' ');
        if(str[0] === Object.keys(internalTabOptionStates)[0]){
            selectInternTabOpt(internalTabOptionStates[str[0]]); // 'Свои' -> 0
        }else selectInternTabOpt(internalTabOptionStates[str[1]]) // 'участников' -> 1
    }

    return (
        <TabContext.Provider value={{
            tabOptions,
            mode, setMode,
            selectedInternTabOpt, selectInternTabOpt,
            setInternalTabOption,
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