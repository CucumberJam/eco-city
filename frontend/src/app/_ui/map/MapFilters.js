"use client";
import Filter from "@/app/_ui/general/Filter";
import {useMemo} from "react";
import useRolesWastes from "@/app/_hooks/useRolesWastes";

const filters = [
    {label: 'Статус участника', urlName: 'role', value: null},
    {label: `Вид отходов`, urlName: 'waste', value: null},
    {label: `Тип отходов`, alternativeName: 'Выберите вид отходов', urlName: 'wasteType', value: null},
]
export default function MapFilters({
                                       showRoles = true,
                                       rolesProps = null,
                                       setCurrentRoleProps = null,
                                       currentRoleProps = null,
                                       wastesProps = null,
                                       currentWasteProps = null,
                                       setCurrentWasteProps = null,
                                       wasteTypesProps = null,
                                       currentWasteTypeProps  = null,
                                       setCurrentWasteTypeProps = null,
                                   }){

    const {roles, setCurrentRole, currentRole,
        wastes, currentWaste, setCurrentWaste,
        wasteTypes, currentWasteType, setCurrentWasteType} = useRolesWastes();


    const displayedWasteTypes = useMemo(()=> {
        if(!currentWaste && !currentWasteProps) return [];
        if(currentWasteProps && wasteTypesProps){
            return wasteTypesProps.filter(el => el.typeId === currentWasteProps?.id);
        }else return wasteTypes.filter(el => el.typeId === currentWaste?.id);
    }, [currentWaste?.id, currentWasteProps?.id]);


    return (
        <div className="flex w-full px-3 justify-end gap-4 content-center h-fit">
            {showRoles && <Filter data={rolesProps ? rolesProps : roles}
                     key={filters[0].urlName}
                     isDisabled={false}
                     dataLabel={filters[0].label}
                     dataName={filters[0].urlName}
                     setItem={setCurrentRoleProps? setCurrentRoleProps: setCurrentRole}
                     itemValue={currentRole?.label || ''}/>}

            {(!setCurrentWasteProps || !wastesProps)  ?(
                <Filter data={wastes}
                     key={filters[1].urlName}
                     isDisabled={false}
                     dataLabel={filters[1].label}
                     dataName={filters[1].urlName}
                     setItem={setCurrentWaste}
                     setAddItem={setCurrentWasteType}
                     itemValue={currentRoleProps ? currentRoleProps?.name || '' : currentWaste?.name || ''}/>
                ) : (
                <Filter data={wastesProps}
                        key={filters[1].urlName}
                        isDisabled={false}
                        dataLabel={filters[1].label}
                        dataName={filters[1].urlName}
                        setItem={setCurrentWasteProps}
                        setAddItem={setCurrentWasteTypeProps}
                        itemValue={currentWasteProps?.name || ''}/>
            )}
            {(!wasteTypesProps || !setCurrentWasteTypeProps) ? (
                <Filter data={displayedWasteTypes}
                     alternativeName={filters[2].alternativeName}
                     key={filters[2].urlName}
                     isDisabled={(currentWaste && !currentWaste.hasTypes) || !displayedWasteTypes?.length}
                     dataLabel={filters[2].label}
                     dataName={filters[2].urlName}
                     setItem={setCurrentWasteType}
                     itemValue={currentWasteType?.name || ''}/>
                ) : (
                <Filter data={displayedWasteTypes}
                    alternativeName={filters[2].alternativeName}
                    key={filters[2].urlName}
                    isDisabled={(currentWasteProps && !currentWasteProps.hasTypes) || !displayedWasteTypes?.length}
                    dataLabel={filters[2].label}
                    dataName={filters[2].urlName}
                    setItem={setCurrentWasteTypeProps}
                    itemValue={currentWasteTypeProps?.name || ''}/>
                )}
        </div>
    );
}