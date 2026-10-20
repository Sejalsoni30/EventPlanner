import { useState } from "react";
import { motion } from "framer-motion";
import type { ItineraryItem } from "../types";
import { Clock, User, CalendarPlus, Download, Check } from "lucide-react";

interface Props {
  itinerary: ItineraryItem[];
  eventName?: string;
  eventDate?: string;
}

const CATEGORY_STYLES: Record<
  ItineraryItem["category"],
  { dot: string; glow: string; badge: string; border: string }
> = {
  Setup: {
    dot: "bg-amber-400",
    glow: "shadow-amber-500/50",
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    border: "border-l-amber-500/40",
  },
  Guest: {
    dot: "bg-blue-400",
    glow: "shadow-blue-500/50",
    badge: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    border: "border-l-blue-500/40",
  },
  Program: {
    dot: "bg-purple-400",
    glow: "shadow-purple-500/50",
    badge: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    border: "border-l-purple-500/40",
  },
  Catering: {
    dot: "bg-rose-400",
    glow: "shadow-rose-500/50",
    badge: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    border: "border-l-rose-500/40",
  },
  Teardown: {
    dot: "bg-slate-400",
    glow: "shadow-slate-500/50",
    badge: "bg-slate-500/15 text-slate-300 border-slate-500/30",
    border: "border-l-slate-500/40",
  },
  Break: {
    dot: "bg-emerald-400",
    glow: "shadow-emerald-500/50",
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    border: "border-l-emerald-500/40",
  },
};

const CATEGORY_ICONS: Record<ItineraryItem["category"], string> = {
  Setup: "🔧",
  Guest: "👥",
  Program: "🎤",
  Catering: "🍽️",
  Teardown: "📦",
  Break: "☕",
};

/**
 * Calculates relative time from the first timeline item
 */
function getRelativeTime(timeStr: string, firstTimeStr: string): string {
  try {
    const parseMinutes = (t: string) => {
      const match = t.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (!match) return 0;
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const ampm = match[3]?.toUpperCase();
      if (ampm === "PM" && hours < 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };

    const firstMins = parseMinutes(firstTimeStr);
    const currMins = parseMinutes(timeStr);
    let diff = currMins - firstMins;
    if (diff < 0) diff += 24 * 60; // Next day rollover

    const h = Math.floor(diff / 60);
    const m = diff % 60;
    if (h === 0 && m === 0) return "T+0h (Kickoff)";
    return `T+${h}h${m > 0 ? ` ${m}m` : ""}`;
  } catch {
    return "";
  }
}

export default function ItineraryTimeline({
  itinerary,
  eventName = "CelebrateAI Event",
  eventDate,
}: Props) {
  const [copiedIcs, setCopiedIcs] = useState(false);

  if (itinerary.length === 0) {
    return (
      <section
        aria-labelledby="itinerary-heading"
        className="glass-card rounded-3xl p-6 border border-white/10"
      >
        <h2 id="itinerary-heading" className="text-lg font-bold text-white mb-4">
          Hourly Itinerary
        </h2>
        <p className="text-slate-400 text-sm">No itinerary generated yet.</p>
      </section>
    );
  }

  const firstTime = itinerary[0]?.time ?? "";

  // Generates RFC-5545 compliant .ics file for Google Calendar / Apple Calendar
  const handleExportICS = () => {
    const dateStr = eventDate ? eventDate.replace(/-/g, "") : "20271020";

    const calendarEvents = itinerary.map((item, idx) => {
      // Derive approximate 24hr time
      let h = 9 + idx;
      if (h > 23) h = 23;
      const startHour = String(h).padStart(2, "0");
      const endHour = String(h + 1).padStart(2, "0");

      return [
        "BEGIN:VEVENT",
        `UID:celebrateai-${Date.now()}-${idx}@celebrate.ai`,
        `DTSTAMP:${dateStr}T100000Z`,
        `DTSTART:${dateStr}T${startHour}0000Z`,
        `DTEND:${dateStr}T${endHour}0000Z`,
        `SUMMARY:[${item.category}] ${item.title}`,
        `DESCRIPTION:${item.description.replace(/\n/g, " ")} (POC: ${item.poc})`,
        "STATUS:CONFIRMED",
        "END:VEVENT",
      ].join("\r\n");
    });

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//CelebrateAI//Event Orchestrator//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      `X-WR-CALNAME:${eventName} Itinerary`,
      ...calendarEvents,
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${eventName.replace(/\s+/g, "_")}_Itinerary.ics`;
    a.click();
    URL.revokeObjectURL(url);

    setCopiedIcs(true);
    setTimeout(() => setCopiedIcs(false), 2500);
  };

  // Plain text summary download
  const handleDownloadSummary = () => {
    const lines = [
      `========================================`,
      `📅 ${eventName} — Schedule & Itinerary`,
      `Date: ${eventDate || "TBD"}`,
      `Total Activities: ${itinerary.length}`,
      `========================================\n`,
      ...itinerary.map(
        (it) =>
          `[${it.time}] (${it.duration}) ${it.title}\n` +
          `Category: ${it.category} | POC: ${it.poc}\n` +
          `Details: ${it.description}\n`
      ),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${eventName.replace(/\s+/g, "_")}_Itinerary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section
      aria-labelledby="itinerary-heading"
      className="glass-card rounded-3xl p-6 backdrop-blur-xl border border-white/10 shadow-2xl transition-all"
    >
      {/* Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-white/10 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-pink-500/20 border border-pink-500/30 rounded-2xl shadow-lg shadow-pink-500/20">
            <Clock className="w-5 h-5 text-pink-400" aria-hidden="true" />
          </div>
          <div>
            <h2 id="itinerary-heading" className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Hourly Itinerary
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                Live Timeline
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {itinerary.length} scheduled phases from setup to teardown
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportICS}
            aria-label="Export itinerary to calendar .ics"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-pink-500/40 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            {copiedIcs ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Downloaded!</span>
              </>
            ) : (
              <>
                <CalendarPlus className="w-3.5 h-3.5 text-pink-400" />
                <span>Export .ics</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadSummary}
            aria-label="Download itinerary text summary"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-purple-500/40 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>Summary</span>
          </button>
        </div>
      </div>

      {/* Category Legend Filter Chips */}
      <div className="flex flex-wrap gap-1.5 mb-6" aria-label="Itinerary category legend">
        {(Object.keys(CATEGORY_STYLES) as ItineraryItem["category"][]).map((cat) => (
          <span
            key={cat}
            className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${CATEGORY_STYLES[cat].badge} flex items-center gap-1`}
          >
            <span>{CATEGORY_ICONS[cat]}</span>
            <span>{cat}</span>
          </span>
        ))}
      </div>

      {/* Timeline Stream */}
      <ol className="relative pl-7 space-y-4" aria-label="Event timeline">
        {/* Glow Vertical Axis */}
        <div
          className="absolute left-3 top-3 bottom-3 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500/50 to-slate-700 rounded-full"
          aria-hidden="true"
        />

        {itinerary.map((item, index) => {
          const styles = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.Program;
          const relativeTime = getRelativeTime(item.time, firstTime);

          return (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03, duration: 0.25 }}
              className="relative group"
            >
              {/* Dynamic Glow Pip */}
              <div
                className={`absolute -left-[27px] mt-3.5 w-3.5 h-3.5 rounded-full ${styles.dot} shadow-lg ${styles.glow} ring-4 ring-[#0b0c16] group-hover:scale-125 transition-transform duration-300`}
                aria-hidden="true"
              />

              {/* Card Container */}
              <article className="glass-card-hover rounded-2xl p-4 border border-white/5 hover:border-white/15 bg-white/5 transition-all">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-xs bg-purple-500/20 text-purple-200 px-2.5 py-1 rounded-lg border border-purple-500/30">
                      {item.time}
                    </span>
                    {relativeTime && (
                      <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
                        {relativeTime}
                      </span>
                    )}
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${styles.badge}`}>
                      {CATEGORY_ICONS[item.category]} {item.category}
                    </span>
                  </div>

                  <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                    {item.duration}
                  </span>
                </div>

                <h3 className="text-white font-bold text-sm mb-1 tracking-tight">{item.title}</h3>
                <p className="text-slate-300 text-xs mb-3 leading-relaxed">{item.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-purple-400" aria-hidden="true" />
                    <span>POC:</span>
                    <span className="text-white font-medium bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                      {item.poc}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">Phase {index + 1}</span>
                </div>
              </article>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
