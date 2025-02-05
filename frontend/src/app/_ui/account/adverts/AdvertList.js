"use client";
import UserRoleCircle from "@/app/_ui/general/userRoleCircle";
import {Banner, Table} from "flowbite-react";
import {advertTableHeaders, paginationOptions} from "@/app/_store/constants";
import {prepareName} from "@/app/_lib/helpers";
import {MdAnnouncement} from "react-icons/md";
import ServerPagination from "@/app/_ui/general/ServerPagination";
export default function AdvertList({
                                       adverts, title = "Свои публикации:",
                                       roles, wastes, wasteTypes, dimensions,
                                       showTitle = true,
                                       pagination = {}, changePagePagination  = null
                                    }){

    if(!adverts?.rows?.length) return <NoData title={title}/>
    const pickUpAdvertHandler = (event, advert) => console.log(advert);

    return (
        <div className='w-full flex flex-col mt-2 my-2 h-full'>
            {showTitle && <AdvertTitle title={title}/>}
                <div className="overflow-x-auto">
                    <Table hoverable>
                        <Table.Head>
                            {advertTableHeaders.map((headCell, index) => (
                                <Table.HeadCell key={index} className="text-center">
                                    {headCell}
                                </Table.HeadCell>
                            ))}
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {adverts?.rows?.map(el => (
                                <Table.Row key={el.id}
                                            className="cursor-pointer bg-white dark:border-gray-700 dark:bg-gray-800"
                                            onClick={(event)=> pickUpAdvertHandler(event, el)}>
                                    <Table.Cell className="font-medium text-gray-900 dark:text-white">
                                        <AdvertCompanyName name={el?.userName}
                                                           role={el?.userRole}
                                                           roles={roles}/>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <AdvertCompanyWastes userWasteId={el?.waste}
                                                             userWasteTypeId={el?.wasteType}
                                                             wastesAPI={wastes}
                                                             wasteTypesAPI={wasteTypes}/>
                                    </Table.Cell>
                                    <Table.Cell className="text-center">{el?.amount}</Table.Cell>
                                    <Table.Cell>
                                        <AdvertCompanyDimension userDimensionId={el?.dimension}
                                                                dimensions={dimensions}/>
                                    </Table.Cell>
                                    <Table.Cell className="text-center">{new Date(el.finishDate).toLocaleDateString()}</Table.Cell>
                                    <Table.Cell className="text-center">{el?.totalPrice}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                    <ServerPagination pagination={pagination}
                                      options={paginationOptions}
                                      changePagePagination={changePagePagination}/>
                </div>
        </div>
    );
}
function NoData({title}){
    return (
    <Banner>
        <div className="flex w-full justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
            <div className="mx-auto flex items-center">
                <div className="flex flex-col items-center space-y-2
                text-sm font-normal text-gray-500
                dark:text-gray-400">
                        <p className="font-bold">{title}</p>
                        <div className='flex items-center space-x-2'>
                            <MdAnnouncement className="mr-4 h-4 w-4" />
                            <span className="[&_p]:inline">Нет данных ...&nbsp;</span>
                        </div>
                </div>
            </div>
        </div>
    </Banner>
    );
}
function AdvertTitle({title}){
    return (
        <h5 className="text-center text-2xl font-bold text-gray-700 dark:text-white mb-2">{title}</h5>
    );
}
function AdvertCompanyName({role, name, roles}){
    const roleName = prepareName(roles.find(el => el.name === role).label)
    return (
        <div className='flex items-center space-x-2'>
            <UserRoleCircle role={role} width="w-[40px]" height="h-[40px]"/>
            <div>
                <h4 className="text-center text-[12px] font-bold">{name}</h4>
                <p className="text-center text-[11px] italic">{roleName}</p>
            </div>
        </div>
    );
}
function AdvertCompanyWastes({userWasteId, userWasteTypeId, wastesAPI, wasteTypesAPI}){
    const wasteName = prepareName(wastesAPI?.find(el => +el.id === +userWasteId)?.name || '');
    const wasteTypeName = prepareName(wasteTypesAPI.find(el => +el.id === +userWasteTypeId)?.name || '');
    return (
        <div className='flex flex-col items-center space-y-2'>
            <p>{wasteName}</p>
            {userWasteTypeId && <p>{wasteTypeName}</p>}
        </div>
    );
}
function AdvertCompanyDimension({dimensions, userDimensionId}){
    const userDimensionLabel = dimensions.find(el => +el.id === +userDimensionId).shortName;
    return (
        <div className="text-center">{userDimensionLabel}</div>
    );
}