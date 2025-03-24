import Link from "next/link";
import FormPageContainer from "@/app/_ui/form/FormPageContainer";
export const metadata = {
    title: 'Помощь'
}
export default function Page(){
    return (
        <FormPageContainer title=''>
            <div className='py-2 px-3 w-[450px] text-center'>
                <span className='pr-3'>По всем интересующим вопросам Вы можете обратиться в </span>
                <Link className="text-blue-500 text-lg underline"
                      target="_blank"
                      href="mailto:cucumber12@bk.ru">
                    тех. поддержку
                </Link>
            </div>
        </FormPageContainer>
    );
}