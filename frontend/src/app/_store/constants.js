import {UserIcon} from "@heroicons/react/24/outline";
import {HomeIcon} from "@heroicons/react/24/outline";
import {EnvelopeIcon} from "@heroicons/react/24/outline";
import {Cog6ToothIcon} from "@heroicons/react/24/outline";
import {PlusIcon} from "@heroicons/react/24/outline";
import {ClipboardDocumentCheckIcon} from "@heroicons/react/24/outline";
import {ChatBubbleOvalLeftEllipsisIcon} from "@heroicons/react/24/outline";
import {PencilSquareIcon} from "@heroicons/react/24/outline";
import {PencilIcon} from "@heroicons/react/24/outline";
import {LockClosedIcon} from "@heroicons/react/24/outline";
import {TrashIcon} from "@heroicons/react/24/outline";
import {ChartBarIcon} from "@heroicons/react/24/outline";
import {InformationCircleIcon} from "@heroicons/react/24/outline";
const statusTitle = {
    producer: 'Производитель отходов',
    recycler: 'Переработчик отходов',
    receiver: 'Пункт приема и сортировки отходов',
    default: ''
}
const daysNames = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
//"workingDays": ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"],
const workingDays = [
    {id: 1, label: "Понедельник"},
    {id: 2, label: "Вторник"},
    {id: 3, label: "Среда"},
    {id: 4, label: "Четверг"},
    {id: 5, label: "Пятница"},
    {id: 6, label: "Суббота"},
    {id: 7, label: "Воскресенье"},
]
const workingDaysDB = {
    "Понедельник": 0,
    "Вторник": 1,
    "Среда": 2,
    "Четверг": 3,
    "Пятница": 4,
    "Суббота": 5,
    "Воскресенье": 6,
}

// https://mastera.academy/vidy-plastika-kotoryj-mozhno-i-nelzya-sdat-v-pererabotku/

const defaultStartTime  = '09:00';
const defaultEndTime  = '18:00';
const recycledWastes = [
     {
         name: 'пластик',
         picturesPath: 'plastic',
         types: [
             {
                 codeName: 'ПЭТ или PET',
                 code: 1,
                 alternativeNames: ['пэт', 'pet'],
                 name: 'полиэтилентерефталат',
                 description: 'Часто это самый простой пластик для переработки. ' +
                     'Как правило так маркируются бутылки для безалкогольных напитков и обычная упаковка для пищевых продуктов. ' +
                     'Эти материалы могут быть приняты на переработку и преобразованы в пластиковые бутылки и полиэфирные волокна.',
             },
             {
                 codeName: 'HDPE или PEHD',
                 code: 2,
                 alternativeNames: ['pehd', 'hdpe'],
                 name: 'полиэтилен',
                 comment: 'высокой плотности',
                 description: 'Материал, обычно используемый в упаковке, для таких вещей, как моющие средства, отбеливатели, шампуни, кондиционеры и контейнеры для молока. ' +
                     'Пластик с маркировкой «2» считают безопасным для повторного использования. ' +
                     'Как и PET, его принимают для переработки без проблем.',
             },
             {
                 codeName: 'PVC или В',
                 code: 3,
                 alternativeNames: ['pvc', 'b'],
                 name: 'поливинилхлорид',
                 description: 'Большинство людей знают, как выглядит ПВХ, когда видят его, но ПВХ включает в себя еще и трубы, игрушки, упаковку и т. д. ' +
                     'Его трудно перерабатывать, и он представляет серьезную угрозу для здоровья, поскольку он может содержать тяжелый металл кадмий. ' +
                     'ПВХ описывают как один из самых опасных потребительских товаров, когда-либо созданных. ' +
                     'В основном из PVC делают напольные и оконные покрытия, клеёнки и упаковки для моющих средств. ' +
                     'В отличие от предыдущих пластиков, PVC практически невозможно сдать на переработку в России. ' +
                     'При сжигании он выделяет канцерогенные диоксины.',
             },
             {
                 codeName: 'LDPE или PELD',
                 code: 4,
                 alternativeNames: ['ldpe', 'peld'],
                 name: 'полиэтилен',
                 comment: 'низкой плотности',
                 description: 'Тонкий полиэтилен. Из него производят пакеты, которые мы встречаем в супермаркете на кассе, пищевую плёнку, мусорные мешки, брезенты и линолеум.' +
                     'Упаковки с маркировкой «4» можно использовать повторно.' +
                     'Материалы с таким символом перерабатываются по специальной программе, поэтому перед утилизацией стоит поинтересоваться, принимают ли его на переработку в конкретном населенном пункте, и где именно.',
             },
             {
                 codeName: 'ПП или PP',
                 code: 5,
                 alternativeNames: ['пп', 'pp'],
                 name: 'полипропилен',
                 description: 'Прочный и термостойкий пластик. Его используют в самых разных целях: от внутренней отделки автомобилей до создания игрушек, одноразовой посуды и стаканчиков из-под йогурта. ' +
                     'Полипропиленовые материалы могут быть использованы для изготовления одежды, ванн, веревок или бутылок. ' +
                     'После использования их успешно перерабатывают в полипропиленовые волокна, из которых в дальнейшем производят самые разные изделия.',
             },
             {
                 codeName: 'ПС или PS',
                 code: 6,
                 alternativeNames: ['пc', 'ps'],
                 name: 'полистирол',
                 description: 'Вспененный пластик. Из него делают коробочки для овощей и фруктов, подложки под сырое мясо и одноразовую посуду. Кроме того, PS нередко используют для теплоизоляции помещения.' +
                     'Полистирол практически не подлежит вторичной переработке. ' +
                     'Он считается одним из опасных видов пластика и стоит избегать покупки продуктов, на которых есть этот символ утилизации. ' +
                     'Его перерабатывают в редких случаях только механическим способом, чаще всего преобразуя так, чтобы было возможно повторное использование без дополнительной обработки.',
             },
             {
                 codeName: '7 или OTHER',
                 code: 7,
                 name: 'пластмассы',
                 description: 'Этот код используется для всех других типов пластика, и изделия из его не следует помещать в мусорную корзину, предназначенную для сбора на переработку. ' +
                     'Ведь это может быть что угодно, от акрила до нейлона, к сожалению, перерабатывающие заводы не хотят использовать этот материал, и, что еще хуже, он может испортить целую партию материала, предназначенного для переработки.' +
                     'Обычно из них делают твердые контейнеры для косметики, кофе и кормов, а также игрушки и бутылочки для детей. ' +
                     'Пластик с маркировкой «7» в России не перерабатывают.',
                 picture: '',
             }
         ]
     },
    {
        name: 'стекло',
        picturesPath: 'glass',
        types: [
            {
                codeName: 'Прозрачное',
                code: 1,
                alternativeNames: ['прозрачное'],
                name: 'прозрачное',
                description: ''
            },
            {
                codeName: 'Коричневое',
                code: 2,
                alternativeNames: ['коричневое'],
                name: 'коричневое',
                description: ''
            },
            {
                codeName: 'Зеленое ',
                code: 3,
                alternativeNames: ['зеленое '],
                name: 'зеленое ',
                description: ''
            },
        ]
    },
    {
        name: 'макулатура',
        picturesPath: 'paper',
        types: [
            {
                codeName: 'белая бумага или МС-1А или МС-7Б/1',
                code: 1,
                alternativeNames: ['МС-1А', 'белая бумага', 'МС-7Б/1'],
                name: 'белая бумага',
                description: 'МС-1А это белая бумага без печати - фабричный брак печатной мелованной бумаги, а также бумаги для письма высшего качества.' +
                'Отходы белой бумаги с черно-белой печатью, которая не занимает более 20% поверхности, относятся к марке макулатуры МС-7Б/1.',
            },
            {
                codeName: 'гофрированный картон или МС-5Б',
                code: 2,
                alternativeNames: ['гофрированный картон', 'МС-5Б'],
                name: 'гофрированный картон',
                description: 'гофрированный картон',
            },
            {
                codeName: 'картон или МС-6Б',
                code: 3,
                alternativeNames: ['картон', 'МС-6Б'],
                name: 'картон',
                description: 'Отходы производства и потребления картона всех видов (кроме электроизоляционного, кровельного и обувного) с черно-белой и цветной печатью.',
            },
            {
                codeName: 'книги, журналы, брошюры, проспекты и каталоги или MC-7Б/3',
                code: 4,
                alternativeNames: ['книги', 'журналы', 'брошюры', 'проспекты', 'каталоги', 'MC-7Б/3'],
                name: 'Книги, журналы, брошюры, проспекты и каталоги',
                description: 'Сдавая макулатуру, человек зачастую ориентируется на чистую или исписанную бумагу, тетради, различного вида картон. ' +
                    'Но ведь журналы, брошюры и плакаты также являются печатной продукцией, а это значит, что они также расходуют древесный ресурс планеты.',
            },
            {
                codeName: 'Газетная бумага или MC-8В',
                code: 5,
                alternativeNames: ['Газетная бумага', 'MC-8В'],
                name: 'Газетная бумага',
                description: 'Газетная бумага неиспользованная, а также отходы газетной полиграфии;\n' +
                    'Использованные газеты, отходы газетного производства, всевозможные газетные листы.',
            }
        ]
    }
]

const nonRecycledWastes = [
    {
        name: 'пластик',
        codeName: 'С/PAP',
        code: 84,
        alternativeNames: ['c/pap'],
        description: 'Многослойная упаковка из бумаги, пластика и алюминия, которую привычно называют тетрапаком. Из С/PAP делают коробки для сока и молока, а также тубы-упаковки для чипсов вроде Pringles.' +
            'В теории упаковку с маркировкой «84» можно переработать, однако это намного дороже и труднее, чем ресайклинг обычного пластика. Тетрапак легко пачкается, с трудом отмывается и гниёт, а грязную упаковку на переработку не принимают.',
    }
]

const REG_EXPR_WEBSITES = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
///^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/
    ///(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?\/[a-zA-Z0-9]{2,}/
const REG_EXPR_EMAIL = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/;
//https://code.mu/ru/javascript/book/supreme/regular/repeat-operators/
const REG_EXPR_PHONE = /^(\+)?((\d{2,3}) ?\d|\d)(([ -]?\d)|( ?(\d{2,3}) ?)){5,12}\d$/;
const accountTabs = [
    {
        name: 'Главная',
        href: '/account',
        icon: <HomeIcon/>,
    },
    {
        name:'Сообщения',
        href: '/account/messages',
        icon: <EnvelopeIcon/>,
        menu: [
            {
                name: 'Создать',
                icon: <PlusIcon/>,
                href: '/account/messages/create',
                permits: ['PRODUCER', 'RECEIVER'],
            },
            {
                name: 'Публикации',
                icon: <ClipboardDocumentCheckIcon/>,
                href: '/account/messages/adverts',
                permits: ['PRODUCER', 'RECEIVER', 'RECYCLER'],
                rights: ['Свои заявки', 'Заявки участников'],
                personalRights: {
                    PRODUCER: [0],
                    RECEIVER: [0,1],
                    RECYCLER: [1]
                }
            },
            {
                name: 'Чаты',
                icon: <ChatBubbleOvalLeftEllipsisIcon/>,
                href: '/account/messages/dialogs',
                permits: ['PRODUCER', 'RECEIVER', 'RECYCLER']
            },
            {
                name: 'Отклики',
                icon: <PencilSquareIcon/>,
                href: '/account/messages/responses',
                permits: ['PRODUCER', 'RECEIVER', 'RECYCLER'],
                rights: ['Свои отклики', 'Отклики участников'],
                personalRights: {
                    PRODUCER: [1],
                    RECEIVER: [0,1],
                    RECYCLER: [0]
                }
            }
        ]
    },
    {
        name: 'Аккаунт',
        href: '/account/profile',
        icon: <UserIcon/>,
        menu: [
            {
                name: 'Редактировать',
                icon: <PencilIcon/>,
                href: '/account/profile/edit',
            },
            {
                name: 'Сменить пароль',
                icon: <LockClosedIcon/>,
                href: '/account/profile/password',
            },
            {
                name: 'Удалить аккаунт',
                href: '/account/profile/remove',
                icon: <TrashIcon/>
            }
        ]
    },
    {
        name:  'Настройки',
        href: '/account/settings',
        icon: <Cog6ToothIcon/>,
        menu: [
            {
                name: 'Статистика',
                icon: <ChartBarIcon/>,
                href: '/account/settings/stats',
            },
            {
                name: 'Помощь',
                icon: <InformationCircleIcon/>,
                href: '/account/settings/help',
            }
        ]
    }
]
const widthInputAdvertForm = 220;
const internalTabOptionStates = {
    'Свои': 0,
    'участников': 1
}
const advertStatuses = ['На рассмотрении', 'Отклонено', 'Принято', 'Исполнено'];
const getParamsToFetchAdverts = (userData, cityId, offset = 0, limit = 10)=>{
    return {
        wastes: userData.wastes,
        wasteTypes: userData.wasteTypes,
        cityId: cityId,
        offset: offset, // skip 0 instances
        limit: limit, //and fetch 10 after that
    };
}

const advertTableHeaders = ["Компании", "Отходы", "Количество", "Ед.изм.", "Срок подачи заявки", "Стоимость (руб)"];

export {
    statusTitle, daysNames, recycledWastes, REG_EXPR_WEBSITES,
    workingDays, defaultStartTime, defaultEndTime, REG_EXPR_EMAIL, REG_EXPR_PHONE,
    workingDaysDB, accountTabs, internalTabOptionStates, advertStatuses, widthInputAdvertForm,
    getParamsToFetchAdverts, advertTableHeaders
}