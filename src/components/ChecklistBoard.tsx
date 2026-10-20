import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import type { GuestMilestone, MilestonePriority, MilestoneStatus } from "../types";
import { filterGuestMilestones, groupMilestonesByStatus } from "../utils/milestoneUtils";
import {
  CheckSquare,
  Circle,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Trophy,
  ArrowRight,
} from "lucide-react";

interface Props {
  milestones: GuestMilestone[];
  onUpdate: (milestones: GuestMilestone[]) => void;
}

const STATUS_CONFIG: Record<
  MilestoneStatus,
  {
    icon: typeof CheckSquare;
    color: string;
    headerBg: string;
    badge: string;
    dot: string;
  }
> = {
  "To Do": {
    icon: Circle,
    color: "text-slate-400",
    headerBg: "bg-slate-500/10 border-slate-500/20 text-slate-300",
    badge: "bg-slate-700/80 text-slate-200 border-slate-600",
    dot: "bg-slate-400",
  },
  "In Progress": {
    icon: Clock,
    color: "text-amber-400",
    headerBg: "bg-amber-500/10 border-amber-500/30 text-amber-200",
    badge: "bg-amber-600/80 text-amber-100 border-amber-500/50",
    dot: "bg-amber-400 shadow-amber-500/50",
  },
  Completed: {
    icon: CheckSquare,
    color: "text-emerald-400",
    headerBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-200",
    badge: "bg-emerald-600/80 text-emerald-100 border-emerald-500/50",
    dot: "bg-emerald-400 shadow-emerald-500/50",
  },
};

const PRIORITY_COLORS: Record<MilestonePriority, string> = {
  Critical: "text-red-300 border-red-500/50 bg-red-500/15 shadow-sm shadow-red-500/20",
  High: "text-orange-300 border-orange-500/50 bg-orange-500/15 shadow-sm shadow-orange-500/20",
  Normal: "text-blue-300 border-blue-500/50 bg-blue-500/15 shadow-sm shadow-blue-500/20",
};

const PRIORITY_ICONS: Record<MilestonePriority, string> = {
  Critical: "🔴",
  High: "🟠",
  Normal: "🔵",
};

const STATUS_SEQUENCE: MilestoneStatus[] = ["To Do", "In Progress", "Completed"];

export default function ChecklistBoard({ milestones, onUpdate }: Props) {
  const [filterPriority, setFilterPriority] = useState<MilestonePriority | "All">("All");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [hasFiredConfetti, setHasFiredConfetti] = useState(false);

  const filtered = filterGuestMilestones(milestones, { priority: filterPriority });
  const grouped = groupMilestonesByStatus(filtered);

  const completedCount = milestones.filter((m) => m.status === "Completed").length;
  const progress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;
  const isAllCompleted = milestones.length > 0 && completedCount === milestones.length;

  useEffect(() => {
    if (isAllCompleted && !hasFiredConfetti) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#a855f7", "#ec4899", "#10b981", "#f59e0b", "#06b6d4"],
        });
        setHasFiredConfetti(true);
      } catch {
        // Safe fallback in test environments
      }
    } else if (!isAllCompleted && hasFiredConfetti) {
      setHasFiredConfetti(false);
    }
  }, [isAllCompleted, hasFiredConfetti]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const advanceStatus = (id: string) => {
    onUpdate(
      milestones.map((m) => {
        if (m.id !== id) return m;
        const idx = STATUS_SEQUENCE.indexOf(m.status);
        const next = STATUS_SEQUENCE[Math.min(idx + 1, STATUS_SEQUENCE.length - 1)];
        return { ...m, status: next };
      })
    );
  };

  const cyclePriority = (id: string) => {
    const priorities: MilestonePriority[] = ["Critical", "High", "Normal"];
    onUpdate(
      milestones.map((m) => {
        if (m.id !== id) return m;
        const idx = priorities.indexOf(m.priority);
        return { ...m, priority: priorities[(idx + 1) % priorities.length] };
      })
    );
  };

  return (
    <section
      aria-labelledby="checklist-heading"
      className="glass-card rounded-3xl p-6 backdrop-blur-xl border border-white/10 shadow-2xl transition-all"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-white/10 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl shadow-lg shadow-emerald-500/20">
            <CheckSquare className="w-5 h-5 text-emerald-400" aria-hidden="true" />
          </div>
          <div>
            <h2 id="checklist-heading" className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              RSVP & Checklist Board
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Kanban Workflow
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {completedCount} of {milestones.length} milestones completed
            </p>
          </div>
        </div>

        {/* Priority Filter Bar */}
        <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label="Filter by priority">
          <span className="text-xs text-slate-400 mr-1 font-medium hidden sm:inline">Priority:</span>
          {(["All", "Critical", "High", "Normal"] as const).map((p) => {
            const isSelected = filterPriority === p;
            return (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                aria-pressed={isSelected}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer ${
                  isSelected
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30 border border-purple-400/40"
                    : "bg-white/5 text-slate-400 border border-white/10 hover:border-white/20 hover:text-white"
                }`}
              >
                {p === "All" ? "All" : `${PRIORITY_ICONS[p as MilestonePriority]} ${p}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Celebratory Completion Banner */}
      <AnimatePresence>
        {isAllCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-purple-500/20 border border-emerald-500/50 shadow-xl shadow-emerald-500/20 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  All Milestones Achieved! 🎉
                </h3>
                <p className="text-xs text-emerald-200/90">
                  Your event checklist is 100% complete and ready for execution.
                </p>
              </div>
            </div>
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse shrink-0 hidden sm:block" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overall Progress Gauge */}
      <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="text-slate-300 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Execution Velocity
          </span>
          <span className="text-white font-bold font-mono text-sm">{progress}%</span>
        </div>
        <div
          className="h-2.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${progress}% milestones completed`}
        >
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-700 shadow-md shadow-emerald-500/30"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATUS_SEQUENCE.map((status) => {
          const config = STATUS_CONFIG[status];
          const StatusIcon = config.icon;
          const items = grouped[status];

          return (
            <div
              key={status}
              className="flex flex-col gap-2.5 bg-black/20 p-3 rounded-2xl border border-white/5"
            >
              {/* Column Header */}
              <div
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border backdrop-blur-sm ${config.headerBg}`}
              >
                <div className="flex items-center gap-2">
                  <StatusIcon className={`w-4 h-4 ${config.color}`} aria-hidden="true" />
                  <span className="text-sm font-bold tracking-tight">{status}</span>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold border ${config.badge}`}>
                  {items.length}
                </span>
              </div>

              {/* Cards Container */}
              <div
                className="space-y-2.5 min-h-[140px]"
                role="list"
                aria-label={`${status} milestones`}
              >
                {items.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-xs border border-dashed border-white/10 rounded-xl">
                    No items in {status}
                  </div>
                )}

                {items.map((m) => {
                  const isExpanded = expandedIds.has(m.id);
                  return (
                    <motion.article
                      key={m.id}
                      layout
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                      role="listitem"
                      className="glass-card-hover rounded-xl p-3.5 border border-white/10 bg-white/5 transition-all cursor-default"
                      aria-label={`${m.title} — ${m.priority} priority`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-white text-xs font-bold leading-snug flex-1 tracking-tight">
                          {m.title}
                        </h3>
                        <button
                          onClick={() => toggleExpand(m.id)}
                          aria-expanded={isExpanded}
                          aria-label={isExpanded ? "Collapse details" : "Expand details"}
                          className="shrink-0 p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors focus:outline-none"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Tag row */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                        <button
                          onClick={() => cyclePriority(m.id)}
                          title="Click to cycle priority"
                          className={`text-[11px] px-2 py-0.5 rounded-full border font-semibold transition-all hover:scale-105 ${PRIORITY_COLORS[m.priority]}`}
                          aria-label={`Priority: ${m.priority}. Click to change.`}
                        >
                          {PRIORITY_ICONS[m.priority]} {m.priority}
                        </button>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                          {m.category}
                        </span>
                      </div>

                      {/* Expandable Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 mb-2 pt-2 border-t border-white/10"
                          >
                            <p className="text-slate-300 text-xs leading-relaxed">{m.description}</p>
                            {m.dueDate && (
                              <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1 font-mono">
                                <Clock className="w-3 h-3 text-purple-400" aria-hidden="true" />
                                Due:{" "}
                                {new Date(m.dueDate).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Advance Status Button */}
                      {status !== "Completed" && (
                        <button
                          onClick={() => advanceStatus(m.id)}
                          className="mt-1 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1.5 focus:outline-none focus:underline"
                          aria-label={`Move "${m.title}" to ${STATUS_SEQUENCE[STATUS_SEQUENCE.indexOf(status) + 1]}`}
                        >
                          <ArrowRight className="w-3 h-3 text-purple-400" aria-hidden="true" />
                          <span>Advance to {STATUS_SEQUENCE[STATUS_SEQUENCE.indexOf(status) + 1]}</span>
                        </button>
                      )}
                    </motion.article>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
