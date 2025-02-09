import {auth} from "@/auth";
import {AdvertsProvider} from "@/app/_context/AdvertsProvider";
import AdvertsContainer from "@/app/_ui/account/adverts/AdvertsContainer";

export const metadata = {
    title: 'Публикации на сбыт'
}
export default async function Page(){
    const session = await auth();
    return (
        <div className="w-full h-fit overflow-auto">
            <AdvertsProvider>
                <AdvertsContainer userData={session?.user}
                                  userToken={session?.accessToken}
                                  userId={session?.user.id}/>
            </AdvertsProvider>
        </div>
    );
}