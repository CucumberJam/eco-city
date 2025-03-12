"use client";
import {paginationOptions, responseTableHeaders} from "@/app/_store/constants";
import PaginatedTable from "@/app/_ui/general/PaginatedTable";
import AdvertTitle from "@/app/_ui/account/adverts/AdvertTitle";
import NoDataBanner from "@/app/_ui/general/NoDataBanner";
import ResponseTableBody from "@/app/_ui/account/responses/ResponseTableBody";
import LazyBarChart from "@/app/_ui/general/charts/LazyBarChart";

export default function ResponseList({
                                       responses, title = "Мои отклики:",
                                       showTitle = true,
                                       pagination = {},
                                       changePagePagination  = null,
                                       pickUpAdvertHandler,
                                       isUser = false,
                                       withStats = false,
                                    }){
    if(!responses?.rows?.length) return <NoDataBanner title={title}/>

    return (
        <div className='w-full flex flex-col mt-2 my-2 h-full space-y-3'>
            {showTitle && <AdvertTitle title={title}/>}
            {withStats && <LazyBarChart data={responses?.rows}/>}
            <PaginatedTable headerTitles={responseTableHeaders}
                            pagination={pagination}
                            options={paginationOptions}
                            changePagePagination={changePagePagination}>
                <ResponseTableBody responses={responses} isUser={title.startsWith('Мои') || isUser}
                                   pickUpAdvertHandler={pickUpAdvertHandler}/>
            </PaginatedTable>
        </div>
    );
}
