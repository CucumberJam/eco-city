"use server";
import {FNS_URL} from "@/app/_lib/URLS";
import {requestWrap} from "@/app/_lib/helpers";
import {apiServerRoutes} from "@/routes";

/**
 * Метод возвращает коллекцию доступных городов
 **/
export async function getCities(){
    return  await requestWrap({route:
            `${process?.env?.SERVER_URL}${apiServerRoutes.cities}`
    });
}

/**
 * Метод возвращает коллекцию доступных ролей
 **/
export async function getRoles(){
    return  await requestWrap({route:
            `${process?.env?.SERVER_URL}${apiServerRoutes.roles}`
    });
}


/**
 * Метод возвращает коллекцию доступных измерений
 **/
export async function getDimensions(){
    return  await requestWrap({route:
            `${process?.env?.SERVER_URL}${apiServerRoutes.dimensions}`
    });
}

/**
 * Метод возвращает коллекцию доступных отходов
 **/
export const getWastes = async ()=> {
    return  await requestWrap({route:
            `${process?.env?.SERVER_URL}${apiServerRoutes.wastes}`
    });
}

/**
 * Метод возвращает коллекцию доступных подвидов отходов
 **/
export const getWasteTypes = async ()=> {
    return  await requestWrap({route:
            `${process?.env?.SERVER_URL}${apiServerRoutes.wasteTypes}`
    });
}

/**
 * Метод возвращает компанию из единого реестра ЮЛ и ИП по ее ОГРН
 * @param {number} ogrn - ОГРН компании
 * @param {boolean} useApiFNS - налоговый сервис получения данных
 **/
export async function fetchCompanyByOGRN(ogrn, useApiFNS = true){
    try{
        if(useApiFNS){
            const data = await fetch(`${FNS_URL}?req=${ogrn}&key=${process.env.FNS_KEY}`)
            const res = await data.json();
            if(ogrn.length === 13 ? res?.items[0]?.['ЮЛ'] : res?.items[0]?.['ИП']){
                return {success: true, data: ogrn.length === 13 ? res.items[0]['ЮЛ'] : res?.items[0]?.['ИП'], useApiFNS}
            }else return {success: false, message: 'Ошибка получения данных о компании'}
        }else{
            const url = "http://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party";
            const options = {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Token " + process.env.FNS_KEY_2
                },
                body: JSON.stringify({
                    query: ogrn,
                    type: ogrn.length === 13 ? "LEGAL" : "INDIVIDUAL"
                })
            }

            const data = await fetch(url, options);
            const res = await data.json();
            if(res?.suggestions?.length === 0 || !res?.suggestions[0]?.value || !res?.suggestions[0]?.data){
                return {success: false, message: 'Нет данных о компании с таким ОГРН'}
            }else {
                const data = {
                    name: res.suggestions[0].value,
                    address: res.suggestions[0].data.address.unrestricted_value || res.suggestions[0].data.address.value,
                    status: res.suggestions[0].data.state.status || 'ACTIVE'
                }
                return {success: true, data: data, useApiFNS}
            }
        }
    }catch (e) {
        console.log(e);
        return {success: false, message: 'Ошибка получения данных о компании'}
    }
}