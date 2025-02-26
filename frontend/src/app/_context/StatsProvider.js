'use client';
import {createContext, useContext, useState} from "react";
import {Spinner} from "flowbite-react";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import {statsData} from "@/app/_store/constants";

const StatsContext = createContext();

function StatsMapProvider({children}) {
    const {currentCity} = useGlobalUIStore((state) => state);
    const [mode, setActiveMode] = useState(0);
    const [isFetching, setIsFetching] = useState(false);

    function initUserData(userRole){
        setIsFetching(prev => true)
        setActiveMode(prev => statsData.roles[userRole][0]);
        setIsFetching(prev => false)
        return {success: true}
    }
    function changeMode(value){
        setActiveMode(value);
    }
    return (
        <StatsContext.Provider value={{
            initUserData,
            mode, changeMode,
            isFetching,
        }}>
            <main>
                {currentCity && children}
                {!currentCity &&  <Spinner size={"md"} className="py-3 w-full h-[100px] flex justify-items-center"/>}
            </main>
        </StatsContext.Provider>
    );
}
function useStats(){
    const context = useContext(StatsContext);
    if(context === undefined) throw new Error('Stats context was used outside provider');
    return context;
}

export {StatsMapProvider, useStats};