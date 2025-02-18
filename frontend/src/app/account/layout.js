import AccountHeader from "@/app/_ui/account/AccountHeader";
import {TabProvider} from "@/app/_context/TabContext";
import AccountSidebar from "@/app/_ui/account/AccountSidebar";
import AccountMode from "@/app/_ui/account/AccountMode";
import {auth} from "@/auth";
export default async function Layout({children}){
    const session = await auth();
    return (
        <StyledLayout>
            <TabProvider>
                <AccountHeader/>
                <AccountMode userData={session?.user}>
                        <AccountSidebar/>
                        <StyledMain>{children}</StyledMain>
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
function StyledMain({children}){
    return (
        <main className='w-full flex flex-col mx-auto my-0
        py-0 md:py-2 px-0 md:px-3
         h-full'>
            {children}
        </main>
    );
}