import { useState } from "react";
import type { VendorScript } from "../types";
import { MessageSquare, Mail, Phone, Copy, Check } from "lucide-react";

interface Props {
  scripts: VendorScript[];
}

const TYPE_CONFIG: Record<VendorScript["type"], { label: string; emoji: string; color: string; border: string }> = {
  Invite: { label: "Guest Invitation", emoji: "💌", color: "text-pink-300", border: "border-pink-500/40 bg-pink-500/10" },
  DietaryReminder: { label: "Dietary Reminder", emoji: "🥗", color: "text-emerald-300", border: "border-emerald-500/40 bg-emerald-500/10" },
  VendorNegotiation: { label: "Vendor Negotiation", emoji: "🤝", color: "text-amber-300", border: "border-amber-500/40 bg-amber-500/10" },
  ThankYou: { label: "Thank You Note", emoji: "🙏", color: "text-blue-300", border: "border-blue-500/40 bg-blue-500/10" },
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
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback for browsers without clipboard API
    }
  };

  if (scripts.length === 0) {
    return (
      <section aria-labelledby="scripts-heading" className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 id="scripts-heading" className="text-lg font-bold text-white mb-4">Communication Scripts</h2>
        <p className="text-slate-400 text-sm">No scripts generated yet.</p>
      </section>
    );
  }

  const current = scripts[activeScript];
  const config = TYPE_CONFIG[current.type];
  const ChannelIcon = CHANNEL_ICONS[current.channel];

  return (
    <section aria-labelledby="scripts-heading" className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-amber-500/20 rounded-xl">
          <MessageSquare className="w-5 h-5 text-amber-400" aria-hidden="true" />
        </div>
        <div>
          <h2 id="scripts-heading" className="text-lg font-bold text-white">Communication Scripts</h2>
          <p className="text-sm text-slate-400">AI-drafted invitation & vendor templates</p>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex gap-2 mb-5 flex-wrap" role="tablist" aria-label="Communication script types">
        {scripts.map((script, i) => {
          const cfg = TYPE_CONFIG[script.type];
          return (
            <button
              key={i}
              role="tab"
              aria-selected={activeScript === i}
              aria-controls={`script-panel-${i}`}
              id={`script-tab-${i}`}
              onClick={() => setActiveScript(i)}
              className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                activeScript === i
                  ? `${cfg.border} ${cfg.color} shadow-md`
                  : "bg-white/5 text-slate-400 border-white/10 hover:border-white/30"
              }`}
            >
              <span>{cfg.emoji}</span>
              <span className="hidden sm:inline">{cfg.label}</span>
              <span className="sm:hidden">{script.type}</span>
            </button>
          );
        })}
      </div>

      {/* Script Content */}
      <div
        id={`script-panel-${activeScript}`}
        role="tabpanel"
        aria-labelledby={`script-tab-${activeScript}`}
        className="bg-white/5 rounded-xl p-4"
      >
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${CHANNEL_COLORS[current.channel]}`}>
                <ChannelIcon className="inline w-3 h-3 mr-1" aria-hidden="true" />
                {current.channel}
              </span>
            </div>
            <h3 className="text-white font-semibold text-sm">{current.subject}</h3>
          </div>
          <button
            onClick={() => handleCopy(`Subject: ${current.subject}\n\n${current.body}`, activeScript)}
            aria-label={copiedId === activeScript ? "Copied!" : "Copy script to clipboard"}
            title="Copy to clipboard"
            className="shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 rounded-lg text-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {copiedId === activeScript ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                Copy
              </>
            )}
          </button>
        </div>

        {/* Script Body */}
        <pre
          className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap font-sans bg-black/20 rounded-lg p-4 max-h-80 overflow-y-auto scrollbar-thin"
          aria-label={`${config.label} script content`}
        >
          {current.body}
        </pre>
      </div>
    </section>
  );
}
