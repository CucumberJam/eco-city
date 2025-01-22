import {auth} from "@/auth";
import {getDialogs} from "@/app/_lib/actions";

export default async function Page(){
    const session = await auth();
    //const dialogs = await getDialogs(session.user?.id, session?.accessToken);
    return (
        <>
            <div>Account</div>
            <p>{JSON.stringify(session)}</p>
            {/*<p>{JSON.stringify(dialogs)}</p>*/}
        </>
    );
}