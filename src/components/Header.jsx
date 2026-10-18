import { CalendarDays, ChevronDown, Download, RefreshCw, RotateCcw } from "lucide-react";
import { DATE_RANGES, USERS, DEPARTMENTS } from "../data/mockData.js";

const base =
  "appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 transition cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500";

function Select({ label, value, options, onChange, icon }) {
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{label}</span>
      {icon && (
        <CalendarDays className="pointer-events-none absolute left-3 h-4 w-4 text-slate-500" />
      )}
      <select
        className={`${base} ${icon ? "pl-9" : ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-slate-400" />
    </label>
  );
}

export default function Header({
  filters,
  setFilters,
  filterOptions,
  onExport,
  onRefresh,
  onReset,
  isRefreshing,
  isFiltered,
}) {
  const set = (k) => (v) => setFilters((f) => ({ ...f, [k]: v }));

  const dateOptions = filterOptions?.dateRanges || DATE_RANGES;
  const userOptions = filterOptions?.users || USERS;
  const deptOptions = filterOptions?.departments || DEPARTMENTS;

  return (
    <header className="flex flex-col justify-between gap-4 pb-1 lg:flex-row lg:items-center">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-ink lg:text-2xl">
          Business Performance &amp; Revenue Analytics
        </h1>
        <p className="mt-0.5 text-xs text-slate-500">
          Track your leads, conversions, quotations, deals, revenue and operations in real time.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          label="Date range"
          icon
          value={filters.range}
          options={dateOptions}
          onChange={set("range")}
        />
        <Select label="User" value={filters.user} options={userOptions} onChange={set("user")} />
        <Select
          label="Department"
          value={filters.department}
          options={deptOptions}
          onChange={set("department")}
        />

        {/* Refresh button */}
        <button
          type="button"
          onClick={onRefresh}
          title="Refresh dashboard data"
          aria-label="Refresh data"
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-xs hover:bg-slate-50 active:scale-95 transition"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-blue-600" : ""}`}
          />
        </button>

        {/* Reset filters button (when active) */}
        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            title="Reset filters to default"
            className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-700 shadow-xs hover:bg-amber-100 transition active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        )}

        {/* Export button */}
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-xs transition hover:bg-blue-700 active:scale-95"
        >
          <Download className="h-4 w-4" aria-hidden="true" /> Export
        </button>
      </div>
    </header>
  );
}
