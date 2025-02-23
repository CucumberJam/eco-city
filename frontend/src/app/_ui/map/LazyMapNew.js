"use client";
import dynamic from 'next/dynamic';
import {useMemo} from "react";
export default function LazyMapNew({
                                       withUsers = true,
                                       currentCityId,
                                       currentCityLong,
                                       currentCityLat,
                                       users = [],
                                       currentUser,
                                       setCurrentUser,
                                       needDefineLocation = false,
                                       changePositionHandler = null,
                                       pickedUpPos = []
}){

    const Map = useMemo(()=> dynamic(
        ()=> import('./MapNew'), {
            loading: ()=> <p className='flex w-full my-0 mx-auto justify-items-center'>Загрузка гео-данных...</p>,
            ssr: false,
        }
    ), [currentCityId, users?.length]);

    if(!withUsers) return (
        <>
            <div className="bg-white mx-auto my5 w-[98%] h-full relative z-10">
                <Map position={[currentCityLat, currentCityLong]}
                     pickedUpPos={pickedUpPos}
                     withUsers={false}
                     needDefineLocation={needDefineLocation}
                     setActiveUser={changePositionHandler}/>
            </div>
        </>
    );

    return (
        <>
            <div className="bg-white mx-auto my5 w-[98%] h-[548px] relative z-10">
                <Map users={users}
                     position={[currentCityLat, currentCityLong]}
                     activeUser={currentUser}
                     setActiveUser={setCurrentUser}/>
            </div>
        </>
    );
}