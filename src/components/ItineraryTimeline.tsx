import type { ItineraryItem } from "../types";
import { Clock, User } from "lucide-react";

interface Props {
  itinerary: ItineraryItem[];
}

const CATEGORY_STYLES: Record<ItineraryItem["category"], { dot: string; badge: string }> = {
  Setup: { dot: "bg-amber-500", badge: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
  Guest: { dot: "bg-blue-500", badge: "bg-blue-500/20 text-blue-300 border-blue-500/40" },
  Program: { dot: "bg-purple-500", badge: "bg-purple-500/20 text-purple-300 border-purple-500/40" },
  Catering: { dot: "bg-pink-500", badge: "bg-pink-500/20 text-pink-300 border-pink-500/40" },
  Teardown: { dot: "bg-slate-500", badge: "bg-slate-500/20 text-slate-300 border-slate-500/40" },
  Break: { dot: "bg-emerald-500", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
};

const CATEGORY_ICONS: Record<ItineraryItem["category"], string> = {
  Setup: "🔧",
  Guest: "👥",
  Program: "🎤",
  Catering: "🍽️",
  Teardown: "📦",
  Break: "☕",
};

export default function ItineraryTimeline({ itinerary }: Props) {
  if (itinerary.length === 0) {
    return (
      <section aria-labelledby="itinerary-heading" className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 id="itinerary-heading" className="text-lg font-bold text-white mb-4">Event Itinerary</h2>
        <p className="text-slate-400 text-sm">No itinerary generated yet.</p>
      </section>
    );
  }

  return (
    <section aria-labelledby="itinerary-heading" className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-pink-500/20 rounded-xl">
          <Clock className="w-5 h-5 text-pink-400" aria-hidden="true" />
        </div>
        <div>
          <h2 id="itinerary-heading" className="text-lg font-bold text-white">Hourly Itinerary</h2>
          <p className="text-sm text-slate-400">{itinerary.length} scheduled activities</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-5" aria-label="Itinerary category legend">
        {(Object.keys(CATEGORY_STYLES) as ItineraryItem["category"][]).map((cat) => (
          <span
            key={cat}
            className={`text-xs px-2 py-1 rounded-full border ${CATEGORY_STYLES[cat].badge}`}
          >
            {CATEGORY_ICONS[cat]} {cat}
          </span>
        ))}
      </div>

      {/* Timeline */}
      <ol className="relative pl-6 space-y-0" aria-label="Event timeline">
        {/* Vertical line */}
        <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-white/10" aria-hidden="true" />

        {itinerary.map((item, index) => {
          const styles = CATEGORY_STYLES[item.category];
          return (
            <li key={index} className="relative group">
              {/* Timeline dot */}
              <div
                className={`absolute -left-3.5 mt-4 w-3.5 h-3.5 rounded-full ${styles.dot} shadow-lg ring-2 ring-slate-900 group-hover:scale-125 transition-transform`}
                aria-hidden="true"
              />

              <article className="ml-2 p-4 bg-white/0 hover:bg-white/5 rounded-xl transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-300 font-mono font-bold text-sm bg-purple-500/10 px-2 py-0.5 rounded-lg">
                      {item.time}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${styles.badge}`}>
                      {CATEGORY_ICONS[item.category]} {item.category}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    {item.duration}
                  </span>
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-slate-400 text-xs mb-2 leading-relaxed">{item.description}</p>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <User className="w-3 h-3" aria-hidden="true" />
                  <span>POC: <span className="text-slate-300">{item.poc}</span></span>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
