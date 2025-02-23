import ResponseContainer from "@/app/_ui/account/responses/ResponseContainer";
import {auth} from "@/auth";
import {ResponsesProvider} from "@/app/_context/ResponsesProvider";
export const metadata = {
    title: 'Отклики'
}
export default async function Page(){
    const session = await auth();
    return (
        <div className="w-full h-fit overflow-auto">
            <ResponsesProvider>
                <ResponseContainer userData={session?.user}/>
            </ResponsesProvider>
        </div>
    );
}