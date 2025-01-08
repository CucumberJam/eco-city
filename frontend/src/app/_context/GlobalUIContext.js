/*'use client';
import {createContext, useContext, useState} from "react";

const GlobalUIContext = createContext();

const initialWaste = [];

function WasteProvider({children}){
    const [wastes] = useState(initialWaste);
    return (
        <GlobalUIContext.Provider value={{wastes}}>
            {children}
        </GlobalUIContext.Provider>
    );
}
function useWaste(){
    const context = useContext(GlobalUIContext);
    if(context === undefined) throw new Error('Waste context was used outside provider');
    return context;
}
export {WasteProvider, useWaste};*/

'use client'

import { createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';
import { createGlobalUIStore } from '@/app/_store/global-store';

const GlobalUIContext = createContext(undefined, undefined);
const GlobalStoreProvider = ({children}) => {
    const storeRef = useRef();
    if (!storeRef.current) {
        storeRef.current = createGlobalUIStore();
    }

    return (
        <GlobalUIContext.Provider value={storeRef.current}>
            {children}
        </GlobalUIContext.Provider>
    )
}

const useGlobalUIStore = (selector) => {
    const globalUIContext = useContext(GlobalUIContext)
    if (globalUIContext === undefined) {
        throw new Error(`useGlobalStore must be used within GlobalStoreProvider`)
    }
    return useStore(globalUIContext, selector);
}
export {GlobalStoreProvider, useGlobalUIStore};