import AccountMapContainer from "@/app/_ui/account/AccountMapContainer";
import {auth} from "@/auth";
import MapContainer from "@/app/_ui/map/MapContainer";
import AccountMainBox from "@/app/_ui/account/main/AccountMainBox";
export const metadata = {
    title: 'Личный кабинет'
}
export default async function Page(){
    const sessions = await auth();
    return (
        <AccountMainBox>
            <AccountMapContainer userData={sessions.user}/>
        </AccountMainBox>
    );
}