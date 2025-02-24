"use client";
import dynamic from 'next/dynamic';
import {useMemo} from "react";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import PaginatedList from "@/app/_ui/general/PaginatedList";
import UserCard from "@/app/_ui/user/UserCard";
import {useModal} from "@/app/_context/ModalContext";
import {usePublicMap} from "@/app/_context/PublicMapProvider";

export default function LazyMap({
                                    withUsers = true,
                                    needDefineLocation = false,
                                    changePositionHandler = null,
                                    pickedUpPos = []}){
    const {open, close} = useModal();
    const { currentCity, setCurrentUser, currentUser} = useGlobalUIStore((state) => state);
    const {paginatedItems} = usePublicMap();
    function showModalWithActiveItem(el){
        if(el){
            open(el.id);
            setCurrentUser(el);
        }else {
            close();
            setCurrentUser(null)
        }
    }

    const Map = useMemo(()=> dynamic(
        ()=> import('./Map'), {
            loading: ()=> <p className='flex w-full my-0 mx-auto justify-items-center'>Загрузка гео-данных...</p>,
            ssr: false,
        }
    ), [currentCity?.id, paginatedItems.rows?.length]);


    if(!withUsers) return (
        <>
            <div className="bg-white mx-auto my5 w-[98%] h-full relative z-10">
                <Map position={currentCity? [currentCity.latitude, currentCity.longitude] : [4.79029, -75.69003]}
                     pickedUpPos={pickedUpPos}
                     withUsers={withUsers}
                     needDefineLocation={needDefineLocation}
                     setActiveUser={changePositionHandler}/>
            </div>
        </>
    );
/*    const displayedUsers = useMemo(()=>{
        if(!currentRole && !currentWaste && !currentWasteType && query.length === 0) return users.rows;
        return users.rows.filter(user => {
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
    }, [users.rows?.length, currentRole?.id, currentWaste?.id, currentWasteType?.id, query]);*/

    //const PaginatedUserCardList = PaginatedList(UserCard, users.rows, '#F5F5F5');

    return (
        <>
            <div className="bg-white mx-auto my5 w-[98%] h-[548px] relative z-10">
                <Map users={paginatedItems.rows}
                     position={currentCity? [currentCity.latitude, currentCity.longitude] : [4.79029, -75.69003]}
                     activeUser={currentUser}
                     setActiveUser={showModalWithActiveItem}/>
            </div>
            {/*{users.rows?.length > 0 && <PaginatedUserCardList wasteAPI={wastes}
                                                        wastesTypesAPI={wasteTypes}
                                                        handleSelect={setCurrentUser}/>}*/}
        </>
    );
}