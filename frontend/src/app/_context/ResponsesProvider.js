'use client';
import {createContext, useContext, useRef, useState} from "react";
import {getOtherResponses, getResponsesOfUser} from "@/app/_lib/actions";
import {preparePagination} from "@/app/_lib/helpers";
import {
    paginationOptions,
    showOthersResponses,
    showUserResponses
} from "@/app/_store/constants";

const ResponsesContext = createContext();
const initialPagination = {
    currentPage: 1,
    count: 0,
    limit: paginationOptions[1],
    offset: 0,
    totalPages: 1
};
function ResponsesProvider({children}) {
    const [responsesUser, setResponsesUser] = useState(null);
    const [responses, setResponses] = useState(null);
    const userData = useRef(null);

    const userAdvertsIds = useRef(null);

    const [paginationResponsesUser, setPaginationResponsesUser] = useState({...initialPagination});
    const [paginationResponses, setPaginationResponses] = useState({...initialPagination});
    function setUserData({data, token, id, cityId}){
        userData.current = {}
        userData.current.data = data;
        userData.current.id = +id;
        userData.current.token = token;
        userData.current.cityId = +cityId;
    }
    async function fetchAndSetUserResponses(offset = initialPagination.offset,
                                          limit = initialPagination.limit,
                                          currentPage = initialPagination.currentPage){
        const res = await getResponsesOfUser(userData.current.id, userData.current.token, offset, limit);
        console.log(res)
        if(res?.status === 'success' && res?.data){
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
        const res = await getOtherResponses(userData.current.token, offset, limit, userAdvertsIds.current);
        console.log(res);
        if(res.status === 'success'){
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
    async function initResponsesContext(userData, userToken, userId, cityId){
        setUserData({data: userData, token: userToken, id: userId, cityId: cityId});
        const result = {success: true, message: []}
        if(!responsesUser && showUserResponses(userData.role)) {
            const res = fetchAndSetUserResponses();
            if(!res?.success) {
                result.success = false;
                result.message.push(res?.message || 'Ошибка получения данных об откликах!')
            }
        }
        if(!responses && showOthersResponses(userData.role)){
            const res = fetchAndSetOthersResponses();
            if(!res?.success) {
                result.success = false;
                result.message.push(res?.message || 'Ошибка получения данных об откликах!')
            }
        }
        return result;
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
            initResponsesContext,
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