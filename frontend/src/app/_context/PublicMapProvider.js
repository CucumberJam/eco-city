'use client';
import {createContext, useContext, useEffect} from "react";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import {Spinner} from "flowbite-react";
import usePaginatedItems from "@/app/_hooks/usePaginatedItems";
import {getUsersByParams} from "@/app/_lib/actions/users";
import {initialPagination} from "@/app/_store/constants";

const PublicMapContext = createContext();
function PublicMapProvider({children}) {

    const {
        currentCity,
        users, setUsers,
        currentUser, setCurrentUser,
        wastes, currentWaste,
        wasteTypes, currentWasteType,
        roles, currentRole,
        query
    } = useGlobalUIStore((state) => state);

    const {
        items: paginatedItems,
        fetchAndSetItems, setAdditional,
        pagination, changePagination} = usePaginatedItems({
        fetchFunc: getUsersByParams,
        apiItems: users,
        additionalArgs: getArgs()
    });

    useEffect(() => {
        const args = getArgs();
        if(!args.cityId) return;
        setAdditional(prev => args);

        fetchAndSetItems(initialPagination.offset, initialPagination.limit, initialPagination.currentPage,  args)
            .then(res => {
                const {success, data} = res;
                if(success) setUsers(data);
            }).catch(res => console.log(res));

    }, [currentCity?.id, currentWaste?.id, currentWasteType?.id, currentRole?.id, query]);
    function getArgs(){
        let wasteTypesParams;
        if(currentWasteType) wasteTypesParams = [currentWasteType.id];
        else {
            if(!currentWaste) wasteTypesParams = wasteTypes.map(el => el.id) || null;
            else wasteTypesParams = wasteTypes.filter(el => el.typeId === currentWaste.id).map(el => el.id) || null;
        }
        return {
            cityId: currentCity?.id,
            wastes: currentWaste ? [currentWaste.id] : wastes.map(el => el.id) || null,
            wasteTypes: wasteTypesParams,
            roles: currentRole ? [currentRole.name] : roles.map(el => el.name) || null,
            query: query,
        }
    }

    return (
        <PublicMapContext.Provider value={{
            paginatedItems, pagination, changePagination,
            query, setCurrentUser, currentUser}}>
            <div className="w-full h-auto">
                {currentCity && children}
                {!currentCity &&  <Spinner size={"md"} className="py-3 w-full h-[100px] flex justify-items-center"/>}
            </div>
        </PublicMapContext.Provider>
    );
}

function usePublicMap(){
    const context = useContext(PublicMapContext);
    if(context === undefined) throw new Error('PublicMap context was used outside provider');
    return context;
}

export {PublicMapProvider, usePublicMap};