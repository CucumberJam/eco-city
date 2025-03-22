"use client";
import useRolesWastes from "@/app/_hooks/useRolesWastes";
import useDimensions from "@/app/_hooks/useDimensions";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import {useEffect} from "react";
import {getUsersByParams} from "@/app/_lib/actions/users";
import {fetchAddress} from "@/app/_lib/geo-api";

export default function LayoutBodyContainer({
                                                children,
                                                serif,
                                                citiesAPI,
                                                dimensionsApi,
                                                rolesAPI,
                                                wastesApi,
                                                wasteTypesApi,
                                                usersAPI,
                                            }){

    useRolesWastes(rolesAPI, wastesApi, wasteTypesApi);
    useDimensions(dimensionsApi);
    const {setUsers, setCities, setCurrentCity} = useGlobalUIStore(state => state);

    useEffect(() => {
        async function getUserCity(){
            try{
                const { address} = await fetchAddress();
                const currentCityName = address?.city;
                const found = citiesAPI.find(city => city.engName === currentCityName);
                if(found) setCurrentCity(found);
                return found ? found : citiesAPI[0];
            }catch (e) {
                return citiesAPI[0];
            }
        }

        if(citiesAPI) {
            setCities(citiesAPI);
            setCurrentCity(citiesAPI[0]);
        }

        getUserCity()
            .then(city => {
                getUsersByParams(0, 10, {cityId: city.id})
                    .then(res => {
                    const {success, data} = res;
                    if(success) setUsers(data);
                }).catch(err => console.log(err))
            })
            .catch(e => {
                setUsers(usersAPI);
            });
    }, []);

    return (
        <body className={`${serif}
            bg-primary-50 text-primary-700 min-h-screen
            flex flex-col antialiasing`}>
            {children}
        </body>
    );
}