import {Table} from "flowbite-react";
import TableCompanyName from "@/app/_ui/general/table/TableCompanyName";
import TableCompanyWastes from "@/app/_ui/general/table/TableCompanyWastes";
import TableCompanyDimension from "@/app/_ui/general/table/TableCompanyDimension";

export default function AdvertTableBody({adverts, pickUpAdvertHandler}){
    return (
        <>
            {adverts?.rows?.map(el => (
                <Table.Row key={el.id}
                           className="cursor-pointer bg-white dark:border-gray-700 dark:bg-gray-800"
                           onClick={(event)=> pickUpAdvertHandler(el)}>
                    <Table.Cell className="font-medium text-gray-900 dark:text-white">
                        <TableCompanyName name={el?.userName}
                                           role={el?.userRole}/>
                    </Table.Cell>
                    <Table.Cell>
                        <TableCompanyWastes userWasteId={el?.waste}
                                             userWasteTypeId={el?.wasteType}/>
                    </Table.Cell>
                    <Table.Cell className="text-center">{el?.amount}</Table.Cell>
                    <Table.Cell>
                        <TableCompanyDimension userDimensionId={el?.dimension}/>
                    </Table.Cell>
                    <Table.Cell className="text-center">{new Date(el.finishDate).toLocaleDateString()}</Table.Cell>
                    <Table.Cell className="text-center">{el?.totalPrice}</Table.Cell>
                </Table.Row>
            ))}
        </>
    );
}