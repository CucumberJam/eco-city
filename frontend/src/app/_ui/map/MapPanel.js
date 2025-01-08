import MapSearch from "@/app/_ui/map/MapSearch";
import MapFilters from "@/app/_ui/map/MapFilters";
import {getRoles, getWastes, getWasteTypes} from "@/app/_lib/data-service";

export default async function MapPanel(){
    const [roles, wastes, wasteTypes] = await Promise.all([
        getRoles(), getWastes(), getWasteTypes()
    ]);
    return (
        <div className="flex content-center justify-between py-2.5 w-[98%] mx-auto">
            <MapSearch/>
            <MapFilters rolesAPI={roles}
                        wastesApi={wastes}
                        wasteTypesApi={wasteTypes}/>
        </div>
    );
}