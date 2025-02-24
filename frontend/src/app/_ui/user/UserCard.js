"use client";
import {statusTitle} from "@/app/_store/constants";
import {getWastes} from "@/app/_lib/helpers";
import {useMemo} from "react";
import { FaRegEnvelope } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import UserWasteList from "@/app/_ui/user/UserWasteList";
import Link from "next/link";
import UserRoleCircle from "@/app/_ui/general/UserRoleCircle";
export default function UserCard({item, wasteAPI, wastesTypesAPI, handleSelect = null}){
    const wastes = useMemo(()=>{
        return getWastes(item.wastes, item.wasteTypes, wasteAPI, wastesTypesAPI);
    }, [item.id]);
    return (
        <div className="flex items-center gap-2
                        border-gray-700 border-3
                        shadow-md
                        py-1 px-2 bg-white rounded-lg
                        h-[190px]
                        w-[500px]
                        cursor-pointer" onClick={() => handleSelect?.(item)}>
            <Label role={item.role}/>
            <ShortInfo name={item.name}
                       website={item.website}
                       address={item.address}/>
            <AddInfo wastes={wastes}
                     email={item.email}
                     phone={item.phone}/>
        </div>
    );
}
function Label({role}){
    return (
        <div className="flex flex-col
                        justify-start items-center gap-1
                        self-start
                        pt-[20px]">
            <UserRoleCircle role={role}/>
            {/*<div className="h-20 w-20 rounded-full" style={{backgroundColor: role === 'PRODUCER' ? '#FFC833': (role === 'RECYCLER' ? '#53D1B6' : '#60b6ff')}}></div>*/}
            <h4 className="text-center text-[12px] font-bold"
                style={{color: role === 'PRODUCER' ? '#FFC833': (role === 'RECYCLER' ? '#53D1B6' : '#60b6ff'), textShadow: '1px 1px 2px pink'}}>
                {statusTitle[role.toLowerCase() || 'default']}
            </h4>
        </div>
    );
}

function ShortInfo({name, website, address}){
    return (
        <div className="flex-col justify-between items-center">
            <div className="text-red-10 text-lg font-bold">{name}</div>
            <Link href={'https://'+ website} className="text-accent-10">{website}</Link>
            <div className="flex-col">
                <p className="text-red-10 font-bold">Адрес:</p>
                <p>{address.length > 63 ? address.substring(0, 60) + '...': address}</p>
            </div>
        </div>
    );
}

function AddInfo({wastes, phone, email}){
    const phoneNumber = `+${phone.substring(0,1)} (${phone.substring(1,4)}) ${phone.substring(4,7)} ${phone.substring(7,9)} ${phone.substring(9,11)}`

    return (
        <div className="h-[80%] flex flex-col justify-between self-start">
            <div className="flex flex-col">
                <p className="text-red-10 font-bold">Виды отходов:</p>
                <UserWasteList wastes={wastes}
                               style={{fontWeight: 'normal'}}/>
            </div>
            <div className="flex flex-col">
                <div className="flex items-center gap-1">
                    <FaRegEnvelope color="red" size={18}/>
                    <p>{email}</p>
                </div>
                <div className="flex items-center gap-1">
                    <FaPhone color="red" size={18}/>
                    <p className="text-nowrap">{phoneNumber}</p>
                </div>
            </div>

        </div>
    );
}