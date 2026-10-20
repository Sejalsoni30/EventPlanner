import { motion } from "framer-motion";
import type { EventPlan, GuestMilestone, EventType } from "../types";
import { formatCurrency } from "../utils/budgetCalculator";
import BudgetBreakdown from "./BudgetBreakdown";
import ItineraryTimeline from "./ItineraryTimeline";
import ChecklistBoard from "./ChecklistBoard";
import VendorScripts from "./VendorScripts";
import {
  Sparkles,
  RefreshCw,
  Calendar,
  Users,
  Wallet,
  Palette,
  MapPin,
  Download,
} from "lucide-react";

interface Props {
  plan: EventPlan;
  onReset: () => void;
  onMilestonesUpdate: (milestones: GuestMilestone[]) => void;
}

const EVENT_TYPE_THEMES: Record<
  EventType,
  {
    gradient: string;
    glow: string;
    border: string;
    badge: string;
  }
> = {
  Birthday: {
    gradient: "from-pink-600/25 via-purple-600/15 to-transparent",
    glow: "rgba(236, 72, 153, 0.2)",
    border: "border-pink-500/30",
    badge: "bg-pink-500/20 text-pink-200 border-pink-500/40",
  },
  Wedding: {
    gradient: "from-rose-600/25 via-amber-600/15 to-transparent",
    glow: "rgba(244, 63, 94, 0.2)",
    border: "border-rose-500/30",
    badge: "bg-rose-500/20 text-rose-200 border-rose-500/40",
  },
  "Corporate Gala": {
    gradient: "from-indigo-600/25 via-blue-600/15 to-transparent",
    glow: "rgba(99, 102, 241, 0.2)",
    border: "border-indigo-500/30",
    badge: "bg-indigo-500/20 text-indigo-200 border-indigo-500/40",
  },
  "College Fest": {
    gradient: "from-amber-600/25 via-orange-600/15 to-transparent",
    glow: "rgba(249, 115, 22, 0.2)",
    border: "border-orange-500/30",
    badge: "bg-orange-500/20 text-orange-200 border-orange-500/40",
  },
  Anniversary: {
    gradient: "from-emerald-600/25 via-teal-600/15 to-transparent",
    glow: "rgba(16, 185, 129, 0.2)",
    border: "border-emerald-500/30",
    badge: "bg-emerald-500/20 text-emerald-200 border-emerald-500/40",
  },
  "Tech Conference": {
    gradient: "from-cyan-600/25 via-blue-600/15 to-transparent",
    glow: "rgba(6, 182, 212, 0.2)",
    border: "border-cyan-500/30",
    badge: "bg-cyan-500/20 text-cyan-200 border-cyan-500/40",
  },
};

export default function EventDashboard({ plan, onReset, onMilestonesUpdate }: Props) {
  const { formData, budgetDistribution, itinerary, milestones, vendorScripts, generatedAt } = plan;
  const theme = EVENT_TYPE_THEMES[formData.eventType] || EVENT_TYPE_THEMES.Birthday;

  const handleExport = () => {
    const exportData = {
      event: formData,
      budget: budgetDistribution,
      itinerary,
      milestones,
      vendorScripts,
      generatedAt,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formData.eventName.replace(/\s+/g, "_")}_CelebrateAI_Plan.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#0b0c16] via-[#151226] to-[#0d0d1a] relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[140px] opacity-70"
          style={{ backgroundColor: theme.glow }}
        />
        <div className="absolute -bottom-40 -left-40 w-[550px] h-[550px] bg-purple-900/15 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Top Navbar */}
        <nav className="flex items-center justify-between mb-8 pb-4 border-b border-white/10" aria-label="Dashboard navigation">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-500/20 border border-purple-500/30 rounded-xl">
              <Sparkles className="w-5 h-5 text-purple-400" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xl font-black bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent">
                CelebrateAI
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                Orchestrator
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExport}
              aria-label="Export event plan as JSON"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-slate-300 hover:text-white rounded-xl text-xs sm:text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              <Download className="w-4 h-4 text-purple-400" aria-hidden="true" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={onReset}
              aria-label="Start over and plan a new event"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-purple-600/30 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              <span>New Event</span>
            </button>
          </div>
        </nav>

        {/* Hero Glass Banner */}
        <header
          className={`relative bg-gradient-to-br ${theme.gradient} border ${theme.border} rounded-3xl p-6 sm:p-8 mb-8 backdrop-blur-2xl shadow-2xl overflow-hidden`}
          aria-label="Event overview"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${theme.badge} backdrop-blur-md`}>
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                AI-Orchestrated Plan
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white mb-2 tracking-tight">
              {formData.eventName}
            </h1>

            <p className="text-slate-300 mb-6 flex items-center gap-2 flex-wrap text-sm sm:text-base font-medium">
              <span>{formData.eventType}</span>
              {formData.venue && (
                <>
                  <span className="text-slate-500">•</span>
                  <span className="inline-flex items-center gap-1.5 text-purple-200">
                    <MapPin className="w-4 h-4 text-purple-400" aria-hidden="true" />
                    {formData.venue}
                  </span>
                </>
              )}
            </p>

            {/* Key Metric Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <StatCard
                icon={<Calendar className="w-4 h-4" />}
                label="Date"
                value={new Date(formData.eventDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              />
              <StatCard
                icon={<Users className="w-4 h-4" />}
                label="Guests"
                value={`${formData.guestCount.toLocaleString()} Attendees`}
              />
              <StatCard
                icon={<Wallet className="w-4 h-4" />}
                label="Total Budget"
                value={formatCurrency(formData.budget, formData.currency)}
              />
              <StatCard
                icon={<Palette className="w-4 h-4" />}
                label="Vibe Theme"
                value={formData.theme === "Custom" ? formData.customTheme ?? "Custom" : formData.theme}
              />
            </div>
          </div>
        </header>

        {/* Dashboard Widgets */}
        <main className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left: Smart Budget Allocator */}
            <div className="xl:col-span-1 space-y-6">
              <BudgetBreakdown distribution={budgetDistribution} />
            </div>

            {/* Right: Hourly Itinerary */}
            <div className="xl:col-span-2 space-y-6">
              <ItineraryTimeline
                itinerary={itinerary}
                eventName={formData.eventName}
                eventDate={formData.eventDate}
              />
            </div>
          </div>

          {/* Full Width Kanban & Communication Scripts */}
          <div className="space-y-6">
            <ChecklistBoard milestones={milestones} onUpdate={onMilestonesUpdate} />
            <VendorScripts scripts={vendorScripts} />
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-white/10 text-center">
          <p className="text-slate-500 text-xs">
            CelebrateAI — Plan synthesized on{" "}
            {new Date(generatedAt).toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            • Challenge 5: Smart Celebration & Event Planner
          </p>
        </footer>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass-card-hover rounded-2xl p-3.5 sm:p-4 bg-white/5 border border-white/10 flex items-start gap-3 backdrop-blur-md"
    >
      <div className="p-2 bg-purple-500/20 text-purple-300 rounded-xl shrink-0 border border-purple-500/30">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">{label}</p>
        <p className="text-white text-sm sm:text-base font-bold truncate mt-0.5">{value}</p>
      </div>
    </motion.div>
  );
}
