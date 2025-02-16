import {prepareName} from "@/app/_lib/helpers";
import UserRoleCircle from "@/app/_ui/general/userRoleCircle";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";

export default function TableCompanyName({role, name,
                                             width = 'w-[40px]',
                                             height = "h-[40px]",
                                             nameFontSize = "text-[12px]",
                                             roleFontSize = "text-[11px]",
}){
    const {roles} = useGlobalUIStore((state) => state);
    const roleName = prepareName(roles?.find(el => el?.name === role)?.label || '')
    return (
        <div className='flex items-center space-x-2'>
            <UserRoleCircle role={role} width={width} height={height}/>
            <div>
                <h4 className={`text-center font-bold ${nameFontSize}`}>{name}</h4>
                <p className={`text-center italic ${roleFontSize}`}>{roleName}</p>
            </div>
        </div>
    );
}