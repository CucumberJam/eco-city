import {auth} from "@/auth";
import {getAdvertsOfUser} from "@/app/_lib/actions";
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
    const userRole = session.user?.role;
    const [roles, wastes, wasteTypes, dimensions,
        {status: statusCities, data: cities}] = await Promise.all([
        getRoles(), getWastes(), getWasteTypes(), getDimensions(), getCities(),
    ]);
    const resAdvertsOfUser = (['RECEIVER', 'PRODUCER'].includes(userRole)) ?
    await getAdvertsOfUser(session?.user.id, session?.accessToken) : null;

    return (
        <div className="w-full h-fit overflow-auto">
            <AdvertsProvider>
                <Suspense fallback={<Spinner/>}
                          key={statusCities}>
                <AdvertsContainer userData={session?.user}
                                  userToken={session?.accessToken}
                                  advertsOfUserAPI={resAdvertsOfUser?.data || { count: 0, rows: [] }}
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