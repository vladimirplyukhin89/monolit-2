export interface HeroUspItem {
  readonly number: string;
  readonly title: string;
  readonly description: string;
  readonly delayClass: string;
}

export interface HeroDirectionTag {
  readonly number: string;
  readonly label: string;
}

export interface ServiceItem {
  readonly number: string;
  readonly category: string;
  readonly title: string;
  readonly description: string;
  readonly deliverables: readonly string[];
  readonly priceLabel: string;
  readonly timelineLabel: string;
  readonly isFeatured?: boolean;
}

export interface OfferHighlight {
  readonly label: string;
}

export interface ServicesOfferData {
  readonly badge: string;
  readonly titlePrefix: string;
  readonly titleAccent: string;
  readonly description: string;
  readonly highlights: readonly OfferHighlight[];
  readonly ctaLabel: string;
  readonly ctaHref: string;
  readonly note: string;
}

export const HERO_DIRECTION_TAGS: readonly HeroDirectionTag[] = [
  { number: '01', label: 'Дизайн-проект' },
  { number: '02', label: 'Ремонт под ключ' },
  { number: '03', label: 'Авторский надзор' },
  { number: '04', label: 'Инженерные сети' },
  { number: '05', label: 'Комплектация объектов' },
] as const;

export const HERO_USP_ITEMS: readonly HeroUspItem[] = [
  {
    number: '01',
    title: 'Фиксированная смета за 24 часа',
    description:
      'Рассчитываем детальный бюджет до старта и закрепляем стоимость в договоре без скрытых доплат.',
    delayClass: 'reveal-delay-300',
  },
  {
    number: '02',
    title: 'Неустойка за срыв сроков',
    description:
      'Работаем по календарному графику и несём реальную финансовую ответственность за каждый день.',
    delayClass: 'reveal-delay-400',
  },
  {
    number: '03',
    title: 'Гарантия 2 года на все работы',
    description:
      'Официальная гарантия по договору на инженерные системы, черновую и чистовую отделку.',
    delayClass: 'reveal-delay-500',
  },
  {
    number: '04',
    title: 'Личная приёмка каждого этапа',
    description:
      'Руководитель и инженер технадзора проверяют качество узлов до закрытия акта и оплаты этапа.',
    delayClass: 'reveal-delay-600',
  },
] as const;

export const SERVICE_ITEMS: readonly ServiceItem[] = [
  {
    number: '01',
    category: 'Проектирование',
    title: 'Дизайн-проект интерьера',
    description:
      'Подробная инструкция по сборке будущего пространства: от эргономичной планировки до рабочих чертежей для строителей.',
    deliverables: [
      'Планировочное решение и зонирование',
      'Фотореалистичная 3D-визуализация',
      'Полный комплект рабочих чертежей и ведомостей',
    ],
    priceLabel: 'от 1 500 ₽/м²',
    timelineLabel: '30–45 дней',
  },
  {
    number: '02',
    category: 'Основное направление',
    title: 'Ремонт квартир под ключ',
    description:
      'Комплексная реализация в новостройках и вторичном фонде силами штатных мастеров с единым прорабом на объекте.',
    deliverables: [
      'Черновая и чистовая отделка по стандартам СНиП',
      'Закупка, доставка и разгрузка черновых материалов',
      'Генеральная уборка и сдача объекта под ключ',
    ],
    priceLabel: 'от 15 000 ₽/м²',
    timelineLabel: 'от 3 месяцев',
  },
  {
    number: '03',
    category: 'Готовое решение',
    title: 'Пакет «Всё включено»',
    description:
      'Фиксированный формат ремонта без погружения в закупки: все материалы, надзор и кухня уже входят в стоимость.',
    deliverables: [
      'Дизайн-проект, авторский надзор и все материалы',
      'Сантехника, освещение и натяжные потолки',
      'Кухонный гарнитур по проекту в подарок',
    ],
    priceLabel: '40 000 ₽/м²',
    timelineLabel: 'единая цена',
    isFeatured: true,
  },
  {
    number: '04',
    category: 'Инженерия',
    title: 'Инженерные системы',
    description:
      'Продуманная скрытая инфраструктура квартиры с запасом надёжности и аккуратной коллекторной разводкой.',
    deliverables: [
      'Электромонтаж, сборка щита и сценарии освещения',
      'Сантехника, инсталляции и защита от протечек',
      'Отопление, тёплые полы и кондиционирование',
    ],
    priceLabel: 'по смете',
    timelineLabel: 'по СНиП и ПУЭ',
  },
  {
    number: '05',
    category: 'Контроль',
    title: 'Авторский и технадзор',
    description:
      'Следим, чтобы готовый интерьер совпал с визуализацией до миллиметра, а скрытые узлы были выполнены безупречно.',
    deliverables: [
      'Регулярные выезды дизайнера и инженера на объект',
      'Еженедельные фото- и видеоотчёты в мессенджере',
      'Контроль сложных примыканий и стыков материалов',
    ],
    priceLabel: 'входит в пакет',
    timelineLabel: 'весь срок работ',
  },
  {
    number: '06',
    category: 'Снабжение',
    title: 'Комплектация и мебель',
    description:
      'Подбираем чистовые материалы, свет, двери и корпусную мебель напрямую у проверенных поставщиков под утверждённый бюджет.',
    deliverables: [
      'График поставок без простоев строительной бригады',
      'Передача партнёрских условий от поставщиков',
      'Проверка комплектности и качества при приёмке',
    ],
    priceLabel: 'под бюджет',
    timelineLabel: 'без наценок',
  },
] as const;

export const SERVICES_OFFER: ServicesOfferData = {
  badge: 'Специальные условия · −5%',
  titlePrefix: 'Бесплатный выезд инженера и ',
  titleAccent: 'скидка\u00A05% на\u00A0ремонт',
  description:
    'Специалист приедет на объект в удобное время, выполнит точные лазерные замеры и за 24 часа подготовит прозрачную смету. При заключении договора в течение 14 дней закрепим скидку 5% на комплекс работ.',
  highlights: [
    { label: 'Выезд и замер — 0 ₽' },
    { label: 'Детальная смета за 24 часа' },
    { label: 'Фиксация условий на 14 дней' },
  ],
  ctaLabel: 'Записаться на выезд',
  ctaHref: '/#contact-form',
  note: 'Ответим в течение 15 минут в рабочее время',
} as const;
