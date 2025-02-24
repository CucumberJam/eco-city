import { Nunito_Sans } from "next/font/google";
import "@/app/_styles/globals.css";
import {GlobalStoreProvider} from '@/app/_context/GlobalUIContext';
import {ModalProvider} from '@/app/_context/ModalContext'
import {getCities, getDimensions, getRoles, getWastes, getWasteTypes} from "@/app/_lib/actions/global";
import LayoutBodyContainer from "@/app/_ui/general/LayoutBodyContainer";
import Header from "@/app/_ui/general/Header";
import {getUsersByParams} from "@/app/_lib/actions/users";

//https://fonts.google.com/specimen/Nunito+Sans?lang=ru_Cyrl
const nunitoSans = Nunito_Sans({
    subsets: ['latin', 'cyrillic'],
    display: 'swap',
})

export const metadata = {
    title: {
        template: "%s / Eco-City",
        default: 'Переработка вторсырья'
    },
    description: "Агрегатор участников переработки вторсырья",
};

export default async function RootLayout({ children }) {
    const [
        {status: statusRoles, data: roles},
        {status: statusWastes, data: wastes},
        {status: statusWasteTypes, data: wasteTypes},
        {status: statusDimensions, data: dimensions} ,
        {status: statusCities, data: cities}
        ] = await Promise.all([
            getRoles(), getWastes(),
            getWasteTypes(), getDimensions(),
            getCities(),
        ]);
    const {status: userStatus, data: usersAPI} = await getUsersByParams(0, 10, {cityId: cities[0]?.id})
    return (
        <html lang="en">
        <GlobalStoreProvider>
            <LayoutBodyContainer citiesAPI={cities}
                                 rolesAPI={roles}
                                 wastesApi={wastes}
                                 wasteTypesApi={wasteTypes}
                                 dimensionsApi={dimensions}
                                 serif={nunitoSans.className}
                                 usersAPI={usersAPI}>
                <Header/>
                <MainSection>
                    <ModalProvider>
                        {children}
                    </ModalProvider>
                </MainSection>
                <Footer/>
            </LayoutBodyContainer>
        </GlobalStoreProvider>
        </html>
    );
}
function MainSection({children}){
    return (
        <div className='flex-1 grid mx-auto w-full'>
            {children}
        </div>
    );
}
function Footer(){
    return (
        <footer>
            Footer
        </footer>
    );
}