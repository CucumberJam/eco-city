import PaginatedTable from "@/app/_ui/general/PaginatedTable";
import { statsData} from "@/app/_store/constants";
import Title from "@/app/_ui/general/Title";
import {useStats} from "@/app/_context/StatsProvider";
import {Table} from "flowbite-react";
export default function StatsTable(){
    const {
        mode,
        advertsRecognitionPaginatedObject,
        advertsAcceptPaginatedObject,
        advertsPerformPaginatedObject,
        responsesRecognitionPaginatedObject,
        responsesAcceptPaginatedObject,
        responsesPerformPaginatedObject,
        responsesDeclinedPaginatedObject,
    } = useStats();

    return (
        <div className='w-full flex flex-col mt-2 my-2 h-full'>
            <Title title='Общая статистика за отчетный период'/>
            <PaginatedTable headerTitles={statsData.tableHeaders}>
                {mode === 0 ? (
                    <>
                        <TableRow id='На рассмотрении' title='На рассмотрении'
                                  el={responsesRecognitionPaginatedObject.items} />
                        <TableRow id='Принято'
                                  title='Принято'
                                  el={responsesAcceptPaginatedObject.items} />
                        <TableRow id='Исполнено'
                                  title='Исполнено'
                                  el={responsesPerformPaginatedObject.items} />
                        <TableRow id='Отклонено'
                                  title='Отклонено'
                                  el={responsesDeclinedPaginatedObject.items} />
                    </>
                ) : (
                    <>
                        <TableRow id='На рассмотрении' title='На рассмотрении'
                                  el={advertsRecognitionPaginatedObject.items} />
                        <TableRow id='Принято'
                                  title='Принято'
                                  el={advertsAcceptPaginatedObject.items} />
                        <TableRow id='Исполнено'
                                  title='Исполнено'
                                  el={advertsPerformPaginatedObject.items} />
                    </>
                )}
            </PaginatedTable>
        </div>
    );
}

function TableRow({title = 'На рассмотрении', el}){
    return (
        <Table.Row className="cursor-pointer bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="font-medium text-gray-900 dark:text-white">
                {title}
            </Table.Cell>
            <Table.Cell>{el?.count || 0}</Table.Cell>
            <Table.Cell className="text-center">{el?.late  || 0}</Table.Cell>
            <Table.Cell>{el?.coming  || 0}</Table.Cell>
        </Table.Row>
    );
}