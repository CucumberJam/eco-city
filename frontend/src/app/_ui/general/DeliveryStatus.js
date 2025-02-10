import {Badge} from "flowbite-react";

export default function DeliveryStatus({isPickedUp, priceWithDelivery}){
    return (
        <Badge className="py-1 px-1 text-center"
               color={isPickedUp ? 'warning' :
                   (priceWithDelivery ? 'success' : 'failure')}>
            {isPickedUp ? 'Самовывоз' :
                (priceWithDelivery ? 'Доставка включена в стоимость' : 'Доставка не включена в стоимость')}
        </Badge>
    );
}