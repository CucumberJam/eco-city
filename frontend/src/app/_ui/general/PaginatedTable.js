import {Table} from "flowbite-react";
import {advertTableHeaders, paginationOptions} from "@/app/_store/constants";
import ServerPagination from "@/app/_ui/general/ServerPagination";

export default function PaginatedTable({
                                           headerTitles = advertTableHeaders,
                                           pagination = null,
                                           options = paginationOptions,
                                           changePagePagination = null,
                                           children
}){

    return (
        <div className="overflow-x-auto">
            <Table hoverable>
                <Table.Head>
                    {headerTitles.map((headCell, index) => (
                        <Table.HeadCell key={index} className="text-center">
                            {headCell}
                        </Table.HeadCell>
                    ))}
                </Table.Head>
                <Table.Body className="divide-y">
                    {children}
                </Table.Body>
            </Table>
            {pagination && <ServerPagination pagination={pagination}
                               options={options}
                               changePagePagination={changePagePagination}/>}
        </div>
    );
}