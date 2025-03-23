import {AdvertsProvider} from "@/app/_context/AdvertsProvider";
import AdvertsContainer from "@/app/_ui/account/adverts/AdvertsContainer";

export const metadata = {
    title: 'Публикации на сбыт'
}
export default function Page(){
    return (
        <div className="w-full h-fit overflow-auto">
            <AdvertsProvider>
                <AdvertsContainer/>
            </AdvertsProvider>
        </div>
    );
}