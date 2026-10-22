import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { EventPlan, GuestMilestone, EventType } from "../types";
import { formatCurrency } from "../utils/budgetCalculator";
import BudgetBreakdown from "./BudgetBreakdown";
import ItineraryTimeline from "./ItineraryTimeline";
import ChecklistBoard from "./ChecklistBoard";
import VendorScripts from "./VendorScripts";
import VenueMap from "./VenueMap";
import InvitationCardModal from "./InvitationCardModal";
import { CelebrateLogo } from "./CelebrateLogo";
import CountdownTimer from "./CountdownTimer";
import WeatherWidget from "./WeatherWidget";
import RSVPTracker from "./RSVPTracker";
import MoodBoard from "./MoodBoard";
import GiftRegistry from "./GiftRegistry";
import InviteSender from "./InviteSender";
import SeatingBuilder from "./SeatingBuilder";
import MultiDayPlanner from "./MultiDayPlanner";
import {
  Sparkles,
  RefreshCw,
  Calendar,
  Users,
  Wallet,
  Palette,
  MapPin,
  Mail,
  Home,
  ArrowUp,
} from "lucide-react";

interface Props {
  plan: EventPlan;
  onReset: () => void;
  onMilestonesUpdate: (milestones: GuestMilestone[]) => void;
}

// Warm, handcrafted, human-designed celebration themes
const EVENT_TYPE_THEMES: Record<
  EventType,
  {
    gradient: string;
    glow: string;
    border: string;
    badge: string;
    accent: string;
  }
> = {
  Birthday: {
    gradient: "from-amber-600/20 via-rose-600/10 to-transparent",
    glow: "rgba(245, 158, 11, 0.15)",
    border: "border-amber-500/25",
    badge: "bg-amber-500/15 text-amber-200 border-amber-500/30",
    accent: "text-amber-300",
  },
  Wedding: {
    gradient: "from-[#d4af37]/25 via-rose-700/15 to-transparent",
    glow: "rgba(212, 175, 55, 0.18)",
    border: "border-[#d4af37]/35",
    badge: "bg-[#d4af37]/15 text-[#f3e8c8] border-[#d4af37]/35",
    accent: "text-[#d4af37]",
  },
  "Corporate Gala": {
    gradient: "from-blue-700/20 via-slate-800/20 to-transparent",
    glow: "rgba(59, 130, 246, 0.14)",
    border: "border-blue-400/25",
    badge: "bg-blue-500/15 text-blue-200 border-blue-400/30",
    accent: "text-blue-300",
  },
  "College Fest": {
    gradient: "from-orange-600/20 via-amber-600/10 to-transparent",
    glow: "rgba(249, 115, 22, 0.15)",
    border: "border-orange-500/25",
    badge: "bg-orange-500/15 text-orange-200 border-orange-500/30",
    accent: "text-orange-300",
  },
  Anniversary: {
    gradient: "from-emerald-700/20 via-teal-800/10 to-transparent",
    glow: "rgba(16, 185, 129, 0.15)",
    border: "border-emerald-500/25",
    badge: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
    accent: "text-emerald-300",
  },
  "Tech Conference": {
    gradient: "from-cyan-700/20 via-indigo-900/15 to-transparent",
    glow: "rgba(6, 182, 212, 0.14)",
    border: "border-cyan-500/25",
    badge: "bg-cyan-500/15 text-cyan-200 border-cyan-500/30",
    accent: "text-cyan-300",
  },
};

export default function EventDashboard({ plan, onReset, onMilestonesUpdate }: Props) {
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const [currentVenue, setCurrentVenue] = useState(plan.formData.venue || "The Grand Ballroom");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { formData, budgetDistribution, itinerary, milestones, vendorScripts, generatedAt } = plan;
  const theme = EVENT_TYPE_THEMES[formData.eventType] || EVENT_TYPE_THEMES.Birthday;

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleExportClick = () => {
    // Opens the bespoke Invitation Card Studio
    setIsInvitationOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#0c0d12] via-[#14161d] to-[#0e0f14] relative overflow-hidden text-stone-100">
      {/* Warm Ambient Candlelight & Sunset Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[140px] opacity-60 transition-all duration-1000"
          style={{ backgroundColor: theme.glow }}
        />
        <div className="absolute -bottom-40 -left-40 w-[550px] h-[550px] bg-amber-900/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(224,186,117,0.03)_1px,transparent_1px)] [background-size:24px_24px] opacity-35" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Top Navbar */}
        <nav className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 mb-6 sm:mb-8 pb-4 border-b border-white/10" aria-label="Dashboard navigation">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <CelebrateLogo size={34} />
            <div className="min-w-0">
              <span className="text-lg sm:text-xl font-editorial font-bold bg-gradient-to-r from-stone-100 via-amber-100 to-amber-300 bg-clip-text text-transparent truncate block">
                CelebrateAI
              </span>
              <span className="hidden md:inline-block text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-white/10 text-stone-300 border border-white/10">
                Hospitality Atelier
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 ml-auto sm:ml-0">
            {/* Export & Invitation Button */}
            <button
              onClick={handleExportClick}
              aria-label="Export event plan as JSON"
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-amber-600/25 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-stone-950" aria-hidden="true" />
              <span className="hidden sm:inline">Invitation Card & Export</span>
              <span className="sm:hidden">Invite Card</span>
            </button>

            {/* New Event Button */}
            <button
              onClick={onReset}
              aria-label="Start over and plan a new event"
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/15 text-stone-300 hover:text-white rounded-xl text-xs sm:text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">New Event</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </nav>

        {/* Hero Banner with Human-Made Editorial Styling */}
        <header
          className={`relative bg-gradient-to-br ${theme.gradient} border ${theme.border} rounded-3xl p-6 sm:p-8 mb-8 backdrop-blur-2xl shadow-2xl overflow-hidden`}
          aria-label="Event overview"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${theme.badge} backdrop-blur-md`}>
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                Handcrafted Celebration Blueprint
              </span>

              {/* Quick Card Trigger */}
              <button
                onClick={() => setIsInvitationOpen(true)}
                className="text-xs text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full transition-all cursor-pointer"
              >
                <span>Preview Invitation Card</span>
                <span>→</span>
              </button>
            </div>

            <h1 className="text-3xl sm:text-5xl font-editorial font-bold text-white mb-2 tracking-wide leading-tight">
              {formData.eventName}
            </h1>

            <p className="text-stone-300 mb-6 flex items-center gap-2 flex-wrap text-sm sm:text-base font-medium">
              <span className="text-amber-200">{formData.eventType}</span>
              {currentVenue && (
                <>
                  <span className="text-stone-500">•</span>
                  <span className="inline-flex items-center gap-1.5 text-stone-200">
                    <MapPin className="w-4 h-4 text-amber-400" aria-hidden="true" />
                    {currentVenue}
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

        {/* Dashboard Main Widgets */}
        <main className="space-y-6">
          {/* Top Section: Smart Budget Allocator + Hourly Itinerary */}
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

          {/* Place Map Location Section */}
          <VenueMap
            venue={currentVenue}
            eventName={formData.eventName}
            onUpdateVenue={(v) => setCurrentVenue(v)}
          />

          {/* Full Width Kanban & Communication Scripts */}
          <div className="space-y-6">
            <ChecklistBoard milestones={milestones} onUpdate={onMilestonesUpdate} />
            <VendorScripts scripts={vendorScripts} />
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              NEW FEATURE MODULES — 8 Enhanced Planning Tools
              ═══════════════════════════════════════════════════════════════ */}
          <div className="pt-6 border-t border-white/8">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
              <span className="flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/25 rounded-full text-xs font-bold text-amber-300 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                Enhanced Planning Suite
              </span>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent via-amber-500/30 to-transparent" />
            </div>

            <div className="space-y-6">
              {/* Row 1: Countdown + Weather */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CountdownTimer eventDate={formData.eventDate} eventName={formData.eventName} />
                <WeatherWidget eventDate={formData.eventDate} venue={currentVenue} />
              </div>

              {/* Row 2: RSVP + Mood Board */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <RSVPTracker guestCount={formData.guestCount} />
                <MoodBoard theme={formData.theme} eventType={formData.eventType} />
              </div>

              {/* Row 3: Gift Registry + Invite Sender */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <GiftRegistry currency={formData.currency} />
                <InviteSender
                  scripts={vendorScripts}
                  eventName={formData.eventName}
                  eventDate={formData.eventDate}
                  venue={currentVenue}
                />
              </div>

              {/* Row 4: Seating Builder (full width) */}
              <SeatingBuilder totalGuests={formData.guestCount} />

              {/* Row 5: Multi-Day Planner (full width) */}
              <MultiDayPlanner startDate={formData.eventDate} />
            </div>
          </div>
        </main>

        {/* ═══════════════════════════════════════════════════════════════
            GRAND "GO TO HOME PAGE" FINALE CARD (AT THE VERY LAST)
            ═══════════════════════════════════════════════════════════════ */}
        <section
          aria-label="Return to home page and next actions"
          className="mt-14 mb-8 human-card rounded-3xl p-8 sm:p-12 border-2 border-amber-500/30 text-center relative overflow-hidden backdrop-blur-2xl shadow-2xl"
        >
          {/* Subtle background ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-black/40 pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto">
            <span className="text-[11px] font-cinzel font-bold tracking-[0.25em] text-amber-400 uppercase bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Blueprint Finalized & Ready for Execution
            </span>

            <h2 className="text-2xl sm:text-4xl font-editorial font-bold text-white mb-3 tracking-wide leading-tight">
              Ready to Orchestrate Your Next Celebration?
            </h2>

            <p className="text-stone-300 text-xs sm:text-sm font-sans mb-8 leading-relaxed">
              Your budget allocation, hourly itinerary, venue map, milestone checklist, and vendor scripts are fully configured. You can return to the home page anytime to design a new celebration or print your bespoke invitation card.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              {/* Primary Go to Home Page CTA */}
              <button
                onClick={onReset}
                aria-label="Go to home page to create a new event"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-extrabold rounded-2xl text-sm sm:text-base shadow-xl shadow-amber-600/35 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Home className="w-5 h-5 text-stone-950" />
                <span>Go to Home Page</span>
              </button>

              {/* View Invitation Card */}
              <button
                onClick={() => setIsInvitationOpen(true)}
                aria-label="Open bespoke invitation card studio"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold rounded-2xl text-sm sm:text-base hover:scale-102 active:scale-98 transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4 text-amber-400" />
                <span>Invitation Card</span>
              </button>

              {/* Back to Top */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                aria-label="Scroll back to top of dashboard"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white font-medium rounded-2xl text-sm transition-all cursor-pointer"
              >
                <ArrowUp className="w-4 h-4" />
                <span>Back to Top</span>
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 pt-6 pb-24 sm:pb-8 border-t border-white/10 text-center">
          <p className="text-stone-500 text-xs font-serif">
            CelebrateAI — Synthesized on{" "}
            {new Date(generatedAt).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            • Tailored Human-Designed Celebration Orchestrator
          </p>
        </footer>
      </div>

      {/* Floating Quick Action Navigation Pill (Bottom-Right) */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-2 p-1.5 rounded-2xl bg-stone-950/90 border border-amber-500/40 shadow-2xl backdrop-blur-xl"
          >
            <button
              onClick={onReset}
              title="Go to Home Page"
              aria-label="Go to Home Page"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-bold rounded-xl text-xs hover:from-amber-500 hover:to-amber-400 transition-all cursor-pointer shadow-md shadow-amber-600/20"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              title="Scroll to Top"
              aria-label="Scroll to top"
              className="p-2 text-stone-300 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bespoke Invitation Card Modal */}
      <InvitationCardModal
        plan={{ ...plan, formData: { ...plan.formData, venue: currentVenue } }}
        isOpen={isInvitationOpen}
        onClose={() => setIsInvitationOpen(false)}
      />
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="human-card-hover rounded-2xl p-3.5 sm:p-4 bg-white/5 border border-amber-500/15 flex items-start gap-3 backdrop-blur-md"
    >
      <div className="p-2 bg-amber-500/15 text-amber-300 rounded-xl shrink-0 border border-amber-500/25">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-stone-400 text-[11px] uppercase tracking-wider font-semibold">{label}</p>
        <p className="text-white text-sm sm:text-base font-bold truncate mt-0.5">{value}</p>
      </div>
    </motion.div>
  );
}
