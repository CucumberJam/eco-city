"use client";
import useCities from "@/app/_hooks/useCities";
import useRolesWastes from "@/app/_hooks/useRolesWastes";
import useDimensions from "@/app/_hooks/useDimensions";
import {useEffect} from "react";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";

export default function LayoutBodyContainer({

                                                children,
                                                serif,
                                                citiesAPI, dimensionsApi,
                                                rolesAPI,
                                                wastesApi, wasteTypesApi,
                                                userData = null, userToken = null,  userId = null,
                                            }){
    useCities(citiesAPI, true);
    useRolesWastes(rolesAPI, wastesApi, wasteTypesApi);
    useDimensions(dimensionsApi);
    const {setAuthUser} = useGlobalUIStore((state) => state);

    useEffect(()=>{
        if(!userData || !userToken || !userId) return;
        setAuthUser(prev => ({
            data: userData,
            token: userToken,
            id: userId
        }));
    }, []);

    return (
        <body className={`${serif}
            bg-primary-50 text-primary-700 min-h-screen
            flex flex-col antialiasing`}>
        {children}
        </body>
    );
}