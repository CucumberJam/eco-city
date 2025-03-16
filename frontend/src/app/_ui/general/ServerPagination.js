import {Pagination, Select} from "flowbite-react";
import {paginationOptions} from "@/app/_store/constants";

export default function ServerPagination({
                                             pagination = {
                                                 currentPage: 1,
                                                 offset: 0,
                                                 limit: paginationOptions[1]
                                             } || null,
                                             changePagePagination = ()=> null,
                                             options = paginationOptions}){

    return (
        <div className="max-w-[600px] sm:max-w-[750px] md:max-w-[90%] lg:max-w-[98%]
        flex items-center justify-center space-x-2 mt-3">
            <Pagination showIcons
                        nextLabel="Вперёд"
                        previousLabel="Назад"
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={(value)=> changePagePagination?.(
                            value,
                            pagination.offset,
                            pagination.limit,
                        )} />
            <Select id="limit" sizing="sm"
                    className="mt-2"
                    value={pagination.limit}
                    onChange={(event)=> changePagePagination?.(
                        pagination.currentPage,
                        pagination.offset,
                        event.target.value
                    )}>
                {options.map((el, index) => (
                    <option key={index}>
                        {el}
                    </option>
                ))}
            </Select>
        </div>
    );
}