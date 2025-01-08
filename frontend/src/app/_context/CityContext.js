'use client';
import {createContext, useContext, useState} from "react";

const CityContext = createContext();

const initialCity = null;

function CityProvider({children}){
    const [city, setCity] = useState(initialCity);
    const resetCity = ()=> setCity(initialCity);
    return (
        <CityContext.Provider value={{city, setCity, resetCity}}>
            {children}
        </CityContext.Provider>
    );
}
function useCity(){
    const context = useContext(CityContext);
    if(context === undefined) throw new Error('City context was used outside provider');
    return context;
}
export {CityProvider, useCity};