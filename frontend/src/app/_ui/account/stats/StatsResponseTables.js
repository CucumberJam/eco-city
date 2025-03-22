import {useStats} from "@/app/_context/StatsProvider";
import AdvertList from "@/app/_ui/account/adverts/AdvertList";
import {useRouter} from "next/navigation";
import {advertStatuses} from "@/app/_store/constants";
import Column from "@/app/_ui/general/Column";
import ResponseList from "@/app/_ui/account/responses/ResponseList";

export default function StatsResponseTables(){
    const router = useRouter();
    const {responsesRecognitionPaginatedObject,
        responsesAcceptPaginatedObject,
        responsesPerformPaginatedObject,
        responsesDeclinedPaginatedObject} = useStats();

    const pickUpResponseHandler = (response, isUser = false) => {
        if(!response.advert) return;
        router.push(`/account/messages/responses/${response.id}`);
    }

    return (
        <Column width='w-full '>
            <ResponseList key={0} isUser={true} withStats={true}
                          responses={responsesRecognitionPaginatedObject.items}
                          title={advertStatuses[0]}
                          pagination={responsesRecognitionPaginatedObject.pagination}
                          changePagePagination={responsesRecognitionPaginatedObject.changePagePagination}
                          pickUpAdvertHandler={pickUpResponseHandler}/>
            <ResponseList key={1} isUser={true} withStats={true}
                          responses={responsesAcceptPaginatedObject.items}
                          title={advertStatuses[2]}
                          pagination={responsesAcceptPaginatedObject.pagination}
                          changePagePagination={responsesAcceptPaginatedObject.changePagePagination}
                          pickUpAdvertHandler={pickUpResponseHandler}/>
            <ResponseList key={2} isUser={true} withStats={true}
                          responses={responsesPerformPaginatedObject.items}
                          title={advertStatuses[3]}
                          pagination={responsesPerformPaginatedObject.pagination}
                          changePagePagination={responsesPerformPaginatedObject.changePagePagination}
                          pickUpAdvertHandler={pickUpResponseHandler}/>
            <ResponseList key={3} isUser={true} withStats={true}
                          responses={responsesDeclinedPaginatedObject.items}
                          title={advertStatuses[1]}
                          pagination={responsesDeclinedPaginatedObject.pagination}
                          changePagePagination={responsesDeclinedPaginatedObject.changePagePagination}
                          pickUpAdvertHandler={pickUpResponseHandler}/>
        </Column>
    );
}