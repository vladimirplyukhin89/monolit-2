import { useCallback, useId, useState, type KeyboardEvent } from 'react';

export interface GallerySlideSpec {
  readonly label: string;
  readonly value: string;
}

export interface GallerySlide {
  readonly id: string;
  readonly imageSrc?: string;
  readonly imageAlt?: string;
  readonly title: string;
  readonly location?: string;
  readonly description: string;
  readonly specs?: readonly GallerySlideSpec[];
  readonly author?: string;
  readonly service?: string;
  readonly date?: string;
  readonly source?: string;
  readonly rating?: number;
  readonly resultNote?: string;
  readonly ctaLabel?: string;
  readonly leadSource?: string;
}

export interface GalleryTab {
  readonly id: string;
  readonly number: string;
  readonly label: string;
  readonly slides: readonly GallerySlide[];
}

export interface TabbedGalleryProps {
  readonly tabs: readonly GalleryTab[];
  readonly variant?: 'works' | 'reviews';
  readonly ariaLabel?: string;
  readonly ctaLabel?: string;
  readonly leadSource?: string;
}

function formatIndex(value: number): string {
  return String(value).padStart(2, '0');
}

export default function TabbedGallery({
  tabs,
  variant = 'works',
  ariaLabel = 'Галерея',
  ctaLabel = 'Рассчитать похожий объект',
  leadSource = 'landscaping-gallery',
}: TabbedGalleryProps) {
  const instanceId = useId();
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  const safeTabIndex =
    tabs.length > 0 ? Math.min(activeTabIndex, tabs.length - 1) : 0;
  const activeTab = tabs[safeTabIndex];
  const slides = activeTab?.slides ?? [];
  const totalSlides = slides.length;
  const safeSlideIndex =
    totalSlides > 0 ? Math.min(activeSlideIndex, totalSlides - 1) : 0;
  const currentSlide = slides[safeSlideIndex];

  const handleTabChange = useCallback((nextTabIndex: number) => {
    setActiveTabIndex(nextTabIndex);
    setActiveSlideIndex(0);
  }, []);

  const handlePrevSlide = useCallback(() => {
    if (totalSlides <= 1) {
      return;
    }
    setActiveSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const handleNextSlide = useCallback(() => {
    if (totalSlides <= 1) {
      return;
    }
    setActiveSlideIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handleRegionKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePrevSlide();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNextSlide();
      }
    },
    [handleNextSlide, handlePrevSlide],
  );

  if (!activeTab || !currentSlide) {
    return null;
  }

  const showTabs = tabs.length > 1;
  const panelId = `${instanceId}-panel-${activeTab.id}`;

  return (
    <div
      aria-label={ariaLabel}
      onKeyDown={handleRegionKeyDown}
      className="border border-border-subtle bg-bg-secondary"
    >
      {/* Верхняя панель: табы категорий (если их > 1) + сгруппированные стрелки и счётчик */}
      <div className="flex min-w-0 flex-col justify-between gap-4 border-b border-border-subtle bg-bg-elevated px-5 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        {showTabs ? (
          <div
            role="tablist"
            aria-label="Категории работ"
            className="flex w-full min-w-0 max-w-full snap-x snap-mandatory items-center gap-2 overflow-x-auto overscroll-x-contain pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden"
          >
            {tabs.map((tab, index) => {
              const isSelected = index === safeTabIndex;
              return (
                <button
                  key={tab.id}
                  id={`${instanceId}-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`${instanceId}-panel-${tab.id}`}
                  onClick={() => handleTabChange(index)}
                  className={`inline-flex min-h-11 shrink-0 snap-start cursor-pointer items-center gap-2 rounded-sm border px-3.5 py-2 text-xs font-medium transition-colors duration-[300ms] ease-[var(--ease-editorial)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent sm:px-4 sm:text-sm ${
                    isSelected
                      ? 'border-border-accent bg-accent-muted text-accent'
                      : 'border-border-subtle bg-bg-secondary text-text-secondary hover:border-border-accent hover:text-text-primary'
                  }`}
                >
                  <span
                    className="font-serif text-sm italic leading-none text-accent"
                    aria-hidden="true"
                  >
                    {tab.number}
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex cursor-default items-center gap-3">
            <span className="font-serif text-base italic leading-none text-accent">
              {activeTab.number}
            </span>
            <span className="h-3.5 w-px bg-border-subtle" aria-hidden="true" />
            <span className="text-xs uppercase tracking-[0.18em] text-text-muted">
              {activeTab.label}
            </span>
          </div>
        )}

        {/* Счётчик + сгруппированные рядом стрелки переключения (senior-ux-audit.md) */}
        <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
          <p
            aria-live="polite"
            className="cursor-default font-serif text-base italic tabular-nums text-text-secondary"
          >
            <span className="text-text-primary">
              {formatIndex(safeSlideIndex + 1)}
            </span>
            <span className="mx-1.5 text-text-muted">/</span>
            <span className="text-text-muted">{formatIndex(totalSlides)}</span>
          </p>

          <div
            role="group"
            aria-label="Переключение слайдов"
            className="inline-flex items-center gap-1.5"
          >
            <button
              type="button"
              onClick={handlePrevSlide}
              disabled={totalSlides <= 1}
              aria-label="Предыдущий слайд"
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-sm border border-border-subtle bg-bg-secondary text-text-primary transition-colors duration-[300ms] ease-[var(--ease-editorial)] hover:border-border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
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
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <button
              type="button"
              onClick={handleNextSlide}
              disabled={totalSlides <= 1}
              aria-label="Следующий слайд"
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-sm border border-border-subtle bg-bg-secondary text-text-primary transition-colors duration-[300ms] ease-[var(--ease-editorial)] hover:border-border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
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
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Тело слайда */}
      <div
        id={panelId}
        role={showTabs ? 'tabpanel' : undefined}
        aria-labelledby={
          showTabs ? `${instanceId}-tab-${activeTab.id}` : undefined
        }
      >
        {variant === 'works' ? (
          <div
            key={`${activeTab.id}-${currentSlide.id}`}
            className="animate-fade-in grid grid-cols-1 lg:grid-cols-12"
          >
            {/* Фотография объекта */}
            <div className="relative aspect-[16/11] overflow-hidden border-b border-border-subtle bg-bg-primary lg:col-span-7 lg:aspect-auto lg:min-h-[460px] lg:border-r lg:border-b-0">
              {currentSlide.imageSrc && (
                <img
                  src={currentSlide.imageSrc}
                  alt={currentSlide.imageAlt ?? currentSlide.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-center"
                />
              )}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-bg-primary/65 via-bg-primary/20 to-transparent"
              />
              <span className="pointer-events-none absolute top-4 left-4 inline-flex cursor-default items-center gap-2 border border-border-subtle bg-bg-primary/85 px-3 py-1.5 text-[11px] font-medium uppercase leading-none tracking-[0.18em] text-text-secondary backdrop-blur-sm select-none">
                <span
                  className="font-serif text-xs italic text-accent"
                  aria-hidden="true"
                >
                  {activeTab.number}
                </span>
                <span>{activeTab.label}</span>
              </span>
            </div>

            {/* Редакционная карточка описания работы (статична, кликабельна только кнопка) */}
            <div className="flex cursor-default flex-col justify-between p-6 sm:p-8 lg:col-span-5 lg:p-10">
              <div>
                {currentSlide.location && (
                  <p className="text-[11px] uppercase tracking-[0.2em] text-text-muted">
                    {currentSlide.location}
                  </p>
                )}

                <h3 className="mt-3 text-2xl font-normal leading-[1.2] tracking-tight text-text-primary sm:text-[1.7rem]">
                  {currentSlide.title}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                  {currentSlide.description}
                </p>

                {currentSlide.specs && currentSlide.specs.length > 0 && (
                  <dl className="mt-6 grid grid-cols-2 gap-px border border-border-subtle bg-border-subtle">
                    {currentSlide.specs.map((spec) => (
                      <div key={spec.label} className="bg-bg-elevated px-4 py-3">
                        <dt className="text-[11px] uppercase tracking-[0.16em] text-text-muted">
                          {spec.label}
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-text-primary">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>

              <div className="mt-7 border-t border-border-subtle pt-6">
                <button
                  type="button"
                  data-lead-trigger={currentSlide.leadSource ?? leadSource}
                  data-lead-complex={
                    currentSlide.location ?? activeTab.label
                  }
                  data-lead-title={currentSlide.title}
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-sm bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-[350ms] ease-[var(--ease-editorial)] hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary sm:w-auto"
                >
                  <span>{currentSlide.ctaLabel ?? ctaLabel}</span>
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
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Режим отзывов клиентов: 8 редакционных карточек-скриншотов с превью объекта */
          <div
            key={`${activeTab.id}-${currentSlide.id}`}
            className="animate-fade-in grid grid-cols-1 lg:grid-cols-12"
          >
            {/* Стилизованная карточка-скриншот отзыва */}
            <div className="flex cursor-default flex-col justify-between border-b border-border-subtle p-6 sm:p-8 lg:col-span-7 lg:border-r lg:border-b-0 lg:p-10">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex items-center bg-accent-muted px-2.5 py-1 text-[11px] font-medium uppercase leading-none tracking-[0.16em] text-accent select-none">
                      {currentSlide.source ?? 'Проверенный отзыв'}
                    </span>
                    {currentSlide.date && (
                      <span className="text-xs text-text-muted">
                        {currentSlide.date}
                      </span>
                    )}
                  </div>

                  {typeof currentSlide.rating === 'number' && (
                    <div
                      className="inline-flex items-center gap-1 text-accent"
                      aria-label={`Оценка ${currentSlide.rating} из 5`}
                    >
                      {Array.from({ length: currentSlide.rating }).map(
                        (_, starIdx) => (
                          <svg
                            key={starIdx}
                            className="h-3.5 w-3.5 fill-current"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                          >
                            <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.51L10 14.12l-4.94 2.6.94-5.51-4-3.9 5.53-.8L10 1.5z" />
                          </svg>
                        ),
                      )}
                    </div>
                  )}
                </div>

                <figure className="mt-6">
                  <blockquote className="font-serif text-2xl italic leading-snug text-text-primary sm:text-[1.75rem]">
                    «{currentSlide.description}»
                  </blockquote>

                  <figcaption className="mt-6 flex flex-wrap items-baseline justify-between gap-3 border-t border-border-subtle pt-5">
                    <div>
                      <p className="text-base font-medium text-text-primary">
                        {currentSlide.author ?? currentSlide.title}
                      </p>
                      {currentSlide.location && (
                        <p className="mt-0.5 text-xs text-text-muted">
                          {currentSlide.location}
                        </p>
                      )}
                    </div>

                    {currentSlide.service && (
                      <p className="text-xs text-text-secondary">
                        {currentSlide.service}
                      </p>
                    )}
                  </figcaption>
                </figure>
              </div>

              {currentSlide.resultNote && (
                <p className="mt-6 inline-flex items-center gap-2.5 border-l border-border-accent pl-3.5 text-xs leading-relaxed text-text-primary">
                  <span>{currentSlide.resultNote}</span>
                </p>
              )}
            </div>

            {/* Правый фрейм: фотография выполненного объекта к отзыву */}
            <div className="relative aspect-[16/10] overflow-hidden bg-bg-primary lg:col-span-5 lg:aspect-auto lg:min-h-[360px]">
              {currentSlide.imageSrc && (
                <img
                  src={currentSlide.imageSrc}
                  alt={currentSlide.imageAlt ?? currentSlide.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-center"
                />
              )}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg-primary/80 via-bg-primary/25 to-transparent"
              />
              <span className="pointer-events-none absolute bottom-4 left-4 inline-flex cursor-default items-center border border-border-subtle bg-bg-primary/85 px-3 py-1.5 text-[11px] uppercase leading-none tracking-[0.16em] text-text-secondary backdrop-blur-sm select-none">
                Отзыв {formatIndex(safeSlideIndex + 1)} из{' '}
                {formatIndex(totalSlides)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Нижняя строка быстрых индикаторов слайдов (кликабельны только кнопки номеров) */}
      {totalSlides > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle bg-bg-elevated px-5 py-3.5 sm:px-6 lg:px-8">
          <p className="cursor-default text-xs text-text-muted">
            {variant === 'works'
              ? 'Используйте стрелки справа сверху или клавиши ← →'
              : 'Реальные отзывы клиентов по объектам в Тюмени и области'}
          </p>

          <div
            role="group"
            aria-label="Быстрый выбор слайда"
            className="flex flex-wrap items-center gap-1.5"
          >
            {slides.map((slide, idx) => {
              const isActive = idx === safeSlideIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlideIndex(idx)}
                  aria-label={`Перейти к слайду ${idx + 1} из ${totalSlides}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`inline-flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-sm border px-2 text-[11px] font-medium tabular-nums leading-none transition-colors duration-[300ms] ease-[var(--ease-editorial)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                    isActive
                      ? 'border-border-accent bg-accent-muted text-accent'
                      : 'border-border-subtle bg-bg-secondary text-text-muted hover:border-border-accent hover:text-text-primary'
                  }`}
                >
                  {formatIndex(idx + 1)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
