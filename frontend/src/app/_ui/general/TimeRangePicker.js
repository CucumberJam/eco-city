"use client"
import {useState} from "react";
import {Checkbox} from "flowbite-react";
import {prepareName} from "@/app/_lib/helpers";
import {defaultEndTime, defaultStartTime} from "@/app/_store/constants";

export default function TimeRangePicker({weekDay, weekDayHandler,
                                            start = defaultStartTime,
                                            end = defaultEndTime}){
    const [startTime, setStartTime] = useState(start);
    const [endTime, setEndTime] = useState(end);
    function toggleWeekDay(res){
        if(res){
            weekDayHandler({type: 'add', payload: {
                    id: weekDay.id,
                    name: weekDay.label,
                    start: startTime,
                    end: endTime
                }
            });
        }else weekDayHandler({type: 'remove', payload: {id: weekDay.id}});
    }
    function changeTime(event, isStart = true){
        const value = event.target.value;
        if(isStart){
            setStartTime(value);
            weekDayHandler({type: 'change', payload: {
                    id: weekDay.id,
                    name: weekDay.label,
                    start: value,
                    end: endTime
                }
            });
        }else{
            setEndTime(value);
            weekDayHandler({type: 'change', payload: {
                    id: weekDay.id,
                    name: weekDay.label,
                    start: startTime,
                    end: value
                }
            });
        }
    }

    return (
        <div className="flex items-center w-full justify-between mr-14">
            <label htmlFor={weekDay.id} className='w-[115px] text-left'>
                <Checkbox style={{marginRight: '8px'}}
                          checked={weekDay.checked}
                          onChange={(event)=> toggleWeekDay(event.target.checked)}/>
                {weekDay?.label ? prepareName(weekDay.label) : prepareName(weekDay.name)}
            </label>

            <TimePicker id={"start-time-" + weekDay.id}
                        value={startTime}
                        changeHandler={e => changeTime(e)}/>
            <TimePicker id={"end-time-" + weekDay.id}
                        value={endTime}
                        changeHandler={e => changeTime(e, false)}/>
        </div>
    );
    function TimePicker({
                            id,
                            value,
                            changeHandler}){
        return (
            <div>
                <div className="relative">
                    <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd"
                                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                                  clipRule="evenodd"/>
                        </svg>
                    </div>
                    <input type="time" id={id}
                           value={value}
                           onChange={changeHandler}
                           className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           min="08:00" max="22:00"
                           required/>
                </div>
            </div>
        );
    }
}