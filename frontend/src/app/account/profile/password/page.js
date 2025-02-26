import PasswordForm from "@/app/_ui/form/PasswordForm";
import FormPageContainer from "@/app/_ui/form/FormPageContainer";

export const metadata = {
    title: 'Сменить пароль'
}
export default function Page(){
    return (
        <FormPageContainer title='Сменить пароль'>
            <PasswordForm/>
        </FormPageContainer>
    );
}