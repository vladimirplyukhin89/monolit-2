export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly number: string;
}

export interface SecondaryNavItem {
  readonly label: string;
  readonly href: string;
}

export type MessengerId = 'telegram' | 'max';

export interface MessengerLink {
  readonly id: MessengerId;
  readonly label: string;
  readonly shortLabel: string;
  readonly href: string;
}

export type SocialChannelId = 'phone' | 'email' | 'telegram' | 'max' | 'vk';

export interface SocialLinkItem {
  readonly id: SocialChannelId;
  readonly href: string;
  readonly ariaLabel: string;
  readonly title?: string;
  readonly external?: boolean;
}

export interface CompanySocialLinksConfig {
  readonly phoneHref: string;
  readonly emailHref: string;
  readonly telegramHref: string;
  readonly maxHref?: string;
  readonly vkHref?: string;
}

export interface ScheduleRow {
  readonly days: string;
  readonly hours: string;
}

export interface LegalLink {
  readonly label: string;
  readonly href: string;
}

export interface CompanyContacts {
  readonly brandName: string;
  readonly phoneDisplay: string;
  readonly phoneHref: string;
  readonly email: string;
  readonly emailHref: string;
  readonly address: string;
  readonly requisites: string;
  readonly schedule: readonly ScheduleRow[];
  readonly scheduleNote: string;
  readonly mapEmbedUrl: string;
  readonly mapExternalUrl: string;
  readonly messengers: readonly MessengerLink[];
  readonly socialLinks: CompanySocialLinksConfig;
}

export interface SiteConfig extends CompanyContacts {
  readonly brandSubtitle: string;
  readonly regionMeta: string;
  readonly defaultTitle: string;
  readonly defaultDescription: string;
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
  readonly email: string;
  readonly emailHref: string;
  readonly address: string;
  readonly keyFact: string;
  readonly requisites: string;
  readonly privacyLink: LegalLink;
  readonly messengers: readonly MessengerLink[];
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

export const MESSENGER_LINKS: readonly MessengerLink[] = [
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
] as const;

export const COMPANY_SOCIAL_LINKS: CompanySocialLinksConfig = {
  phoneHref: 'tel:+79199507722',
  emailHref: 'mailto:monolittmn@mail.ru',
  telegramHref: 'https://t.me/+79199507722',
  maxHref: 'https://max.ru',
  vkHref: undefined,
} as const;

export const COMPANY_CONTACTS: CompanyContacts = {
  brandName: 'МОНОЛИТ',
  phoneDisplay: '8 (919) 950-77-22',
  phoneHref: COMPANY_SOCIAL_LINKS.phoneHref,
  email: 'monolittmn@mail.ru',
  emailHref: COMPANY_SOCIAL_LINKS.emailHref,
  address: 'г. Тюмень, ул. Депутатская, 129',
  requisites: 'ИП Ерамасов В.Н. · ИНН 723011554086 · ОГРНИП 323723200019722',
  schedule: [
    { days: 'Пн — Пт', hours: '08:00 — 20:00' },
    { days: 'Суббота', hours: '09:00 — 18:00' },
    { days: 'Воскресенье', hours: 'Выезд по записи' },
  ],
  scheduleNote: 'Пн — Пт: 08:00 — 20:00 · Сб: 09:00 — 18:00',
  mapEmbedUrl:
    'https://yandex.ru/map-widget/v1/?ll=65.548027%2C57.122166&z=16&pt=65.548027%2C57.122166%2Cpm2orm',
  mapExternalUrl: 'https://yandex.ru/maps/?pt=65.548027,57.122166&z=16&l=map',
  messengers: MESSENGER_LINKS,
  socialLinks: COMPANY_SOCIAL_LINKS,
} as const;

export const HUB_CONFIG: HubConfig = {
  title: 'МОНОЛИТ — Ремонт квартир под ключ и благоустройство участков в Тюмени',
  description:
    'Два ключевых направления компании МОНОЛИТ в Тюмени с 2021 года: комплексный ремонт квартир с дизайн-проектом и благоустройство загородных участков под ключ.',
  subtitle: 'Тюмень · С 2021 года',
  phoneDisplay: COMPANY_CONTACTS.phoneDisplay,
  phoneHref: COMPANY_CONTACTS.phoneHref,
  email: COMPANY_CONTACTS.email,
  emailHref: COMPANY_CONTACTS.emailHref,
  address: COMPANY_CONTACTS.address,
  keyFact: 'Более 300 сданных объектов',
  requisites: COMPANY_CONTACTS.requisites,
  privacyLink: {
    label: 'Политика обработки ПД',
    href: '/privacy',
  },
  messengers: COMPANY_CONTACTS.messengers,
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
  ...COMPANY_CONTACTS,
  brandSubtitle: 'Дизайн и ремонт под ключ',
  regionMeta: 'Тюмень · Сезон 2026',
  defaultTitle: 'МОНОЛИТ — Дизайн-проекты и ремонт квартир под ключ в Тюмени',
  defaultDescription:
    'Один договор, одна смета и одна команда для комплексного ремонта и дизайн-проектов квартир и домов под ключ в Тюмени. Фиксированная стоимость и гарантия 2 года.',
  legalLinks: [
    { label: 'Политика конфиденциальности', href: '/privacy' },
    { label: 'Согласие на обработку ПД', href: '/personal-data' },
  ],
} as const;
