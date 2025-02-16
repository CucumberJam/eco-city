"use client"
import AdvertList from "@/app/_ui/account/adverts/AdvertList";
import {useAdverts} from "@/app/_context/AdvertsProvider";
import {useEffect, useRef, useState} from "react";
import {showOthersAdverts, showUserAdverts} from "@/app/_store/constants";
import {useTab} from "@/app/_context/TabContext";
import {ModalView} from "@/app/_ui/general/ModalView";
import {useModal} from "@/app/_context/ModalContext";
import AdvertInfo from "@/app/_ui/account/adverts/AdvertInfo";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import AccountTabs from "@/app/_ui/account/AccountTabs";

export default function AdvertsContainer({userData, userId, userToken}){
    const {currentCity} = useGlobalUIStore((state) => state);

    const {advertsUser, adverts, initAdvertsContext,
        paginationAdvertsUser, paginationAdverts, changePaginationPage} = useAdverts();

    const tabsRef = useRef(null);
    const {selectedInternTabOpt, selectInternTabOpt, router} = useTab(); // 'Свои' -> 0, 'участников' -> 1

    const {currentOpen, close, open} = useModal();
    const [activeAdvert, setActiveAdvert] = useState(null);

    const userRole = userData.role;

    useEffect(() => {
        if(!currentCity) return;
        initAdvertsContext?.(userData, userToken, userId, currentCity?.id);
    }, [currentCity?.id]);

    const pickUpAdvertHandler = (advert, isUser = false) => {
        if(isUser){
            router.push(`/account/messages/adverts/${advert.id}`);
        }else{
            open(advert.id);
            setActiveAdvert(prev => advert);
        }
    }

    return (
        <>
            {userRole === 'RECEIVER' && (
                <AccountTabs tabsRef={tabsRef}
                             defaultValue={selectedInternTabOpt}
                             setTabHandler={selectInternTabOpt}/>
            )}
            {(showOthersAdverts(userRole) && adverts && selectedInternTabOpt === 1) && (
                <AdvertList adverts={adverts}
                            showTitle={userRole !== 'RECEIVER'}
                            title="Публикации других участников:"
                            pagination={paginationAdverts}
                            changePagePagination={(page, limit, offset) =>
                                changePaginationPage(page, limit, offset, false)}
                            pickUpAdvertHandler={pickUpAdvertHandler}/>
            )}
            {(showUserAdverts(userRole) && advertsUser && selectedInternTabOpt === 0) && (
                <AdvertList adverts={advertsUser}
                            showTitle={userRole !== 'RECEIVER'}
                            pagination={paginationAdvertsUser}
                            changePagePagination={(page, limit, offset) =>
                              changePaginationPage(page, limit, offset, true)}
                            pickUpAdvertHandler={(avert)=>pickUpAdvertHandler(avert, true)}/>
            )}
            <ModalView isOpen={currentOpen === activeAdvert?.id}
                       title="Сведения о заявке"
                       handleClose={()=> {
                           setActiveAdvert?.(null);
                           close();
                       }}>
                <AdvertInfo advert={activeAdvert}
                            token={userToken}/>
            </ModalView>
        </>
    );
}