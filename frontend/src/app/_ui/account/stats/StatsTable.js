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
                        <TableRow key={0}
                                  id={0}
                                  title='На рассмотрении'
                                  el={responsesRecognitionPaginatedObject.items} />
                        <TableRow key={1}
                                  id={1}
                                  title='Принято'
                                  el={responsesAcceptPaginatedObject.items} />
                        <TableRow key={2}
                                  id={2}
                                  title='Исполнено'
                                  el={responsesPerformPaginatedObject.items} />
                        <TableRow key={3}
                                  id={3}
                                  title='Отклонено'
                                  el={responsesDeclinedPaginatedObject.items} />
                    </>
                ) : (
                    <>
                        <TableRow key={0}
                                  id={0}
                                  title='На рассмотрении'
                                  el={advertsRecognitionPaginatedObject.items} />
                        <TableRow key={1}
                                  id={1}
                                  title='Принято'
                                  el={advertsAcceptPaginatedObject.items} />
                        <TableRow  key={2}
                                   id={2}
                                  title='Исполнено'
                                  el={advertsPerformPaginatedObject.items} />
                    </>
                )}
            </PaginatedTable>
        </div>
    );
}

function TableRow({title = 'На рассмотрении', el, id = 0}){
    return (
        <Table.Row className="cursor-pointer bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="font-medium text-gray-900 dark:text-white text-center">
                <span className={`bg-[${statsData.colors[id]}] 
                py-1 px-1 rounded-xl text-white`}>
                    {title}
                </span>
            </Table.Cell>
            <Table.Cell className="text-center">{el?.count || 0}</Table.Cell>
            <Table.Cell className="text-center">{el?.late  || 0}</Table.Cell>
            <Table.Cell className="text-center">{el?.coming  || 0}</Table.Cell>
        </Table.Row>
    );
}