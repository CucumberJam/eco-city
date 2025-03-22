"use client";
import LazyMap from "@/app/_ui/map/LazyMap";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import {usePublicMap} from "@/app/_context/PublicMapProvider";

export default function MapContainer(){
    const {setCurrentUser, currentUser} = useGlobalUIStore((state) => state);
    const {paginatedItems} = usePublicMap();

    return (
        <LazyMap    items={paginatedItems?.rows}
                    setActiveItem={setCurrentUser}
                    activeItem={currentUser}/>
    );
}