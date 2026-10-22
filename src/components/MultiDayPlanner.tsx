import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Plus, ChevronDown, ChevronUp, Clock, Trash2 } from "lucide-react";

interface DayItem {
  id: string;
  time: string;
  title: string;
  description: string;
  category: "Setup" | "Guest" | "Program" | "Catering" | "Break" | "Teardown";
}

interface Day {
  id: string;
  date: string;
  label: string;
  theme: string;
  items: DayItem[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Setup: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  Guest: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Program: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Catering: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Break: "bg-stone-500/20 text-stone-300 border-stone-500/30",
  Teardown: "bg-rose-500/20 text-rose-300 border-rose-500/30",
};

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

function buildDefaultDay(date: string, dayNum: number): Day {
  const labels = ["Day 1 — Arrival & Welcome", "Day 2 — Main Ceremony", "Day 3 — Farewell Brunch"];
  const themes = ["Welcome & Setup", "Grand Celebration", "Farewell & Teardown"];
  const items: DayItem[][] = [
    [
      { id: crypto.randomUUID(), time: "10:00", title: "Guest Check-in", description: "Welcome guests, distribute kits and room keys.", category: "Guest" },
      { id: crypto.randomUUID(), time: "13:00", title: "Welcome Lunch", description: "Informal buffet lunch for all arriving guests.", category: "Catering" },
      { id: crypto.randomUUID(), time: "16:00", title: "Venue Decoration Setup", description: "Decorator crew sets up main hall and stage.", category: "Setup" },
      { id: crypto.randomUUID(), time: "19:00", title: "Welcome Cocktail Evening", description: "Evening cocktails, networking, and welcome address.", category: "Program" },
    ],
    [
      { id: crypto.randomUUID(), time: "08:00", title: "Final Setup & Checks", description: "AV, floral, and lighting final walkthrough.", category: "Setup" },
      { id: crypto.randomUUID(), time: "11:00", title: "Ceremony Begins", description: "Main event ceremony with all guests.", category: "Program" },
      { id: crypto.randomUUID(), time: "14:00", title: "Grand Lunch Banquet", description: "Formal multi-course lunch service.", category: "Catering" },
      { id: crypto.randomUUID(), time: "17:00", title: "Entertainment & Games", description: "Outdoor activities and entertainment.", category: "Program" },
      { id: crypto.randomUUID(), time: "20:00", title: "Gala Dinner & Dance", description: "Grand dinner, speeches, and dance floor.", category: "Catering" },
    ],
    [
      { id: crypto.randomUUID(), time: "09:00", title: "Farewell Brunch", description: "Relaxed brunch for all guests.", category: "Catering" },
      { id: crypto.randomUUID(), time: "11:00", title: "Group Photo & Mementos", description: "Group photographs and gift distribution.", category: "Program" },
      { id: crypto.randomUUID(), time: "13:00", title: "Guest Checkout & Departure", description: "Checkout, luggage assistance, and farewell.", category: "Guest" },
      { id: crypto.randomUUID(), time: "15:00", title: "Venue Teardown", description: "Complete breakdown and vendor handover.", category: "Teardown" },
    ],
  ];

  return {
    id: crypto.randomUUID(),
    date,
    label: labels[dayNum] || `Day ${dayNum + 1}`,
    theme: themes[dayNum] || "Continuation",
    items: items[dayNum] || [],
  };
}

export default function MultiDayPlanner({ startDate }: { startDate: string }) {
  const [days, setDays] = useState<Day[]>(() => [
    buildDefaultDay(startDate, 0),
    buildDefaultDay(addDays(startDate, 1), 1),
    buildDefaultDay(addDays(startDate, 2), 2),
  ]);
  const [expandedDay, setExpandedDay] = useState<string | null>(days[0]?.id);

  const addDay = () => {
    const lastDate = days[days.length - 1]?.date || startDate;
    const next = addDays(lastDate, 1);
    setDays((prev) => [...prev, buildDefaultDay(next, prev.length)]);
  };

  const removeDay = (id: string) => {
    if (days.length <= 1) return;
    setDays((prev) => prev.filter((d) => d.id !== id));
  };

  const addItem = (dayId: string) => {
    setDays((prev) => prev.map((d) =>
      d.id === dayId
        ? { ...d, items: [...d.items, { id: crypto.randomUUID(), time: "12:00", title: "New Activity", description: "Click to edit", category: "Program" }] }
        : d
    ));
  };

  const removeItem = (dayId: string, itemId: string) => {
    setDays((prev) => prev.map((d) =>
      d.id === dayId ? { ...d, items: d.items.filter((i) => i.id !== itemId) } : d
    ));
  };


  return (
    <section aria-label="Multi-day event planner" className="human-card rounded-3xl p-6 sm:p-8 border border-amber-500/15">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-violet-500/15 border border-violet-500/25">
            <CalendarDays className="w-5 h-5 text-violet-400" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-200">Multi-Day Planner</h2>
            <p className="text-xs text-stone-400">{days.length} day event plan</p>
          </div>
        </div>
        <button
          onClick={addDay}
          aria-label="Add another event day"
          className="flex items-center gap-1.5 px-3.5 py-2 bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/30 text-violet-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Day
        </button>
      </div>

      {/* Day progress dots */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {days.map((day, i) => (
          <button
            key={day.id}
            onClick={() => setExpandedDay(expandedDay === day.id ? null : day.id)}
            aria-pressed={expandedDay === day.id}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
              expandedDay === day.id
                ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                : "bg-white/5 border-white/10 text-stone-400 hover:text-stone-200"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${expandedDay === day.id ? "bg-violet-400" : "bg-stone-600"}`} aria-hidden="true" />
            Day {i + 1}
          </button>
        ))}
      </div>

      {/* Day Accordions */}
      <div className="space-y-3">
        <AnimatePresence>
          {days.map((day, i) => {
            const isOpen = expandedDay === day.id;
            const formattedDate = new Date(day.date).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "long", year: "numeric" });

            return (
              <div key={day.id} className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden">
                {/* Day Header */}
                <div className="flex items-center justify-between p-4 gap-3">
                  <button
                    onClick={() => setExpandedDay(isOpen ? null : day.id)}
                    aria-expanded={isOpen}
                    className="flex items-center gap-3 flex-1 text-left cursor-pointer min-w-0"
                  >
                    <div className="w-8 h-8 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-violet-300">{i + 1}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-stone-200 truncate">{day.label}</p>
                      <p className="text-xs text-stone-400">{formattedDate} · {day.items.length} activities</p>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-stone-400 shrink-0 ml-auto" /> : <ChevronDown className="w-4 h-4 text-stone-400 shrink-0 ml-auto" />}
                  </button>
                  {days.length > 1 && (
                    <button
                      onClick={() => removeDay(day.id)}
                      aria-label={`Remove Day ${i + 1}`}
                      className="text-stone-600 hover:text-rose-400 cursor-pointer p-1 rounded-lg hover:bg-rose-500/10 shrink-0 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Day Content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 border-t border-white/8">
                        <div className="space-y-2 mt-3 max-h-72 overflow-y-auto pr-1">
                          {day.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-start gap-3 p-3 bg-white/5 border border-white/8 rounded-xl"
                            >
                              <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                                <Clock className="w-3.5 h-3.5 text-stone-500" aria-hidden="true" />
                                <span className="text-xs font-mono text-stone-400 font-bold">{item.time}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-stone-200 truncate">{item.title}</p>
                                <p className="text-xs text-stone-500 mt-0.5 truncate">{item.description}</p>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-md border ${CATEGORY_COLORS[item.category]}`}>
                                  {item.category}
                                </span>
                                <button
                                  onClick={() => removeItem(day.id, item.id)}
                                  aria-label={`Remove ${item.title}`}
                                  className="text-stone-600 hover:text-rose-400 cursor-pointer p-0.5 rounded transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => addItem(day.id)}
                          aria-label={`Add activity to Day ${i + 1}`}
                          className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 border border-dashed border-white/15 rounded-xl text-xs text-stone-500 hover:text-stone-300 hover:border-white/25 cursor-pointer transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Activity
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
