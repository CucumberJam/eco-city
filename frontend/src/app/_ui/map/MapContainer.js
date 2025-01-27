import LazyMap from "@/app/_ui/map/LazyMap";
import MapPanel from "@/app/_ui/map/MapPanel";
import {Suspense} from "react";
import {Spinner} from "flowbite-react";

export default function MapContainer(){
    return (
        <div className="w-full h-auto">
            <Suspense fallback={<Spinner className='mx-auto flex justify-center' size='lg'/>}>
                <MapPanel/>
                <LazyMap/>
            </Suspense>
        </div>
    );
}