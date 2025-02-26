export default function FormColumnBlock({children}){
    return (
        <div className='w-full py-2 px-3 h-fit
                        flex flex-col items-center space-y-4'>
            {children}
        </div>
    );
}