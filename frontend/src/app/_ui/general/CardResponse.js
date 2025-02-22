"use client"
import TableCompanyName from "@/app/_ui/general/table/TableCompanyName";
import Status from "@/app/_ui/general/Status";
import Subtitle from "@/app/_ui/general/Subtitle";
import TableCompanyWastes from "@/app/_ui/general/table/TableCompanyWastes";
import TableCompanyDimension from "@/app/_ui/general/table/TableCompanyDimension";

export default function CardResponse({item, clickHandler}){
    return (
        <div className="cursor-pointer text-gray-600
                        my-8 rounded shadow-lg shadow-gray-200
                        border-2 border-transparent
                        dark:shadow-gray-900
                        bg-white dark:bg-gray-800
                        hover:shadow-white
                        hover:border-accent-10
                        hover:scale-105
                        duration-300
                        px-2 py-2"
                        onClick={clickHandler}>
                <figure>
                    <div className='w-full flex justify-end'>
                        <Status status={item.status}/>
                    </div>
                    <TableCompanyName name={item.user.name}
                        role={item.user.role}
                        height="h-[60px]" width="w-[60px]"
                        nameFontSize="text-[16px]" roleFontSize="text-[14px]"/>
                    <figcaption className="p-4 text-sm">
                        <div className=" mb-4 font-bold leading-relaxed text-gray-800 dark:text-gray-300">
                            <Subtitle label="Количество: " subTitle={item.advert.amount}/>
                            <TableCompanyDimension label="Ед.изм.:" userDimensionId={item.advert.dimension}/>
                            <TableCompanyWastes userWasteId={item.advert.waste} col={false}
                                                userWasteTypeId={item.advert.wasteType}/>
                            <Subtitle label="Цена предложения (руб/шт): " subTitle={item.price}/>
                            <Subtitle label="Стоимость предложения (руб): " subTitle={item.totalPrice}/>
                        </div>

                        <small className="leading-5 text-gray-500 dark:text-gray-400">
                            <Subtitle label="Комментарий автора: " subTitle={item.comment}/>
                        </small>
                    </figcaption>
                    <div className="py-[0.75rem] px-[1.25rem] text-center
                                    bg-gray-100 border-t-1 px border-[rgba(0, 0, 0, .125)]">
                        <small className="text-muted">Последнее обновление: {new Date(item.updatedAt).toLocaleDateString()}</small>
                    </div>
                </figure>
        </div>
    );
}