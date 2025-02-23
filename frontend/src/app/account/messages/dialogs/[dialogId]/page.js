import {Spinner} from "flowbite-react";
import {Suspense} from "react";
import {getMessagesByDialogId} from "@/app/_lib/actions/messages";
import {MessagesProvider} from "@/app/_context/MessagesProvider";
import DialogContainer from "@/app/_ui/account/dialogs/DialogContainer";
import {getUserDialogs, makeDialogRead} from "@/app/_lib/actions/dialogs";
import {getUserId} from "@/app/_lib/helpers";

export const metadata = {
    title: 'Чат'
}
export default async function Page(props) {
    const params = await props.params;
    let {success, data} = await getUserDialogs();
    const userId = await getUserId();
    if(!data?.[0]?.isRead){
        const res = await makeDialogRead(params?.dialogId || data?.[0]?.id);
        if(success && res.success && res.data) data = res.data;
    }
    const {firstDialogMessages} = await getMessagesByDialogId(params?.dialogId || data?.[0]?.id);

    return (
        <Suspense fallback={<Spinner/>}
                  key={success}>
            <MessagesProvider>
                <DialogContainer dialogsAPI={data}
                                 userId={userId}
                                 firstDialogMessages={firstDialogMessages?.data}/>
            </MessagesProvider>
        </Suspense>
    );
}