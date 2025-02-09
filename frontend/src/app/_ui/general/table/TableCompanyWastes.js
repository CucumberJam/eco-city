import {prepareName} from "@/app/_lib/helpers";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";

export default function TableCompanyWastes({userWasteId, userWasteTypeId}){
    const {wastes, wasteTypes} = useGlobalUIStore((state) => state);

    const wasteName = prepareName(wastes?.find(el => +el.id === +userWasteId)?.name || '');
    const wasteTypeName = prepareName(wasteTypes.find(el => +el.id === +userWasteTypeId)?.name || '');

    return (
        <div className='flex flex-col items-center space-y-2'>
            <p>{wasteName}</p>
            {userWasteTypeId && <p>{wasteTypeName}</p>}
        </div>
    );
}