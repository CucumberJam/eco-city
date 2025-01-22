"use client";
import dynamic from 'next/dynamic';
import {useMemo} from "react";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import PaginatedList from "@/app/_ui/PaginatedList";
import UserCard from "@/app/_ui/user/UserCard";

export default function LazyMap({
                                    withUsers = true,
                                    needDefineLocation = false,
                                    changePositionHandler = null}){
    const { currentCity,
        users,
        wastes, wasteTypes,
        setCurrentUser, currentUser,
        currentRole, currentWaste, currentWasteType, query } = useGlobalUIStore((state) => state);

    const Map = useMemo(()=> dynamic(
        ()=> import('./Map'), {
            loading: ()=> <p className='flex w-full my-0 mx-auto justify-items-center'>Загрузка гео-данных...</p>,
            ssr: false,
        }
    ), [currentCity?.id, users?.length]);


    if(!withUsers) return (
        <>
            <div className="bg-white mx-auto my5 w-[98%] h-full relative z-10">
                <Map position={currentCity? [currentCity.latitude, currentCity.longitude] : [4.79029, -75.69003]}
                     withUsers={withUsers}
                     needDefineLocation={needDefineLocation}
                     setActiveUser={changePositionHandler}/>
            </div>
        </>
    );
    const displayedUsers = useMemo(()=>{
        if(!currentRole && !currentWaste && !currentWasteType && query.length === 0) return users;
        return users.filter(user => {
            let isValid = true;

            if(currentRole){
                if(user.role !== currentRole.name) isValid = false;
            }
            if(currentWaste){
                if(!user.wastes.includes(+currentWaste.id)) isValid = false;
            }
            if(currentWasteType){
                if(!user.wasteTypes.includes(+currentWasteType.id)) isValid = false;
            }
            if(query.length){
                if(!user.name.toLowerCase().includes(query.toLowerCase())) isValid = false;
            }

            if(isValid) return user;
        })
    }, [users?.length, currentRole?.id, currentWaste?.id, currentWasteType?.id, query]);

    const PaginatedUserCardList = PaginatedList(UserCard, displayedUsers, '#F5F5F5');

    return (
        <>
            <div className="bg-white mx-auto my5 w-[98%] h-[548px] relative z-10">
                <Map users={displayedUsers}
                     position={currentCity? [currentCity.latitude, currentCity.longitude] : [4.79029, -75.69003]}
                     activeUser={currentUser}
                     setActiveUser={setCurrentUser}/>
            </div>
            {users.length > 0 && <PaginatedUserCardList wasteAPI={wastes}
                                                        wastesTypesAPI={wasteTypes}
                                                        handleSelect={setCurrentUser}/>}
        </>
    );
}