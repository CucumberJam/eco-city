import LazyMap from "@/app/_ui/map/LazyMap";
import MapPanel from "@/app/_ui/map/MapPanel";
import {Suspense} from "react";
import {Spinner} from "flowbite-react";

export default function MapContainer(){
    return (
        <div className="w-full h-auto">
            <Suspense fallback={<Spinner/>}>
                <MapPanel/>
                <LazyMap/>
            </Suspense>
        </div>
    );
}