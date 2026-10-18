import { cx } from "../lib/utils.js";

export function Card({ title, right, footer, className = "", children }) {
  return (
    <article
      className={cx(
        "flex min-w-0 flex-col rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm",
        className,
      )}
    >
      {(title || right) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <h3 className="min-w-0 text-xs leading-snug font-semibold text-slate-800 sm:text-sm">
            {title}
          </h3>
          {right}
        </div>
      )}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto">
        <div className="min-w-[260px] flex-1">{children}</div>
      </div>
      {footer && (
        <p className="mt-2 border-t border-slate-100 pt-2 text-center text-[10px] text-slate-400">
          {footer}
        </p>
      )}
    </article>
  );
}

export function SectionTitle({ icon: Icon, children }) {
  return (
    <h2 className="flex items-center gap-1.5 pt-1 text-sm font-bold tracking-tight text-slate-900">
      <Icon className="h-4 w-4 text-blue-600" aria-hidden="true" />
      {children}
    </h2>
  );
}

export function Legend({ items, className = "" }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-500 ${className}`}
    >
      {items.map(([label, color]) => (
        <span key={label} className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full" style={{ background: color }} />
          {label}
        </span>
      ))}
    </div>
  );
}

export function Avatar({ name, color = "#8B5CF6", size = "h-5 w-5 text-[10px]" }) {
  return (
    <span
      className={cx(
        "flex shrink-0 items-center justify-center rounded-full font-bold text-white",
        size,
      )}
      style={{ background: color }}
      aria-hidden="true"
    >
      {name[0]}
    </span>
  );
}
