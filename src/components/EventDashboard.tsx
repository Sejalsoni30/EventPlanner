import type { EventPlan, GuestMilestone } from "../types";
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

const EVENT_TYPE_GRADIENTS: Record<string, string> = {
  Birthday: "from-pink-600/30 to-purple-600/20",
  Wedding: "from-rose-600/30 to-pink-600/20",
  "Corporate Gala": "from-blue-600/30 to-indigo-600/20",
  "College Fest": "from-amber-600/30 to-orange-600/20",
  Anniversary: "from-violet-600/30 to-purple-600/20",
  "Tech Conference": "from-cyan-600/30 to-blue-600/20",
};

export default function EventDashboard({ plan, onReset, onMilestonesUpdate }: Props) {
  const { formData, budgetDistribution, itinerary, milestones, vendorScripts, generatedAt } = plan;
  const gradient = EVENT_TYPE_GRADIENTS[formData.eventType] ?? "from-purple-600/30 to-pink-600/20";

  const handleExport = () => {
    const exportData = {
      event: formData,
      budget: budgetDistribution,
      itinerary,
      milestones,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Top Nav */}
        <nav className="flex items-center justify-between mb-8" aria-label="Dashboard navigation">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" aria-hidden="true" />
            <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              CelebrateAI
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              aria-label="Export event plan as JSON"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={onReset}
              aria-label="Start over and plan a new event"
              className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 hover:text-white rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              <span>New Event</span>
            </button>
          </div>
        </nav>

        {/* Hero Banner */}
        <header
          className={`relative bg-gradient-to-br ${gradient} border border-white/10 rounded-3xl p-6 md:p-8 mb-8 overflow-hidden`}
          aria-label="Event overview"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" aria-hidden="true" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" aria-hidden="true" />
              <span className="text-xs text-purple-200 font-medium">AI-Generated Plan</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{formData.eventName}</h1>
            <p className="text-slate-300 mb-5">
              {formData.eventType}
              {formData.venue && ` • ${formData.venue}`}
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard
                icon={<Calendar className="w-4 h-4" />}
                label="Event Date"
                value={new Date(formData.eventDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              />
              <StatCard
                icon={<Users className="w-4 h-4" />}
                label="Guests"
                value={formData.guestCount.toLocaleString()}
              />
              <StatCard
                icon={<Wallet className="w-4 h-4" />}
                label="Total Budget"
                value={formatCurrency(formData.budget, formData.currency)}
              />
              <StatCard
                icon={<Palette className="w-4 h-4" />}
                label="Theme"
                value={formData.theme === "Custom" ? formData.customTheme ?? "Custom" : formData.theme}
              />
            </div>
          </div>
        </header>

        {/* Main Dashboard Grid */}
        <main>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column: Budget + Itinerary */}
            <div className="xl:col-span-1 space-y-6">
              <BudgetBreakdown distribution={budgetDistribution} />
            </div>

            {/* Right Columns: Itinerary */}
            <div className="xl:col-span-2 space-y-6">
              <ItineraryTimeline itinerary={itinerary} />
            </div>
          </div>

          {/* Full-Width Sections */}
          <div className="mt-6 space-y-6">
            <ChecklistBoard milestones={milestones} onUpdate={onMilestonesUpdate} />
            <VendorScripts scripts={vendorScripts} />
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-slate-500 text-xs">
            CelebrateAI — Plan generated on{" "}
            {new Date(generatedAt).toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            • Challenge 5: Celebration & Event Planner
          </p>
        </footer>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-start gap-2.5">
      <div className="text-purple-300 mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-slate-400 text-xs">{label}</p>
        <p className="text-white text-sm font-semibold truncate">{value}</p>
      </div>
    </div>
  );
}
