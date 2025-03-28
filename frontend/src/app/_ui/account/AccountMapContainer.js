"use client";
import {useEffect, useRef} from "react";
import {useSession} from "next-auth/react";
import { useRouter } from 'next/navigation';
import {useModal} from "@/app/_context/ModalContext";
import {useAccountMap} from "@/app/_context/AccountMapProvider";
import {
    accountMapModes,
    accountMapTabsIcons,
    accountMapTabsTitles, paginationOptions
} from "@/app/_store/constants";
import AccountTabs from "@/app/_ui/account/AccountTabs";
import {Spinner} from "flowbite-react";
import ServerPagination from "@/app/_ui/general/ServerPagination";
import MapFilters from "@/app/_ui/map/MapFilters";
import MapSearch from "@/app/_ui/map/MapSearch";
import LazyMap from "@/app/_ui/map/LazyMap";
import NoDataBanner from "@/app/_ui/general/NoDataBanner";
import CardLayout from "@/app/_ui/general/CardLayout";
import ItemCard from "@/app/_ui/account/ItemCard";
import {ModalView} from "@/app/_ui/general/ModalView";
import ResponseDescription from "@/app/_ui/account/responses/ResponseDescription";
import AdvertInfo from "@/app/_ui/account/adverts/AdvertInfo";
import UserDescription from "@/app/_ui/user/UserDescription";

export default function AccountMapContainer(){
    const router = useRouter();
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {router.push('/')},
    })
    const userData = session?.user;

    const tabsRef = useRef(null);
    const {mode, changeMode, isFetching,
        setQuery,
        filterRoles, currentRole, setCurrentRole,
        userWastes, currentWaste, setCurrentWaste,
        userWasteTypes, currentWasteType, setCurrentWasteType,
        paginatedItems, pagination, changePagination,
        activeItem, setActiveItem,
        initUserData} = useAccountMap();
    const {currentOpen, close, open} = useModal();

    useEffect(()=>{
        initUserData(userData);
    }, []);

    function showModalWithActiveItem(el){
        open(el.id);
        setActiveItem(el);
    }
    return (
        <>
            <AccountTabs tabsRef={tabsRef} className="h-40 w-full"
                  tabs={accountMapTabsTitles.filter((el,inx)=> accountMapModes[userData.role].includes(inx))}
                  icons={accountMapTabsIcons.filter((el,inx)=> accountMapModes[userData.role].includes(inx))}
                  defaultValue={mode}
                  setTabHandler={changeMode}/>
            {isFetching ? <Spinner/> :
                (<>
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
                        {paginatedItems?.rows?.length > 0 ? (
                            <>
                                <LazyMap    items={paginatedItems.rows}
                                            setActiveItem={setActiveItem}
                                            activeItem={activeItem}/>
                                <CardLayout key={mode}>
                                    {paginatedItems.rows.map(el => (
                                        <ItemCard key={el.id}
                                                  item={el}
                                                  mode={mode}
                                                  clickHandler={showModalWithActiveItem}/>
                                    ))}
                                </CardLayout>
                            </>
                        ) : (
                            <NoDataBanner title='Нет данных'/>
                        )}
                    </div>
                    <ServerPagination pagination={pagination}
                                      options={paginationOptions}
                                      changePagePagination={changePagination}/>
                </>)
            }
            <ModalView isOpen={currentOpen === activeItem?.id}
                       title={mode === 0 ? "Отклик на сбыт отходов" : (mode === 1 ? "Публикация на сбыт отходов" : "Описание участника")}
                       handleClose={()=> {
                           setActiveItem?.(null);
                           close();
                       }}>
                {mode === 0 && <ResponseDescription response={activeItem} isUser={false}/>}
                {mode === 1 && <AdvertInfo advert={activeItem}/>}
                {mode === 2 && <UserDescription data={activeItem}/>}
            </ModalView>
        </>

    );
}