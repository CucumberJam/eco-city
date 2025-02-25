'use client';
import {useEffect, useState} from "react";
import {Marker, Popup, useMapEvents} from "react-leaflet";
import {Button} from "flowbite-react";
import {getIconByRole} from "@/app/_ui/map/MapIcons";

export default function LocationMarker({setUserPosition, needDefineLocation}) {
    const [position, setPosition] = useState(null);
    const [isPicked, setIsPicked] = useState(false);

    const map = useMapEvents({
        click(e) {
            if(!isPicked && !position){
                setPosition(prev => e.latlng)
                map.flyTo(e.latlng, map.getZoom());
            }else{
                setIsPicked(false)
            }
        },
        locationfound(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom())
        },
    })

    useEffect(()=>{
        if(needDefineLocation) map.locate();
        else setPosition(null);
    }, [needDefineLocation]);


    return position === null ? null : (

        <Marker position={position} icon={getIconByRole()}>
            <Popup>
                <div>
                    <p>Подтвердить позицию?</p>
                    <div className='flex items-center justify-between'>
                        <Button color="gray" onClick={(event)=> {
                            setPosition(null);
                            setUserPosition(null);
                        }}>
                            Нет
                        </Button>
                        <Button onClick={()=> {
                            setIsPicked(true)
                            setPosition(null);
                            setUserPosition(position)
                        }
                        }>Да</Button>
                    </div>
                </div>
            </Popup>
        </Marker>
    )
}