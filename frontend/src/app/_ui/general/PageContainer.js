export default function PageContainer({children}){
    return (
        <main className='mx-auto
         sm:max-w-xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl
         w-full
         px-4 py-2 sm:px-5 sm:py-4 md:px-8 md:py-5'>
            {children}
        </main>
    );
}