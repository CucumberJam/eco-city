import ResponseContainer from "@/app/_ui/account/responses/ResponseContainer";
import {ResponsesProvider} from "@/app/_context/ResponsesProvider";
export const metadata = {
    title: 'Отклики'
}
export default async function Page(){
    return (
        <div className="w-full h-fit overflow-auto">
            <ResponsesProvider>
                <ResponseContainer/>
            </ResponsesProvider>
        </div>
    );
}