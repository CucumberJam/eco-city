"use client"
import AdvertList from "@/app/_ui/account/adverts/AdvertList";
import {useAdverts} from "@/app/_context/AdvertsProvider";
import {useEffect, useRef} from "react";
import {showOthersAdverts, showUserAdverts} from "@/app/_store/constants";
import useCities from "@/app/_hooks/useCities";
import useRolesWastes from "@/app/_hooks/useRolesWastes";
import useDimensions from "@/app/_hooks/useDimensions";
import {Tabs} from "flowbite-react";
import {HiUserCircle} from "react-icons/hi2";
import {HiClipboardList} from "react-icons/hi";
import {useTab} from "@/app/_context/TabContext";

export default function AdvertsContainer({userData, userToken,  userId,
                                             citiesAPI, dimensionsApi,
                                             rolesAPI, wastesApi, wasteTypesApi}){

    const {currentCity}  = useCities(citiesAPI, false);
    const { roles, wastes, wasteTypes } = useRolesWastes(rolesAPI, wastesApi, wasteTypesApi);
    const {dimensions} = useDimensions(dimensionsApi);

    const {advertsUser, adverts, initAdvertsContext,
        paginationAdvertsUser, paginationAdverts, changePaginationPage} = useAdverts();

    const tabsRef = useRef(null);
    const {selectedInternTabOpt, selectInternTabOpt} = useTab(); // 'Свои' -> 0, 'участников' -> 1

    const userRole = userData.role;

    useEffect(() => {
        if(!currentCity) return;
        initAdvertsContext?.(userData, userToken, userId, currentCity?.id);
    }, [currentCity?.id]);

    return (
        <>
            {userRole === 'RECEIVER' && (
                <div className="w-[98%] my-2 mx-3">
                    <Tabs variant="default"
                          className="space-x-2"
                          ref={tabsRef}
                          onActiveTabChange={(tab) => selectInternTabOpt(tab)}>
                        <Tabs.Item title="Мои публикации"
                                   className="font-medium text-gray-800 dark:text-white"
                                   icon={HiUserCircle}/>
                        <Tabs.Item title="Публикации других участников"
                                   className="font-medium text-gray-800 dark:text-white"
                                   icon={HiClipboardList}/>
                    </Tabs>
                </div>
            )}
            {(showOthersAdverts(userRole) && adverts && selectedInternTabOpt === 1) && (
                <AdvertList adverts={adverts}
                            roles={roles}
                            wastes={wastes}
                            wasteTypes={wasteTypes}
                            dimensions={dimensions}
                            showTitle={userRole !== 'RECEIVER'}
                            title="Публикации других участников:"
                            pagination={paginationAdverts}
                            changePagePagination={(page, limit, offset) =>
                                changePaginationPage(page, limit, offset, false)}/>
            )}
            {(showUserAdverts(userRole) && advertsUser && selectedInternTabOpt === 0) && (
                <AdvertList adverts={advertsUser}
                              roles={roles}
                              wastes={wastes}
                              wasteTypes={wasteTypes}
                              dimensions={dimensions}
                              showTitle={userRole !== 'RECEIVER'}
                              pagination={paginationAdvertsUser}
                              changePagePagination={(page, limit, offset) =>
                                  changePaginationPage(page, limit, offset, true)}/>
            )}

        </>
    );
}