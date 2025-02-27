import {useStats} from "@/app/_context/StatsProvider";
import AdvertList from "@/app/_ui/account/adverts/AdvertList";
import {useRouter} from "next/navigation";
import {advertStatuses} from "@/app/_store/constants";
import Column from "@/app/_ui/general/Column";

export default function StatsAdvertTables(){
    const router = useRouter()
    const {advertsRecognitionPaginatedObject,
        advertsAcceptPaginatedObject,
        advertsPerformPaginatedObject} = useStats();
    const pickUpAdvertHandler = (advert, isUser = false) => {
        router.push(`/account/messages/adverts/${advert.id}`);
    }
    return (
        <Column width='w-full '>
            <AdvertList key={0}
                        adverts={advertsRecognitionPaginatedObject.items}
                        title={advertStatuses[0]}
                        pagination={advertsRecognitionPaginatedObject.pagination}
                        changePagePagination={advertsRecognitionPaginatedObject.changePagePagination}
                        pickUpAdvertHandler={pickUpAdvertHandler}/>
            <AdvertList key={1}
                        adverts={advertsAcceptPaginatedObject.items}
                        title={advertStatuses[2]}
                        pagination={advertsAcceptPaginatedObject.pagination}
                        changePagePagination={advertsAcceptPaginatedObject.changePagePagination}
                        pickUpAdvertHandler={pickUpAdvertHandler}/>
            <AdvertList key={2}
                        adverts={advertsPerformPaginatedObject.items}
                        title={advertStatuses[3]}
                        pagination={advertsPerformPaginatedObject.pagination}
                        changePagePagination={advertsPerformPaginatedObject.changePagePagination}
                        pickUpAdvertHandler={pickUpAdvertHandler}/>
        </Column>
    );
}