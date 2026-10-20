import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { VendorScript } from "../types";
import { MessageSquare, Mail, Phone, Copy, Check } from "lucide-react";

interface Props {
  scripts: VendorScript[];
}

const TYPE_CONFIG: Record<
  VendorScript["type"],
  { label: string; emoji: string; color: string; border: string; glow: string }
> = {
  Invite: {
    label: "Guest Invitation",
    emoji: "💌",
    color: "text-pink-300",
    border: "border-pink-500/40 bg-pink-500/10",
    glow: "shadow-pink-500/20",
  },
  DietaryReminder: {
    label: "Dietary Reminder",
    emoji: "🥗",
    color: "text-emerald-300",
    border: "border-emerald-500/40 bg-emerald-500/10",
    glow: "shadow-emerald-500/20",
  },
  VendorNegotiation: {
    label: "Vendor Negotiation",
    emoji: "🤝",
    color: "text-amber-300",
    border: "border-amber-500/40 bg-amber-500/10",
    glow: "shadow-amber-500/20",
  },
  ThankYou: {
    label: "Thank You Note",
    emoji: "🙏",
    color: "text-blue-300",
    border: "border-blue-500/40 bg-blue-500/10",
    glow: "shadow-blue-500/20",
  },
};

const CHANNEL_ICONS: Record<VendorScript["channel"], typeof Mail> = {
  Email: Mail,
  SMS: Phone,
  WhatsApp: MessageSquare,
};

const CHANNEL_COLORS: Record<VendorScript["channel"], string> = {
  Email: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  SMS: "text-green-400 bg-green-500/10 border-green-500/30",
  WhatsApp: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
};

export default function VendorScripts({ scripts }: Props) {
  const [activeScript, setActiveScript] = useState(0);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(index);
      setTimeout(() => setCopiedId(null), 2200);
    } catch {
      // Fallback
    }
  };

  if (scripts.length === 0) {
    return (
      <section
        aria-labelledby="scripts-heading"
        className="glass-card rounded-3xl p-6 border border-white/10"
      >
        <h2 id="scripts-heading" className="text-lg font-bold text-white mb-4">
          Communication Scripts
        </h2>
        <p className="text-slate-400 text-sm">No scripts generated yet.</p>
      </section>
    );
  }

  const current = scripts[activeScript];
  const config = TYPE_CONFIG[current.type] || TYPE_CONFIG.Invite;
  const ChannelIcon = CHANNEL_ICONS[current.channel] || Mail;

  return (
    <section
      aria-labelledby="scripts-heading"
      className="human-card rounded-3xl p-6 backdrop-blur-xl border border-amber-500/20 shadow-2xl transition-all"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 border border-amber-500/30 rounded-2xl shadow-lg shadow-amber-500/20">
            <MessageSquare className="w-5 h-5 text-amber-400" aria-hidden="true" />
          </div>
          <div>
            <h2 id="scripts-heading" className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Communication Scripts
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                AI Drafted
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Ready-to-send invitations, vendor briefs, and reminders</p>
          </div>
        </div>
      </div>

      {/* Tab Selector with Smooth Active Slider */}
      <div
        className="flex gap-2 mb-5 flex-wrap p-1.5 bg-black/30 rounded-2xl border border-white/5"
        role="tablist"
        aria-label="Communication script types"
      >
        {scripts.map((script, i) => {
          const cfg = TYPE_CONFIG[script.type] || TYPE_CONFIG.Invite;
          const isActive = activeScript === i;

          return (
            <button
              key={i}
              role="tab"
              aria-selected={isActive}
              aria-controls={`script-panel-${i}`}
              id={`script-tab-${i}`}
              onClick={() => setActiveScript(i)}
              className={`relative flex items-center gap-2 text-xs px-3.5 py-2.5 rounded-xl font-semibold transition-all focus:outline-none cursor-pointer ${
                isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeScriptTab"
                  className="absolute inset-0 bg-purple-600/30 border border-purple-500/60 rounded-xl shadow-lg shadow-purple-600/20 -z-0"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10 text-sm">{cfg.emoji}</span>
              <span className="relative z-10 hidden sm:inline">{cfg.label}</span>
              <span className="relative z-10 sm:hidden">{script.type}</span>
            </button>
          );
        })}
      </div>

      {/* Script View Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeScript}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          id={`script-panel-${activeScript}`}
          role="tabpanel"
          aria-labelledby={`script-tab-${activeScript}`}
          className="rounded-2xl p-5 bg-white/5 border border-white/10 backdrop-blur-md"
        >
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-white/10 gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${CHANNEL_COLORS[current.channel]}`}>
                  <ChannelIcon className="inline w-3 h-3 mr-1" aria-hidden="true" />
                  {current.channel} Channel
                </span>
                <span className="text-xs text-slate-400">• Ready to Dispatch</span>
              </div>
              <h3 className="text-white font-bold text-sm tracking-tight truncate">{current.subject}</h3>
            </div>

            {/* Quick Copy Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleCopy(`Subject: ${current.subject}\n\n${current.body}`, activeScript)}
              aria-label={copiedId === activeScript ? "Copied!" : "Copy script to clipboard"}
              title="Copy to clipboard"
              className={`shrink-0 flex items-center gap-2 text-xs px-4 py-2 rounded-xl border font-bold transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer ${
                copiedId === activeScript
                  ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-lg shadow-emerald-500/20"
                  : "bg-white/10 hover:bg-white/15 border-white/15 hover:border-white/30 text-white"
              }`}
            >
              {copiedId === activeScript ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" aria-hidden="true" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-purple-300" aria-hidden="true" />
                  <span>Copy Script</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Script Content Area */}
          <div className="relative">
            <pre
              className="text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans bg-black/40 border border-white/5 rounded-xl p-4 sm:p-5 max-h-80 overflow-y-auto scrollbar-thin select-all"
              aria-label={`${config.label} script content`}
            >
              {current.body}
            </pre>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
