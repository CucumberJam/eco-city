import {auth, signOut} from "@/auth";
import NavigationList from "@/app/_ui/navigation/NavigationList";
import {ArrowRightStartOnRectangleIcon} from "@heroicons/react/24/outline";

export default  async function NavigationMain() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
      <nav className="z-10 text-xl">
        <ul className="flex
                      pr-2 sm:pr-0
                      flex-row sm:items-center
                      gap-1 sm:gap-8 md:gap-10">
            <NavigationList isLoggedIn={isLoggedIn}/>
            {isLoggedIn && <li className='h-5 sm:h-fit'>
                <form action={async () => {
                    "use server";
                    await signOut();
                }}>
                    <button type="submit" className="text-sm sm:text-base md:text-xl
                                              text-primary-10 hover:text-accent-10 transition-colors ">
                        <ArrowRightStartOnRectangleIcon
                            className='block sm:hidden pt-1 flex items-center justify-center w-10'/>
                        <span className='hidden sm:block'>Выйти</span>
                    </button>
                </form>
            </li>}
        </ul>
      </nav>
  );
}
