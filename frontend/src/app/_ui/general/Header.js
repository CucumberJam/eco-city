import NavigationMain from '@/app/_ui/navigation/NavigationMain';
import Logo from '@/app/_ui/general/Logo';
import CitySection from "@/app/_ui/general/CitySection";
import {getCities} from "@/app/_lib/data-service";
import {Suspense} from "react";
import {Spinner} from "flowbite-react";
export default async function Header() {
    const {status: statusCities, data: cities} = await getCities();
    return (
        <header className='px-4 py-2 sm:px-5 sm:py-4 md:px-8 md:py-5
                            w-full flex flex-row justify-between'>
            <Logo/>
            <div className='flex justify-between items-center gap-8'>
                <Suspense fallback={<Spinner/>}
                          key={statusCities}>
                    <CitySection citiesAPI={cities}/>
                </Suspense>
                <NavigationMain/>
            </div>
        </header>
    );
}
