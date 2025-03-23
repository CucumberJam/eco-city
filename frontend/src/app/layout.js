import { Nunito_Sans } from "next/font/google";
import "@/app/_styles/globals.css";
import {GlobalStoreProvider} from '@/app/_context/GlobalUIContext';
import {ModalProvider} from '@/app/_context/ModalContext'
import {getCities, getDimensions, getRoles, getWastes, getWasteTypes} from "@/app/_lib/actions/global";
import LayoutBodyContainer from "@/app/_ui/general/LayoutBodyContainer";
import Header from "@/app/_ui/general/Header";
import {getUsersByParams} from "@/app/_lib/actions/users";
import {SessionProvider} from "next-auth/react";
import Link from "next/link";

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
    const {status: userStatus, data: usersAPI} = await getUsersByParams(0, 10, {cityId: cities?.[0]?.id})
    return (
        <html lang="en">
        <SessionProvider>
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
        </SessionProvider>
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
        <div className="px-[10%]  w-full mx-auto">
            <footer className=" d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                <div className="col-md-4 d-flex align-items-center justify-center text-center">
                    <Link href="/" className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
                        <svg className="text-blue-500" width="30" height="24"><use xlinkHref="#bootstrap"></use></svg>
                    </Link>
                    <span className="mb-3 mb-md-0 text-muted">© 2025 Eco-City,
                         <Link className="ml-3 text-blue-500 text-lg underline"
                               target="_blank"  href="mailto:cucumber12@bk.ru">
                             cucumber12@bk.ru</Link>
                    </span>
                </div>
            </footer>
        </div>
    );
}