import MapSearch from "@/app/_ui/map/MapSearch";
import MapFilters from "@/app/_ui/map/MapFilters";
export default function MapPanel(){
    return (
        <div className="flex
                        flex-col
                        sm:flex-row
                        items-start
                        justify-between
                        space-x-0 sm:space-x-10
                        space-y-3 sm:space-y-0
                        py-2.5
                        w-[600px] sm:w-[720px] md:w-[87%] lg:w-[90%] xl:w-[95%] ">
            <MapSearch/>
            <MapFilters/>
        </div>
    );
}