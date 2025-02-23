"use client";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import {useEffect, useState} from "react";
import {Spinner} from "flowbite-react";

export default function AccountMainBox({children}){
    const [loading, setLoading] = useState(true);
    const { currentCity } = useGlobalUIStore((state) => state);
    useEffect(() => {
        if(!currentCity) return;
        setLoading(false);
    }, [currentCity?.id]);
    return (
        <main>
            {loading ? <Spinner/> : children}
        </main>
    );
}