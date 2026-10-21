import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDE_HEROES } from "@/data/guide-heroes";
import { getGuideBySlug } from "@/lib/crashReportGuides";
import { compositionByName } from "@/lib/images/compositions";

export const metadata: Metadata = {
  title: "Guide hero images",
  robots: { index: false, follow: false },
};

/** Preview-only page that shows every crash report guide hero side by side; it doesn't exist in production. */
export default function GuideHeroesPage() {
  if (process.env.VERCEL_ENV === "production") notFound();

  const heroes = Object.entries(GUIDE_HEROES).map(([slug, hero]) => ({
    slug,
    name: slug === "index" ? "All guides (/crash-reports)" : getGuideBySlug(slug)?.name ?? slug,
    href: slug === "index" ? "/crash-reports" : `/crash-reports/${slug}`,
    ...hero,
  }));
  const total = heroes.reduce((sum, h) => sum + h.costUsd, 0);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Guide hero images</h1>
      <p className="mt-2 text-sm text-neutral-600">
        {heroes.length} images, ${total.toFixed(4)} in total.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {heroes.map((h) => (
          <article key={h.slug} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <Image src={h.src} alt={h.alt} width={1200} height={675} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="h-auto w-full" />
            <div className="space-y-2 p-4 text-sm text-neutral-700">
              <p className="font-semibold text-neutral-900">
                <Link href={h.href} className="text-teal-700 underline">
                  {h.name}
                </Link>
              </p>
              <p>{compositionByName(h.composition)?.label ?? h.composition}</p>
              <p>Alt: {h.alt}</p>
              <p>
                Cost ${h.costUsd.toFixed(4)} · {h.attempts} attempt{h.attempts === 1 ? "" : "s"}
              </p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
