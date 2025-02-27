import {Badge, Table} from "flowbite-react";
import TableCompanyName from "@/app/_ui/general/table/TableCompanyName";
import TableCompanyWastes from "@/app/_ui/general/table/TableCompanyWastes";
import TableCompanyDimension from "@/app/_ui/general/table/TableCompanyDimension";
import TableCompanyStatus from "@/app/_ui/general/table/TableCompanyStatus";
import Status from "@/app/_ui/general/Status";

export default function ResponseTableBody({responses, pickUpAdvertHandler, isUser = true}){
    return (
        <>
            {responses?.rows?.map(el => (
                <Table.Row key={el.id}
                           className="cursor-pointer bg-white dark:border-gray-700 dark:bg-gray-800"
                           onClick={(event)=> pickUpAdvertHandler(el)}>
                    <Table.Cell className="font-medium text-gray-900 dark:text-white">
                        <TableCompanyName name={isUser ? (el?.advert ? el.advert.user?.name : 'Публикация') : el?.user.name}
                                           role={isUser ? (el?.advert? el.advert.user?.role : 'Роль') : el?.user.role}/>
                    </Table.Cell>
                    <Table.Cell>
                        {el?.advert ? <TableCompanyWastes userWasteId={el?.advert?.waste}
                                             userWasteTypeId={el?.advert?.wasteType}/> :
                            <p className='font-bold'> удалена</p>}
                    </Table.Cell>
                    <Table.Cell className="text-center">{el?.advert?.amount}</Table.Cell>
                    <Table.Cell>
                        <TableCompanyDimension userDimensionId={el?.advert?.dimension}/>
                    </Table.Cell>
                    <Table.Cell className="text-center">
                        {el?.advert ? (
                                <Status status={new Date(el.advert?.finishDate).toLocaleDateString()}
                                        date={el?.advert?.finishDate}/>
                        ) : ''}
                    </Table.Cell>
                    <Table.Cell className="text-center">{el?.advert?.totalPrice}</Table.Cell>
                    <Table.Cell className="text-center">
                        {el?.advert && <Badge className='w-fit my-0 mx-auto py-1 px-2 text-center'
                                color={el?.totalPrice > el?.advert?.totalPrice ? 'success' :
                                    (el?.advert?.totalPrice === el?.totalPrice ? 'indigo' : 'failure')}>
                            {el?.totalPrice}
                        </Badge>}
                    </Table.Cell>
                    <Table.Cell className="text-center">
                        <TableCompanyStatus status={el.advert ? el?.status : ''}/>
                    </Table.Cell>
                </Table.Row>
            ))}
        </>
    );
}