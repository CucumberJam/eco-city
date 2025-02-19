import {auth} from "@/auth";
import {Suspense} from "react";
import {Spinner} from "flowbite-react";
import AdvertDescription from "@/app/_ui/account/adverts/AdvertDescription";
import {getResponsesByAdvertId} from "@/app/_lib/actions/responses";
import {getAdvertById} from "@/app/_lib/actions/adverts";
export const metadata = {
    title: 'Публикация'
}
export default async function Page(props){
    const params = await props.params;
    const session = await auth();
    const {status: statusAdvert, data: advert} = await getAdvertById(params.advertId);
    const {status: statusResponses, data: responsesOfAdvert} = await getResponsesByAdvertId(0, 10, {advertId: advert?.id});

    return (
        <Suspense fallback={<Spinner/>}
                  key={statusAdvert}>
            <AdvertDescription advert={advert}
                               responses={responsesOfAdvert}
                               userToken={session?.accessToken}/>
        </Suspense>
    );

}