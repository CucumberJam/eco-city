'use client';
import {createContext, useContext, useEffect, useState} from "react";
import {accountTabOptions, accountTabs} from "@/app/_store/constants";

const TabContext = createContext();

const initialContext = accountTabs[0].name;

function TabProvider({children}){
    const [tab, setTab] = useState(initialContext);
    const [tabOptions, setTabOptions] = useState([]);
    const [selectedTabOpt, selectTabOpt] = useState(null);

    useEffect(()=>{
        if(tab === initialContext) return;
        setTabOptions(prev => accountTabOptions[tab]);
        selectTabOpt(accountTabOptions[tab][0].name);
    }, [tab]);

    const resetTab = ()=> setTab(initialContext);
    function setTabBack(){
        const foundIndex = accountTabs.findIndex(el => el.name === tab);
        if(foundIndex && foundIndex !== 0){
            setTab(accountTabs[foundIndex-1].name);
        }
    }

    return (
        <TabContext.Provider value={{tab, setTab,
            setTabBack, tabOptions,
            selectedTabOpt, selectTabOpt}}>
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