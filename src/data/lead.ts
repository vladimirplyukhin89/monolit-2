export type ConsultationTopicId =
  | 'repair'
  | 'design'
  | 'package'
  | 'estimate'
  | 'supervision'
  | 'asphalt'
  | 'paving'
  | 'blind-area'
  | 'complex'
  | 'visit-discount';

export type PreferredContactChannelId =
  | 'phone'
  | 'telegram'
  | 'max'
  | 'meeting';

export interface ConsultationTopicOption {
  readonly id: ConsultationTopicId;
  readonly number: string;
  readonly label: string;
  readonly hint: string;
}

export interface PreferredContactChannelOption {
  readonly id: PreferredContactChannelId;
  readonly label: string;
  readonly hint: string;
}

export interface LeadModalPreset {
  readonly eyebrow: string;
  readonly titlePrefix: string;
  readonly titleAccent: string;
  readonly subtitle: string;
  readonly submitLabel: string;
  readonly defaultTopic?: ConsultationTopicId;
  readonly showQuizLink?: boolean;
}

export const CONSULTATION_TOPICS: readonly ConsultationTopicOption[] = [
  {
    id: 'repair',
    number: '01',
    label: 'Ремонт под ключ',
    hint: 'Новостройка, вторичка или дом',
  },
  {
    id: 'design',
    number: '02',
    label: 'Дизайн-проект',
    hint: 'Планировка, 3D и рабочие чертежи',
  },
  {
    id: 'package',
    number: '03',
    label: 'Пакет «Всё включено»',
    hint: 'Фиксированная ставка 40 000 ₽/м²',
  },
  {
    id: 'estimate',
    number: '04',
    label: 'Замер и смета за 24 ч',
    hint: 'Бесплатный выезд инженера на объект',
  },
  {
    id: 'supervision',
    number: '05',
    label: 'Надзор и комплектация',
    hint: 'Контроль стройки и подбор материалов',
  },
] as const;

export const PREFERRED_CONTACT_CHANNELS: readonly PreferredContactChannelOption[] =
  [
    {
      id: 'phone',
      label: 'Звонок',
      hint: 'Перезвоним за 15 мин',
    },
    {
      id: 'telegram',
      label: 'Telegram',
      hint: 'Спокойно в чате',
    },
    {
      id: 'max',
      label: 'Max',
      hint: 'Быстро в мессенджере',
    },
    {
      id: 'meeting',
      label: 'Встреча в офисе',
      hint: 'Ул. Депутатская, 129',
    },
  ] as const;

export const CONSULTATION_STEPS = [
  {
    number: '01',
    text: 'Разберём задачу, планировку и ориентир бюджета в выбранном вами формате связи.',
  },
  {
    number: '02',
    text: 'При необходимости согласуем бесплатный выезд инженера для точных лазерных замеров.',
  },
  {
    number: '03',
    text: 'Подготовим детализированную смету и календарный график работ за 24 часа.',
  },
] as const;

export const LEAD_MODAL_PRESETS: Record<string, LeadModalPreset> = {
  'hub-header-cta': {
    eyebrow: 'МОНОЛИТ · Тюмень',
    titlePrefix: 'Начнём ',
    titleAccent: 'с\u00A0разговора',
    subtitle:
      'Подскажем по ремонту квартиры или благоустройству участка, сориентируем по бюджету и согласуем бесплатный выезд инженера.',
    submitLabel: 'Отправить заявку',
  },
  'header-cta': {
    eyebrow: 'Личная консультация',
    titlePrefix: 'Начнём ',
    titleAccent: 'с\u00A0разговора',
    subtitle:
      'Оставьте контакты и выберите удобный канал — ведущий инженер спокойно ответит на вопросы и сориентирует по срокам и бюджету.',
    submitLabel: 'Отправить заявку',
  },
  'mobile-cta': {
    eyebrow: 'Обсудить проект',
    titlePrefix: 'Начнём ',
    titleAccent: 'с\u00A0разговора',
    subtitle:
      'Расскажите коротко об объекте — свяжемся удобным для вас способом без навязчивых звонков.',
    submitLabel: 'Обсудить проект',
  },
  'hero-cta': {
    eyebrow: 'Расчёт сметы · 24 часа',
    titlePrefix: 'Рассчитаем ',
    titleAccent: 'ваш проект',
    subtitle:
      'Подготовим ориентир по стоимости и срокам под вашу планировку, а при необходимости организуем бесплатный выезд инженера на объект.',
    submitLabel: 'Получить расчёт сметы',
    defaultTopic: 'estimate',
    showQuizLink: true,
  },
  'services-offer': {
    eyebrow: 'Специальные условия · −5%',
    titlePrefix: 'Запись на ',
    titleAccent: 'бесплатный выезд',
    subtitle:
      'Инженер выполнит лазерные замеры, подготовит прозрачную смету за 24 часа и закрепит скидку 5% на комплекс работ на 14 дней.',
    submitLabel: 'Записаться на выезд',
    defaultTopic: 'estimate',
  },
  'portfolio-want-same': {
    eyebrow: 'Ориентир из портфолио',
    titlePrefix: 'Смета в стиле ',
    titleAccent: 'выбранного проекта',
    subtitle:
      'Рассчитаем стоимость и сроки реализации похожего решения для вашей квартиры с учётом площади и инженерных особенностей.',
    submitLabel: 'Рассчитать под мой объект',
    defaultTopic: 'repair',
  },
  'footer-cta': {
    eyebrow: 'Диалог со студией',
    titlePrefix: 'Начнём ',
    titleAccent: 'с\u00A0разговора',
    subtitle:
      'Ответим в течение 15 минут в рабочее время, обсудим ваш объект и предложим понятный план действий.',
    submitLabel: 'Отправить заявку',
  },
  'landscaping-header-cta': {
    eyebrow: 'Благоустройство · Консультация',
    titlePrefix: 'Обсудим ',
    titleAccent: 'ваш участок',
    subtitle:
      'Оставьте контакты — инженер по благоустройству спокойно сориентирует по технологии, срокам и стоимости работ в Тюмени и области.',
    submitLabel: 'Заказать консультацию',
  },
  'landscaping-hero-cta': {
    eyebrow: 'Бесплатный выезд инженера',
    titlePrefix: 'Рассчитаем ',
    titleAccent: 'благоустройство',
    subtitle:
      'Приедем на участок с нивелиром, оценим грунты и уклоны, подготовим детализированную смету с прямыми ценами на материалы.',
    submitLabel: 'Получить расчёт сметы',
    defaultTopic: 'visit-discount',
  },
  'landscaping-offer': {
    eyebrow: 'Специальные условия · −5%',
    titlePrefix: 'Выезд на участок и ',
    titleAccent: 'скидка\u00A05%',
    subtitle:
      'Инженер выполнит точный замер участка бесплатно, подготовит прозрачную смету и закрепит скидку 5% на комплекс работ при заключении договора.',
    submitLabel: 'Закрепить скидку 5%',
    defaultTopic: 'visit-discount',
  },
  'landscaping-before-after': {
    eyebrow: 'Ориентир «До / После»',
    titlePrefix: 'Рассчитаем похожий ',
    titleAccent: 'проект участка',
    subtitle:
      'Подготовим смету и план работ под вашу площадь, тип грунта и желаемое покрытие — от дорожек и отмостки до комплексного благоустройства.',
    submitLabel: 'Рассчитать под мой участок',
    defaultTopic: 'complex',
  },
  'landscaping-gallery': {
    eyebrow: 'Ориентир из галереи работ',
    titlePrefix: 'Смета на похожее ',
    titleAccent: 'решение',
    subtitle:
      'Рассчитаем стоимость материалов и монтажа для вашего участка с учётом рельефа, нагрузки и прямых поставок с заводов.',
    submitLabel: 'Получить расчёт',
    defaultTopic: 'paving',
  },
  'landscaping-footer-cta': {
    eyebrow: 'Благоустройство · Монолит',
    titlePrefix: 'Начнём ',
    titleAccent: 'с\u00A0разговора',
    subtitle:
      'Свяжемся удобным способом в рабочее время, ответим на вопросы и согласуем бесплатный выезд специалиста на участок.',
    submitLabel: 'Отправить заявку',
  },
  'remont-service': {
    eyebrow: 'Ремонт · Выбранная услуга',
    titlePrefix: 'Заявка на ',
    titleAccent: 'выбранную услугу',
    subtitle:
      'Название услуги уже стоит в теме заявки. Оставьте контакты — инженер спокойно сориентирует по составу работ, срокам и бюджету.',
    submitLabel: 'Отправить заявку',
  },
  'landscaping-service': {
    eyebrow: 'Благоустройство · Выбранная услуга',
    titlePrefix: 'Заявка на ',
    titleAccent: 'выбранную услугу',
    subtitle:
      'Название услуги уже стоит в теме заявки. Оставьте контакты — специалист сориентирует по технологии, срокам и стоимости работ на участке.',
    submitLabel: 'Отправить заявку',
  },
};

export const DEFAULT_LEAD_MODAL_PRESET: LeadModalPreset =
  LEAD_MODAL_PRESETS['header-cta'];

export function getLeadModalPreset(source?: string): LeadModalPreset {
  if (!source) {
    return DEFAULT_LEAD_MODAL_PRESET;
  }
  return LEAD_MODAL_PRESETS[source] ?? DEFAULT_LEAD_MODAL_PRESET;
}

export function getConsultationTopicLabel(
  id: ConsultationTopicId,
  topics: readonly ConsultationTopicOption[] = CONSULTATION_TOPICS,
): string {
  return (
    topics.find((topic) => topic.id === id)?.label ??
    CONSULTATION_TOPICS.find((topic) => topic.id === id)?.label ??
    'Консультация'
  );
}

export function getPreferredChannelLabel(
  id: PreferredContactChannelId,
  channels: readonly PreferredContactChannelOption[] = PREFERRED_CONTACT_CHANNELS,
): string {
  const found =
    channels.find((channel) => channel.id === id) ??
    PREFERRED_CONTACT_CHANNELS.find((channel) => channel.id === id);

  return found?.label ?? 'Звонок';
}

export function validateLeadContact(
  name: string,
  phone: string,
  acceptPrivacy: boolean,
  acceptPersonalData: boolean,
): string | null {
  if (name.trim().length < 2) {
    return 'Пожалуйста, укажите ваше имя.';
  }

  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length < 10) {
    return 'Укажите корректный номер телефона (не менее 10 цифр).';
  }

  if (!acceptPrivacy || !acceptPersonalData) {
    return 'Для отправки заявки подтвердите согласие с политикой и обработкой персональных данных.';
  }

  return null;
}
