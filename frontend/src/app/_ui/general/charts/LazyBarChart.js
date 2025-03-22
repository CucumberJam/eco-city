import dynamic from 'next/dynamic'
import {useMemo} from "react";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";

const DynamicBarChart = dynamic(() => import('./BarChartCustom'), {
    loading: () => <p>Loading...</p>,
})

export default function LazyBarChart({data}) {
    const {wastes, wasteTypes} = useGlobalUIStore(state => state);
    const preparedData = useMemo(()=>{
        if(!data?.length) return [];
        return data.map(el => {
            let waste = wastes.find(waste => +waste.id === el.advert.waste);
            let name = waste.name;
            if(el.advert.wasteType){
                const wasteType = wasteTypes.find(wasteType => +wasteType.id === el.advert.wasteType);
                name += ', ' + wasteType.name;
            }
            return {
                name: name,
                'заявка': el.advert.price,
                'отклик': el.price,
            }
        })
    }, []);
    if(!preparedData.length) return null;
    return <DynamicBarChart data={preparedData}/>
}