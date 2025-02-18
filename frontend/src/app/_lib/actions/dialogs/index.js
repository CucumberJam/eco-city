'use server';
import {apiServerRoutes} from "@/routes";
import {getRequestOptions, requestWrap} from "@/app/_lib/helpers";
export async function getUserDialogs(){
    const options = await getRequestOptions();
    return  await requestWrap({
        options,
        route: `${process?.env?.SERVER_URL}${apiServerRoutes.dialogs}`
    });
}
export async function getDialogById(dialogId){
    if(!dialogId) return;
    const options = await getRequestOptions();
    return  await requestWrap({
        options,
        route: `${process?.env?.SERVER_URL}${apiServerRoutes.dialogs}${dialogId}`
    });
}
export async function makeDialogRead(dialogId){
    if(!dialogId) return;
    const options = await getRequestOptions(null, 'POST');
    return  await requestWrap({
        options,
        route: `${process?.env?.SERVER_URL}${apiServerRoutes.dialogs}${dialogId}`
    });
}
