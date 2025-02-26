import FormPageContainer from "@/app/_ui/form/FormPageContainer";
import RemoveUserContainer from "@/app/_ui/user/RemoveUserContainer";
import {auth} from "@/auth";

export const metadata = {
    title: 'Удалить аккаунт'
}
export default async function Page(){
    const session = await auth();
    return (
        <FormPageContainer title='Удалить аккаунт'>
           <RemoveUserContainer userData={session.user}/>
        </FormPageContainer>
    );
}