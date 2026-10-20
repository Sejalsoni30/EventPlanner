import { useState } from "react";
import type { GuestMilestone, MilestonePriority, MilestoneStatus } from "../types";
import { filterGuestMilestones, groupMilestonesByStatus } from "../utils/milestoneUtils";
import { CheckSquare, Circle, Clock, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  milestones: GuestMilestone[];
  onUpdate: (milestones: GuestMilestone[]) => void;
}

const STATUS_CONFIG: Record<MilestoneStatus, {
  icon: typeof CheckSquare;
  color: string;
  headerBg: string;
  badge: string;
}> = {
  "To Do": {
    icon: Circle,
    color: "text-slate-400",
    headerBg: "bg-slate-500/20 border-slate-500/30",
    badge: "bg-slate-600 text-slate-200",
  },
  "In Progress": {
    icon: Clock,
    color: "text-amber-400",
    headerBg: "bg-amber-500/20 border-amber-500/30",
    badge: "bg-amber-600 text-amber-100",
  },
  Completed: {
    icon: CheckSquare,
    color: "text-emerald-400",
    headerBg: "bg-emerald-500/20 border-emerald-500/30",
    badge: "bg-emerald-600 text-emerald-100",
  },
};

const PRIORITY_COLORS: Record<MilestonePriority, string> = {
  Critical: "text-red-400 border-red-500/40 bg-red-500/10",
  High: "text-orange-400 border-orange-500/40 bg-orange-500/10",
  Normal: "text-blue-400 border-blue-500/40 bg-blue-500/10",
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

  const filtered = filterGuestMilestones(milestones, { priority: filterPriority });
  const grouped = groupMilestonesByStatus(filtered);

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

  const completedCount = milestones.filter((m) => m.status === "Completed").length;
  const progress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  return (
    <section aria-labelledby="checklist-heading" className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-emerald-500/20 rounded-xl">
          <CheckSquare className="w-5 h-5 text-emerald-400" aria-hidden="true" />
        </div>
        <div>
          <h2 id="checklist-heading" className="text-lg font-bold text-white">RSVP & Checklist Board</h2>
          <p className="text-sm text-slate-400">{completedCount} of {milestones.length} milestones completed</p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Overall Progress</span>
          <span className="text-white font-semibold">{progress}%</span>
        </div>
        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${progress}% milestones completed`}>
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Priority Filter */}
      <div className="flex gap-2 mb-5 flex-wrap" role="group" aria-label="Filter by priority">
        {(["All", "Critical", "High", "Normal"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setFilterPriority(p)}
            aria-pressed={filterPriority === p}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              filterPriority === p
                ? "bg-purple-500/30 text-purple-200 border border-purple-500/50"
                : "bg-white/5 text-slate-400 border border-white/10 hover:border-white/30"
            }`}
          >
            {p === "All" ? "All" : `${PRIORITY_ICONS[p as MilestonePriority]} ${p}`}
          </button>
        ))}
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(STATUS_SEQUENCE).map((status) => {
          const config = STATUS_CONFIG[status];
          const StatusIcon = config.icon;
          const items = grouped[status];

          return (
            <div key={status} className="flex flex-col gap-2">
              {/* Column Header */}
              <div className={`flex items-center justify-between px-3 py-2 rounded-xl border ${config.headerBg}`}>
                <div className="flex items-center gap-1.5">
                  <StatusIcon className={`w-4 h-4 ${config.color}`} aria-hidden="true" />
                  <span className="text-sm font-semibold text-white">{status}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${config.badge}`}>
                  {items.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-2 min-h-20" role="list" aria-label={`${status} milestones`}>
                {items.length === 0 && (
                  <div className="text-center py-6 text-slate-600 text-xs">No items</div>
                )}
                {items.map((m) => {
                  const isExpanded = expandedIds.has(m.id);
                  return (
                    <article
                      key={m.id}
                      role="listitem"
                      className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 transition-all cursor-default"
                      aria-label={`${m.title} — ${m.priority} priority`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-white text-xs font-semibold leading-snug flex-1">{m.title}</h3>
                        <button
                          onClick={() => toggleExpand(m.id)}
                          aria-expanded={isExpanded}
                          aria-label={isExpanded ? "Collapse details" : "Expand details"}
                          className="shrink-0 text-slate-400 hover:text-white transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-2">
                        <button
                          onClick={() => cyclePriority(m.id)}
                          title="Click to cycle priority"
                          className={`text-xs px-2 py-0.5 rounded-full border font-medium transition-all hover:opacity-80 ${PRIORITY_COLORS[m.priority]}`}
                          aria-label={`Priority: ${m.priority}. Click to change.`}
                        >
                          {PRIORITY_ICONS[m.priority]} {m.priority}
                        </button>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-400">
                          {m.category}
                        </span>
                      </div>

                      {isExpanded && (
                        <div className="mt-2 mb-2">
                          <p className="text-slate-400 text-xs leading-relaxed">{m.description}</p>
                          {m.dueDate && (
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" aria-hidden="true" />
                              Due: {new Date(m.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                            </p>
                          )}
                        </div>
                      )}

                      {status !== "Completed" && (
                        <button
                          onClick={() => advanceStatus(m.id)}
                          className="mt-1 text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 focus:outline-none focus:underline"
                          aria-label={`Move "${m.title}" to ${STATUS_SEQUENCE[STATUS_SEQUENCE.indexOf(status) + 1]}`}
                        >
                          <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                          Mark as {STATUS_SEQUENCE[STATUS_SEQUENCE.indexOf(status) + 1]}
                        </button>
                      )}
                    </article>
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
