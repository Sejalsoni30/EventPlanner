import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Plus, Trash2, ExternalLink, CheckCircle2, Circle, Tag, ShoppingBag } from "lucide-react";
import type { Currency } from "../types";
import { formatCurrency } from "../utils/budgetCalculator";

interface GiftItem {
  id: string;
  name: string;
  price: number;
  category: string;
  link: string;
  claimed: boolean;
  claimedBy: string;
  priority: "Must Have" | "Nice to Have" | "Optional";
}

const PRIORITY_CONFIG = {
  "Must Have": { color: "text-rose-400", bg: "bg-rose-500/15 border-rose-500/25" },
  "Nice to Have": { color: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/25" },
  Optional: { color: "text-stone-400", bg: "bg-stone-500/15 border-stone-500/25" },
};

const CATEGORIES = ["Electronics", "Home & Living", "Fashion", "Experiences", "Books & Art", "Travel", "Wellness", "Kitchen", "Other"];

const SAMPLE_ITEMS: GiftItem[] = [
  { id: "g1", name: "Premium Instax Camera", price: 6500, category: "Electronics", link: "", claimed: true, claimedBy: "Priya", priority: "Must Have" },
  { id: "g2", name: "Luxury Scented Candle Set", price: 1800, category: "Home & Living", link: "", claimed: false, claimedBy: "", priority: "Nice to Have" },
  { id: "g3", name: "Goa Trip Voucher", price: 15000, category: "Experiences", link: "", claimed: false, claimedBy: "", priority: "Must Have" },
  { id: "g4", name: "Personalized Photo Book", price: 2200, category: "Books & Art", link: "", claimed: false, claimedBy: "", priority: "Nice to Have" },
];

export default function GiftRegistry({ currency }: { currency: Currency }) {
  const [items, setItems] = useState<GiftItem[]>(SAMPLE_ITEMS);
  const [showForm, setShowForm] = useState(false);
  const [filterClaimed, setFilterClaimed] = useState<"all" | "available" | "claimed">("all");
  const [newItem, setNewItem] = useState<Partial<GiftItem>>({ priority: "Nice to Have", category: "Other" });

  const totalValue = items.reduce((s, i) => s + i.price, 0);
  const claimedValue = items.filter((i) => i.claimed).reduce((s, i) => s + i.price, 0);
  const progress = totalValue > 0 ? Math.round((claimedValue / totalValue) * 100) : 0;

  const toggleClaim = useCallback((id: string) => {
    setItems((prev) => prev.map((item) =>
      item.id === id ? { ...item, claimed: !item.claimed, claimedBy: !item.claimed ? "Guest" : "" } : item
    ));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const addItem = () => {
    if (!newItem.name?.trim()) return;
    setItems((prev) => [...prev, {
      id: crypto.randomUUID(),
      name: newItem.name!,
      price: newItem.price || 0,
      category: newItem.category || "Other",
      link: newItem.link || "",
      claimed: false,
      claimedBy: "",
      priority: newItem.priority as GiftItem["priority"] || "Nice to Have",
    }]);
    setNewItem({ priority: "Nice to Have", category: "Other" });
    setShowForm(false);
  };

  const filtered = items.filter((i) =>
    filterClaimed === "all" ? true : filterClaimed === "claimed" ? i.claimed : !i.claimed
  );

  return (
    <section aria-label="Gift Registry Manager" className="human-card rounded-3xl p-6 sm:p-8 border border-amber-500/15">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-pink-500/15 border border-pink-500/25">
            <Gift className="w-5 h-5 text-pink-400" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-200">Gift Registry</h2>
            <p className="text-xs text-stone-400">{items.filter((i) => i.claimed).length}/{items.length} claimed</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          aria-label="Add gift item"
          className="flex items-center gap-1.5 px-3.5 py-2 bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/30 text-pink-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Gift
        </button>
      </div>

      {/* Progress */}
      <div className="mb-5 p-4 bg-white/5 border border-white/8 rounded-2xl">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-stone-400">Registry Progress</span>
          <span className="text-xs font-bold text-pink-300">{progress}% claimed</span>
        </div>
        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-400"
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-stone-500">Claimed: <span className="text-pink-300 font-bold">{formatCurrency(claimedValue, currency)}</span></span>
          <span className="text-xs text-stone-500">Total: <span className="text-stone-300 font-bold">{formatCurrency(totalValue, currency)}</span></span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {(["all", "available", "claimed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilterClaimed(f)}
            aria-pressed={filterClaimed === f}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border capitalize cursor-pointer transition-all ${
              filterClaimed === f
                ? "bg-pink-500/20 border-pink-500/40 text-pink-300"
                : "bg-white/5 border-white/10 text-stone-400 hover:text-stone-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-stone-200">Add Gift Item</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Gift name *"
                  value={newItem.name || ""}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-pink-500/50"
                  aria-label="Gift item name"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newItem.price || ""}
                  onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-pink-500/50"
                  aria-label="Gift price"
                />
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-pink-500/50"
                  aria-label="Gift category"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                  value={newItem.priority}
                  onChange={(e) => setNewItem({ ...newItem, priority: e.target.value as GiftItem["priority"] })}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-pink-500/50"
                  aria-label="Gift priority"
                >
                  <option>Must Have</option>
                  <option>Nice to Have</option>
                  <option>Optional</option>
                </select>
                <input
                  type="url"
                  placeholder="Product link (optional)"
                  value={newItem.link || ""}
                  onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
                  className="sm:col-span-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-pink-500/50"
                  aria-label="Product link"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowForm(false)} className="px-4 py-1.5 text-xs text-stone-400 hover:text-white border border-white/10 rounded-xl cursor-pointer">Cancel</button>
                <button onClick={addItem} className="px-4 py-1.5 text-xs font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30 rounded-xl cursor-pointer hover:bg-pink-500/30 transition-all">Add Gift</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gift List */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        <AnimatePresence>
          {filtered.map((item) => {
            const pCfg = PRIORITY_CONFIG[item.priority];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                  item.claimed ? "bg-white/3 border-white/5 opacity-70" : "bg-white/5 border-white/8"
                }`}
              >
                <button
                  onClick={() => toggleClaim(item.id)}
                  aria-label={item.claimed ? `Mark ${item.name} as available` : `Mark ${item.name} as claimed`}
                  className="cursor-pointer shrink-0 transition-colors"
                >
                  {item.claimed
                    ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    : <Circle className="w-5 h-5 text-stone-500 hover:text-pink-400" />
                  }
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${item.claimed ? "line-through text-stone-500" : "text-stone-200"}`}>
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs text-stone-400 flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5" aria-hidden="true" />
                      {item.category}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md border ${pCfg.bg} ${pCfg.color}`}>{item.priority}</span>
                    {item.claimed && item.claimedBy && (
                      <span className="text-[10px] text-emerald-400">by {item.claimedBy}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-bold text-amber-300">{formatCurrency(item.price, currency)}</span>
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" aria-label="View product" className="text-stone-500 hover:text-stone-200 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`} className="text-stone-600 hover:text-rose-400 transition-colors cursor-pointer p-0.5 rounded-lg hover:bg-rose-500/10">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="text-center py-8">
            <ShoppingBag className="w-8 h-8 text-stone-600 mx-auto mb-2" />
            <p className="text-stone-500 text-sm">No gifts in this view.</p>
          </div>
        )}
      </div>
    </section>
  );
}
