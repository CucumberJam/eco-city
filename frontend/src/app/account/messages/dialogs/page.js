import {getUserDialogs} from "@/app/_lib/actions/dialogs";
import {Spinner} from "flowbite-react";
import {Suspense} from "react";
import DialogContainer from "@/app/_ui/account/dialogs/DialogContainer";
import {getMessagesByDialogId} from "@/app/_lib/actions/messages";
import {MessagesProvider} from "@/app/_context/MessagesProvider";
import {getUserId} from "@/app/_lib/helpers";
export const metadata = {
    title: 'Чаты'
}
export default async function Page(){
    const {status, data} = await getUserDialogs();
    const userId = await getUserId();
    const firstDialogMessages = await getMessagesByDialogId(data?.[0]?.id);
    return (
        <Suspense fallback={<Spinner/>}
                  key={status}>
            <MessagesProvider>
                <DialogContainer dialogs={data}
                                 userId={userId}
                                 firstDialogMessages={firstDialogMessages?.data}/>
            </MessagesProvider>
        </Suspense>
    );
}