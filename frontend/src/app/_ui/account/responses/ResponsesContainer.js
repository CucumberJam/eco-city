"use client";
import useRolesWastes from "@/app/_hooks/useRolesWastes";

export default function ResponsesContainer(){
    const {roles, wastes, wasteTypes } = useRolesWastes();
    console.log(roles)
    console.log(wastes)
    console.log(wasteTypes)
    return <div>Responses Container</div>
}