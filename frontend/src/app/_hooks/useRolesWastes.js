import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import {useEffect, useState} from "react";
export default function useRolesWastes(rolesAPI = null, wastesApi = null, wasteTypesApi = null){
    const [isFetched, setIsFetched] = useState(false);
    const {roles, setRoles, setCurrentRole, currentRole,
        wastes, setWastes, setCurrentWaste, currentWaste,
        wasteTypes, setWasteTypes, setCurrentWasteType, currentWasteType} = useGlobalUIStore((state) => state);


    useEffect(() => {
        if(isFetched) return;
        if(roles.length === 0 && rolesAPI) setRoles(rolesAPI);
        if(wastes.length === 0 && wastesApi) setWastes(wastesApi);
        if(wasteTypes.length === 0 && wasteTypesApi) setWasteTypes(wasteTypesApi);
        setIsFetched(true);
        }, []);


    return {roles, setCurrentRole, currentRole,
        wastes, currentWaste, setCurrentWaste,
        wasteTypes, currentWasteType, setCurrentWasteType, isFetched};
}