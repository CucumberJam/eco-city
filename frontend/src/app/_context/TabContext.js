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
    const [selectedTabOpt, selectTabOpt] = useState(null);
    const [selectedInternTabOpt, selectInternTabOpt] = useState(internalTabOptionStates['Свои']);

    useEffect(()=>{
        if(pathName === '/account' || !pathName.startsWith('/account')) return;
        const foundTab = accountTabs.find(el => el.href  === pathName);
        if(foundTab){
            setTabOptions(foundTab.menu);
            const firstShownOption = foundTab.menu.find(el => !el.hasOwnProperty('permits') || el.permits.includes(mode))
            selectTabOpt(firstShownOption);
        }
    }, [pathName, mode]);

    function setTabBack(){
        const foundIndex = accountTabs.findIndex(el => el.href  === pathName);
        if(foundIndex && foundIndex !== 0){
            router.push(accountTabs[foundIndex-1].href)
        }
    }
    function setInternalTabOption(action){
        const str = action.split(' ');
        if(str[0] === Object.keys(internalTabOptionStates)[0]){
            selectInternTabOpt(internalTabOptionStates[str[0]]); // 'Свои' -> 0
        }else selectInternTabOpt(internalTabOptionStates[str[1]]) // 'участников' -> 1
    }

    return (
        <TabContext.Provider value={{
            setTabBack, tabOptions,
            selectedTabOpt, selectTabOpt,
            mode, setMode,
            selectedInternTabOpt, setInternalTabOption,
            pathName}}>
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