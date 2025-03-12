'use client';
import WasteAnnounces from "@/app/_ui/waste/WasteAnnounces";
import WasteList from "@/app/_ui/waste/WasteList";
import {useModal} from "@/app/_context/ModalContext";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
export default function WasteContainer(){
    const {open} = useModal();
    const {setWasteArticle} = useGlobalUIStore((state) => state);
    function selectWaste(waste){
        setWasteArticle(waste);
        open(waste.id);
    }
    return (
        <div className="w-full h-auto
                        flex flex-col
                        items-start justify-between px-4
                        mb-10 mt-3">
            <div className='flex items-center justify-between'>
                <WasteList handleClick={selectWaste}/>
                <WasteAnnounces handleClick={selectWaste}/>
            </div>
        </div>
    );
}