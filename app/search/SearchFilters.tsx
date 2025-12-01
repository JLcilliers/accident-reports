"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

interface StateOption {
  code: string;
  name: string;
  count: number;
}

interface SearchFiltersProps {
  availableStates: StateOption[];
  currentQuery: string;
  currentState: string;
  currentDateRange: string;
}

const DATE_RANGE_OPTIONS = [
  { value: "", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "Past Week" },
  { value: "month", label: "Past Month" },
  { value: "3months", label: "Past 3 Months" },
];

export function SearchFilters({
  availableStates,
  currentQuery,
  currentState,
  currentDateRange,
}: SearchFiltersProps) {
  const router = useRouter();
  const [query, setQuery] = useState(currentQuery);
  const [state, setState] = useState(currentState);
  const [dateRange, setDateRange] = useState(currentDateRange);

  const applyFilters = useCallback(
    (newQuery?: string, newState?: string, newDateRange?: string) => {
      const q = newQuery ?? query;
      const s = newState ?? state;
      const d = newDateRange ?? dateRange;

      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (s) params.set("state", s);
      if (d) params.set("dateRange", d);

      router.push(`/search?${params.toString()}`);
    },
    [router, query, state, dateRange]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const handleStateChange = (newState: string) => {
    setState(newState);
    applyFilters(query, newState, dateRange);
  };

  const handleDateRangeChange = (newDateRange: string) => {
    setDateRange(newDateRange);
    applyFilters(query, state, newDateRange);
  };

  const clearFilters = () => {
    setQuery("");
    setState("");
    setDateRange("");
    router.push("/search");
  };

  const hasFilters = query || state || dateRange;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by city, state, road, or keyword..."
            className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2A7D6E] focus:border-transparent text-sm"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-[#2A7D6E] hover:bg-[#236859] text-white font-medium rounded-xl transition-colors text-sm"
        >
          Search
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* State Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-neutral-600 font-medium">State:</label>
          <select
            value={state}
            onChange={(e) => handleStateChange(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-lg text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A7D6E] bg-white min-w-[140px]"
          >
            <option value="">All States</option>
            {availableStates.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name} ({s.count})
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-neutral-600 font-medium">Date:</label>
          <select
            value={dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-lg text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A7D6E] bg-white min-w-[140px]"
          >
            {DATE_RANGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="px-3 py-2 text-neutral-600 hover:text-neutral-800 text-sm font-medium flex items-center gap-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear All
          </button>
        )}
      </div>

      {/* Active Filters Tags */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2">
          {query && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8F5F2] text-[#2A7D6E] text-sm rounded-full">
              Search: &quot;{query}&quot;
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  applyFilters("", state, dateRange);
                }}
                className="hover:text-[#1d5c51]"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {state && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8F5F2] text-[#2A7D6E] text-sm rounded-full">
              State: {availableStates.find((s) => s.code === state)?.name || state}
              <button
                type="button"
                onClick={() => {
                  setState("");
                  applyFilters(query, "", dateRange);
                }}
                className="hover:text-[#1d5c51]"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {dateRange && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8F5F2] text-[#2A7D6E] text-sm rounded-full">
              Date: {DATE_RANGE_OPTIONS.find((d) => d.value === dateRange)?.label}
              <button
                type="button"
                onClick={() => {
                  setDateRange("");
                  applyFilters(query, state, "");
                }}
                className="hover:text-[#1d5c51]"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}
    </form>
  );
}
