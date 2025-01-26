"use client";
import {useEffect} from "react";
import {Spinner} from "flowbite-react";
import {useTab} from "@/app/_context/TabContext";

export default function AccountMode({userRole, children}){
    const { mode, setMode } = useTab((state) => state);

    useEffect(()=>{
        setMode(userRole);
    }, []);

    if(mode === 'all') return (
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