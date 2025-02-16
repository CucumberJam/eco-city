import Row from "@/app/_ui/general/Row";
import FormStatus from "@/app/_ui/form/FormStatus";
import Column from "@/app/_ui/general/Column";
import {Button} from "flowbite-react";

export default function AdvertActions({
                                          loading,
                                          errMessage,
                                          success,
                                          leftLabel = 'Редактировать',
                                          handleLeft,
                                          rightLabel  = 'Удалить',
                                          handleRight
}){
    return (
        <Row style={`items-center w-full ${loading ? ' justify-center mt-12 pt-10' : ' justify-between space-x-3'}`}>
            <FormStatus isFetching={loading}
                        errMessage={errMessage}
                        isRegisterSucceeded={success}
                        successMessage="Успешно">
                <Column width="w-full space-y-6 ">
                    <Row style="justify-between space-x-3">
                        <Button color='gray' className='w-36'
                                onClick={handleLeft}>
                            {leftLabel}
                        </Button>
                        <Button className='w-36'
                                onClick={handleRight}>
                            {rightLabel}
                        </Button>
                    </Row>
                </Column>
            </FormStatus>
        </Row>
    );
}