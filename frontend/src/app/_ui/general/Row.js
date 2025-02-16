export default function Row({children, style = 'items-start space-x-2'}){
    return (
        <div className={`flex ${style}`}>
            {children}
        </div>
    );
}