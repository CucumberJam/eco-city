"use client";
import {useRef, useState} from "react";
import {accountMapModes,
    accountMapTabsIcons,
    accountMapTabsTitles} from "@/app/_store/constants";
import AccountTabs from "@/app/_ui/account/AccountTabs";
import AccountMap from "@/app/_ui/account/main/AccountMap";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
export default function AccountMapContainer({userData}){
    const tabsRef = useRef(null);
    const [activeTab, setActiveTab] = useState(0);
    const { currentCity, cities } = useGlobalUIStore((state) => state);

    return (
        <>
            <AccountTabs tabsRef={tabsRef} className="h-40 w-full"
                  tabs={accountMapTabsTitles.filter((el,inx)=> accountMapModes[userData.role].includes(inx))}
                  icons={accountMapTabsIcons.filter((el,inx)=> accountMapModes[userData.role].includes(inx))}
                  defaultValue={activeTab}
                  setTabHandler={setActiveTab}/>
            <AccountMap mode={activeTab}
                        userRole={userData.role}
                        userWastes={userData.wastes}
                        userWasteTypes={userData.wasteTypes}
                        currentCityId={currentCity.id}/>
        </>

    );
}