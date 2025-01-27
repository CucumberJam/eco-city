'use client'
import {useTab} from "@/app/_context/TabContext";
import AccountMainTab from "@/app/_ui/account/tabs/AccountMainTab";
import AccountMessagesTab from "@/app/_ui/account/tabs/AccountMessagesTab";
import AccountProfileTab from "@/app/_ui/account/tabs/AccountProfileTab";
import AccountSettingsTab from "@/app/_ui/account/tabs/AccountSettingsTab";
import {memo} from "react";
import useRolesWastes from "@/app/_hooks/useRolesWastes";

export default function AccountContainer({userData, rolesAPI, wastesApi, wasteTypesApi}){
    const {mode, tab, selectedTabOpt, selectedInternTabOpt} = useTab();
    const {roles, wastes, wasteTypes} = useRolesWastes(rolesAPI, wastesApi, wasteTypesApi);

    return (
        <main className='w-full flex flex-col mx-auto my-0 py-2 px-3'>
            {tab === 'Главная' && <AccountMainTab mode={mode}
                                                  roles={roles}
                                                  wastes={wastes}
                                                  wasteTypes={wasteTypes}/>}
            {tab === 'Сообщения' && <AccountMessagesTab mode={mode}
                                                        tabOption={selectedTabOpt}
                                                        tabAction={selectedInternTabOpt}/>}
            {tab === 'Аккаунт' && <AccountProfileTab/>}
            {tab === 'Настройки' && <AccountSettingsTab/>}
        </main>
    );
}