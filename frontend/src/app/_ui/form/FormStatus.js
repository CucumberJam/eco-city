import FormAnnounce from "@/app/_ui/form/FormAnnounce";
import {Spinner} from "flowbite-react";

export default function FormStatus({
                                       errMessage,
                                       isRegisterSucceeded,
                                       successMessage = 'Отклик на заявку направлен',
                                       isFetching,
                                       children
}){
    return (
        <>
            {errMessage && <FormAnnounce message={errMessage}/>}

            {isRegisterSucceeded && <FormAnnounce message={successMessage}
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