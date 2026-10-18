export const inr = (n) => `₹${n.toLocaleString("en-IN")}`;
export const cx = (...c) => c.filter(Boolean).join(" ");

export function downloadCsv(filename, rows) {
  const csv = rows
    .map((r) => r.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const dtf = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
  timeZone: "Asia/Kolkata",
});
/** Standard display format, e.g. "16 Oct 2026, 05:44 PM" (IST). */
export const formatDateTime = (iso) =>
  dtf.format(new Date(iso)).replace(/\b(am|pm)\b/, (m) => m.toUpperCase());
