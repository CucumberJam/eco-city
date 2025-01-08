'use client';
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import {MapContainer, Marker, TileLayer, Tooltip, } from "react-leaflet";
import {useEffect, useRef, useState} from "react";
import {getIconByRole} from "@/app/_ui/map/MapIcons";
import {useModal} from '@/app/_context/ModalContext'
import {ModalView} from "@/app/_ui/ModalView";
import UserDescription from "@/app/_ui/user/UserDescription";

const Map= ({
                users = [],
                position = [4.79029, -75.69003],
                zoom = 11,
                scrollWheelZoom = false,
                activeUser,
                setActiveUser}) => {

    const isInitialized = useRef(false);
    const {currentOpen, close, open} = useModal();

    useEffect(() => {
        isInitialized.current = true;
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
                    {users.map(user => (
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
                    ))}
                    <Marker key={position.latitude}
                            position={position}
                            draggable={false}>
                    </Marker>
                </>
                <ModalView isOpen={currentOpen === activeUser?.id}
                           title="Сведения об участнике"
                           handleClose={()=> setActiveUser(null)}>
                    <UserDescription data={activeUser}/>
                </ModalView>
            </MapContainer>
    );
}
export default Map;