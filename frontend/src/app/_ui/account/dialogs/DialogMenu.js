import {memo} from "react";
import DialogAnnounceItem from "@/app/_ui/account/dialogs/DialogAnnounceItem";

const DialogMenu = memo(function DialogMenu({children, dialogs, pickDialog}){
    return (
        <section className='border-r w-[220px] '>
            {dialogs.map(el => (
                <DialogAnnounceItem key={el.id}
                                    dialog={el}
                                    clickHandler={pickDialog}/>
            ))}
        </section>
    );
});
export default DialogMenu;