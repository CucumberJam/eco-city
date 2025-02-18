"use client";
import {useEffect, useRef, useState} from "react";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import {useTab} from "@/app/_context/TabContext";
import {useResponses} from "@/app/_context/ResponsesProvider";
import {useModal} from "@/app/_context/ModalContext";
import AccountTabs from "@/app/_ui/account/AccountTabs";
import {showOthersResponses, showUserResponses} from "@/app/_store/constants";
import ResponseList from "@/app/_ui/account/responses/ResponseList";
import {ModalView} from "@/app/_ui/general/ModalView";
import ResponseDescription from "@/app/_ui/account/responses/ResponseDescription";

export default function ResponseContainer({userData, userId, userToken}){
    const {currentCity} = useGlobalUIStore((state) => state);

    const {initResponsesContext,
        paginationResponsesUser, responsesUser,
        paginationResponses, responses,
        changePaginationPage, revalidateData} = useResponses();

    const {selectedInternTabOpt, selectInternTabOpt, router} = useTab(); // 'Свои' -> 0, 'участников' -> 1

    const {currentOpen, close, open} = useModal();
    const [activeResponse, setActiveResponse] = useState(null);
    const tabsRef = useRef(null);

    const userRole = userData.role;

    useEffect(() => {
        if(!currentCity) return;

        initResponsesContext?.(userData, userToken, userId, currentCity?.id)
            .then(res => {
                if(!res.success) console.log(res.message)
            })
            .catch(err => console.log(err.message));

    }, [currentCity?.id]);

    const pickUpResponseHandler = (response, isUser = false) => {
        if(!response.advert) return;
        if(isUser){ // need to go to its page
            router.push(`/account/messages/responses/${response.id}`);
        }else{ //show on modal
            open(response.id);
            setActiveResponse(prev => response);
        }
    }

    return (
        <>
            {userRole === 'RECEIVER' && (
                <AccountTabs tabsRef={tabsRef}
                             defaultValue={selectedInternTabOpt}
                             tabs={["Мои отклики", "Отклики других участников"]}
                             setTabHandler={selectInternTabOpt}/>
            )}
            {(showOthersResponses(userRole) && responses && selectedInternTabOpt === 1) && (
                <ResponseList  responses={responses}
                               showTitle={userRole !== 'RECEIVER'}
                               title="Отклики других участников:"
                               pagination={paginationResponses}
                               changePagePagination={(page, limit, offset) =>
                                   changePaginationPage(page, limit, offset, false)}
                               pickUpAdvertHandler={pickUpResponseHandler}/>
            )}
            {(showUserResponses(userRole) && responsesUser && selectedInternTabOpt === 0) && (
                <ResponseList  responses={responsesUser}
                               showTitle={userRole !== 'RECEIVER'}
                               pagination={paginationResponsesUser}
                               changePagePagination={(page, limit, offset) =>
                                   changePaginationPage(page, limit, offset, true)}
                               pickUpAdvertHandler={(avert)=>pickUpResponseHandler(avert, true)}/>
            )}
            <ModalView isOpen={currentOpen === activeResponse?.id}
                       title="Публикация на сбыт отходов"
                       handleClose={()=> {
                           setActiveResponse?.(null);
                           close();
                       }}>
                <ResponseDescription response={activeResponse}
                                     revalidateData={revalidateData}
                                     userToken={userToken}
                                     isUser={false}/>
            </ModalView>
        </>
    );
}