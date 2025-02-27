export default function Row({children, style = 'items-start space-x-2', width = ''}){
    return (
        <div className={`flex ${style} ${width}`}>
            {children}
        </div>
    );
}