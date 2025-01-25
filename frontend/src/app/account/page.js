import {auth} from "@/auth";
import {getDialogs} from "@/app/_lib/actions";
import AccountPanel from "@/app/_ui/account/AccountPanel";
export const metadata = {
    title: 'Личный кабинет'
}
export default async function Page(){
    const session = await auth();
    //const dialogs = await getDialogs(session.user?.id, session?.accessToken);
    return (
        <>
            {/*<p>{JSON.stringify(session)}</p>*/}
            <AccountPanel/>
            {/*<p>{JSON.stringify(dialogs)}</p>*/}
        </>
    );
}