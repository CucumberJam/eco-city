"use client";
import {paginationOptions, responseTableHeaders} from "@/app/_store/constants";
import PaginatedTable from "@/app/_ui/general/PaginatedTable";
import AdvertTitle from "@/app/_ui/account/adverts/AdvertTitle";
import NoDataBanner from "@/app/_ui/general/NoDataBanner";
import ResponseTableBody from "@/app/_ui/account/responses/ResponseTableBody";

export default function ResponseList({
                                       responses, title = "Мои отклики:",
                                       showTitle = true,
                                       pagination = {},
                                       changePagePagination  = null,
                                       pickUpAdvertHandler
                                    }){
    if(!responses?.rows?.length) return <NoDataBanner title={title}/>

    return (
        <div className='w-full flex flex-col mt-2 my-2 h-full'>
            {showTitle && <AdvertTitle title={title}/>}
            <PaginatedTable headerTitles={responseTableHeaders}
                            pagination={pagination}
                            options={paginationOptions}
                            changePagePagination={changePagePagination}>
                <ResponseTableBody responses={responses}
                                   pickUpAdvertHandler={pickUpAdvertHandler}/>
            </PaginatedTable>
        </div>
    );
}
