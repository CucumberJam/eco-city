'use client';
import {createContext, useContext, useEffect, useState} from "react";
import {accountTabOptions, accountTabs} from "@/app/_store/constants";

const TabContext = createContext();

const initialContext = accountTabs[0].name;
const internalTabOptionStates = {
    'Свои': 0,
    'участников': 1
}
function TabProvider({children}){
    const [tab, setTab] = useState(initialContext);
    const [tabOptions, setTabOptions] = useState([]);
    const [selectedTabOpt, selectTabOpt] = useState(null);
    const [selectedInternTabOpt, selectInternTabOpt] = useState(internalTabOptionStates['Свои']);
    const [mode, setMode] = useState('all');

    useEffect(()=>{
        if(tab === initialContext) return;
        setTabOptions(prev => accountTabOptions[tab]);
        const firstShownOption = accountTabOptions[tab].find(el => !el.hasOwnProperty('permits') || el.permits.includes(mode))
        selectTabOpt(firstShownOption);
    }, [tab, mode]);

    const resetTab = ()=> setTab(initialContext);
    function setTabBack(){
        const foundIndex = accountTabs.findIndex(el => el.name === tab);
        if(foundIndex && foundIndex !== 0){
            setTab(accountTabs[foundIndex-1].name);
        }
    }
    function setInternalTabOption(action){
        const str = action.split(' ');
        if(str[0] === Object.keys(internalTabOptionStates)[0]){
            selectInternTabOpt(internalTabOptionStates[str[0]]); // 'Свои' -> 0
        }else selectInternTabOpt(internalTabOptionStates[str[1]]) // 'участников' -> 1
    }

    return (
        <TabContext.Provider value={{tab, setTab,
            setTabBack, tabOptions,
            selectedTabOpt, selectTabOpt,
            mode, setMode,
            selectedInternTabOpt, setInternalTabOption}}>
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