'use client'
import {useTab} from "@/app/_context/TabContext";
import AccountMainTab from "@/app/_ui/account/tabs/AccountMainTab";
import AccountMessagesTab from "@/app/_ui/account/tabs/AccountMessagesTab";
import AccountProfileTab from "@/app/_ui/account/tabs/AccountProfileTab";
import AccountSettingsTab from "@/app/_ui/account/tabs/AccountSettingsTab";
import {memo} from "react";

export default function AccountContainer({userData}){
    const {mode, tab, selectedTabOpt, selectedInternTabOpt} = useTab();
    console.log(userData);

    const Content = memo(() => { //    //tab = Главная / Сообщения / Аккаунт / Настройки;
        switch (tab) {
            case 'Главная': {
                return <AccountMainTab mode={mode}/>
            }
            case 'Сообщения': {
                return <AccountMessagesTab mode={mode}
                                           tabOption={selectedTabOpt}
                                           tabAction={selectedInternTabOpt}/>
            }
            case 'Аккаунт': {
                return <AccountProfileTab/>
            }
            case 'Настройки': {
                return <AccountSettingsTab/>
            }
        }
    }, [tab]);

    return (
        <main className='col-span-2 row-span-2 py-2 px-4 overflow-auto'>
            <div className='flex flex-col max-w-[120rem] mx-auto my-0'>
                <Content/>
            </div>
        </main>
    );
}