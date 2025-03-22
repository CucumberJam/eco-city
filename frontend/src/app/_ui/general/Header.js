import NavigationMain from '@/app/_ui/navigation/NavigationMain';
import Logo from '@/app/_ui/general/Logo';
import CitySection from "@/app/_ui/general/CitySection";
export default function Header() {
    return (
        <header className='px-4 py-2 sm:px-5 sm:py-4 md:px-8 md:py-5
                            w-full flex flex-row justify-between'>
            <Logo/>
            <div className='flex
            flex-col sm:flex-row
            space-x-0 sm:space-x-8
            justify-start sm:justify-between
            items-center'>
                <CitySection/>
                <NavigationMain/>
            </div>
        </header>
    );
}
