import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';

export interface BeforeAfterSliderProps {
  readonly beforeSrc: string;
  readonly afterSrc: string;
  readonly beforeAlt: string;
  readonly afterAlt: string;
  readonly beforeLabel?: string;
  readonly afterLabel?: string;
  readonly initialPosition?: number;
  readonly ariaLabel?: string;
}

const MIN_POSITION = 0;
const MAX_POSITION = 100;

function clampPosition(value: number): number {
  return Math.min(MAX_POSITION, Math.max(MIN_POSITION, value));
}

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  beforeLabel = 'До ремонта',
  afterLabel = 'После ремонта',
  initialPosition = 50,
  ariaLabel = 'Сравнение интерьера до и после ремонта',
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const pendingClientXRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  const [position, setPosition] = useState<number>(() =>
    clampPosition(initialPosition),
  );
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isAnimatingStep, setIsAnimatingStep] = useState<boolean>(false);

  const updatePositionFromClientX = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();
    if (rect.width <= 0) {
      return;
    }

    const ratio = ((clientX - rect.left) / rect.width) * 100;
    setPosition(clampPosition(ratio));
  }, []);

  const queuePositionFromClientX = useCallback(
    (clientX: number) => {
      pendingClientXRef.current = clientX;
      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        const nextClientX = pendingClientXRef.current;
        pendingClientXRef.current = null;
        if (nextClientX !== null) {
          updatePositionFromClientX(nextClientX);
        }
      });
    },
    [updatePositionFromClientX],
  );

  const startDrag = useCallback(
    (
      event: ReactPointerEvent<HTMLElement>,
      captureTarget: HTMLElement,
    ) => {
      if (event.pointerType === 'mouse' && event.button !== 0) {
        return;
      }

      activePointerIdRef.current = event.pointerId;
      setIsAnimatingStep(false);
      setIsDragging(true);

      try {
        captureTarget.setPointerCapture(event.pointerId);
      } catch {
        // Fallback if pointer capture is unavailable in the environment
      }

      updatePositionFromClientX(event.clientX);
    },
    [updatePositionFromClientX],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (activePointerIdRef.current !== event.pointerId) {
        return;
      }

      if (event.cancelable) {
        event.preventDefault();
      }

      queuePositionFromClientX(event.clientX);
    },
    [queuePositionFromClientX],
  );

  const stopDrag = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (activePointerIdRef.current !== event.pointerId) {
      return;
    }

    activePointerIdRef.current = null;
    setIsDragging(false);

    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {
      // Ignore release errors when pointer already ended
    }
  }, []);

  const handleStagePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'mouse') {
        startDrag(event, event.currentTarget);
        return;
      }

      // На тач-экранах одиночный тап по фото плавно переводит шторку,
      // не перехватывая вертикальный скролл страницы (touch-pan-y).
      setIsAnimatingStep(true);
      updatePositionFromClientX(event.clientX);
    },
    [startDrag, updatePositionFromClientX],
  );

  const handleRailPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      event.stopPropagation();
      startDrag(event, event.currentTarget);
    },
    [startDrag],
  );

  const jumpToPosition = useCallback((targetPosition: number) => {
    setIsDragging(false);
    setIsAnimatingStep(true);
    setPosition(clampPosition(targetPosition));
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const step = event.shiftKey ? 10 : 3;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          setIsAnimatingStep(true);
          setPosition((prev) => clampPosition(prev - step));
          break;
        case 'ArrowRight':
          event.preventDefault();
          setIsAnimatingStep(true);
          setPosition((prev) => clampPosition(prev + step));
          break;
        case 'Home':
          event.preventDefault();
          jumpToPosition(0);
          break;
        case 'End':
          event.preventDefault();
          jumpToPosition(100);
          break;
        default:
          break;
      }
    },
    [jumpToPosition],
  );

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) {
      return;
    }

    const handleTouchMove = (event: TouchEvent): void => {
      if (activePointerIdRef.current === null) {
        return;
      }

      if (event.cancelable) {
        event.preventDefault();
      }

      const touch = event.touches[0];
      if (!touch) {
        return;
      }

      queuePositionFromClientX(touch.clientX);
    };

    rail.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      rail.removeEventListener('touchmove', handleTouchMove);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [queuePositionFromClientX]);

  useEffect(() => {
    if (!isAnimatingStep) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsAnimatingStep(false);
    }, 360);

    return () => window.clearTimeout(timer);
  }, [isAnimatingStep, position]);

  const roundedPosition = Math.round(position);
  const transitionClass =
    isAnimatingStep && !isDragging
      ? 'transition-[clip-path,left] duration-[350ms] ease-[var(--ease-editorial)] motion-reduce:transition-none'
      : 'transition-none';

  return (
    <div className="flex flex-col border border-border-subtle bg-bg-secondary">
      {/* Единый совмещённый фрейм «До / После» */}
      <div
        ref={containerRef}
        onPointerDown={handleStagePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        className="relative aspect-[4/3] w-full touch-pan-y overflow-hidden bg-bg-primary select-none sm:aspect-[16/11]"
      >
        {/* Базовый слой: После ремонта */}
        <img
          src={afterSrc}
          alt={afterAlt}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center select-none"
        />

        {/* Верхний обрезаемый слой: До ремонта (clip-path без деформации фото) */}
        <div
          aria-hidden="true"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          className={`pointer-events-none absolute inset-0 overflow-hidden ${transitionClass}`}
        >
          <img
            src={beforeSrc}
            alt={beforeAlt}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="pointer-events-none h-full w-full object-cover object-center select-none"
          />
        </div>

        {/* Деликатное верхнее затемнение для читаемости подписей */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-bg-primary/65 via-bg-primary/20 to-transparent"
        />

        {/* Статичные информационные подписи «До» / «После» */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute top-4 left-4 z-10 inline-flex max-w-[44%] items-center truncate border border-border-subtle bg-bg-primary/85 px-3 py-1.5 text-[11px] font-medium uppercase leading-none tracking-[0.16em] text-text-secondary backdrop-blur-sm transition-opacity duration-300 select-none ${
            position < 22 ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {beforeLabel}
        </span>

        <span
          aria-hidden="true"
          className={`pointer-events-none absolute top-4 right-4 z-10 inline-flex max-w-[44%] items-center truncate border border-border-accent bg-bg-primary/85 px-3 py-1.5 text-[11px] font-medium uppercase leading-none tracking-[0.16em] text-text-primary backdrop-blur-sm transition-opacity duration-300 select-none ${
            position > 78 ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {afterLabel}
        </span>

        {/* Вертикальная шторка и широкая тач-зона захвата (44px) */}
        <div
          role="slider"
          tabIndex={0}
          aria-label={ariaLabel}
          aria-valuemin={MIN_POSITION}
          aria-valuemax={MAX_POSITION}
          aria-valuenow={roundedPosition}
          aria-valuetext={`${roundedPosition}% ${beforeLabel.toLowerCase()}, ${100 - roundedPosition}% ${afterLabel.toLowerCase()}`}
          onKeyDown={handleKeyDown}
          onPointerDown={handleRailPointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          ref={railRef}
          style={{ left: `${position}%`, touchAction: 'none' }}
          className={`group absolute inset-y-0 z-20 flex w-11 -translate-x-1/2 touch-none cursor-ew-resize items-center justify-center focus-visible:outline-none ${transitionClass}`}
        >
          {/* Тонкая разделительная линия */}
          <span
            aria-hidden="true"
            className={`pointer-events-none h-full w-px transition-colors duration-300 ${
              isDragging
                ? 'bg-accent'
                : 'bg-text-primary/85 group-hover:bg-accent group-focus-visible:bg-accent'
            }`}
          />

          {/* Круглая ручка ползунка */}
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md transition-colors duration-[300ms] ease-[var(--ease-editorial)] group-focus-visible:ring-2 group-focus-visible:ring-accent group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-bg-primary ${
              isDragging
                ? 'border-accent bg-accent text-white'
                : 'border-border-accent bg-bg-primary/90 text-white group-hover:border-accent group-hover:bg-accent'
            }`}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 7-5 5 5 5" />
              <path d="m15 7 5 5-5 5" />
            </svg>
          </span>
        </div>
      </div>

      {/* Спокойная панель управления под слайдером */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle bg-bg-elevated px-5 py-3.5 sm:px-6">
        <p className="cursor-default text-xs text-text-muted">
          Потяните шторку влево или вправо, чтобы сравнить результат
        </p>

        <div
          className="inline-flex items-center gap-1.5"
          role="group"
          aria-label="Быстрые позиции сравнения"
        >
          <button
            type="button"
            onClick={() => jumpToPosition(100)}
            className={`min-h-11 cursor-pointer rounded-sm border px-3.5 py-2 text-[11px] font-medium uppercase leading-none tracking-[0.14em] transition-colors duration-[300ms] ease-[var(--ease-editorial)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
              roundedPosition >= 95
                ? 'border-border-accent bg-accent-muted text-accent'
                : 'border-border-subtle bg-bg-secondary text-text-secondary hover:border-border-accent hover:text-text-primary'
            }`}
          >
            До
          </button>
          <button
            type="button"
            onClick={() => jumpToPosition(50)}
            className={`min-h-11 cursor-pointer rounded-sm border px-3.5 py-2 text-[11px] font-medium uppercase leading-none tracking-[0.14em] transition-colors duration-[300ms] ease-[var(--ease-editorial)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
              roundedPosition >= 45 && roundedPosition <= 55
                ? 'border-border-accent bg-accent-muted text-accent'
                : 'border-border-subtle bg-bg-secondary text-text-secondary hover:border-border-accent hover:text-text-primary'
            }`}
          >
            50 / 50
          </button>
          <button
            type="button"
            onClick={() => jumpToPosition(0)}
            className={`min-h-11 cursor-pointer rounded-sm border px-3.5 py-2 text-[11px] font-medium uppercase leading-none tracking-[0.14em] transition-colors duration-[300ms] ease-[var(--ease-editorial)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
              roundedPosition <= 5
                ? 'border-border-accent bg-accent-muted text-accent'
                : 'border-border-subtle bg-bg-secondary text-text-secondary hover:border-border-accent hover:text-text-primary'
            }`}
          >
            После
          </button>
        </div>
      </div>
    </div>
  );
}
