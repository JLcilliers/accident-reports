import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { list } from "@vercel/blob";
import { COMPOSITIONS } from "@/lib/images/compositions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Illustration test runs",
  robots: { index: false, follow: false },
};

interface TestRecord {
  run?: string;
  slug: string;
  headline?: string;
  status: "OK" | "FAILED";
  url: string | null;
  alt: string | null;
  composition?: string | null;
  compositionLabel?: string | null;
  look?: { time: string; weather: string; season: string } | null;
  cues?: { vehicles: string[]; road: string } | null;
  nearest?: number | null;
  costUsd: number;
  attempts: { attempt: number; composition?: string; check: Record<string, boolean> | null; error?: string }[];
  error?: string;
}

const ORDER = COMPOSITIONS.map((c) => c.name);

/** Preview-only page that shows the dry-run test images side by side; it doesn't exist in production. */
export default async function ImageTestPage({ searchParams }: { searchParams: Promise<{ day?: string }> }) {
  if (process.env.VERCEL_ENV === "production") notFound();

  const { blobs } = await list({ prefix: "illustrations/tests/", limit: 1000 });
  const records = await Promise.all(
    blobs
      .filter((blob) => blob.pathname.endsWith(".json"))
      .map(async (blob) => ({
        day: blob.pathname.split("/")[2],
        record: (await (await fetch(blob.url, { cache: "no-store" })).json()) as TestRecord,
      }))
  );
  const days = [...new Set(records.map((r) => r.day))].sort().reverse();
  const { day: requested } = await searchParams;
  const day = requested && days.includes(requested) ? requested : days[0];
  const shown = records
    .filter((r) => r.day === day)
    .map((r) => r.record)
    .sort((a, b) => ORDER.indexOf(a.composition ?? "") - ORDER.indexOf(b.composition ?? "") || (a.run ?? "").localeCompare(b.run ?? ""));
  const total = shown.reduce((sum, r) => sum + r.costUsd, 0);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Illustration test runs</h1>
      <p className="mt-2 text-sm text-neutral-600">
        {day ? `${day}: ${shown.length} images, $${total.toFixed(4)} in total.` : "No test runs yet."} Dry runs only: none of these
        images is attached to an incident.
      </p>
      {days.length > 1 && (
        <p className="mt-2 text-sm">
          Other days:{" "}
          {days
            .filter((d) => d !== day)
            .map((d) => (
              <Link key={d} href={`?day=${d}`} className="mr-3 text-teal-700 underline">
                {d}
              </Link>
            ))}
        </p>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((r) => {
          const check = r.attempts.findLast((a) => a.check)?.check;
          return (
            <article key={`${r.run}-${r.slug}-${r.composition}`} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              {r.url && r.alt ? (
                <Image src={r.url} alt={r.alt} width={1200} height={675} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="h-auto w-full" />
              ) : (
                <div className="flex aspect-[16/9] items-center justify-center bg-neutral-100 p-4 text-sm text-neutral-600">
                  No image: {r.error ?? r.attempts.map((a) => a.error).filter(Boolean).join("; ")}
                </div>
              )}
              <div className="space-y-2 p-4 text-sm text-neutral-700">
                <p className="font-semibold text-neutral-900">{r.compositionLabel ?? r.composition ?? "No composition (older test)"}</p>
                {r.headline && <p className="text-neutral-500">For: {r.headline}</p>}
                {r.look && (
                  <p>
                    {r.look.time}, {r.look.weather}, {r.look.season}
                    {r.cues ? ` · ${r.cues.vehicles.join(" and ") || "unspecified vehicles"} · ${r.cues.road} road` : ""}
                  </p>
                )}
                <p>
                  Check:{" "}
                  {check
                    ? Object.entries(check)
                        .map(([k, v]) => `${k} ${v ? "FLAGGED" : "no"}`)
                        .join(", ")
                    : "none"}
                </p>
                <p>Alt: {r.alt ?? "none"}</p>
                <p>
                  Cost ${r.costUsd.toFixed(4)} · {r.attempts.length} attempt{r.attempts.length === 1 ? "" : "s"}
                  {typeof r.nearest === "number" ? ` · nearest earlier image ${r.nearest}/64 bits apart` : ""}
                </p>
                {r.attempts
                  .filter((a) => a.error)
                  .map((a) => (
                    <p key={a.attempt} className="text-amber-700">
                      Attempt {a.attempt} ({a.composition}): {a.error}
                    </p>
                  ))}
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
