'use client';
import {createContext, useContext, useState} from "react";

const ModalContext = createContext();
function ModalProvider({children}){
    const [currentOpen, setOpenName] = useState('');
    const close = () => setOpenName('');
    const open = (payload)=> setOpenName(prev => payload);

    return (
        <ModalContext.Provider
            value={{currentOpen, close, open}}>
            {children}
        </ModalContext.Provider>
    )
}
function useModal(){
    const context = useContext(ModalContext);
    if(context === undefined) throw new Error('Modal context was used outside provider');
    return context;
}
export {ModalProvider, useModal};