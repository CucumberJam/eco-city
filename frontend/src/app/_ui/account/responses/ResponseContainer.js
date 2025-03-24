"use client";
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import {useTab} from "@/app/_context/TabContext";
import {useResponses} from "@/app/_context/ResponsesProvider";
import {useModal} from "@/app/_context/ModalContext";
import Tabs from "@/app/_ui/account/AccountTabs";
import {showOthersResponses, showUserResponses} from "@/app/_store/constants";
import ResponseList from "@/app/_ui/account/responses/ResponseList";
import {ModalView} from "@/app/_ui/general/ModalView";
import ResponseDescription from "@/app/_ui/account/responses/ResponseDescription";

export default function ResponseContainer(){
    const router = useRouter();
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {router.push('/')},
    })
    const {currentCity} = useGlobalUIStore((state) => state);

    const {initResponsesContext,
        paginationResponsesUser, responsesUser,
        paginationResponses, responses,
        changePaginationPage, revalidateData} = useResponses();

    const {selectedInternTabOpt, selectInternTabOpt} = useTab(); // 'Свои' -> 0, 'участников' -> 1

    const {currentOpen, close, open} = useModal();
    const [activeResponse, setActiveResponse] = useState(null);
    const tabsRef = useRef(null);

    const userData = session?.user;
    const userRole = userData.role;

    useEffect(() => {
        if(!currentCity) return;

        initResponsesContext?.(userData, currentCity?.id)
            .then(res => {
                if(!res.success) throw new Error(res.message)
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
                <Tabs tabsRef={tabsRef}
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
                                     isUser={false}/>
            </ModalView>
        </>
    );
}