import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { EventPlan, EventType } from "../types";
import {
  X,
  Printer,
  Check,
  Share2,
  Calendar,
  MapPin,
  Sparkles,
  Award,
  Crown,
  Leaf,
  Moon,
  Compass,
} from "lucide-react";

interface Props {
  plan: EventPlan;
  isOpen: boolean;
  onClose: () => void;
}

export type CardDesignStyle = "royal" | "botanical" | "minimal" | "celestial";

interface CardDesignPreset {
  id: CardDesignStyle;
  name: string;
  icon: typeof Crown;
  badge: string;
  bgGradient: string;
  borderStyle: string;
  innerBorder: string;
  accentText: string;
  dividerIcon: typeof Award;
  cornerStyle: string;
  fontClass: string;
}

const CARD_DESIGN_PRESETS: Record<CardDesignStyle, CardDesignPreset> = {
  royal: {
    id: "royal",
    name: "Royal Heritage",
    icon: Crown,
    badge: "border-[#d4af37]/40 text-[#f3e8c8] bg-[#d4af37]/10",
    bgGradient: "bg-gradient-to-b from-[#1c1d25] via-[#14151c] to-[#0d0e12]",
    borderStyle: "border-2 border-[#d4af37]/70 shadow-[0_0_40px_rgba(212,175,55,0.18)]",
    innerBorder: "border border-[#d4af37]/35",
    accentText: "text-[#d4af37]",
    dividerIcon: Award,
    cornerStyle: "text-[#d4af37]/60",
    fontClass: "font-editorial",
  },
  botanical: {
    id: "botanical",
    name: "Botanical Romance",
    icon: Leaf,
    badge: "border-emerald-500/40 text-emerald-200 bg-emerald-500/10",
    bgGradient: "bg-gradient-to-b from-[#161a17] via-[#111412] to-[#0c0e0c]",
    borderStyle: "border-2 border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.15)]",
    innerBorder: "border border-emerald-400/30 border-dashed",
    accentText: "text-emerald-300",
    dividerIcon: Leaf,
    cornerStyle: "text-emerald-400/60",
    fontClass: "font-editorial",
  },
  minimal: {
    id: "minimal",
    name: "Luxe Minimalist",
    icon: Compass,
    badge: "border-stone-400/40 text-stone-200 bg-stone-500/10",
    bgGradient: "bg-gradient-to-b from-[#18181b] via-[#121215] to-[#0a0a0c]",
    borderStyle: "border border-stone-200/40 shadow-[0_0_35px_rgba(255,255,255,0.06)]",
    innerBorder: "border border-stone-700/50",
    accentText: "text-stone-300",
    dividerIcon: Compass,
    cornerStyle: "text-stone-500",
    fontClass: "font-cinzel",
  },
  celestial: {
    id: "celestial",
    name: "Midnight Celestial",
    icon: Moon,
    badge: "border-cyan-400/40 text-cyan-200 bg-cyan-500/10",
    bgGradient: "bg-gradient-to-b from-[#0f172a] via-[#090d16] to-[#05070a]",
    borderStyle: "border-2 border-cyan-400/60 shadow-[0_0_45px_rgba(6,182,212,0.2)]",
    innerBorder: "border border-cyan-300/30",
    accentText: "text-cyan-300",
    dividerIcon: Moon,
    cornerStyle: "text-cyan-400/70",
    fontClass: "font-editorial",
  },
};

// Formats date into formal written English
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
  const [selectedDesign, setSelectedDesign] = useState<CardDesignStyle>("royal");
  const [copiedText, setCopiedText] = useState(false);

  const { formData } = plan;

  if (!isOpen) return null;

  const formalDate = formatFormalDate(formData.eventDate);
  const venueLocation = formData.venue || "The Grand Celebration Ballroom";
  const activePreset = CARD_DESIGN_PRESETS[selectedDesign];
  const DividerIcon = activePreset.dividerIcon;

  // Event wording tailored to domain
  const getEventCopy = (type: EventType) => {
    switch (type) {
      case "Wedding":
        return {
          flourish: "⚜️ SAVE THE DATE ⚜️",
          subtitle: "Together with their families, cordially invite you to celebrate the marriage of",
          dressCode: "Royal & Elegant Traditional Attire",
          footerText: "Dinner, Dancing & Celebrations to Follow • Formal RSVP Requested",
        };
      case "Birthday":
        return {
          flourish: "✨ A MILESTONE CELEBRATION ✨",
          subtitle: "You are joyfully invited to an unforgettable evening honoring",
          dressCode: "Cocktail Chic & Festive Glamour",
          footerText: "Join us for champagne cocktails, gourmet dining, and late-night music",
        };
      case "Corporate Gala":
      case "Tech Conference":
        return {
          flourish: "🏛️ OFFICIAL EXECUTIVE INVITATION 🏛️",
          subtitle: "You are cordially requested to attend the executive annual assembly of",
          dressCode: "Black Tie / Formal Business Attire",
          footerText: "Keynote Addresses, Networking Soirée & Awards Banquet",
        };
      case "College Fest":
        return {
          flourish: "⚡ OFFICIAL FESTIVAL ACCESS PASS ⚡",
          subtitle: "Get ready for the biggest celebration of the semester at",
          dressCode: "Festival Chic & Casual Attire",
          footerText: "Live Bands, Cultural Showcases, Food Stalls & DJ Afterparty",
        };
      case "Anniversary":
      default:
        return {
          flourish: "🥂 A LIFETIME OF MEMORIES 🥂",
          subtitle: "Warmly invite you to share in an evening of joy celebrating",
          dressCode: "Cocktail / Festive Formal",
          footerText: "Toast to love, laughter and cherished moments together",
        };
    }
  };

  const copy = getEventCopy(formData.eventType);

  // Digital text invitation for WhatsApp / SMS / Email
  const digitalInviteText = `✨ You're Invited! ✨\n\n${copy.flourish}\n\n${copy.subtitle}\n🎉 *${formData.eventName}*\n\n📅 Date: ${formalDate}\n📍 Venue: ${venueLocation}\n🎭 Theme: ${formData.theme}\n👔 Dress Code: ${copy.dressCode}\n\n${copy.footerText}\n\nOrchestrated with CelebrateAI. We look forward to celebrating with you!`;

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
          <div className="text-center mb-5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/25 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Bespoke Invitation Card Studio
            </span>
            <h2 id="invitation-card-title" className="text-2xl font-editorial font-bold text-white tracking-tight">
              Your Tailored Event Invitation
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Select your favorite card design style, print high-res, or share directly
            </p>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              CARD DESIGN PRESET SELECTOR
              ═══════════════════════════════════════════════════════════════ */}
          <div className="mb-5 flex items-center justify-center gap-2 flex-wrap">
            <span className="text-xs text-stone-400 font-medium mr-1 hidden sm:inline">Design Style:</span>
            {(Object.keys(CARD_DESIGN_PRESETS) as CardDesignStyle[]).map((styleKey) => {
              const preset = CARD_DESIGN_PRESETS[styleKey];
              const Icon = preset.icon;
              const isSelected = selectedDesign === styleKey;

              return (
                <button
                  key={styleKey}
                  type="button"
                  onClick={() => setSelectedDesign(styleKey)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? `${preset.badge} border shadow-md ring-1 ring-white/20 scale-102`
                      : "bg-white/5 text-stone-400 border border-white/10 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              THE PRINTABLE LUXURY INVITATION CARD CONTAINER
              ═══════════════════════════════════════════════════════════════ */}
          <div
            id="printable-invitation-card"
            className={`relative ${activePreset.bgGradient} ${activePreset.borderStyle} rounded-2xl p-6 sm:p-10 text-center my-4 overflow-hidden transition-all duration-300`}
          >
            {/* Corner Ornaments */}
            <div className={`absolute top-2 left-2 ${activePreset.cornerStyle} text-sm font-serif select-none pointer-events-none`}>
              ┌──
            </div>
            <div className={`absolute top-2 right-2 ${activePreset.cornerStyle} text-sm font-serif select-none pointer-events-none`}>
              ──┐
            </div>
            <div className={`absolute bottom-2 left-2 ${activePreset.cornerStyle} text-sm font-serif select-none pointer-events-none`}>
              └──
            </div>
            <div className={`absolute bottom-2 right-2 ${activePreset.cornerStyle} text-sm font-serif select-none pointer-events-none`}>
              ──┘
            </div>

            <div className={`p-4 sm:p-6 ${activePreset.innerBorder} rounded-xl`}>
              {/* Header Flourish */}
              <p className={`text-xs ${activePreset.fontClass} font-bold tracking-[0.25em] ${activePreset.accentText} mb-3 uppercase`}>
                {copy.flourish}
              </p>

              {/* Subtitle wording */}
              <p className="text-xs sm:text-sm text-stone-300 font-serif italic mb-4 max-w-md mx-auto leading-relaxed">
                {copy.subtitle}
              </p>

              {/* Event Title */}
              <h1 className={`text-2xl sm:text-4xl ${activePreset.fontClass} font-black text-white tracking-wide mb-5 leading-tight`}>
                {formData.eventName}
              </h1>

              {/* Ornamental Divider */}
              <div className="flex items-center justify-center gap-3 my-4">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-current opacity-60" />
                <DividerIcon className={`w-4 h-4 ${activePreset.accentText}`} />
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-current opacity-60" />
              </div>

              {/* Event Details Box */}
              <div className="space-y-3 my-5 max-w-sm mx-auto text-xs sm:text-sm">
                <div className="flex items-center justify-center gap-2 text-stone-200">
                  <Calendar className={`w-4 h-4 ${activePreset.accentText} shrink-0`} />
                  <span className="font-semibold tracking-wide">{formalDate}</span>
                </div>

                <div className="flex items-center justify-center gap-2 text-stone-200">
                  <MapPin className={`w-4 h-4 ${activePreset.accentText} shrink-0`} />
                  <span className="font-medium">{venueLocation}</span>
                </div>

                <div className="pt-2 text-[11px] text-stone-400 flex items-center justify-center gap-2">
                  <span>Theme: <strong className="text-stone-200">{formData.theme}</strong></span>
                  <span>•</span>
                  <span>Attire: <strong className="text-stone-200">{copy.dressCode}</strong></span>
                </div>
              </div>

              {/* Footer Note */}
              <p className="text-[11px] text-stone-400 font-serif italic mt-6 pt-4 border-t border-white/10 max-w-md mx-auto">
                {copy.footerText}
              </p>
            </div>
          </div>

          {/* Action Buttons Toolbar (Note: "Full Plan (JSON)" button completely removed as requested) */}
          <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-4 border-t border-white/10">
            {/* Print / Save PDF */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
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
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
