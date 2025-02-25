export default function FormPageContainer({children, title = 'Регистрация участника переработки отходов'}){
    return(
        <div className="flex flex-col gap-10 mt-10 items-center ">
            <h2 className="text-3xl font-semibold">
                {title}
            </h2>
            <div className='border border-gray-500
                            pb-10
                            max-w-5xl
                            flex flex-col space-y-5'>
                {children}
            </div>
        </div>
    );
}