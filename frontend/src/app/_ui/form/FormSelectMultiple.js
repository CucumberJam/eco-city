'use client';
import {prepareName} from "@/app/_lib/helpers";
import {useRef, useState} from "react";
import {Checkbox, ListGroup} from "flowbite-react";
import {useOnClickOutside} from 'usehooks-ts'
import {CheckIcon} from "@heroicons/react/24/outline";
import {ExclamationCircleIcon} from "@heroicons/react/24/outline";
import FormHiddenInput from "@/app/_ui/form/FormHiddenInput";
const styles = {
    label: 'text-green-50'
}
export default function FormSelectMultiple({label = "отходы:",
                                            withLabel = true,
                                            htmlName = 'waste',
                                            options = [],
                                            pickHandler = null,
                                            hiddenValue = '' || [],
                                            styleBlock = {width: 'fit-content', margin: '0 auto'},
                                            checkRightPosition = true,}){
    const ref = useRef(null);
    const [isChecked, setIsChecked] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    useOnClickOutside(ref, ()=> setShowDropdown(prev => false));

    function pick(item, res){
        if(res) setIsChecked(prev => true);
        else{
            const checkBoxes = ref.current.querySelectorAll('input');
            let check = false;
            for(const item of checkBoxes){
                if(item.checked) check = true;
            }
            setIsChecked(check);
        }
        pickHandler?.(item, res);
    }
    return (
        <div className={`m-auto w-full flex justify-start items-center ${withLabel ? 'space-x-2 ' : ''}`}>
            {hiddenValue.length > 0 && <FormHiddenInput name={htmlName} value={hiddenValue}/>}
            {withLabel && <div className="block">
                <label htmlFor={htmlName} className={` ${styles.label}`}>
                    {prepareName(label)}
                </label>
            </div>}
            <div className='flex items-center'>
                {!checkRightPosition && <CheckIcon style={{width: '25px', color: 'green', marginRight: '8px', opacity: isChecked ? '100%' : '0', display: checkRightPosition ? 'none' : 'block' }}/>}
                <div style={{position: 'relative'}}>
                    <div  ref={ref}
                          style={styleBlock}
                             className={`h-[35px] border border-gray-500 rounded bg-inherit px-2 py-1
                                 flex items-center justify-between cursor-pointer`}
                             onClick={()=> setShowDropdown(prev=> true)}>
                        {!withLabel ? label : (isChecked ? 'Выбор сделан' : 'Выберете варианты')}
                        <Arrow/>
                    </div>
                    <ListGroup ref={ref}
                               style={{marginLeft: '0px', width: '234px', visibility: showDropdown ? 'visible' : 'hidden', position: 'absolute', zIndex: 100}}>
                        {options.map(item => (
                            <ListGroup.Item key={item.id}>
                                <div className='flex items-center gap-2'>
                                    <label htmlFor={item.id} className='w-full'>
                                        <Checkbox id={item.id} style={{marginRight: '8px'}}
                                                  onChange={(event)=> pick(item, event.target.checked)}/>
                                        {item?.label ? prepareName(item.label) : prepareName(item.name)}
                                    </label>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
                {checkRightPosition && <CheckIcon style={{width: '25px', color: 'green', marginLeft: '8px', opacity: isChecked ? '100%' : '0', display: checkRightPosition ? 'block' : 'none'}}/>}
            </div>
        </div>
    );
}
function Arrow(){
    return (
        <span className="flex items-stretch transition-all duration-200 rounded-md px-1 py-2 text-sm">
            <svg stroke="currentColor" fill="none" strokeWidth="3"
                 viewBox="0 0 24 24" aria-hidden="true"
                 className="ml-2 h-4 w-4" height="2em" width="2em"
                 xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7">
                </path>
            </svg>
        </span>
    );
}
