"use client";
import { TextInput } from "flowbite-react";
import { CiSearch } from "react-icons/ci";
import {useEffect, useState} from "react";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import useSetSearchURL from "@/app/_hooks/useSetSearchURL";

export default function MapSearch({setQueryProps = null}){
    const [inputValue, setInputValue] = useState('');
    const {setParams} = useSetSearchURL();
    const { setQuery } = useGlobalUIStore((state) => state);
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setQueryProps ? setQueryProps(inputValue.trim()) : setQuery(inputValue.trim());
            setParams('search', inputValue.trim().length? inputValue.trim().toLowerCase() : 'all');
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [inputValue, 500]);
    return (
        <TextInput id="search"
                   type="search"
                   placeholder="Поиск..."
                   sizing="sm"
                   value={inputValue}
                   onChange={handleInputChange}
                   rightIcon={CiSearch}
                   className="w-96 focus:border-primary-10 ml-3"/>
    );
}