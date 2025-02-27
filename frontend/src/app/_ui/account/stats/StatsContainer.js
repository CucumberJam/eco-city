"use client";
import LazyChart from "@/app/_ui/general/LazyChart";
import AccountTabs from "@/app/_ui/account/AccountTabs";
import {statsData} from "@/app/_store/constants";
import {useStats} from "@/app/_context/StatsProvider";
import Row from "@/app/_ui/general/Row";
import Column from "@/app/_ui/general/Column";
import {useEffect} from "react";
import {Spinner} from "flowbite-react";
import StatsFilters from "@/app/_ui/account/stats/StatsFilters";
import StatsTable from "@/app/_ui/account/stats/StatsTable";
import StatsAdvertTables from "@/app/_ui/account/stats/StatsAdvertTables";
import StatsResponseTables from "@/app/_ui/account/stats/StatsResponseTables";

export default function StatsContainer({userRole}){
    const {init, mode, setActiveMode, isFetching} = useStats();

    useEffect(()=>{
        init(userRole);
    }, [])
    const stats = statsData.tab.filter((el)=> statsData.roles[userRole].includes(el.id));

    return (
        <>
            <AccountTabs className="h-40 w-full"
                         tabs={stats.map(el => el.label)}
                         icons={stats.map(el => el.icon)}
                         defaultValue={mode}
                         setTabHandler={setActiveMode}/>
            <h2 className="text-4xl font-semibold text-center mb-3">Статистика</h2>
            {isFetching ? <Spinner size={'xl'} className='w-full m-auto flex justify-center'/> : (
                <>
                    <Row style='flex justify-between w-[90%] m-auto'>
                        <Column width='max-w-[600px] '>
                            <StatsTable/>
                        </Column>
                        <Column width='w-[250px] ml-8'>
                            <StatsFilters/>
                            <LazyChart/>
                        </Column>
                    </Row>
                    <Row>
                        {mode === 0 ? <StatsResponseTables/> : <StatsAdvertTables/>}
                    </Row>
                </>
                )}
        </>
    );
}