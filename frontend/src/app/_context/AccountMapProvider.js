'use client';
import {createContext, useContext, useEffect, useRef, useState} from "react";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import {Spinner} from "flowbite-react";
import usePaginatedItems from "@/app/_hooks/usePaginatedItems";
import {fetchMapUsers} from "@/app/_lib/actions/account-map";
import {initialPagination} from "@/app/_store/constants";

const AccountMapContext = createContext();
function AccountMapProvider({children}) {
    const { currentCity, wastes, wasteTypes, roles } = useGlobalUIStore((state) => state);
    const userDataInitialized = useRef(null);

    const [mode, setActiveMode] = useState(0);
    const [isFetching, setIsFetching] = useState(false);

    let userRole = useRef(null);;
    const userWastes = useRef(null);
    const [currentWaste, setCurrentWaste] = useState(null);
    const userWasteTypes = useRef(null);
    const [currentWasteType, setCurrentWasteType] = useState(null);
    const filterRoles = useRef(null);
    const [currentRole, setCurrentRole] = useState(null);
    const [query, setQuery] = useState('');

    const [activeItem, setActiveItem] = useState(null);

    const {items: paginatedItems, fetchAndSetItems,
        setAdditional, pagination, changePagination} = usePaginatedItems({
        fetchFunc: fetchMapUsers,
        });

    useEffect(() => {
        // fetch new items if cityId changed
        if(!userDataInitialized.current) return;
        const args = getArgs();
        setAdditional(prev => args);
        fetchAndSetItems(initialPagination.offset, initialPagination.limit, 1,  args)
            .catch(res => console.log(res));

    }, [currentCity?.id, currentWaste?.id, currentWasteType?.id, currentRole?.id, query]);
    async function initUserData(userData){
        setIsFetching(prev => true);
        if(userData?.wastes && !userWastes.current && wastes.length > 0){
            userWastes.current = wastes.filter(el => userData?.wastes.includes(el.id));
        }
        if(userData?.wasteTypes && !wasteTypes.current && wasteTypes.length > 0){
            userWasteTypes.current = wasteTypes.filter(el => userData?.wasteTypes.includes(el.id));
        }
        if(userData.role) {
            userRole.current = userData.role;
            filterRoles.current = userData.role === 'RECEIVER' ? roles : roles.filter(el => el.name !== userData.role);
        }
        const args = getArgs();
        console.log(args)
        const res =  await fetchAndSetItems(initialPagination.offset, initialPagination.limit, 1, getArgs());
        setIsFetching(prev => false);
        userDataInitialized.current = true;
        return res;
    }
    function getArgs(){
        let wasteTypes;
        if(currentWasteType) wasteTypes = [currentWasteType.id];
        else {
            if(!currentWaste) wasteTypes = userWasteTypes.current.map(el => el.id) || null;
            else{
                wasteTypes = userWasteTypes.current?.filter(el => el.typeId === currentWaste.id).map(el => el.id)
            }
        }
        return {
            mode: mode,
            userRole: userRole.current,
            cityId: currentCity?.id,
            wastes: currentWaste ? [currentWaste.id] : userWastes.current?.map(el => el.id) || [],
            wasteTypes: wasteTypes,
            roles: currentRole ? [currentRole.id] : filterRoles.current || [],
            query: query,
        }
    }

    async function changeMode(value){
        const args = getArgs();
        args.mode = value;
        setAdditional(prev => args);
        const res = await fetchAndSetItems(initialPagination.offset, initialPagination.limit, 1,  args);
        setActiveMode(value);
    }
    return (
        <AccountMapContext.Provider value={{
            isFetching,
            mode, changeMode,
            initUserData,
            userWastes, currentWaste, setCurrentWaste,
            userWasteTypes, currentWasteType, setCurrentWasteType,
            filterRoles, currentRole, setCurrentRole,
            setQuery,
            currentCityId: currentCity?.id,
            currentCityLong: currentCity?.longitude,
            currentCityLat: currentCity?.latitude,
            paginatedItems,
            pagination, changePagination,
            activeItem, setActiveItem
        }}>
            <main>
                {currentCity && children}
                {!currentCity &&  <Spinner size={"md"} className="py-3 w-full h-[100px] flex justify-items-center"/>}
            </main>
        </AccountMapContext.Provider>
    );
}
function useAccountMap(){
    const context = useContext(AccountMapContext);
    if(context === undefined) throw new Error('AccountMap context was used outside provider');
    return context;
}

export {AccountMapProvider, useAccountMap};