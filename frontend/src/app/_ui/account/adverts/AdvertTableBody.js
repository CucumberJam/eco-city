import {Table} from "flowbite-react";
import TableCompanyName from "@/app/_ui/general/table/TableCompanyName";
import TableCompanyWastes from "@/app/_ui/general/table/TableCompanyWastes";
import TableCompanyDimension from "@/app/_ui/general/table/TableCompanyDimension";
import Status from "@/app/_ui/general/Status";
import TableCompanyStatus from "@/app/_ui/general/table/TableCompanyStatus";

export default function AdvertTableBody({adverts, pickUpAdvertHandler}){
    return (
        <>
            {adverts?.rows?.map(el => (
                <Table.Row key={el.id}
                           className={`${Date.parse(el.finishDate) < new Date ? '' : ''} cursor-pointer bg-white dark:border-gray-700 dark:bg-gray-800`}
                           onClick={(event)=> pickUpAdvertHandler(el)}>
                    <Table.Cell className="font-medium text-gray-900 dark:text-white">
                        <TableCompanyName name={el?.user.name}
                                           role={el?.user.role}/>
                    </Table.Cell>
                    <Table.Cell>
                        <TableCompanyWastes userWasteId={el?.waste}
                                             userWasteTypeId={el?.wasteType}/>
                    </Table.Cell>
                    <Table.Cell className="text-center">{el?.amount}</Table.Cell>
                    <Table.Cell>
                        <TableCompanyDimension userDimensionId={el?.dimension}/>
                    </Table.Cell>
                    <Table.Cell className="text-center">
                        <Status status={new Date(el.finishDate).toLocaleDateString()}
                                date={el.finishDate}/>
                    </Table.Cell>
                    <Table.Cell className="text-center">{el?.totalPrice}</Table.Cell>
                    <Table.Cell className="text-center">
                        <TableCompanyStatus status={el?.status}/>
                    </Table.Cell>
                </Table.Row>
            ))}
        </>
    );
}