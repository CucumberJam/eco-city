import Title from "@/app/_ui/general/Title";
import TableCompanyName from "@/app/_ui/general/table/TableCompanyName";
import Subtitle from "@/app/_ui/general/Subtitle";
import Column from "@/app/_ui/general/Column";

export default function ResponseInfo({response, isUser}){
    return (
        <Column>
            <Title title={isUser ? 'Мое предложение:' : 'Предложение участника'}/>
            {!isUser && <TableCompanyName name={response.userName}
                                          role={response.userRole}
                                          height="h-[60px]" width="w-[60px]"
                                          nameFontSize="text-[16px]" roleFontSize="text-[14px]"/>}
            <Subtitle label="Дата подачи: " subTitle={new Date(response.createdAt).toLocaleDateString()}/>
            <Subtitle label="Комментарий: " subTitle={response.comment}/>
            <Subtitle label="Цена (руб/шт): " subTitle={response.price}
                      advertPrice={response.advert.price}/>
            <Subtitle label="Стоимость (руб): " subTitle={response.totalPrice}
                      advertPrice={response.advert.totalPrice}/>
        </Column>
    );
}