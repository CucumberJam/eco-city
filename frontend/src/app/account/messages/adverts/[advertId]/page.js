import {auth} from "@/auth";
import {Suspense} from "react";
import {Spinner} from "flowbite-react";
import AdvertDescription from "@/app/_ui/account/adverts/AdvertDescription";
import {getAdvertById} from "@/app/_lib/actions";

export const metadata = {
    title: 'Публикация'
}
export default async function Page(props){
    const params = await props.params;
    const session = await auth();
    const {status, data} = await getAdvertById(session?.accessToken, params.advertId);

    return (
        <Suspense fallback={<Spinner/>}
                  key={status}>
            <AdvertDescription advert={data}
                               userToken={session?.accessToken}/>
        </Suspense>
    );

}