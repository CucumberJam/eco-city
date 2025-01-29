import {getDimensions} from "@/app/_lib/data-service";
import FormCreateAdvert from "@/app/_ui/form/FormCreateAdvert";
import {Spinner} from "flowbite-react";
import {Suspense} from "react";

export const metadata = {
    title: 'Новая заявка'
}
export default async function Page(){
    const dimensions = await getDimensions();
    return (
        <>
            <div>Новая заявка</div>
            <Suspense fallback={<Spinner/>}
                      key={dimensions.length}>
                <FormCreateAdvert dimensionFromApi={dimensions}/>
            </Suspense>
        </>
    );
}