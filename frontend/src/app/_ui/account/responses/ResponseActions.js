import {Button} from "flowbite-react";
import {modalName} from "@/app/_store/constants";
import Row from "@/app/_ui/general/Row";
import FormStatus from "@/app/_ui/form/FormStatus";
import Column from "@/app/_ui/general/Column";
import {useModal} from "@/app/_context/ModalContext";

export default function ResponseActions({
                                            isUser,
                                            loading,
                                            errMessage,
                                            success,
                                            handleSend,
                                            handleUpdate}){
    const {open} = useModal();
    return (
        <>
            {isUser ? <Button style={{marginTop: '40px'}}
                              onClick={() => open(modalName.response)}>
                Отменить отклик
            </Button> : (
                <Row style={`items-center w-full ${loading ? ' justify-center mt-12 pt-10' : ' justify-between space-x-3'}`}>
                    <FormStatus isFetching={loading}
                                errMessage={errMessage}
                                isRegisterSucceeded={success}
                                successMessage="Успешно">
                        <Column width="w-full space-y-6 ">
                            <Button color='green' size="sm"
                                    style={{marginTop: '40px'}}
                                    onClick={handleSend}>
                                Написать сообщение
                            </Button>
                            <Row style="justify-between space-x-3">
                                <Button color='gray' className='w-36'
                                        onClick={()=> handleUpdate(false)}>
                                    Отклонить
                                </Button>
                                <Button className='w-36'
                                        onClick={()=>  handleUpdate(true)}>
                                    Принять
                                </Button>
                            </Row>
                        </Column>
                    </FormStatus>
                </Row>
            )}
        </>
    );
}