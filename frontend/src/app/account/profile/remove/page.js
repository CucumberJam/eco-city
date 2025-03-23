import FormPageContainer from "@/app/_ui/form/FormPageContainer";
import RemoveUserContainer from "@/app/_ui/user/RemoveUserContainer";

export const metadata = {
    title: 'Удалить аккаунт'
}
export default function Page(){
    return (
        <FormPageContainer title='Удалить аккаунт'>
           <RemoveUserContainer/>
        </FormPageContainer>
    );
}