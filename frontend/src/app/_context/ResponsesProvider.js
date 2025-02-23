'use client';
import {createContext, useContext, useRef, useState} from "react";
import {getOtherResponses, getResponsesOfUser} from "@/app/_lib/actions/responses";
import {preparePagination} from "@/app/_lib/helpers";
import {
    initialPagination,
    showOthersResponses,
    showUserResponses
} from "@/app/_store/constants";

const ResponsesContext = createContext();
function ResponsesProvider({children}) {
    const [responsesUser, setResponsesUser] = useState(null);
    const [responses, setResponses] = useState(null);
    const userData = useRef(null);

    const userAdvertsIds = useRef(null);

    const [paginationResponsesUser, setPaginationResponsesUser] = useState({...initialPagination});
    const [paginationResponses, setPaginationResponses] = useState({...initialPagination});
    function setUserData({data, cityId}){
        userData.current = {}
        userData.current.data = data;
        userData.current.cityId = +cityId;
    }
    async function fetchAndSetUserResponses(offset = initialPagination.offset,
                                          limit = initialPagination.limit,
                                          currentPage = initialPagination.currentPage){
        const res = await getResponsesOfUser(offset, limit);
        if(res?.success && res?.data){
            setResponsesUser(prev => res.data); //{count: 2, rows: []}
            // updatePagination:
            const totalPages = Math.ceil((res.data?.count || res.data?.rows?.length || 1) / limit);

            setPaginationResponsesUser((prev) => ({
                ...prev,
                offset: offset,
                limit: limit,
                totalPages: totalPages,
                currentPage: currentPage,
                count: res.data?.count,
            }));
            return {success: true};
        }else return {success: false, message: res.message};
    }
    async function fetchAndSetOthersResponses(offset = initialPagination.offset,
                                            limit = initialPagination.limit,
                                            currentPage = initialPagination.currentPage){
        const res = await getOtherResponses(offset, limit, userAdvertsIds.current);
        if(res.success){
            setResponses(prev => res.data);
            if(!userAdvertsIds?.current && res.advertsIds) userAdvertsIds.current = res.advertsIds;
            // updatePagination:
            const totalPages = Math.ceil((res.data?.count || res.data?.rows?.length || 1) / limit);
            setPaginationResponses((prev) => ({
                ...prev,
                offset: offset,
                limit: limit,
                totalPages: totalPages,
                currentPage: currentPage,
                count: res.data?.count,
            }));
            return {success: true};
        }else return {success: false, message: res.message};
    }
    async function initResponsesContext(userData, cityId){
        setUserData({data: userData, cityId: cityId});
        const result = {success: true, message: []}
        if(!responsesUser && showUserResponses(userData.role)) {
            const res = await fetchAndSetUserResponses();
            if(!res?.success) {
                result.success = false;
                result.message.push(res?.message || 'Ошибка получения данных об откликах!')
            }
        }
        if(!responses && showOthersResponses(userData.role)){
            const res = await fetchAndSetOthersResponses();
            if(!res?.success) {
                result.success = false;
                result.message.push(res?.message || 'Ошибка получения данных об откликах!')
            }
        }
        return result;
    }

    async function revalidateData(isUser = true){
        if(isUser){
            const res = await fetchAndSetUserResponses();
            if(!res?.success) {
                return {success: false, message: res?.message || 'Ошибка получения данных об откликах!'}
            }
        }else{
            const res = await fetchAndSetOthersResponses();
            if(!res?.success) {
                return {success: false, message: res?.message || 'Ошибка получения данных об откликах!'}
            }
        }
        return {success: true};
    }
    async function changePaginationPage(pageNumber,
                                        offset = initialPagination.offset,
                                        limit = initialPagination.limit,
                                        userAdverts = true){

        const {updatedOffset, updatedLimit, updatedPage} = preparePagination(
            userAdverts ? paginationResponsesUser : paginationResponses,
            {newPage: pageNumber, newOffset: offset, newLimit: +limit}
        );
        return (userAdverts) ?
            await fetchAndSetUserResponses(updatedOffset, updatedLimit, updatedPage) :
            await fetchAndSetOthersResponses(updatedOffset, updatedLimit, updatedPage);
    }
    return (
        <ResponsesContext.Provider value={{
            setUserData,
            initResponsesContext, revalidateData,
            paginationResponsesUser, responsesUser, setResponsesUser, fetchAndSetUserResponses,
            paginationResponses, responses, setResponses, fetchAndSetOthersResponses,
            changePaginationPage
        }}>
            {children}
        </ResponsesContext.Provider>
    );
}
function useResponses(){
    const context = useContext(ResponsesContext);
    if(context === undefined) throw new Error('Adverts context was used outside provider');
    return context;
}
export {ResponsesProvider, useResponses};