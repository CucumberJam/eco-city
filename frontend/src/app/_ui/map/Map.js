"use client";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import {MapContainer, Marker, TileLayer, Tooltip,} from "react-leaflet";
import {useEffect, useRef} from "react";
import {getIconByRole} from "@/app/_ui/map/MapIcons";
import LocationMarker from "@/app/_ui/map/LocationMarker";

const Map = ({
                users = [],
                position = [4.79029, -75.69003],
                withUsers = true,
                zoom = withUsers ? 11 : 13,
                scrollWheelZoom = false,
                setActiveUser,
                needDefineLocation = false,
                pickedUpPos = [],
             }) => {

    const isInitialized = useRef(false);

    useEffect(() => {
        isInitialized.current = true;
        const elem = document.querySelector('.leaflet-control-attribution');
        elem.style.display = 'none'
        return () => {
            isInitialized.current = false;
        };
    }, []);

    if (!isInitialized) return null;

    return (
            <MapContainer ref={isInitialized}
                             className="w-full h-36"
                             center={position}
                             zoom={zoom}
                             scrollWheelZoom={scrollWheelZoom}
                             style={{height: "100%", width: "100%"}}>
                <>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

                    {withUsers ? users.map(user => (
                        <Marker key={user.id} style={{width: 0, height: 0}}
                                position={[ +user.latitude, +user.longitude ]}
                                draggable={false}
                                icon={getIconByRole(user.role)}
                                eventHandlers={{click: () => setActiveUser(user)}}>
                            <Tooltip>
                                <div>
                                    <h2>{user?.name || ''}</h2>
                                    <p>{user?.address || ''}</p>
                                </div>
                            </Tooltip>
                        </Marker>
                    )) : <>
                            <LocationMarker setUserPosition={setActiveUser}
                                         needDefineLocation={needDefineLocation}/>
                        {(pickedUpPos[0] !== 0 && pickedUpPos[1] !== 0) && (
                            <Marker key={pickedUpPos[0]}
                                    position={pickedUpPos}
                                    draggable={false}>
                            </Marker>
                        )}
                        </>
                    }
                    {withUsers && <Marker key={position.latitude}
                             position={position}
                             draggable={false}>
                    </Marker>}
                </>
            </MapContainer>
    );
}
export default Map;