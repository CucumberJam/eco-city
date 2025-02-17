"use client";
import { Dropdown, DropdownItem } from "flowbite-react";
import { useGlobalUIStore } from '@/app/_context/GlobalUIContext'
import {getUsers} from "@/app/_lib/data-service";
import useCities from "@/app/_hooks/useCities";
export default function CitySection(){
    const {currentCity, cities, setCurrentCity}  = useCities(null, true);
    const { setUsers } = useGlobalUIStore((state) => state);
    async function selectCity(city){
        setCurrentCity(city);
        const {status: statusUsers, data: users} = await getUsers({cityId: city.id});
        if(statusUsers === 'success') setUsers(users);
    }
    if(!cities) return <p>Fetching cities...</p>;
    return (
    <Dropdown label={currentCity?.name || "Город: "} inline size="sm"
              dismissOnClick={true}>
        {cities.map((city, index) => (
            <DropdownItem key={city?.id || index}
                          value={city.name}
                          onClick={async() => await selectCity(city)}>
                {city.name}
            </DropdownItem>
        ))}
    </Dropdown>
    );
}