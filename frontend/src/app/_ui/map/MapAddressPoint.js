import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import {useEffect, useRef} from "react";

export default function MapAddressPoint({
                                            position = [0, 0],
                                            zoom = 15,
                                            scrollWheelZoom = false,
                                            address = '',
                                        width = 'w-[70%]',
                                        height = 'h-[400px]',
                                        zIndex = ''}){
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
        <div className={`g-white mx-auto my5 ${width} ${height} ${zIndex}`}>
            <MapContainer ref={isInitialized}
                          center={position}
                          zoom={zoom}
                          scrollWheelZoom={scrollWheelZoom}
                          style={{height: "100%", width: "100%"}}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <Marker key={position.latitude}
                        position={position}
                        draggable={false}>
                    <Popup>{address}</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}