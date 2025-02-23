import ResponseDescription from "@/app/_ui/account/responses/ResponseDescription";
import {auth} from "@/auth";
import {getResponseById} from "@/app/_lib/actions/responses";
import {Suspense} from "react";
import {Spinner} from "flowbite-react";

export const metadata = {
    title: 'Отклик'
}
export default async function Page(props) {
    const params = await props.params;
    const session = await auth();
    const {status, data} = await getResponseById(params.responseId);

    return (
        <Suspense fallback={<Spinner/>}
                  key={status}>
            <ResponseDescription response={data}
                                 userToken={session?.accessToken}/>
        </Suspense>
    );
}