export type ServiceTypeId = 'repair' | 'design' | 'package';

export type PropertyTypeId =
  | 'new-building'
  | 'secondary'
  | 'house'
  | 'commercial';

export type UtilitiesStateId = 'full-replace' | 'partial' | 'ready';

export type DesignStatusId = 'has-project' | 'need-project' | 'no-project';

export type RepairTierId = 'standard' | 'comfort' | 'premium';

export type DesignScopeId = 'technical' | 'full' | 'full-supervision';

export type ContactChannelId = 'phone' | 'telegram' | 'whatsapp';

export type QuizStepId =
  | 'service'
  | 'property'
  | 'utilities'
  | 'designStatus'
  | 'repairTier'
  | 'designScope'
  | 'area';

export interface QuizOption<T extends string = string> {
  readonly id: T;
  readonly code: string;
  readonly label: string;
  readonly description: string;
  readonly meta?: string;
}

export interface QuizAnswers {
  readonly service: ServiceTypeId | null;
  readonly property: PropertyTypeId | null;
  readonly utilities: UtilitiesStateId | null;
  readonly designStatus: DesignStatusId | null;
  readonly repairTier: RepairTierId | null;
  readonly designScope: DesignScopeId | null;
  readonly area: number;
}

export interface QuizStepDefinition {
  readonly id: QuizStepId;
  readonly shortLabel: string;
  readonly title: string;
  readonly titleAccent: string;
  readonly subtitle: string;
}

export interface QuizEstimate {
  readonly ratePerSqm: number;
  readonly totalMin: number;
  readonly totalMax: number;
  readonly timelineLabel: string;
  readonly headlineNote: string;
  readonly includedHighlights: readonly string[];
}

export const AREA_MIN = 20;
export const AREA_MAX = 320;
export const AREA_DEFAULT = 68;
export const AREA_PRESETS: readonly number[] = [40, 65, 85, 120, 180] as const;

export const INITIAL_QUIZ_ANSWERS: QuizAnswers = {
  service: null,
  property: null,
  utilities: null,
  designStatus: null,
  repairTier: null,
  designScope: null,
  area: AREA_DEFAULT,
};

export const SERVICE_OPTIONS: readonly QuizOption<ServiceTypeId>[] = [
  {
    id: 'repair',
    code: '01',
    label: 'Ремонт под ключ',
    description:
      'Комплексная черновая и чистовая отделка, инженерия и сдача готового объекта.',
    meta: 'от 15 000 ₽/м²',
  },
  {
    id: 'design',
    code: '02',
    label: 'Дизайн-проект интерьера',
    description:
      'Планировочные решения, 3D-визуализация и полный комплект рабочих чертежей.',
    meta: 'от 1 000 ₽/м²',
  },
  {
    id: 'package',
    code: '03',
    label: 'Пакет «Всё включено»',
    description:
      'Дизайн-проект, ремонт, все материалы, авторский надзор и кухня по проекту.',
    meta: 'от 40 000 ₽/м²',
  },
] as const;

export const PROPERTY_OPTIONS: readonly QuizOption<PropertyTypeId>[] = [
  {
    id: 'new-building',
    code: '01',
    label: 'Новостройка',
    description: 'Черновая отделка от застройщика или предчистовой white box.',
  },
  {
    id: 'secondary',
    code: '02',
    label: 'Вторичный фонд',
    description: 'Жилая квартира с необходимостью демонтажа прежней отделки.',
  },
  {
    id: 'house',
    code: '03',
    label: 'Частный дом или коттедж',
    description: 'Загородный дом или таунхаус с расширенной инженерной частью.',
  },
  {
    id: 'commercial',
    code: '04',
    label: 'Коммерческое помещение',
    description: 'Офис, студия, салон или камерное клиентское пространство.',
  },
] as const;

export const UTILITIES_OPTIONS: readonly QuizOption<UtilitiesStateId>[] = [
  {
    id: 'full-replace',
    code: '01',
    label: 'Полная разводка с нуля',
    description:
      'Новая электрика, сборка щита, коллекторный узел сантехники и защита от протечек.',
  },
  {
    id: 'partial',
    code: '02',
    label: 'Частичная доработка сетей',
    description:
      'Перенос отдельных точек, добавление сценариев света и локальных тёплых полов.',
  },
  {
    id: 'ready',
    code: '03',
    label: 'Сети готовы, замена не нужна',
    description:
      'Сохраняем существующую разводку электрики и водоснабжения без переделок.',
  },
] as const;

export const DESIGN_STATUS_OPTIONS: readonly QuizOption<DesignStatusId>[] = [
  {
    id: 'has-project',
    code: '01',
    label: 'Есть готовый дизайн-проект',
    description:
      'Проведём технический аудит ваших чертежей и подготовим точную смету.',
  },
  {
    id: 'need-project',
    code: '02',
    label: 'Нужен дизайн-проект',
    description:
      'Разработаем планировку, визуализации и рабочую документацию в нашей студии.',
    meta: '+ от 1 500 ₽/м²',
  },
  {
    id: 'no-project',
    code: '03',
    label: 'Ремонт без дизайн-проекта',
    description:
      'Соберём подробное техническое задание и расстановку точек вместе с инженером.',
  },
] as const;

export const REPAIR_TIER_OPTIONS: readonly QuizOption<RepairTierId>[] = [
  {
    id: 'standard',
    code: '01',
    label: 'Базовый / Стандарт',
    description:
      'Аккуратная современная отделка, ровная геометрия и практичные материалы.',
    meta: 'от 15 000 ₽/м²',
  },
  {
    id: 'comfort',
    code: '02',
    label: 'Комфорт / По дизайн-проекту',
    description:
      'Скрытые двери, теневые профили, сложный свет и точная стыковка покрытий.',
    meta: 'от 20 000 ₽/м²',
  },
  {
    id: 'premium',
    code: '03',
    label: 'Премиальный / Авторский',
    description:
      'Натуральный камень, шпон, индивидуальные узлы, климат-контроль и умный дом.',
    meta: 'от 28 000 ₽/м²',
  },
] as const;

export const DESIGN_SCOPE_OPTIONS: readonly QuizOption<DesignScopeId>[] = [
  {
    id: 'technical',
    code: '01',
    label: 'Технический проект',
    description:
      'Обмеры, эргономичная планировка и полный комплект строительных чертежей.',
    meta: 'от 1 000 ₽/м²',
  },
  {
    id: 'full',
    code: '02',
    label: 'Полный дизайн-проект',
    description:
      'Планировка, фотореалистичная 3D-визуализация, чертежи и ведомость материалов.',
    meta: 'от 1 800 ₽/м²',
  },
  {
    id: 'full-supervision',
    code: '03',
    label: 'Полный проект + авторский надзор',
    description:
      'Все разделы проекта, подбор комплектации и контроль реализации на стройке.',
    meta: 'от 2 500 ₽/м²',
  },
] as const;

export const CONTACT_CHANNEL_OPTIONS: readonly {
  readonly id: ContactChannelId;
  readonly label: string;
}[] = [
  { id: 'phone', label: 'Звонок' },
  { id: 'telegram', label: 'Telegram' },
  { id: 'whatsapp', label: 'WhatsApp' },
] as const;

const STEP_DEFINITIONS: Record<QuizStepId, QuizStepDefinition> = {
  service: {
    id: 'service',
    shortLabel: 'Услуга',
    title: 'Какую задачу вы планируете ',
    titleAccent: 'решить?',
    subtitle:
      'Выберите направление — калькулятор подстроит следующие вопросы под ваш сценарий.',
  },
  property: {
    id: 'property',
    shortLabel: 'Объект',
    title: 'Укажите тип вашей ',
    titleAccent: 'недвижимости',
    subtitle:
      'От формата объекта зависят состав подготовительных работ и требования к инженерии.',
  },
  utilities: {
    id: 'utilities',
    shortLabel: 'Сети',
    title: 'В каком состоянии ',
    titleAccent: 'инженерные сети?',
    subtitle:
      'Оцените объём работ по электрике, водоснабжению, канализации и отоплению.',
  },
  designStatus: {
    id: 'designStatus',
    shortLabel: 'Проект',
    title: 'Есть ли у вас готовый ',
    titleAccent: 'дизайн-проект?',
    subtitle:
      'Мы реализуем как собственные проекты, так и рабочие чертежи сторонних студий.',
  },
  repairTier: {
    id: 'repairTier',
    shortLabel: 'Уровень',
    title: 'Какой уровень отделки ',
    titleAccent: 'вам близок?',
    subtitle:
      'Выберите ориентир по сложности узлов, геометрии и классу интерьерных решений.',
  },
  designScope: {
    id: 'designScope',
    shortLabel: 'Состав',
    title: 'Выберите формат ',
    titleAccent: 'дизайн-проекта',
    subtitle:
      'Подберём оптимальную глубину проработки: от технических чертежей до авторского надзора.',
  },
  area: {
    id: 'area',
    shortLabel: 'Площадь',
    title: 'Укажите ориентировочную ',
    titleAccent: 'площадь объекта',
    subtitle:
      'Можно указать приблизительное значение — точные лазерные замеры выполним бесплатно.',
  },
};

/**
 * Логика ветвления шагов калькулятора в зависимости от выбранного типа услуги:
 * - repair: service -> property -> utilities -> designStatus -> repairTier -> area (6 шагов)
 * - design: service -> property -> designScope -> area (4 шага)
 * - package: service -> property -> utilities -> area (4 шага)
 */
export function getStepsForService(
  service: ServiceTypeId | null,
): readonly QuizStepDefinition[] {
  const stepIds: readonly QuizStepId[] =
    service === 'design'
      ? ['service', 'property', 'designScope', 'area']
      : service === 'package'
        ? ['service', 'property', 'utilities', 'area']
        : [
            'service',
            'property',
            'utilities',
            'designStatus',
            'repairTier',
            'area',
          ];

  return stepIds.map((id) => STEP_DEFINITIONS[id]);
}

export function getOptionLabel<T extends string>(
  options: readonly QuizOption<T>[],
  value: T | null,
): string | null {
  if (!value) {
    return null;
  }
  return options.find((item) => item.id === value)?.label ?? null;
}

export function formatRubles(value: number): string {
  return `${Math.round(value).toLocaleString('ru-RU')} ₽`;
}

export function calculateQuizEstimate(answers: QuizAnswers): QuizEstimate {
  const area = Math.min(AREA_MAX, Math.max(AREA_MIN, Math.round(answers.area)));
  const service = answers.service ?? 'repair';

  if (service === 'design') {
    const scopeRates: Record<DesignScopeId, number> = {
      technical: 1000,
      full: 1800,
      'full-supervision': 2500,
    };

    const propertyFactor: Record<PropertyTypeId, number> = {
      'new-building': 1,
      secondary: 1.05,
      house: 1.15,
      commercial: 1.1,
    };

    const baseRate = scopeRates[answers.designScope ?? 'full'];
    const factor = propertyFactor[answers.property ?? 'new-building'];
    const ratePerSqm = Math.round((baseRate * factor) / 100) * 100;
    const totalMin = ratePerSqm * area;
    const totalMax = Math.round((totalMin * 1.12) / 1000) * 1000;

    const timelineLabel =
      answers.designScope === 'technical'
        ? area > 110
          ? '20–30 дней'
          : '14–21 день'
        : area > 110
          ? '45–60 дней'
          : '30–45 дней';

    return {
      ratePerSqm,
      totalMin,
      totalMax,
      timelineLabel,
      headlineNote:
        'Ориентировочная ставка за разработку проектной документации. Точный состав разделов согласуем на встрече.',
      includedHighlights: [
        'Лазерный обмер и 2–3 варианта планировки',
        'Рабочие чертежи электрики, сантехники и света',
        'Предварительная оценка бюджета на реализацию',
      ],
    };
  }

  if (service === 'package') {
    let ratePerSqm = 40000;

    if (answers.property === 'secondary') {
      ratePerSqm += 2500;
    } else if (answers.property === 'house') {
      ratePerSqm += 3500;
    }

    if (answers.utilities === 'ready') {
      ratePerSqm = Math.max(38000, ratePerSqm - 1500);
    } else if (answers.utilities === 'full-replace' && answers.property === 'secondary') {
      ratePerSqm += 1500;
    }

    const totalMin = ratePerSqm * area;
    const totalMax = Math.round((totalMin * 1.08) / 10000) * 10000;
    const timelineLabel =
      area <= 55
        ? '3–3,5 месяца'
        : area <= 95
          ? '3,5–4,5 месяца'
          : '5–6 месяцев';

    return {
      ratePerSqm,
      totalMin,
      totalMax,
      timelineLabel,
      headlineNote:
        'Формат «Всё включено» с фиксированной ценой: дизайн-проект, работы, материалы, надзор и кухонный гарнитур.',
      includedHighlights: [
        'Дизайн-проект, авторский и технический надзор',
        'Черновые и чистовые материалы, сантехника, потолки',
        'Кухонный гарнитур по проекту в подарок',
      ],
    };
  }

  // Ветка «Ремонт под ключ»
  const tierBaseRates: Record<RepairTierId, number> = {
    standard: 15000,
    comfort: 20000,
    premium: 28000,
  };

  let ratePerSqm = tierBaseRates[answers.repairTier ?? 'standard'];

  if (answers.property === 'secondary') {
    ratePerSqm += 2000;
  } else if (answers.property === 'house') {
    ratePerSqm += 2500;
  } else if (answers.property === 'commercial') {
    ratePerSqm += 1500;
  }

  if (answers.utilities === 'full-replace') {
    ratePerSqm += 2000;
  } else if (answers.utilities === 'partial') {
    ratePerSqm += 1000;
  }

  if (answers.designStatus === 'need-project') {
    ratePerSqm += 1500;
  }

  const totalMin = ratePerSqm * area;
  const totalMax = Math.round((totalMin * 1.15) / 10000) * 10000;

  const timelineLabel =
    area <= 50
      ? '2,5–3 месяца'
      : area <= 90
        ? '3–4 месяца'
        : area <= 140
          ? '4–5,5 месяцев'
          : 'от 6 месяцев';

  return {
    ratePerSqm,
    totalMin,
    totalMax,
    timelineLabel,
    headlineNote:
      'Ориентировочная стоимость комплекса работ. Точную смету с фиксацией цены подготовим за 24 часа после замера.',
    includedHighlights: [
      'Фиксированная смета и график работ в договоре',
      'Неустойка за срыв сроков и гарантия 2 года',
      'Поэтапная оплата после личной приёмки узлов',
    ],
  };
}
