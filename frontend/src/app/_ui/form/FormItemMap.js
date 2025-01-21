'use client';
import LazyMap from "@/app/_ui/map/LazyMap";
import {Button} from "flowbite-react";
import {useState} from "react";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import {CheckIcon} from "@heroicons/react/24/outline";
import {ExclamationCircleIcon} from "@heroicons/react/24/outline";
export default function FormItemMap({changePositionHandler, isPosSet = false}){
    const [needDefineLocation, setNeedDefineLocation] = useState(false);
    //const {currentUser} = useGlobalUIStore((state) => state);
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
                         needDefineLocation={needDefineLocation}
                         changePositionHandler={changePositionHandler}/>
            </div>
        </div>
    );
}