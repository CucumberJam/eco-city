"use client";
import {useEffect} from "react";
import {Spinner} from "flowbite-react";
import {useTab} from "@/app/_context/TabContext";
import useRolesWastes from "@/app/_hooks/useRolesWastes";
export default function AccountMode({userRole, rolesAPI, wastesApi, wasteTypesApi, children}){
    const { mode, setMode } = useTab((state) => state);
    const {isFetched} = useRolesWastes(rolesAPI, wastesApi, wasteTypesApi);

    useEffect(()=>{
        setMode(userRole);
    }, []);

    if(mode === 'all' || !isFetched) return (
        <div className='w-full flex justify-center py-20'>
            <Spinner size={"xl"}/>
        </div>
    );
    return (
        <div className='flex'>
            {children}
        </div>
    );
}