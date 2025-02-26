"use client";
import { Select  } from "flowbite-react";
import {prepareName} from "@/app/_lib/helpers";
import {useMemo, useState} from "react";
import FormHiddenInput from "@/app/_ui/form/FormHiddenInput";
import {CheckIcon} from "@heroicons/react/24/outline";
const styles = {
    label: 'text-green-50'
}
export function FormSelectUnique({label = 'Город:',
                            withLabel = true,
                            htmlName = 'city',
                            defaultVal = null,//{id: 2, name: 'Тюмень'}
                            options = [],
                            changeHandler = null,
                            hiddenValue = '',
                            checkRightPosition = true,
                            styleBlock = {width: '100%', height: "35px", paddingTop: "0.2rem", borderRadius: "0.3rem"}}) {
    const [isChecked, setIsChecked] = useState(options.length === 1);
    const name = options[0].hasOwnProperty('label') ? 'label' : (options[0].hasOwnProperty('name') ? 'name' : (options[0].hasOwnProperty('fullName') ? 'fullName' : 'shortName'));
    function changeValue(event){
        const chosenValue = event.target.value.toLowerCase();
        //const value = options[0].hasOwnProperty('label') ? 'label' : (options[0].hasOwnProperty('name') ? 'name' : (options[0].hasOwnProperty('fullName') ? 'fullName' : 'shortName'));
        const found = options.find(el => el[name]?.toLowerCase() === chosenValue);
        if(found) {
            changeHandler?.(found);
            setIsChecked(true);
        }
    }
    const showedOptions = useMemo(()=>{
        if(!defaultVal) return options;
        return options.filter(option => option.id !== defaultVal.id);
    }, [defaultVal?.id]);
    const prepare =(item)=>{
        return item?.label ? prepareName(item.label) : (item.name ? prepareName(item.name): prepareName(item?.fullName || item?.shortName))
    }
    return (
        <div className="m-auto w-full flex justify-start items-center">
            {hiddenValue && <FormHiddenInput name={htmlName} value={hiddenValue} changeHandler={changeValue}/>}
            {withLabel && <div className="block">
                <label htmlFor={htmlName} className={` ${styles.label} mr-2`}>
                    {label}
                </label>
            </div>}
            {!checkRightPosition && <CheckIcon style={{width: '25px', color: 'green', marginRight: '8px', opacity: isChecked ? '100%' : '0', display: checkRightPosition ? 'none' : 'block'}}/>}
            <Select id={htmlName} color="#fff" sizing='12px'
                    style={styleBlock}
                    required
                    onChange={changeValue}>

                {(withLabel && !defaultVal) &&
                    <>
                        <option key={label} disabled={true}>{label}</option>
                        {showedOptions.map(item => (
                            <option key={item.id}>{prepare(item)}</option>
                        ))}
                    </>
                }
                {(defaultVal) &&
                    <>
                        <option key={defaultVal.id}>{prepare(defaultVal)}</option>
                        {showedOptions.map(item => (
                            <option key={item.id}>{prepare(item)}</option>
                        ))}
                    </>
                }
                {(!withLabel && !defaultVal) &&
                    <>
                        {showedOptions.map(item => (
                            <option key={item.id}>{prepare(item)}</option>
                        ))}
                    </>
                }
            </Select>
            {checkRightPosition && <CheckIcon style={{width: '25px', color: 'green', marginLeft: '8px', opacity: isChecked ? '100%' : '', display: checkRightPosition ? 'block' : 'none'}}/>}
        </div>
    );
}