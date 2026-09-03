export function parseWidths(json: string): number[] {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed.filter((n): n is number => typeof n === 'number') : [];
  } catch {
    return [];
  }
}

export const srcset = (basename: string, widths: number[], format: 'avif' | 'webp' | 'jpg') =>
  widths.map((w) => `/uploads/${basename}-${w}.${format} ${w}w`).join(', ');

export const fallbackSrc = (basename: string, widths: number[]) =>
  `/uploads/${basename}-${widths[widths.length - 1] ?? 800}.jpg`;
