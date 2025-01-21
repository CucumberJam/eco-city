import Link from "next/link";
import LoginForm from "@/app/_ui/form/LoginForm";
export const metadata = {
    title: 'Вход в ЛК'
}
export default function Page() {
  return (
    <div className="flex flex-col gap-10 mt-10 items-center ">
      <h2 className="text-3xl font-semibold">
        Вход в личный кабинет
      </h2>
        <div className='border border-gray-500 px-10 py-10 flex flex-col space-y-10'>
            <LoginForm/>
            <div className='w-full text-center'>
                <p>Еще нет аккаунта?</p>
                <Link href='/register' className='mx-2 underline hover:text-accent-400'>
                    Зарегистрироваться
                </Link>
            </div>
        </div>
    </div>
  );
}
