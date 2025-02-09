import FormCreateAdvert from "@/app/_ui/form/FormCreateAdvert";
import {auth} from "@/auth";

export const metadata = {
    title: 'Новая заявка'
}
export default async function Page(){
    const session = await auth();
    return (
    <div className="flex flex-col gap-6 mt-1 items-center ">
                <h2 className="text-3xl font-semibold">Заявка на сбыт отходов</h2>
        <FormCreateAdvert userData={session?.user}
                          userToken={session?.accessToken}/>
        </div>
    );
}