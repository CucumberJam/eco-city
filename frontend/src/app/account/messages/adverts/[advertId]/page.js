import {auth} from "@/auth";
import {Suspense} from "react";
import {Spinner} from "flowbite-react";
import AdvertDescription from "@/app/_ui/account/adverts/AdvertDescription";
import {getAdvertById, getResponsesByAdvertId} from "@/app/_lib/actions";

export const metadata = {
    title: 'Публикация'
}
export default async function Page(props){
    const params = await props.params;
    const session = await auth();
    const {status: statusAdvert, data: advert} = await getAdvertById(session?.accessToken, params.advertId);
    const {status: statusResponses, data: responsesOfAdvert} = await getResponsesByAdvertId(0, 10, {advertId: advert?.id, token: session?.accessToken});

    return (
        <Suspense fallback={<Spinner/>}
                  key={statusAdvert}>
            <AdvertDescription advert={advert}
                               responses={responsesOfAdvert}
                               userToken={session?.accessToken}/>
        </Suspense>
    );

}