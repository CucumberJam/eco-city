import AccountMapContainer from "@/app/_ui/account/AccountMapContainer";
import {AccountMapProvider} from "@/app/_context/AccountMapProvider";
export const metadata = {
    title: 'Личный кабинет'
}
export default function Page(){
    return (
        <AccountMapProvider>
            <AccountMapContainer/>
        </AccountMapProvider>
    );
}