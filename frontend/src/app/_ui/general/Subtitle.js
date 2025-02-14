import Price from "@/app/_ui/general/Price";

export default function Subtitle({label = 'Комментарий: ',
                                     labelStyle = '',
                                     subTitle = null,
                                     Tag = null,
                                     advertPrice = null,
                                 }){
    return (advertPrice) ? (
        <div className='flex items-center w-full justify-start space-x-3'>
            <p className={`font-bold ${labelStyle}`}>{label}</p>
            <Price fontSize="text-base" advertTotalPrice={advertPrice}
                   responseTotalPrice={+subTitle}/>
        </div>
    ) : (
        <p className={`font-bold ${labelStyle}`}>
            {label}
            {Tag && (
                {Tag}
            )}
            {subTitle && <span className="font-normal">
                {subTitle}
            </span>}
        </p>
    );
}