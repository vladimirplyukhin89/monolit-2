export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly number: string;
}

export interface SecondaryNavItem {
  readonly label: string;
  readonly href: string;
}

export type SocialId = 'telegram' | 'whatsapp' | 'vk';

export interface SocialLink {
  readonly id: SocialId;
  readonly label: string;
  readonly href: string;
}

export interface ScheduleRow {
  readonly days: string;
  readonly hours: string;
}

export interface LegalLink {
  readonly label: string;
  readonly href: string;
}

export interface SiteConfig {
  readonly brandName: string;
  readonly brandSubtitle: string;
  readonly regionMeta: string;
  readonly defaultTitle: string;
  readonly defaultDescription: string;
  readonly phoneDisplay: string;
  readonly phoneHref: string;
  readonly email: string;
  readonly address: string;
  readonly schedule: readonly ScheduleRow[];
  readonly mapEmbedUrl: string;
  readonly mapExternalUrl: string;
  readonly legalLinks: readonly LegalLink[];
}

export type PageSwitchId = 'hub' | 'repair' | 'landscaping';

export interface PageSwitchItem {
  readonly id: PageSwitchId;
  readonly label: string;
  readonly shortLabel: string;
  readonly href: string;
  readonly description: string;
}

export interface HubDirectionCard {
  readonly id: 'remont' | 'blagoustrojstvo';
  readonly href: string;
  readonly eyebrow: string;
  readonly titlePrefix: string;
  readonly titleAccent: string;
  readonly subtitle: string;
  readonly actionLabel: string;
  readonly imagePath: string;
  readonly imageAlt: string;
}

export interface HubConfig {
  readonly title: string;
  readonly description: string;
  readonly subtitle: string;
  readonly phoneDisplay: string;
  readonly phoneHref: string;
  readonly address: string;
  readonly keyFact: string;
  readonly requisites: string;
  readonly privacyLink: LegalLink;
  readonly messengers: readonly {
    readonly id: 'telegram' | 'max';
    readonly label: string;
    readonly shortLabel: string;
    readonly href: string;
  }[];
  readonly cards: readonly HubDirectionCard[];
}

export const DIRECTION_PAGES: readonly PageSwitchItem[] = [
  {
    id: 'hub',
    label: 'Главная',
    shortLabel: 'Главная',
    href: '/',
    description: 'Выбор направления компании МОНОЛИТ',
  },
  {
    id: 'repair',
    label: 'Ремонт квартир',
    shortLabel: 'Ремонт',
    href: '/remont',
    description: 'Дизайн-проекты и комплексный ремонт квартир под ключ',
  },
  {
    id: 'landscaping',
    label: 'Благоустройство',
    shortLabel: 'Благоустройство',
    href: '/blagoustrojstvo',
    description: 'Асфальтирование, брусчатка, отмостка и дренаж участков',
  },
] as const;

export const MAIN_NAV_ITEMS: readonly NavItem[] = [
  { label: 'Цены и услуги', href: '/remont#services', number: '01' },
  { label: 'Портфолио', href: '/remont#portfolio', number: '02' },
  { label: 'До / После', href: '/remont#before-after', number: '03' },
  { label: 'Вопросы', href: '/remont#faq', number: '04' },
  { label: 'Калькулятор', href: '/remont#quiz', number: '05' },
  { label: 'Контакты', href: '/remont#contacts', number: '06' },
] as const;

export const SECONDARY_NAV_ITEMS: readonly SecondaryNavItem[] = [
  { label: 'Цены и услуги', href: '/remont#services' },
  { label: 'Портфолио объектов', href: '/remont#portfolio' },
  { label: 'Калькулятор сметы', href: '/remont#quiz' },
  { label: 'Частые вопросы', href: '/remont#faq' },
  { label: 'Обсудить проект', href: '/remont#contact-form' },
] as const;

export const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    id: 'telegram',
    label: 'Написать в Telegram',
    href: 'https://t.me/monolit_tyumen',
  },
  {
    id: 'whatsapp',
    label: 'Написать в WhatsApp',
    href: 'https://wa.me/73452000000',
  },
  {
    id: 'vk',
    label: 'Сообщество ВКонтакте',
    href: 'https://vk.com/monolit_tyumen',
  },
] as const;

export const HUB_CONFIG: HubConfig = {
  title: 'МОНОЛИТ — Ремонт квартир под ключ и благоустройство участков в Тюмени',
  description:
    'Два ключевых направления компании МОНОЛИТ в Тюмени с 2021 года: комплексный ремонт квартир с дизайн-проектом и благоустройство загородных участков под ключ.',
  subtitle: 'Тюмень · С 2021 года',
  phoneDisplay: '8 (919) 950-77-22',
  phoneHref: 'tel:+79199507722',
  address: 'г. Тюмень, ул. Депутатская, 129',
  keyFact: 'Более 300 сданных объектов',
  requisites: 'ИП Ерамасов В.Н. · ИНН 723011554086 · ОГРНИП 323723200019722',
  privacyLink: {
    label: 'Политика обработки ПД',
    href: '/privacy',
  },
  messengers: [
    {
      id: 'telegram',
      label: 'Написать в Telegram',
      shortLabel: 'Telegram',
      href: 'https://t.me/+79199507722',
    },
    {
      id: 'max',
      label: 'Написать в Max',
      shortLabel: 'Max',
      href: 'https://max.ru',
    },
  ],
  cards: [
    {
      id: 'remont',
      href: '/remont',
      eyebrow: '01 · Интерьеры',
      titlePrefix: 'Ремонт квартир ',
      titleAccent: 'под\u00A0ключ',
      subtitle:
        'Дизайн-проект, инженерия и чистовая отделка с фиксированной сметой.',
      actionLabel: 'Перейти к ремонту',
      imagePath: 'hub/remont-card',
      imageAlt:
        'Современный интерьер квартиры после комплексного ремонта под ключ в Тюмени',
    },
    {
      id: 'blagoustrojstvo',
      href: '/blagoustrojstvo',
      eyebrow: '02 · Территория',
      titlePrefix: 'Благоустройство ',
      titleAccent: 'участков',
      subtitle:
        'Брусчатка, асфальтирование, отмостки и дренаж от прямых производителей.',
      actionLabel: 'Перейти к благоустройству',
      imagePath: 'hub/landscaping-card',
      imageAlt:
        'Благоустроенный загородный участок с брусчаткой, отмосткой и газоном в Тюмени',
    },
  ],
} as const;

export const SITE_CONFIG: SiteConfig = {
  brandName: 'МОНОЛИТ',
  brandSubtitle: 'Дизайн и ремонт под ключ',
  regionMeta: 'Тюмень · Сезон 2026',
  defaultTitle: 'МОНОЛИТ — Дизайн-проекты и ремонт квартир под ключ в Тюмени',
  defaultDescription:
    'Один договор, одна смета и одна команда для комплексного ремонта и дизайн-проектов квартир и домов под ключ в Тюмени. Фиксированная стоимость и гарантия 2 года.',
  phoneDisplay: '+7 (3452) 55-40-90',
  phoneHref: 'tel:+73452554090',
  email: 'hello@monolit-tmn.ru',
  address: 'г. Тюмень, ул. Республики, д. 65, офис 402',
  schedule: [
    { days: 'Пн — Пт', hours: '09:00 — 19:00' },
    { days: 'Суббота', hours: '10:00 — 16:00' },
    { days: 'Воскресенье', hours: 'По записи' },
  ],
  mapEmbedUrl:
    'https://yandex.ru/map-widget/v1/?ll=65.534328%2C57.152985&z=15&pt=65.534328,57.152985,pm2orgm',
  mapExternalUrl: 'https://yandex.ru/maps/?ll=65.534328%2C57.152985&z=16',
  legalLinks: [
    { label: 'Политика конфиденциальности', href: '/privacy' },
    { label: 'Согласие на обработку ПД', href: '/personal-data' },
  ],
} as const;
