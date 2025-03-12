'use client';
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