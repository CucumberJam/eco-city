'use client';
import WasteAnnounces from "@/app/_ui/waste/WasteAnnounces";
import WasteList from "@/app/_ui/waste/WasteList";
import {ModalView} from "@/app/_ui/ModalView";
import {useModal} from "@/app/_context/ModalContext";
import {useState} from "react";
import WasteTypes from "@/app/_ui/waste/WasteTypes";
export default function WasteContainer(){
    const {currentOpen, close, open} = useModal();
    const [activeWaste, setActiveWaste] = useState(null);
    function selectWaste(waste){
        setActiveWaste(waste);
        open(waste.name);
    }
    function unSelectWaste(){
        setActiveWaste(null);
        close();
    }
    return (
        <div className="w-full h-auto
                        flex flex-col
                        items-start justify-between px-4
                        mb-10 mt-3">
            <WasteList handleClick={selectWaste}/>
            <WasteAnnounces/>
            <ModalView isOpen={currentOpen === activeWaste?.name}
                       title={`Вид отходов - ${activeWaste?.name.substring(0,1).toUpperCase() + activeWaste?.name.substring(1).toLowerCase() || ''}`}
                       handleClose={unSelectWaste}>
                <WasteTypes wasteTypes={activeWaste?.types || []}
                            imgPath={activeWaste?.picturesPath || ''}/>
            </ModalView>
        </div>
    );
}