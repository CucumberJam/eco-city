import {ListGroup} from "flowbite-react";
import {workingDays} from "@/app/_store/constants";
import TimeRangePicker from "@/app/_ui/general/TimeRangePicker";

export default function FormWorkTime({options = workingDays,
                                      workDaysHandler,
}){
    return (
        <div className="w-full">
            <WorkTimeContainer>
                <WorkTimeItemWrapper>
                    <WorkItemTitle/>
                    <WorkItemTitle title="Начало:" styles='pl-8'/>
                    <WorkItemTitle title="Окончание:"/>
                </WorkTimeItemWrapper>
                <ListGroup>
                    {options.map(item => (
                        <ListGroup.Item key={item.id}>
                            <TimeRangePicker weekDay={item}
                                             weekDayHandler={workDaysHandler}/>
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
