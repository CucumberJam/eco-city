"use client";
import {initialPagination} from "@/app/_store/constants";
import {useEffect, useState} from "react";
import {preparePagination} from "@/app/_lib/helpers";

/*
* additionalArgs = {
*   id: required,
*   token: required,
*   cityId: required,
*   userAdvertsIds: null
* }
* */
/*
* function addFuncSet(apiResult){
*   return (!additionalArgs.userAdvertsIds && apiResult.advertsIds) ? {...additionalArgs, userAdvertsIds: apiResult.advertsIds} : null;
* */
export default function usePaginatedItems({
        apiItems = null,
        fetchFunc = async ()=>{},
        additionalArgs = null,
        addFuncSet = null
    }){
    const [pagination, setPagination] = useState({...initialPagination});
    const [items, setItems] = useState(null); //{count, rows}
    const [additional, setAdditional] = useState(null);
    function clearPaginatedItems(){
        setPagination({...initialPagination});
        setItems(null);
        setAdditional(null);
    }

    useEffect(() => {
        if(additionalArgs) {
            setAdditional(additionalArgs);
        }
        if(apiItems) setItems(prev => apiItems);
    }, []);

    async function fetchAndSetItems(    offset = initialPagination.offset,
                                        limit = initialPagination.limit,
                                        currentPage = initialPagination.currentPage,
                                        addArgs = null){
        if(addArgs) setAdditional(addArgs);
        const res = await fetchFunc(offset, limit, addArgs ? addArgs : additional);
        if(res.success === true){
            setItems(prev => res.data);

            // updateLocalVariables according to API response:
            if(addFuncSet){
                const updatedAdditionalArgs = addFuncSet?.(res);
                if(updatedAdditionalArgs) setAdditional(prev => updatedAdditionalArgs);
            }

            // updatePagination:
            const totalPages = Math.ceil((res.data?.count || res.data?.rows?.length || 1) / limit);
            setPagination((prev) => ({
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
    async function changePagination(    pageNumber,
                                        offset = initialPagination.offset,
                                        limit = initialPagination.limit){

        const {updatedOffset,
            updatedLimit,
            updatedPage} = preparePagination(pagination, {newPage: pageNumber, newOffset: offset, newLimit: +limit});

        return await fetchAndSetItems(updatedOffset, updatedLimit, updatedPage);
    }

    return {
        items,
        fetchAndSetItems,
        pagination,
        changePagination,
        clearPaginatedItems,
        setAdditional
    }
}