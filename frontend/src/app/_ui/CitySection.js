"use client";
import { Dropdown, DropdownItem } from "flowbite-react";
import {useEffect} from "react";
import { useGlobalUIStore } from '@/app/_context/GlobalUIContext'
import {fetchAddress} from "@/app/_lib/geo-api";
import {getUsers} from "@/app/_lib/data-service";
export default function CitySection({citiesAPI}){
    const { currentCity, cities, setCities, setCurrentCity, setUsers } =
        useGlobalUIStore((state) => state)

    useEffect(() => {
        async function getCity(){
            setCities(citiesAPI);
            try{
                const { address} = await fetchAddress();
                const currentCityName = address?.city;
                const found = citiesAPI.find(city => city.engName === currentCityName);
                const currentCity = found? found : cities[1];
                setCurrentCity(currentCity);
                const {status: statusUsers, data: users} = await getUsers({cityId: currentCity.id});
                if(statusUsers === 'success') setUsers(users);
            }catch (e) {
                setCurrentCity(citiesAPI[0]);
            }
        }
        getCity().catch(e=> console.log(e));
    }, []);

    async function selectCity(city){
        setCurrentCity(city);
        const {status: statusUsers, data: users} = await getUsers({cityId: city.id});
        if(statusUsers === 'success') setUsers(users);
    }
    if(!cities) return <p>Fetching cities...</p>;
    return (
    <Dropdown label={currentCity?.name || "Город: "} inline size="sm"
              dismissOnClick={true}>
        {cities.map(city => (
            <DropdownItem key={city.id}
                          value={city.name}
                          onClick={async() => await selectCity(city)}>
                {city.name}
            </DropdownItem>
        ))}
    </Dropdown>
    );
}