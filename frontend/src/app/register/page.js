import Link from "next/link";
import SignUpForm from "@/app/_ui/form/SignUpForm";
export const metadata = {
    title: 'Регистрация'
}
export default function Page() {
    return (
        <div className="flex flex-col gap-10 mt-10 items-center ">
            <h2 className="text-3xl font-semibold">
               Регистрация участника переработки отходов
            </h2>
            <div className='border border-gray-500
                            pb-10
                            max-w-5xl
                            flex flex-col space-y-10'>
                <SignUpForm/>
                <div className='w-full text-center'>
                    <p>Уже есть аккаунт?</p>
                    <Link href='/login' className='mx-2 underline hover:text-accent-400'>
                        Вход в личный кабинет
                    </Link>
                </div>
            </div>
        </div>
    );
}
