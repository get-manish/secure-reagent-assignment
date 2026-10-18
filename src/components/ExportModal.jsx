import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, Download, FileSpreadsheet, FileCode, Check } from "lucide-react";
import { downloadCsv } from "../lib/utils.js";

export default function ExportModal({ data, filters, onClose, onExportComplete }) {
  const [dataset, setDataset] = useState("all");
  const [format, setFormat] = useState("csv");

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleDownload = () => {
    if (!data) return;

    const rangeTag = (filters.range || "Oct-2026").toLowerCase().replace(/[^a-z0-9]+/g, "-");

    if (format === "json") {
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analytics-export-${rangeTag}.json`;
      a.click();
      URL.revokeObjectURL(url);
      onExportComplete?.(`Exported JSON (${dataset})`);
      onClose();
      return;
    }

    // CSV formats
    if (dataset === "sales") {
      downloadCsv(`sales-team-${rangeTag}.csv`, [
        [
          "User",
          "Role",
          "Leads",
          "Qualified",
          "Converted",
          "Conv %",
          "Quotes",
          "Deals",
          "Deal Value",
          "Revenue",
        ],
        ...data.salesTeam.map((m) => [
          m.name,
          m.role,
          m.leads,
          m.qualified,
          m.converted,
          m.conv,
          m.quotes,
          m.deals,
          m.dealValue,
          m.revenue,
        ]),
      ]);
    } else if (dataset === "quotes") {
      downloadCsv(`quotations-by-service-${rangeTag}.csv`, [
        [
          "Service / Order",
          "Quotations",
          "Quoted Amount (₹)",
          "Accepted",
          "Pending",
          "Rejected",
          "Conv. Rate %",
        ],
        ...data.quoteDetails.map((q) => [
          q.service,
          q.quotes,
          q.amount,
          q.accepted,
          q.pending,
          q.rejected,
          `${q.rate}%`,
        ]),
      ]);
    } else if (dataset === "deals") {
      downloadCsv(`deals-and-revenue-${rangeTag}.csv`, [
        ["Service Category", "Deals Count", "Revenue (₹)"],
        ...data.dealsByService.map((d) => [d.fullName || d.name, d.deals, d.revenue]),
      ]);
    } else if (dataset === "activity") {
      downloadCsv(`crm-activity-log-${rangeTag}.csv`, [
        ["Timestamp", "Employee", "Action", "Record ID"],
        ...data.activity.map((a) => [a.time, a.user, a.action, a.record]),
      ]);
    } else {
      // Complete Dashboard Summary
      downloadCsv(`dashboard-summary-${rangeTag}.csv`, [
        ["KPI Metric", "Current Value", "Change / Comparison"],
        ...data.kpis.map((k) => [k.label, k.value, k.change || ""]),
        [],
        ["Target Metric", "Value"],
        ["Monthly Goal", data.target.goal],
        ["Achieved Revenue", data.target.achieved],
        ["Achieved %", `${data.target.achievedPct}%`],
        ["Remaining", data.target.remaining],
        [],
        ["Revenue Totals", "Value"],
        ["Total Deal Value", data.revenueTotals.total],
        ["Net Collected", data.revenueTotals.collected],
        ["Efficiency", data.revenueTotals.efficiency],
        [],
        ["Sales Team Performance"],
        ["User", "Leads", "Qualified", "Converted", "Quotes", "Deals", "Deal Value", "Revenue"],
        ...data.salesTeam.map((m) => [
          m.name,
          m.leads,
          m.qualified,
          m.converted,
          m.quotes,
          m.deals,
          m.dealValue,
          m.revenue,
        ]),
      ]);
    }

    onExportComplete?.(`Exported CSV (${dataset})`);
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.dialog
        open
        aria-labelledby="export-modal-title"
        className="static m-0 w-full max-w-md overflow-hidden rounded-2xl border border-slate-100 bg-white p-0 shadow-2xl"
        initial={{ scale: 0.96, y: 8 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 8 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Download className="h-4 w-4" />
            </span>
            <div>
              <h3 id="export-modal-title" className="text-sm font-bold text-slate-900">
                Export Analytics Dataset
              </h3>
              <p className="text-[11px] text-slate-400">Download formatted data for reporting</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-5 text-xs">
          <div>
            <div className="block text-[11px] font-semibold text-slate-700">Select Dataset</div>
            <div className="mt-2 grid grid-cols-1 gap-2">
              {[
                {
                  id: "all",
                  label: "Complete Dashboard Summary",
                  desc: "KPIs, targets, sales and revenue totals",
                },
                {
                  id: "sales",
                  label: "Sales Team Performance",
                  desc: "Leads, conversions, deals & revenue per rep",
                },
                {
                  id: "quotes",
                  label: "Quotation Pipeline",
                  desc: "Service wise quoted amounts, status & rates",
                },
                {
                  id: "deals",
                  label: "Deals & Revenue Breakdown",
                  desc: "Closed deals and revenue by service",
                },
                {
                  id: "activity",
                  label: "Recent CRM Activity Log",
                  desc: "Real-time audit log of updates",
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDataset(opt.id)}
                  className={`flex items-start justify-between rounded-xl border p-2.5 text-left transition ${
                    dataset === opt.id
                      ? "border-blue-600 bg-blue-50/50 text-blue-900"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div>
                    <div className="font-semibold text-xs">{opt.label}</div>
                    <div className="text-[10px] text-slate-400">{opt.desc}</div>
                  </div>
                  {dataset === opt.id && (
                    <Check className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="block text-[11px] font-semibold text-slate-700">File Format</div>
            <div className="mt-2 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setFormat("csv")}
                className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-medium transition ${
                  format === "csv"
                    ? "border-blue-600 bg-blue-50 text-blue-800"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                CSV (Excel / Sheets)
              </button>
              <button
                type="button"
                onClick={() => setFormat("json")}
                className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-medium transition ${
                  format === "json"
                    ? "border-blue-600 bg-blue-50 text-blue-800"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <FileCode className="h-4 w-4 text-indigo-600" />
                JSON (Raw Structured)
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700"
            >
              <Download className="h-3.5 w-3.5" /> Download Export
            </button>
          </div>
        </div>
      </motion.dialog>
    </motion.div>
  );
}
