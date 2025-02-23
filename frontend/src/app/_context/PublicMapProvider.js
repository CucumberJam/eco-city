'use client';
import {createContext, useContext, useEffect, useRef, useState} from "react";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import {Spinner} from "flowbite-react";
import usePaginatedItems from "@/app/_hooks/usePaginatedItems";
import {getUsersByParams} from "@/app/_lib/actions/users";

const PublicMapContext = createContext();

function PublicMapProvider({children}) {

    const {currentCity, users,
        wastes, currentWaste, setCurrentWaste,
        wasteTypes, currentWasteType, setCurrentWasteType,
        roles, currentRole, setCurrentRole } = useGlobalUIStore((state) => state);

    const providerInitialized = useRef(null);
    const [isFetching, setIsFetching] = useState(false);
    const [query, setQuery] = useState('');

    const {items: paginatedItems, fetchAndSetItems,
        setAdditional, pagination, changePagination} = usePaginatedItems({
        fetchFunc: getUsersByParams,
    });
    return (
        <PublicMapContext.Provider value={{

        }}>
            <div className="w-full h-auto">
                {currentCity && children}
                {!currentCity &&  <Spinner size={"md"} className="py-3 w-full h-[100px] flex justify-items-center"/>}
            </div>
        </PublicMapContext.Provider>
    );
}

function usePublicMap(){
    const context = useContext(PublicMapContext);
    if(context === undefined) throw new Error('PublicMap context was used outside provider');
    return context;
}

export {PublicMapProvider, usePublicMap};