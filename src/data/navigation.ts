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

export interface PageSwitchItem {
  readonly id: 'repair' | 'landscaping';
  readonly label: string;
  readonly shortLabel: string;
  readonly href: string;
  readonly description: string;
}

export const DIRECTION_PAGES: readonly PageSwitchItem[] = [
  {
    id: 'repair',
    label: 'Ремонт квартир',
    shortLabel: 'Ремонт',
    href: '/',
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
  { label: 'Главная', href: '/#hero', number: '01' },
  { label: 'О компании', href: '/#about', number: '02' },
  { label: 'Цены и услуги', href: '/#services', number: '03' },
  { label: 'Отзывы', href: '/#reviews', number: '04' },
  { label: 'Портфолио', href: '/#portfolio', number: '05' },
  { label: 'Контакты', href: '/#contacts', number: '06' },
] as const;

export const SECONDARY_NAV_ITEMS: readonly SecondaryNavItem[] = [
  { label: 'Дизайн-проект', href: '/#design-project' },
  { label: 'Пакетное предложение', href: '/#package-offer' },
  { label: 'Калькулятор сметы', href: '/#quiz' },
  { label: 'Видео-обзоры', href: '/#video-reviews' },
  { label: 'Частые вопросы', href: '/#faq' },
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
