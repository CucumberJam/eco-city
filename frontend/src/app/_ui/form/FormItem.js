import {Spinner} from "flowbite-react";
import {EyeIcon, EyeSlashIcon} from "@heroicons/react/24/outline";
import {useState} from "react";
import FormHiddenInput from "@/app/_ui/form/FormHiddenInput";
import FormInputLabel from "@/app/_ui/form/FormInputLabel";

const styles = {
    input: 'border mx-2 border-gray-500 rounded bg-inherit px-2 py-1',
    label: 'text-green-50'
}
export default function FormItem({
                             label = '',
                             htmlName = 'email',
                             isControlled = false,
                             type= 'email', addType= 'integer',
                             value = type === 'number' ? 0 : '',
                             defaultVal = null,
                             placeholder = '',
                             keyUpHandler = ()=> null,
                             styleWide = true,
                             isDisabled= false,
                             isLoading = false,
                             isChecked = true,
                             styles = {},
                             width = 'w-full',
                             changeHandler = ()=> null,
                         }){
    return (
        <InputWrapper styleWide={styleWide} width={width}>
            {label.length > 0 && <FormInputLabel label={label} htmlName={htmlName} styleWide={styleWide}/>}
            {isLoading && <Spinner aria-label="Default status example"/>}
            {type === 'password' ?
                (
                    <InputPassword isControlled={isControlled}
                                   value={value}
                                   htmlName={htmlName}
                                   styleWide={styleWide}
                                   defaultVal={defaultVal}
                                   placeholder={placeholder}
                                   keyUpHandler={keyUpHandler}
                                   isDisabled={isDisabled}/>

                ) :
                (
                    <InputControlled isControlled={isControlled}
                                     value={value}
                                     type={type}
                                     addType={addType}
                                     htmlName={htmlName}
                                     defaultVal={defaultVal}
                                     placeholder={placeholder}
                                     styleWide={styleWide}
                                     isDisabled={isDisabled}
                                     keyUpHandler={keyUpHandler}
                                     changeHandler={changeHandler}/>
                )
            }
            <FormHiddenInput name={htmlName} value={value.length === 0 ? defaultVal || '' : value} id={htmlName}/>
        </InputWrapper>
    );
}
function InputWrapper({styleWide, width = 'w-full', children}){
    return (
        <div className={styleWide ? `m-auto ${width} flex justify-start items-center space-x-2` :
            'flex justify-end items-center space-x-3'}>
            {children}
        </div>
    );
}
function InputPassword({   isControlled = false, value,
                           isDisabled, htmlName, defaultVal,
                           placeholder, styleWide,  keyUpHandler}){
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className='flex relative items-center'>
            <InputControlled isControlled={isControlled}
                             value={value}
                             type={!showPassword ? 'password' : 'text'}
                             htmlName={htmlName}
                             defaultVal={defaultVal}
                             placeholder={placeholder}
                             styleWide={styleWide}
                             isDisabled={isDisabled}
                             keyUpHandler={keyUpHandler}/>
            {showPassword ? <EyeIcon color='grey'
                                      width={18}
                                      className='absolute right-5 cursor-pointer'
                                      onClick={()=> setShowPassword(false)}/>
                : <EyeSlashIcon color='grey'
                           width={18}
                           className='absolute right-5 cursor-pointer'
                           onClick={() => setShowPassword(true)}/>}
        </div>
    );
}
function InputControlled({htmlName, type = 'text', defaultVal, placeholder,
                             styleWide, isDisabled, keyUpHandler, addType= null,
                             value, changeHandler, isControlled = false}){

    if(isControlled){
        return <input id={htmlName}
               step={type === 'number' ?( addType === 'integer' ? '1': ".01"): ''}
               type={type}
               name={htmlName}
               value={value}
               placeholder={placeholder}
               className={styleWide ? `w-full ${styles.input} ${isDisabled ? 'cursor-not-allowed' : 'cursor-auto'}` : `w-60 ${styles.input} ${isDisabled ? 'cursor-not-allowed' : 'cursor-auto'}`}
               disabled={isDisabled}
               onKeyUp={keyUpHandler}
               onChange={(event)=> changeHandler(event.target.value, htmlName)}/>
    }
    return (
        <input id={htmlName}
               step={type === 'number' ?( addType === 'integer' ? '1': ".01"): ''}
               type={type}
               name={htmlName}
               defaultValue={defaultVal}
               placeholder={placeholder}
               className={styleWide ? `w-full ${styles.input} ${isDisabled ? 'cursor-not-allowed' : 'cursor-auto'}` : `w-60 ${styles.input} ${isDisabled ? 'cursor-not-allowed' : 'cursor-auto'}`}
               disabled={isDisabled}
               onKeyUp={keyUpHandler}
               onChange={changeHandler}/>
    );
}