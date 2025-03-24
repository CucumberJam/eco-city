"use client"
import TableCompanyName from "@/app/_ui/general/table/TableCompanyName";
import Status from "@/app/_ui/general/Status";
import Subtitle from "@/app/_ui/general/Subtitle";
import TableCompanyWastes from "@/app/_ui/general/table/TableCompanyWastes";
import TableCompanyDimension from "@/app/_ui/general/table/TableCompanyDimension";
import Link from "next/link";
import UserWasteList from "@/app/_ui/user/UserWasteList";
import {FaPhone, FaRegEnvelope} from "react-icons/fa6";
import {getWastes} from "@/app/_lib/helpers";
import {useMemo} from "react";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";

export default function ItemCard({item, clickHandler, mode  = 2 }){
    return (
        <div className="cursor-pointer text-gray-600
                        my-3 sm:my-4 md:my-6 lg:my-8
                        px-2 py-2
                        ml-2 sm:ml-0
                        w-[90%] sm:w-[85%] md:w-[80%] lg:w-[98%]
                        rounded shadow-lg shadow-gray-200
                        border-2 border-transparent
                        dark:shadow-gray-900
                        bg-white dark:bg-gray-800
                        hover:shadow-white
                        hover:border-accent-10
                        hover:scale-105
                        duration-300"
                        onClick={()=> clickHandler(item)}>
                <figure className='h-full flex flex-col justify-between'>
                    {item.status && <div className='w-full flex justify-end'>
                        <Status status={item.status}/>
                    </div>}
                    <TableCompanyName name={mode !== 2 ? item?.user?.name: item.name}
                        role={mode !== 2 ? item.user?.role : item.role}
                        height="h-[60px]" width="min-w-[60px]"
                        nameFontSize="text-[16px]" roleFontSize="text-[14px]"/>
                    <figcaption className="p-4 text-sm">
                        {mode === 2 ? <ShortInfo website={item.website}
                                                  address={item.address}/>
                        : (
                            <div className=" mb-4 font-bold leading-relaxed text-gray-800 dark:text-gray-300">
                                <Subtitle label="Количество: " subTitle={mode === 0 ? item.advert?.amount : item?.amount}/>
                                <TableCompanyDimension label="Ед.изм.:"
                                                       userDimensionId={mode === 0 ? item.advert.dimension : item.dimension}/>
                                <TableCompanyWastes userWasteId={mode === 0 ? item.advert.waste : item.waste}
                                                    col={false}
                                                    userWasteTypeId={mode === 0 ? item.advert.wasteType : item.wasteType}/>
                                <Subtitle label="Цена предложения (руб/шт): " subTitle={item.price}/>
                                <Subtitle label="Стоимость предложения (руб): " subTitle={item.totalPrice}/>
                            </div>
                        )}

                        {item.comment && <small className="leading-5 text-gray-500 dark:text-gray-400">
                            <Subtitle label="Комментарий автора: " subTitle={item.comment}/>
                        </small>}
                    </figcaption>
                    <div className=" py-[0.75rem] px-[1.25rem] text-center
                                    bg-gray-100 border-t-1 px border-[rgba(0, 0, 0, .125)]">
                        {mode !== 2 ? (
                            <small className="text-muted">
                                {mode === 0 ? 'Последнее обновление:' : 'Дата подачи заявок:'}
                                {new Date(mode === 0 ? item.updatedAt : item.finishDate).toLocaleDateString()}
                            </small>
                        ) : <AddInfo itemWastes={item.wastes}
                                     itemWasteTypes={item.wasteTypes}
                                     email={item.email}
                                     phone={item.phone}/>
                        }
                    </div>
                </figure>
        </div>
    );
}
function ShortInfo({name, website, address}){
    return (
        <div className="flex-col justify-between items-center">
            {name && <div className="text-red-10 text-lg font-bold">{name}</div>}
            <Link href={'https://'+ website} className="text-accent-10">{website}</Link>
            <div className="flex-col">
                <p className="text-red-10 font-bold">Адрес:</p>
                <p>{address.length > 63 ? address.substring(0, 60) + '...': address}</p>
            </div>
        </div>
    );
}

function AddInfo({itemWastes,  itemWasteTypes, phone, email}){
    const {wastes, wasteTypes} = useGlobalUIStore((state) => state);
    const shownWastes = useMemo(()=>{
        return getWastes(itemWastes, itemWasteTypes, wastes, wasteTypes);
    }, [wastes?.length, wasteTypes?.length]);

    const phoneNumber = `+${phone.substring(0,1)} (${phone.substring(1,4)}) ${phone.substring(4,7)} ${phone.substring(7,9)} ${phone.substring(9,11)}`

    return (
        <div className="h-[80%] flex flex-col justify-between self-start">
            <div className="flex flex-col self-start">
                <p className="text-red-10 font-bold text-left">Виды отходов:</p>
                <UserWasteList wastes={shownWastes}
                               style={{fontWeight: 'normal'}}/>
            </div>
            <div className="flex flex-col">
                <div className="flex items-center gap-1">
                    <FaRegEnvelope color="red" size={18}/>
                    <p>{email}</p>
                </div>
                <div className="flex items-center gap-1">
                    <FaPhone color="red" size={18}/>
                    <p className="text-nowrap">{phoneNumber}</p>
                </div>
            </div>

        </div>
    );
}