import AccountMapContainer from "@/app/_ui/account/AccountMapContainer";
import {auth} from "@/auth";
export const metadata = {
    title: 'Личный кабинет'
}
export default async function Page(){
    const sessions = await auth();
    return (
        <AccountMapContainer userData={sessions.user}/>
    );
}