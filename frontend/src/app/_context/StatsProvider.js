'use client';
import {createContext, useContext, useEffect, useRef, useState} from "react";
import {Spinner} from "flowbite-react";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import {initialPagination, statsData} from "@/app/_store/constants";
import {getAdvertsOfUser} from "@/app/_lib/actions/adverts";
import {getResponsesOfUser} from "@/app/_lib/actions/responses";
import useStatsPaginatedItems from "@/app/_hooks/useStatsPaginatedItems";

const StatsContext = createContext();
function StatsMapProvider({children}) {
    const {currentCity} = useGlobalUIStore((state) => state);
    const [mode, setActiveMode] = useState(0);
    const [period, setPeriod] = useState(statsData.filters[0].options[0]); // 0 = month, 1 = quarter, 2 = half-year, 3 = year
    const [type, setType] = useState(statsData.filters[1].options[0]);  // 0 = all, 1 = late, 2 = coming
    const dataInitialized = useRef(null);
    const [isFetching, setIsFetching] = useState(false);
    const [activeItem, setActiveItem] = useState(null);

    // user paginated adverts:
    const {recognitionPaginatedObject: advertsRecognitionPaginatedObject,
        acceptPaginatedObject: advertsAcceptPaginatedObject,
        performPaginatedObject: advertsPerformPaginatedObject,
        declinedPaginatedObject: advertsDeclinedPaginatedObject,
    } = useStatsPaginatedItems(getArgs, getAdvertsOfUser);

    // user paginated responses:
    const {recognitionPaginatedObject: responsesRecognitionPaginatedObject,
        acceptPaginatedObject: responsesAcceptPaginatedObject,
        performPaginatedObject: responsesPerformPaginatedObject,
        declinedPaginatedObject: responsesDeclinedPaginatedObject
    } = useStatsPaginatedItems(getArgs, getResponsesOfUser);

    useEffect(() => {
        if(!dataInitialized.current) return;
        fetchAllUserItems().then(res => console.log(res)).catch(err => console.log(err));
    }, [mode, period]);
    async function init(userRole){
        setActiveMode(prev => statsData.roles[userRole][0]);
        const res = await fetchAllUserItems();
        dataInitialized.current = true;
        if(!res?.success) return res;
        return {success: true}
    }
    function getArgs(status = 'На рассмотрении' ||  'Принято' || 'Исполнено'){
        const obj = {
            status,
            period: period?.id,
            needStats: true
        }
        if(mode === 1) obj.cityId = currentCity?.id;
        return obj;
    }
    async function fetchAllUserItems(){
        setIsFetching(prev => true);
        let resRec,resAcc, resPer, resDec = {success: true};
        try{
            if(mode === 0){
                resRec = await responsesRecognitionPaginatedObject.fetchAndSetItems(initialPagination.offset, initialPagination.limit, 1, getArgs('На рассмотрении'));
                resAcc = await responsesAcceptPaginatedObject.fetchAndSetItems(initialPagination.offset, initialPagination.limit, 1, getArgs('Принято'));
                resPer = await responsesPerformPaginatedObject.fetchAndSetItems(initialPagination.offset, initialPagination.limit, 1, getArgs('Исполнено'));
                resDec = await responsesDeclinedPaginatedObject.fetchAndSetItems(initialPagination.offset, initialPagination.limit, 1, getArgs('Отклонено'));
            }else{
                resRec = await advertsRecognitionPaginatedObject.fetchAndSetItems(initialPagination.offset, initialPagination.limit, 1, getArgs('На рассмотрении'));
                resAcc = await advertsAcceptPaginatedObject.fetchAndSetItems(initialPagination.offset, initialPagination.limit, 1, getArgs('Принято'));
                resPer = await advertsPerformPaginatedObject.fetchAndSetItems(initialPagination.offset, initialPagination.limit, 1, getArgs('Исполнено'));
                resDec = await advertsDeclinedPaginatedObject.fetchAndSetItems(initialPagination.offset, initialPagination.limit, 1, getArgs('Отклонено'));
            }
            setIsFetching(prev => false);
            dataInitialized.current = true;
            if(!resRec?.success || !resAcc?.success || !resPer?.success || !resDec?.success){
                return (resRec?.message || resAcc?.message || resPer?.message || resDec?.message || 'Ошибка сети');
            }else return {success: true};
        }catch (e) {
            setIsFetching(prev => false);
            dataInitialized.current = true;
            return {success: false, message: e.message}
        }
    }

    return (
        <StatsContext.Provider value={{
            init,
            mode, setActiveMode,
            period, setPeriod,
            type, setType,
            activeItem, setActiveItem,
            isFetching,
            advertsRecognitionPaginatedObject,
            advertsAcceptPaginatedObject,
            advertsPerformPaginatedObject,
            advertsDeclinedPaginatedObject,
            responsesRecognitionPaginatedObject,
            responsesAcceptPaginatedObject,
            responsesPerformPaginatedObject,
            responsesDeclinedPaginatedObject,
        }}>
            <main>
                {currentCity && children}
                {!currentCity &&  <Spinner size={"md"} className="py-3 w-full h-[100px] flex justify-items-center"/>}
            </main>
        </StatsContext.Provider>
    );
}
function useStats(){
    const context = useContext(StatsContext);
    if(context === undefined) throw new Error('Stats context was used outside provider');
    return context;
}

export {StatsMapProvider, useStats};