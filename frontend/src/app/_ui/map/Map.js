'use client';
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import {MapContainer, Marker, TileLayer, Tooltip,} from "react-leaflet";
import {useEffect, useRef} from "react";
import {getIconByRole} from "@/app/_ui/map/MapIcons";
import {useModal} from '@/app/_context/ModalContext'
import {ModalView} from "@/app/_ui/ModalView";
import UserDescription from "@/app/_ui/user/UserDescription";
import LocationMarker from "@/app/_ui/map/LocationMarker";

const Map = ({
                users = [],
                position = [4.79029, -75.69003],
                 withUsers = true,
                zoom = withUsers ? 11 : 13,
                scrollWheelZoom = false,
                activeUser = null,
                setActiveUser,
                needDefineLocation = false,
             }) => {

    const isInitialized = useRef(false);
    const {currentOpen, close, open} = useModal();

    useEffect(() => {
        isInitialized.current = true;
        const elem = document.querySelector('.leaflet-control-attribution');
        elem.style.display = 'none'
        return () => {
            isInitialized.current = false;
        };
    }, []);
    useEffect(() => {
        if(activeUser?.id) open(activeUser.id);
        else close();
    }, [activeUser?.id]);

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
                        <Marker key={user.id}
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
                    )) : <LocationMarker setUserPosition={setActiveUser}
                                         needDefineLocation={needDefineLocation}/>}
                    {withUsers && <Marker key={position.latitude}
                             position={position}
                             draggable={false}>
                    </Marker>}
                </>
                <ModalView isOpen={currentOpen === activeUser?.id}
                           title="Сведения об участнике"
                           handleClose={()=> setActiveUser?.(null)}>
                    <UserDescription data={activeUser}/>
                </ModalView>
            </MapContainer>
    );
}
export default Map;