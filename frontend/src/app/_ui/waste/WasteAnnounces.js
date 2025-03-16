import Image from "next/image";
import {recycledWastes, slogan, slogStyle} from "@/app/_store/constants";

export default function WasteAnnounces({handleClick = null}){
    return (
        <div className="w-[540px] sm:w-[700px] md:w-[900px] lg:w-full">
            <div className='hidden md:grid grid-cols-2 gap-4 grid-rows-3 '>
                {recycledWastes.map(el => (
                    <div key={el.id}
                         className='relative cursor-pointer'
                         onClick={()=> handleClick?.(el)}>
                        <div className={` text-2xl ${slogStyle} top-1/3`}>
                            {el.name}
                        </div>
                        <Image src={`/announce/${el.id}.png`}
                               width={340}
                               height={170}
                               className='rounded-xl overflow-hidden hover:brightness-75 transition-colors'
                               quality={100}
                               alt="trash cans"/>
                    </div>
                ))}
            </div>
            <div className='hidden sm:grid md:hidden grid-cols-2 gap-4 grid-rows-3 '>
                {recycledWastes.map(el => (
                    <div key={el.id}
                         className='relative cursor-pointer'
                         onClick={()=> handleClick?.(el)}>
                        <div className={` text-2xl ${slogStyle} top-1/3`}>
                            {el.name}
                        </div>
                        <Image src={`/announce/${el.id}.png`}
                               width={300}
                               height={160}
                               className='rounded-xl overflow-hidden hover:brightness-75 transition-colors'
                               quality={100}
                               alt="trash cans"/>
                    </div>
                ))}
            </div>
            <div className='grid sm:hidden grid-cols-2 gap-3 grid-rows-3'>
                {recycledWastes.map(el => (
                    <div key={el.id}
                         className='relative cursor-pointer flex justify-center items-center hover:brightness-75 transition-colors'
                         onClick={()=> handleClick?.(el)}>
                        <div className={` text-2xl ${slogStyle} top-1/3 `}>
                            {el.name}
                        </div>
                        <Image src={`/announce/${el.id}.png`}
                               width={250}
                               height={140}
                               className='rounded-xl overflow-hidden hover:brightness-75 transition-colors'
                               quality={100}
                               alt="trash cans"/>
                    </div>
                ))}
            </div>
        </div>
    );
}