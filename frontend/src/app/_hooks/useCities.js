import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import {useEffect, useState} from "react";
import {fetchAddress} from "@/app/_lib/geo-api";
import {getCities} from "@/app/_lib/actions/global";
import {getUsersByParams} from "@/app/_lib/actions/users";

export default function useCities(citiesAPI = null, withUsers = false){

    const { currentCity, cities, setCities, setCurrentCity, setUsers} =
        useGlobalUIStore((state) => state);
    const [error, setError] = useState('');

    useEffect(() => {
        const errors = [];
        async function getCity(){
            if(cities.length > 0 && currentCity) return;
            if(citiesAPI) setCities(citiesAPI);
            else{
                try{
                    const res = await getCities();
                    if(res?.success && res?.data) setCities(res.data);
                    else throw new Error(res?.message || 'Ошибка получения городов');
                }catch (e) {
                    errors.push(e.message);
                }
            }
            try{
                const { address} = await fetchAddress();
                const currentCityName = address?.city;
                const found = citiesAPI.find(city => city.engName === currentCityName);
                const currentCity = found? found : cities[1];
                setCurrentCity(currentCity);
                if(withUsers){
                    const {success, data: users} = await getUsersByParams({cityId: currentCity.id});
                    if(success) setUsers(users);
                }
            }catch (e) {
                errors.push(e.message)
                setCurrentCity(citiesAPI[0]);
            }
        }
        getCity().catch(e => {
            console.log(e);
            setError(errors.length > 0 ? errors.join('; '): e.message);
            setTimeout(()=>{
                setError('');
            }, 3000)
        });
    }, []);

    return {error, currentCity, cities, setCurrentCity, setCities};
}