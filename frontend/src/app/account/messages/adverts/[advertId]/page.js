import {auth} from "@/auth";
import {Suspense} from "react";
import {Spinner} from "flowbite-react";
import AdvertDescription from "@/app/_ui/account/adverts/AdvertDescription";
import {getAdvertById} from "@/app/_lib/actions";

export const metadata = {
    title: 'Публикация'
}
export default async function Page({params}){
    const { id } = await params
    const session = await auth();
    const {status, data} = await getAdvertById(session?.accessToken, id);

    return (
        <Suspense fallback={<Spinner/>}
                  key={status}>
            <AdvertDescription advert={data}
                               userToken={session?.accessToken}/>
        </Suspense>
    );

}