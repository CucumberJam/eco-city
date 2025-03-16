import {recycledWastes} from "@/app/_store/constants";
import Image from "next/image";
import arrow from "../../../../public/arrow-right.svg";
export default function WasteList({handleClick}){
    return (
        <div className="flex flex-col
                        gap-2 sm:gap-4 md:gap-5 lg:gap-8">
            <h3 className="font-bold text-black
            text-xl md:text-2xl lg:text-3xl">
                Виды отходов, подлежащих переработке:
            </h3>
            <ul className=" flex
                            flex-row md:flex-col
                            sm:mx-0
                            space-x-6 sm:space-x-0
                            lg:ml-10
                            sm:gap-[10px]">
                <li key={1}>
                    <ul className='flex flex-col gap-[10px]
                                   w-[256px]'>
                        {recycledWastes.slice(0, 3).map(el => (
                            <WasteItem key={el.name}
                                       waste={el}
                                       handleClick={handleClick}/>
                        ))}
                    </ul>
                </li>
                <li key={2}>
                    <ul className='flex flex-col gap-[10px] w-[256px]'>
                        {recycledWastes.slice(3).map(el => (
                            <WasteItem key={el.name}
                                       waste={el}
                                       handleClick={handleClick}/>
                        ))}
                    </ul>
                </li>
            </ul>
        </div>
    );
}
function WasteItem({waste, handleClick}){
    return (
        <div className="w-full h-fit py-2
                        flex items-center
                        justify-between"
             onClick={()=> handleClick(waste)}>
            <p className="border-dotted border-b-4 w-[80%] text-lg">
                {waste.name.substring(0,1).toUpperCase() + waste.name.substring(1).toLowerCase()}
            </p>
            <ArrowIcon/>
        </div>
    );
}
function ArrowIcon(){
    return (
        <div className="w-[40px] h-fit cursor-pointer">
            <Image src={arrow}
                   alt="blue arrow"/>
        </div>
    );
}