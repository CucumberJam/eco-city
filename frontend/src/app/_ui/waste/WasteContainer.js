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
            <div className='w-[600px] sm:w-[700px] md:w-[800px] lg:w-full
                            md:m-x-auto
                            md:mt-6
                            px-2 sm:px-4
                            mb-5 sm:mb-10 mt-3
                            flex
                            flex-col
                            md:flex-row
                            sm:items-center md:items-start
                            sm:justify-between
                            space-x-0 sm:space-x-3
                            space-y-3 md:space-y-0'>
                <WasteList handleClick={selectWaste}/>
                <WasteAnnounces handleClick={selectWaste}/>
            </div>
    );
}