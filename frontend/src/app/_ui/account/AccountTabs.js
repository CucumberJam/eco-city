import {Tabs} from "flowbite-react";
import {tabsIcons, tabsTitles} from "@/app/_store/constants";

export default function AccountTabs({
                                        tabsRef, setTabHandler,
                                        defaultValue = 0,
                                        tabs = tabsTitles,
                                        icons = tabsIcons}){
    return (
        <div className="w-[95%] my-2 mx-3">
            <Tabs variant="default"
                  className="space-x-2"
                  ref={tabsRef}
                  onActiveTabChange={(tab) => setTabHandler(tab)}>
                {tabs.map((el, inx) => (
                    <Tabs.Item key={inx}
                               active={defaultValue === inx}
                               title={el}
                               className="font-medium text-gray-800 dark:text-white"
                               icon={icons[inx]}/>
                ))}
            </Tabs>
        </div>
    );
}