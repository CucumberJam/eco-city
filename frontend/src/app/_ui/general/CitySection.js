"use client";
import { Dropdown, DropdownItem } from "flowbite-react";
import { useGlobalUIStore } from '@/app/_context/GlobalUIContext'
import useCities from "@/app/_hooks/useCities";
import {getUsersByParams} from "@/app/_lib/actions/users";
export default function CitySection(){
    const {currentCity, cities, setCurrentCity}  = useCities(null, true);
    const { setUsers } = useGlobalUIStore((state) => state);
    async function selectCity(city){
        setCurrentCity(city);
        const {success, data: users} = await getUsersByParams({cityId: city.id});
        if(success) setUsers(users.rows);
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