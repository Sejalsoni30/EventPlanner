import type { BudgetDistribution } from "../types";
import { formatCurrency } from "../utils/budgetCalculator";
import { TrendingUp } from "lucide-react";

interface Props {
  distribution: BudgetDistribution;
}

const TIER_COLORS = [
  { bar: "from-violet-500 to-purple-600", badge: "bg-violet-500/20 text-violet-300 border-violet-500/40" },
  { bar: "from-pink-500 to-rose-600", badge: "bg-pink-500/20 text-pink-300 border-pink-500/40" },
  { bar: "from-amber-500 to-orange-500", badge: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
  { bar: "from-cyan-500 to-blue-500", badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" },
  { bar: "from-emerald-500 to-green-600", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
];

export default function BudgetBreakdown({ distribution }: Props) {
  const { tiers, totalBudget, currency } = distribution;

  return (
    <section aria-labelledby="budget-heading" className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-violet-500/20 rounded-xl">
          <TrendingUp className="w-5 h-5 text-violet-400" aria-hidden="true" />
        </div>
        <div>
          <h2 id="budget-heading" className="text-lg font-bold text-white">Smart Budget Allocator</h2>
          <p className="text-sm text-slate-400">
            Total: <span className="text-white font-semibold">{formatCurrency(totalBudget, currency)}</span>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {tiers.map((tier, i) => {
          const colors = TIER_COLORS[i % TIER_COLORS.length];
          return (
            <article
              key={tier.category}
              className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
              aria-label={`${tier.category}: ${formatCurrency(tier.amount, currency)}`}
            >
              <div className="flex items-start justify-between mb-2 gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl" role="img" aria-label={tier.category}>{tier.icon}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{tier.category}</h3>
                    <p className="text-xs text-slate-400 hidden sm:block">{tier.description}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-base font-bold text-white">
                    {formatCurrency(tier.amount, currency)}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${colors.badge}`}>
                    {tier.percentage}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden" role="progressbar" aria-valuenow={tier.percentage} aria-valuemin={0} aria-valuemax={100} aria-label={`${tier.percentage}% allocation`}>
                <div
                  className={`h-full bg-gradient-to-r ${colors.bar} rounded-full transition-all duration-700`}
                  style={{ width: `${tier.percentage}%` }}
                />
              </div>

              {/* Tips */}
              <details className="mt-3 group">
                <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-300 transition-colors select-none list-none flex items-center gap-1">
                  <span className="group-open:hidden">▶</span>
                  <span className="hidden group-open:inline">▼</span>
                  Pro Tips
                </summary>
                <ul className="mt-2 space-y-1" aria-label={`Tips for ${tier.category}`}>
                  {tier.tips.map((tip, j) => (
                    <li key={j} className="flex items-start gap-1.5 text-xs text-slate-400">
                      <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </details>
            </article>
          );
        })}
      </div>

      {/* Summary Bar */}
      <div className="mt-5 pt-4 border-t border-white/10">
        <div className="flex h-4 rounded-full overflow-hidden gap-0.5" aria-label="Budget distribution overview">
          {tiers.map((tier, i) => (
            <div
              key={tier.category}
              className={`bg-gradient-to-r ${TIER_COLORS[i % TIER_COLORS.length].bar} transition-all`}
              style={{ width: `${tier.percentage}%` }}
              title={`${tier.category}: ${tier.percentage}%`}
            />
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">Budget allocation overview (100%)</p>
      </div>
    </section>
  );
}
