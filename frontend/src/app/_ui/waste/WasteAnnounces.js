import Image from "next/image";
import {recycledWastes} from "@/app/_store/constants";

export default function WasteAnnounces({handleClick = null}){
    return (
        <div className="min-w-[60%] mx-auto">
            <div className='grid grid-cols-2 gap-4 grid-rows-3'>
                {recycledWastes.map(el => (
                    <Image key={el.id}
                           src={`/announce/${el.id}.png`}
                           width={300}
                           height={160}
                           className='rounded-xl cursor-pointer overflow-hidden'
                           quality={100}
                           alt="trash cans"
                           onClick={()=> handleClick?.(el)}/>
                ))}
            </div>
        </div>
    );
}