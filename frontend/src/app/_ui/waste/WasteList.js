import {recycledWastes} from "@/app/_store/constants";
import Image from "next/image";
import arrow from "../../../../public/arrow-right.svg";
export default function WasteList({handleClick}){
    return (
        <div className="flex flex-col gap-10">
            <h3 className="font-bold text-black text-3xl">
                Виды отходов, подлежащих переработке:
            </h3>
            <ul className="w-[256px] gap-[20px]
                            flex flex-col
                            justify-between">
                {recycledWastes. map(el => (
                    <WasteItem key={el.name}
                               waste={el}
                               handleClick={handleClick}/>
                ))}
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