import CountUp from "./CountUp.jsx";
import { IndianRupee, Check } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Card, SectionTitle, Legend } from "./Card.jsx";

export default function DealsRow({ d }) {
  // Compute dynamic scale for Dual Axis Deals vs Revenue
  const maxDeals = Math.max(4, ...(d.dealsByService || []).map((x) => x.deals || 0));
  const topDeals = Math.ceil(maxDeals / 2) * 2;
  const dealTicks = [0, topDeals / 4, topDeals / 2, (topDeals * 3) / 4, topDeals].map((v) =>
    Math.round(v),
  );

  const maxDealRev = Math.max(10000, ...(d.dealsByService || []).map((x) => x.revenue || 0));
  const topDealRev = Math.ceil(maxDealRev / 10000) * 10000;
  const revTicks = [0, topDealRev / 4, topDealRev / 2, (topDealRev * 3) / 4, topDealRev];

  // Daily revenue scale
  const maxDailyRev = Math.max(
    100000,
    ...(d.dailyRevenue || []).map((r) => Math.max(r.revenue || 0, r.collected || 0)),
  );
  const topDailyRev = Math.ceil(maxDailyRev / 500000) * 500000;
  const dailyTicks = [0, topDailyRev / 3, (topDailyRev * 2) / 3, topDailyRev].map((v) =>
    Math.round(v),
  );

  return (
    <div className="space-y-2">
      <SectionTitle icon={IndianRupee}>Deals &amp; Revenue</SectionTitle>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-24">
        {/* 1. Deals Created vs Deal Revenue */}
        <Card className="xl:col-span-6" title="Deals Created vs Deal Revenue (by Service)">
          <Legend
            className="mb-2"
            items={[
              ["Deals Created", "#2563EB"],
              ["Deal Revenue (₹)", "#F59E0B"],
            ]}
          />
          <div className="overflow-x-auto">
            <div className="h-52 min-w-[360px] xl:min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={d.dealsByService}
                  barGap={6}
                  barCategoryGap="12%"
                  margin={{ top: 20, right: -6, left: -20, bottom: 0 }}
                >
                  <CartesianGrid stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 9, fill: "#64748b" }}
                    tickLine={false}
                    interval={0}
                  />
                  <YAxis
                    yAxisId="l"
                    tick={{ fontSize: 9, fill: "#2563EB" }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, topDeals]}
                    ticks={dealTicks}
                  />
                  <YAxis
                    yAxisId="r"
                    orientation="right"
                    tick={{ fontSize: 9, fill: "#D97706" }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, topDealRev]}
                    ticks={revTicks}
                    tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)}
                  />
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }}
                    formatter={(v, n) =>
                      n === "Revenue (₹)" ? `₹${v.toLocaleString("en-IN")}` : v
                    }
                  />
                  <Bar
                    yAxisId="l"
                    dataKey="deals"
                    name="Deals"
                    fill="#2563EB"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={44}
                    minPointSize={4}
                    isAnimationActive={false}
                  >
                    <LabelList
                      dataKey="deals"
                      position="top"
                      style={{ fontSize: 9, fontWeight: 700, fill: "#1d4ed8" }}
                    />
                  </Bar>
                  <Bar
                    yAxisId="r"
                    dataKey="revenue"
                    name="Revenue (₹)"
                    fill="#F59E0B"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={44}
                    minPointSize={4}
                    isAnimationActive={false}
                  >
                    <LabelList
                      dataKey="revenue"
                      position="top"
                      formatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)}
                      style={{ fontSize: 8, fontWeight: 700, fill: "#B45309" }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* 2. Revenue by Order / Service Category */}
        <Card className="xl:col-span-4" title="Revenue by Order / Service Category">
          <ul className="space-y-2 text-[11px]">
            {d.revenueByCategory.map((r) => (
              <li key={r.name}>
                <div className="flex justify-between font-medium text-slate-700">
                  <span className="truncate">{r.name}</span>
                  <span className="font-bold text-slate-900">
                    <CountUp value={r.amount} />{" "}
                    <span className="text-[10px] font-normal text-slate-400">({r.pct}%)</span>
                  </span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                  <div
                    className="h-1.5 rounded-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(3, r.pct))}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* 3. Priority Breakdown */}
        <Card
          className="xl:col-span-5"
          title="Priority Breakdown"
          footer="Strategic pipeline segment distribution"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[300px] text-left text-[11px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400">
                  <th className="pb-1.5 font-normal">Priority</th>
                  <th className="pb-1.5 text-center font-normal">Deals</th>
                  <th className="pb-1.5 text-right font-normal">Revenue</th>
                  <th className="pb-1.5 text-right font-normal">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {d.priority.map((p) => (
                  <tr key={p.name} className="hover:bg-slate-50/50 transition">
                    <td className="py-2">
                      <span className="flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${p.color}`} />
                        {p.name}
                      </span>
                    </td>
                    <td className="text-center">
                      <CountUp value={p.deals} />
                    </td>
                    <td className="text-right">
                      <CountUp value={p.revenue} />
                    </td>
                    <td className="text-right font-bold text-slate-900">{p.pct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* 4. Daily Revenue Trend */}
        <Card className="xl:col-span-5" title="Daily Revenue Trend">
          <Legend
            className="mb-2"
            items={[
              ["Revenue", "#2563EB"],
              ["Collected", "#14B8A6"],
            ]}
          />
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={d.dailyRevenue} margin={{ top: 5, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 8, fill: "#94a3b8" }} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 8, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  ticks={dailyTicks}
                  domain={[0, topDailyRev]}
                  tickFormatter={(v) =>
                    v >= 100000 ? `${(v / 100000).toFixed(1)}L` : `${v / 1000}k`
                  }
                />
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }}
                  formatter={(v) => `₹${v.toLocaleString("en-IN")}`}
                />
                <Bar
                  dataKey="revenue"
                  name="Revenue"
                  fill="#2563EB"
                  radius={[2, 2, 0, 0]}
                  maxBarSize={28}
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="collected"
                  name="Collected"
                  fill="#14B8A6"
                  radius={[2, 2, 0, 0]}
                  maxBarSize={28}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 5. Total vs Collected Revenue */}
        <Card
          className="xl:col-span-4"
          title="Total vs Collected Revenue"
          footer={`Collection efficiency: ${d.revenueTotals.efficiency}`}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <IndianRupee className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <div className="text-[10px] font-medium text-slate-500">Total Deal Value</div>
                <div className="text-base font-bold text-slate-900">
                  <CountUp value={d.revenueTotals.total} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <Check className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <div className="text-[10px] font-medium text-slate-500">Net Collected Revenue</div>
                <div className="text-base font-bold text-emerald-700">
                  <CountUp value={d.revenueTotals.collected} />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
