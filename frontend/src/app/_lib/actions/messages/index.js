'use server';
import {getRequestOptions, getUserId, requestWrap} from "@/app/_lib/helpers";
import {apiServerRoutes} from "@/routes";

export async function getMessagesByDialogId(dialogId, offset = 0, limit = 10){
    if(!dialogId) return;
    const options = await getRequestOptions();
    const searchParams = new URLSearchParams({offset, limit});
    return  await requestWrap({
        options,
        route: `${process?.env?.SERVER_URL}${apiServerRoutes.messages}${dialogId}?${searchParams.toString()}`
    });
}
export async function createMessageToDialog(dialog, formData){
    if(!dialog?.id || !dialog?.firstUserId || !dialog?.secondUserId || !formData) return {success: false, message: 'Для создания сообщения не представлено данных самого диалога'};
    const options = await getRequestOptions(null, 'POST');
    const userId = await getUserId();
    formData.toUserId = +dialog.firstUserId === +userId ? dialog.secondUserId : dialog.firstUserId;
    options.body = JSON.stringify(formData);
    return  await requestWrap({
        options,
        route: `${process?.env?.SERVER_URL}${apiServerRoutes.messages}`
    });
}