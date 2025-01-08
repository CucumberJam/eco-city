import SignInButton from "@/app/_components/SignInButton.js";
import LoginForm from "@/app/_components/LoginForm.js";
import Link from "next/link.js";

export const metadata = {
    title: 'Login'
}
export default function Page() {

  return (
    <div className="flex flex-col gap-10 mt-10 items-center ">
      <h2 className="text-3xl font-semibold">
        Sign in to access your guest area
      </h2>
        <div className='border border-gray-500 px-10 py-10 flex flex-col space-y-10'>
            <LoginForm/>
            <SignInButton />
            <div className='w-full text-center'>
                <p>Don&apos;t have an account?</p>
                <Link href='/signin' className='mx-2 underline hover:text-accent-400'>
                    Sign Up
                </Link>
            </div>
        </div>
    </div>
  );
}
