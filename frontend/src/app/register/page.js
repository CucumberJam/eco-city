import Link from "next/link";
import SignUpForm from "@/app/_ui/form/SignUpForm";
import {getCities, getRoles, getWastes, getWasteTypes} from "@/app/_lib/data-service";
import {Spinner} from "flowbite-react";
import {Suspense} from "react";

export const metadata = {
    title: 'Регистрация'
}
export default async function Page() {
    const [roles, wastes, wasteTypes,
        {status: statusCities, data: cities}] = await Promise.all([
        getRoles(), getWastes(), getWasteTypes(), getCities()]);
    return (
        <div className="flex flex-col gap-10 mt-10 items-center ">
            <h2 className="text-3xl font-semibold">
               Регистрация участника переработки отходов
            </h2>
            <div className='border border-gray-500
                            pb-10
                            max-w-5xl
                            flex flex-col space-y-10'>
                <Suspense fallback={<Spinner/>}
                          key={statusCities}>
                    <SignUpForm citiesAPI={cities}
                                rolesAPI={roles}
                                wastesApi={wastes}
                                wasteTypesApi={wasteTypes}/>
                </Suspense>
                <div className='w-full text-center'>
                    <p>Уже есть аккаунт?</p>
                    <Link href='/login' className='mx-2 underline hover:text-accent-400'>
                        Вход в личный кабинет
                    </Link>
                </div>
            </div>
        </div>
    );
}
