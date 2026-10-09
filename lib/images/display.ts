const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.carcrashreport.com";

export const ILLUSTRATION_WIDTH = 1200;
export const ILLUSTRATION_HEIGHT = 675;

export const DEFAULT_ILLUSTRATION = {
  src: "/images/default-illustration.webp",
  alt: "A car drives on a highway at night under a full moon with rolling hills in the background",
};

export interface Illustration {
  src: string;
  alt: string;
  isDefault: boolean;
}

/** The record's own illustration when it has one, otherwise the site-wide default. */
export function pickIllustration(record: {
  imageUrl?: string | null;
  imageAlt?: string | null;
  imageStatus?: string | null;
}): Illustration {
  if (record.imageStatus === "OK" && record.imageUrl) {
    return { src: record.imageUrl, alt: record.imageAlt || DEFAULT_ILLUSTRATION.alt, isDefault: false };
  }
  return { ...DEFAULT_ILLUSTRATION, isDefault: true };
}

export function absoluteImageUrl(src: string): string {
  return src.startsWith("http") ? src : `${BASE_URL}${src}`;
}
