import FormAnnounce from "@/app/_ui/form/FormAnnounce";
import {Spinner} from "flowbite-react";

export default function FormStatus({
                                       errMessage,
                                       isRegisterSucceeded,
                                       isFetching,
                                       children
}){
    return (
        <>
            {errMessage && <FormAnnounce message={errMessage}/>}

            {isRegisterSucceeded && <FormAnnounce message="Отклик на заявку направлен"
                                                  type='success'/>}
            {isFetching && <Spinner size={"xl"}/>}
            {(!isFetching && !isRegisterSucceeded) && (
                <>
                    {children}
                </>
            )}
        </>
    );
}