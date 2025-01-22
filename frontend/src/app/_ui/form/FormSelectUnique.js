"use client";
import { Select, Progress  } from "flowbite-react";
import {prepareName} from "@/app/_lib/helpers";
import {useMemo} from "react";
const styles = {
    label: 'text-green-50'
}
export function FormSelectUnique({label = 'Город:',
                            htmlName = 'city',
                            defaultVal = null,//{id: 2, name: 'Тюмень'}
                            options = [],
                            changeHandler = null}) {

    function changeValue(event){
        const chosenValue = event.target.value.toLowerCase();
        const found = options.find(el => el?.label?.toLowerCase() === chosenValue || el?.name?.toLowerCase() === chosenValue);
        if(found) changeHandler?.(found);
    }
    const showedOptions = useMemo(()=>{
        if(!defaultVal) return options;
        return options.filter(option => option.id !== defaultVal.id);
    }, [])
    return (
        <div className="m-auto w-full flex justify-start items-center space-x-2">
            <div className="block">
                <label htmlFor={htmlName} className={` ${styles.label}`}>
                    {label}
                </label>
            </div>
            <Select id={htmlName} color="#fff" sizing='12px'
                    style={{width: '100%', height: "35px", paddingTop: "0.2rem", borderRadius: "0.5rem"}}
                    required
                    onChange={changeValue}>
                {defaultVal && <option key={defaultVal.id}>{defaultVal.name}</option>}
                {showedOptions.map(item => (
                    <option key={item.id}>{item?.label ? prepareName(item.label) : prepareName(item.name)}
                    </option>
                ))}
            </Select>
        </div>
    );
}