export default function CardLayout({children}){
    return (
        <section className="max-w-[600px] sm:max-w-[750px] md:max-w-[90%] lg:max-w-[98%]
            lg:mx-auto
            bg-gray-100 dark:bg-gray-900
            py-2 sm:py-5 md:py-10
            px-2 sm:px-4 md:px6 lg:px-12">
            <div className="grid grid-flow-row
            gap-1 sm:gap-4 md:gap-8
            text-neutral-600
            sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {children}
            </div>
        </section>
    );
}