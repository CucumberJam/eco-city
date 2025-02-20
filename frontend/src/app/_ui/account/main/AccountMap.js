"use client";
import usePaginatedItems from "@/app/_hooks/usePaginatedItems";
import {fetchMapUsers} from "@/app/_lib/actions/account-map";
import MapContainer from "@/app/_ui/map/MapContainer";
import {useEffect, useRef} from "react";
import {initialPagination} from "@/app/_store/constants";
export default function AccountMap({   userRole,
                                       userWastes = [],
                                       userWasteTypes = [],
                                       mode = 0,
                                       currentCityId}){
    const addArgs = useRef({
        mode: mode,
        userRole: userRole,
        cityId: currentCityId,
        wastes: userWastes,
        wasteTypes: userWasteTypes
    });

    useEffect(()=>{
        addArgs.current.mode = mode;
        addArgs.current.cityId = currentCityId;

        setAdditional(prev =>  addArgs.current);

        fetchAndSetItems(initialPagination.offset, initialPagination.limit, 1,  addArgs.current)
            /*.then(res => console.log(res))*/
            .catch(res => console.log(res));

    }, [mode, currentCityId]);

    const {items, fetchAndSetItems, setAdditional,
        pagination, changePagination} = usePaginatedItems({fetchFunc: fetchMapUsers, additionalArgs: addArgs});
    console.log(items)

    return (
        <MapContainer/>
    );
}