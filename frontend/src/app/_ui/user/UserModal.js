"use client"
import UserDescription from "@/app/_ui/user/UserDescription";
import {ModalView} from "@/app/_ui/general/ModalView";
import {useModal} from "@/app/_context/ModalContext";
import {useGlobalUIStore} from "@/app/_context/GlobalUIContext";

export default function UserModal(){
    const {currentOpen, close} = useModal();
    const {currentUser, setCurrentUser} = useGlobalUIStore((state) => state);
    return (
        <ModalView isOpen={currentOpen === currentUser?.id}
                   title="Описание участника"
                   handleClose={()=> {
                       setCurrentUser?.(null);
                       close();
                   }}>
            <UserDescription data={currentUser}/>
        </ModalView>
    );
}