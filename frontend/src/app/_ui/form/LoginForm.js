'use client';
import {signInAction} from '@/app/_lib/actions/auth';
import {useState } from "react";
import {useRouter} from "next/navigation";
import FormItem from "@/app/_ui/form/FormItem";
import FormStatus from "@/app/_ui/form/FormStatus";
import FormButton from "@/app/_ui/form/FormButton";

export default function LoginForm(){
    const [errMessage, setErrMessage] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const [isRegisterSucceeded, setIsRegisterSucceeded] = useState(false);

    const router = useRouter();
    async function handleSubmit(event){
        setErrMessage(prev=> '');
        event.preventDefault();
        try{
            const formData = new FormData(event.currentTarget);
            //validation:
            const email = formData.get('email');
            if(!email){
                throw new Error('Поле Email должно быть заполнено');
            }
            const password = formData.get('password');
            if(!password){
                throw new Error('Поле Password должно быть заполнено');
            }
            setIsFetching(prev => true);

            const response = await signInAction(formData);
            setIsFetching(prev => false);

            if(!response?.success && response?.message !== "NEXT_REDIRECT"){
                throw new Error(response?.message);
            }else {
                setIsRegisterSucceeded(true);
                router.push('/account');
            }
        }catch (e) {
            setErrMessage(e.message);
            setTimeout(()=>{
                setErrMessage('')
            }, 3000)
        }
    }

    return (
        <form className='w-80 flex flex-col justify-between space-y-3'
        onSubmit={handleSubmit}>
            <FormStatus isRegisterSucceeded={isRegisterSucceeded}
                        errMessage={errMessage} successMessage='Аутентификация прошла успешна'
                        isFetching={isFetching}>
            <FormItem label='Email:' styleWide={false}
                      htmlName='email'
                      type='email'
                      placeholder='Укажите свою почту'/>
                <div className='h-5'></div>
            <FormItem label='Пароль:'
                      htmlName='password'
                      type='password'/>
                <FormButton title='Вход в личный кабинет'
                            typeBtn="submit"
                            isDisabled={isFetching}/>
            </FormStatus>
        </form>
    );
}