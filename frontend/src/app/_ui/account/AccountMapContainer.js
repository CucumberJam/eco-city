"use client";
import {useEffect, useRef} from "react";
import {
    accountMapModes,
    accountMapTabsIcons,
    accountMapTabsTitles, paginationOptions
} from "@/app/_store/constants";
import AccountTabs from "@/app/_ui/account/AccountTabs";
import {useAccountMap} from "@/app/_context/AccountMapProvider";
import {Spinner} from "flowbite-react";
import ServerPagination from "@/app/_ui/general/ServerPagination";
import MapFilters from "@/app/_ui/map/MapFilters";
import MapSearch from "@/app/_ui/map/MapSearch";
export default function AccountMapContainer({userData}){
    const tabsRef = useRef(null);
    const {mode, setActiveMode, isFetching,
        setQuery,
        filterRoles, currentRole, setCurrentRole,
        userWastes, currentWaste, setCurrentWaste,
        userWasteTypes, currentWasteType, setCurrentWasteType,
        paginatedItems, pagination, changePagination,
        initUserData} = useAccountMap();

    useEffect(()=>{
        initUserData(userData).then(res=> console.log(res));
    }, []);

    return (
        <>
            <AccountTabs tabsRef={tabsRef} className="h-40 w-full"
                  tabs={accountMapTabsTitles.filter((el,inx)=> accountMapModes[userData.role].includes(inx))}
                  icons={accountMapTabsIcons.filter((el,inx)=> accountMapModes[userData.role].includes(inx))}
                  defaultValue={mode}
                  setTabHandler={setActiveMode}/>
            {isFetching && <Spinner/>}
            <div className="w-full h-auto">
                <div className="flex content-center justify-between
                        py-2.5 w-[98%] mx-auto">
                    <MapSearch setQueryProps={setQuery}/>
                    <MapFilters showRoles={mode === 2}
                                rolesProps={filterRoles.current}
                                currentRoleProps={currentRole}
                                setCurrentRoleProps={setCurrentRole}
                                wastesProps={userWastes.current}
                                currentWasteProps={currentWaste}
                                setCurrentWasteProps={setCurrentWaste}
                                wasteTypesProps={userWasteTypes.current}
                                currentWasteTypeProps={currentWasteType}
                                setCurrentWasteTypeProps={setCurrentWasteType}/>
                </div>

            </div>
            <ServerPagination pagination={pagination}
                              options={paginationOptions}
                              changePagePagination={changePagination}/>
        </>

    );
}