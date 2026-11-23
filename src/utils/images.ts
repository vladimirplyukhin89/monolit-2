import type { ImageMetadata } from 'astro';

const IMAGES_ROOT = '/src/assets/images/';

const IMAGE_MODULES = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true },
);

const SVG_LOGO_MODULES = import.meta.glob<string>(
  '/src/assets/images/common/logo.svg',
  { eager: true, query: '?raw', import: 'default' },
);

export type LogoAsset =
  | { readonly kind: 'svg'; readonly rawSvg: string }
  | { readonly kind: 'raster'; readonly image: ImageMetadata }
  | { readonly kind: 'text' };

export interface GetImageAssetOptions {
  /**
   * Возвращать ли единую подстраховочную картинку common/fallback.* при отсутствии целевой.
   * По умолчанию: true.
   */
  readonly useFallback?: boolean;
}

interface IndexedImageEntry {
  readonly normalizedPath: string;
  readonly pathWithoutExt: string;
  readonly directory: string;
  readonly metadata: ImageMetadata;
}

function normalizeRelativePath(input: string): string {
  return input
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/^src\/assets\/images\//, '');
}

function stripExtension(path: string): string {
  const lastDot = path.lastIndexOf('.');
  const lastSlash = path.lastIndexOf('/');
  if (lastDot > lastSlash) {
    return path.slice(0, lastDot);
  }
  return path;
}

function extractDirectory(path: string): string {
  const lastSlash = path.lastIndexOf('/');
  return lastSlash === -1 ? '' : path.slice(0, lastSlash);
}

const INDEXED_IMAGES: readonly IndexedImageEntry[] = Object.entries(IMAGE_MODULES)
  .map(([fullPath, mod]) => {
    const relativePath = fullPath.startsWith(IMAGES_ROOT)
      ? fullPath.slice(IMAGES_ROOT.length)
      : normalizeRelativePath(fullPath);

    return {
      normalizedPath: relativePath,
      pathWithoutExt: stripExtension(relativePath).toLowerCase(),
      directory: extractDirectory(relativePath).toLowerCase(),
      metadata: mod.default,
    };
  })
  .sort((a, b) => a.normalizedPath.localeCompare(b.normalizedPath, 'ru'));

/**
 * Возвращает единую подстраховочную картинку из src/assets/images/common/fallback.*
 * (поддерживает jpg, jpeg, png, webp, avif). Если её нет — возвращает null.
 */
export function getFallbackImage(): ImageMetadata | null {
  const fallbackEntry = INDEXED_IMAGES.find(
    (entry) => entry.pathWithoutExt === 'common/fallback',
  );
  return fallbackEntry?.metadata ?? null;
}

/**
 * Загружает изображение из src/assets/images/ по относительному пути.
 * Поддерживает поиск как с точным расширением, так и без привязки к расширению
 * (например, 'hub/remont-card.jpg' автоматически найдёт 'hub/remont-card.webp').
 * При отсутствии файла возвращает common/fallback.* (или null, если fallback тоже отсутствует).
 */
export function getImageAsset(
  relativePath: string,
  options: GetImageAssetOptions = {},
): ImageMetadata | null {
  const { useFallback = true } = options;
  const normalized = normalizeRelativePath(relativePath);
  const lowerNormalized = normalized.toLowerCase();

  const exactMatch = INDEXED_IMAGES.find(
    (entry) => entry.normalizedPath.toLowerCase() === lowerNormalized,
  );
  if (exactMatch) {
    return exactMatch.metadata;
  }

  const targetWithoutExt = stripExtension(normalized).toLowerCase();
  const baseMatch = INDEXED_IMAGES.find(
    (entry) => entry.pathWithoutExt === targetWithoutExt,
  );
  if (baseMatch) {
    return baseMatch.metadata;
  }

  return useFallback ? getFallbackImage() : null;
}

/**
 * Возвращает список всех изображений в указанной директории внутри src/assets/images/.
 * По умолчанию ищет рекурсивно внутри подпапок.
 */
export function getImagesInDir(
  dirRelativePath: string,
  options: { readonly recursive?: boolean } = {},
): readonly ImageMetadata[] {
  const { recursive = true } = options;
  const normalizedDir = normalizeRelativePath(dirRelativePath)
    .replace(/\/+$/, '')
    .toLowerCase();

  return INDEXED_IMAGES.filter((entry) => {
    if (recursive) {
      return (
        entry.directory === normalizedDir ||
        entry.directory.startsWith(`${normalizedDir}/`)
      );
    }
    return entry.directory === normalizedDir;
  }).map((entry) => entry.metadata);
}

/**
 * Возвращает первое найденное изображение в папке src/assets/images/<dir>.
 * Если папка пуста, автоматически возвращает common/fallback.* (или null).
 */
export function getFirstImageInDir(
  dirRelativePath: string,
  options: GetImageAssetOptions & { readonly recursive?: boolean } = {},
): ImageMetadata | null {
  const { useFallback = true, recursive = true } = options;
  const images = getImagesInDir(dirRelativePath, { recursive });

  if (images.length > 0) {
    return images[0];
  }

  return useFallback ? getFallbackImage() : null;
}

/**
 * Ищет логотип компании в src/assets/images/common/ (logo.svg или logo.png/webp/jpg).
 * Если файлов нет — возвращает { kind: 'text' } для аккуратного текстового логотипа «МОНОЛИТ».
 */
export function getLogoAsset(): LogoAsset {
  const rawSvg = Object.values(SVG_LOGO_MODULES)[0];
  if (typeof rawSvg === 'string' && rawSvg.trim().length > 0) {
    return {
      kind: 'svg',
      rawSvg,
    };
  }

  const rasterLogo = INDEXED_IMAGES.find(
    (entry) => entry.pathWithoutExt === 'common/logo',
  );
  if (rasterLogo) {
    return {
      kind: 'raster',
      image: rasterLogo.metadata,
    };
  }

  return { kind: 'text' };
}
