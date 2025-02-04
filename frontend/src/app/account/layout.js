import AccountHeader from "@/app/_ui/account/AccountHeader";
import {TabProvider} from "@/app/_context/TabContext";
import AccountSidebar from "@/app/_ui/account/AccountSidebar";
import AccountMode from "@/app/_ui/account/AccountMode";
import {auth} from "@/auth";
import {getRoles, getWastes, getWasteTypes} from "@/app/_lib/data-service";

export default async function Layout({children}){
    const session = await auth();
    const [roles, wastes, wasteTypes] = await Promise.all([
        getRoles(), getWastes(), getWasteTypes()]);

    return (
        <StyledLayout>
            <TabProvider>
                <AccountHeader/>
                <AccountMode userRole={session?.user?.role || 'all'}
                             rolesAPI={roles}
                             wastesApi={wastes}
                             wasteTypesApi={wasteTypes}>
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
        <main className='w-full flex flex-col mx-auto my-0 py-2 px-3 h-full'>
            {children}
        </main>
    );
}