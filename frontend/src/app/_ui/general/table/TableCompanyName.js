import {prepareName} from "@/app/_lib/helpers";
import UserRoleCircle from "@/app/_ui/general/userRoleCircle";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";

export default function TableCompanyName({role, name}){
    const {roles} = useGlobalUIStore((state) => state);
    const roleName = prepareName(roles.find(el => el.name === role).label)
    return (
        <div className='flex items-center space-x-2'>
            <UserRoleCircle role={role} width="w-[40px]" height="h-[40px]"/>
            <div>
                <h4 className="text-center text-[12px] font-bold">{name}</h4>
                <p className="text-center text-[11px] italic">{roleName}</p>
            </div>
        </div>
    );
}