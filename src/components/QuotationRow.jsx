import CountUp from "./CountUp.jsx";
import { useMemo, useState } from "react";
import { FileText, ArrowUpDown, Search, ChevronLeft, ChevronRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, SectionTitle } from "./Card.jsx";
import { inr } from "../lib/utils.js";

function QuoteTable({ rows }) {
  const [sort, setSort] = useState({ key: "quotes", dir: -1 });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((r) => r.service.toLowerCase().includes(q));
  }, [rows, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aVal = a[sort.key];
      const bVal = b[sort.key];
      if (typeof aVal === "string") {
        return aVal.localeCompare(bVal) * sort.dir;
      }
      return (aVal > bVal ? 1 : -1) * sort.dir;
    });
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const heads = [
    ["service", "Service / Order", ""],
    ["quotes", "Quotations", "text-center"],
    ["amount", "Quoted Amount", "text-right"],
    ["accepted", "Accepted", "text-center"],
    ["pending", "Pending", "text-center"],
    ["rejected", "Rejected", "text-center"],
    ["rate", "Conv. Rate", "text-right"],
  ];

  return (
    <div className="space-y-2">
      {/* Table search & pagination bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="relative inline-flex items-center">
          <Search className="pointer-events-none absolute left-2.5 h-3 w-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search service…"
            className="rounded-lg border border-slate-200 bg-white py-1 pl-7 pr-3 text-[11px] text-slate-700 placeholder:text-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <span>
              {currentPage} / {totalPages}
            </span>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
                className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronLeft className="h-3 w-3" />
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Next page"
                className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="max-h-56 overflow-auto">
        <table className="w-full min-w-[560px] text-left text-[11px]">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b border-slate-100 text-slate-400">
              {heads.map(([k, label, cls]) => (
                <th
                  key={k}
                  className={`pb-1.5 font-normal ${cls}`}
                  aria-sort={sort.key === k ? (sort.dir > 0 ? "ascending" : "descending") : "none"}
                >
                  <button
                    type="button"
                    className="inline-flex items-center gap-0.5 hover:text-slate-700 transition"
                    onClick={() => {
                      setSort((s) => ({ key: k, dir: s.key === k ? -s.dir : -1 }));
                    }}
                  >
                    {label} <ArrowUpDown className="h-2.5 w-2.5" aria-hidden="true" />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginated.map((r) => (
              <tr key={r.service} className="hover:bg-slate-50/60 transition">
                <td className="py-2.5 font-medium text-slate-800">{r.service}</td>
                <td className="py-2.5 text-center">
                  <CountUp value={r.quotes} />
                </td>
                <td className="text-right font-medium">
                  <CountUp value={inr(r.amount)} />
                </td>
                <td className="text-center font-medium text-emerald-600">
                  <CountUp value={r.accepted} />
                </td>
                <td className="text-center font-medium text-slate-700">
                  <CountUp value={r.pending} />
                </td>
                <td className="text-center text-rose-500">
                  <CountUp value={r.rejected} />
                </td>
                <td className="text-right font-semibold text-slate-900">
                  <CountUp value={`${r.rate}%`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginated.length === 0 && (
          <p className="py-6 text-center text-xs text-slate-400">No matching services found.</p>
        )}
      </div>
    </div>
  );
}

export default function QuotationRow({ d }) {
  const c = d.quoteConversion;
  const r = 14;
  const circ = 2 * Math.PI * r;

  const maxQuoteCount = Math.max(10, ...(d.quotesByService || []).map((q) => q.value || 0));
  const topQuote = Math.ceil(maxQuoteCount / 10) * 10;
  const quoteStep = Math.max(5, Math.ceil(topQuote / 3));

  return (
    <div className="space-y-2">
      <SectionTitle icon={FileText}>Quotation Analytics</SectionTitle>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-24">
        {/* 1. Quotations by Service / Order Category */}
        <Card className="xl:col-span-5" title="Quotations by Service / Order Category">
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={d.quotesByService}
                margin={{ top: 18, right: 4, left: -18, bottom: 0 }}
              >
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="short"
                  tick={{ fontSize: 8, fill: "#64748b" }}
                  tickLine={false}
                  interval={0}
                />
                <YAxis
                  tick={{ fontSize: 8, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, topQuote]}
                  ticks={[0, quoteStep, quoteStep * 2, topQuote]}
                />
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }}
                />
                <Bar
                  dataKey="value"
                  name="Quotations"
                  fill="#2563EB"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={40}
                  isAnimationActive={false}
                >
                  <LabelList
                    dataKey="value"
                    position="top"
                    style={{ fontSize: 9, fontWeight: 700, fill: "#334155" }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 2. Quotation Value by Service */}
        <Card
          className="xl:col-span-5"
          title="Quotation Value by Service"
          footer="Top services by cumulative quoted value pipeline"
        >
          <div className="flex items-center gap-3">
            <div className="flex w-28 shrink-0 flex-col items-center gap-0.5" aria-hidden="true">
              {d.quoteValue.map((q, i) => (
                <div
                  key={q.name}
                  className="h-4 transition-all duration-300"
                  style={{
                    background: q.color,
                    width: `${Math.max(30, 112 - i * 14)}px`,
                    clipPath: "polygon(0 0,100% 0,88% 100%,12% 100%)",
                  }}
                />
              ))}
            </div>
            <ul className="flex-1 space-y-1 text-[10px]">
              {d.quoteValue.map((q) => (
                <li key={q.name} className="flex justify-between gap-1">
                  <span className="truncate text-slate-600">
                    <span style={{ color: q.color }}>•</span> {q.name}
                  </span>
                  <span className="font-semibold text-slate-800">
                    <CountUp value={q.amount} />{" "}
                    <span className="font-normal text-slate-400">({q.pct})</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* 3. Service Wise Quotation Details */}
        <Card className="xl:col-span-9" title="Service Wise Quotation Details">
          <QuoteTable rows={d.quoteDetails} />
        </Card>

        {/* 4. Quote to Deal Conversion Rate */}
        <Card className="items-center xl:col-span-5" title="Quote to Deal Conversion Rate">
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <div className="relative h-28 w-28">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                <title>{`${c.pct}% conversion`}</title>
                <circle cx="18" cy="18" r={r} fill="none" stroke="#E2E8F0" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r={r}
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${(Math.min(100, Math.max(0, c.pct)) / 100) * circ} ${circ}`}
                  className="transition-all duration-500"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xl font-extrabold text-slate-900">
                {c.pct}%
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500">
              <CountUp value={c.deals} /> Deals / <CountUp value={c.quotes} /> Quotations
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}
