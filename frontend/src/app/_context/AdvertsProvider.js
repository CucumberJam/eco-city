'use client';

import {createContext, useContext, useState} from "react";

const AdvertsContext = createContext();
const initialState = { count: 0, rows: [] };
function AdvertsProvider({children}) {
    const [advertsUser, setAdvertsUser] = useState(null);
    const [adverts, setAdverts] = useState(null);
    return (
        <AdvertsContext.Provider value={{
            advertsUser, setAdvertsUser,
            adverts, setAdverts}}>
            {children}
        </AdvertsContext.Provider>
    );
}
function useAdverts(){
    const context = useContext(AdvertsContext);
    if(context === undefined) throw new Error('Adverts context was used outside provider');
    return context;
}
export {AdvertsProvider, useAdverts};