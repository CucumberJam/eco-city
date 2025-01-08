'use client';
import Link from "next/link";

export default function NavigationMain() {
  return (
    <nav className="z-10 text-xl">
      <ul className="flex
                      pr-2 sm:pr-0
                      flex-col sm:flex-row sm:items-center
                      gap-1 sm:gap-8 md:gap-10">
        <li className='h-5 sm:h-fit'>
          <Link href="/login" className="text-sm sm:text-base md:text-xl
          text-primary-10 hover:text-accent-10 transition-colors ">
            Login
          </Link>
        </li>
        <li className='h-5 sm:h-fit'>
          <Link href="/register" className="text-sm sm:text-base md:text-xl
          text-primary-10 hover:text-accent-10 transition-colors">
            Register
          </Link>
        </li>
      </ul>
    </nav>
  );
}
