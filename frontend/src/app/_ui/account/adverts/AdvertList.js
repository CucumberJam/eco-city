"use client";
import {paginationOptions} from "@/app/_store/constants";
import PaginatedTable from "@/app/_ui/general/PaginatedTable";
import AdvertTableBody from "@/app/_ui/account/adverts/AdvertTableBody";
import AdvertTitle from "@/app/_ui/account/adverts/AdvertTitle";
import NoDataBanner from "@/app/_ui/general/NoDataBanner";

export default function AdvertList({
                                       adverts, title = "Мои публикации:",
                                       showTitle = true,
                                       pagination = {}, changePagePagination  = null,
                                       pickUpAdvertHandler
                                    }){
    if(!adverts?.rows?.length) return <NoDataBanner title={title}/>

    return (
        <div className='w-full flex flex-col mt-2 my-2 h-full'>
            {showTitle && <AdvertTitle title={title}/>}
            <PaginatedTable pagination={pagination}
                            options={paginationOptions}
                            changePagePagination={changePagePagination}>
                <AdvertTableBody adverts={adverts}
                                 pickUpAdvertHandler={pickUpAdvertHandler}/>
            </PaginatedTable>
        </div>
    );
}
