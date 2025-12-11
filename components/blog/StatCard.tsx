interface StatCardProps {
  value: string;
  label: string;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  source?: string;
  sourceUrl?: string;
}

export default function StatCard({
  value,
  label,
  description,
  trend,
  trendValue,
  source,
  sourceUrl,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-neutral-100 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all">
      <div className="flex items-start justify-between mb-2">
        <span className="text-3xl font-medium text-neutral-900 tracking-tight">
          {value}
        </span>
        {trend && trendValue && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              trend === "down"
                ? "bg-[#E8F5F2] text-[#2A7D6E]"
                : trend === "up"
                ? "bg-red-50 text-red-600"
                : "bg-neutral-100 text-neutral-600"
            }`}
          >
            {trend === "down" ? "↓" : trend === "up" ? "↑" : "→"} {trendValue}
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-neutral-700 mb-1">{label}</p>
      {description && (
        <p className="text-xs text-neutral-500 leading-relaxed">{description}</p>
      )}
      {source && (
        <p className="text-xs text-neutral-400 mt-3">
          Source:{" "}
          {sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2A7D6E] hover:underline"
            >
              {source}
            </a>
          ) : (
            source
          )}
        </p>
      )}
    </div>
  );
}
