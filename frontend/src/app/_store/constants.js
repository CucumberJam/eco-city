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
import {HiUserCircle} from "react-icons/hi2";
import {HiClipboardList} from "react-icons/hi";
import {ChatBubbleBottomCenterIcon} from "@heroicons/react/24/outline";
import {RectangleStackIcon} from "@heroicons/react/24/outline";
import {UsersIcon} from "@heroicons/react/24/outline";
const statusTitle = {
    producer: 'Производитель отходов',
    recycler: 'Переработчик отходов',
    receiver: 'Пункт приема и сортировки отходов',
    default: ''
}
const daysNames = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
//"workingDays": ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"],
const workingDays = [
    {id: 1, label: "Понедельник", checked: false},
    {id: 2, label: "Вторник", checked: false},
    {id: 3, label: "Среда", checked: false},
    {id: 4, label: "Четверг", checked: false},
    {id: 5, label: "Пятница", checked: false},
    {id: 6, label: "Суббота", checked: false},
    {id: 7, label: "Воскресенье", checked: false},
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
        id: 1,
        name: 'жесть',
        picturesPath: 'iron',
        hasLabels: false,
        types: [
            {
                codeName: 'белая жесть',
                code: 1,
                alternativeNames: ['белая жесть'],
                name: 'белая жесть',
                description: 'Белая жесть представляет собой черную жесть с двухсторонним покрытием оловом, которое наносится методом горячего или электролитического лужения. ' +
                    'Белая жесть является тонкой, холоднокатаной, низкоуглеродистой листовой сталью. ' +
                    'Благодаря тому, что материал с двух сторон покрыт натуральным оловом, белая жесть отличается прочностью и пластичностью, коррозийной стойкостью, а также способностью к лужению.',
            },
            {
                codeName: 'консервная жесть',
                code: 2,
                alternativeNames: ['консервная жесть'],
                name: 'консервная жесть',
                description: 'Вид жести, используемый для изготовления тары под продукты, а также крышек для закатывания банок',
            },
        ]
    },
    {
        id: 2,
        name: 'батарейки',
        picturesPath: 'batteries',
        hasLabels: false,
        types: [
            {
                codeName: 'Солевые батарейки',
                code: 1,
                alternativeNames: ['Солевые батарейки'],
                name: 'Солевые батарейки',
                description: 'Наиболее дешевые и самые первые массовые гальванические элементы с маркировкой R - солевые, полюса которых состоят из цинка (графита) и двуокиси марганца, погруженных в хлорид аммония.',
            },
            {
                codeName: 'Щелочные батарейки',
                code: 2,
                alternativeNames: ['Щелочные батарейки'],
                name: 'Щелочные батарейки',
                description: 'Более энергоемкие и удобные с точки зрения продолжительности работы — алкалиновые гальванические элементы с маркировкой LR появились позже под названием щелочные, так как в роли электролита выступает гидроксид калия.',
            },
            {
                codeName: 'Серебряные батарейки',
                code: 3,
                alternativeNames: ['Серебряные батарейки'],
                name: 'Серебряные батарейки',
                description: 'Их можно отнести к разновидности щелочных по типу электролита, но это не "алкалайн". ' +
                    'Катод элемента этого типа состоит из оксида серебра, отсюда и название. ' +
                    'Гальванические элементы с серебряным катодом и щелочным электролитом (SR) характеризуются компактностью и высокими показателями электроемкости, поэтому их применяют в часах, калькуляторах, материнских платах ПК и ноутбуков для питания памяти загрузчика. ' +
                    'Такие батарейки иногда называют серебряно-цинковыми щелочными элементами. ',
            },
            {
                codeName: 'Литиевые батарейки',
                code: 4,
                alternativeNames: ['Литиевые батарейки'],
                name: 'Литиевые батарейки',
                description: 'Литиевые батарейки и составляющие их гальванические элементы с маркировкой CR имеют на плюсовой стороне литий, а заполнены могут быть разными видами электролитов, это определяет производитель. ' +
                    'Важным преимуществом этих источников считается минимальный саморазряд — батарейки хранятся годами и не теряют свойств.',
            },
            {
                codeName: 'Воздушно-цинковые батарейки',
                code: 5,
                alternativeNames: ['Воздушно-цинковые батарейки'],
                name: 'Воздушно-цинковые батарейки',
                description: 'Обозначаются PR, используются ограниченно, в основном в медицинских приборах. ' +
                    'При высокой емкости очень быстро саморазряжаются, поэтому крайне мало распространены в быту и других областях, кроме медицины. ' +
                    'Хранение батареек с кислородным анодом должно обеспечивать полную герметичность, поэтому после вскрытия упаковки элементы быстро приходят в негодность. ' +
                    'Емкость элементов превышает соответствующий показатель литиевых в 2 - 3 раза.',
            },
        ]},
    {
        id: 3,
        name: 'стекло',
        hasLabels: false,
        picturesPath: 'glass',
        types: [
            {
                codeName: 'Прозрачное стекло',
                code: 1,
                alternativeNames: ['прозрачное стекло'],
                name: 'прозрачное стекло',
                description: 'В составе обычного флоат-стекла — довольно высокий уровень железа. Оно снижает прозрачность и дает зеленый или голубой оттенок продукту. Глубокий уровень очистки исходного сырья от железа позволяет добиться практически идеальной прозрачности. ' +
                    'Стекло, изготовленное по такой технологии, называют просветленным. ' +
                    'Степень прозрачности можно оценить по такому показателю, как светопропускание. ' +
                    'У обычных стекол он примерно 83-89%, а у просветленных — выше 90%. ' +
                    'Оно настолько прозрачное, что создает эффект отсутствия преград. ' +
                    'Толщина листов просветленного стекла может колебаться от 2 до 19 мм.'
            },
            {
                codeName: 'Коричневое стекло',
                code: 2,
                alternativeNames: ['коричневое стекло'],
                name: 'коричневое стекло',
                description: 'Традиционный цвет стеклотары. ' +
                    'Типичный для упаковки пива и вина.  ' +
                    'Доминантный в сегменте лабораторного стекла.'
            },
            {
                codeName: 'Зеленое стекло',
                code: 3,
                alternativeNames: ['зеленое стекло'],
                name: 'зеленое стекло',
                description: 'Зеленый цвет в стекле – самый старый. ' +
                    'Его научились получать еще на заре стеклоделия. ' +
                    'Первый зеленый цвет и не надо было создавать, его создала природа – практически во всем сырье для изготовления стекла были примеси железа и его оксидов, именно это и делало стекла зеленоватыми. ' +
                    'Одно время для получения красивых травянистых зеленых оттенков использовали уран. ' +
                    'Потом решили, что это все-таки опасно для здоровья, и сегодня урановое стекло – или антиквариат, или диковинка, которую только показывают зрителям. '
            },
        ]
    },
    {
        id: 4,
        name: 'картон',
        hasLabels: false,
        picturesPath: 'cardboard',
        types: [
            {
                codeName: 'Гофрокартон',
                code: 1,
                alternativeNames: ['Гофрокартон'],
                name: 'Гофрокартон',
                description: 'Картон используемый в промышленности упаковочный материал, отличающийся малым весом, дешевизной, но высокими физическими параметрами. ' +
                    'Является одним из наиболее распространённых материалов в мире для использования в качестве упаковки. ' +
                    'Недостатком гофрокартона является его низкая влагостойкость.',
            },
            {
                codeName: 'Переплетный картон',
                code: 2,
                alternativeNames: ['Переплетный картон'],
                name: 'Переплетный картон',
                description: 'Прочный серый иногда коричневый картон изготавливаемый главным образом для создания переплетов (обложек) в полиграфической промышленности. ' +
                    'Главным свойством этого картона является высокий показатель механической прочности на разрыв и излом.',
            },
            {
                codeName: 'Крафт-картон',
                code: 3,
                alternativeNames: ['Крафт-картон'],
                name: 'Крафт-картон',
                description: 'Относится к чистоцеллюлозным видам картона и отличается кремовым цветом оборотной стороны. ' +
                    'Благодаря высоким жесткостным и барьерным свойствам используется для производства сверхпрочной тары для негабаритной электротехники, элитного алкоголя и различных хрупких предметов.',
            },
            {
                codeName: 'Целлюлозный картон',
                code: 4,
                alternativeNames: ['Целлюлозный картон'],
                name: 'Целлюлозный картон',
                description: 'Относится к чистоцеллюлозным видам картона и отличается кремовым цветом оборотной стороны. ' +
                    'Благодаря высоким жесткостным и барьерным свойствам используется для производства сверхпрочной тары для негабаритной электротехники, элитного алкоголя и различных хрупких предметов.',
            },
        ]
    },
    {
        id: 5,
        name: 'макулатура',
        hasLabels: false,
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
    },
    {
         id: 6,
         name: 'пластик',
         hasLabels: true,
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
]
const slogan = 'Переработка отходов в каждом городе'
const carouselImages = [
    {
        id: 1,
        path: '/baner/banner.jpg',
        alt: 'rubbish-bins',
        textColor: '#FFFFFF',
        phrase: slogan,
    },
    {
        id: 2,
        path: '/baner/carton.jpg',
        alt: 'cardboard',
        textColor: '#FFFFFF',
        phrase: slogan,
    },
    {
        id: 3,
        path: '/baner/bottles.jpg',
        alt: 'bottles',
        textColor: '#000000',
        phrase: slogan,
    },
    {
        id: 4,
        path: '/baner/plastic.avif',
        alt: 'plastic',
        textColor: '#FFFFFF',
        phrase: slogan,
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
    'Мои': 0,
    'участников': 1
}
const advertStatuses = ['На рассмотрении', 'Отклонено', 'Принято', 'Исполнено'];
const tabsTitles = ["Мои публикации", "Публикации других участников"];
const accountMapTabsTitles = ['Отклики на мои заявки', 'Заявки участников', 'Партнеры'];
const accountMapTabsIcons = [ChatBubbleBottomCenterIcon, RectangleStackIcon, UsersIcon];
const accountMapModes = {
    PRODUCER: [0, 2],
    RECYCLER: [1, 2],
    RECEIVER: [0, 1, 2]
}
const statsData = {
    tableHeaders: ['Статус', 'Количество', 'Просроченные', 'Актуальные'],
    tab: [
        {
            id: 0,
            label: 'Отклики',
            icon: ChatBubbleBottomCenterIcon,
        },
        {
            id: 1,
            label: 'Публикации',
            icon: RectangleStackIcon
        }
    ],
    roles: {
        PRODUCER: [1],
        RECYCLER: [0],
        RECEIVER: [0, 1]
    },
    filters: [
        {
            id: 0,
            label: 'Отчетный период',
            urlName: 'period',
            value: null,
            options: [
                {id: 0, label: 'месяц',  name: 'month'},
                {id: 1, label: 'квартал',  name: 'quarter'},
                {id: 2, label: 'пол года',  name: 'half-year'},
                {id: 3, label: 'год',  name: 'year'},
            ]
        },
        {
            id: 1,
            label: 'Вид данных',
            urlName: 'type',
            value: null,
            options: [
                {id: 0, label: 'все',  name: 'all'},
                {id: 1, label: 'просроченные',  name: 'late'},
                {id: 2, label: 'потенциальные',  name: 'coming'},// не просроченные
            ]
        },
/*        {
            id: 1,
            label: 'Вид данных',
            urlName: 'type',
            value: null,
            options: [
                {id: 0, label: 'выполненные',  name: 'performed'},
                {id: 1, label: 'просроченные',  name: 'late'},
                {id: 2, label: 'потенциальные',  name: 'potential'},// не просроченные
            ]
        },
        {
            id: 2,
            label: 'Статус',
            urlName: 'status',
            value: null,
            options: [
                {id: 0, label: 'принято',  name: 'accepted'},
                {id: 1, label: 'на рассмотрении',  name: 'on-recognition'},
            ]
        }*/
    ],
    colors: {
        0: '#FFBB28',
        1: '#00C49F',
        2: '#0088FE',
        3: '#FF8042'
    }
}
const tabsIcons = [HiUserCircle, HiClipboardList];
const getParamsToFetchAdverts = (userData, cityId, offset = 0, limit = 10)=>{
    return {
        wastes: userData.wastes,
        wasteTypes: userData.wasteTypes,
        cityId: +cityId,
        offset: +offset, // skip 0 instances
        limit: +limit, //and fetch 10 after that
    };
}

const advertTableHeaders = ["Компании", "Отходы", "Количество", "Ед.изм.", "Срок подачи заявки", "Стоимость (руб)", 'Статус'];
const responseTableHeaders = ["Компании", "Отходы", "Количество", "Ед.изм.", "Срок подачи заявки", "Стоимость заявки (руб)", "Стоимость отклика (руб)", "Статус"];
const statusColors = {
    0: '#FFC833',
    1: '#DB4646',
    2: '#7ea542',
    3: '#3C546C'
}
const statusColorsFlowBite = {
    0: 'warning',
    1: 'failure',
    2: 'success',
    3: 'gray'
}
const showUserAdverts = (userRole)=>  ['RECEIVER', 'PRODUCER'].includes(userRole);
const showOthersAdverts = (userRole)=> ['RECEIVER', 'RECYCLER'].includes(userRole);
const showUserResponses = (userRole)=>  ['RECEIVER', 'RECYCLER'].includes(userRole);
const showOthersResponses = (userRole)=> ['RECEIVER', 'PRODUCER'].includes(userRole);
const paginationOptions = [5,10,20];
const modalName = {
    response: 'WARN_BEFORE_REMOVE_RESPONSE',
};
const initialPagination = {
    currentPage: 1,
    count: 0,
    limit: paginationOptions[1],
    offset: 0,
    totalPages: 1
};
const itemsCheckUpdateUser = {
    names: ['name', 'address', 'latitude', 'longitude', 'email', 'phone', 'website', 'workingDays', 'workingHourStart', 'workingHourEnd', 'chosen-city', 'role'],
    needsErrorCheck: ['email', 'phone', 'website'],
    workNames: ['workingDays', 'workingHourStart', 'workingHourEnd'],
    namesIfNotDisabled: ['chosen-city', 'role'],
}

const wasteArticles = [
    {
        id: 1,
        imgPath: '/news/',
        urlPath: 'https://www.forbes.ru/forbeslife/530440-zagraznenie-vozduha-uhudsaet-koncentraciu-ludej-na-povsednevnyh-delah',
        date: '07 февраля 2025',
        title: 'Загрязнение воздуха ухудшает концентрацию людей на повседневных делах',
        text: 'Согласно результатам исследования ученых в Великобритании, воздействие загрязненного воздуха снижает способность людей сосредоточиваться на повседневных задачах. ' +
            'Помимо этого, оно влияет на возможность хорошо распознавать эмоции других людей'
    },
    {
        id: 2,
        imgPath: '/news/',
        urlPath: 'https://www.rbc.ru/life/news/65f31a559a79475859cb5a1d',
        date: '18 марта 2024',
        title: 'Переработка мусора в России. Кто этим занимается и насколько успешно.',
        text: 'После введения санкций вопросы импортозамещения встали практически во всех отраслях российской экономики. Мусорная отрасль не стала исключением.'
    },
    {
        id: 3,
        imgPath: '/news/',
        urlPath: 'https://iz.ru/1837164/2025-02-10/v-reke-leningradskoi-oblasti-vyiavili-prevyshenie-toksinov-v-1-tys-raz',
        date: '10 февраля 2025',
        title: 'В реке Ленинградской области выявили превышение токсинов в 1 тыс. раз',
        text: 'В реке Нейма в Кингисеппском районе Ленинградской области было выявлено многократное превышение допустимого содержания ядовитых веществ. ' +
            'Об этом 10 февраля сообщили в пресс-службе Северо-Западного межрегионального управления Росприроднадзора.'
    },
    {
        id: 4,
        imgPath: '/news/',
        urlPath: 'https://ria.ru/20250312/tekhnosfera-2004507906.html',
        date: '12 марта 2025',
        title: 'На чемпионате "Техносфера" проработали нейтрализацию последствий ЧС в Анапе',
        text: 'Команды кейс-чемпионата "Техносфера", партнером которого выступает "Билайн", искали решения для устранения последствий ЧС в Черном море, сообщает оператор.'
    },
    {
        id: 5,
        imgPath: '/news/',
        urlPath: 'https://russian.rt.com/russia/news/1445976-pogruzheniya-vodolazy-mazut-anapa',
        date: '09 марта 2025',
        title: 'Более 1100 погружений совершили водолазы МЧС для сбора мазута в Анапе',
        text: 'Водолазы МЧС России совершили более 1,1 тыс. погружений для уборки мазута со дна Чёрного моря на пляжах Анапы. ' +
            'В результате работ удалось собрать около 2 тыс. мешков с нефтепродуктами.'
    },
    {
        id: 6,
        imgPath: '/news/',
        urlPath: 'https://www.bbc.com/future/article/20250311-the-women-fighting-indias-worm-poachers',
        date: '12 марта 2025',
        title: 'Почему браконьерство на червей угрожает водоболотным угодьям Индии',
        text: 'Щетинистые черви Индии часто остаются незамеченными. Но они имеют решающее значение для здоровья водно-болотных угодий страны – вот почему местные женщины работают над тем, чтобы поймать браконьеров, уничтожающих их популяцию.'
    },
    {
        id: 7,
        imgPath: '/news/',
        urlPath: 'https://phys.org/news/2025-03-sharks-dying-alarming-due-fishing.html',
        date: '14 марта 2025',
        title: 'Акулы гибнут с пугающей скоростью, в основном из-за рыболовства. Запреты на удержание могут помочь',
        text: 'Несмотря на страх, который они могут внушать людям, у акул гораздо больше причин бояться нас. ' +
            'Почти треть акул находится под угрозой исчезновения во всем мире, в основном из-за рыболовства.'
    },
    {
        id: 8,
        imgPath: '/news/',
        urlPath: 'https://www.britishecologicalsociety.org/content/how-learning-about-the-future-of-the-ocean-impacts-children/',
        date: '02 декабря 2024',
        title: 'Как изучение будущего океана влияет на детей',
        text: 'Исследование, опубликованное в журнале BES , People and Nature , опросило 21 педагога океанической грамотности из Аотеароа, Новая Зеландия, имеющих опыт обучения детей средней и начальной школы, подчеркнув важность океанической грамотности для благополучия молодых людей. ' +
            'По словам педагогов, интерактивный опыт в морской среде, будь то нетронутой или деградировавшей, вызывает чувство удивления, любопытства и общее чувство связи и принадлежности.'
    },
    {
        id: 9,
        imgPath: '/news/',
        urlPath: 'https://www.britishecologicalsociety.org/cop29-what-are-the-climate-change-solution-pitfalls-to-look-out-for/',
        date: '21 ноября 2024',
        title: 'COP29: На какие подводные камни при решении проблемы изменения климата следует обратить внимание?',
        text: 'Чтобы справиться с глобальным кризисом климата и биоразнообразия, нам нужен ряд решений, многие из которых обсуждались на этой неделе на COP29. ' +
            'Рик Стаффорд, председатель нашего Комитета по политике, подчеркивает, какие подводные камни могут помешать прогрессу.'
    },
    {
        id: 10,
        imgPath: '/news/',
        urlPath: 'https://www.theguardian.com/environment/2025/mar/14/uk-hoping-to-work-with-china-to-counteract-trumps-climate-hostile-policies',
        date: '14 марта 2025',
        title: 'Великобритания надеется сотрудничать с Китаем, чтобы противодействовать враждебной по отношению к климату политике Трампа',
        text: 'Эд Милибэнд посещает Пекин в рамках плана по созданию глобальной оси, работающей в поддержку мер по борьбе с изменением климата'
    },
    {
        id: 11,
        imgPath: '/news/',
        urlPath: 'https://www.theguardian.com/us-news/2025/mar/13/fossil-fuel-lobby-immunity-lawsuits',
        date: '13 марта 2025',
        title: 'Экологические организации бьют тревогу, поскольку лоббисты ископаемого топлива требуют иммунитета',
        text: 'Около 200 групп призывают Конгресс отклонить попытки предоставить иммунитет индустрии ископаемого топлива, опасаясь долгосрочного ущерба от климатических исков'
    },
    {
        id: 12,
        imgPath: '/news/',
        urlPath: 'https://www.bbc.com/news/articles/c15qw8lwl18o',
        date: '07 марта 2025',
        title: 'Компании заявляют, что переработка загрязняющих веществ вызывает беспокойство',
        text: 'Компания по переработке отходов, заключившая контракт со штатами Гернси, заявила, что обеспокоена тем, что компании за пределами острова могут отказаться от отходов острова, если люди не будут сортировать мусор должным образом.'
    },
    {
        id: 13,
        imgPath: '/news/',
        urlPath: 'https://www.bbc.com/news/articles/c1jpgp6djrjo',
        date: '05 марта 2025',
        title: 'Почему выбрасывается больше одежды, чем когда-либо?',
        text: 'Рост популярности приложения Vinted, продающего одежду секонд-хенд, и стремление людей найти выгодные предложения привели к резкому росту экологичности моды, однако один из центров по сортировке текстильных отходов сообщил, что сейчас выбрасывается больше одежды, чем когда-либо.'
    },
    {
        id: 14,
        imgPath: '/news/',
        urlPath: 'https://www.letsrecycle.com/news/council-to-cut-a-fifth-of-fleet-emissions-through-hvo/',
        date: '14 марта 2025',
        title: 'Совет сократит пятую часть выбросов автопарка за счет HVO',
        text: 'Совет прогнозирует, что выбросы углерода в его автопарке сократятся на одну пятую после перевода части его парка на гидроочищенное растительное масло (HVO).'
    },
    {
        id: 15,
        imgPath: '/news/',
        urlPath: 'https://www.letsrecycle.com/news/wish-releases-guidance-on-cable-strippers/',
        date: '15 марта 2025',
        title: 'WISH выпускает руководство по использованию кабельных стрипперов',
        text: 'Руководство было опубликовано в рамках серии листов, охватывающих конкретные виды оборудования, используемого на заводах по переработке отходов.'
    },
    {
        id: 16,
        imgPath: '/news/',
        urlPath: 'https://www.epa.gov/plastics/impacts-plastic-pollution',
        date: '23 апреля 2024',
        title: 'Последствия загрязнения пластиком',
        text: 'Пластиковое загрязнение стало повсеместным в естественной и искусственной среде, вызывая опасения относительно потенциального вреда для людей и природы.'
    },

]
const slogStyle = 'absolute z-10 font-bold right-1/4 top-24 text-right w-[400px] text-white leading-[4rem]'

export {
    statusTitle, daysNames, recycledWastes, REG_EXPR_WEBSITES,
    workingDays, defaultStartTime, defaultEndTime, REG_EXPR_EMAIL, REG_EXPR_PHONE,
    workingDaysDB, accountTabs, internalTabOptionStates,
    advertStatuses, statusColors, statusColorsFlowBite,
    widthInputAdvertForm,
    getParamsToFetchAdverts, advertTableHeaders, responseTableHeaders,
    paginationOptions,
    showUserAdverts, showOthersAdverts, showUserResponses, showOthersResponses,
    tabsTitles, tabsIcons, modalName,
    initialPagination,
    accountMapTabsTitles, accountMapTabsIcons,
    accountMapModes,
    itemsCheckUpdateUser, statsData, carouselImages, slogan,
    wasteArticles, slogStyle
}