"use client";
import {Dropdown, DropdownItem, Spinner} from "flowbite-react";
import { useGlobalUIStore } from '@/app/_context/GlobalUIContext'
import {getUsersByParams} from "@/app/_lib/actions/users";
export default function CitySection(){
    const { currentCity, cities, setCurrentCity, setUsers } = useGlobalUIStore((state) => state);
    async function selectCity(city){
        setCurrentCity(city);
        const {success, data: users} = await getUsersByParams(0, 10, {cityId: city.id});
        if(success) setUsers(users);
    }
    if(!currentCity) return <Spinner size={'sm'}/>;
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