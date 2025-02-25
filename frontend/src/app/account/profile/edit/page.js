import FormPageContainer from "@/app/_ui/form/FormPageContainer";
import EditForm from "@/app/_ui/form/EditForm";
import {auth} from "@/auth";

export const metadata = {
    title: 'Изменить данные'
}
export default async function Page(){
    const session = await auth();

    return (
            <FormPageContainer title='Изменить данные'>
              <EditForm userData={session.user}/>
            </FormPageContainer>
    );
}