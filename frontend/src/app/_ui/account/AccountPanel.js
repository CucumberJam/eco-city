import AccountHeader from "@/app/_ui/account/AccountHeader";
import AccountSidebar from "@/app/_ui/account/AccountSidebar";
import {TabProvider} from '@/app/_context/TabContext';
import {auth} from "@/auth";
import AccountMode from "@/app/_ui/account/AccountMode";
import AccountContainer from "@/app/_ui/account/AccountContainer";
import {getRoles, getWastes, getWasteTypes} from "@/app/_lib/data-service";
export default async function AccountPanel(){
    const session = await auth();
    const [roles, wastes, wasteTypes] = await Promise.all([
        getRoles(), getWastes(), getWasteTypes()]);
    return (
        <StyledLayout>
            <TabProvider>
                <AccountHeader/>
                <AccountMode userRole={session?.user?.role || 'all'}>
                    <AccountSidebar/>
                    <AccountContainer userData={session?.user}
                                      rolesAPI={roles}
                                      wastesApi={wastes}
                                      wasteTypesApi={wasteTypes}/>
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