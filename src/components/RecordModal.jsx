import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { X, Copy, Check, FileText, Briefcase, Users, IndianRupee, Layers } from "lucide-react";
import { getRecordDetails } from "../services/mockApi.js";
import { formatDateTime } from "../lib/utils.js";

const typeIcons = {
  Lead: Users,
  Quotation: FileText,
  Deal: Briefcase,
  Payment: IndianRupee,
  "Order / Execution": Layers,
};

export default function RecordModal({ recordId, onClose }) {
  const [details, setDetails] = useState(null);
  const loading = !details || details.id !== recordId;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    let active = true;
    getRecordDetails(recordId)
      .then((d) => {
        if (active) setDetails(d);
      })
      .catch(() => {
        if (active) setDetails({});
      });
    return () => {
      active = false;
    };
  }, [recordId]);

  const copyId = () => {
    navigator.clipboard?.writeText(recordId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const Icon = details?.type ? typeIcons[details.type] || FileText : FileText;

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
        aria-labelledby="record-modal-title"
        className="static m-0 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-100 bg-white p-0 shadow-2xl"
        initial={{ scale: 0.96, y: 8 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 8 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="record-modal-title" className="text-base font-bold text-slate-900">
                  {recordId}
                </h3>
                {details?.type && (
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700">
                    {details.type}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">CRM Entity Record Details</p>
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

        <div className="p-5 text-xs">
          {loading && (
            <div className="space-y-3 py-6 text-center text-slate-400">
              <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              <p>Loading record details…</p>
            </div>
          )}

          {!loading && details && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                  <div className="text-[10px] font-medium text-slate-400">Client / Contact</div>
                  <div className="mt-0.5 font-bold text-slate-800">{details.clientName}</div>
                  {details.companyName && (
                    <div className="text-[10px] text-slate-500">{details.companyName}</div>
                  )}
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                  <div className="text-[10px] font-medium text-slate-400">Status</div>
                  <div className="mt-0.5 inline-flex items-center gap-1.5 font-bold capitalize text-emerald-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    {details.status}
                  </div>
                  {details.assignedTo && (
                    <div className="text-[10px] text-slate-500">Owner: {details.assignedTo}</div>
                  )}
                </div>
              </div>

              <div className="space-y-2 rounded-xl border border-slate-100 p-3">
                {details.service && (
                  <div className="flex justify-between py-1 text-slate-600">
                    <span className="text-slate-400">Service Category</span>
                    <span className="font-semibold text-slate-800">{details.service}</span>
                  </div>
                )}
                {details.amount && (
                  <div className="flex justify-between py-1 text-slate-600">
                    <span className="text-slate-400">Quoted Amount</span>
                    <span className="font-semibold text-slate-900">{details.amount}</span>
                  </div>
                )}
                {details.dealValue && (
                  <div className="flex justify-between py-1 text-slate-600">
                    <span className="text-slate-400">Total Deal Value</span>
                    <span className="font-semibold text-blue-600">{details.dealValue}</span>
                  </div>
                )}
                {details.revenue && (
                  <div className="flex justify-between py-1 text-slate-600">
                    <span className="text-slate-400">Closed Revenue</span>
                    <span className="font-semibold text-emerald-600">{details.revenue}</span>
                  </div>
                )}
                {details.collected && (
                  <div className="flex justify-between py-1 text-slate-600">
                    <span className="text-slate-400">Collected Amount</span>
                    <span className="font-semibold text-slate-900">{details.collected}</span>
                  </div>
                )}
                {details.priority && (
                  <div className="flex justify-between py-1 text-slate-600">
                    <span className="text-slate-400">Deal Priority</span>
                    <span className="font-semibold text-slate-800">{details.priority}</span>
                  </div>
                )}
                {details.stages && (
                  <div className="flex justify-between py-1 text-slate-600">
                    <span className="text-slate-400">Execution Stages</span>
                    <span className="font-semibold text-slate-800">{details.stages}</span>
                  </div>
                )}
                {details.date && (
                  <div className="flex justify-between py-1 text-slate-600">
                    <span className="text-slate-400">Record Timestamp</span>
                    <span className="text-slate-700">{formatDateTime(details.date)}</span>
                  </div>
                )}
              </div>

              {details.notes && (
                <div className="rounded-xl bg-slate-50 p-3 text-slate-600">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Audit Notes
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed">{details.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={copyId}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-slate-500" />
                  )}
                  {copied ? "Copied" : "Copy ID"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.dialog>
    </motion.div>
  );
}
