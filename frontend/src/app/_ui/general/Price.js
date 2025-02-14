import {Badge} from "flowbite-react";
export default function Price({responseTotalPrice, advertTotalPrice, fontSize = 'text-sm'}){
    return (
        <Badge className={`w-fit my-0 mx-auto py-1 px-2 text-center ${fontSize}`}
               color={responseTotalPrice > advertTotalPrice ? 'success' :
                   (advertTotalPrice === responseTotalPrice ? 'indigo' : 'failure')}>
            {responseTotalPrice}
        </Badge>
    );
}