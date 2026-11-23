import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { FAQ_ITEMS, type FaqItem } from '../../data/faq';

export interface FaqAsideSpec {
  readonly label: string;
  readonly value: string;
}

export interface FaqAccordionProps {
  readonly items?: readonly FaqItem[];
  readonly defaultOpenId?: string | null;
  readonly asideBadge?: string;
  readonly asideQuote?: string;
  readonly asideDescription?: string;
  readonly asideSpecs?: readonly FaqAsideSpec[];
  readonly ctaLabel?: string;
  readonly ctaHref?: string;
  readonly ctaLeadTrigger?: string;
  readonly ctaNote?: string;
}

const DEFAULT_ASIDE_SPECS: readonly FaqAsideSpec[] = [
  { label: 'Смета', value: 'Фиксация за 24 часа' },
  { label: 'Оплата', value: 'По факту этапов' },
  { label: 'Гарантия', value: '2 года по договору' },
] as const;

export default function FaqAccordion({
  items = FAQ_ITEMS,
  defaultOpenId = items[0]?.id ?? null,
  asideBadge,
  asideQuote = 'Спокойный ремонт начинается с\u00A0ясных договорённостей до\u00A0старта работ.',
  asideDescription = 'Собрали честные ответы на вопросы о смете, сроках, закупках и приёмке этапов. Если у вас нестандартная планировка или особые требования — разберём их на консультации.',
  asideSpecs = DEFAULT_ASIDE_SPECS,
  ctaLabel = 'Рассчитать стоимость',
  ctaHref = '/#quiz',
  ctaLeadTrigger,
  ctaNote = 'Предварительный расчёт займёт меньше минуты',
}: FaqAccordionProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(defaultOpenId);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleToggle = (id: string): void => {
    setOpenId((current) => (current === id ? null : id));
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ): void => {
    if (items.length === 0) {
      return;
    }

    let nextIndex: number | null = null;

    switch (event.key) {
      case 'ArrowDown':
        nextIndex = (index + 1) % items.length;
        break;
      case 'ArrowUp':
        nextIndex = (index - 1 + items.length) % items.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = items.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    triggerRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
      {/* Левая статичная редакционная колонка: без hover-эффектов на контейнере */}
      <aside className="lg:col-span-4">
        <div className="cursor-default border border-border-subtle bg-bg-secondary p-6 sm:p-8 lg:sticky lg:top-28">
          <span className="inline-flex cursor-default items-center bg-accent-muted px-3 py-1.5 text-[11px] font-medium uppercase leading-none tracking-[0.18em] text-accent select-none">
            {asideBadge ?? `${items.length} ключевых ответов`}
          </span>

          <p className="mt-5 font-serif text-2xl italic leading-snug text-text-primary sm:text-[1.75rem]">
            {asideQuote}
          </p>

          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            {asideDescription}
          </p>

          <dl className="mt-6 space-y-3 border-t border-border-subtle pt-5 text-xs">
            {asideSpecs.map((spec) => (
              <div
                key={spec.label}
                className="flex items-baseline justify-between gap-4"
              >
                <dt className="uppercase tracking-[0.14em] text-text-muted">
                  {spec.label}
                </dt>
                <dd className="font-medium text-text-primary">{spec.value}</dd>
              </div>
            ))}
          </dl>

          {/* Кликабельна и имеет hover-эффект только кнопка внутри статичной карточки */}
          <div className="mt-7 border-t border-border-subtle pt-6">
            <a
              href={ctaHref}
              data-lead-trigger={ctaLeadTrigger}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-sm bg-accent px-6 py-3.5 text-sm font-medium text-text-primary transition-colors duration-[350ms] ease-[var(--ease-editorial)] hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary"
            >
              <span>{ctaLabel}</span>
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </a>
            <p className="mt-3 cursor-default text-center text-xs text-text-muted">
              {ctaNote}
            </p>
          </div>
        </div>
      </aside>

      {/* Правая колонка: список 10 вопросов с плавным раскрытием через CSS Grid (0fr -> 1fr) */}
      <div className="lg:col-span-8">
        <div className="divide-y divide-border-subtle border-y border-border-subtle">
          {items.map((item, index) => {
            const isOpen = openId === item.id;
            const triggerId = `${baseId}-trigger-${item.id}`;
            const panelId = `${baseId}-panel-${item.id}`;

            return (
              <div
                key={item.id}
                className={`transition-colors duration-[350ms] ease-[var(--ease-editorial)] ${
                  isOpen ? 'bg-bg-secondary' : 'bg-bg-primary'
                }`}
              >
                <h3 className="m-0">
                  <button
                    ref={(el) => {
                      triggerRefs.current[index] = el;
                    }}
                    id={triggerId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => handleToggle(item.id)}
                    onKeyDown={(event) => handleKeyDown(event, index)}
                    className="group flex w-full cursor-pointer items-start justify-between gap-4 px-4 py-6 text-left transition-colors duration-[300ms] ease-[var(--ease-editorial)] hover:bg-bg-elevated/65 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-accent sm:gap-6 sm:px-6 sm:py-7"
                  >
                    <span className="flex min-w-0 items-start gap-4 sm:gap-6">
                      <span
                        className={`mt-0.5 shrink-0 font-serif text-lg italic leading-none transition-colors duration-[300ms] ease-[var(--ease-editorial)] ${
                          isOpen
                            ? 'text-accent'
                            : 'text-text-muted group-hover:text-accent'
                        }`}
                        aria-hidden="true"
                      >
                        {item.number}
                      </span>

                      <span className="min-w-0">
                        <span className="block text-[11px] uppercase tracking-[0.18em] text-text-muted">
                          {item.category}
                        </span>
                        <span
                          className={`mt-2 block text-base font-normal leading-snug tracking-tight transition-colors duration-[300ms] ease-[var(--ease-editorial)] sm:text-lg ${
                            isOpen
                              ? 'text-text-primary'
                              : 'text-text-primary group-hover:text-accent'
                          }`}
                        >
                          {item.question}
                        </span>
                      </span>
                    </span>

                    {/* Индикатор раскрытия (+ / −) на чистом CSS */}
                    <span
                      aria-hidden="true"
                      className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border transition-colors duration-[300ms] ease-[var(--ease-editorial)] ${
                        isOpen
                          ? 'border-border-accent bg-accent-muted text-accent'
                          : 'border-border-subtle bg-bg-secondary text-text-secondary group-hover:border-border-accent group-hover:text-accent'
                      }`}
                    >
                      <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                        <span className="absolute h-px w-3.5 bg-current" />
                        <span
                          className={`absolute h-3.5 w-px bg-current transition-transform duration-[360ms] ease-[var(--ease-editorial)] motion-reduce:transition-none ${
                            isOpen ? 'scale-y-0 rotate-90' : 'scale-y-100 rotate-0'
                          }`}
                        />
                      </span>
                    </span>
                  </button>
                </h3>

                {/* Плавное раскрытие через CSS Grid: grid-template-rows: 0fr -> 1fr */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  data-open={isOpen ? 'true' : 'false'}
                  className="accordion-panel"
                >
                  <div className="accordion-inner">
                    <div
                      className={`cursor-default px-4 pb-6 pl-12 transition-opacity duration-[360ms] ease-[var(--ease-editorial)] motion-reduce:transition-none sm:px-6 sm:pb-7 sm:pl-16 ${
                        isOpen ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <p className="max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-[15px]">
                        {item.answer}
                      </p>

                      {item.highlight && (
                        <p className="mt-4 inline-flex items-center gap-2.5 border-l border-border-accent pl-3.5 text-xs leading-relaxed text-text-primary">
                          <span>{item.highlight}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
