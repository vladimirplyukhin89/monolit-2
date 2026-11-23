import { useId, useRef, useState, type FormEvent } from 'react';
import {
  CONSULTATION_STEPS,
  CONSULTATION_TOPICS,
  PREFERRED_CONTACT_CHANNELS,
  getConsultationTopicLabel,
  getPreferredChannelLabel,
  validateLeadContact,
  type ConsultationTopicId,
  type PreferredContactChannelId,
} from '../../data/lead';
import { SITE_CONFIG } from '../../data/navigation';
import { selectedLeadContext } from '../../stores/lead';

interface ConsultationFormState {
  readonly topics: readonly ConsultationTopicId[];
  readonly channel: PreferredContactChannelId;
  readonly name: string;
  readonly phone: string;
  readonly note: string;
  readonly acceptPrivacy: boolean;
  readonly acceptPersonalData: boolean;
  readonly acceptNewsletter: boolean;
}

const INITIAL_CONSULTATION_FORM: ConsultationFormState = {
  topics: ['repair'],
  channel: 'phone',
  name: '',
  phone: '',
  note: '',
  acceptPrivacy: false,
  acceptPersonalData: false,
  acceptNewsletter: false,
};

export default function ConsultationSection() {
  const formId = useId();
  const formCardRef = useRef<HTMLDivElement | null>(null);
  const [form, setForm] = useState<ConsultationFormState>(
    INITIAL_CONSULTATION_FORM,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const toggleTopic = (topicId: ConsultationTopicId): void => {
    setForm((prev) => {
      const exists = prev.topics.includes(topicId);
      const nextTopics = exists
        ? prev.topics.filter((item) => item !== topicId)
        : [...prev.topics, topicId];

      return {
        ...prev,
        topics: nextTopics,
      };
    });
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

    const topicSummary =
      form.topics.length > 0
        ? form.topics.map((id) => getConsultationTopicLabel(id)).join(', ')
        : 'Общая консультация';

    selectedLeadContext.set({
      source: 'consultation-section',
      projectComplex: topicSummary,
      projectTitle: form.note.trim() || undefined,
    });

    setErrorMessage(null);
    setIsSubmitted(true);

    window.requestAnimationFrame(() => {
      formCardRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });
  };

  const handleReset = (): void => {
    setForm(INITIAL_CONSULTATION_FORM);
    setErrorMessage(null);
    setIsSubmitted(false);
  };

  const selectedTopicLabels =
    form.topics.length > 0
      ? form.topics.map((id) => getConsultationTopicLabel(id))
      : ['Общая консультация'];

  return (
    <section
      id="contact-form"
      aria-labelledby={`${formId}-heading`}
      className="scroll-mt-20 bg-bg-primary py-20 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Левая редакционная колонка в эстетике Verelle Private («Begin with a conversation») */}
          <div className="flex flex-col justify-between gap-10 lg:col-span-5">
            <div>
              <p className="mb-4 cursor-default text-xs uppercase tracking-[0.22em] text-text-muted">
                Диалог со студией · Без навязчивых звонков
              </p>

              <h2
                id={`${formId}-heading`}
                className="cursor-default text-3xl font-normal leading-[1.12] tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
              >
                Начнём{' '}
                <span className="font-serif text-[1.12em] font-medium italic text-text-primary">
                  с&nbsp;разговора
                </span>
              </h2>

              <p className="mt-5 max-w-md cursor-default text-sm leading-relaxed text-text-secondary sm:text-base">
                Расскажите о вашей квартире, доме или задаче — спокойно обсудим
                сроки, ориентир бюджета и оптимальный формат работы. Заявку
                разбирает ведущий инженер, а не колл-центр.
              </p>

              {/* Статичный список шагов диалога: без hover-подсветки */}
              <ol className="mt-8 divide-y divide-border-subtle border-y border-border-subtle">
                {CONSULTATION_STEPS.map((step) => (
                  <li
                    key={step.number}
                    className="flex cursor-default items-start gap-4 py-4"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 font-serif text-base italic leading-none text-text-muted"
                    >
                      {step.number}
                    </span>
                    <span className="text-xs leading-relaxed text-text-secondary sm:text-sm">
                      {step.text}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Спокойная карточка прямых контактов: контейнер статичен, интерактивны только ссылки */}
            <aside className="cursor-default border border-border-subtle bg-bg-secondary p-6 sm:p-7">
              <p className="text-[11px] uppercase tracking-[0.2em] text-text-muted">
                Прямая связь с офисом
              </p>

              <div className="mt-4 flex flex-col items-start gap-1.5">
                <a
                  href={SITE_CONFIG.phoneHref}
                  className="text-lg font-medium tracking-tight text-text-primary transition-colors duration-[300ms] ease-[var(--ease-editorial)] hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent sm:text-xl"
                >
                  {SITE_CONFIG.phoneDisplay}
                </a>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-sm text-text-secondary transition-colors duration-[300ms] ease-[var(--ease-editorial)] hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                >
                  {SITE_CONFIG.email}
                </a>
              </div>

              <div className="mt-5 border-t border-border-subtle pt-4 text-xs leading-relaxed text-text-muted">
                <p className="text-text-secondary">{SITE_CONFIG.address}</p>
                <p className="mt-1">
                  Пн — Пт: 09:00 — 19:00 · Сб: 10:00 — 16:00
                </p>
              </div>
            </aside>
          </div>

          {/* Правая колонка: спокойная форма обратной связи */}
          <div className="lg:col-span-7">
            <div
              ref={formCardRef}
              className="border border-border-subtle bg-bg-secondary p-6 sm:p-8 lg:p-10"
            >
              {!isSubmitted ? (
                <form
                  key="consultation-form"
                  onSubmit={handleSubmit}
                  noValidate
                  className="animate-fade-in space-y-7"
                >
                  {/* 01. Выбор темы обращения (аккуратные чекбоксы) */}
                  <fieldset className="m-0 border-0 p-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <legend className="cursor-default text-xs uppercase tracking-[0.18em] text-text-muted">
                        01 · Тема обращения
                      </legend>
                      <span className="cursor-default text-xs text-text-muted">
                        Можно выбрать несколько
                      </span>
                    </div>

                    <div className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {CONSULTATION_TOPICS.map((topic) => {
                        const isChecked = form.topics.includes(topic.id);

                        return (
                          <label
                            key={topic.id}
                            className={`group flex cursor-pointer items-start justify-between gap-3 rounded-sm border p-4 transition-colors duration-[300ms] ease-[var(--ease-editorial)] focus-within:ring-1 focus-within:ring-accent ${
                              isChecked
                                ? 'border-border-accent bg-bg-elevated'
                                : 'border-border-subtle bg-bg-primary/70 hover:border-border-accent hover:bg-bg-elevated/80'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleTopic(topic.id)}
                              className="sr-only"
                            />

                            <span className="flex min-w-0 items-start gap-3">
                              <span
                                aria-hidden="true"
                                className={`mt-0.5 shrink-0 font-serif text-sm italic leading-none transition-colors duration-[300ms] ease-[var(--ease-editorial)] ${
                                  isChecked
                                    ? 'text-accent'
                                    : 'text-text-muted group-hover:text-accent'
                                }`}
                              >
                                {topic.number}
                              </span>
                              <span className="min-w-0">
                                <span className="block text-sm font-medium leading-snug text-text-primary">
                                  {topic.label}
                                </span>
                                <span className="mt-1 block text-xs leading-relaxed text-text-muted">
                                  {topic.hint}
                                </span>
                              </span>
                            </span>

                            <span
                              aria-hidden="true"
                              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-xs border transition-colors duration-[300ms] ease-[var(--ease-editorial)] ${
                                isChecked
                                  ? 'border-accent bg-accent text-text-primary'
                                  : 'border-border-subtle bg-bg-secondary group-hover:border-border-accent'
                              }`}
                            >
                              {isChecked && (
                                <svg
                                  className="h-3 w-3"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M20 6 9 17l-5-5" />
                                </svg>
                              )}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  {/* 02. Удобный способ связи (радиогруппа) */}
                  <div className="border-t border-border-subtle pt-6">
                    <fieldset className="m-0 border-0 p-0">
                      <legend className="cursor-default text-xs uppercase tracking-[0.18em] text-text-muted">
                        02 · Удобный способ связи
                      </legend>

                      <div
                        role="radiogroup"
                        aria-label="Удобный способ связи"
                        className="mt-3.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4"
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
                              className={`flex cursor-pointer flex-col items-start rounded-sm border px-3.5 py-3 text-left transition-colors duration-[300ms] ease-[var(--ease-editorial)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                                isActive
                                  ? 'border-border-accent bg-accent-muted text-text-primary'
                                  : 'border-border-subtle bg-bg-primary/70 text-text-secondary hover:border-border-accent hover:text-text-primary'
                              }`}
                            >
                              <span
                                className={`text-xs font-medium ${
                                  isActive ? 'text-accent' : 'text-text-primary'
                                }`}
                              >
                                {channel.label}
                              </span>
                              <span className="mt-1 text-[11px] leading-snug text-text-muted">
                                {channel.hint}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  </div>

                  {/* 03. Контактные данные */}
                  <div className="border-t border-border-subtle pt-6">
                    <p className="cursor-default text-xs uppercase tracking-[0.18em] text-text-muted">
                      03 · Ваши контакты
                    </p>

                    <div className="mt-3.5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor={`${formId}-name`}
                          className="block text-xs uppercase tracking-[0.16em] text-text-muted"
                        >
                          Ваше имя
                        </label>
                        <input
                          id={`${formId}-name`}
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
                          placeholder="Например, Елена"
                          className="mt-2 w-full rounded-sm border border-border-subtle bg-bg-primary px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-colors duration-[300ms] ease-[var(--ease-editorial)] focus-visible:border-border-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`${formId}-phone`}
                          className="block text-xs uppercase tracking-[0.16em] text-text-muted"
                        >
                          Телефон или мессенджер
                        </label>
                        <input
                          id={`${formId}-phone`}
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
                    </div>

                    <div className="mt-4">
                      <label
                        htmlFor={`${formId}-note`}
                        className="block text-xs uppercase tracking-[0.16em] text-text-muted"
                      >
                        Коротко об объекте (необязательно)
                      </label>
                      <textarea
                        id={`${formId}-note`}
                        name="note"
                        rows={2}
                        value={form.note}
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            note: event.target.value,
                          }))
                        }
                        placeholder="Например: ЖК «Европейский», 76 м², планируем старт ремонта в следующем месяце"
                        className="mt-2 w-full resize-none rounded-sm border border-border-subtle bg-bg-primary px-4 py-3 text-sm leading-relaxed text-text-primary placeholder:text-text-muted transition-colors duration-[300ms] ease-[var(--ease-editorial)] focus-visible:border-border-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                      />
                    </div>
                  </div>

                  {/* 3 чекбокса согласий по ref-1-nikakih-nervov.md */}
                  <div className="space-y-2.5 border-t border-border-subtle pt-5">
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
                        Хочу получать полезные материалы по ремонту и сезонные
                        предложения (необязательно)
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

                  <div className="flex flex-col items-start justify-between gap-4 pt-1 sm:flex-row sm:items-center">
                    <button
                      type="submit"
                      className="inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-sm bg-accent px-7 py-4 text-sm font-medium text-text-primary transition-colors duration-[350ms] ease-[var(--ease-editorial)] hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary sm:w-auto"
                    >
                      <span>Отправить заявку</span>
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

                    <p className="cursor-default text-xs text-text-muted">
                      Ответим в течение 15 минут в рабочее время
                    </p>
                  </div>
                </form>
              ) : (
                <div
                  key="consultation-success"
                  aria-live="polite"
                  className="animate-fade-in cursor-default border border-border-accent bg-bg-elevated p-6 sm:p-8"
                >
                  <span className="inline-flex items-center bg-accent-muted px-3 py-1.5 text-[11px] font-medium uppercase leading-none tracking-[0.18em] text-accent select-none">
                    Обращение принято
                  </span>

                  <h3 className="mt-5 text-2xl font-normal leading-snug tracking-tight text-text-primary sm:text-3xl">
                    Спасибо, {form.name.trim()}.{' '}
                    <span className="font-serif text-[1.12em] font-medium italic">
                      Мы уже получили ваш запрос
                    </span>
                  </h3>

                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary">
                    Ведущий инженер свяжется с вами в рабочее время через
                    выбранный канал ({getPreferredChannelLabel(form.channel)}) и
                    подготовит ответы по вашему объекту.
                  </p>

                  <dl className="mt-6 grid grid-cols-1 gap-px border border-border-subtle bg-border-subtle sm:grid-cols-2">
                    <div className="bg-bg-secondary px-4 py-3.5">
                      <dt className="text-[11px] uppercase tracking-[0.16em] text-text-muted">
                        Тема диалога
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-text-primary">
                        {selectedTopicLabels.join(', ')}
                      </dd>
                    </div>
                    <div className="bg-bg-secondary px-4 py-3.5">
                      <dt className="text-[11px] uppercase tracking-[0.16em] text-text-muted">
                        Способ связи
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-text-primary">
                        {getPreferredChannelLabel(form.channel)}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-7">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex cursor-pointer items-center justify-center rounded-sm border border-border-subtle bg-bg-secondary px-5 py-3 text-sm font-normal text-text-primary transition-colors duration-[300ms] ease-[var(--ease-editorial)] hover:border-border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                    >
                      Отправить ещё один вопрос
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
