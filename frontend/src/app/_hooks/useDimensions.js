import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import {useEffect, useState} from "react";

export default function useDimensions(dimensionsAPI, currentDimensionId = null){
    const [formDimension, setFormDimension] = useState('');
    const {dimensions, setDimensions} = useGlobalUIStore((state) => state);

    useEffect(() => {
        if(dimensions.length === 0) {
            setDimensions(dimensionsAPI);
        }
        if(currentDimensionId){
            setFormDimension(currentDimensionId);
        }else setFormDimension(dimensionsAPI[0].id + '');
    }, [dimensions.length, dimensionsAPI?.length, setDimensions, currentDimensionId]);


    return {dimensions, formDimension, setFormDimension};
}