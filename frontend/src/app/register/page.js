import Link from "next/link";
import SignUpForm from "@/app/_ui/form/SignUpForm";
import FormPageContainer from "@/app/_ui/form/FormPageContainer";
export const metadata = {
    title: 'Регистрация'
}
export default function Page() {
    return (
        <FormPageContainer>
            <SignUpForm/>
            <div className='w-full text-center'>
                <p>Уже есть аккаунт?</p>
                <Link href='/login' className='mx-2 underline hover:text-accent-400'>
                    Вход в личный кабинет
                </Link>
            </div>
        </FormPageContainer>
    );
}
