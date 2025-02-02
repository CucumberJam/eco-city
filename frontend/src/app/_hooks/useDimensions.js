import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import {useEffect, useState} from "react";

export default function useDimensions(dimensionsAPI){
    const [formDimension, setFormDimension] = useState('');
    const {dimensions, setDimensions} = useGlobalUIStore((state) => state);

    useEffect(() => {
        if(dimensions.length === 0) {
            setDimensions(dimensionsAPI);
            setFormDimension(dimensionsAPI[0].id + '');
        }
    }, []);
    return {dimensions, formDimension, setFormDimension};
}