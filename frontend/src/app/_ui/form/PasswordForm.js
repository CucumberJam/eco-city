"use client";
import useErrors from "@/app/_hooks/useErrors";
import {useState} from "react";
import FormStatus from "@/app/_ui/form/FormStatus";
import FormRowBlock from "@/app/_ui/form/FormRowBlock";
import FormColumnBlock from "@/app/_ui/form/FormColumnBlock";
import FormButton from "@/app/_ui/form/FormButton";
import FormItem from "@/app/_ui/form/FormItem";
import {updateUserParams} from "@/app/_lib/actions/users";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";

export default function PasswordForm(){
    const { data: session, update } = useSession();
    const router = useRouter();
    const {errMessage, hasError} = useErrors();
    const [isSucceeded, setSuccess] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    async function handleForm(event){
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        if(!password || !confirmPassword) hasError('default', 'Заполните поля');
        if(hasError('form', {type: 'password', payload: {password, confirmPassword}})) return;
        try{
            setIsFetching(prev => true);
            const res = await updateUserParams({password, confirmPassword});
            if(!res?.success || res?.data?.[0] !== 1)  throw new Error(res?.message || 'Ошибка при обновлении данных о Пользователе')
            try{
                await update({ ...session.user, ...resCheck.data });
            } catch (e) {
                console.log(e.message)
            }
            setIsFetching(prev => false);
            setSuccess(true);
            setTimeout(async ()=>{
                await router.push('/account');
            }, 1500);
        }catch (e) {
            setIsFetching(prev => false);
            hasError?.('default', e.message);
        }
    }

    return (
        <FormStatus isRegisterSucceeded={isSucceeded}
                    errMessage={errMessage}
                    successMessage='Пароль успешно изменен'
                    isFetching={isFetching}>
            <form className='m-auto flex flex-col space-y-4 items-end px-5 pb-2 mt-10'
                  onSubmit={handleForm}>
                <FormRowBlock>
                    <FormColumnBlock>
                        <FormItem label='Пароль:'
                                  htmlName='password'
                                  type='password'/>
                        <FormItem label='Подтвердите пароль:'
                                  htmlName='confirmPassword'
                                  type='password'/>
                    </FormColumnBlock>
                </FormRowBlock>
                <FormRowBlock>
                    <FormColumnBlock>
                        <FormButton title='Отмена'
                                    typeBtn="reset"/>
                    </FormColumnBlock>
                    <FormColumnBlock>
                        <FormButton title='Сохранить'
                                    typeBtn="submit"/>
                    </FormColumnBlock>
                </FormRowBlock>
            </form>
        </FormStatus>
    );
}