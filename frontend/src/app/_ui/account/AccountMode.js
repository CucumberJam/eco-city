"use client";
import {useEffect} from "react";
import {Spinner} from "flowbite-react";
import {useTab} from "@/app/_context/TabContext";
export default function AccountMode({userData, children}){
    const { mode, setMode, } = useTab((state) => state);

    useEffect(()=>{
        setMode(userData?.role || 'all');
    }, []);

    if(mode === 'all') return (
        <div className='w-full flex justify-center py-20'>
            <Spinner size={"xl"}/>
        </div>
    );
    return (
        <div className='flex h-full'>
            {children}
        </div>
    );
}