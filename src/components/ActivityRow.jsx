import { useMemo, useState } from "react";
import { formatDateTime } from "../lib/utils.js";
import CountUp from "./CountUp.jsx";
import { Card, Avatar, Legend } from "./Card.jsx";
import { ArrowUpDown, Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";

const segColors = ["#F59E0B", "#3B82F6", "#10B981", "#EF4444"];
const th = "pb-2 text-center font-normal";

export default function ActivityRow({ d, onSelectUser, onSelectRecord }) {
  // Sales team state
  const [salesSearch, setSalesSearch] = useState("");
  const [salesSort, setSalesSort] = useState({ key: "leads", dir: -1 });
  const [salesPage, setSalesPage] = useState(1);
  const salesPageSize = 4;

  const filteredSales = useMemo(() => {
    let list = d.salesTeam || [];
    if (salesSearch.trim()) {
      const q = salesSearch.toLowerCase();
      list = list.filter(
        (m) => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q),
      );
    }
    return [...list].sort((a, b) => {
      const aVal = a[salesSort.key];
      const bVal = b[salesSort.key];
      if (typeof aVal === "string") {
        return aVal.localeCompare(bVal) * salesSort.dir;
      }
      return (aVal > bVal ? 1 : -1) * salesSort.dir;
    });
  }, [d.salesTeam, salesSearch, salesSort]);

  const salesTotalPages = Math.max(1, Math.ceil(filteredSales.length / salesPageSize));
  const currentSalesPage = Math.min(salesPage, salesTotalPages);
  const paginatedSales = filteredSales.slice(
    (currentSalesPage - 1) * salesPageSize,
    currentSalesPage * salesPageSize,
  );

  // Operations team state
  const [opsSearch, setOpsSearch] = useState("");
  const [opsSort, setOpsSort] = useState({ key: "completed", dir: -1 });
  const [opsPage, setOpsPage] = useState(1);
  const opsPageSize = 4;

  const filteredOps = useMemo(() => {
    let list = d.opsTeam || [];
    if (opsSearch.trim()) {
      const q = opsSearch.toLowerCase();
      list = list.filter((m) => m.name.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      const aVal = a[opsSort.key];
      const bVal = b[opsSort.key];
      if (typeof aVal === "string") {
        return aVal.localeCompare(bVal) * opsSort.dir;
      }
      return (aVal > bVal ? 1 : -1) * opsSort.dir;
    });
  }, [d.opsTeam, opsSearch, opsSort]);

  const opsTotalPages = Math.max(1, Math.ceil(filteredOps.length / opsPageSize));
  const currentOpsPage = Math.min(opsPage, opsTotalPages);
  const paginatedOps = filteredOps.slice(
    (currentOpsPage - 1) * opsPageSize,
    currentOpsPage * opsPageSize,
  );

  // CRM Activity state
  const [actSearch, setActSearch] = useState("");
  const [actFilter, setActFilter] = useState("All");
  const [actPage, setActPage] = useState(1);
  const actPageSize = 5;

  const filteredActivity = useMemo(() => {
    let list = d.activity || [];
    if (actFilter !== "All") {
      list = list.filter((a) => a.action === actFilter);
    }
    if (actSearch.trim()) {
      const q = actSearch.toLowerCase();
      list = list.filter(
        (a) =>
          a.user.toLowerCase().includes(q) ||
          a.action.toLowerCase().includes(q) ||
          a.record.toLowerCase().includes(q),
      );
    }
    return list;
  }, [d.activity, actFilter, actSearch]);

  const actTotalPages = Math.max(1, Math.ceil(filteredActivity.length / actPageSize));
  const currentActPage = Math.min(actPage, actTotalPages);
  const paginatedActivity = filteredActivity.slice(
    (currentActPage - 1) * actPageSize,
    currentActPage * actPageSize,
  );

  const actActions = [
    "All",
    "Lead updated",
    "Payment recorded",
    "Order created",
    "Deal created",
    "Quotation created",
  ];

  return (
    <section
      aria-label="Team activity"
      className="grid grid-cols-1 gap-4 pb-6 md:grid-cols-2 xl:grid-cols-24"
    >
      {/* 1. Sales Team Activity */}
      {d.showSales && (
        <Card
          className="xl:col-span-9"
          title="Sales Team Activity"
          right={
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-blue-200/60 bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                Sales Team
              </span>
            </div>
          }
          footer={`${d.salesTeam?.length || 0} Active Members`}
        >
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="relative inline-flex items-center">
                <Search className="pointer-events-none absolute left-2.5 h-3 w-3 text-slate-400" />
                <input
                  type="text"
                  value={salesSearch}
                  onChange={(e) => {
                    setSalesSearch(e.target.value);
                    setSalesPage(1);
                  }}
                  placeholder="Search sales member…"
                  className="rounded-lg border border-slate-200 bg-white py-1 pl-7 pr-3 text-[11px] text-slate-700 placeholder:text-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {salesTotalPages > 1 && (
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <span>
                    {currentSalesPage} / {salesTotalPages}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      disabled={currentSalesPage <= 1}
                      onClick={() => setSalesPage((p) => Math.max(1, p - 1))}
                      aria-label="Previous page"
                      className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      disabled={currentSalesPage >= salesTotalPages}
                      onClick={() => setSalesPage((p) => Math.min(salesTotalPages, p + 1))}
                      aria-label="Next page"
                      className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                    >
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-[11px]">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400">
                    <th className="sticky left-0 bg-white pb-2 font-normal">
                      <button
                        type="button"
                        onClick={() =>
                          setSalesSort((s) => ({
                            key: "name",
                            dir: s.key === "name" ? -s.dir : 1,
                          }))
                        }
                        className="inline-flex items-center gap-0.5 hover:text-slate-700"
                      >
                        User <ArrowUpDown className="h-2.5 w-2.5" />
                      </button>
                    </th>
                    {[
                      ["leads", "Leads"],
                      ["qualified", "Qualified"],
                      ["converted", "Converted"],
                      ["conv", "Conv. %"],
                      ["quotes", "Quotes"],
                      ["deals", "Deals"],
                    ].map(([k, label]) => (
                      <th key={k} className={th}>
                        <button
                          type="button"
                          onClick={() =>
                            setSalesSort((s) => ({ key: k, dir: s.key === k ? -s.dir : -1 }))
                          }
                          className="inline-flex items-center gap-0.5 hover:text-slate-700"
                        >
                          {label} <ArrowUpDown className="h-2.5 w-2.5" />
                        </button>
                      </th>
                    ))}
                    <th className="pb-2 text-right font-normal">Deal Value</th>
                    <th className="pb-2 text-right font-normal">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {paginatedSales.map((m) => (
                    <tr key={m.name} className="hover:bg-slate-50/70 transition">
                      <td className="sticky left-0 min-w-[130px] bg-white py-3 font-medium">
                        <button
                          type="button"
                          onClick={() => onSelectUser(m)}
                          className="flex items-center gap-2 text-left hover:text-blue-600 transition"
                        >
                          <Avatar name={m.name} />
                          <span className="max-w-[6.5rem] leading-snug break-words">{m.name}</span>
                        </button>
                      </td>
                      <td className="text-center font-medium">
                        <CountUp value={m.leads} />
                      </td>
                      <td className="text-center">
                        <CountUp value={m.qualified} />
                      </td>
                      <td className="text-center">
                        <CountUp value={m.converted} />
                      </td>
                      <td className="text-center font-semibold text-slate-900">
                        <CountUp value={m.conv} />
                      </td>
                      <td className="text-center">
                        <CountUp value={m.quotes} />
                      </td>
                      <td className="text-center">
                        <CountUp value={m.deals} />
                      </td>
                      <td className="text-right font-medium whitespace-nowrap">
                        <CountUp value={m.dealValue} />
                      </td>
                      <td className="text-right font-semibold whitespace-nowrap text-slate-900">
                        <CountUp value={m.revenue} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {paginatedSales.length === 0 && (
                <p className="py-6 text-center text-slate-400">No matching team members.</p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* 2. Operations Team Activity */}
      {d.showOps && (
        <Card
          className="xl:col-span-6"
          title="Operations Team Activity"
          right={
            <span className="rounded-full border border-purple-200/60 bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-600">
              Operations
            </span>
          }
          footer="Operational stage updates across live assignments"
        >
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="relative inline-flex items-center">
                <Search className="pointer-events-none absolute left-2.5 h-3 w-3 text-slate-400" />
                <input
                  type="text"
                  value={opsSearch}
                  onChange={(e) => {
                    setOpsSearch(e.target.value);
                    setOpsPage(1);
                  }}
                  placeholder="Search ops member…"
                  className="rounded-lg border border-slate-200 bg-white py-1 pl-7 pr-3 text-[11px] text-slate-700 placeholder:text-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {opsTotalPages > 1 && (
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <span>
                    {currentOpsPage} / {opsTotalPages}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      disabled={currentOpsPage <= 1}
                      onClick={() => setOpsPage((p) => Math.max(1, p - 1))}
                      aria-label="Previous page"
                      className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      disabled={currentOpsPage >= opsTotalPages}
                      onClick={() => setOpsPage((p) => Math.min(opsTotalPages, p + 1))}
                      aria-label="Next page"
                      className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                    >
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[440px] text-left text-[11px]">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400">
                    <th className="pb-2 font-normal">
                      <button
                        type="button"
                        onClick={() =>
                          setOpsSort((s) => ({
                            key: "name",
                            dir: s.key === "name" ? -s.dir : 1,
                          }))
                        }
                        className="inline-flex items-center gap-0.5 hover:text-slate-700"
                      >
                        User <ArrowUpDown className="h-2.5 w-2.5" />
                      </button>
                    </th>
                    {[
                      ["updated", "Orders Updated"],
                      ["completed", "Stages Completed"],
                      ["pending", "Pending Stages"],
                      ["overdue", "Overdue Orders"],
                    ].map(([k, label]) => (
                      <th key={k} className={th}>
                        <button
                          type="button"
                          onClick={() =>
                            setOpsSort((s) => ({ key: k, dir: s.key === k ? -s.dir : -1 }))
                          }
                          className="inline-flex items-center gap-0.5 hover:text-slate-700"
                        >
                          {label} <ArrowUpDown className="h-2.5 w-2.5" />
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {paginatedOps.map((m) => (
                    <tr key={m.name} className="hover:bg-slate-50/70 transition">
                      <td className="py-3">
                        <button
                          type="button"
                          onClick={() => onSelectUser(m)}
                          className="flex min-w-[120px] items-center gap-2 text-left hover:text-blue-600 transition"
                        >
                          <Avatar name={m.name} color="#38BDF8" />
                          <span className="max-w-[6.5rem] leading-snug break-words">{m.name}</span>
                        </button>
                      </td>
                      {[m.updated, m.completed, m.pending, m.overdue].map((v, i) => (
                        <td key={i} className={`text-center ${v === 0 ? "text-slate-400" : ""}`}>
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {paginatedOps.length === 0 && (
              <p className="py-6 text-center text-slate-400">No matching team members.</p>
            )}
          </div>
        </Card>
      )}

      {/* 3. Orders & Stage Progress */}
      <Card
        className="xl:col-span-4"
        title="Orders & Stage Progress"
        footer="Execution progress across live service orders"
      >
        <Legend
          className="mb-3"
          items={[
            ["Pending", segColors[0]],
            ["In Progress", segColors[1]],
            ["Completed", segColors[2]],
            ["On Hold", segColors[3]],
          ]}
        />
        <ul className="space-y-2.5 text-[10px]">
          {d.orders.map((o) => (
            <li key={o.name}>
              <div className="mb-1 flex justify-between font-medium text-slate-700">
                <span className="truncate" title={o.fullName || o.name}>
                  {o.name}
                </span>
                <span className="font-bold text-slate-900">
                  <CountUp value={o.total} />
                </span>
              </div>
              <div className="flex h-4 overflow-hidden rounded bg-slate-100 text-center text-[9px] font-bold leading-4 text-white">
                {o.seg.map((v, i) =>
                  v > 0 ? (
                    <div
                      key={i}
                      style={{
                        background: segColors[i],
                        width: `${Math.max(8, (v / o.total) * 100)}%`,
                      }}
                      title={`${v}`}
                    >
                      {v}
                    </div>
                  ) : null,
                )}
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {/* 4. Recent CRM Activity */}
      <Card className="xl:col-span-5" title="Recent CRM Activity" footer="Real-time audit log">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <div className="relative inline-flex items-center">
              <Search className="pointer-events-none absolute left-2 h-2.5 w-2.5 text-slate-400" />
              <input
                type="text"
                value={actSearch}
                onChange={(e) => {
                  setActSearch(e.target.value);
                  setActPage(1);
                }}
                placeholder="Search audit…"
                className="w-24 sm:w-28 rounded-md border border-slate-200 bg-white py-0.5 pl-5 pr-1.5 text-[10px] text-slate-700 placeholder:text-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-1">
              <label htmlFor="crm-action-filter" className="sr-only">
                Filter CRM actions
              </label>
              <Filter className="h-2.5 w-2.5 text-slate-400" aria-hidden="true" />
              <select
                id="crm-action-filter"
                value={actFilter}
                onChange={(e) => {
                  setActFilter(e.target.value);
                  setActPage(1);
                }}
                className="rounded-md border border-slate-200 bg-white py-0.5 px-1 text-[10px] text-slate-700 hover:bg-slate-50 focus:outline-none"
              >
                {actActions.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </div>

            {actTotalPages > 1 && (
              <div className="flex items-center gap-1 text-[9px] text-slate-500">
                <span>
                  {currentActPage}/{actTotalPages}
                </span>
                <button
                  type="button"
                  disabled={currentActPage <= 1}
                  onClick={() => setActPage((p) => Math.max(1, p - 1))}
                  className="rounded p-0.5 hover:bg-slate-100 disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  disabled={currentActPage >= actTotalPages}
                  onClick={() => setActPage((p) => Math.min(actTotalPages, p + 1))}
                  className="rounded p-0.5 hover:bg-slate-100 disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-[10px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400">
                  <th className="pb-1.5 font-normal">Time</th>
                  <th className="pb-1.5 font-normal">Employee</th>
                  <th className="pb-1.5 font-normal">Action</th>
                  <th className="pb-1.5 text-right font-normal">Record</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginatedActivity.map((a) => (
                  <tr key={a.id || a.time} className="hover:bg-slate-50/60 transition">
                    <td className="py-2 text-[10px] whitespace-nowrap text-slate-500">
                      <time dateTime={a.time} title={a.time}>
                        {formatDateTime(a.time)
                          .split(", ")
                          .map((part, i) => (
                            <span
                              key={i}
                              className={
                                i ? "block text-slate-400" : "block font-medium text-slate-600"
                              }
                            >
                              {part}
                            </span>
                          ))}
                      </time>
                    </td>
                    <td className="min-w-[110px] py-2">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Avatar name={a.user} size="h-4 w-4 text-[8px]" />
                        <span className="max-w-[6.5rem] leading-snug break-words">{a.user}</span>
                      </span>
                    </td>
                    <td className="min-w-[100px] py-2 text-slate-600">{a.action}</td>
                    <td className="text-right font-semibold">
                      <button
                        type="button"
                        onClick={() => onSelectRecord(a.record)}
                        title={`View record ${a.record}`}
                        className="rounded px-1.5 py-0.5 text-blue-600 hover:bg-blue-50 hover:underline transition"
                      >
                        {a.record}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {paginatedActivity.length === 0 && (
              <p className="py-6 text-center text-slate-400">No matching activities.</p>
            )}
          </div>
        </div>
      </Card>
    </section>
  );
}
