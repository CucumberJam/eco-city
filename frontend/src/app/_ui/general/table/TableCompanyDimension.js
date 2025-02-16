import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";

export default function TableCompanyDimension({userDimensionId}){
    const {dimensions} = useGlobalUIStore((state) => state);
    const userDimensionLabel = dimensions?.find(el => +el.id === +userDimensionId)?.shortName || '';
    return (
        <div className="text-center">{userDimensionLabel}</div>
    );
}