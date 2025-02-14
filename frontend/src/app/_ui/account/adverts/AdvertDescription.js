"use client"
import NoDataBanner from "@/app/_ui/general/NoDataBanner";
import AdvertInfoLarge from "@/app/_ui/account/adverts/AdvertInfoLarge";

export default function AdvertDescription({advert, userToken}){
    if(!advert) return <NoDataBanner title={`Нет данных о публикации`}/>

    return (
        <AdvertInfoLarge advert={advert} isUser={true}/>
    );
}