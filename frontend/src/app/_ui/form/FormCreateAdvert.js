'use client';
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import {useEffect} from "react";

export default function FormCreateAdvert({dimensionFromApi}){
    const {dimensions, setDimensions} = useGlobalUIStore((state) => state);
    useEffect(() => {
        if(dimensions.length === 0) setDimensions(dimensionFromApi);
        console.log(dimensions);
    }, []);
    return (
        <div>
            <form>
                <input/>
                <button type='submit'>Submit</button>
            </form>
        </div>
    );
}