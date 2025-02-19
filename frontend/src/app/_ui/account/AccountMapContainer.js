"use client";
import {useRef, useState} from "react";
import {accountMapModes,
    accountMapTabsIcons,
    accountMapTabsTitles} from "@/app/_store/constants";
import MapContainer from "@/app/_ui/map/MapContainer";
import AccountTabs from "@/app/_ui/account/AccountTabs";
export default function AccountMapContainer({userData}){
    const tabsRef = useRef(null);
    const [activeTab, setActiveTab] = useState(0);

    console.log(userData);
    return (
        <main>
            <AccountTabs tabsRef={tabsRef} className="h-40 w-full"
                  tabs={accountMapTabsTitles.filter((el,inx)=> accountMapModes[userData.role].includes(inx))}
                  icons={accountMapTabsIcons.filter((el,inx)=> accountMapModes[userData.role].includes(inx))}
                  defaultValue={activeTab}
                  setTabHandler={setActiveTab}/>
            <MapContainer/>
        </main>
    );
}