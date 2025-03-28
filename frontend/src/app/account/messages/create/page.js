import AdvertForm from "@/app/_ui/form/AdvertForm";
export const metadata = {
    title: 'Новая заявка'
}
export default function Page(){
    return (
        <div className="flex flex-col gap-6 mt-1 items-center ">
            <h2 className="text-3xl font-semibold">Заявка на сбыт отходов</h2>
            <AdvertForm successMessage='Заявка создана'/>
        </div>
    );
}