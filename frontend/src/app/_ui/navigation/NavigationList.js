'use client';
import Link from "next/link";
import {usePathname} from "next/navigation";

export default function NavigationList({isLoggedIn}){
    const pathName = usePathname();
    return (
        <>
            {!isLoggedIn &&
                <>
                    {pathName !== '/login' && <li className='h-5 sm:h-fit'>
                        <Link href="/login" className="text-sm sm:text-base md:text-xl
          text-primary-10 hover:text-accent-10 transition-colors ">
                            Войти
                        </Link>
                    </li>
                    }
                    {pathName !== '/register' && <li className='h-5 sm:h-fit'>
                        <Link href="/register" className="text-sm sm:text-base md:text-xl
          text-primary-10 hover:text-accent-10 transition-colors">
                            Регистрация
                        </Link>
                    </li>
                    }
                </>}

            {(isLoggedIn && pathName !== '/account') && <li className='h-5 sm:h-fit'>
                <Link href="/account" className="text-sm sm:text-base md:text-xl
                                            text-primary-10 hover:text-accent-10 transition-colors ">
                    Аккаунт
                </Link>
            </li>}
        </>
    );
}