import {useMemo} from "react";
import {MapContainer, Marker, TileLayer, Popup} from "react-leaflet";
import Link from "next/link";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import {daysNames, statusTitle} from "@/app/_store/constants";
import {getWastes, hasWeekDays, hasWeekendDays} from "@/app/_lib/helpers";
import UserWasteList from "@/app/_ui/user/UserWasteList";

export default function UserDescription({data}){
    return (
        <div className="space-y-6 text-base leading-relaxed
        text-gray-500 dark:text-gray-400">
            <UserStatus status={data?.role || 'default'}/>
            <div className="flex justify-center items-start gap-3">

                {(data?.latitude && data?.latitude) ?
                    <UserMap position={[+data?.latitude, +data?.latitude]}
                             address={data.address}/> :
                    <p>Данных нет</p>
                }

                <div className="flex flex-col">
                    <UserName name={data?.name || 'User Name'} role={data?.role}/>
                    <UserDescriptionItem label="Адрес:" value={data.address}/>
                    <UserDescriptionItem label="Телефон:" value={'+' + data.phone} isHorizontal={true}/>
                    <UserDescriptionItem label="Сайт:" value={data.website} isLink={true} isHorizontal={true}/>
                    <UserDescriptionItem label="Почта:" value={data.email} isHorizontal={true}/>
                    <WorkingTime workingDays={data.workingDays}
                                 workingId={data.id}
                                 workingStartHours={data.workingHourStart}
                                 workingEndHours={data.workingHourEnd}/>
                    <UserWastes userWastes={data.wastes}
                                userWasteTypes={data.wasteTypes}
                                wasteId={data.id}/>
                </div>
            </div>
        </div>
    );
}
function UserStatus({status}){
    return (
        <h4 className="text-center text-[24px]">
            Статус - {statusTitle[status.toLowerCase() || 'default']}
        </h4>
    );
}
function UserName({name = 'User Name', role}){
    return (
        <div className="flex gap-3 items-center">
            <div className="text-[20px]" style={{color: role === 'PRODUCER' ? '#FFC833': (role === 'RECYCLER' ? '#53D1B6' : '#60b6ff')}}>{name}</div>
            <div className="h-10 w-10 rounded-full" style={{backgroundColor: role === 'PRODUCER' ? '#FFC833': (role === 'RECYCLER' ? '#53D1B6' : '#60b6ff')}}></div>
        </div>
    );
}
function UserDescriptionItem({label = 'Адрес', value = '', isLink = false, isHorizontal = false}){
    return (
        <div className="flex flex-col text-[14px]" style={{flexDirection: isHorizontal ? 'row': 'col', gap: isHorizontal ? '0.75rem' : ''}}>
            <p className="text-gray-500">{label}</p>
            {isLink ?
                <Link href={'https://' + value} className="text-black">{value}</Link> :
                <p className="text-black">{value}</p>
            }
        </div>
    );
}
function WorkingTime({   label = 'Часы работы:',
                         workingDays = [] || null,
                         workingStartHours = [] || null,
                         workingEndHours = [] || null,
                         workingId= ''}){

    if(!workingDays?.length && !workingStartHours?.length && !workingEndHours?.length) return (
        <div className="flex flex-col">
            <p className="text-gray-500  text-[14px]">{label}</p>
            <p className="text-black">Данных нет</p>
        </div>
    );

    const  getWorkingTimeToday = () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        if(workingDays.includes(dayOfWeek)){
            const inx = workingDays.findIndex(day => day === dayOfWeek);
            const startTime = workingStartHours[inx];
            const endTime = workingEndHours[inx];
            return `${startTime}-${endTime}`;
        }else{
            return "не работает";
        }
    }

    const weekDays = useMemo(()=> {
        return hasWeekDays(workingDays, workingStartHours, workingEndHours);
    }, [workingId]);

    const weekends = useMemo(()=> {
        return hasWeekendDays(workingDays, workingStartHours, workingEndHours);
    }, [workingId]);

    return (
        <div className="flex flex-col">
            <p className="text-gray-500  text-[14px]">{label}</p>
            <div className="text-black">
                <p className="text-accent-600 font-medium">Сегодня {getWorkingTimeToday()}</p>
                <div className="flex flex-col">
                    {(!weekDays && !weekends) &&
                        workingDays.map((el,inx) => (
                            <WorkingTimeItem key={inx}
                                             title={daysNames[inx] + ':'}
                                             startTime={workingStartHours[inx]}
                                             endTime={workingEndHours[inx]}/>
                    ))}
                    {weekDays &&
                        <WorkingTimeItem title="Будни:"
                                         startTime={workingStartHours[0]}
                                         endTime={workingEndHours[0]}/>
                    }
                    {(!weekDays && weekends) && workingDays.slice(0, 5).map((el,inx) => (
                        <WorkingTimeItem key={inx}
                                         title={daysNames[inx]}
                                         startTime={workingStartHours[inx]}
                                         endTime={workingEndHours[inx]}/>
                    ))}
                    {(weekDays && !weekends) && workingDays.slice(5).map((el,inx) => (
                        <WorkingTimeItem key={inx === 0 ? 5 : 6}
                                         title={daysNames[inx === 0 ? 5 : 6]}
                                         startTime={workingStartHours[inx === 0 ? 5 : 6]}
                                         endTime={workingEndHours[inx === 0 ? 5 : 6]}/>
                    ))}
                    {weekends &&
                        <WorkingTimeItem title="Выходные:"
                                         startTime={workingStartHours[5]}
                                         endTime={workingEndHours[5]}/>}

                    {(weekDays || weekends) && <div className="h-6 border-t-2 border-gray-200"></div>}

                </div>
            </div>
        </div>
    );
}
function WorkingTimeItem({title, startTime, endTime}){
    return (
        <div className="flex gap-2 items-center">
            <p className="text-black">{title}</p>
            <p className="text-gray-500 text-sm">{`${startTime}-${endTime}`}</p>
        </div>
    );
}
function UserMap({position = [0, 0], zoom = 11, scrollWheelZoom = false, address = ''}){
    return (
        <div className="bg-white mx-auto my5 w-[70%] h-[400px]">
            <MapContainer center={position}
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
function UserWastes({userWastes, userWasteTypes, wasteId = ''}){
    const {wastes, wasteTypes} = useGlobalUIStore((state) => state);

    const totalWastes = useMemo(() => {
        return getWastes(userWastes, userWasteTypes, wastes, wasteTypes);
    }, [wasteId]);

    return (
        <div className="flex flex-col text-[14px]">
            <p  className="text-gray-500">Виды отходов:</p>
            <UserWasteList wastes={totalWastes}/>
        </div>
    );
}