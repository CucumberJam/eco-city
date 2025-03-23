import FormPageContainer from "@/app/_ui/form/FormPageContainer";
import EditForm from "@/app/_ui/form/EditForm";
export const metadata = {
    title: 'Изменить данные'
}
export default function Page(){
    return (
            <FormPageContainer title='Изменить данные'>
                <EditForm/>
            </FormPageContainer>
    );
}