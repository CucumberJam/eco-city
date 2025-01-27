import AccountPanel from "@/app/_ui/account/AccountPanel";
export const metadata = {
    title: 'Личный кабинет'
}
export default async function Page(){
    return (
        <>
            <AccountPanel/>
        </>
    );
}