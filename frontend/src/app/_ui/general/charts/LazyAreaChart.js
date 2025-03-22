import dynamic from 'next/dynamic'
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import {useMemo} from "react";

const DynamicAreaChart = dynamic(() => import('./AreaChartCustom'), {
    loading: () => <p>Loading...</p>,
})

export default function LazyAreaChart({data}) {
    const {wastes} = useGlobalUIStore(state => state);
    const preparedData = useMemo(()=>{
        if(!data?.length) return [];
        const wasteDictionary = {};
        for(const elem of data){
            let waste = wastes.find(waste => +waste.id === elem.waste);
            if(wasteDictionary.hasOwnProperty(waste.name)){
                wasteDictionary[waste.name] = wasteDictionary[waste.name] + elem.totalPrice;
            }else{
                wasteDictionary[waste.name] = + elem.totalPrice;
            }
        }
        const arr = [];
        for(const key in wasteDictionary){
            arr.push({
                name: key,
                'стоимость': wasteDictionary[key]
            })
        }
        return arr;
    }, []);

    if(!preparedData.length) return null;
    return <DynamicAreaChart data={preparedData}/>
}