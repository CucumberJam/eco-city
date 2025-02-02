import {auth} from "@/auth";
import {getAdverts} from "@/app/_lib/actions";

export const metadata = {
    title: 'Публикации на сбыт'
}
export default async function Page(){
    const session = await auth();
    console.log(session)
    const resAdverts = await getAdverts(session?.user.id, session?.accessToken);
    console.log(resAdverts.data)
    return (
        <div>
            <h4>Публикации на сбыт</h4>
            {resAdverts?.data?.rows?.map(el => (
                <div key={el.id}>{el.status}</div>
            ))}
        </div>
    );
}