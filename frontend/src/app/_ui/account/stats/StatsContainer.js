"use client";
import LazyChart from "@/app/_ui/stats/LazyChart";
import AccountTabs from "@/app/_ui/account/AccountTabs";
import {statsData} from "@/app/_store/constants";
import {useStats} from "@/app/_context/StatsProvider";
import Row from "@/app/_ui/general/Row";
import Column from "@/app/_ui/general/Column";
import {useEffect} from "react";
import {Spinner} from "flowbite-react";
import StatsFilters from "@/app/_ui/stats/StatsFilters";

export default function StatsContainer({userRole}){
    const {initUserData, mode, changeMode, isFetching} = useStats();

    useEffect(()=>{
        initUserData(userRole);
    }, [])
    const stats = statsData.tab.filter((el)=> statsData.roles[userRole].includes(el.id));

    return (
        <>
            <AccountTabs className="h-40 w-full"
                         tabs={stats.map(el => el.label)}
                         icons={stats.map(el => el.icon)}
                         defaultValue={mode}
                         setTabHandler={changeMode}/>
            <h2 className="text-3xl font-semibold text-center mb-3">Статистика</h2>
            {isFetching ? <Spinner/> : (
                <>
                    <Row>
                        <Column width='w-full '>
                            {mode === 0 ?
                                <div>stats - table for responses</div>
                                :
                                <div>stats - table for adverts</div>
                            }
                        </Column>
                        <Column width='w-full '>
                            <StatsFilters/>
                            <LazyChart/>
                        </Column>
                    </Row>
                    <Row>
                        {mode === 0 ?
                            <div>TABLES - table for responses</div>
                            :
                            <div>TABLES - table for adverts</div>
                        }
                    </Row>
                </>
                )}
        </>
    );
}