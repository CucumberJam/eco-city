import AccountSettingsTab from "@/app/_ui/account/tabs/AccountSettingsTab";

export const metadata = {
    title: 'Настройки'
}
export default async function Page(){
    return (
        <AccountSettingsTab/>
    );
}