import {advertStatuses, statusColors} from "@/app/_store/constants";

export default function TableCompanyStatus({status}){
    const colorIndex = advertStatuses.findIndex(state => state === status);
    return (
        <div className='font-bold' style={{color: statusColors[colorIndex]}}>
            {status === 'Отклонено' ? 'Архив' : status}
        </div>
    );
}