'use client';
import LazyMap from "@/app/_ui/map/LazyMap";
import {Button} from "flowbite-react";
import {useState} from "react";
import {CheckIcon} from "@heroicons/react/24/outline";
import {ExclamationCircleIcon} from "@heroicons/react/24/outline";
export default function FormItemMap({changePositionHandler, isPosSet = false, pickedUpPos = []}){
    const [needDefineLocation, setNeedDefineLocation] = useState(false);

    return (
        <div className=' bg-white w-full'>
            <div className='py-1 flex items-center justify-between mb-1'>
                <div className='flex items-center space-x-1'>
                    <p className='text-green-50'>
                        {isPosSet ? 'Местоположение указано' : 'Укажите Ваше местоположение на карте:'}
                    </p>
                    {isPosSet ?  <CheckIcon style={{width: '25px', color: 'green'}}/>
                    : <ExclamationCircleIcon style={{width: '25px', color: 'red'}}/>
                    }

                </div>
                <Button size="sm" color="gray" onClick={()=> setNeedDefineLocation(prev => !prev)}>Определить автоматически</Button>
            </div>
            <div className="w-full h-[350px]">
                <LazyMap withUsers={false}
                         pickedUpPos={pickedUpPos}
                         needDefineLocation={needDefineLocation}
                         changePositionHandler={(chosenPos)=> {
                             changePositionHandler(chosenPos);
                             setNeedDefineLocation(false);
                         }}/>
            </div>
        </div>
    );
}