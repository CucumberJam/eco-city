"use client";
import Filter from "@/app/_ui/Filter";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import {useEffect, useMemo} from "react";
import {getUsers} from "@/app/_lib/data-service";

const filters = [
    {label: 'Статус участника', urlName: 'role', value: null},
    {label: `Вид отходов`, urlName: 'waste', value: null},
    {label: `Тип отходов`, alternativeName: 'Выберите вид отходов', urlName: 'wasteType', value: null},
]
export default function MapFilters({rolesAPI, wastesApi, wasteTypesApi}){
    const {roles, setRoles, setCurrentRole, currentRole,
        wastes, setWastes, setCurrentWaste, currentWaste,
        wasteTypes, setWasteTypes, setCurrentWasteType, currentWasteType} = useGlobalUIStore((state) => state);

    useEffect(() => {
        setRoles(rolesAPI);
        setWastes(wastesApi);
        setWasteTypes(wasteTypesApi);
    }, []);

    const displayedWasteTypes = useMemo(()=> {
        if(!currentWaste) return [];
        return wasteTypes.filter(el => el.typeId === currentWaste?.id);
    }, [currentWaste?.id]);

    const isWasteTypesDisabled = useMemo(()=> {
        return (displayedWasteTypes.length <= 0);
    }, [currentWaste?.hasTypes]);

    return (
        <div className="flex w-full px-3 justify-end gap-4 content-center h-fit">
            <Filter data={roles}
                    key={filters[0].urlName}
                    isDisabled={false}
                    dataLabel={filters[0].label}
                    dataName={filters[0].urlName}
                    setItem={setCurrentRole}
                    itemValue={currentRole?.label || ''}/>

            <Filter data={wastes}
                    key={filters[1].urlName}
                    isDisabled={false}
                    dataLabel={filters[1].label}
                    dataName={filters[1].urlName}
                    setItem={setCurrentWaste}
                    setAddItem={setCurrentWasteType}
                    itemValue={currentWaste?.name || ''}/>

            <Filter data={displayedWasteTypes}
                    alternativeName={filters[2].alternativeName}
                    key={filters[2].urlName}
                    isDisabled={isWasteTypesDisabled}
                    dataLabel={filters[2].label}
                    dataName={filters[2].urlName}
                    setItem={setCurrentWasteType}
                    itemValue={currentWasteType?.name || ''}/>
        </div>
    );
}