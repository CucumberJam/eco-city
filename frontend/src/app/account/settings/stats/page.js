import LazyChart from "@/app/_ui/stats/LazyChart";

export const metadata = {
    title: 'Статистика'
}
export default async function Page(){
    return (
        <div>
            <p>Статистика</p>
            <LazyChart/>
        </div>
    );
}