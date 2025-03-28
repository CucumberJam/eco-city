'use server';
import {accountMapModes} from "@/app/_store/constants";
import {getAdverts, getAdvertsOfUser} from "@/app/_lib/actions/adverts";
import {getOtherResponses} from "@/app/_lib/actions/responses";
import {getUserId} from "@/app/_lib/helpers";
import {getUsersByParams} from "@/app/_lib/actions/users";

const defaultParams = {
    mode: 0,
    userRole: 'RECEIVER',
    cityId: 0,
    wastes: [],
    wasteTypes: [],
    roles: [],
    query: ''
}

/**
 * Метод запрашивает коллекцию точек на карте, состоящую из пользователей или заявок или откликов, в зависимости от режима
 * @param {number} offset - количество строк в БД которые нужно пропустить
 * @param {number} limit - количество строк в БД которые нужно предоставить
 * @param {object} params - объект данных
 * @param {number} params.mode - текущий режим:
 * 1) список участников, имеющих отклики на заявки пользователя (PRODUCER, RECEIVER);
 * 2) список участников, имеющих заявки на смежные с пользователем виды отходов (RECYCLER, RECEIVER);
 * 3) список потенциальных партнеров со смежными с пользователем отходами:
 * - переработчиками, приемщикам (PRODUCER);
 * - производителями, приемщикам (RECYCLER);
 * - производителями, приемщиками, переработчиками (RECEIVER).
 * @param {string} params.userRole - роль пользователя
 * @param {number} params.cityId - id города
 * @param {array} params.wastes - отходы пользователя
 * @param {array || null} params.wasteTypes - подвиды отходов пользователя
 * @param {string} params.query - запрос поисковой строки
 */
export async function fetchMapUsers(offset = 0, limit = 10, params = defaultParams){
    if(!validateRights(params.mode, params.userRole)) return {
        success: false,
        message: `Вам не доступен данный режим ${params.mode} c ролью ${params.userRole}`
    };
    switch (params.mode) {
        case 0: {
            return await fetchUsersWithResponsesOnUserAdverts(offset, limit, params);
        }
        case 1: {
            return await fetchUsersWithAdverts(params.wastes, params.wasteTypes, params.cityId, offset, limit)
        }
        case 2: {
            return await fetchPartners(offset, limit, params);
        }
    }
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
 * Метод возвращает список откликов, имеющих отклики на заявки пользователя
 * mode = 0
 * Доступен только для ролей PRODUCER и RECEIVER
 * @param {object} params - параметры для фильтров
 * @param {number} offset - количество строк в коллекции БД для пропуска
 * @param {number} limit - максимальное количество строк в коллекции БД для получения
 */
async function fetchUsersWithResponsesOnUserAdverts(offset, limit, params = null){
    //1 получить список Id актуальных публикаций пользователя:
    const resAdvertsOfUser = await getAdvertsOfUser(0, 10, params);
    if(!resAdvertsOfUser?.success || !resAdvertsOfUser?.data) return resAdvertsOfUser;
    else if(resAdvertsOfUser.data.count === 0) return {success: false, message: 'У пользователя нет своих публикаций'}

    const advertsOfUser = resAdvertsOfUser.data.rows;
    const advertIds = advertsOfUser.map(el => el.id);

    //2 вернуть список откликов с самими публикациями и пользователями
    // на публикации пользователя:
    return await getOtherResponses(offset, limit, advertIds, params);
}

/**
 * Метод возвращает список публикаций с пользователями
 * на смежные с пользователем виды отходов
 * mode = 1
 * Доступен только для ролей RECYCLER и RECEIVER
 * @param {[number]} wastes - коллекция id отходов
 * @param {[number]} wasteTypes - коллекция id подвидов отходов
 * @param {number} cityId - id города
 * @param {number} offset - количество строк в коллекции БД для пропуска
 * @param {number} limit - максимальное количество строк в коллекции БД для получения
 */
async function fetchUsersWithAdverts(wastes, wasteTypes, cityId, offset, limit){
    return await getAdverts({wastes, wasteTypes, cityId, offset, limit});
}

/**
 * Метод возвращает список участников со смежными с пользователем отходами
 * mode = 2
 * Доступен для всех авторизованных пользователей
 * @param {number} cityId - id города
 * @param {string} query - запрос поисковой строки
 * @param {string} userRole - роль пользователя
 * @param {[string]} roles - роли участников для выборки
 * @param {array} wastes - отходы пользователя
 * @param {array} wasteTypes - подвиды отходов пользователя
 * @param {number} offset - количество строк в БД которые нужно пропустить
 * @param {number} limit - количество строк в БД которые нужно предоставить
 */
async function fetchPartners(offset, limit, {cityId, query, wastes, wasteTypes, userRole,  roles}){
    if(userRole !== 'RECEIVER' && roles.includes(userRole)) return {success: false, message: `Пользователь с ролью ${userRole} не имеет доступа к участникам с такой же ролью`}
    const userId = await getUserId();
    return  await getUsersByParams( offset, limit, {userId, cityId, query, wastes, wasteTypes, roles});
}