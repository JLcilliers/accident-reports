import { CRASH_REPORT_GUIDES } from "@/data/crash-report-guides";

export interface GuideItem {
  text: string;
  sources: number[];
}

export interface GuideSections {
  whoHolds: GuideItem[];
  howToRequest: GuideItem[];
  whatYouNeed: GuideItem[];
  cost: GuideItem[];
  timing: GuideItem[];
  whoCanRequest: GuideItem[];
  localAgencies: GuideItem[];
  selfReport: GuideItem[];
}

export interface CrashReportGuide {
  code: string;
  name: string;
  slug: string;
  inName: string;
  checkedOn: string;
  summary: GuideItem | null;
  sections: GuideSections;
  links: { label: string; url: string }[];
  flags: { topic: string; text: string }[];
  sources: { url: string }[];
}

export const SECTION_TITLES: { key: keyof GuideSections; title: string }[] = [
  { key: "whoHolds", title: "Who keeps crash reports" },
  { key: "howToRequest", title: "How to request a copy" },
  { key: "whatYouNeed", title: "What you'll need" },
  { key: "cost", title: "What it costs" },
  { key: "timing", title: "How long it takes" },
  { key: "whoCanRequest", title: "Who can get a copy" },
  { key: "localAgencies", title: "If city police or a sheriff handled the crash" },
  { key: "selfReport", title: "Do you need to file your own report?" },
];

export { CRASH_REPORT_GUIDES };

export function getGuideBySlug(slug: string): CrashReportGuide | undefined {
  return CRASH_REPORT_GUIDES.find((g) => g.slug === slug.toLowerCase());
}

export function getGuideByCode(code: string | null | undefined): CrashReportGuide | undefined {
  if (!code) return undefined;
  return CRASH_REPORT_GUIDES.find((g) => g.code === code.toUpperCase());
}

export function formatCheckedOn(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
