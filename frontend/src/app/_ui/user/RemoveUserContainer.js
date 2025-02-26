"use client"
import FormAnnounce from "@/app/_ui/form/FormAnnounce";
import {useEffect, useState} from "react";
import FormStatus from "@/app/_ui/form/FormStatus";
import useErrors from "@/app/_hooks/useErrors";
import FormRowBlock from "@/app/_ui/form/FormRowBlock";
import FormButton from "@/app/_ui/form/FormButton";
import {checkDisableUserAction} from "@/app/_lib/data-service";
import {Checkbox} from "flowbite-react";
import Row from "@/app/_ui/general/Row";
import {removeUser} from "@/app/_lib/actions/users";
import {useRouter} from "next/navigation";
import {signOut} from "@/auth";

export default function RemoveUserContainer({userData}){
    const router = useRouter();
    const [warning, setWarning] = useState('');
    const [isSucceeded, setSuccess] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const {errMessage, hasError} = useErrors();

    useEffect(()=>{
        checkDisableUserAction(userData.role, {status: 'Принято'})
            .then(res => {
            if(res.length > 0){
                const message = `У вас имеются согласованные ${res.join(', ')}, поэтому Вы не можете удалить свой аккаунт`
                setWarning(message);
            }
        }).catch(err => hasError('default', err.message));
    }, []);
    async function handleForm(event){
        event.preventDefault();
        if(warning){
            hasError('default', 'Измените статус у своих согласованных откликов или публикаций');
            return;
        }
        if(!isAccepted){
            hasError('default', 'Подтвердите удаление аккаунта');
            return;
        }

        try{
            setIsFetching(prev => true);
            const res = await removeUser();
            if(!res?.success)  throw new Error(res?.message || 'Ошибка при удалении аккаунта')
            setIsFetching(prev => false);
            setSuccess(true);
            try{
                await signOut();
            } catch (e) {
                console.log(e.message)
            }
            setTimeout(async ()=>{
                await router.push('/');
            }, 1500);
        }catch (e) {
            setIsFetching(prev => false);
            hasError?.('default', e.message);
        }
    }


    return (
        <>
            {warning && <FormAnnounce type='warning' message={warning}/>}
            <FormStatus isRegisterSucceeded={isSucceeded}
                        errMessage={errMessage}
                        successMessage='Данные успешно изменены'
                        isFetching={isFetching}>
                <form className='m-auto flex flex-col space-y-4 items-end pb-2'
                      onSubmit={handleForm}>
                    <FormRowBlock>
                        <Row style='items-center space-x-5 mt-4'>
                            <Checkbox value={isAccepted} onChange={e => setIsAccepted(e.target.checked)}/>
                            <p className='text-xl'>
                                Удаляя аккаунт, я понимаю, что будут удалены все мои данные,
                                а также сделанные мною публикации и/или отклики
                            </p>
                        </Row>
                    </FormRowBlock>
                    <FormRowBlock>
                        <FormButton title='Удалить'
                                    disableTip={warning ? 'Измените статус у своих согласованных откликов или публикаций'
                                        : 'Подтвердите удаление аккаунта'}
                                    isDisabled={!!warning || !isAccepted}
                                    typeBtn="submit"/>
                    </FormRowBlock>
                </form>
            </FormStatus>
        </>
    );
}