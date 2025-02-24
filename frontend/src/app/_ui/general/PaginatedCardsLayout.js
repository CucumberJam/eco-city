"use client"
import ItemCard from "@/app/_ui/account/ItemCard";
import CardLayout from "@/app/_ui/general/CardLayout";
import NoDataBanner from "@/app/_ui/general/NoDataBanner";
import ServerPagination from "@/app/_ui/general/ServerPagination";
import {paginationOptions} from "@/app/_store/constants";
import {usePublicMap} from "@/app/_context/PublicMapProvider";
import {useModal} from "@/app/_context/ModalContext";

export default function PaginatedCardsLayout(){
    const {open} = useModal();
    const {paginatedItems, pagination, changePagination, setCurrentUser} = usePublicMap();
    function showModalWithActiveItem(el){
        open(el.id);
        setCurrentUser(el);
    }
    return (
        <>
            {paginatedItems?.rows?.length > 0 ? (
                <>
                    <CardLayout>
                        {paginatedItems.rows.map(el => (
                            <ItemCard key={el.id}
                                      item={el}
                                      mode={2}
                                      clickHandler={showModalWithActiveItem}/>
                        ))}
                    </CardLayout>
                    <ServerPagination pagination={pagination}
                                      options={paginationOptions}
                                      changePagePagination={changePagination}/>
                </>
            ): <NoDataBanner title='Нет данных'/>}

        </>
    );
}