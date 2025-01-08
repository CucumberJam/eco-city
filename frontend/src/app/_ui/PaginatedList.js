"use client";
import {useMemo, useState} from "react";
import { Pagination } from "flowbite-react";

export default function PaginatedList(ItemComponent,
                                      list,
                                      bc = '#fff',
                                      maxItemsOnPage = 9){
    return function (props) {

        const totalCount = list.length;
        const [currentPage, setCurrentPage] = useState(1);
        const onPageChange = (page) => setCurrentPage(page);

        const paginatedList = useMemo(() => {
            const firstElemIndex = (currentPage - 1) * maxItemsOnPage;
            let lastElemIndex = firstElemIndex + maxItemsOnPage;
            if (lastElemIndex > totalCount) lastElemIndex = totalCount;
            return list.slice(firstElemIndex, lastElemIndex);
        }, [currentPage]);

        return (
            <div className="mt-[38px] pt-[50px] pb-[50px]
                            w-full flex flex-col items-center gap-3"
                            style={{backgroundColor: bc}}>
                <div className="mx-auto w-[95%]
                flex items-center justify-start
                gap-6 h-fit flex-wrap">
                    {paginatedList.map(item => (
                        <ItemComponent key={item.id}
                                       item={item}
                                       {...props}/>
                    ))}
                </div>
                <div className="flex overflow-x-auto sm:justify-center">
                    <Pagination currentPage={currentPage}
                                totalPages={totalCount}
                                onPageChange={onPageChange}
                                showIcons
                                previousLabel=""
                                nextLabel=""
                                layout="pagination"/>
                </div>
            </div>
        );
    }
}

