'use client';
import {useEffect, useState} from "react";
import {Marker, Popup, useMapEvents} from "react-leaflet";
import {Button} from "flowbite-react";

export default function LocationMarker({setUserPosition, needDefineLocation}) {
    const [position, setPosition] = useState(null);

    const map = useMapEvents({
        click(e) {
            setPosition(prev => e.latlng)
            map.flyTo(e.latlng, map.getZoom())
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

        <Marker position={position}>
            <Popup>
                <div>
                    <p>Подтвердить позицию?</p>
                    <div className='flex items-center justify-between'>
                        <Button color="gray" onClick={(event)=> {
                            setPosition(null);
                            setUserPosition(null);
                            console.log(event)
                        }}>
                            Нет
                        </Button>
                        <Button onClick={()=> setUserPosition(position)}>Да</Button>
                    </div>
                </div>
            </Popup>
        </Marker>
    )
}