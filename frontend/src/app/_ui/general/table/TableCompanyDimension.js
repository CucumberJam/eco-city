import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";

export default function TableCompanyDimension({label, userDimensionId}){
    const {dimensions} = useGlobalUIStore((state) => state);
    const userDimensionLabel = dimensions?.find(el => +el.id === +userDimensionId)?.shortName || '';
    return (
        <div className="text-center flex items-center">
            {label && <p className={`font-bold `}>{label}</p>}
            {userDimensionLabel}</div>
    );
}