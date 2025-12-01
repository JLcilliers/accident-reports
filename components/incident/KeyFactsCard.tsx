/**
 * KeyFactsCard - Two-column grid display for key incident facts
 * Shows location, date, injuries, vehicles, etc. in a scannable format
 */

import type { AccidentFacts } from "@/lib/seo/extractAccidentFacts";

interface KeyFactsCardProps {
  facts: AccidentFacts | null;
  location: string;
  formattedDate: string;
  sourceCount: number;
  city?: string | null;
  state?: string | null;
}

interface FactItemProps {
  label: string;
  value: string | number | null | undefined;
  icon?: React.ReactNode;
}

function FactItem({ label, value, icon }: FactItemProps) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
      {icon && (
        <span className="flex-shrink-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-500 shadow-sm">
          {icon}
        </span>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-medium text-slate-900 mt-0.5 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

// Icons as inline SVGs
const LocationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

const CarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
  </svg>
);

const InjuryIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const AgencyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const NewsIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
  </svg>
);

const RoadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
  </svg>
);

export function KeyFactsCard({
  facts,
  location,
  formattedDate,
  sourceCount,
  city,
  state,
}: KeyFactsCardProps) {
  // Build display values
  const displayLocation = facts?.primaryLocation ||
    (city && state ? `${city}, ${state}` : state ?? "Not specified");

  const timeInfo = facts?.timeOfCrashApprox
    ? `${formattedDate} (${facts.timeOfCrashApprox})`
    : formattedDate;

  const vehiclesInfo = facts?.vehicles?.length
    ? facts.vehicles.map((v) =>
        v.ownerCompany ? `${v.type} (${v.ownerCompany})` : v.type
      ).join(", ")
    : null;

  const roadsInfo = facts?.roads?.length ? facts.roads.join(", ") : null;

  const injuriesInfo = facts?.injuriesCount || null;
  const fatalitiesInfo = facts?.fatalitiesCount || null;

  const agenciesInfo = facts?.agenciesInvolved?.length
    ? facts.agenciesInvolved.join(", ")
    : null;

  return (
    <section className="bg-slate-100/80 rounded-2xl border border-slate-200 p-4 sm:p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
        <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full"></span>
        Key Facts
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FactItem label="Location" value={displayLocation} icon={<LocationIcon />} />
        <FactItem label="Date & Time" value={timeInfo} icon={<CalendarIcon />} />
        {roadsInfo && <FactItem label="Roads / Highways" value={roadsInfo} icon={<RoadIcon />} />}
        {vehiclesInfo && <FactItem label="Vehicles Involved" value={vehiclesInfo} icon={<CarIcon />} />}
        {injuriesInfo && <FactItem label="Injuries Reported" value={injuriesInfo} icon={<InjuryIcon />} />}
        {fatalitiesInfo && <FactItem label="Fatalities" value={fatalitiesInfo} icon={<InjuryIcon />} />}
        {agenciesInfo && <FactItem label="Responding Agencies" value={agenciesInfo} icon={<AgencyIcon />} />}
        <FactItem label="News Sources" value={`${sourceCount} source${sourceCount !== 1 ? "s" : ""}`} icon={<NewsIcon />} />
      </div>
      <p className="text-xs text-slate-500 mt-4 leading-relaxed">
        These details are from publicly available news coverage and may not include every fact in the official police report.
      </p>
    </section>
  );
}
