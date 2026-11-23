import { useId, useMemo, useState, type FormEvent } from 'react';
import {
  AREA_MAX,
  AREA_MIN,
  AREA_PRESETS,
  CONTACT_CHANNEL_OPTIONS,
  DESIGN_SCOPE_OPTIONS,
  DESIGN_STATUS_OPTIONS,
  INITIAL_QUIZ_ANSWERS,
  PROPERTY_OPTIONS,
  REPAIR_TIER_OPTIONS,
  SERVICE_OPTIONS,
  UTILITIES_OPTIONS,
  calculateQuizEstimate,
  formatRubles,
  getOptionLabel,
  getStepsForService,
  type ContactChannelId,
  type DesignScopeId,
  type DesignStatusId,
  type PropertyTypeId,
  type QuizAnswers,
  type QuizOption,
  type QuizStepId,
  type RepairTierId,
  type ServiceTypeId,
  type UtilitiesStateId,
} from '../../data/quiz';
import { selectedLeadContext } from '../../stores/lead';

interface LeadFormState {
  readonly name: string;
  readonly phone: string;
  readonly channel: ContactChannelId;
  readonly acceptPrivacy: boolean;
  readonly acceptPersonalData: boolean;
  readonly acceptNewsletter: boolean;
}

const INITIAL_LEAD_FORM: LeadFormState = {
  name: '',
  phone: '',
  channel: 'phone',
  acceptPrivacy: false,
  acceptPersonalData: false,
  acceptNewsletter: false,
};

function clampArea(value: number): number {
  if (Number.isNaN(value)) {
    return AREA_MIN;
  }
  return Math.min(AREA_MAX, Math.max(AREA_MIN, Math.round(value)));
}

function formatStepNumber(index: number): string {
  return String(index + 1).padStart(2, '0');
}

interface OptionGridProps<T extends string> {
  readonly options: readonly QuizOption<T>[];
  readonly selectedValue: T | null;
  readonly groupLabel: string;
  readonly onSelect: (value: T) => void;
}

function OptionGrid<T extends string>({
  options,
  selectedValue,
  groupLabel,
  onSelect,
}: OptionGridProps<T>) {
  const columnsClass =
    options.length === 4 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1';

  return (
    <div
      role="radiogroup"
      aria-label={groupLabel}
      className={`grid gap-3 ${columnsClass}`}
    >
      {options.map((option) => {
        const isSelected = selectedValue === option.id;

        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(option.id)}
            className={`group flex w-full cursor-pointer items-start justify-between gap-4 rounded-sm border p-5 text-left transition-colors duration-[300ms] ease-[var(--ease-editorial)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
              isSelected
                ? 'border-accent bg-bg-elevated'
                : 'border-border-subtle bg-bg-primary/70 hover:border-border-accent hover:bg-bg-elevated/85'
            }`}
          >
            <span className="flex min-w-0 items-start gap-4">
              <span
                aria-hidden="true"
                className={`mt-0.5 shrink-0 font-serif text-base italic leading-none transition-colors duration-[300ms] ease-[var(--ease-editorial)] ${
                  isSelected
                    ? 'text-accent'
                    : 'text-text-muted group-hover:text-accent'
                }`}
              >
                {option.code}
              </span>

              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <span className="text-base font-medium leading-snug text-text-primary">
                    {option.label}
                  </span>
                  {option.meta && (
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium leading-none tracking-[0.12em] ${
                        isSelected
                          ? 'bg-accent-muted text-accent'
                          : 'border border-border-subtle bg-bg-secondary text-text-muted'
                      }`}
                    >
                      {option.meta}
                    </span>
                  )}
                </span>

                <span className="mt-2 block text-xs leading-relaxed text-text-secondary sm:text-sm">
                  {option.description}
                </span>
              </span>
            </span>

            {/* Явная радио-индикация кликабельного выбора */}
            <span
              aria-hidden="true"
              className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-[300ms] ease-[var(--ease-editorial)] ${
                isSelected
                  ? 'border-accent bg-accent'
                  : 'border-border-subtle bg-bg-secondary group-hover:border-border-accent'
              }`}
            >
              {isSelected && (
                <svg
                  className="h-3 w-3 text-text-primary"
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
          </button>
        );
      })}
    </div>
  );
}

export default function QuizCalculator() {
  const formId = useId();
  const [answers, setAnswers] = useState<QuizAnswers>(INITIAL_QUIZ_ANSWERS);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isResultStep, setIsResultStep] = useState<boolean>(false);
  const [areaDraft, setAreaDraft] = useState<string>(
    String(INITIAL_QUIZ_ANSWERS.area),
  );
  const [leadForm, setLeadForm] = useState<LeadFormState>(INITIAL_LEAD_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const steps = useMemo(
    () => getStepsForService(answers.service),
    [answers.service],
  );

  const safeStepIndex = Math.min(stepIndex, steps.length - 1);
  const currentStep = steps[safeStepIndex];
  const isLastQuestionStep = safeStepIndex === steps.length - 1;

  const estimate = useMemo(() => calculateQuizEstimate(answers), [answers]);

  const progressPercent = isResultStep
    ? 100
    : Math.round(((safeStepIndex + 1) / steps.length) * 100);

  const isStepAnswered = (stepId: QuizStepId): boolean => {
    switch (stepId) {
      case 'service':
        return answers.service !== null;
      case 'property':
        return answers.property !== null;
      case 'utilities':
        return answers.utilities !== null;
      case 'designStatus':
        return answers.designStatus !== null;
      case 'repairTier':
        return answers.repairTier !== null;
      case 'designScope':
        return answers.designScope !== null;
      case 'area':
        return answers.area >= AREA_MIN && answers.area <= AREA_MAX;
    }
  };

  const canProceed = currentStep ? isStepAnswered(currentStep.id) : false;

  const handleSelectService = (service: ServiceTypeId): void => {
    setAnswers((prev) => ({
      ...prev,
      service,
    }));
  };

  const handleSelectProperty = (property: PropertyTypeId): void => {
    setAnswers((prev) => ({
      ...prev,
      property,
    }));
  };

  const handleSelectUtilities = (utilities: UtilitiesStateId): void => {
    setAnswers((prev) => ({
      ...prev,
      utilities,
    }));
  };

  const handleSelectDesignStatus = (designStatus: DesignStatusId): void => {
    setAnswers((prev) => ({
      ...prev,
      designStatus,
    }));
  };

  const handleSelectRepairTier = (repairTier: RepairTierId): void => {
    setAnswers((prev) => ({
      ...prev,
      repairTier,
    }));
  };

  const handleSelectDesignScope = (designScope: DesignScopeId): void => {
    setAnswers((prev) => ({
      ...prev,
      designScope,
    }));
  };

  const handleAreaChange = (nextArea: number): void => {
    const clamped = clampArea(nextArea);
    setAnswers((prev) => ({
      ...prev,
      area: clamped,
    }));
    setAreaDraft(String(clamped));
  };

  const handleAreaInputChange = (rawValue: string): void => {
    const cleaned = rawValue.replace(/[^\d]/g, '').slice(0, 3);
    setAreaDraft(cleaned);

    if (cleaned === '') {
      return;
    }

    const parsed = Number(cleaned);
    if (!Number.isNaN(parsed) && parsed >= AREA_MIN && parsed <= AREA_MAX) {
      setAnswers((prev) => ({
        ...prev,
        area: parsed,
      }));
    }
  };

  const handleAreaInputBlur = (): void => {
    const parsed = Number(areaDraft);
    const clamped = areaDraft === '' ? answers.area : clampArea(parsed);
    setAnswers((prev) => ({
      ...prev,
      area: clamped,
    }));
    setAreaDraft(String(clamped));
  };

  const handleNext = (): void => {
    if (!canProceed) {
      return;
    }

    if (isLastQuestionStep) {
      setIsResultStep(true);
      setFormError(null);
      return;
    }

    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = (): void => {
    if (isResultStep) {
      setIsResultStep(false);
      setIsSubmitted(false);
      setFormError(null);
      return;
    }

    if (safeStepIndex > 0) {
      setStepIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleJumpToStep = (targetIndex: number): void => {
    if (targetIndex < 0 || targetIndex >= steps.length) {
      return;
    }

    if (isResultStep || targetIndex < safeStepIndex) {
      setIsResultStep(false);
      setIsSubmitted(false);
      setFormError(null);
      setStepIndex(targetIndex);
    }
  };

  const handleRestart = (): void => {
    setAnswers(INITIAL_QUIZ_ANSWERS);
    setAreaDraft(String(INITIAL_QUIZ_ANSWERS.area));
    setStepIndex(0);
    setIsResultStep(false);
    setLeadForm(INITIAL_LEAD_FORM);
    setFormError(null);
    setIsSubmitted(false);
  };

  const handleLeadSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const trimmedName = leadForm.name.trim();
    const digitsOnly = leadForm.phone.replace(/\D/g, '');

    if (trimmedName.length < 2) {
      setFormError('Пожалуйста, укажите ваше имя.');
      return;
    }

    if (digitsOnly.length < 10) {
      setFormError('Укажите корректный номер телефона (не менее 10 цифр).');
      return;
    }

    if (!leadForm.acceptPrivacy || !leadForm.acceptPersonalData) {
      setFormError(
        'Для отправки расчёта подтвердите согласие с политикой и обработкой персональных данных.',
      );
      return;
    }

    const serviceLabel =
      getOptionLabel(SERVICE_OPTIONS, answers.service) ?? 'Ремонт под ключ';
    const propertyLabel =
      getOptionLabel(PROPERTY_OPTIONS, answers.property) ?? 'Объект';

    selectedLeadContext.set({
      source: 'quiz-calculator',
      projectComplex: `${serviceLabel} · ${propertyLabel}`,
      projectTitle: `Ориентир от ${formatRubles(estimate.ratePerSqm)}/м²`,
      projectArea: `${answers.area} м²`,
    });

    setFormError(null);
    setIsSubmitted(true);
  };

  const summaryRows = useMemo(() => {
    const getStepAnswerLabel = (stepId: QuizStepId): string | null => {
      switch (stepId) {
        case 'service':
          return getOptionLabel(SERVICE_OPTIONS, answers.service);
        case 'property':
          return getOptionLabel(PROPERTY_OPTIONS, answers.property);
        case 'utilities':
          return getOptionLabel(UTILITIES_OPTIONS, answers.utilities);
        case 'designStatus':
          return getOptionLabel(DESIGN_STATUS_OPTIONS, answers.designStatus);
        case 'repairTier':
          return getOptionLabel(REPAIR_TIER_OPTIONS, answers.repairTier);
        case 'designScope':
          return getOptionLabel(DESIGN_SCOPE_OPTIONS, answers.designScope);
        case 'area':
          return isResultStep || safeStepIndex === steps.length - 1
            ? `${answers.area} м²`
            : null;
      }
    };

    return steps.map((step, index) => ({
      id: step.id,
      number: formatStepNumber(index),
      label: step.shortLabel,
      value: getStepAnswerLabel(step.id),
      isActive: !isResultStep && index === safeStepIndex,
    }));
  }, [answers, isResultStep, safeStepIndex, steps]);

  const activeServiceLabel = getOptionLabel(SERVICE_OPTIONS, answers.service);
  const stepAnimationKey = isSubmitted
    ? 'quiz-submitted'
    : isResultStep
      ? 'quiz-result'
      : `quiz-step-${currentStep?.id ?? 'service'}`;

  return (
    <div className="border border-border-subtle bg-bg-secondary">
      {/* Верхняя полоса прогресса и редакционный степпер */}
      <div className="border-b border-border-subtle px-5 py-5 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex cursor-default items-center gap-3">
            <span className="font-serif text-base italic leading-none text-accent">
              {isResultStep
                ? 'Итог'
                : `${formatStepNumber(safeStepIndex)} / ${formatStepNumber(steps.length - 1)}`}
            </span>
            <span className="h-3.5 w-px bg-border-subtle" aria-hidden="true" />
            <span className="text-xs uppercase tracking-[0.18em] text-text-muted">
              {isResultStep
                ? 'Ориентировочный расчёт'
                : activeServiceLabel ?? 'Выбор сценария'}
            </span>
          </div>

          <span className="cursor-default text-xs tabular-nums text-text-muted">
            Готово на {progressPercent}%
          </span>
        </div>

        {/* Линейный прогресс-бар на чистом CSS */}
        <div
          role="progressbar"
          aria-label="Прогресс заполнения калькулятора"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercent}
          className="mt-4 h-0.5 w-full overflow-hidden bg-border-subtle"
        >
          <div
            style={{ width: `${progressPercent}%` }}
            className="h-full bg-accent transition-[width] duration-[400ms] ease-[var(--ease-editorial)] motion-reduce:transition-none"
          />
        </div>

        {/* Индикаторы шагов: кликабельны ТОЛЬКО пройденные шаги, будущие и текущий статичны */}
        <ol className="mt-4 hidden flex-wrap items-center gap-x-5 gap-y-2 sm:flex">
          {steps.map((step, index) => {
            const isCompleted = isResultStep || index < safeStepIndex;
            const isCurrent = !isResultStep && index === safeStepIndex;

            if (isCompleted) {
              return (
                <li key={step.id}>
                  <button
                    type="button"
                    onClick={() => handleJumpToStep(index)}
                    className="inline-flex cursor-pointer items-center gap-2 text-xs text-text-secondary transition-colors duration-[300ms] ease-[var(--ease-editorial)] hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                  >
                    <span className="font-serif italic text-accent">
                      {formatStepNumber(index)}
                    </span>
                    <span>{step.shortLabel}</span>
                  </button>
                </li>
              );
            }

            return (
              <li key={step.id}>
                <span
                  aria-current={isCurrent ? 'step' : undefined}
                  className={`inline-flex cursor-default items-center gap-2 text-xs select-none ${
                    isCurrent ? 'font-medium text-text-primary' : 'text-text-muted'
                  }`}
                >
                  <span
                    className={`font-serif italic ${
                      isCurrent ? 'text-accent' : 'text-text-muted'
                    }`}
                  >
                    {formatStepNumber(index)}
                  </span>
                  <span>{step.shortLabel}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Основная 2-колоночная сетка: активный шаг слева, статичная сводка справа */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="flex flex-col justify-between p-5 sm:p-8 lg:col-span-8 lg:p-10">
          {/* Анимация появления на чистом CSS (@keyframes fade-in) при смене key шага */}
          <div key={stepAnimationKey} className="animate-fade-in">
            {!isResultStep && currentStep && (
              <div>
                <h3 className="cursor-default text-2xl font-normal leading-[1.18] tracking-tight text-text-primary sm:text-3xl">
                  {currentStep.title}
                  <span className="font-serif text-[1.12em] font-medium italic text-text-primary">
                    {currentStep.titleAccent}
                  </span>
                </h3>
                <p className="mt-3 max-w-xl cursor-default text-sm leading-relaxed text-text-secondary">
                  {currentStep.subtitle}
                </p>

                <div className="mt-7">
                  {currentStep.id === 'service' && (
                    <OptionGrid
                      options={SERVICE_OPTIONS}
                      selectedValue={answers.service}
                      groupLabel="Тип услуги"
                      onSelect={handleSelectService}
                    />
                  )}

                  {currentStep.id === 'property' && (
                    <OptionGrid
                      options={PROPERTY_OPTIONS}
                      selectedValue={answers.property}
                      groupLabel="Тип недвижимости"
                      onSelect={handleSelectProperty}
                    />
                  )}

                  {currentStep.id === 'utilities' && (
                    <OptionGrid
                      options={UTILITIES_OPTIONS}
                      selectedValue={answers.utilities}
                      groupLabel="Состояние инженерных сетей"
                      onSelect={handleSelectUtilities}
                    />
                  )}

                  {currentStep.id === 'designStatus' && (
                    <OptionGrid
                      options={DESIGN_STATUS_OPTIONS}
                      selectedValue={answers.designStatus}
                      groupLabel="Наличие дизайн-проекта"
                      onSelect={handleSelectDesignStatus}
                    />
                  )}

                  {currentStep.id === 'repairTier' && (
                    <OptionGrid
                      options={REPAIR_TIER_OPTIONS}
                      selectedValue={answers.repairTier}
                      groupLabel="Тип ремонта"
                      onSelect={handleSelectRepairTier}
                    />
                  )}

                  {currentStep.id === 'designScope' && (
                    <OptionGrid
                      options={DESIGN_SCOPE_OPTIONS}
                      selectedValue={answers.designScope}
                      groupLabel="Состав дизайн-проекта"
                      onSelect={handleSelectDesignScope}
                    />
                  )}

                  {currentStep.id === 'area' && (
                    <div className="border border-border-subtle bg-bg-primary/70 p-6 sm:p-7">
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                          <label
                            htmlFor={`${formId}-area-input`}
                            className="block text-xs uppercase tracking-[0.18em] text-text-muted"
                          >
                            Площадь по полу
                          </label>
                          <p className="mt-2 cursor-default text-3xl font-normal tabular-nums tracking-tight text-text-primary sm:text-4xl">
                            {answers.area}{' '}
                            <span className="font-serif text-2xl italic text-text-secondary">
                              м²
                            </span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <input
                            id={`${formId}-area-input`}
                            type="text"
                            inputMode="numeric"
                            value={areaDraft}
                            onChange={(event) =>
                              handleAreaInputChange(event.target.value)
                            }
                            onBlur={handleAreaInputBlur}
                            aria-describedby={`${formId}-area-hint`}
                            className="w-24 rounded-sm border border-border-subtle bg-bg-secondary px-3.5 py-2.5 text-right text-sm font-medium tabular-nums text-text-primary transition-colors duration-[300ms] ease-[var(--ease-editorial)] focus-visible:border-border-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                          />
                          <span className="cursor-default text-sm text-text-muted">
                            м²
                          </span>
                        </div>
                      </div>

                      <div className="mt-7">
                        <input
                          type="range"
                          min={AREA_MIN}
                          max={AREA_MAX}
                          step={1}
                          value={answers.area}
                          onChange={(event) =>
                            handleAreaChange(Number(event.target.value))
                          }
                          aria-label="Выбор площади объекта в квадратных метрах"
                          className="editorial-range w-full cursor-pointer"
                        />
                        <div
                          id={`${formId}-area-hint`}
                          className="mt-2.5 flex cursor-default items-center justify-between text-xs tabular-nums text-text-muted"
                        >
                          <span>{AREA_MIN} м²</span>
                          <span>170 м²</span>
                          <span>{AREA_MAX} м²</span>
                        </div>
                      </div>

                      <div className="mt-6 border-t border-border-subtle pt-5">
                        <p className="cursor-default text-[11px] uppercase tracking-[0.18em] text-text-muted">
                          Типовые площади
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {AREA_PRESETS.map((preset) => {
                            const isSelected = answers.area === preset;

                            return (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => handleAreaChange(preset)}
                                aria-pressed={isSelected}
                                className={`min-h-11 cursor-pointer rounded-sm border px-3.5 py-2 text-xs font-medium tabular-nums transition-colors duration-[300ms] ease-[var(--ease-editorial)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                                  isSelected
                                    ? 'border-border-accent bg-accent-muted text-accent'
                                    : 'border-border-subtle bg-bg-secondary text-text-secondary hover:border-border-accent hover:text-text-primary'
                                }`}
                              >
                                {preset} м²
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Экран результата и форма захвата контактов */}
            {isResultStep && !isSubmitted && (
              <div>
                <span className="inline-flex cursor-default items-center bg-accent-muted px-3 py-1.5 text-[11px] font-medium uppercase leading-none tracking-[0.18em] text-accent select-none">
                  Предварительный расчёт готов
                </span>

                {/* Статичный блок оценки стоимости без hover-эффектов */}
                <div className="mt-5 cursor-default border border-border-accent bg-bg-elevated p-6 sm:p-7">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-text-muted">
                        Ориентировочная ставка
                      </p>
                      <p className="mt-2 text-3xl font-normal tabular-nums tracking-tight text-text-primary sm:text-4xl">
                        от {formatRubles(estimate.ratePerSqm)}
                        <span className="font-serif text-xl italic text-text-secondary">
                          {' '}
                          / м²
                        </span>
                      </p>
                    </div>

                    <div className="border-t border-border-subtle pt-5 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-text-muted">
                        Бюджет на {answers.area} м²
                      </p>
                      <p className="mt-2 text-xl font-medium tabular-nums text-text-primary sm:text-2xl">
                        {formatRubles(estimate.totalMin)} —{' '}
                        {formatRubles(estimate.totalMax)}
                      </p>
                      <p className="mt-1.5 text-xs text-text-muted">
                        Ориентировочный срок: {estimate.timelineLabel}
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 border-t border-border-subtle pt-4 text-xs leading-relaxed text-text-secondary sm:text-sm">
                    {estimate.headlineNote}
                  </p>

                  <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {estimate.includedHighlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex items-start gap-2 text-xs leading-relaxed text-text-secondary"
                      >
                        <span
                          className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent"
                          aria-hidden="true"
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Спокойная редакционная форма заявки (Verelle Private + ref-1 чекбоксы) */}
                <form
                  onSubmit={handleLeadSubmit}
                  noValidate
                  className="mt-7 border-t border-border-subtle pt-7"
                >
                  <h3 className="cursor-default text-xl font-normal leading-snug tracking-tight text-text-primary sm:text-2xl">
                    Закрепим расчёт и{' '}
                    <span className="font-serif text-[1.12em] font-medium italic">
                      подготовим точную смету
                    </span>
                  </h3>
                  <p className="mt-2 cursor-default text-sm leading-relaxed text-text-secondary">
                    Инженер-сметчик уточнит детали планировки и подготовит детальный расчёт за 24
                    часа — спокойно и без навязчивых звонков.
                  </p>

                  {/* Выбор удобного канала связи (Verelle style) */}
                  <div className="mt-5">
                    <span className="block cursor-default text-xs uppercase tracking-[0.16em] text-text-muted">
                      Удобный способ связи
                    </span>
                    <div
                      role="radiogroup"
                      aria-label="Удобный способ связи"
                      className="mt-2.5 flex flex-wrap gap-2"
                    >
                      {CONTACT_CHANNEL_OPTIONS.map((channel) => {
                        const isActive = leadForm.channel === channel.id;

                        return (
                          <button
                            key={channel.id}
                            type="button"
                            role="radio"
                            aria-checked={isActive}
                            onClick={() =>
                              setLeadForm((prev) => ({
                                ...prev,
                                channel: channel.id,
                              }))
                            }
                            className={`min-h-11 cursor-pointer rounded-sm border px-4 py-2 text-xs font-medium transition-colors duration-[300ms] ease-[var(--ease-editorial)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
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

                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                        value={leadForm.name}
                        onChange={(event) => {
                          setLeadForm((prev) => ({
                            ...prev,
                            name: event.target.value,
                          }));
                          if (formError) {
                            setFormError(null);
                          }
                        }}
                        placeholder="Например, Дмитрий"
                        className="mt-2 w-full rounded-sm border border-border-subtle bg-bg-primary px-4 py-3 text-base text-text-primary placeholder:text-text-muted transition-colors duration-[300ms] ease-[var(--ease-editorial)] focus-visible:border-border-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent sm:text-sm"
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
                        inputMode="tel"
                        required
                        autoComplete="tel"
                        enterKeyHint="send"
                        value={leadForm.phone}
                        onChange={(event) => {
                          setLeadForm((prev) => ({
                            ...prev,
                            phone: event.target.value,
                          }));
                          if (formError) {
                            setFormError(null);
                          }
                        }}
                        placeholder="+7 (900) 000-00-00"
                        className="mt-2 w-full rounded-sm border border-border-subtle bg-bg-primary px-4 py-3 text-base text-text-primary placeholder:text-text-muted transition-colors duration-[300ms] ease-[var(--ease-editorial)] focus-visible:border-border-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* 3 чекбокса согласий по ref-1-nikakih-nervov.md */}
                  <div className="mt-5 space-y-2.5">
                    <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-text-secondary">
                      <input
                        type="checkbox"
                        checked={leadForm.acceptPrivacy}
                        onChange={(event) => {
                          setLeadForm((prev) => ({
                            ...prev,
                            acceptPrivacy: event.target.checked,
                          }));
                          if (formError) {
                            setFormError(null);
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
                        checked={leadForm.acceptPersonalData}
                        onChange={(event) => {
                          setLeadForm((prev) => ({
                            ...prev,
                            acceptPersonalData: event.target.checked,
                          }));
                          if (formError) {
                            setFormError(null);
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
                        checked={leadForm.acceptNewsletter}
                        onChange={(event) =>
                          setLeadForm((prev) => ({
                            ...prev,
                            acceptNewsletter: event.target.checked,
                          }))
                        }
                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-accent"
                      />
                      <span>
                        Хочу получать полезные материалы по ремонту и сезонные предложения
                        (необязательно)
                      </span>
                    </label>
                  </div>

                  {formError && (
                    <p
                      role="alert"
                      className="mt-4 cursor-default border-l-2 border-accent bg-accent-muted px-3.5 py-2.5 text-xs leading-relaxed text-text-primary"
                    >
                      {formError}
                    </p>
                  )}

                  <div className="mt-6 flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-border-subtle bg-bg-primary px-5 py-3.5 text-sm font-normal text-text-secondary transition-colors duration-[300ms] ease-[var(--ease-editorial)] hover:border-border-accent hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent sm:w-auto"
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
                        <path d="M19 12H5" />
                        <path d="m11 18-6-6 6-6" />
                      </svg>
                      <span>Изменить параметры</span>
                    </button>

                    <button
                      type="submit"
                      className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2.5 rounded-sm bg-accent px-7 py-3.5 text-sm font-medium text-text-primary transition-colors duration-[350ms] ease-[var(--ease-editorial)] hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary sm:w-auto"
                    >
                      <span>Получить точную смету</span>
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
                </form>
              </div>
            )}

            {/* Экран подтверждения отправки */}
            {isResultStep && isSubmitted && (
              <div
                aria-live="polite"
                className="cursor-default border border-border-accent bg-bg-elevated p-6 sm:p-8"
              >
                <span className="inline-flex items-center bg-accent-muted px-3 py-1.5 text-[11px] font-medium uppercase leading-none tracking-[0.18em] text-accent select-none">
                  Расчёт отправлен инженеру
                </span>

                <h3 className="mt-5 text-2xl font-normal leading-snug tracking-tight text-text-primary sm:text-3xl">
                  Спасибо, {leadForm.name.trim()}.{' '}
                  <span className="font-serif text-[1.12em] font-medium italic">
                    Мы уже приняли параметры
                  </span>
                </h3>

                <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary">
                  Инженер-сметчик свяжется с вами в рабочее время через выбранный способ связи (
                  {CONTACT_CHANNEL_OPTIONS.find((c) => c.id === leadForm.channel)?.label}),
                  уточнит детали объекта и подготовит фиксированную смету за 24 часа.
                </p>

                <dl className="mt-6 grid grid-cols-1 gap-px border border-border-subtle bg-border-subtle sm:grid-cols-2">
                  <div className="bg-bg-secondary px-4 py-3.5">
                    <dt className="text-[11px] uppercase tracking-[0.16em] text-text-muted">
                      Ориентир ставки
                    </dt>
                    <dd className="mt-1 text-base font-medium tabular-nums text-text-primary">
                      от {formatRubles(estimate.ratePerSqm)}/м²
                    </dd>
                  </div>
                  <div className="bg-bg-secondary px-4 py-3.5">
                    <dt className="text-[11px] uppercase tracking-[0.16em] text-text-muted">
                      Площадь и срок
                    </dt>
                    <dd className="mt-1 text-base font-medium tabular-nums text-text-primary">
                      {answers.area} м² · {estimate.timelineLabel}
                    </dd>
                  </div>
                </dl>

                <div className="mt-7">
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-border-subtle bg-bg-secondary px-5 py-3 text-sm font-normal text-text-primary transition-colors duration-[300ms] ease-[var(--ease-editorial)] hover:border-border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                  >
                    <span>Пройти расчёт для другого объекта</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Навигация шагов (скрывается на экране результата, где свои действия формы) */}
          {!isResultStep && (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-6">
              {safeStepIndex > 0 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-border-subtle bg-bg-primary px-5 py-3.5 text-sm font-normal text-text-secondary transition-colors duration-[300ms] ease-[var(--ease-editorial)] hover:border-border-accent hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
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
                    <path d="M19 12H5" />
                    <path d="m11 18-6-6 6-6" />
                  </svg>
                  <span>Назад</span>
                </button>
              ) : (
                <span className="cursor-default text-xs text-text-muted">
                  Выберите один вариант для продолжения
                </span>
              )}

              <button
                type="button"
                disabled={!canProceed}
                onClick={handleNext}
                className={
                  canProceed
                    ? 'inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-sm bg-accent px-7 py-3.5 text-sm font-medium text-text-primary transition-colors duration-[350ms] ease-[var(--ease-editorial)] hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary'
                    : 'inline-flex cursor-not-allowed items-center justify-center gap-2.5 rounded-sm border border-border-subtle bg-bg-elevated px-7 py-3.5 text-sm font-medium text-text-muted opacity-60'
                }
              >
                <span>{isLastQuestionStep ? 'Показать расчёт' : 'Далее'}</span>
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
          )}
        </div>

        {/* Правая статичная сводка параметров: строго cursor-default, без ложных hover-эффектов */}
        <aside className="flex cursor-default flex-col justify-between border-t border-border-subtle bg-bg-elevated p-5 sm:p-8 lg:col-span-4 lg:border-t-0 lg:border-l">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-text-muted">
              Сводка параметров
            </p>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Выбранные условия автоматически формируют предварительную ставку за м².
            </p>

            <dl className="mt-6 space-y-3.5 border-t border-border-subtle pt-5">
              {summaryRows.map((row) => (
                <div
                  key={row.id}
                  className="flex items-baseline justify-between gap-4 text-xs"
                >
                  <dt className="flex shrink-0 items-center gap-2 text-text-muted">
                    <span
                      className={`font-serif italic ${
                        row.isActive || row.value ? 'text-accent' : 'text-text-muted'
                      }`}
                    >
                      {row.number}
                    </span>
                    <span>{row.label}</span>
                  </dt>
                  <dd
                    className={`truncate text-right ${
                      row.value ? 'font-medium text-text-primary' : 'text-text-muted'
                    }`}
                  >
                    {row.value ?? '—'}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Живой ориентир ставки после выбора типа услуги */}
            <div className="mt-6 border border-border-subtle bg-bg-secondary p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-text-muted">
                Текущий ориентир
              </p>
              {answers.service ? (
                <div className="mt-2">
                  <p className="text-xl font-medium tabular-nums text-text-primary">
                    от {formatRubles(estimate.ratePerSqm)}
                    <span className="font-serif text-base italic text-text-secondary">
                      {' '}
                      / м²
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-text-muted">
                    Уточняется с каждым следующим шагом
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-sm text-text-secondary">
                  Выберите направление на шаге 01, чтобы увидеть базовую ставку.
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 border-t border-border-subtle pt-5">
            <p className="text-xs leading-relaxed text-text-muted">
              Бесплатный выезд инженера и фиксированная смета за 24 часа — при заключении
              договора в течение 14 дней действует скидка 5%.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
