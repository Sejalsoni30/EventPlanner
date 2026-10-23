import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import type { EventPlan } from "../types";
import {
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Heart,
  Gift,
  CheckCircle2,
  Users,
  Navigation,
  Utensils,
  PartyPopper,
  ExternalLink,
  Search,
} from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import WeatherWidget from "./WeatherWidget";
import MoodBoard from "./MoodBoard";

interface GuestPortalProps {
  plan: EventPlan;
  onOpenInvitation: () => void;
}

interface RSVPState {
  guestName: string;
  email: string;
  attending: "yes" | "no";
  partySize: number;
  dietary: string;
  wishes: string;
  submitted: boolean;
}

export const GuestCelebrationPortal: React.FC<GuestPortalProps> = ({
  plan,
  onOpenInvitation,
}) => {
  const { formData, itinerary } = plan;

  // RSVP Form State
  const [rsvp, setRsvp] = useState<RSVPState>({
    guestName: "",
    email: "",
    attending: "yes",
    partySize: 1,
    dietary: "None",
    wishes: "",
    submitted: false,
  });

  // Table Finder State
  const [guestSearch, setGuestSearch] = useState("");

  // Claimed Gifts State
  const [claimedGifts, setClaimedGifts] = useState<Record<string, string>>({});

  // Invitation card flip state
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Wishing well state
  const [wishingWellAmount, setWishingWellAmount] = useState<number | null>(null);
  const [wishingWellSuccess, setWishingWellSuccess] = useState(false);

  // Sample guest seating directory derived from event
  const sampleTables = [
    { table: "Table 1 — Imperial Orchid", guests: ["Aarav Sharma", "Priya Mehta", "Kabir Khan", "Rhea Kapoor"] },
    { table: "Table 2 — Royal Jasmine", guests: ["Dev Singhania", "Ananya Verma", "Vikram Patel", "Neha Joshi"] },
    { table: "Table 3 — Golden Marigold", guests: ["Rohan Rao", "Sneha Roy", "Aditya Nair", "Pooja Hegde"] },
    { table: "Table 4 — Velvet Lotus", guests: ["Rajesh Kumar", "Sunita Sharma", "Karan Johar", "Meera Sen"] },
  ];

  const matchedTable = guestSearch.trim()
    ? sampleTables.find((t) =>
        t.guests.some((g) => g.toLowerCase().includes(guestSearch.toLowerCase()))
      ) || (guestSearch.length > 2 ? { table: "Table 1 — Imperial Orchid (Reserved for You)", guests: [guestSearch, "Plus Guest"] } : null)
    : null;

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvp.guestName.trim()) {
      alert("Please enter your name to confirm your RSVP.");
      return;
    }

    setRsvp((prev) => ({ ...prev, submitted: true }));

    // Celebratory confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#d4af37", "#f59e0b", "#ec4899", "#8b5cf6"],
    });
  };

  const handleClaimGift = (itemTitle: string) => {
    if (claimedGifts[itemTitle]) return;
    setClaimedGifts((prev) => ({
      ...prev,
      [itemTitle]: rsvp.guestName || "You",
    }));

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#10b981", "#d4af37", "#f59e0b"],
    });
  };

  const handleWishingWellContribute = (amount: number) => {
    setWishingWellAmount(amount);
    setWishingWellSuccess(true);
    confetti({
      particleCount: 60,
      spread: 65,
      origin: { y: 0.7 },
      colors: ["#d4af37", "#ec4899"],
    });
    setTimeout(() => setWishingWellSuccess(false), 4000);
  };

  // Filter itinerary items relevant for attendees
  const guestItinerary = itinerary.filter(
    (item) => item.category === "Guest" || item.category === "Program" || item.category === "Catering"
  );

  const formattedDate = new Date(formData.eventDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ─── GUEST WELCOME HERO BANNER ───────────────────────────────────── */}
      <header className="relative human-card rounded-3xl p-6 sm:p-10 border border-amber-500/25 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 mb-3.5">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Official Guest Celebration Hub</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-editorial font-bold text-white mb-3 tracking-tight">
              You are Cordially Invited to Celebrate
            </h1>
            <p className="text-xl sm:text-2xl font-editorial text-amber-200/90 mb-4 font-semibold">
              {formData.eventName}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-stone-300">
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                <Calendar className="w-4 h-4 text-amber-400" aria-hidden="true" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                <MapPin className="w-4 h-4 text-amber-400" aria-hidden="true" />
                {formData.venue || "The Grand Ballroom"}
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                <PartyPopper className="w-4 h-4 text-amber-400" aria-hidden="true" />
                {formData.theme === "Custom" ? formData.customTheme : formData.theme}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={onOpenInvitation}
              aria-label="Open luxury invitation card"
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold rounded-2xl text-sm shadow-xl shadow-amber-600/25 transition-all cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-stone-950" aria-hidden="true" />
              <span>Open Invitation Card</span>
            </button>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(formData.venue || "The Grand Ballroom")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get directions on Google Maps"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-stone-200 hover:text-white rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <span>Directions & Venue Map</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      {/* ─── COUNTDOWN & WEATHER OVERVIEW ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CountdownTimer eventDate={formData.eventDate} eventName={formData.eventName} />
        <WeatherWidget eventDate={formData.eventDate} venue={formData.venue || "The Grand Ballroom"} />
      </div>

      {/* ─── INTERACTIVE RSVP & GUEST PASS SECTION ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive RSVP Form */}
        <section
          aria-labelledby="guest-rsvp-heading"
          className="lg:col-span-7 human-card rounded-3xl p-6 sm:p-8 border border-amber-500/20 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="p-2.5 bg-amber-500/15 border border-amber-500/30 rounded-2xl text-amber-400">
              <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="guest-rsvp-heading" className="text-lg font-bold text-white tracking-tight">
                Guest RSVP & Attendance Confirmation
              </h2>
              <p className="text-xs text-stone-400">
                Please respond to help our hosts prepare your seat & celebration feast
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {rsvp.submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 bg-gradient-to-br from-amber-500/15 via-emerald-500/10 to-transparent border border-amber-500/30 rounded-2xl text-center space-y-4"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <PartyPopper className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-editorial font-bold text-white">
                    {rsvp.attending === "yes" ? "RSVP Confirmed with Joy!" : "Response Recorded with Regret"}
                  </h3>
                  <p className="text-sm text-stone-300 mt-1">
                    Thank you, <span className="text-amber-300 font-semibold">{rsvp.guestName}</span>.
                    {rsvp.attending === "yes"
                      ? ` We have reserved seating for ${rsvp.partySize} ${rsvp.partySize > 1 ? "guests" : "guest"} with dietary preference: ${rsvp.dietary}.`
                      : " We will miss you at the celebration!"}
                  </p>
                </div>

                {rsvp.wishes && (
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs italic text-stone-300 max-w-md mx-auto">
                    "{rsvp.wishes}"
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setRsvp((prev) => ({ ...prev, submitted: false }))}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4 cursor-pointer"
                >
                  Edit your RSVP details
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      Your Full Name <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={rsvp.guestName}
                      onChange={(e) => setRsvp({ ...rsvp, guestName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-stone-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. priya@example.com"
                      value={rsvp.email}
                      onChange={(e) => setRsvp({ ...rsvp, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-stone-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Will you attend radio toggle */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-2">
                    Will you be joining the celebration?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRsvp({ ...rsvp, attending: "yes" })}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                        rsvp.attending === "yes"
                          ? "bg-amber-500/20 border-amber-500 text-amber-200 shadow-md shadow-amber-500/10"
                          : "bg-white/5 border-white/10 text-stone-400 hover:bg-white/10"
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Joyfully Accept 🎉</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvp({ ...rsvp, attending: "no" })}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                        rsvp.attending === "no"
                          ? "bg-rose-500/20 border-rose-500 text-rose-200 shadow-md shadow-rose-500/10"
                          : "bg-white/5 border-white/10 text-stone-400 hover:bg-white/10"
                      }`}
                    >
                      <span>Regretfully Decline ✉️</span>
                    </button>
                  </div>
                </div>

                {rsvp.attending === "yes" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                        Party Size (Number of Guests)
                      </label>
                      <select
                        value={rsvp.partySize}
                        onChange={(e) => setRsvp({ ...rsvp, partySize: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-amber-400"
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n} className="bg-stone-900 text-white">
                            {n} {n === 1 ? "Person" : "Persons"}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                        Dietary Preference
                      </label>
                      <select
                        value={rsvp.dietary}
                        onChange={(e) => setRsvp({ ...rsvp, dietary: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-amber-400"
                      >
                        <option value="None" className="bg-stone-900 text-white">No Dietary Restrictions</option>
                        <option value="Vegetarian" className="bg-stone-900 text-white">Vegetarian</option>
                        <option value="Vegan" className="bg-stone-900 text-white">Vegan</option>
                        <option value="Halal" className="bg-stone-900 text-white">Halal</option>
                        <option value="Kosher" className="bg-stone-900 text-white">Kosher</option>
                        <option value="Gluten-Free" className="bg-stone-900 text-white">Gluten-Free</option>
                        <option value="Nut Allergy" className="bg-stone-900 text-white">Nut Allergy</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Congratulatory Wishes / Note for Hosts
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Write a warm note for the celebration memory book..."
                    value={rsvp.wishes}
                    onChange={(e) => setRsvp({ ...rsvp, wishes: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-stone-500 text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold rounded-xl text-sm shadow-lg shadow-amber-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Submit My RSVP Confirmation</span>
                </button>
              </form>
            )}
          </AnimatePresence>
        </section>

        {/* Right: 3D Flippable Digital Pass & Table Finder */}
        <div className="lg:col-span-5 space-y-6">
          {/* Digital VIP Invitation Showcase */}
          <div className="human-card rounded-3xl p-6 border border-amber-500/20 shadow-xl text-center relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest font-bold text-amber-300">
                Digital Pass Card
              </span>
              <button
                type="button"
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                className="text-xs text-amber-300 hover:text-amber-200 font-semibold underline cursor-pointer"
              >
                {isCardFlipped ? "Flip to Front" : "Flip to Back 🔄"}
              </button>
            </div>

            {/* Flippable Card Container */}
            <div className="relative min-h-[220px] rounded-2xl bg-gradient-to-br from-amber-950/40 via-stone-900/60 to-amber-900/30 border border-amber-500/40 p-5 flex flex-col justify-between shadow-inner">
              <div className="flex justify-between items-start text-left">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-amber-400/80">Guest Invitation</p>
                  <p className="text-lg font-editorial font-bold text-white">{formData.eventName}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    VIP Guest
                  </span>
                </div>
              </div>

              {!isCardFlipped ? (
                <div className="my-3 text-left">
                  <p className="text-xs text-stone-300">
                    Honoring: <span className="text-amber-200 font-semibold">{rsvp.guestName || "Distinguished Guest"}</span>
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    📅 {formattedDate}
                  </p>
                  <p className="text-xs text-stone-400">
                    📍 {formData.venue || "The Grand Ballroom"}
                  </p>
                </div>
              ) : (
                <div className="my-3 text-left">
                  <p className="text-[11px] text-amber-200 font-bold uppercase tracking-wider mb-1">Entry Guidelines</p>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Please present this digital pass at the reception concourse. Valet parking is complimentary.
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-amber-500/20 flex items-center justify-between">
                <span className="text-[10px] text-stone-400 font-mono">PASS-ID: CELEBRATE-{formData.eventType.slice(0, 3).toUpperCase()}</span>
                <button
                  type="button"
                  onClick={onOpenInvitation}
                  className="text-xs text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Full Card</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Table Seating Finder */}
          <div className="human-card rounded-3xl p-6 border border-amber-500/20 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Guest Table & Seating Finder
              </h3>
            </div>
            <p className="text-xs text-stone-400 mb-3">
              Type your name to instantly locate your table assignment
            </p>
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search attendee name (e.g. Aarav, Priya)..."
                value={guestSearch}
                onChange={(e) => setGuestSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-stone-500 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            {matchedTable && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-left"
              >
                <p className="text-xs font-bold text-amber-300">{matchedTable.table}</p>
                <p className="text-[11px] text-stone-300 mt-0.5">
                  Tablemates: {matchedTable.guests.slice(0, 3).join(", ")}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ─── GUEST DAY-OF ITINERARY & PROGRAM ────────────────────────────── */}
      <section
        aria-labelledby="guest-itinerary-heading"
        className="human-card rounded-3xl p-6 sm:p-8 border border-amber-500/20 shadow-xl"
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/15 border border-amber-500/30 rounded-2xl text-amber-400">
              <Clock className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="guest-itinerary-heading" className="text-lg font-bold text-white tracking-tight">
                Guest Celebration Program & Timeline
              </h2>
              <p className="text-xs text-stone-400">
                Key moments, performances & banquets scheduled for your enjoyment
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25">
            {guestItinerary.length} Celebration Highlights
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {guestItinerary.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 hover:bg-white/8 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-amber-300 px-2 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/25">
                    {item.time}
                  </span>
                  <span className="text-[11px] text-stone-400">
                    {item.duration}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                <p className="text-xs text-stone-300 leading-relaxed mb-3">{item.description}</p>
              </div>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-stone-400">
                <span className="flex items-center gap-1">
                  <Utensils className="w-3 h-3 text-amber-400" />
                  {item.category}
                </span>
                <span>Host: {item.poc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── GIFT REGISTRY & WISHING WELL ─────────────────────────────────── */}
      <section
        aria-labelledby="gift-registry-heading"
        className="human-card rounded-3xl p-6 sm:p-8 border border-amber-500/20 shadow-xl"
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/15 border border-rose-500/30 rounded-2xl text-rose-400">
              <Gift className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="gift-registry-heading" className="text-lg font-bold text-white tracking-tight">
                Celebration Gift Registry & Wishing Well
              </h2>
              <p className="text-xs text-stone-400">
                Support the hosts' new beginnings or celebrate their milestone
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Wishing Well contribution box */}
          <div className="lg:col-span-1 p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-rose-500/10 to-transparent border border-amber-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Heart className="w-4 h-4 fill-amber-300" />
                <span>The Wishing Well</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Send a Token of Blessing</h3>
              <p className="text-xs text-stone-300 leading-relaxed mb-4">
                Your presence is the greatest gift. If you wish to contribute towards our celebration journey:
              </p>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {[1000, 2500, 5000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleWishingWellContribute(amt)}
                    className="py-2 px-3 rounded-xl bg-white/10 hover:bg-amber-500/20 border border-white/15 hover:border-amber-500/40 text-xs font-bold text-amber-200 transition-all cursor-pointer"
                  >
                    {formData.currency === "INR" ? `₹${amt.toLocaleString()}` : `$${amt / 50}`}
                  </button>
                ))}
              </div>

              {wishingWellSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-center text-xs font-bold text-emerald-300"
                >
                  🎉 Wishing well blessing of {formData.currency === "INR" ? `₹${wishingWellAmount?.toLocaleString()}` : `$${(wishingWellAmount ?? 0) / 50}`} sent with love!
                </motion.div>
              )}
            </div>

            <p className="text-[10px] text-stone-400 italic text-center mt-3">
              Protected by CelebrateAI Secure Gifting Portal
            </p>
          </div>

          {/* Curated Registry Items */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: "Artisan Ceramic Dinner Set", category: "Home & Living", price: formData.currency === "INR" ? "₹8,500" : "$120" },
              { title: "Barista Espresso Station", category: "Kitchen & Dining", price: formData.currency === "INR" ? "₹14,000" : "$180" },
              { title: "Weekend Honeymoon Retreat", category: "Experiences", price: formData.currency === "INR" ? "₹25,000" : "$350" },
              { title: "Luxury Champagne Hamper", category: "Celebration", price: formData.currency === "INR" ? "₹6,000" : "$85" },
            ].map((giftItem, i) => {
              const isClaimed = Boolean(claimedGifts[giftItem.title]);
              return (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between hover:border-amber-500/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400/80">
                        {giftItem.category}
                      </span>
                      <h4 className="text-sm font-bold text-white">{giftItem.title}</h4>
                    </div>
                    <span className="text-xs font-bold text-stone-300 font-mono">{giftItem.price}</span>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    {isClaimed ? (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Reserved by {claimedGifts[giftItem.title]}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleClaimGift(giftItem.title)}
                        className="w-full py-1.5 px-3 bg-white/10 hover:bg-amber-500/20 border border-white/15 hover:border-amber-500/40 text-xs font-bold text-amber-300 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Gift className="w-3.5 h-3.5" />
                        <span>Reserve this Gift</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CELEBRATION MOOD BOARD & DRESS CODE ──────────────────────────── */}
      <MoodBoard theme={formData.theme} eventType={formData.eventType} />
    </div>
  );
};

export default GuestCelebrationPortal;
