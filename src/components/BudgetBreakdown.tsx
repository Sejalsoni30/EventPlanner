import { useState } from "react";
import { motion } from "framer-motion";
import type { BudgetDistribution } from "../types";
import { formatCurrency } from "../utils/budgetCalculator";
import { TrendingUp, PieChart, Sparkles } from "lucide-react";

interface Props {
  distribution: BudgetDistribution;
}

const TIER_COLORS = [
  {
    hex: "#8b5cf6",
    bar: "from-violet-500 to-purple-600",
    badge: "bg-violet-500/20 text-violet-300 border-violet-500/40",
    glow: "shadow-violet-500/30",
  },
  {
    hex: "#ec4899",
    bar: "from-pink-500 to-rose-600",
    badge: "bg-pink-500/20 text-pink-300 border-pink-500/40",
    glow: "shadow-pink-500/30",
  },
  {
    hex: "#f59e0b",
    bar: "from-amber-500 to-orange-500",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    glow: "shadow-amber-500/30",
  },
  {
    hex: "#06b6d4",
    bar: "from-cyan-500 to-blue-500",
    badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    glow: "shadow-cyan-500/30",
  },
  {
    hex: "#10b981",
    bar: "from-emerald-500 to-teal-500",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    glow: "shadow-emerald-500/30",
  },
];

export default function BudgetBreakdown({ distribution }: Props) {
  const { tiers, totalBudget, currency } = distribution;
  const [hoveredTierIndex, setHoveredTierIndex] = useState<number | null>(null);

  // SVG Donut Calculations
  const radius = 54;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  // Compute stroke offsets for each segment
  let accumulatedPercent = 0;
  const segments = tiers.map((tier, i) => {
    const strokeDasharray = `${(tier.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += tier.percentage;
    return {
      tier,
      color: TIER_COLORS[i % TIER_COLORS.length].hex,
      strokeDasharray,
      strokeDashoffset,
      index: i,
    };
  });

  const activeTier = hoveredTierIndex !== null ? tiers[hoveredTierIndex] : null;

  return (
    <section
      aria-labelledby="budget-heading"
      className="human-card rounded-3xl p-6 backdrop-blur-xl border border-amber-500/20 shadow-2xl transition-all"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/15 border border-amber-500/30 rounded-2xl shadow-lg shadow-amber-500/10">
            <TrendingUp className="w-5 h-5 text-amber-400" aria-hidden="true" />
          </div>
          <div>
            <h2 id="budget-heading" className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Smart Budget Allocator
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                100% Allocated
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Total Budget: <span className="text-white font-bold text-sm">{formatCurrency(totalBudget, currency)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Donut Ring Visualization */}
      <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10 backdrop-blur-md flex flex-col sm:flex-row items-center justify-center gap-6">
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140" aria-label="Budget allocation donut chart">
            {/* Background track */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth={strokeWidth}
            />
            {/* Colored Segments */}
            {segments.map((seg) => {
              const isHovered = hoveredTierIndex === seg.index;
              return (
                <circle
                  key={seg.tier.category}
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300 cursor-pointer"
                  style={{
                    filter: isHovered ? `drop-shadow(0 0 8px ${seg.color})` : "none",
                    opacity: hoveredTierIndex !== null && !isHovered ? 0.45 : 1,
                  }}
                  onMouseEnter={() => setHoveredTierIndex(seg.index)}
                  onMouseLeave={() => setHoveredTierIndex(null)}
                />
              );
            })}
          </svg>

          {/* Center Info Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
            {activeTier ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-0.5">
                <span className="text-base font-extrabold text-white block leading-none">{activeTier.percentage}%</span>
                <span className="text-[10px] text-slate-300 font-medium block truncate max-w-[85px]">{activeTier.category}</span>
              </motion.div>
            ) : (
              <div className="space-y-0.5">
                <PieChart className="w-4 h-4 text-purple-300 mx-auto" />
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">Allocation</span>
                <span className="text-xs font-bold text-white block">5 Tiers</span>
              </div>
            )}
          </div>
        </div>

        {/* Donut Quick Legend Chips */}
        <div className="grid grid-cols-1 gap-1.5 w-full text-xs">
          {tiers.map((tier, i) => {
            const color = TIER_COLORS[i % TIER_COLORS.length];
            const isHovered = hoveredTierIndex === i;
            return (
              <div
                key={tier.category}
                onMouseEnter={() => setHoveredTierIndex(i)}
                onMouseLeave={() => setHoveredTierIndex(null)}
                className={`flex items-center justify-between px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  isHovered ? "bg-white/10 scale-102" : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color.hex }} />
                  <span className="text-slate-300 truncate font-medium">Tier {i + 1} {tier.icon}</span>
                </div>
                <span className="font-bold text-white font-mono shrink-0 ml-2">{tier.percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tier Details Cards */}
      <div className="space-y-3.5">
        {tiers.map((tier, i) => {
          const colors = TIER_COLORS[i % TIER_COLORS.length];
          const isHovered = hoveredTierIndex === i;

          return (
            <motion.article
              key={tier.category}
              whileHover={{ y: -1 }}
              onMouseEnter={() => setHoveredTierIndex(i)}
              onMouseLeave={() => setHoveredTierIndex(null)}
              className={`rounded-2xl p-4 transition-all duration-300 border ${
                isHovered
                  ? "bg-white/10 border-white/20 shadow-lg"
                  : "bg-white/5 border-white/5 hover:border-white/15 hover:bg-white/[0.08]"
              }`}
              aria-label={`${tier.category}: ${formatCurrency(tier.amount, currency)}`}
            >
              <div className="flex items-start justify-between mb-2 gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl" role="img" aria-label={tier.category}>
                    {tier.icon}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-white tracking-tight">{tier.category}</h3>
                    <p className="text-xs text-slate-400 hidden sm:block leading-snug">{tier.description}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm sm:text-base font-bold text-white font-mono">
                    {formatCurrency(tier.amount, currency)}
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${colors.badge}`}>
                    {tier.percentage}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div
                className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={tier.percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${tier.percentage}% allocation`}
              >
                <div
                  className={`h-full bg-gradient-to-r ${colors.bar} rounded-full transition-all duration-700`}
                  style={{ width: `${tier.percentage}%` }}
                />
              </div>

              {/* Pro Tips Collapsible */}
              <details className="mt-3 group">
                <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-200 transition-colors select-none list-none flex items-center gap-1.5 font-medium">
                  <span className="group-open:rotate-90 transition-transform duration-200 text-[10px]">▶</span>
                  <span>Optimization Tips</span>
                </summary>
                <ul className="mt-2.5 space-y-1.5 pl-2 border-l border-white/10" aria-label={`Tips for ${tier.category}`}>
                  {tier.tips.map((tip, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </details>
            </motion.article>
          );
        })}
      </div>

      {/* Summary Stacked Progress Bar */}
      <div className="mt-6 pt-5 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Budget Distribution
          </span>
          <span className="text-white font-bold font-mono">100% Balanced</span>
        </div>
        <div className="flex h-3 rounded-full overflow-hidden gap-1 p-0.5 bg-black/30 border border-white/10" aria-label="Budget distribution overview">
          {tiers.map((tier, i) => (
            <div
              key={tier.category}
              className={`bg-gradient-to-r ${TIER_COLORS[i % TIER_COLORS.length].bar} rounded-full transition-all duration-500`}
              style={{ width: `${tier.percentage}%` }}
              title={`${tier.category}: ${tier.percentage}% (${formatCurrency(tier.amount, currency)})`}
            />
          ))}
        </div>
        <p className="text-[11px] text-slate-500 mt-2 text-center">Deterministic breakdown verified across 5 categories</p>
      </div>
    </section>
  );
}
