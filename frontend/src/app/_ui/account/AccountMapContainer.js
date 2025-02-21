"use client";
import {useEffect, useRef} from "react";
import {accountMapModes,
    accountMapTabsIcons,
    accountMapTabsTitles} from "@/app/_store/constants";
import AccountTabs from "@/app/_ui/account/AccountTabs";
import {useAccountMap} from "@/app/_context/AccountMapProvider";
import {Spinner} from "flowbite-react";
export default function AccountMapContainer({userData}){
    const tabsRef = useRef(null);
    const {mode, setActiveMode, isFetching,
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
            {/*Map*/}
            {/*Pagination*/}
        </>

    );
}