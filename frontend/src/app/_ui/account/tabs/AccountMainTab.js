'use client'
import MapFilters from "@/app/_ui/map/MapFilters";
import MapSearch from "@/app/_ui/map/MapSearch";
import LazyMap from "@/app/_ui/map/LazyMap";
export default function AccountMainTab({mode}){
    return (
        <>
            <h3>Main tab content {mode}</h3>
            <div className="flex justify-between w-full mx-auto my-2">
                <MapSearch/>
                <MapFilters/>
            </div>
            <LazyMap/>
        </>
    );
}