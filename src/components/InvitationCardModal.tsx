import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toPng } from "html-to-image";
import type { EventPlan, EventType } from "../types";
import {
  X,
  Printer,
  Check,
  Share2,
  Sparkles,
  Download,
  Edit3,
  RotateCcw,
  Crown,
  Leaf,
  Flower2,
  Moon,
  Feather,
} from "lucide-react";

interface Props {
  plan: EventPlan;
  isOpen: boolean;
  onClose: () => void;
}

export type InvitationTemplateId =
  | "botanical"
  | "royalHeritage"
  | "porcelainToile"
  | "enchantedTwilight"
  | "minimalistLuxe";

interface TemplateConfig {
  id: InvitationTemplateId;
  name: string;
  subtitle: string;
  icon: typeof Leaf;
  badge: string;
  paperBg: string;
  textColor: string;
  accentColor: string;
}

const TEMPLATES: Record<InvitationTemplateId, TemplateConfig> = {
  botanical: {
    id: "botanical",
    name: "Botanical Eucalyptus",
    subtitle: "Say I Do & Minted Olive Elegance",
    icon: Leaf,
    badge: "border-emerald-500/40 text-emerald-300 bg-emerald-500/15",
    paperBg: "linear-gradient(155deg, #fdfbf7 0%, #f6f3ea 50%, #fbf9f2 100%)",
    textColor: "#2b3028",
    accentColor: "#556b2f",
  },
  royalHeritage: {
    id: "royalHeritage",
    name: "Royal Heritage Arch",
    subtitle: "WedMeGood Palatial Marigold Toran",
    icon: Crown,
    badge: "border-amber-500/40 text-amber-300 bg-amber-500/15",
    paperBg: "linear-gradient(160deg, #fffdf8 0%, #fef5e7 50%, #fff8eb 100%)",
    textColor: "#451a03",
    accentColor: "#b45309",
  },
  porcelainToile: {
    id: "porcelainToile",
    name: "Porcelain Blue Toile",
    subtitle: "French Classic Floral Vine Frame",
    icon: Flower2,
    badge: "border-blue-500/40 text-blue-300 bg-blue-500/15",
    paperBg: "linear-gradient(150deg, #ffffff 0%, #f4f7fc 60%, #ffffff 100%)",
    textColor: "#0f172a",
    accentColor: "#1e40af",
  },
  enchantedTwilight: {
    id: "enchantedTwilight",
    name: "Enchanted Twilight",
    subtitle: "Brides Fairy Lights & Golden Script",
    icon: Moon,
    badge: "border-purple-400/40 text-purple-200 bg-purple-500/15",
    paperBg: "linear-gradient(175deg, #181720 0%, #25222e 50%, #15141b 100%)",
    textColor: "#f5f3ef",
    accentColor: "#fde047",
  },
  minimalistLuxe: {
    id: "minimalistLuxe",
    name: "Minimalist Letterpress",
    subtitle: "Artisanal Cotton & Gold Wax Seal",
    icon: Feather,
    badge: "border-stone-400/40 text-stone-200 bg-stone-500/15",
    paperBg: "linear-gradient(150deg, #fdfcf9 0%, #f5f2ec 50%, #fcfaf6 100%)",
    textColor: "#1c1917",
    accentColor: "#b48c36",
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

// Generate smart defaults based on event type
function getDefaultWording(eventType: EventType, eventName: string) {
  switch (eventType) {
    case "Wedding": {
      const stripped = eventName.replace(/\s+wedding/i, "").trim();
      const resolvedHeadline = stripped.length >= 4 ? stripped : eventName || "Meghan & Thomas";
      return {
        hostLine: "TOGETHER WITH THEIR FAMILIES",
        headline: resolvedHeadline,
        inviteAction: "REQUEST THE HONOUR OF YOUR PRESENCE AT THE CELEBRATION OF THEIR MARRIAGE",
        time: "AT FIVE O'CLOCK IN THE EVENING",
        dressCode: "BLACK TIE OPTIONAL • FORMAL BOTANICAL ATTIRE",
        footer: "DINNER, DANCING & TOASTS TO FOLLOW • RSVP REQUESTED",
      };
    }
    case "Birthday":
      return {
        hostLine: "A MILESTONE JUBILEE CELEBRATION",
        headline: eventName,
        inviteAction: "CORDIALLY INVITE YOU TO AN UNFORGETTABLE EVENING HONORING",
        time: "AT SEVEN O'CLOCK IN THE EVENING",
        dressCode: "COCKTAIL CHIC & FESTIVE GLAMOUR",
        footer: "CHAMPAGNE COCKTAILS, DINING & DANCING • KINDLY RSVP",
      };
    case "Corporate Gala":
    case "Tech Conference":
      return {
        hostLine: "THE EXECUTIVE BOARD OF DIRECTORS",
        headline: eventName,
        inviteAction: "REQUEST THE PLEASURE OF YOUR COMPANY AT THE ANNUAL EXECUTIVE GALA OF",
        time: "AT SIX O'CLOCK IN THE EVENING",
        dressCode: "FORMAL BUSINESS SUIT & EVENING COCKTAIL",
        footer: "KEYNOTE ADDRESSES, NETWORKING SOIRÉE & AWARDS BANQUET",
      };
    case "College Fest":
      return {
        hostLine: "OFFICIAL GRAND OPENING PASS",
        headline: eventName,
        inviteAction: "WELCOME YOU TO EXPERIENCE THE BIGGEST FESTIVAL SPECTACLE AT",
        time: "COMMENCING AT 4:00 PM UNTIL LATE",
        dressCode: "FESTIVAL CHIC & CASUAL ATTIRE",
        footer: "LIVE BANDS, CULTURAL PERFORMANCES & CELEBRATION AFTERPARTY",
      };
    case "Anniversary":
    default:
      return {
        hostLine: "A LIFETIME OF CHERISHED MEMORIES",
        headline: eventName,
        inviteAction: "WARMLY INVITE YOU TO SHARE IN AN EVENING OF JOY CELEBRATING",
        time: "AT SIX-THIRTY IN THE EVENING",
        dressCode: "FESTIVE COCKTAIL ATTIRE",
        footer: "TOASTS TO LOVE, LAUGHTER & HAPPILY EVER AFTER • RSVP",
      };
  }
}

export default function InvitationCardModal({ plan, isOpen, onClose }: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState<InvitationTemplateId>("botanical");
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { formData } = plan;
  const formalDate = formatFormalDate(formData.eventDate);
  const venueLocation = formData.venue || "The Grand Conservatory & Ballroom";

  // Editable invitation details state initialized from event plan
  const defaultWording = getDefaultWording(formData.eventType, formData.eventName);
  const [hostLine, setHostLine] = useState(defaultWording.hostLine);
  const [headline, setHeadline] = useState(defaultWording.headline);
  const [inviteAction, setInviteAction] = useState(defaultWording.inviteAction);
  const [eventTime, setEventTime] = useState(defaultWording.time);
  const [customVenue, setCustomVenue] = useState(venueLocation);
  const [dressCode, setDressCode] = useState(defaultWording.dressCode);
  const [footerNote, setFooterNote] = useState(defaultWording.footer);

  // Sync when plan changes
  useEffect(() => {
    const updated = getDefaultWording(formData.eventType, formData.eventName);
    setHostLine(updated.hostLine);
    setHeadline(updated.headline);
    setInviteAction(updated.inviteAction);
    setEventTime(updated.time);
    setCustomVenue(formData.venue || "The Grand Conservatory & Ballroom");
    setDressCode(updated.dressCode);
    setFooterNote(updated.footer);
  }, [formData.eventType, formData.eventName, formData.venue]);

  if (!isOpen) return null;

  const currentTemplate = TEMPLATES[selectedTemplate];

  // Reset to default wording
  const handleReset = () => {
    const updated = getDefaultWording(formData.eventType, formData.eventName);
    setHostLine(updated.hostLine);
    setHeadline(updated.headline);
    setInviteAction(updated.inviteAction);
    setEventTime(updated.time);
    setCustomVenue(formData.venue || "The Grand Conservatory & Ballroom");
    setDressCode(updated.dressCode);
    setFooterNote(updated.footer);
  };

  // Digital text invitation for WhatsApp / SMS / Messaging
  const digitalInviteText = `✨ You Are Cordially Invited ✨\n\n${hostLine}\n\n🎉 *${headline}*\n${inviteAction}\n\n📅 Date: ${formalDate}\n⏰ Time: ${eventTime}\n📍 Venue: ${customVenue}\n👔 Attire: ${dressCode}\n\n${footerNote}\n\nOrchestrated with CelebrateAI Studio. We look forward to celebrating together!`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(digitalInviteText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2200);
    } catch {
      // Fallback
    }
  };

  // High-Resolution PNG Export (2.5x pixel ratio for print-ready clarity)
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      setIsExportingImage(true);
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2.5,
        cacheBust: true,
      });

      const a = document.createElement("a");
      a.href = dataUrl;
      const cleanName = headline.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 30);
      a.download = `${cleanName}_Invitation_Card.png`;
      a.click();
    } catch (err) {
      console.error("Failed to export invitation image:", err);
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
          className="relative w-full max-w-3xl bg-[#0f1015] border border-amber-500/30 rounded-3xl p-4 sm:p-7 shadow-2xl my-auto max-h-[95vh] overflow-y-auto text-stone-100"
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
          <div className="text-center mb-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/25 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Bespoke Stationery & Invitation Studio
            </span>
            <h2 id="invitation-card-title" className="text-2xl sm:text-3xl font-editorial font-bold text-white tracking-tight">
              Export Luxury Event Invitation
            </h2>
            <p className="text-xs text-stone-400 mt-1 max-w-lg mx-auto">
              Curated luxury stationery designs inspired by Say I Do, Minted, and WedMeGood. Export in crystal-clear high-res PNG or print ready PDF.
            </p>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              TEMPLATE STYLE SELECTOR TABS
              ═══════════════════════════════════════════════════════════════ */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                <span>Select Luxury Style:</span>
              </span>
              <button
                type="button"
                onClick={() => setIsCustomizing(!isCustomizing)}
                className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isCustomizing
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-white/5 text-stone-300 border-white/10 hover:border-white/25"
                }`}
              >
                <Edit3 className="w-3 h-3 text-amber-400" />
                <span>{isCustomizing ? "Close Personalizer" : "Personalize Details"}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin" role="tablist" aria-label="Invitation styles">
              {(Object.keys(TEMPLATES) as InvitationTemplateId[]).map((tplKey) => {
                const tpl = TEMPLATES[tplKey];
                const Icon = tpl.icon;
                const isSelected = selectedTemplate === tplKey;

                return (
                  <button
                    key={tplKey}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedTemplate(tplKey)}
                    className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? `${tpl.badge} border shadow-lg ring-2 ring-amber-400/30 scale-[1.02]`
                        : "bg-white/5 text-stone-400 border border-white/10 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tpl.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              COLLAPSIBLE PERSONALIZER ACCORDION
              ═══════════════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {isCustomizing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-4"
              >
                <div className="bg-stone-900/90 border border-amber-500/25 rounded-2xl p-3.5 sm:p-4 text-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Fine-Tune Invitation Card Wording
                    </span>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-stone-400 hover:text-stone-200 flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Defaults</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-400 text-[11px] mb-1">Host / Formal Lead-in:</label>
                      <input
                        type="text"
                        value={hostLine}
                        onChange={(e) => setHostLine(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                        placeholder="e.g. TOGETHER WITH THEIR FAMILIES"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 text-[11px] mb-1">Celebration Headline / Names:</label>
                      <input
                        type="text"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-white focus:outline-none focus:border-amber-400 font-semibold"
                        placeholder="e.g. Meghan & Thomas or Rohit & Preeta"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 text-[11px] mb-1">Ceremony / Time:</label>
                      <input
                        type="text"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                        placeholder="e.g. AT FIVE O'CLOCK IN THE EVENING"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 text-[11px] mb-1">Venue Location:</label>
                      <input
                        type="text"
                        value={customVenue}
                        onChange={(e) => setCustomVenue(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                        placeholder="e.g. Crystal River Lodge & Ballroom"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 text-[11px] mb-1">Dress Code / Attire:</label>
                      <input
                        type="text"
                        value={dressCode}
                        onChange={(e) => setDressCode(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                        placeholder="e.g. Black Tie Optional • Royal Traditional"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 text-[11px] mb-1">Reception & RSVP Footer:</label>
                      <input
                        type="text"
                        value={footerNote}
                        onChange={(e) => setFooterNote(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                        placeholder="e.g. Dinner & Dancing to Follow • RSVP Requested"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══════════════════════════════════════════════════════════════
              THE EXPORTABLE INVITATION CARD (CLASSIC 5" x 7" LUXURY STATIONERY)
              ═══════════════════════════════════════════════════════════════ */}
          <div className="flex justify-center my-2">
            <div
              id="printable-invitation-card"
              ref={cardRef}
              style={{
                background: currentTemplate.paperBg,
                color: currentTemplate.textColor,
              }}
              className="relative w-full max-w-[500px] min-h-[660px] rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 p-6 sm:p-9 text-center flex flex-col justify-between select-none"
            >
              {/* ──────────────────────────────────────────────────────────
                  TEMPLATE 1: BOTANICAL EUCALYPTUS (Say I Do / Minted)
                  ────────────────────────────────────────────────────────── */}
              {selectedTemplate === "botanical" && (
                <>
                  {/* Subtle Linen Frame & Border */}
                  <div className="absolute inset-3 sm:inset-4 border border-[#c9b896]/60 rounded-xl pointer-events-none" />
                  <div className="absolute inset-[15px] sm:inset-[19px] border border-[#c9b896]/30 rounded-lg pointer-events-none" />

                  {/* Botanical Top Foliage SVG */}
                  <div className="w-full flex justify-center -mt-2 mb-2">
                    <svg viewBox="0 0 380 95" className="w-72 sm:w-88 h-18 sm:h-22" fill="none">
                      <defs>
                        <linearGradient id="eucGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#4f6345" />
                          <stop offset="100%" stopColor="#7a926d" />
                        </linearGradient>
                        <linearGradient id="eucGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#677c5c" />
                          <stop offset="100%" stopColor="#98af8c" />
                        </linearGradient>
                        <linearGradient id="goldLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#d4af37" />
                          <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>
                      </defs>
                      {/* Curving Main Olive Branches */}
                      <path d="M 30 65 C 90 28, 150 32, 190 42 C 230 32, 290 28, 350 65" stroke="#4f6345" strokeWidth="1.75" strokeLinecap="round" />
                      <path d="M 75 52 C 120 22, 170 25, 190 35 C 210 25, 260 22, 305 52" stroke="#7a926d" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
                      
                      {/* Left Botanical Sprigs */}
                      <path d="M 50 60 C 40 45, 62 30, 75 45 C 82 55, 68 65, 50 60 Z" fill="url(#eucGrad1)" opacity="0.95" />
                      <path d="M 75 52 C 68 35, 92 25, 102 38 C 108 48, 92 58, 75 52 Z" fill="url(#eucGrad2)" opacity="0.9" />
                      <path d="M 100 42 C 95 24, 120 18, 128 32 C 132 42, 118 50, 100 42 Z" fill="url(#eucGrad1)" opacity="0.95" />
                      <path d="M 125 35 C 122 15, 148 12, 154 28 C 158 38, 142 45, 125 35 Z" fill="url(#goldLeaf)" opacity="0.85" />
                      <path d="M 152 32 C 150 14, 172 16, 174 30 C 176 38, 162 42, 152 32 Z" fill="url(#eucGrad2)" opacity="0.9" />

                      {/* Center Clustered Leaves */}
                      <path d="M 175 30 C 178 10, 198 12, 194 28 C 192 38, 185 40, 175 30 Z" fill="url(#eucGrad1)" opacity="0.95" />
                      <path d="M 196 28 C 194 12, 214 10, 216 30 C 217 38, 206 40, 196 28 Z" fill="url(#goldLeaf)" opacity="0.85" />

                      {/* Right Botanical Sprigs */}
                      <path d="M 218 32 C 228 16, 250 14, 248 32 C 246 42, 232 38, 218 32 Z" fill="url(#eucGrad2)" opacity="0.9" />
                      <path d="M 242 35 C 258 18, 282 22, 276 38 C 272 48, 258 45, 242 35 Z" fill="url(#eucGrad1)" opacity="0.95" />
                      <path d="M 270 42 C 288 25, 310 32, 305 48 C 300 58, 285 52, 270 42 Z" fill="url(#goldLeaf)" opacity="0.85" />
                      <path d="M 300 52 C 318 38, 338 48, 330 62 C 322 70, 308 62, 300 52 Z" fill="url(#eucGrad2)" opacity="0.9" />

                      {/* Leaf Veins */}
                      <path d="M 52 59 Q 62 48 72 47" stroke="#374431" strokeWidth="0.8" opacity="0.6" />
                      <path d="M 77 50 Q 88 40 98 40" stroke="#374431" strokeWidth="0.8" opacity="0.6" />
                      <path d="M 102 41 Q 114 32 124 33" stroke="#374431" strokeWidth="0.8" opacity="0.6" />
                      <path d="M 244 36 Q 258 30 272 39" stroke="#374431" strokeWidth="0.8" opacity="0.6" />
                      <path d="M 272 43 Q 286 38 300 49" stroke="#374431" strokeWidth="0.8" opacity="0.6" />

                      {/* Delicate Gold Berries & Buds */}
                      <circle cx="95" cy="48" r="2.5" fill="#c49a45" />
                      <circle cx="140" cy="38" r="2.5" fill="#c49a45" />
                      <circle cx="185" cy="36" r="3" fill="#d4af37" />
                      <circle cx="205" cy="36" r="3" fill="#d4af37" />
                      <circle cx="250" cy="38" r="2.5" fill="#c49a45" />
                      <circle cx="295" cy="48" r="2.5" fill="#c49a45" />
                    </svg>
                  </div>

                  {/* Botanical Content */}
                  <div className="relative z-10 flex flex-col justify-between flex-1 py-1">
                    <div>
                      <p className="font-cinzel text-[10px] sm:text-[11px] font-bold tracking-[0.3em] text-[#55634d] uppercase mb-3">
                        {hostLine}
                      </p>
                      <h1 className="font-script text-4xl sm:text-5xl text-[#222920] my-2 leading-[1.15] drop-shadow-sm font-normal">
                        {headline}
                      </h1>
                      <p className="font-cormorant italic text-xs sm:text-sm text-[#4a5444] max-w-xs mx-auto mt-2 mb-4 leading-relaxed tracking-wide">
                        {inviteAction}
                      </p>
                    </div>

                    {/* Refined Divider */}
                    <div className="flex items-center justify-center gap-3 my-2">
                      <div className="w-12 h-[1px] bg-[#a8997a]/60" />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                      <div className="w-12 h-[1px] bg-[#a8997a]/60" />
                    </div>

                    {/* Date & Time */}
                    <div className="space-y-1.5 my-2">
                      <p className="font-cinzel text-xs sm:text-sm font-bold tracking-[0.2em] text-[#222920] uppercase">
                        {formalDate}
                      </p>
                      <p className="font-cormorant text-xs font-semibold tracking-widest text-[#5d6855] uppercase">
                        {eventTime}
                      </p>
                      <p className="font-editorial text-xs sm:text-sm font-semibold text-[#2c3328] mt-2">
                        {customVenue}
                      </p>
                      <p className="text-[10px] font-medium tracking-wider text-[#63705b] uppercase mt-1">
                        {dressCode}
                      </p>
                    </div>

                    {/* Bottom Sprig & Footer */}
                    <div className="mt-3">
                      <p className="font-cormorant italic text-[11px] sm:text-xs text-[#525e4c] border-t border-[#c9b896]/40 pt-3 max-w-xs mx-auto">
                        {footerNote}
                      </p>
                      {/* Botanical Bottom Sprig */}
                      <div className="w-full flex justify-center mt-2">
                        <svg viewBox="0 0 160 30" className="w-32 h-6" fill="none">
                          <path d="M 20 15 C 60 10, 100 10, 140 15" stroke="#758a69" strokeWidth="1" strokeLinecap="round" />
                          <path d="M 45 13 C 40 5, 55 2, 58 11 Z" fill="#889d7c" />
                          <path d="M 75 11 C 78 2, 92 4, 88 12 Z" fill="#586c4e" />
                          <path d="M 105 12 C 108 3, 122 5, 118 13 Z" fill="#d4af37" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ──────────────────────────────────────────────────────────
                  TEMPLATE 2: ROYAL HERITAGE ARCH (WedMeGood Rohit & Preeta)
                  ────────────────────────────────────────────────────────── */}
              {selectedTemplate === "royalHeritage" && (
                <>
                  {/* Ornate Gold Border Frame */}
                  <div className="absolute inset-3 sm:inset-4 border-2 border-[#b45309]/50 rounded-2xl pointer-events-none" />
                  <div className="absolute inset-[15px] sm:inset-[18px] border border-[#d97706]/40 rounded-xl pointer-events-none" />

                  {/* Scalloped Mughal Jharokha Arch & Hanging Marigold Toran */}
                  <div className="w-full relative -mt-3 mb-1">
                    <svg viewBox="0 0 380 110" className="w-full h-24 sm:h-28" fill="none">
                      {/* Palace Arch Silhouette */}
                      <path
                        d="M 30 105 C 30 50, 90 20, 140 20 C 160 20, 175 10, 190 2 C 205 10, 220 20, 240 20 C 290 20, 350 50, 350 105"
                        stroke="#b45309"
                        strokeWidth="2.5"
                        strokeDasharray="4 2"
                      />
                      <path
                        d="M 40 105 C 40 60, 95 32, 145 32 C 165 32, 178 22, 190 14 C 202 22, 215 32, 235 32 C 285 32, 340 60, 340 105"
                        stroke="#d97706"
                        strokeWidth="1.2"
                      />
                      {/* Hanging Marigold Garlands (Genda Phool) */}
                      {/* Garland 1 */}
                      <path d="M 50 15 Q 110 50 170 20" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 3" />
                      {/* Garland 2 */}
                      <path d="M 210 20 Q 270 50 330 15" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 3" />

                      {/* Marigold Flower Blossoms */}
                      <circle cx="70" cy="30" r="5" fill="#f59e0b" />
                      <circle cx="70" cy="30" r="3" fill="#ea580c" />
                      <circle cx="105" cy="40" r="6" fill="#f59e0b" />
                      <circle cx="105" cy="40" r="3.5" fill="#ea580c" />
                      <circle cx="140" cy="32" r="5" fill="#f59e0b" />
                      <circle cx="140" cy="32" r="3" fill="#ea580c" />

                      <circle cx="240" cy="32" r="5" fill="#f59e0b" />
                      <circle cx="240" cy="32" r="3" fill="#ea580c" />
                      <circle cx="275" cy="40" r="6" fill="#f59e0b" />
                      <circle cx="275" cy="40" r="3.5" fill="#ea580c" />
                      <circle cx="310" cy="30" r="5" fill="#f59e0b" />
                      <circle cx="310" cy="30" r="3" fill="#ea580c" />

                      {/* Hanging Brass Bell & Pearl Drops */}
                      <path d="M 105 46 L 105 60" stroke="#b45309" strokeWidth="1" />
                      <polygon points="102,60 108,60 105,66" fill="#d97706" />
                      <circle cx="105" cy="68" r="1.5" fill="#b45309" />

                      <path d="M 190 14 L 190 42" stroke="#b45309" strokeWidth="1.2" />
                      <circle cx="190" cy="45" r="4.5" fill="#f59e0b" />
                      <polygon points="186,50 194,50 190,58" fill="#d97706" />

                      <path d="M 275 46 L 275 60" stroke="#b45309" strokeWidth="1" />
                      <polygon points="272,60 278,60 275,66" fill="#d97706" />
                      <circle cx="275" cy="68" r="1.5" fill="#b45309" />
                    </svg>
                  </div>

                  {/* Royal Heritage Content */}
                  <div className="relative z-10 flex flex-col justify-between flex-1 py-1">
                    <div>
                      <p className="font-cinzel text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#9a3412] uppercase mb-2">
                        ॥ SHREE GANESHAY NAMAH ॥
                      </p>
                      <p className="text-[10px] tracking-widest text-[#7c2d12] uppercase font-semibold mb-2">
                        {hostLine}
                      </p>
                      <h1 className="font-cinzel font-black text-2xl sm:text-4xl text-[#7c2d12] tracking-wider my-2 uppercase leading-tight drop-shadow-sm">
                        {headline}
                      </h1>
                      <p className="font-serif italic text-xs sm:text-sm text-[#9a3412] max-w-xs mx-auto mt-2 mb-3 leading-relaxed">
                        {inviteAction}
                      </p>
                    </div>

                    {/* Royal Gold Filigree Divider */}
                    <div className="flex items-center justify-center gap-2 my-2 text-[#b45309]">
                      <span>✦</span>
                      <div className="w-16 h-[1.5px] bg-[#b45309]/60" />
                      <Crown className="w-4 h-4 text-[#b45309]" />
                      <div className="w-16 h-[1.5px] bg-[#b45309]/60" />
                      <span>✦</span>
                    </div>

                    {/* Date & Palace Venue */}
                    <div className="space-y-1.5 my-2">
                      <p className="font-cinzel text-xs sm:text-sm font-bold tracking-[0.2em] text-[#451a03] uppercase">
                        {formalDate}
                      </p>
                      <p className="font-cinzel text-xs font-semibold tracking-wider text-[#9a3412]">
                        {eventTime}
                      </p>
                      <p className="font-editorial text-xs sm:text-sm font-bold text-[#451a03] mt-2">
                        {customVenue}
                      </p>
                      <p className="text-[10px] font-bold tracking-widest text-[#b45309] uppercase mt-1">
                        {dressCode}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-3">
                      <p className="font-serif text-[11px] sm:text-xs text-[#7c2d12] border-t border-[#b45309]/30 pt-3 max-w-xs mx-auto italic">
                        {footerNote}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* ──────────────────────────────────────────────────────────
                  TEMPLATE 3: PORCELAIN TOILE BLUE (French Classic Minted)
                  ────────────────────────────────────────────────────────── */}
              {selectedTemplate === "porcelainToile" && (
                <>
                  {/* Classic French Porcelain Blue Floral Border */}
                  <div className="absolute inset-3 sm:inset-4 border-2 border-[#1e40af]/60 rounded-xl pointer-events-none" />
                  <div className="absolute inset-[15px] sm:inset-[18px] border border-[#1e40af]/30 rounded-lg pointer-events-none" />

                  {/* Toile Top Floral Crest SVG */}
                  <div className="w-full flex justify-center -mt-2 mb-2">
                    <svg viewBox="0 0 280 80" className="w-56 sm:w-72 h-16 sm:h-20" fill="none">
                      {/* Acanthus scrolls & floral bouquet */}
                      <path d="M 60 50 C 90 20, 120 35, 140 20 C 160 35, 190 20, 220 50" stroke="#1e40af" strokeWidth="1.5" />
                      {/* Central Rosette / Crest */}
                      <circle cx="140" cy="20" r="10" stroke="#1e40af" strokeWidth="1.2" fill="#eff6ff" />
                      <circle cx="140" cy="20" r="5" fill="#1e40af" />
                      {/* Foliage flourishes */}
                      <path d="M 75 45 C 65 30, 80 20, 90 32 Z" fill="#3b82f6" opacity="0.75" />
                      <path d="M 105 32 C 100 18, 120 15, 122 28 Z" fill="#1d4ed8" opacity="0.8" />
                      <path d="M 175 28 C 177 15, 197 18, 192 32 Z" fill="#1d4ed8" opacity="0.8" />
                      <path d="M 205 32 C 215 20, 230 30, 220 45 Z" fill="#3b82f6" opacity="0.75" />
                      {/* Side dots */}
                      <circle cx="50" cy="54" r="2" fill="#1e40af" />
                      <circle cx="230" cy="54" r="2" fill="#1e40af" />
                    </svg>
                  </div>

                  {/* Porcelain Toile Content */}
                  <div className="relative z-10 flex flex-col justify-between flex-1 py-1">
                    <div>
                      <p className="font-cinzel text-[10px] sm:text-[11px] font-bold tracking-[0.3em] text-[#1e3a8a] uppercase mb-2">
                        {hostLine}
                      </p>
                      <h1 className="font-editorial text-3xl sm:text-4xl text-[#0f172a] font-bold tracking-tight my-2 leading-tight">
                        {headline}
                      </h1>
                      <p className="font-serif italic text-xs sm:text-sm text-[#334155] max-w-xs mx-auto mt-2 mb-3 leading-relaxed">
                        {inviteAction}
                      </p>
                    </div>

                    {/* Cobalt Divider */}
                    <div className="flex items-center justify-center gap-2 my-2 text-[#1e40af]">
                      <div className="w-14 h-[1px] bg-[#1e40af]/50" />
                      <Flower2 className="w-4 h-4 text-[#1e40af]" />
                      <div className="w-14 h-[1px] bg-[#1e40af]/50" />
                    </div>

                    {/* Date & Venue */}
                    <div className="space-y-1.5 my-2">
                      <p className="font-cinzel text-xs sm:text-sm font-bold tracking-[0.2em] text-[#0f172a] uppercase">
                        {formalDate}
                      </p>
                      <p className="font-cinzel text-xs font-semibold tracking-wider text-[#1e40af]">
                        {eventTime}
                      </p>
                      <p className="font-editorial text-xs sm:text-sm font-bold text-[#0f172a] mt-2">
                        {customVenue}
                      </p>
                      <p className="text-[10px] font-medium tracking-widest text-[#475569] uppercase mt-1">
                        {dressCode}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-3">
                      <p className="font-serif text-[11px] sm:text-xs text-[#334155] border-t border-[#1e40af]/30 pt-3 max-w-xs mx-auto italic">
                        {footerNote}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* ──────────────────────────────────────────────────────────
                  TEMPLATE 4: ENCHANTED TWILIGHT (Brides Fairy Lights)
                  ────────────────────────────────────────────────────────── */}
              {selectedTemplate === "enchantedTwilight" && (
                <>
                  {/* Subtle Gold Pinstripe */}
                  <div className="absolute inset-3 sm:inset-4 border border-amber-400/25 rounded-2xl pointer-events-none" />

                  {/* Hanging Glowing Fairy Lights & Leaves SVG */}
                  <div className="w-full relative -mt-3 mb-1">
                    <svg viewBox="0 0 360 95" className="w-full h-20 sm:h-24" fill="none">
                      {/* Draped Wire 1 */}
                      <path d="M 10 20 Q 90 60 180 25" stroke="#fde047" strokeWidth="1" opacity="0.6" />
                      {/* Draped Wire 2 */}
                      <path d="M 180 25 Q 270 60 350 20" stroke="#fde047" strokeWidth="1" opacity="0.6" />

                      {/* Fairy Lights Bulbs with Glowing Halos */}
                      {/* Bulb 1 */}
                      <circle cx="50" cy="38" r="8" fill="#fef08a" opacity="0.25" />
                      <circle cx="50" cy="38" r="3" fill="#ffffff" />
                      {/* Bulb 2 */}
                      <circle cx="100" cy="52" r="10" fill="#fef08a" opacity="0.3" />
                      <circle cx="100" cy="52" r="3.5" fill="#fffbeb" />
                      {/* Bulb 3 */}
                      <circle cx="150" cy="42" r="8" fill="#fef08a" opacity="0.25" />
                      <circle cx="150" cy="42" r="3" fill="#ffffff" />
                      {/* Bulb 4 */}
                      <circle cx="210" cy="42" r="8" fill="#fef08a" opacity="0.25" />
                      <circle cx="210" cy="42" r="3" fill="#ffffff" />
                      {/* Bulb 5 */}
                      <circle cx="260" cy="52" r="10" fill="#fef08a" opacity="0.3" />
                      <circle cx="260" cy="52" r="3.5" fill="#fffbeb" />
                      {/* Bulb 6 */}
                      <circle cx="310" cy="38" r="8" fill="#fef08a" opacity="0.25" />
                      <circle cx="310" cy="38" r="3" fill="#ffffff" />

                      {/* Intertwined Eucalyptus Sprigs */}
                      <path d="M 85 46 C 75 35, 95 30, 92 44 Z" fill="#6ee7b7" opacity="0.6" />
                      <path d="M 125 45 C 135 32, 145 42, 130 50 Z" fill="#6ee7b7" opacity="0.6" />
                      <path d="M 235 45 C 225 32, 245 35, 240 48 Z" fill="#6ee7b7" opacity="0.6" />
                      <path d="M 285 46 C 295 35, 305 45, 290 52 Z" fill="#6ee7b7" opacity="0.6" />
                    </svg>
                  </div>

                  {/* Enchanted Twilight Content */}
                  <div className="relative z-10 flex flex-col justify-between flex-1 py-1 text-stone-100">
                    <div>
                      <p className="font-cinzel text-[10px] sm:text-[11px] font-bold tracking-[0.3em] text-amber-300/90 uppercase mb-2">
                        {hostLine}
                      </p>
                      <h1 className="font-script text-4xl sm:text-5xl text-[#fef08a] my-2 leading-tight drop-shadow-[0_2px_12px_rgba(254,240,138,0.4)] font-normal">
                        {headline}
                      </h1>
                      <p className="font-serif italic text-xs sm:text-sm text-stone-300 max-w-xs mx-auto mt-2 mb-3 leading-relaxed">
                        {inviteAction}
                      </p>
                    </div>

                    {/* Golden Stars Divider */}
                    <div className="flex items-center justify-center gap-2 my-2 text-amber-300">
                      <span className="text-[10px]">✨</span>
                      <div className="w-14 h-[1px] bg-amber-400/40" />
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <div className="w-14 h-[1px] bg-amber-400/40" />
                      <span className="text-[10px]">✨</span>
                    </div>

                    {/* Date & Venue */}
                    <div className="space-y-1.5 my-2">
                      <p className="font-cinzel text-xs sm:text-sm font-bold tracking-[0.2em] text-white uppercase">
                        {formalDate}
                      </p>
                      <p className="font-cormorant text-xs font-semibold tracking-wider text-amber-200 uppercase">
                        {eventTime}
                      </p>
                      <p className="font-editorial text-xs sm:text-sm font-bold text-stone-100 mt-2">
                        {customVenue}
                      </p>
                      <p className="text-[10px] font-medium tracking-widest text-amber-200/80 uppercase mt-1">
                        {dressCode}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-3">
                      <p className="font-serif text-[11px] sm:text-xs text-stone-300/90 border-t border-white/15 pt-3 max-w-xs mx-auto italic">
                        {footerNote}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* ──────────────────────────────────────────────────────────
                  TEMPLATE 5: MINIMALIST LUXE (Minted Editorial Wax Seal)
                  ────────────────────────────────────────────────────────── */}
              {selectedTemplate === "minimalistLuxe" && (
                <>
                  {/* Precision Double Gold Border */}
                  <div className="absolute inset-3 sm:inset-4 border border-[#b48c36]/40 rounded-xl pointer-events-none" />
                  <div className="absolute inset-[15px] sm:inset-[18px] border border-[#b48c36]/20 rounded-lg pointer-events-none" />

                  {/* 3D Embossed Wax Seal Medallion SVG */}
                  <div className="w-full flex justify-center -mt-1 mb-2">
                    <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20" fill="none">
                      {/* Organic scalloped wax edge */}
                      <path
                        d="M 50 12 C 60 11, 70 16, 78 24 C 86 32, 89 42, 88 52 C 87 62, 82 72, 74 80 C 66 88, 56 90, 46 89 C 36 88, 26 83, 19 75 C 12 67, 10 57, 12 47 C 14 37, 20 27, 28 20 C 36 13, 40 13, 50 12 Z"
                        fill="#b48c36"
                        filter="drop-shadow(0 4px 6px rgba(0,0,0,0.18))"
                      />
                      {/* Inner pressed rim */}
                      <circle cx="50" cy="50" r="30" stroke="#8c6a23" strokeWidth="1.5" strokeDasharray="3 1.5" />
                      <circle cx="50" cy="50" r="26" stroke="#fef3c7" strokeWidth="0.8" opacity="0.6" />
                      {/* Laurel Wreath */}
                      <path d="M 33 50 C 33 40, 42 32, 50 32 C 58 32, 67 40, 67 50" stroke="#fffbeb" strokeWidth="1.2" />
                      {/* Center Monogram Star */}
                      <polygon points="50,42 53,48 59,49 55,53 56,59 50,56 44,59 45,53 41,49 47,48" fill="#fffbeb" />
                    </svg>
                  </div>

                  {/* Minimalist Editorial Content */}
                  <div className="relative z-10 flex flex-col justify-between flex-1 py-1">
                    <div>
                      <p className="font-cinzel text-[10px] sm:text-[11px] font-bold tracking-[0.3em] text-[#78716c] uppercase mb-2">
                        {hostLine}
                      </p>
                      <h1 className="font-editorial text-3xl sm:text-4xl text-[#1c1917] font-bold tracking-normal my-2 leading-tight">
                        {headline}
                      </h1>
                      <p className="font-serif italic text-xs sm:text-sm text-[#57534e] max-w-xs mx-auto mt-2 mb-3 leading-relaxed">
                        {inviteAction}
                      </p>
                    </div>

                    {/* Gold Hairline Divider */}
                    <div className="flex items-center justify-center gap-3 my-2">
                      <div className="w-16 h-[1px] bg-[#b48c36]/50" />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#b48c36]" />
                      <div className="w-16 h-[1px] bg-[#b48c36]/50" />
                    </div>

                    {/* Date & Venue */}
                    <div className="space-y-1.5 my-2">
                      <p className="font-cinzel text-xs sm:text-sm font-bold tracking-[0.2em] text-[#1c1917] uppercase">
                        {formalDate}
                      </p>
                      <p className="font-cinzel text-xs font-semibold tracking-wider text-[#b48c36] uppercase">
                        {eventTime}
                      </p>
                      <p className="font-editorial text-xs sm:text-sm font-bold text-[#292524] mt-2">
                        {customVenue}
                      </p>
                      <p className="text-[10px] font-medium tracking-widest text-[#78716c] uppercase mt-1">
                        {dressCode}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-3">
                      <p className="font-serif text-[11px] sm:text-xs text-[#57534e] border-t border-[#b48c36]/30 pt-3 max-w-xs mx-auto italic">
                        {footerNote}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              ACTION BUTTONS TOOLBAR (STICKY BOTTOM BAR)
              ═══════════════════════════════════════════════════════════════ */}
          <div className="sticky -bottom-4 sm:-bottom-7 -mx-4 sm:-mx-7 px-4 sm:px-7 py-3 bg-[#0f1015]/95 backdrop-blur-xl border-t border-amber-500/25 z-30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mt-4 shadow-2xl">
            {/* Download High-Resolution Card PNG */}
            <button
              onClick={handleDownloadImage}
              disabled={isExportingImage}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-600/30 transition-all cursor-pointer disabled:opacity-60"
            >
              {isExportingImage ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  <span>Rendering High-Res PNG...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Card Image (PNG)</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2">
              {/* Print / Save as PDF */}
              <button
                onClick={handlePrint}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print / PDF</span>
              </button>

              {/* Copy Digital Invite */}
              <button
                onClick={handleCopyText}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white font-medium rounded-xl text-xs sm:text-sm transition-all cursor-pointer"
              >
                {copiedText ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-stone-400" />
                    <span>Copy Text (WhatsApp)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
