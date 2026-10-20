import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toPng } from "html-to-image";
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
  Flame,
  Wine,
  Image as ImageIcon,
} from "lucide-react";

interface Props {
  plan: EventPlan;
  isOpen: boolean;
  onClose: () => void;
}

export type CardColorTheme = "royalGold" | "rubyGold" | "emerald" | "sapphire" | "saffron";

interface ColorThemeConfig {
  id: CardColorTheme;
  name: string;
  icon: typeof Crown;
  badge: string;
  bgStyle: {
    background: string;
    backgroundColor: string;
  };
  outerBorder: string;
  innerBorder: string;
  accentColor: string;
  titleColor: string;
  textColor: string;
  cornerColor: string;
  dividerIcon: typeof Award;
}

const COLOR_THEMES: Record<CardColorTheme, ColorThemeConfig> = {
  royalGold: {
    id: "royalGold",
    name: "Imperial Gold",
    icon: Crown,
    badge: "border-amber-400/50 text-amber-200 bg-amber-500/15",
    bgStyle: {
      backgroundColor: "#16130b",
      background: "radial-gradient(circle at 50% 20%, #2a2211 0%, #17130c 55%, #0c0a06 100%)",
    },
    outerBorder: "border-2 border-[#e5c158] shadow-[0_0_50px_rgba(229,193,88,0.25)]",
    innerBorder: "border border-[#e5c158]/50",
    accentColor: "#e5c158",
    titleColor: "text-amber-100",
    textColor: "#fef3c7",
    cornerColor: "#e5c158",
    dividerIcon: Crown,
  },
  rubyGold: {
    id: "rubyGold",
    name: "Royal Ruby",
    icon: Wine,
    badge: "border-rose-400/50 text-rose-200 bg-rose-500/15",
    bgStyle: {
      backgroundColor: "#220811",
      background: "radial-gradient(circle at 50% 20%, #3d0c1e 0%, #220811 55%, #120308 100%)",
    },
    outerBorder: "border-2 border-[#f43f5e] shadow-[0_0_50px_rgba(244,63,94,0.25)]",
    innerBorder: "border border-[#fde047]/60",
    accentColor: "#ffd700",
    titleColor: "text-rose-100",
    textColor: "#ffe4e6",
    cornerColor: "#ffd700",
    dividerIcon: Wine,
  },
  emerald: {
    id: "emerald",
    name: "Emerald Royale",
    icon: Leaf,
    badge: "border-emerald-400/50 text-emerald-200 bg-emerald-500/15",
    bgStyle: {
      backgroundColor: "#062217",
      background: "radial-gradient(circle at 50% 20%, #0d3d2a 0%, #062217 55%, #02120c 100%)",
    },
    outerBorder: "border-2 border-[#10b981] shadow-[0_0_50px_rgba(16,185,129,0.25)]",
    innerBorder: "border border-[#34d399]/50 border-dashed",
    accentColor: "#34d399",
    titleColor: "text-emerald-100",
    textColor: "#d1fae5",
    cornerColor: "#34d399",
    dividerIcon: Leaf,
  },
  sapphire: {
    id: "sapphire",
    name: "Royal Sapphire",
    icon: Moon,
    badge: "border-cyan-400/50 text-cyan-200 bg-cyan-500/15",
    bgStyle: {
      backgroundColor: "#0c1b33",
      background: "radial-gradient(circle at 50% 20%, #152d54 0%, #0c1b33 55%, #050d1a 100%)",
    },
    outerBorder: "border-2 border-[#38bdf8] shadow-[0_0_50px_rgba(56,189,248,0.25)]",
    innerBorder: "border border-[#38bdf8]/50",
    accentColor: "#38bdf8",
    titleColor: "text-cyan-100",
    textColor: "#e0f2fe",
    cornerColor: "#38bdf8",
    dividerIcon: Moon,
  },
  saffron: {
    id: "saffron",
    name: "Saffron Utsav",
    icon: Flame,
    badge: "border-orange-400/50 text-orange-200 bg-orange-500/15",
    bgStyle: {
      backgroundColor: "#2c1206",
      background: "radial-gradient(circle at 50% 20%, #4a210b 0%, #2c1206 55%, #160802 100%)",
    },
    outerBorder: "border-2 border-[#f59e0b] shadow-[0_0_50px_rgba(245,158,11,0.25)]",
    innerBorder: "border border-[#fbbf24]/50",
    accentColor: "#f59e0b",
    titleColor: "text-amber-100",
    textColor: "#fef3c7",
    cornerColor: "#f59e0b",
    dividerIcon: Flame,
  },
};

// Formats a date into formal written English
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
  const [selectedColor, setSelectedColor] = useState<CardColorTheme>("royalGold");
  const [copiedText, setCopiedText] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { formData } = plan;

  if (!isOpen) return null;

  const formalDate = formatFormalDate(formData.eventDate);
  const venueLocation = formData.venue || "The Grand Celebration Ballroom";
  const activeTheme = COLOR_THEMES[selectedColor];
  const DividerIcon = activeTheme.dividerIcon;

  // Domain wording tailored to EventType
  const getEventWording = (type: EventType) => {
    switch (type) {
      case "Wedding":
        return {
          headerFlourish: "⚜️ SAVE THE DATE ⚜️",
          subtitle: "Together with their families, cordially invite you to celebrate the marriage of",
          dressCode: "Royal Traditional Attire",
          footerText: "Dinner, Dancing & Celebrations to Follow • RSVP Requested",
        };
      case "Birthday":
        return {
          headerFlourish: "✨ A MILESTONE CELEBRATION ✨",
          subtitle: "You are joyfully invited to an unforgettable evening honoring",
          dressCode: "Cocktail Chic & Festive Glamour",
          footerText: "Join us for champagne cocktails, gourmet dining, and late-night music",
        };
      case "Corporate Gala":
      case "Tech Conference":
        return {
          headerFlourish: "🏛️ OFFICIAL EXECUTIVE INVITATION 🏛️",
          subtitle: "You are cordially requested to attend the executive annual assembly of",
          dressCode: "Black Tie / Formal Business Attire",
          footerText: "Keynote Addresses, Networking Soirée & Awards Banquet",
        };
      case "College Fest":
        return {
          headerFlourish: "⚡ OFFICIAL FESTIVAL ACCESS PASS ⚡",
          subtitle: "Get ready for the biggest celebration of the semester at",
          dressCode: "Festival Chic & Casual Attire",
          footerText: "Live Bands, Cultural Showcases, Food Stalls & DJ Afterparty",
        };
      case "Anniversary":
      default:
        return {
          headerFlourish: "🥂 A LIFETIME OF MEMORIES 🥂",
          subtitle: "Warmly invite you to share in an evening of joy celebrating",
          dressCode: "Cocktail / Festive Formal",
          footerText: "Toast to love, laughter and cherished moments together",
        };
    }
  };

  const wording = getEventWording(formData.eventType);

  // Digital text invitation for WhatsApp / SMS / Email
  const digitalInviteText = `✨ You're Invited! ✨\n\n${wording.headerFlourish}\n\n${wording.subtitle}\n🎉 *${formData.eventName}*\n\n📅 Date: ${formalDate}\n📍 Venue: ${venueLocation}\n🎭 Theme: ${formData.theme}\n👔 Dress Code: ${wording.dressCode}\n\n${wording.footerText}\n\nOrchestrated with CelebrateAI. We look forward to celebrating with you!`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(digitalInviteText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2200);
    } catch {
      // Fallback
    }
  };

  // High-Resolution Full-Color Image Export (PNG)
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      setIsExportingImage(true);
      // Generate clean high-resolution canvas image
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2.5,
        cacheBust: true,
      });

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${formData.eventName.replace(/\s+/g, "_")}_Invitation_Card.png`;
      a.click();
    } catch (err) {
      console.error("Failed to export image:", err);
    } finally {
      setIsExportingImage(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-[#0f1015] border border-amber-500/30 rounded-3xl p-4 sm:p-8 shadow-2xl my-auto max-h-[94vh] overflow-y-auto text-stone-100"
          role="dialog"
          aria-modal="true"
          aria-labelledby="invitation-card-title"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close invitation modal"
            className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 p-2 rounded-full bg-white/10 hover:bg-white/15 text-stone-300 hover:text-white transition-colors cursor-pointer z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/25 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Full-Color Bespoke Invitation Studio
            </span>
            <h2 id="invitation-card-title" className="text-2xl font-editorial font-bold text-white tracking-tight">
              Your Colored Event Invitation
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Select rich celebration colors and export directly in high resolution
            </p>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              VIBRANT COLOR PALETTE SELECTOR
              ═══════════════════════════════════════════════════════════════ */}
          <div className="mb-5 flex items-center justify-center gap-2 flex-wrap" role="region" aria-label="Color palette selector">
            <span className="text-xs text-stone-300 font-semibold mr-1 hidden sm:inline">Color Theme:</span>
            {(Object.keys(COLOR_THEMES) as CardColorTheme[]).map((themeKey) => {
              const theme = COLOR_THEMES[themeKey];
              const Icon = theme.icon;
              const isSelected = selectedColor === themeKey;

              return (
                <button
                  key={themeKey}
                  type="button"
                  onClick={() => setSelectedColor(themeKey)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? `${theme.badge} border shadow-lg ring-2 ring-white/25 scale-105`
                      : "bg-white/5 text-stone-400 border border-white/10 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{theme.name}</span>
                </button>
              );
            })}
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              THE FULL-COLOR PRINTABLE & EXPORTABLE INVITATION CARD
              ═══════════════════════════════════════════════════════════════ */}
          <div
            id="printable-invitation-card"
            ref={cardRef}
            style={{
              ...activeTheme.bgStyle,
              color: activeTheme.textColor,
            }}
            className={`relative ${activeTheme.outerBorder} rounded-2xl p-6 sm:p-10 text-center my-3 overflow-hidden transition-all duration-500`}
          >
            {/* Decorative Corner Ornaments */}
            <div
              style={{ color: activeTheme.cornerColor }}
              className="absolute top-2.5 left-2.5 text-base font-serif select-none pointer-events-none opacity-80"
            >
              ┌──
            </div>
            <div
              style={{ color: activeTheme.cornerColor }}
              className="absolute top-2.5 right-2.5 text-base font-serif select-none pointer-events-none opacity-80"
            >
              ──┐
            </div>
            <div
              style={{ color: activeTheme.cornerColor }}
              className="absolute bottom-2.5 left-2.5 text-base font-serif select-none pointer-events-none opacity-80"
            >
              └──
            </div>
            <div
              style={{ color: activeTheme.cornerColor }}
              className="absolute bottom-2.5 right-2.5 text-base font-serif select-none pointer-events-none opacity-80"
            >
              ──┘
            </div>

            <div className={`p-4 sm:p-7 ${activeTheme.innerBorder} rounded-xl relative z-10`}>
              {/* Header Flourish */}
              <p
                style={{ color: activeTheme.accentColor }}
                className="text-xs sm:text-sm font-cinzel font-bold tracking-[0.25em] mb-3 uppercase"
              >
                {wording.headerFlourish}
              </p>

              {/* Subtitle Wording */}
              <p className="text-xs sm:text-sm text-stone-200/90 font-serif italic mb-4 max-w-md mx-auto leading-relaxed">
                {wording.subtitle}
              </p>

              {/* Event Title with Rich Styling */}
              <h1 className={`text-2xl sm:text-4xl font-editorial font-black ${activeTheme.titleColor} tracking-wide mb-5 leading-tight drop-shadow-md`}>
                {formData.eventName}
              </h1>

              {/* Ornamental Center Divider */}
              <div className="flex items-center justify-center gap-3 my-4">
                <div
                  style={{ backgroundColor: activeTheme.accentColor }}
                  className="w-16 h-[1.5px] opacity-75"
                />
                <DividerIcon
                  style={{ color: activeTheme.accentColor }}
                  className="w-4 h-4 shrink-0 drop-shadow"
                />
                <div
                  style={{ backgroundColor: activeTheme.accentColor }}
                  className="w-16 h-[1.5px] opacity-75"
                />
              </div>

              {/* Event Details Grid */}
              <div className="space-y-3 my-5 max-w-sm mx-auto text-xs sm:text-sm">
                <div className="flex items-center justify-center gap-2 font-medium">
                  <Calendar
                    style={{ color: activeTheme.accentColor }}
                    className="w-4 h-4 shrink-0"
                  />
                  <span className="font-bold tracking-wide text-white">{formalDate}</span>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <MapPin
                    style={{ color: activeTheme.accentColor }}
                    className="w-4 h-4 shrink-0"
                  />
                  <span className="font-semibold text-white/95">{venueLocation}</span>
                </div>

                <div className="pt-2 text-[11px] text-stone-300 flex items-center justify-center gap-2 flex-wrap">
                  <span>Theme: <strong className="text-white font-bold">{formData.theme}</strong></span>
                  <span>•</span>
                  <span>Attire: <strong className="text-white font-bold">{wording.dressCode}</strong></span>
                </div>
              </div>

              {/* Footer Note */}
              <p className="text-[11px] sm:text-xs text-stone-300/80 font-serif italic mt-5 pt-4 border-t border-white/15 max-w-md mx-auto">
                {wording.footerText}
              </p>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              ACTION BUTTONS TOOLBAR (JSON button removed as requested)
              ═══════════════════════════════════════════════════════════════ */}
          <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-center sm:justify-start gap-2.5 sm:gap-3 pt-3 border-t border-white/10">
            {/* Download Colored Image PNG */}
            <button
              onClick={handleDownloadImage}
              disabled={isExportingImage}
              className="flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-600/30 transition-all cursor-pointer disabled:opacity-60"
            >
              {isExportingImage ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  <span>Generating Image...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4" />
                  <span>Download Card Image (PNG)</span>
                </>
              )}
            </button>

            {/* Print / Save as PDF */}
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print / PDF</span>
            </button>

            {/* Copy Digital Invite */}
            <button
              onClick={handleCopyText}
              className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white font-medium rounded-xl text-xs sm:text-sm transition-all cursor-pointer"
            >
              {copiedText ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-stone-400" />
                  <span>Copy Text (WhatsApp)</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
