import {getUserDialogs} from "@/app/_lib/actions/dialogs";
import {redirect} from "next/navigation";
export const metadata = {
    title: 'Чаты'
}
export default async function Page(){
    const {data} = await getUserDialogs();
    await redirect(`/account/messages/dialogs/${data?.[0]?.id}`)
    return <div></div>
}