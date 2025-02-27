import {useStats} from "@/app/_context/StatsProvider";
import Filter from "@/app/_ui/general/Filter";
import {statsData} from "@/app/_store/constants";
import Row from "@/app/_ui/general/Row";

export default function StatsFilters(){
    const {period, setPeriod} = useStats();
    return (
        <Row width='w-full '>
            <Filter data={statsData.filters[0].options}
                    key={statsData.filters[0].urlName}
                    isDisabled={false} withAll={false}
                    dataLabel={statsData.filters[0].label}
                    dataName={statsData.filters[0].urlName}
                    setItem={setPeriod}
                    itemValue={period.label}/>
        </Row>
    );
}