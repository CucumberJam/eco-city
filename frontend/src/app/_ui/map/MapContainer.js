import LazyMap from "@/app/_ui/map/LazyMap";
import MapPanel from "@/app/_ui/map/MapPanel";

export default function MapContainer(){
    return (
        <div className="w-full h-auto">
            <MapPanel/>
            <LazyMap/>
        </div>
    );
}