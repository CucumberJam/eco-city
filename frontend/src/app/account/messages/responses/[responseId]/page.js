import ResponseDescription from "@/app/_ui/account/responses/ResponseDescription";
import {getResponseById} from "@/app/_lib/actions/responses";
import {Suspense} from "react";
import {Spinner} from "flowbite-react";
import {geOtherUserNameRoleById} from "@/app/_lib/actions/users";

export const metadata = {
    title: 'Отклик'
}
export default async function Page(props) {
    const params = await props.params;
    const {status, data} = await getResponseById(params.responseId);
    const advertUser = await geOtherUserNameRoleById(+data.advert.userId)
    return (
        <Suspense fallback={<Spinner/>}
                  key={status}>
            <ResponseDescription response={data}
                                 advertUser={advertUser?.data}/>
        </Suspense>
    );
}