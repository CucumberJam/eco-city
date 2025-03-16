'use client';
import Link from "next/link";
import {usePathname} from "next/navigation";
import {UserCircleIcon} from "@heroicons/react/24/outline";
import {ArrowRightEndOnRectangleIcon} from "@heroicons/react/24/outline";
import {UserPlusIcon} from "@heroicons/react/24/outline";

export default function NavigationList({isLoggedIn}){
    const pathName = usePathname();
    return (
        <>
            {!isLoggedIn &&
                <>
                    {pathName !== '/login' && <li className='h-5 sm:h-fit'>
                        <Link href="/login" className="text-sm sm:text-base md:text-xl
          text-primary-10 hover:text-accent-10 transition-colors ">
                            <ArrowRightEndOnRectangleIcon className='block sm:hidden w-11'/>
                            <span className='hidden sm:block'>Войти</span>
                        </Link>
                    </li>
                    }
                    {pathName !== '/register' && <li className='h-5 sm:h-fit'>
                        <Link href="/register" className="text-sm sm:text-base md:text-xl
          text-primary-10 hover:text-accent-10 transition-colors">
                            <UserPlusIcon className='block sm:hidden w-11'/>
                            <span className='hidden sm:block'>Регистрация</span>
                        </Link>
                    </li>
                    }
                </>}

            {(isLoggedIn && pathName !== '/account') && <li className='h-5 sm:h-fit'>
                <Link href="/account" className="text-sm sm:text-base md:text-xl
                                            text-primary-10 hover:text-accent-10 transition-colors ">

                 <UserCircleIcon className='block sm:hidden w-11'/>
                 <span className='hidden sm:block'>Аккаунт</span>
                </Link>
            </li>}
        </>
    );
}