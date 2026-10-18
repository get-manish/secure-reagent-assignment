import CountUp from "./CountUp.jsx";
import { Target } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, Legend } from "./Card.jsx";

const tick = { fontSize: 9, fill: "#94a3b8" };

export default function LeadRow({ d }) {
  const total = d.leadSources.reduce((s, x) => s + x.value, 0);

  // Compute dynamic scale for Daily Lead Trend
  const maxLeads = Math.max(
    15,
    ...(d.dailyLeads || []).map((l) =>
      Math.max(l.newLeads || 0, l.qualified || 0, l.converted || 0),
    ),
  );
  const roundedMax = Math.ceil(maxLeads / 10) * 10;
  const step = Math.max(5, Math.ceil(roundedMax / 4));
  const yTicks = [0, step, step * 2, step * 3, step * 4];

  return (
    <section
      aria-label="Lead analytics"
      className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-24"
    >
      {/* 1. Target Achievement */}
      <Card
        className="xl:col-span-6"
        title={
          <span className="flex items-center gap-1.5">
            <Target className="h-4 w-4 text-blue-600" aria-hidden="true" />
            Target Achievement
          </span>
        }
      >
        <p className="text-[11px] text-slate-400">Monthly Revenue Target</p>
        <p className="text-xl font-bold text-slate-900">
          <CountUp value={d.target.goal} />
        </p>
        <div className="mt-3 flex items-center gap-4">
          <dl className="space-y-1.5 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <dt className="text-slate-500">Achieved</dt>
              <dd className="font-semibold text-slate-800">
                <CountUp value={d.target.achieved} />
              </dd>
              <dd className="text-[10px] text-slate-400">
                <CountUp value={`${d.target.achievedPct}%`} />
              </dd>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              <dt className="text-slate-500">Remaining</dt>
              <dd className="font-semibold text-slate-800">
                <CountUp value={d.target.remaining} />
              </dd>
              <dd className="text-[10px] text-slate-400">
                <CountUp value={`${d.target.remainingPct}%`} />
              </dd>
            </div>
          </dl>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex flex-col items-center" aria-hidden="true">
            <div
              className="h-8 w-14 bg-indigo-400/80 transition-all duration-300"
              style={{ clipPath: "polygon(0 0,100% 0,85% 100%,15% 100%)" }}
            />
            <div
              className="h-8 w-10 bg-blue-600 transition-all duration-300"
              style={{ clipPath: "polygon(0 0,100% 0,75% 100%,25% 100%)" }}
            />
          </div>
          <p className="text-[10px] text-slate-500">Target vs Achieved (Revenue)</p>
        </div>
        <div className="mt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-1.5 rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(2, d.target.achievedPct))}%` }}
            />
          </div>
        </div>
      </Card>

      {/* 2. Lead Funnel */}
      <Card
        className="xl:col-span-5"
        title="Lead Funnel"
        footer="Conversion efficiency based on active monthly pipeline"
      >
        <div className="flex items-center justify-center gap-3 py-2">
          <div className="flex flex-col items-center gap-1">
            {d.leadFunnel.map((s) => (
              <div
                key={s.label}
                className="py-1.5 text-center text-white transition-all duration-300"
                style={{
                  background: s.color,
                  width: `${Math.min(160, Math.max(70, s.width * 1.6))}px`,
                  clipPath: "polygon(0 0,100% 0,92% 100%,8% 100%)",
                }}
              >
                <div className="text-[9px] opacity-90">{s.label}</div>
                <div className="text-[11px] font-semibold">
                  <CountUp value={s.value} />{" "}
                  <span className="text-[9px] font-normal">({s.pct})</span>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-dashed border-purple-300 bg-purple-50/60 p-2 text-center text-purple-700">
            <div className="text-[10px] font-medium">Unqualified</div>
            <div className="text-xs font-bold">
              <CountUp value={d.unqualified.value} />
            </div>
            <div className="text-[9px] text-purple-400">({d.unqualified.pct})</div>
          </div>
        </div>
      </Card>

      {/* 3. Daily Lead Trend */}
      <Card
        className="xl:col-span-7"
        title="Daily Lead Trend"
        footer="Time-series tracking across active reporting period"
      >
        <Legend
          className="mb-3"
          items={[
            ["New Leads", "#3B82F6"],
            ["Qualified", "#10B981"],
            ["Converted", "#F59E0B"],
          ]}
        />
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={d.dailyLeads} margin={{ top: 5, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ ...tick, fontSize: 8 }}
                interval={2}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={tick}
                tickLine={false}
                axisLine={false}
                domain={[0, yTicks[4]]}
                ticks={yTicks}
              />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }}
              />
              <Line
                type="monotone"
                dataKey="newLeads"
                name="New Leads"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="qualified"
                name="Qualified"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="converted"
                name="Converted"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 4. Lead Sources */}
      <Card
        className="xl:col-span-6"
        title="Lead Sources"
        footer="Channel distribution across total incoming pipeline"
      >
        <div className="flex items-center gap-3">
          <div className="relative h-28 w-28 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={d.leadSources.filter((s) => s.value > 0)}
                  dataKey="value"
                  innerRadius={34}
                  outerRadius={52}
                  stroke="none"
                >
                  {d.leadSources.map((s) => (
                    <Cell key={s.name} fill={s.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center leading-tight">
              <span className="text-xl font-bold">
                <CountUp value={total} />
              </span>
              <span className="text-[8px] font-semibold uppercase tracking-wider text-slate-400">
                Total Leads
              </span>
            </div>
          </div>
          <ul className="flex-1 space-y-1.5 text-xs">
            {d.leadSources.map((s) => (
              <li key={s.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                  {s.name}
                </span>
                <span className="font-semibold">
                  <CountUp value={s.value} />{" "}
                  <span className="text-[10px] font-normal text-slate-400">({s.pct})</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </section>
  );
}
