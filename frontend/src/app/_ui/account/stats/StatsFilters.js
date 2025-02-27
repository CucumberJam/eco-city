import {useStats} from "@/app/_context/StatsProvider";
import Filter from "@/app/_ui/general/Filter";
import {statsData} from "@/app/_store/constants";
import Row from "@/app/_ui/general/Row";

export default function StatsFilters(){
    const {period, setPeriod, type, setType} = useStats();
    return (
        <Row width='w-full flex flex-start mt-3 ml-10'>
            <Filter data={statsData.filters[0].options}
                    key={statsData.filters[0].urlName}
                    isDisabled={false} withAll={false}
                    dataLabel={statsData.filters[0].label}
                    dataName={statsData.filters[0].urlName}
                    setItem={setPeriod}
                    itemValue={period.label}/>
            <Filter data={statsData.filters[1].options}
                    key={statsData.filters[1].urlName}
                    isDisabled={false} withAll={false}
                    dataLabel={statsData.filters[1].label}
                    dataName={statsData.filters[1].urlName}
                    setItem={setType}
                    itemValue={type.label}/>
        </Row>
    );
}