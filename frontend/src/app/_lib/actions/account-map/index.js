'use server';
import {getRequestOptions, getUserId, requestWrap} from "@/app/_lib/helpers";
import {apiServerRoutes} from "@/routes";
import {accountMapModes} from "@/app/_store/constants";
import {getAdvertsOfUser} from "@/app/_lib/actions/adverts";

const defaultParams = {
    mode: 0,
    role: 'RECEIVER',
    wastes: [],
    wasteTypes: [],
    offset: 0,
    limit: 10
}
/**
 * Метод запрашивает коллекцию точек на карте, состоящую из пользователей или заявок или откликов, в зависимости от режима
 *
 * @param {number} params.mode - Определяет текущий режим:
 * 1) список участников, имеющих отклики на заявки пользователя (PRODUCER, RECEIVER);
 * 2) список участников, имеющих заявки на смежные с пользователем виды отходов (RECYCLER, RECEIVER);
 * 3) список потенциальных партнеров со смежными с пользователем отходами:
 * - переработчиками, приемщикам (PRODUCER);
 * - производителями, приемщикам (RECYCLER);
 * - производителями, приемщиками, переработчиками (RECEIVER).
 * @param {string} params.role - роль пользователя
 * @param {array} params.wastes - отходы пользователя
 * @param {array} params.wasteTypes - подвиды отходов пользователя
 * @param {number} params.offset - количество строк в БД которые нужно пропустить
 * @param {number} params.limit - количество строк в БД которые нужно предоставить
 */
export async function fetchMapUsers(params = defaultParams){
    if(!validateRights(params.mode, params.role)) return {success: false, message: `Вам не доступен данный режим ${params.mode} c ролью ${params.role}`};


    const options = await getRequestOptions();
    return  await requestWrap({
        options,
        route: `${process?.env?.SERVER_URL}${apiServerRoutes.dialogs}`
    });
}
/**
* Метод проверки прав доступа пользователя к определенному режиму в зависимости от роли
*
* @param {number} mode - Определяет текущий режим:
* 1) список участников, имеющих отклики на заявки пользователя (PRODUCER, RECEIVER);
* 2) список участников, имеющих заявки на смежные с пользователем виды отходов (RECYCLER, RECEIVER);
* 3) список потенциальных партнеров со смежными с пользователем отходами:
    * - переработчиками, приемщикам (PRODUCER);
* - производителями, приемщикам (RECYCLER);
* - производителями, приемщиками, переработчиками (RECEIVER).
* @param {string} role - роль пользователя
*/
function validateRights(mode, role){
    return accountMapModes[role].includes(mode);
}
/**
 * Метод запрашивает список участников, имеющих отклики на заявки пользователя
 * mode = 0
 * Доступен только для ролей PRODUCER и RECEIVER
 */

async function fetchUsersWithResponsesOnUserAdverts(){
    // mode = 0
    //список участников, у которых есть отклики на заявки пользователя
    // (PRODUCER, RECEIVER)

    const userId = await getUserId();

    // получить список Id актуальных публикаций пользователя:
    const resAdvertsOfUser = await getAdvertsOfUser(0, 100);
    if(!resAdvertsOfUser?.success || !resAdvertsOfUser?.data) return resAdvertsOfUser;
    else if(resAdvertsOfUser.data.count === 0) return {success: false, message: 'У пользователя нет своих публикаций'}

    const advertsOfUser = resAdvertsOfUser.data.rows;




}
