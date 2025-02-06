import {auth} from "@/auth";
import {AdvertsProvider} from "@/app/_context/AdvertsProvider";
import AdvertsContainer from "@/app/_ui/account/adverts/AdvertsContainer";
import {getCities, getDimensions, getRoles, getWastes, getWasteTypes} from "@/app/_lib/data-service";
import {Spinner} from "flowbite-react";
import {Suspense} from "react";

export const metadata = {
    title: 'Публикации на сбыт'
}
export default async function Page(){
    const session = await auth();
    const [roles, wastes, wasteTypes, dimensions,
        {status: statusCities, data: cities}] = await Promise.all([
        getRoles(), getWastes(), getWasteTypes(), getDimensions(), getCities(),
    ]);

    return (
        <div className="w-full h-fit overflow-auto">
            <AdvertsProvider>
                <Suspense fallback={<Spinner/>}
                          key={statusCities}>
                <AdvertsContainer userData={session?.user}
                                  userToken={session?.accessToken}
                                  userId={session?.user.id}
                                  citiesAPI={cities}
                                  rolesAPI={roles}
                                  wastesApi={wastes}
                                  wasteTypesApi={wasteTypes}
                                  dimensionsApi={dimensions}/>
                </Suspense>
            </AdvertsProvider>
        </div>
    );
}