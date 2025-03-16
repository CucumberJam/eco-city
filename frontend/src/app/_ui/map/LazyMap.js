"use client";
import dynamic from 'next/dynamic';
import {useMemo} from "react";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import {useModal} from "@/app/_context/ModalContext";
import {Spinner} from "flowbite-react";

export default function LazyMap({
                                    withUsers = true,
                                    needDefineLocation = false,
                                    changePositionHandler = null,
                                    pickedUpPos = [],
                                    items= [],
                                    activeItem= null,
                                    setActiveItem
}){
    const {open, close} = useModal();
    const { currentCity} = useGlobalUIStore((state) => state);

    const Map = useMemo(()=> dynamic(
        ()=> import('./Map'), {
            loading: ()=> <Spinner className='flex w-full my-0 mx-auto justify-items-center'/>,
            ssr: false,
        }
    ), [currentCity.id, items?.length]);

    function showModalWithActiveItem(el){
        if(el){
            open(el.id);
            setActiveItem ? setActiveItem?.(el) : setCurrentUser(el);
        }else {
            close();
            setActiveItem ? setActiveItem?.(null) : setCurrentUser(null);
        }
    }

    if(!withUsers) return (
        <>
            <div className="max-w-[600px] sm:max-w-[750px] md:max-w-[90%] lg:max-w-[98%]
            lg:mx-auto
            bg-white my5 h-full relative z-10">
                <Map position={[Number.parseFloat(currentCity.latitude), Number.parseFloat(currentCity.longitude)]}
                     pickedUpPos={pickedUpPos}
                     withUsers={false}
                     needDefineLocation={needDefineLocation}
                     setActiveUser={changePositionHandler}/>
            </div>
        </>
    );
    return (
        <>
            <div className="max-w-[600px] sm:max-w-[750px] md:max-w-[90%] lg:max-w-[98%]
            lg:mx-auto
            bg-white my5 h-[548px] relative z-10">
                <Map users={items}
                     position={currentCity ? [currentCity.latitude, currentCity.longitude] : [4.79029, -75.69003]}
                     activeUser={activeItem}
                     setActiveUser={showModalWithActiveItem}/>
            </div>
        </>
    );
}