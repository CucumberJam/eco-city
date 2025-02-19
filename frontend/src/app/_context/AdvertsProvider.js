'use client';
import {createContext, useContext, useRef, useState} from "react";
import {getParamsToFetchAdverts, paginationOptions, showOthersAdverts, showUserAdverts} from "@/app/_store/constants";
import {getAdverts, getAdvertsOfUser} from "@/app/_lib/actions/adverts";
import {preparePagination} from "@/app/_lib/helpers";

const AdvertsContext = createContext();
const initialPagination = {
    currentPage: 1,
    count: 0,
    limit: paginationOptions[1],
    offset: 0,
    totalPages: 1
};
function AdvertsProvider({children}) {
    const [advertsUser, setAdvertsUser] = useState(null);
    const [adverts, setAdverts] = useState(null);
    const userData = useRef(null);

    const [paginationAdvertsUser, setPaginationAdvertsUser] = useState({...initialPagination});
    const [paginationAdverts, setPaginationAdverts] = useState({...initialPagination});
    function setUserData({data, token, id, cityId}){
        userData.current = {}
        userData.current.data = data;
        userData.current.id = +id;
        userData.current.token = token;
        userData.current.cityId = +cityId;
    }
    async function fetchAndSetUserAdverts(offset = initialPagination.offset,
                                          limit = initialPagination.limit,
                                          currentPage = initialPagination.currentPage){

        const res = await getAdvertsOfUser(offset, limit);
        if(res?.success && res?.data){
            setAdvertsUser(prev => res.data); //{count: 2, rows: []}
            // updatePagination:
            const totalPages = Math.ceil((res.data?.count || res.data?.rows?.length || 1) / limit);

            setPaginationAdvertsUser((prev) => ({
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
    async function fetchAndSetOthersAdverts(offset = initialPagination.offset,
                                            limit = initialPagination.limit,
                                            currentPage = initialPagination.currentPage){
        const params = getParamsToFetchAdverts(userData.current.data, userData.current.cityId, offset, limit);
        const res = await getAdverts(params);
        if(res?.success && res?.data){
            setAdverts(prev => res.data);
            // updatePagination:
            const totalPages = Math.ceil((res.data?.count || res.data?.rows?.length || 1) / limit);
            setPaginationAdverts((prev) => ({
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
    async function initAdvertsContext(userData, userToken, userId, cityId){
        setUserData({data: userData, token: userToken, id: userId, cityId: cityId});
        const result = {success: true, message: []}
        if(!advertsUser && showUserAdverts(userData.role)) {
            const res = fetchAndSetUserAdverts();
            if(!res?.success) {
                result.success = false;
                result.message.push(res?.message || 'Ошибка получения данных о публикациях!')
            }
        }
        if(!adverts && showOthersAdverts(userData.role)){
            const res = fetchAndSetOthersAdverts();
            if(!res?.success) {
                result.success = false;
                result.message.push(res?.message || 'Ошибка получения данных о публикациях!')
            }
        }
        return result;
    }

    async function changePaginationPage(pageNumber,
                                        offset = initialPagination.offset,
                                        limit = initialPagination.limit,
                                        userAdverts = true){
        //const upDatedOffset = (pageNumber - 1) * limit;
        /*
        *   return (userAdverts) ?
            await fetchAndSetUserAdverts(upDatedOffset, limit, pageNumber) :
            await fetchAndSetOthersAdverts(upDatedOffset, limit, pageNumber);*/

        const {updatedOffset, updatedLimit, updatedPage} = preparePagination(
            userAdverts ? paginationAdvertsUser : paginationAdverts,
            {newPage: pageNumber, newOffset: offset, newLimit: +limit}
        );
        return (userAdverts) ?
            await fetchAndSetUserAdverts(updatedOffset, updatedLimit, updatedPage) :
            await fetchAndSetOthersAdverts(updatedOffset, updatedLimit, updatedPage);
    }
    return (
        <AdvertsContext.Provider value={{
            advertsUser, setAdvertsUser, setUserData,
            adverts, setAdverts,
            fetchAndSetUserAdverts,
            fetchAndSetOthersAdverts,
            initAdvertsContext,
            paginationAdvertsUser,
            paginationAdverts,
            changePaginationPage
        }}>
            {children}
        </AdvertsContext.Provider>
    );
}
function useAdverts(){
    const context = useContext(AdvertsContext);
    if(context === undefined) throw new Error('Adverts context was used outside provider');
    return context;
}
export {AdvertsProvider, useAdverts};