export default function Column({children, space = 'space-y-2', width = 'w-fit '}){
    return (
        <div className={`${width} flex flex-col ${space}`}>
            {children}
        </div>
    );
}