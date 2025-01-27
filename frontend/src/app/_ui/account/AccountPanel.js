import AccountHeader from "@/app/_ui/account/AccountHeader";
import AccountSidebar from "@/app/_ui/account/AccountSidebar";
import {TabProvider} from '@/app/_context/TabContext';
import {auth} from "@/auth";
import AccountMode from "@/app/_ui/account/AccountMode";
import AccountContainer from "@/app/_ui/account/AccountContainer";
export default async function AccountPanel(){
    const session = await auth();
    return (
        <StyledLayout>
            <TabProvider>
                <AccountHeader/>
                <AccountMode userRole={session?.user?.role || 'all'}>
                    <AccountSidebar/>
                    <AccountContainer userData={session?.user}/>
                </AccountMode>
            </TabProvider>
        </StyledLayout>
    );

}
function StyledLayout({children}){
    return (
        <div className='flex flex-col px-6'>
            {children}
        </div>
    );
}