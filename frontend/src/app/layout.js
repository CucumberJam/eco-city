import { Nunito_Sans } from "next/font/google";
import "@/app/_styles/globals.css";
import Header from "@/app/_ui/general/Header";
import {GlobalStoreProvider} from '@/app/_context/GlobalUIContext';
import {ModalProvider} from '@/app/_context/ModalContext'
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <BodyContainer>
          <GlobalStoreProvider>
              <Header/>
                  <MainSection>
                      <ModalProvider>
                      {children}
                      </ModalProvider>
                  </MainSection>
              <Footer/>
          </GlobalStoreProvider>
      </BodyContainer>
    </html>
  );
}

function BodyContainer({children}){
    return (
        <body className={`${nunitoSans.className}
            bg-primary-50 text-primary-700 min-h-screen
            flex flex-col antialiasing`}>
        {children}
        </body>
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