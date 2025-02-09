import MapSearch from "@/app/_ui/map/MapSearch";
import MapFilters from "@/app/_ui/map/MapFilters";
export default function MapPanel(){
    return (
        <div className="flex content-center justify-between
                        py-2.5 w-[98%] mx-auto">
            <MapSearch/>
            <MapFilters/>
        </div>
    );
}