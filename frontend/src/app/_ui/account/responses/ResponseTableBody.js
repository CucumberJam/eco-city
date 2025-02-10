import {Badge, Table} from "flowbite-react";
import TableCompanyName from "@/app/_ui/general/table/TableCompanyName";
import TableCompanyWastes from "@/app/_ui/general/table/TableCompanyWastes";
import TableCompanyDimension from "@/app/_ui/general/table/TableCompanyDimension";
import TableCompanyStatus from "@/app/_ui/general/table/TableCompanyStatus";

export default function ResponseTableBody({responses, pickUpAdvertHandler, isUser = true}){
    return (
        <>
            {responses?.rows?.map(el => (
                <Table.Row key={el.id}
                           className="cursor-pointer bg-white dark:border-gray-700 dark:bg-gray-800"
                           onClick={(event)=> pickUpAdvertHandler(el)}>
                    <Table.Cell className="font-medium text-gray-900 dark:text-white">
                        <TableCompanyName name={isUser ? el?.advert?.userName : el?.userName}
                                           role={isUser ? el?.advert?.userRole : el?.userRole}/>
                    </Table.Cell>
                    <Table.Cell>
                        <TableCompanyWastes userWasteId={el?.advert?.waste}
                                             userWasteTypeId={el?.advert?.wasteType}/>
                    </Table.Cell>
                    <Table.Cell className="text-center">{el?.advert?.amount}</Table.Cell>
                    <Table.Cell>
                        <TableCompanyDimension userDimensionId={el?.advert?.dimension}/>
                    </Table.Cell>
                    <Table.Cell className="text-center">{new Date(el?.advert?.finishDate).toLocaleDateString()}</Table.Cell>
                    <Table.Cell className="text-center">{el?.advert?.totalPrice}</Table.Cell>
                    <Table.Cell className="text-center">
                        <Badge className='w-fit my-0 mx-auto py-1 px-2 text-center'
                               color={el?.totalPrice > el?.advert?.totalPrice ? 'success' :
                            (el?.advert?.totalPrice === el?.totalPrice ? 'indigo' : 'failure')}>
                            {el?.totalPrice}
                        </Badge>
                    </Table.Cell>
                    <Table.Cell className="text-center">
                        <TableCompanyStatus status={el?.status}/>
                    </Table.Cell>
                </Table.Row>
            ))}
        </>
    );
}