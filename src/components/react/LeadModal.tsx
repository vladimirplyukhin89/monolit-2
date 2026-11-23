import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { useStore } from '@nanostores/react';
import {
  PREFERRED_CONTACT_CHANNELS,
  getLeadModalPreset,
  getPreferredChannelLabel,
  validateLeadContact,
  type PreferredContactChannelId,
} from '../../data/lead';
import {
  closeLeadModal,
  leadModalOpen,
  openLeadModal,
  selectedLeadContext,
  type LeadRequestContext,
} from '../../stores/lead';

interface ModalFormState {
  readonly channel: PreferredContactChannelId;
  readonly name: string;
  readonly phone: string;
  readonly acceptPrivacy: boolean;
  readonly acceptPersonalData: boolean;
  readonly acceptNewsletter: boolean;
}

const INITIAL_MODAL_FORM: ModalFormState = {
  channel: 'phone',
  name: '',
  phone: '',
  acceptPrivacy: false,
  acceptPersonalData: false,
  acceptNewsletter: false,
};

const CLOSE_TRANSITION_MS = 340;

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !('matchMedia' in window)) {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function LeadModal() {
  const modalId = useId();
  const isOpen = useStore(leadModalOpen);
  const context = useStore(selectedLeadContext);

  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [form, setForm] = useState<ModalFormState>(INITIAL_MODAL_FORM);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const isMountedRef = useRef<boolean>(false);

  const handleClose = useCallback(() => {
    closeLeadModal();
  }, []);

  // Глобальное делегирование кликов по CTA (шапка, Hero, услуги, футер) + события из портфолио
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent): void => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const trigger = target.closest<HTMLElement>('[data-lead-trigger]');
      if (!trigger) {
        return;
      }

      const source = trigger.dataset.leadTrigger ?? 'header-cta';
      const projectComplex = trigger.dataset.leadComplex ?? '';
      const projectTitle = trigger.dataset.leadTitle;
      const projectArea = trigger.dataset.leadArea;

      event.preventDefault();
      restoreFocusRef.current = trigger;

      openLeadModal({
        source,
        projectComplex,
        projectTitle,
        projectArea,
      });
    };

    const handlePortfolioLeadEvent = (event: Event): void => {
      const customEvent = event as CustomEvent<LeadRequestContext | undefined>;
      customEvent.preventDefault();

      if (document.activeElement instanceof HTMLElement) {
        restoreFocusRef.current = document.activeElement;
      }

      const detail = customEvent.detail;
      openLeadModal(
        detail ?? {
          source: 'portfolio-want-same',
          projectComplex: 'Индивидуальный проект',
        },
      );
    };

    document.addEventListener('click', handleDocumentClick);
    window.addEventListener('monolit:lead-open', handlePortfolioLeadEvent);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
      window.removeEventListener('monolit:lead-open', handlePortfolioLeadEvent);
    };
  }, []);

  // Двухфазное монтирование для плавного CSS transition на вход и выход (без bounce)
  useEffect(() => {
    if (isOpen) {
      if (
        !restoreFocusRef.current &&
        document.activeElement instanceof HTMLElement
      ) {
        restoreFocusRef.current = document.activeElement;
      }

      setForm(INITIAL_MODAL_FORM);
      setErrorMessage(null);
      setIsSubmitted(false);
      isMountedRef.current = true;
      setIsMounted(true);

      if (prefersReducedMotion()) {
        setIsVisible(true);
        return;
      }

      let raf1 = 0;
      let raf2 = 0;
      raf1 = window.requestAnimationFrame(() => {
        raf2 = window.requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });

      return () => {
        window.cancelAnimationFrame(raf1);
        window.cancelAnimationFrame(raf2);
      };
    }

    setIsVisible(false);

    if (!isMountedRef.current) {
      return;
    }

    const delay = prefersReducedMotion() ? 0 : CLOSE_TRANSITION_MS;
    const timer = window.setTimeout(() => {
      isMountedRef.current = false;
      setIsMounted(false);
      const elementToFocus = restoreFocusRef.current;
      restoreFocusRef.current = null;
      if (elementToFocus && document.contains(elementToFocus)) {
        elementToFocus.focus();
      }
    }, delay);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isOpen]);

  // Блокировка скролла без горизонтального скачка макета
  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [isMounted]);

  // Автофокус и focus-trap внутри диалога + закрытие по Escape
  useEffect(() => {
    if (!isOpen || !isMounted) {
      return;
    }

    const focusTimer = window.setTimeout(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      } else {
        closeButtonRef.current?.focus();
      }
    }, 60);

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) {
        return;
      }

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => el.offsetParent !== null);

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isMounted, handleClose]);

  const handleBackdropClick = (
    event: ReactMouseEvent<HTMLDivElement>,
  ): void => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  const handleJumpToQuiz = (): void => {
    handleClose();
    window.setTimeout(() => {
      const quizEl = document.getElementById('quiz');
      quizEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const validationError = validateLeadContact(
      form.name,
      form.phone,
      form.acceptPrivacy,
      form.acceptPersonalData,
    );

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage(null);
    setIsSubmitted(true);
  };

  if (!isMounted) {
    return null;
  }

  const preset = getLeadModalPreset(context?.source);
  const stateAttr = isVisible ? 'open' : 'closed';
  const hasProjectContext = Boolean(context?.projectComplex);
  const projectLabel = context?.projectArea
    ? `${context.projectComplex} · ${context.projectArea}`
    : context?.projectComplex;

  return (
    <div
      data-state={stateAttr}
      onClick={handleBackdropClick}
      className={`editorial-modal-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6 ${
        isVisible ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${modalId}-title`}
        aria-describedby={`${modalId}-description`}
        data-state={stateAttr}
        className="editorial-modal-panel relative my-auto max-h-[90dvh] w-full max-w-[540px] overflow-y-auto border border-border-subtle bg-bg-secondary text-text-primary"
      >
        {/* Шапка модального окна */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border-subtle bg-bg-secondary/95 px-5 py-4 backdrop-blur-md sm:px-7">
          <p className="cursor-default text-[11px] uppercase tracking-[0.2em] text-text-muted">
            {preset.eyebrow}
          </p>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            aria-label="Закрыть окно заявки"
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-sm border border-border-subtle bg-bg-primary text-text-secondary transition-colors duration-[300ms] ease-[var(--ease-editorial)] hover:border-border-accent hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-5 sm:p-7">
          {!isSubmitted ? (
            <div key="lead-modal-form" className="animate-fade-in">
              <h2
                id={`${modalId}-title`}
                className="cursor-default text-2xl font-normal leading-[1.18] tracking-tight text-text-primary sm:text-[1.8rem]"
              >
                {preset.titlePrefix}
                <span className="font-serif text-[1.12em] font-medium italic text-text-primary">
                  {preset.titleAccent}
                </span>
              </h2>

              <p
                id={`${modalId}-description`}
                className="mt-2.5 cursor-default text-sm leading-relaxed text-text-secondary"
              >
                {preset.subtitle}
              </p>

              {/* Предзаполненный контекст проекта из портфолио */}
              {hasProjectContext && projectLabel && (
                <div className="mt-5 cursor-default border border-border-accent bg-bg-elevated px-4 py-3.5">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-accent">
                    Выбранный ориентир
                  </p>
                  <p className="mt-1 text-sm font-medium text-text-primary">
                    {projectLabel}
                  </p>
                  {context?.projectTitle && (
                    <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                      {context.projectTitle}
                    </p>
                  )}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                noValidate
                className="mt-6 space-y-5"
              >
                {/* Выбор удобного способа связи */}
                <div>
                  <span className="block cursor-default text-xs uppercase tracking-[0.16em] text-text-muted">
                    Удобный способ связи
                  </span>
                  <div
                    role="radiogroup"
                    aria-label="Удобный способ связи"
                    className="mt-2.5 flex flex-wrap gap-2"
                  >
                    {PREFERRED_CONTACT_CHANNELS.map((channel) => {
                      const isActive = form.channel === channel.id;

                      return (
                        <button
                          key={channel.id}
                          type="button"
                          role="radio"
                          aria-checked={isActive}
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              channel: channel.id,
                            }))
                          }
                          className={`cursor-pointer rounded-sm border px-3.5 py-2 text-xs font-medium transition-colors duration-[300ms] ease-[var(--ease-editorial)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                            isActive
                              ? 'border-border-accent bg-accent-muted text-accent'
                              : 'border-border-subtle bg-bg-primary text-text-secondary hover:border-border-accent hover:text-text-primary'
                          }`}
                        >
                          {channel.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor={`${modalId}-name`}
                    className="block text-xs uppercase tracking-[0.16em] text-text-muted"
                  >
                    Ваше имя
                  </label>
                  <input
                    ref={nameInputRef}
                    id={`${modalId}-name`}
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={(event) => {
                      setForm((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }));
                      if (errorMessage) {
                        setErrorMessage(null);
                      }
                    }}
                    placeholder="Например, Алексей"
                    className="mt-2 w-full rounded-sm border border-border-subtle bg-bg-primary px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-colors duration-[300ms] ease-[var(--ease-editorial)] focus-visible:border-border-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`${modalId}-phone`}
                    className="block text-xs uppercase tracking-[0.16em] text-text-muted"
                  >
                    Телефон или мессенджер
                  </label>
                  <input
                    id={`${modalId}-phone`}
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(event) => {
                      setForm((prev) => ({
                        ...prev,
                        phone: event.target.value,
                      }));
                      if (errorMessage) {
                        setErrorMessage(null);
                      }
                    }}
                    placeholder="+7 (900) 000-00-00"
                    className="mt-2 w-full rounded-sm border border-border-subtle bg-bg-primary px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-colors duration-[300ms] ease-[var(--ease-editorial)] focus-visible:border-border-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                  />
                </div>

                {/* 3 чекбокса согласий (ref-1-nikakih-nervov.md) */}
                <div className="space-y-2.5 pt-1">
                  <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-text-secondary">
                    <input
                      type="checkbox"
                      checked={form.acceptPrivacy}
                      onChange={(event) => {
                        setForm((prev) => ({
                          ...prev,
                          acceptPrivacy: event.target.checked,
                        }));
                        if (errorMessage) {
                          setErrorMessage(null);
                        }
                      }}
                      className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-accent"
                    />
                    <span>
                      Согласен с{' '}
                      <a
                        href="/privacy"
                        className="underline decoration-border-subtle underline-offset-4 transition-colors duration-[300ms] hover:text-text-primary"
                      >
                        политикой конфиденциальности
                      </a>
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-text-secondary">
                    <input
                      type="checkbox"
                      checked={form.acceptPersonalData}
                      onChange={(event) => {
                        setForm((prev) => ({
                          ...prev,
                          acceptPersonalData: event.target.checked,
                        }));
                        if (errorMessage) {
                          setErrorMessage(null);
                        }
                      }}
                      className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-accent"
                    />
                    <span>
                      Даю{' '}
                      <a
                        href="/personal-data"
                        className="underline decoration-border-subtle underline-offset-4 transition-colors duration-[300ms] hover:text-text-primary"
                      >
                        согласие на обработку персональных данных
                      </a>
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-text-muted">
                    <input
                      type="checkbox"
                      checked={form.acceptNewsletter}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          acceptNewsletter: event.target.checked,
                        }))
                      }
                      className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-accent"
                    />
                    <span>
                      Получать полезные материалы и сезонные предложения
                      (необязательно)
                    </span>
                  </label>
                </div>

                {errorMessage && (
                  <p
                    role="alert"
                    className="animate-fade-in cursor-default border-l-2 border-accent bg-accent-muted px-3.5 py-2.5 text-xs leading-relaxed text-text-primary"
                  >
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-sm bg-accent px-6 py-3.5 text-sm font-medium text-text-primary transition-colors duration-[350ms] ease-[var(--ease-editorial)] hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary"
                >
                  <span>{preset.submitLabel}</span>
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

                {preset.showQuizLink && (
                  <div className="border-t border-border-subtle pt-4 text-center">
                    <button
                      type="button"
                      onClick={handleJumpToQuiz}
                      className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-text-secondary transition-colors duration-[300ms] ease-[var(--ease-editorial)] hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                    >
                      <span>Или пройти онлайн-калькулятор сметы</span>
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          ) : (
            <div
              key="lead-modal-success"
              aria-live="polite"
              className="animate-fade-in cursor-default border border-border-accent bg-bg-elevated p-6"
            >
              <span className="inline-flex items-center bg-accent-muted px-3 py-1.5 text-[11px] font-medium uppercase leading-none tracking-[0.18em] text-accent select-none">
                Заявка принята
              </span>

              <h3
                id={`${modalId}-title`}
                className="mt-4 text-2xl font-normal leading-snug tracking-tight text-text-primary"
              >
                Спасибо, {form.name.trim()}.{' '}
                <span className="font-serif text-[1.12em] font-medium italic">
                  Мы скоро свяжемся
                </span>
              </h3>

              <p
                id={`${modalId}-description`}
                className="mt-2.5 text-sm leading-relaxed text-text-secondary"
              >
                Инженер-сметчик напишет или перезвонит через выбранный способ
                связи ({getPreferredChannelLabel(form.channel)}) в течение 15
                минут в рабочее время.
              </p>

              {hasProjectContext && projectLabel && (
                <p className="mt-4 border-t border-border-subtle pt-3.5 text-xs text-text-muted">
                  Ориентир: <span className="text-text-primary">{projectLabel}</span>
                </p>
              )}

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex cursor-pointer items-center justify-center rounded-sm border border-border-subtle bg-bg-secondary px-5 py-3 text-sm font-normal text-text-primary transition-colors duration-[300ms] ease-[var(--ease-editorial)] hover:border-border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                >
                  Вернуться на сайт
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
