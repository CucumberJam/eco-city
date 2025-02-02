import {getDimensions} from "@/app/_lib/data-service";
import FormCreateAdvert from "@/app/_ui/form/FormCreateAdvert";
import {Spinner} from "flowbite-react";
import {Suspense} from "react";
import {auth} from "@/auth";

export const metadata = {
    title: 'Новая заявка'
}
export default async function Page(){
    const session = await auth();
    const dimensions = await getDimensions();
    return (
    <div className="flex flex-col gap-6 mt-1 items-center ">
                <h2 className="text-3xl font-semibold">Заявка на сбыт отходов</h2>
            <Suspense fallback={<Spinner/>}
                      key={dimensions.length}>
                <FormCreateAdvert dimensionFromApi={dimensions}
                                  userData={session?.user}
                                  userToken={session?.accessToken}/>
            </Suspense>
        </div>
    );
}