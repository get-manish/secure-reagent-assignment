import { useEffect } from "react";
import { motion } from "motion/react";
import { X, Mail, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Avatar } from "./Card.jsx";

export default function UserModal({ member, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!member) return null;

  const isOps = member.role?.toLowerCase().includes("operation") || member.updated !== undefined;

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
        aria-labelledby="modal-title"
        className="static m-0 w-full max-w-md overflow-hidden rounded-2xl border border-slate-100 bg-white p-0 shadow-2xl"
        initial={{ scale: 0.96, y: 8 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 8 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div className="flex items-center gap-3">
            <Avatar
              name={member.name}
              color={isOps ? "#38BDF8" : "#8B5CF6"}
              size="h-9 w-9 text-xs"
            />
            <div>
              <h3 id="modal-title" className="text-base font-bold text-slate-900">
                {member.name}
              </h3>
              <p className="text-xs text-slate-500">
                {member.role || "Team Member"} • {isOps ? "Operations Team" : "Sales Team"}
              </p>
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
          {member.email && (
            <div className="flex items-center gap-2 text-slate-500">
              <Mail className="h-3.5 w-3.5" />
              <span>{member.email}</span>
            </div>
          )}

          {!isOps ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200/60 bg-slate-50/80 p-3">
                  <div className="text-[10px] font-medium text-slate-400">Active Deals</div>
                  <div className="mt-0.5 text-lg font-bold text-slate-900">
                    {member.deals ?? 0} Deals
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Pipeline: {member.dealValue || "₹0"}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200/60 bg-emerald-50/50 p-3">
                  <div className="text-[10px] font-medium text-emerald-600">
                    Total Closed Revenue
                  </div>
                  <div className="mt-0.5 text-lg font-bold text-emerald-700">
                    {member.revenue || "₹0"}
                  </div>
                  <div className="text-[10px] text-emerald-600/80">Conv: {member.conv || "0%"}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  ["Leads Handled", member.leads ?? 0],
                  ["Qualified", member.qualified ?? 0],
                  ["Converted", member.converted ?? 0],
                ].map(([l, v]) => (
                  <div key={l} className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                    <div className="text-[10px] text-slate-400">{l}</div>
                    <div className="mt-0.5 text-sm font-bold text-slate-800">{v}</div>
                  </div>
                ))}
              </div>

              {member.quotes !== undefined && (
                <div className="flex items-center justify-between rounded-xl bg-blue-50/60 px-3 py-2 text-blue-900">
                  <span className="text-[11px] font-medium">Quotations Submitted</span>
                  <span className="font-bold text-sm">{member.quotes}</span>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200/60 bg-slate-50/80 p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                    <Clock className="h-3 w-3 text-sky-500" /> Orders Updated
                  </div>
                  <div className="mt-0.5 text-lg font-bold text-slate-900">
                    {member.updated ?? 0}
                  </div>
                  <div className="text-[10px] text-slate-500">Active fulfillment queue</div>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-600">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Stages Completed
                  </div>
                  <div className="mt-0.5 text-lg font-bold text-emerald-700">
                    {member.completed ?? 0}
                  </div>
                  <div className="text-[10px] text-emerald-600/80">Milestones achieved</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-2.5">
                  <div className="text-[10px] text-amber-700">Pending Stages</div>
                  <div className="mt-0.5 text-sm font-bold text-amber-800">
                    {member.pending ?? 0}
                  </div>
                </div>
                <div className="rounded-xl border border-red-100 bg-red-50/50 p-2.5">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-red-600">
                    <AlertCircle className="h-3 w-3" /> Overdue
                  </div>
                  <div className="mt-0.5 text-sm font-bold text-red-700">{member.overdue ?? 0}</div>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Close View
            </button>
          </div>
        </div>
      </motion.dialog>
    </motion.div>
  );
}
