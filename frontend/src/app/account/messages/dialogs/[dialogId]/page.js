import {auth} from "@/auth";
import {getDialogById} from "@/app/_lib/actions";
import {Spinner} from "flowbite-react";
import {Suspense} from "react";

export const metadata = {
    title: 'Чат'
}
export default async function Page(props) {
    const params = await props.params;
    const session = await auth();
    const {status, data} = await getDialogById(session?.accessToken, params.dialogId);
    return (
            <Suspense fallback={<Spinner/>}
                      key={status}>
                <div>
                    DIALOG {JSON.parse(data.id)}
                </div>
            </Suspense>
    );
}