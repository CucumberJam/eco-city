import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import {useEffect} from "react";
export default function useRolesWastes(rolesAPI, wastesApi, wasteTypesApi){

    const {roles, setRoles, setCurrentRole, currentRole,
        wastes, setWastes, setCurrentWaste, currentWaste,
        wasteTypes, setWasteTypes, setCurrentWasteType, currentWasteType} = useGlobalUIStore((state) => state);


    useEffect(() => {
        setRoles(rolesAPI);
        setWastes(wastesApi);
        setWasteTypes(wasteTypesApi);
    }, []);


    return {roles, setCurrentRole, currentRole,
        wastes, currentWaste, setCurrentWaste,
        wasteTypes, currentWasteType, setCurrentWasteType};
}