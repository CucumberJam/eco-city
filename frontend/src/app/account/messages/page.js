import AccountMessagesTab from "@/app/_ui/account/tabs/AccountMessagesTab";

export const metadata = {
    title: 'Сообщения'
}
export default async function Page(){
    return (
        <AccountMessagesTab/>
    );
}