import {ListGroup} from "flowbite-react";
import {defaultEndTime, defaultStartTime, workingDays} from "@/app/_store/constants";
import TimeRangePicker from "@/app/_ui/general/TimeRangePicker";
import {useState} from "react";

export default function FormWorkTime({optionsProps = workingDays,
                                      workDaysHandler,
                                         startTimes = [],
                                         endTimes = []
}){
    const [options, setOptions] = useState(optionsProps);
    function change(resObj){
        const found = options.find(el => el.id === resObj.payload.id)
        if(resObj.type === 'add'){
            found.checked = true
        }else{
            found.checked = false
        }
        workDaysHandler?.(resObj)
    }
    return (
        <div className="w-full">
            <WorkTimeContainer>
                <WorkTimeItemWrapper>
                    <WorkItemTitle/>
                    <WorkItemTitle title="Начало:" styles='pl-8'/>
                    <WorkItemTitle title="Окончание:"/>
                </WorkTimeItemWrapper>
                <ListGroup>
                    {options.map((item, index) => (
                        <ListGroup.Item key={item.id}>
                            <TimeRangePicker weekDay={item}
                                             start={startTimes[index] || defaultStartTime}
                                             end={endTimes[index] || defaultEndTime}
                                             weekDayHandler={change}/>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </WorkTimeContainer>

        </div>
    );
}
function WorkTimeContainer({children}){
    return (
        <div id="time-range-container"
             className='w-full mx-auto mb-2
             flex flex-col gap-4'>
            {children}
        </div>
    );
}
function WorkTimeItemWrapper({children}){
    return (
        <div className='pt-1 px-4 flex items-center w-[90%] justify-between'>
            {children}
        </div>
    );
}
function WorkItemTitle({title = 'День недели:', styles = ''}){
    return (
        <div className={` ${styles}`}>
            {title}
        </div>);
}
