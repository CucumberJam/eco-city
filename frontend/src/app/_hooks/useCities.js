import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import {useEffect, useState} from "react";
import {fetchAddress} from "@/app/_lib/geo-api";
import {getUsers} from "@/app/_lib/data-service";

export default function useCities(citiesAPI, withUsers = false){

    const { currentCity, cities, setCities, setCurrentCity, setUsers} =
        useGlobalUIStore((state) => state);
    const [error, setError] = useState('');

    useEffect(() => {
        async function getCity(){
            if(cities.length > 0 && currentCity) return;

            setCities(citiesAPI);
            try{
                const { address} = await fetchAddress();
                const currentCityName = address?.city;
                const found = citiesAPI.find(city => city.engName === currentCityName);
                const currentCity = found? found : cities[1];
                setCurrentCity(currentCity);
                if(withUsers){
                    const {status: statusUsers, data: users} = await getUsers({cityId: currentCity.id});
                    if(statusUsers === 'success') setUsers(users);
                }
            }catch (e) {
                setCurrentCity(citiesAPI[0]);
            }
        }
        getCity().catch(e => {
            console.log(e);
            setError(prev => e.message)
        });
    }, []);

    return {error, currentCity, cities, setCurrentCity, setCities};
}