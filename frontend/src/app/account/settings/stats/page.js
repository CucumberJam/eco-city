import {StatsMapProvider} from "@/app/_context/StatsProvider";
import StatsContainer from "@/app/_ui/account/stats/StatsContainer";
import {auth} from "@/auth";

export const metadata = {
    title: 'Статистика'
}
export default async function Page(){
    const session = await auth();
    return (
        <StatsMapProvider>
            <StatsContainer userRole={session?.user?.role}/>
        </StatsMapProvider>
    );
}