import {advertStatuses, statusColorsFlowBite} from "@/app/_store/constants";
import {Badge} from "flowbite-react";

export default function Status({status, style = '', date = null}){
    const colorIndex = !date ? advertStatuses.findIndex(state => state === status) :
        (Date.parse(date) >= new Date()) ?  2 : 1;
    return (
        <Badge color={statusColorsFlowBite[colorIndex]}
               className={`flex justify-center text-center w-32 py-2 px-3 font-bold ${style}`}>
            {status === 'Отклонено' ? 'Архив' : status}
        </Badge>
    );
}