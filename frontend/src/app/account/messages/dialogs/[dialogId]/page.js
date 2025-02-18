import {auth} from "@/auth";
import {getDialogById} from "@/app/_lib/actions";
import {Spinner} from "flowbite-react";
import {Suspense} from "react";
import {getMessagesByDialogId} from "@/app/_lib/actions/messages";
import {MessagesProvider} from "@/app/_context/MessagesProvider";
import DialogContainer from "@/app/_ui/account/dialogs/DialogContainer";
import {getUserDialogs} from "@/app/_lib/actions/dialogs";
import {getUserId} from "@/app/_lib/helpers";

export const metadata = {
    title: 'Чат'
}
export default async function Page(props) {
    const params = await props.params;
    const {status, data} = await getUserDialogs();
    const userId = await getUserId();
    const {firstDialogMessages} = await getMessagesByDialogId(params?.dialogId || data?.[0]?.id);
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