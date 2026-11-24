import { useCallback, useEffect, useId, useRef, useState } from 'react';

export interface CookieConsentPreferences {
  readonly necessary: true;
  readonly analytics: boolean;
  readonly preferences: boolean;
  readonly updatedAt: string;
  readonly version: 1;
}

const STORAGE_KEY = 'monolit:cookie-consent:v1';
const ENTER_DELAY_MS = 500;
const EXIT_TRANSITION_MS = 380;

function readStoredConsent(): CookieConsentPreferences | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<CookieConsentPreferences>;
    if (
      parsed &&
      parsed.version === 1 &&
      parsed.necessary === true &&
      typeof parsed.analytics === 'boolean' &&
      typeof parsed.preferences === 'boolean'
    ) {
      return parsed as CookieConsentPreferences;
    }
    return null;
  } catch {
    return null;
  }
}

function writeStoredConsent(prefs: CookieConsentPreferences): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Игнорируем ошибку при ограниченном доступе к localStorage (приватный режим)
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !('matchMedia' in window)) {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function CookieBanner() {
  const bannerId = useId();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean>(true);
  const [preferencesEnabled, setPreferencesEnabled] = useState<boolean>(true);
  const exitTimerRef = useRef<number | null>(null);

  const openBanner = useCallback(
    (initialPrefs?: CookieConsentPreferences | null) => {
      if (exitTimerRef.current !== null) {
        window.clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }

      if (initialPrefs) {
        setAnalyticsEnabled(initialPrefs.analytics);
        setPreferencesEnabled(initialPrefs.preferences);
      }
      setIsMounted(true);

      if (prefersReducedMotion()) {
        setIsVisible(true);
        return;
      }

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    },
    [],
  );

  useEffect(() => {
    return () => {
      if (exitTimerRef.current !== null) {
        window.clearTimeout(exitTimerRef.current);
      }
    };
  }, []);

  // Показываем баннер только если выбор ещё не сохранён в localStorage
  useEffect(() => {
    const existing = readStoredConsent();
    if (existing) {
      return;
    }

    const delay = prefersReducedMotion() ? 0 : ENTER_DELAY_MS;
    const timer = window.setTimeout(() => {
      openBanner(null);
    }, delay);

    return () => {
      window.clearTimeout(timer);
    };
  }, [openBanner]);

  // Позволяем при необходимости повторно открыть настройки через кастомное событие без постоянных полос снизу
  useEffect(() => {
    const handleReopen = (): void => {
      const existing = readStoredConsent();
      setShowSettings(true);
      openBanner(existing);
    };

    window.addEventListener('monolit:cookie-open', handleReopen);
    return () => {
      window.removeEventListener('monolit:cookie-open', handleReopen);
    };
  }, [openBanner]);

  const dismissWithPreferences = useCallback(
    (analytics: boolean, preferences: boolean) => {
      const payload: CookieConsentPreferences = {
        necessary: true,
        analytics,
        preferences,
        updatedAt: new Date().toISOString(),
        version: 1,
      };

      writeStoredConsent(payload);
      setIsVisible(false);

      if (exitTimerRef.current !== null) {
        window.clearTimeout(exitTimerRef.current);
      }

      const exitDelay = prefersReducedMotion() ? 0 : EXIT_TRANSITION_MS;
      exitTimerRef.current = window.setTimeout(() => {
        exitTimerRef.current = null;
        setIsMounted(false);
        setShowSettings(false);
      }, exitDelay);
    },
    [],
  );

  // Полностью убираем DOM-узел при закрытом состоянии — никаких лишних полос внизу экрана
  if (!isMounted) {
    return null;
  }

  return (
    <aside
      role="region"
      aria-labelledby={`${bannerId}-title`}
      data-state={isVisible ? 'open' : 'closed'}
      className={`editorial-cookie-banner fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-40 box-border w-auto max-w-[calc(100%-2rem)] border border-border-subtle bg-bg-secondary/95 p-5 text-text-primary backdrop-blur-md sm:right-6 sm:bottom-[max(1.5rem,env(safe-area-inset-bottom))] sm:left-auto sm:w-[420px] ${
        isVisible ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            id={`${bannerId}-title`}
            className="cursor-default text-[11px] font-medium uppercase tracking-[0.2em] text-text-muted"
          >
            Файлы cookie
          </p>
          <p className="mt-2 cursor-default text-xs leading-relaxed text-text-secondary">
            Используем технические cookie для стабильной работы сайта и
            аналитику — чтобы улучшать сервис. Подробнее в{' '}
            <a
              href="/privacy"
              className="text-text-primary underline decoration-border-subtle underline-offset-4 transition-colors duration-[300ms] hover:text-accent"
            >
              политике конфиденциальности
            </a>
            .
          </p>
        </div>

        <button
          type="button"
          onClick={() => dismissWithPreferences(false, false)}
          aria-label="Закрыть и оставить только необходимые cookie"
          className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-border-subtle bg-bg-primary text-text-muted transition-colors duration-[300ms] ease-[var(--ease-editorial)] hover:border-border-accent hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        >
          <svg
            className="h-3.5 w-3.5"
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

      {/* Плавное раскрытие настроек сессии и аналитики через CSS Grid */}
      <div
        aria-hidden={!showSettings}
        data-open={showSettings ? 'true' : 'false'}
        className="accordion-panel"
      >
        <div className="accordion-inner">
          <div className="mt-4 space-y-3 border-t border-border-subtle pt-4">
            <div className="flex cursor-default items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-text-primary">
                  Технические и сессионные
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-text-muted">
                  Обеспечивают работу форм и калькулятора сметы.
                </p>
              </div>
              <span className="shrink-0 bg-accent-muted px-2 py-1 text-[10px] font-medium uppercase leading-none tracking-[0.14em] text-accent select-none">
                Активны
              </span>
            </div>

            <div className="flex items-start justify-between gap-3 border-t border-border-subtle pt-3">
              <div className="cursor-default">
                <p
                  id={`${bannerId}-analytics-label`}
                  className="text-xs font-medium text-text-primary"
                >
                  Аналитика посещений
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-text-muted">
                  Помогает понимать, какие разделы и проекты наиболее полезны.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                tabIndex={showSettings ? 0 : -1}
                aria-checked={analyticsEnabled}
                aria-labelledby={`${bannerId}-analytics-label`}
                onClick={() => setAnalyticsEnabled((prev) => !prev)}
                className={`relative inline-flex h-11 w-16 shrink-0 cursor-pointer items-center rounded-full border px-1 transition-colors duration-[300ms] ease-[var(--ease-editorial)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                  analyticsEnabled
                    ? 'border-accent bg-accent'
                    : 'border-border-subtle bg-bg-primary'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`inline-block h-8 w-8 rounded-full bg-text-primary transition-transform duration-[300ms] ease-[var(--ease-editorial)] ${
                    analyticsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-start justify-between gap-3 border-t border-border-subtle pt-3">
              <div className="cursor-default">
                <p
                  id={`${bannerId}-prefs-label`}
                  className="text-xs font-medium text-text-primary"
                >
                  Персонализация интерфейса
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-text-muted">
                  Запоминает выбранный способ связи и параметры расчётов.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                tabIndex={showSettings ? 0 : -1}
                aria-checked={preferencesEnabled}
                aria-labelledby={`${bannerId}-prefs-label`}
                onClick={() => setPreferencesEnabled((prev) => !prev)}
                className={`relative inline-flex h-11 w-16 shrink-0 cursor-pointer items-center rounded-full border px-1 transition-colors duration-[300ms] ease-[var(--ease-editorial)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                  preferencesEnabled
                    ? 'border-accent bg-accent'
                    : 'border-border-subtle bg-bg-primary'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`inline-block h-8 w-8 rounded-full bg-text-primary transition-transform duration-[300ms] ease-[var(--ease-editorial)] ${
                    preferencesEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="mt-4 flex flex-wrap items-center gap-2 pt-1">
        {showSettings ? (
          <button
            type="button"
            onClick={() =>
              dismissWithPreferences(analyticsEnabled, preferencesEnabled)
            }
            className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-sm bg-accent px-4 py-2.5 text-xs font-semibold text-white transition-colors duration-[300ms] ease-[var(--ease-editorial)] hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary"
          >
            Сохранить выбор
          </button>
        ) : (
          <button
            type="button"
            onClick={() => dismissWithPreferences(true, true)}
            className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-sm bg-accent px-4 py-2.5 text-xs font-semibold text-white transition-colors duration-[300ms] ease-[var(--ease-editorial)] hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary"
          >
            Принять все
          </button>
        )}

        <button
          type="button"
          onClick={() => dismissWithPreferences(false, false)}
          className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-sm border border-border-subtle bg-bg-elevated px-3.5 py-2.5 text-xs font-normal text-text-secondary transition-colors duration-[300ms] ease-[var(--ease-editorial)] hover:border-border-accent hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        >
          Только необходимые
        </button>

        <button
          type="button"
          aria-expanded={showSettings}
          onClick={() => setShowSettings((prev) => !prev)}
          className="inline-flex min-h-11 cursor-pointer items-center justify-center px-3 py-2 text-xs text-text-muted transition-colors duration-[300ms] ease-[var(--ease-editorial)] hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        >
          {showSettings ? 'Скрыть' : 'Настроить'}
        </button>
      </div>
    </aside>
  );
}
