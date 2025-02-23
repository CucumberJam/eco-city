'use client';
import {signInAction} from '@/app/_lib/actions/auth';
import {ExclamationCircleIcon} from '@heroicons/react/24/outline';
import {useState } from "react";
import {useRouter} from "next/navigation";

export default function LoginForm(){
    const [errMessage, setErrMessage] = useState('');
    const [isFetching, setIsFetching] = useState(false);
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
            if(!response?.success && response?.message !== "NEXT_REDIRECT"){
                throw new Error(response?.message);
            }else {
                setIsFetching(prev => false);

                router.push('/account');
            }
        }catch (e) {
            setIsFetching(prev => false);
            setErrMessage(e.message);
            setTimeout(()=>{
                setErrMessage('')
            }, 3000)
        }
    }

    return (
        <form className='w-80 flex flex-col'
        onSubmit={handleSubmit}>
            {errMessage.length > 0 &&
                <div className="flex gap-1 items-center justify-center mb-5
                                bg-red-200 rounded py-1">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                    <div className='text-red-600 text-lg'>{errMessage}</div>
                </div>
            }
            <div className='flex justify-end items-center space-x-3'>
                <label htmlFor='email'>Email:</label>
                <input id='email' type='email' name='email'
                       defaultValue="cucumber12@bk.ru"
                       className='w-60 border mx-2 border-gray-500 rounded bg-inherit px-2 py-1'/>
            </div>
            <div className='mt-4 flex justify-end items-center space-x-3'>
                <label htmlFor='password'>Пароль:</label>
                <input id='password' type='password' name='password'
                       defaultValue="test1234"
                       className='w-60 border mx-2 border-gray-500 rounded bg-inherit px-2 py-1'/>
            </div>
            <button type='submit'  disabled={isFetching}
                    className='mt-8 py-4 px-20 self-center bg-inherit border border-primary-300 hover:border-white rounded flex justify-center items-center'>
                Вход в личный кабинет
            </button>
        </form>
    );
}