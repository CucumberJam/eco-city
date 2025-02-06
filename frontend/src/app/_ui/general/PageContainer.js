export default function PageContainer({children}){
    return (
        <main className='mx-auto max-w-7xl
         px-4 py-2 sm:px-5 sm:py-4 md:px-8 md:py-5'>
            {children}
        </main>
    );
}