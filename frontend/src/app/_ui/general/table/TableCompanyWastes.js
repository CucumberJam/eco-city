import {prepareName} from "@/app/_lib/helpers";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";

export default function TableCompanyWastes({userWasteId, userWasteTypeId, col = true}){
    const {wastes, wasteTypes} = useGlobalUIStore((state) => state);

    const wasteName = prepareName(wastes?.find(el => +el.id === +userWasteId)?.name || '');
    const wasteTypeName = prepareName(wasteTypes.find(el => +el.id === +userWasteTypeId)?.name || '');

    return (
        <div className={`flex items-center ${col ? 'flex-col space-y-2' : ' space-x-2'}`}>
            <p>{wasteName}</p>
            {userWasteTypeId && <p>{wasteTypeName}</p>}
        </div>
    );
}