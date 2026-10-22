import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import type { VendorScript } from "../types";

interface Props {
  scripts: VendorScript[];
  eventName: string;
  eventDate: string;
  venue?: string;
}

const CHANNEL_CONFIG = {
  WhatsApp: {
    icon: "💬",
    color: "text-emerald-400",
    bg: "bg-emerald-500/15 border-emerald-500/30",
    label: "WhatsApp",
  },
  SMS: {
    icon: "📱",
    color: "text-sky-400",
    bg: "bg-sky-500/15 border-sky-400/30",
    label: "SMS",
  },
  Email: {
    icon: "✉️",
    color: "text-amber-400",
    bg: "bg-amber-500/15 border-amber-500/30",
    label: "Email",
  },
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "Copied!" : "Copy message"}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
        copied
          ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
          : "bg-white/5 border-white/15 text-stone-300 hover:text-white hover:bg-white/10"
      }`}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

// Bulk message generator templates
function generateBulkMessage(type: "whatsapp" | "sms", eventName: string, eventDate: string, venue: string): string {
  const date = new Date(eventDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  if (type === "whatsapp") {
    return `🎉 *You're Invited!*

Hi [Name]! 👋

We're thrilled to invite you to *${eventName}*!

📅 *Date:* ${date}
📍 *Venue:* ${venue}
🎊 *Dress Code:* As per theme

Please confirm your attendance by replying *YES* or *NO*.

See you there! 🥂
— ${eventName} Team`;
  }
  return `Hi [Name]! You're invited to ${eventName} on ${date} at ${venue}. Reply YES to confirm. Details to follow.`;
}

export default function InviteSender({ scripts, eventName, eventDate, venue }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"templates" | "bulk">("templates");

  const whatsappBulk = generateBulkMessage("whatsapp", eventName, eventDate, venue || "[Venue]");
  const smsBulk = generateBulkMessage("sms", eventName, eventDate, venue || "[Venue]");

  const typeMap: Record<string, string> = {
    Invite: "📨 Guest Invite",
    DietaryReminder: "🥗 Dietary Reminder",
    VendorNegotiation: "🤝 Vendor Outreach",
    ThankYou: "💛 Thank You Note",
  };

  return (
    <section aria-label="Invite sender and message preview" className="human-card rounded-3xl p-6 sm:p-8 border border-amber-500/15">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/25">
          <Send className="w-5 h-5 text-blue-400" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-200">Invite Sender Preview</h2>
          <p className="text-xs text-stone-400">Ready-to-send WhatsApp, SMS & Email scripts</p>
        </div>
      </div>

      {/* Tab Switch */}
      <div className="flex gap-1.5 p-1 bg-white/5 border border-white/8 rounded-2xl mb-5">
        {(["templates", "bulk"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            aria-pressed={activeTab === tab}
            className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize cursor-pointer transition-all ${
              activeTab === tab
                ? "bg-white/15 text-stone-100 shadow"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            {tab === "templates" ? "📋 Script Templates" : "📣 Bulk Invite"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "templates" ? (
          <motion.div
            key="templates"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-3"
          >
            {scripts.map((script, i) => {
              const id = `script-${i}`;
              const channelCfg = CHANNEL_CONFIG[script.channel] || CHANNEL_CONFIG.Email;
              const isOpen = expandedId === id;

              return (
                <div key={id} className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
                  {/* Script header */}
                  <button
                    onClick={() => setExpandedId(isOpen ? null : id)}
                    aria-expanded={isOpen}
                    aria-controls={`script-body-${i}`}
                    className="w-full flex items-center justify-between gap-3 p-4 text-left cursor-pointer hover:bg-white/5 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg" role="img" aria-hidden="true">{channelCfg.icon}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-stone-200 truncate">{typeMap[script.type] || script.type}</p>
                        <p className="text-xs text-stone-400 truncate">{script.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${channelCfg.bg} ${channelCfg.color}`}>
                        {channelCfg.label}
                      </span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        id={`script-body-${i}`}
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-white/5">
                          <div className="mt-3 relative">
                            <pre className="whitespace-pre-wrap text-xs text-stone-300 font-sans leading-relaxed bg-black/20 rounded-xl p-4 max-h-52 overflow-y-auto border border-white/5">
                              {script.body}
                            </pre>
                            <div className="flex justify-end mt-2.5">
                              <CopyButton text={`Subject: ${script.subject}\n\n${script.body}`} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="bulk"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            {/* WhatsApp Bulk */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl" role="img" aria-label="WhatsApp">💬</span>
                  <span className="text-sm font-bold text-emerald-300">WhatsApp Blast</span>
                </div>
                <CopyButton text={whatsappBulk} />
              </div>
              <pre className="whitespace-pre-wrap text-xs text-stone-300 font-sans leading-relaxed bg-black/20 rounded-xl p-3.5 max-h-52 overflow-y-auto border border-white/5">
                {whatsappBulk}
              </pre>
            </div>

            {/* SMS Bulk */}
            <div className="bg-sky-500/5 border border-sky-500/20 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl" role="img" aria-label="SMS">📱</span>
                  <span className="text-sm font-bold text-sky-300">SMS Quick Invite</span>
                </div>
                <CopyButton text={smsBulk} />
              </div>
              <pre className="whitespace-pre-wrap text-xs text-stone-300 font-sans leading-relaxed bg-black/20 rounded-xl p-3.5 border border-white/5">
                {smsBulk}
              </pre>
              <p className="text-xs text-stone-500 mt-2 text-right">{smsBulk.length}/160 chars</p>
            </div>

            <p className="text-xs text-stone-500 text-center font-sans">
              Replace [Name] with guest names before sending. Use a bulk messaging tool for mass send.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
