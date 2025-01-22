import {useEffect, useRef, useState} from "react";
import {ListGroup} from "flowbite-react";
import {workingDays} from "@/app/_store/constants";
import TimeRangePicker from "@/app/_ui/TimeRangePicker";

export default function FormWorkTime({
                                         buttonTitle = 'Часы работы:',
                                         options = workingDays,
                                         workDaysHandler,
}){
    //const [workTimeOpened, toggleWorkTimeOpened] = useState(true);

    return (
        <div className="w-full">
            {/*<WorkTimeButton buttonTitle={buttonTitle}/>*/}
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
function WorkTimeButton({buttonTitle, toggleClickHandler = null}){
    return (
        <div className="w-[16rem] flex items-center space-x-2">
            <button id="selectTimeToggle"
                    data-collapse-toggle="time-range-container"
                    type="button"
                    className="text-green-50 hover:underline text-base font-medium p-0 inline-flex items-center"
                    onClick={toggleClickHandler}>
                {buttonTitle}
                {toggleClickHandler && <svg className="w-8 h-8 ms-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                      height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="m8 10 4 4 4-4"/>
                </svg>}
            </button>
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

function WorkTimeSetAllButton({title = 'Сохранить режим работы', clickHandler}){
    return (
        <button type="button"
                onClick={clickHandler}
                className="inline-flex items-center justify-center w-full py-2.5 mb-4 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200
                hover:bg-gray-100 hover:text-green-50
                focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
            {/*<svg className="w-4 h-4 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5"/>
            </svg>*/}
            {title}
        </button>
    );
}