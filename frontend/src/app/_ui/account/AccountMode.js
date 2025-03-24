"use client";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import {Spinner} from "flowbite-react";
import {useTab} from "@/app/_context/TabContext";
export default function AccountMode({children}){
    const router = useRouter();
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {router.push('/')},
    })
    const { mode, setMode, } = useTab((state) => state);

    useEffect(()=>{
        setMode(userData?.role || 'all');
    }, []);
    const userData = session?.user;

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