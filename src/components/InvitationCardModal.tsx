import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { EventPlan, EventType } from "../types";
import {
  X,
  Printer,
  Check,
  Download,
  Share2,
  Calendar,
  MapPin,
  Sparkles,
  Award,
} from "lucide-react";

interface Props {
  plan: EventPlan;
  isOpen: boolean;
  onClose: () => void;
}

// Formats a date into formal written English (e.g., "Saturday, 20th November 2027")
function formatFormalDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function InvitationCardModal({ plan, isOpen, onClose }: Props) {
  const [copiedText, setCopiedText] = useState(false);
  const { formData, budgetDistribution, itinerary, milestones, vendorScripts, generatedAt } = plan;

  if (!isOpen) return null;

  const formalDate = formatFormalDate(formData.eventDate);
  const venueLocation = formData.venue || "The Grand Celebration Ballroom";

  // Wording and thematic configuration based on EventType
  const getCardTheme = (type: EventType) => {
    switch (type) {
      case "Wedding":
        return {
          headerFlourish: "⚜️ SAVE THE DATE ⚜️",
          subtitle: "Together with their families, cordially invite you to celebrate the marriage of",
          dressCode: "Royal & Elegant Traditional Attire",
          borderStyle: "border-2 border-[#d4af37]/60 shadow-[0_0_35px_rgba(212,175,55,0.15)]",
          innerBorder: "border border-[#d4af37]/30",
          accentColor: "text-[#d4af37]",
          footerText: "Dinner, Dancing & Celebrations to Follow • RSVP Requested",
        };
      case "Birthday":
        return {
          headerFlourish: "✨ A MILESTONE CELEBRATION ✨",
          subtitle: "You are joyfully invited to an unforgettable evening honoring",
          dressCode: "Cocktail Chic & Festive Glamour",
          borderStyle: "border-2 border-amber-400/50 shadow-[0_0_35px_rgba(245,158,11,0.15)]",
          innerBorder: "border border-amber-400/25",
          accentColor: "text-amber-300",
          footerText: "Join us for cocktails, gourmet dining, and late-night music",
        };
      case "Corporate Gala":
      case "Tech Conference":
        return {
          headerFlourish: "🏛️ OFFICIAL EXECUTIVE INVITATION 🏛️",
          subtitle: "You are cordially requested to attend the executive annual assembly of",
          dressCode: "Black Tie / Formal Business Attire",
          borderStyle: "border-2 border-blue-400/50 shadow-[0_0_35px_rgba(96,165,250,0.15)]",
          innerBorder: "border border-blue-400/25",
          accentColor: "text-blue-300",
          footerText: "Keynote Addresses, Networking Soirée & Awards Banquet",
        };
      case "College Fest":
        return {
          headerFlourish: "⚡ OFFICIAL FESTIVAL ACCESS PASS ⚡",
          subtitle: "Get ready for the biggest celebration of the semester at",
          dressCode: "Festival Chic & Casual Vibes",
          borderStyle: "border-2 border-orange-500/50 shadow-[0_0_35px_rgba(249,115,22,0.15)]",
          innerBorder: "border border-orange-500/25",
          accentColor: "text-orange-300",
          footerText: "Live Bands, Competitions, Food Stalls & DJ Afterparty",
        };
      case "Anniversary":
      default:
        return {
          headerFlourish: "🥂 A LIFETIME OF MEMORIES 🥂",
          subtitle: "Warmly invite you to share in an evening of joy celebrating",
          dressCode: "Cocktail / Festive Formal",
          borderStyle: "border-2 border-emerald-400/50 shadow-[0_0_35px_rgba(52,211,153,0.15)]",
          innerBorder: "border border-emerald-400/25",
          accentColor: "text-emerald-300",
          footerText: "Toast to love, laughter and cherished moments together",
        };
    }
  };

  const themeConfig = getCardTheme(formData.eventType);

  // Digital text invitation for WhatsApp / SMS / Email
  const digitalInviteText = `✨ You're Invited! ✨\n\n${themeConfig.headerFlourish}\n\n${themeConfig.subtitle}\n🎉 *${formData.eventName}*\n\n📅 Date: ${formalDate}\n📍 Venue: ${venueLocation}\n🎭 Theme: ${formData.theme}\n👔 Dress Code: ${themeConfig.dressCode}\n\n${themeConfig.footerText}\n\nOrchestrated with CelebrateAI. We look forward to celebrating with you!`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(digitalInviteText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2200);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-[#0f1015] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 text-stone-100"
          role="dialog"
          aria-modal="true"
          aria-labelledby="invitation-card-title"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close invitation modal"
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-6">
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/25 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Bespoke Invitation Card Studio
            </span>
            <h2 id="invitation-card-title" className="text-2xl font-bold text-white tracking-tight">
              Your Tailored Event Invitation
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Ready to print, download, or share directly with your guests
            </p>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              THE PRINTABLE LUXURY INVITATION CARD CONTAINER
              ═══════════════════════════════════════════════════════════════ */}
          <div
            id="printable-invitation-card"
            className={`relative bg-gradient-to-b from-[#181a22] via-[#121319] to-[#0e0f14] ${themeConfig.borderStyle} rounded-2xl p-6 sm:p-10 text-center my-4 overflow-hidden`}
          >
            {/* Subtle background grain & corner ornaments */}
            <div className="absolute top-2 left-2 text-[#d4af37]/40 text-sm font-serif select-none pointer-events-none">
              ┌──
            </div>
            <div className="absolute top-2 right-2 text-[#d4af37]/40 text-sm font-serif select-none pointer-events-none">
              ──┐
            </div>
            <div className="absolute bottom-2 left-2 text-[#d4af37]/40 text-sm font-serif select-none pointer-events-none">
              └──
            </div>
            <div className="absolute bottom-2 right-2 text-[#d4af37]/40 text-sm font-serif select-none pointer-events-none">
              ──┘
            </div>

            <div className={`p-4 sm:p-6 ${themeConfig.innerBorder} rounded-xl`}>
              {/* Header Flourish */}
              <p className="text-xs font-cinzel font-bold tracking-[0.25em] text-amber-400 mb-3 uppercase">
                {themeConfig.headerFlourish}
              </p>

              {/* Subtitle wording */}
              <p className="text-xs sm:text-sm text-stone-300 font-serif italic mb-4 max-w-md mx-auto leading-relaxed">
                {themeConfig.subtitle}
              </p>

              {/* Event Title */}
              <h1 className="text-2xl sm:text-4xl font-editorial font-black text-white tracking-wide mb-5 leading-tight">
                {formData.eventName}
              </h1>

              {/* Ornamental Divider */}
              <div className="flex items-center justify-center gap-3 my-4">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#d4af37]" />
                <Award className="w-4 h-4 text-[#d4af37]" />
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#d4af37]" />
              </div>

              {/* Event Details Box */}
              <div className="space-y-3 my-5 max-w-sm mx-auto text-xs sm:text-sm">
                <div className="flex items-center justify-center gap-2 text-stone-200">
                  <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-semibold tracking-wide">{formalDate}</span>
                </div>

                <div className="flex items-center justify-center gap-2 text-stone-200">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-medium">{venueLocation}</span>
                </div>

                <div className="pt-2 text-[11px] text-stone-400 flex items-center justify-center gap-2">
                  <span>Theme: <strong className="text-stone-200">{formData.theme}</strong></span>
                  <span>•</span>
                  <span>Attire: <strong className="text-stone-200">{themeConfig.dressCode}</strong></span>
                </div>
              </div>

              {/* Footer Note */}
              <p className="text-[11px] text-stone-400 font-serif italic mt-6 pt-4 border-t border-white/10 max-w-md mx-auto">
                {themeConfig.footerText}
              </p>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Print / Save PDF */}
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save as PDF</span>
              </button>

              {/* Copy Digital Invite */}
              <button
                onClick={handleCopyText}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all cursor-pointer"
              >
                {copiedText ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Copied Text!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-amber-400" />
                    <span>Copy for WhatsApp / SMS</span>
                  </>
                )}
              </button>
            </div>

            {/* Download JSON Plan */}
            <button
              onClick={handleDownloadJSON}
              title="Download entire plan as JSON"
              className="flex items-center gap-1.5 px-3 py-2 text-stone-400 hover:text-white text-xs font-medium hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Full Plan (JSON)</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
