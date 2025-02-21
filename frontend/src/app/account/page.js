import AccountMapContainer from "@/app/_ui/account/AccountMapContainer";
import {auth} from "@/auth";
import {AccountMapProvider} from "@/app/_context/AccountMapProvider";
export const metadata = {
    title: 'Личный кабинет'
}
export default async function Page(){
    const sessions = await auth();
    return (
        <AccountMapProvider>
            <AccountMapContainer userData={sessions.user}/>
        </AccountMapProvider>
    );
}