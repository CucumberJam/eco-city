"use client";
import UserDescription from "@/app/_ui/user/UserDescription";
import {ModalView} from "@/app/_ui/general/ModalView";
import {useModal} from "@/app/_context/ModalContext";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";
import WasteTypes from "@/app/_ui/waste/WasteTypes";
import {prepareName} from "@/app/_lib/helpers";

export default function Modal(){
    const {currentOpen, close} = useModal();
    const {currentUser, setCurrentUser,
        wasteArticle, setWasteArticle} = useGlobalUIStore((state) => state);

    return (
        <ModalView isOpen={currentOpen === currentUser?.id || currentOpen === wasteArticle?.id}
                   title={currentUser? "Описание участника" :`Вид отходов - ${prepareName(wasteArticle?.name || '')}`}
                   handleClose={()=> {
                       currentUser ? setCurrentUser?.(null) : setWasteArticle?.(null);
                       close();
                   }}>
            {currentUser && <UserDescription data={currentUser}/>}
            {wasteArticle && <WasteTypes waste={wasteArticle}/>}
        </ModalView>
    );
}