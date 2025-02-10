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

export default function ResponseContainer({userData, userId, userToken}){
    const {currentCity} = useGlobalUIStore((state) => state);

    const {initResponsesContext,
        paginationResponsesUser, responsesUser, fetchAndSetUserResponses,
        paginationResponses, responses, fetchAndSetOthersResponses,
        changePaginationPage} = useResponses();

    const {selectedInternTabOpt, selectInternTabOpt, router} = useTab(); // 'Свои' -> 0, 'участников' -> 1

    const {currentOpen, close, open} = useModal();
    const [activeResponse, setActiveResponse] = useState(null);
    const tabsRef = useRef(null);

    const userRole = userData.role;

    useEffect(() => {
        if(!currentCity) return;

        initResponsesContext?.(userData, userToken, userId, currentCity?.id)
            .then(res => console.log(res))
            .catch(err => console.log(err));

    }, [currentCity?.id]);

    const pickUpResponseHandler = (response, isUser = false) => {
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
                       title="Сведения о заявке"
                       handleClose={()=> {
                           setActiveResponse?.(null);
                           close();
                       }}>
                <div>RESPONSE CONTENT</div>
            </ModalView>
        </>
    );
}