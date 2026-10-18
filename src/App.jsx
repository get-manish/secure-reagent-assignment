import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, MotionConfig } from "motion/react";
import Header from "./components/Header.jsx";
import KpiGrid from "./components/KpiGrid.jsx";
import LeadRow from "./components/LeadRow.jsx";
import QuotationRow from "./components/QuotationRow.jsx";
import DealsRow from "./components/DealsRow.jsx";
import ActivityRow from "./components/ActivityRow.jsx";
import UserModal from "./components/UserModal.jsx";
import RecordModal from "./components/RecordModal.jsx";
import ExportModal from "./components/ExportModal.jsx";
import { getDashboardData, getFilterOptions } from "./services/mockApi.js";
import { DATE_RANGES } from "./data/mockData.js";
import { RotateCcw, AlertTriangle } from "lucide-react";

const DEFAULT_FILTERS = {
  range: DATE_RANGES[0] || "Oct 1 - Oct 31, 2026",
  user: "All Users",
  department: "All Departments",
};

export default function App() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [filterOptions, setFilterOptions] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }, []);

  // Fetch filter options once on mount
  useEffect(() => {
    let active = true;
    getFilterOptions()
      .then((opts) => {
        if (active) setFilterOptions(opts);
      })
      .catch((err) => {
        console.error("Failed to load filter options", err);
      });
    return () => {
      active = false;
    };
  }, []);

  // Fetch dashboard data when filters change
  useEffect(() => {
    let active = true;
    getDashboardData(filters)
      .then((result) => {
        if (active) {
          setData(result);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Failed to load dashboard data");
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [filters]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const result = await getDashboardData(filters);
      setData(result);
      setError(null);
      showToast("Dashboard data refreshed successfully");
    } catch (err) {
      setError(err.message || "Failed to refresh dashboard data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRetry = () => {
    setLoading(true);
    getDashboardData(filters)
      .then((result) => {
        setData(result);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Failed to load dashboard data");
      })
      .finally(() => setLoading(false));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    showToast("Filters reset to default view");
  };

  const isFiltered =
    filters.range !== DEFAULT_FILTERS.range ||
    filters.user !== DEFAULT_FILTERS.user ||
    filters.department !== DEFAULT_FILTERS.department;

  return (
    <MotionConfig reducedMotion="user">
      <main className="mx-auto max-w-[1920px] space-y-5 p-4 lg:p-6 min-h-screen">
        <Header
          filters={filters}
          setFilters={setFilters}
          filterOptions={filterOptions}
          onExport={() => setIsExportOpen(true)}
          onRefresh={handleRefresh}
          onReset={handleResetFilters}
          isRefreshing={isRefreshing}
          isFiltered={isFiltered}
        />

        {error && (
          <div
            role="alert"
            className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800 shadow-xs"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
              <span>Failed to load analytics: {error}</span>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 font-medium text-white hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        {loading && !data && (
          <div className="space-y-4 py-12">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-xl border border-slate-200/80 bg-white/70 p-3"
                />
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-24">
              <div className="h-56 animate-pulse rounded-xl bg-white/70 xl:col-span-6 border border-slate-200/80" />
              <div className="h-56 animate-pulse rounded-xl bg-white/70 xl:col-span-5 border border-slate-200/80" />
              <div className="h-56 animate-pulse rounded-xl bg-white/70 xl:col-span-7 border border-slate-200/80" />
              <div className="h-56 animate-pulse rounded-xl bg-white/70 xl:col-span-6 border border-slate-200/80" />
            </div>
          </div>
        )}

        {data && (
          <>
            <KpiGrid kpis={data.kpis} />
            <LeadRow d={data} />
            <QuotationRow d={data} />
            <DealsRow d={data} />
            <ActivityRow
              d={data}
              onSelectUser={setSelectedUser}
              onSelectRecord={setSelectedRecordId}
            />

            {/* Empty state if all items are 0 */}
            {data.kpis[0].value === "0" && data.kpis[5].value === "0" && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center">
                <p className="text-sm font-semibold text-slate-700">No data for selected filters</p>
                <p className="mt-1 text-xs text-slate-400">
                  Try adjusting the date range, user or department selection.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-blue-700"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* User Performance Modal */}
      <AnimatePresence>
        {selectedUser && <UserModal member={selectedUser} onClose={() => setSelectedUser(null)} />}
      </AnimatePresence>

      {/* Record Inspection Modal */}
      <AnimatePresence>
        {selectedRecordId && (
          <RecordModal recordId={selectedRecordId} onClose={() => setSelectedRecordId(null)} />
        )}
      </AnimatePresence>

      {/* Export Options Modal */}
      <AnimatePresence>
        {isExportOpen && (
          <ExportModal
            data={data}
            filters={filters}
            onClose={() => setIsExportOpen(false)}
            onExportComplete={showToast}
          />
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      {toast && (
        <output className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-medium text-white shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          {toast}
        </output>
      )}
    </MotionConfig>
  );
}
