import CountUp from "./CountUp.jsx";
import {
  Users,
  Check,
  BadgeCheck,
  X,
  Filter,
  FileText,
  Briefcase,
  IndianRupee,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const icons = {
  users: Users,
  check: Check,
  badge: BadgeCheck,
  x: X,
  filter: Filter,
  file: FileText,
  briefcase: Briefcase,
  rupee: IndianRupee,
};

const tones = {
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  purple: "bg-purple-50 text-purple-600",
  red: "bg-red-50 text-red-500",
  cyan: "bg-cyan-50 text-cyan-600",
  sky: "bg-sky-50 text-sky-600",
  indigo: "bg-indigo-50 text-indigo-600",
};

export default function KpiGrid({ kpis, rangeLabel = "vs. prev 31 days" }) {
  return (
    <section
      aria-label="Key performance indicators"
      className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8"
    >
      {kpis.map((k) => {
        const Icon = icons[k.icon] || Users;
        const changeStr = String(k.change || "0%");
        const isNegative = changeStr.startsWith("-");
        const TrendIcon = isNegative ? TrendingDown : TrendingUp;

        // Unqualified leads dropping is positive, otherwise drop is negative
        const isGood = k.id === "unq" ? isNegative : !isNegative;
        const trendColor = isGood ? "text-emerald-600" : "text-rose-500";

        return (
          <article
            key={k.id}
            className="card-hover rounded-xl border border-slate-200/90 bg-white p-3 shadow-xs hover:border-slate-300 transition"
          >
            <div className="flex items-center gap-1.5 text-slate-600">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full ${tones[k.tone] || tones.blue}`}
              >
                <Icon className="h-3 w-3" aria-hidden="true" />
              </span>
              <span className="truncate text-[11px] font-medium">{k.label}</span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                <CountUp value={k.value} />
              </span>
              {k.side && (
                <span className="text-right leading-none">
                  <span className="text-xs font-semibold text-slate-800">
                    <CountUp value={k.side[0]} />
                  </span>
                  <span className="block text-[10px] text-slate-400">{k.side[1]}</span>
                </span>
              )}
            </div>
            <div className={`mt-1 flex items-center gap-1 text-[11px] font-medium ${trendColor}`}>
              <TrendIcon className="h-3 w-3" aria-hidden="true" />
              <CountUp value={changeStr.replace(/^[+-]/, "")} />
              <span className="text-[10px] font-normal text-slate-400 truncate">{rangeLabel}</span>
            </div>
          </article>
        );
      })}
    </section>
  );
}
