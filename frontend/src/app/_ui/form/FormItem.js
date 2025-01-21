import {FloatingLabel, Spinner} from "flowbite-react";
import {CheckIcon, EyeIcon, EyeSlashIcon} from "@heroicons/react/24/outline";
import {ExclamationCircleIcon} from "@heroicons/react/24/outline";
import {useEffect, useState} from "react";

const styles = {
    input: 'border mx-2 border-gray-500 rounded bg-inherit px-2 py-1',
    label: 'text-green-50'
}
export function FormItem({
                             label = 'Email:',
                             htmlName = 'email',
                             type= 'email',
                             defaultVal = null,
                             placeholder = '',
                             keyUpHandler = ()=> null,
                             styleWide = true,
                             isDisabled= false,
                             isLoading = false,
                             isChecked = true,
                         }){
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className={styleWide ? 'm-auto w-full flex justify-start items-center space-x-2' :
            'flex justify-end items-center space-x-3'}>
            <label htmlFor={htmlName}
                   className={styleWide ? `whitespace-nowrap ${styles.label}` : ` ${styles.label}`}>
                {label}
            </label>
            {isLoading && <Spinner aria-label="Default status example"/>}
          {/*  {!isLoading && isChecked && <CheckIcon style={{width: '25px', color: 'green'}}/>}*/}
            {type !== 'password' ? <input id={htmlName}
                    type={type}
                    name={htmlName}
                    defaultValue={defaultVal}
                    placeholder={placeholder}
                    className={styleWide ? `w-full ${styles.input} ${isDisabled ? 'cursor-not-allowed' : 'cursor-auto'}` : `w-60 ${styles.input} ${isDisabled ? 'cursor-not-allowed' : 'cursor-auto'}`}
                    disabled={isDisabled}
                    onKeyUp={keyUpHandler}/> :
                (
                    <>
                        {!showPassword ? (
                            <div className='flex relative items-center'>
                                <input id={htmlName}
                                       type={type}
                                       name={htmlName}
                                       defaultValue={defaultVal}
                                       placeholder={placeholder}
                                       className={styleWide ? `w-full ${styles.input} ${isDisabled ? 'cursor-not-allowed' : 'cursor-auto'}` : `w-60 ${styles.input} ${isDisabled ? 'cursor-not-allowed' : 'cursor-auto'}`}
                                       disabled={isDisabled}
                                       onKeyUp={keyUpHandler}/>
                                <EyeIcon color='grey'
                                         width={18}
                                         className='absolute right-5 cursor-pointer'
                                onClick={()=> setShowPassword(true)}/>
                            </div>) : (
                            <div className='flex relative items-center'>
                                <input id={htmlName}
                                    type='text'
                                    name={htmlName}
                                    defaultValue={defaultVal}
                                    placeholder={placeholder}
                                    className={styleWide ? `w-full ${styles.input} ${isDisabled ? 'cursor-not-allowed' : 'cursor-auto'}` : `w-60 ${styles.input} ${isDisabled ? 'cursor-not-allowed' : 'cursor-auto'}`}
                                    disabled={isDisabled}
                                    onKeyUp={keyUpHandler}/>
                                <EyeSlashIcon color='grey'
                                              width={18}
                                              className='absolute right-5 cursor-pointer'
                                              onClick={()=> setShowPassword(false)}/>
                            </div>)
                        }
                    </>

                )
            }
            <input id={htmlName}
                   name={htmlName}
                   value={defaultVal ? defaultVal : ''} type='hidden'/>
            {/*<FloatingLabel sizing='sm' id='rom' name='rom' label="Название" variant="outlined"/>*/}
        </div>
    );
}