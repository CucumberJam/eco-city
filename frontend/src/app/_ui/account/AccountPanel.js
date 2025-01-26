import AccountHeader from "@/app/_ui/account/AccountHeader";
import AccountSidebar from "@/app/_ui/account/AccountSidebar";
import {TabProvider} from '@/app/_context/TabContext';
import {auth} from "@/auth";
import AccountMode from "@/app/_ui/account/AccountMode";
export default async function AccountPanel(){
    const session = await auth();
    return (
        <StyledLayout>
            <TabProvider>
                <AccountHeader/>
                <AccountMode userRole={session?.user?.role || 'all'}>
                    <AccountSidebar/>
                    <Container>
                        Here need to be content
                    </Container>
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
function Container({children}){
    return (
        <main className='col-span-2 row-span-2 py-2 px-4 overflow-auto'>
            <div className='flex flex-col max-w-[120rem] mx-auto my-0'>
                {children}
            </div>
        </main>
    );
}