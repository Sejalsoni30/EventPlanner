import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, Trash2, CheckCircle2, Clock, XCircle } from "lucide-react";

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "Confirmed" | "Declined" | "Pending";
  plusOne: boolean;
  dietary: string;
}

const STATUS_CONFIG = {
  Confirmed: { label: "Confirmed", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/15 border-emerald-500/30", dot: "bg-emerald-400" },
  Declined: { label: "Declined", icon: XCircle, color: "text-rose-400", bg: "bg-rose-500/15 border-rose-400/30", dot: "bg-rose-400" },
  Pending: { label: "Pending", icon: Clock, color: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/30", dot: "bg-amber-400" },
};

function newGuest(): Guest {
  return {
    id: crypto.randomUUID(),
    name: "",
    email: "",
    phone: "",
    status: "Pending",
    plusOne: false,
    dietary: "",
  };
}

export default function RSVPTracker({ guestCount }: { guestCount: number }) {
  const [guests, setGuests] = useState<Guest[]>(() =>
    Array.from({ length: Math.min(5, guestCount) }, (_, i) => ({
      id: crypto.randomUUID(),
      name: ["Priya Sharma", "Rohan Mehta", "Anjali Verma", "Vikram Singh", "Neha Patel"][i] || "",
      email: "",
      phone: "",
      status: (["Confirmed", "Pending", "Confirmed", "Declined", "Pending"] as const)[i],
      plusOne: i % 2 === 0,
      dietary: ["Vegetarian", "", "Vegan", "Non-Veg", ""][i],
    }))
  );
  const [filter, setFilter] = useState<"All" | "Confirmed" | "Declined" | "Pending">("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newG, setNewG] = useState<Guest>(newGuest);

  const stats = {
    total: guests.length,
    confirmed: guests.filter((g) => g.status === "Confirmed").length,
    declined: guests.filter((g) => g.status === "Declined").length,
    pending: guests.filter((g) => g.status === "Pending").length,
    attending: guests.filter((g) => g.status === "Confirmed").reduce((s, g) => s + 1 + (g.plusOne ? 1 : 0), 0),
  };

  const filtered = guests.filter((g) => filter === "All" || g.status === filter);

  const updateGuest = useCallback((id: string, patch: Partial<Guest>) => {
    setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  }, []);

  const deleteGuest = useCallback((id: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const addGuest = () => {
    if (!newG.name.trim()) return;
    setGuests((prev) => [...prev, { ...newG, id: crypto.randomUUID() }]);
    setNewG(newGuest());
    setShowAddForm(false);
  };

  const responseRate = stats.total > 0 ? Math.round(((stats.confirmed + stats.declined) / stats.total) * 100) : 0;

  return (
    <section aria-label="Guest RSVP Tracker" className="human-card rounded-3xl p-6 sm:p-8 border border-amber-500/15">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/25">
            <Users className="w-5 h-5 text-emerald-400" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-200">Guest RSVP Tracker</h2>
            <p className="text-xs text-stone-400">{stats.attending} attending · {responseRate}% responded</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          aria-label="Add new guest"
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Guest
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {(["Confirmed", "Pending", "Declined"] as const).map((s) => {
          const cfg = STATUS_CONFIG[s];
          const count = stats[s.toLowerCase() as "confirmed" | "pending" | "declined"];
          return (
            <button
              key={s}
              onClick={() => setFilter(filter === s ? "All" : s)}
              aria-pressed={filter === s}
              className={`p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                filter === s ? cfg.bg + " scale-[1.03]" : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <p className={`text-2xl font-bold font-cinzel ${cfg.color}`}>{count}</p>
              <p className="text-[11px] text-stone-400 uppercase tracking-wider mt-0.5">{s}</p>
            </button>
          );
        })}
      </div>

      {/* Response Rate Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-stone-400 mb-1.5">
          <span>Response Rate</span>
          <span className="font-bold text-amber-300">{responseRate}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${responseRate}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-400"
          />
        </div>
      </div>

      {/* Add Guest Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-stone-200">Add New Guest</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={newG.name}
                  onChange={(e) => setNewG({ ...newG, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
                  aria-label="Guest full name"
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={newG.email}
                  onChange={(e) => setNewG({ ...newG, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
                  aria-label="Guest email"
                />
                <input
                  type="text"
                  placeholder="Dietary (e.g. Vegan)"
                  value={newG.dietary}
                  onChange={(e) => setNewG({ ...newG, dietary: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
                  aria-label="Dietary preference"
                />
                <div className="flex items-center gap-3">
                  <select
                    value={newG.status}
                    onChange={(e) => setNewG({ ...newG, status: e.target.value as Guest["status"] })}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-500/50"
                    aria-label="RSVP status"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Declined">Declined</option>
                  </select>
                  <label className="flex items-center gap-1.5 text-xs text-stone-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newG.plusOne}
                      onChange={(e) => setNewG({ ...newG, plusOne: e.target.checked })}
                      className="w-4 h-4 accent-amber-500"
                      aria-label="Plus one"
                    />
                    +1
                  </label>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-1.5 text-xs text-stone-400 hover:text-white border border-white/10 hover:border-white/20 rounded-xl cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={addGuest}
                  className="px-4 py-1.5 text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-xl cursor-pointer transition-all"
                >
                  Add Guest
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guest List */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        <AnimatePresence>
          {filtered.map((guest) => {
            const cfg = STATUS_CONFIG[guest.status];
            return (
              <motion.div
                key={guest.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3 p-3 bg-white/5 border border-white/8 rounded-2xl hover:bg-white/8 transition-all"
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-200 truncate">
                    {guest.name || "—"}
                    {guest.plusOne && <span className="ml-1.5 text-xs text-amber-400/70">+1</span>}
                  </p>
                  {guest.dietary && (
                    <p className="text-[11px] text-stone-500">{guest.dietary}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={guest.status}
                    onChange={(e) => updateGuest(guest.id, { status: e.target.value as Guest["status"] })}
                    className={`text-[11px] font-bold border rounded-lg px-2 py-1 cursor-pointer focus:outline-none ${cfg.bg} ${cfg.color}`}
                    aria-label={`RSVP status for ${guest.name}`}
                    style={{ background: "transparent" }}
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Declined">Declined</option>
                  </select>
                  <button
                    onClick={() => deleteGuest(guest.id)}
                    aria-label={`Remove ${guest.name}`}
                    className="p-1 text-stone-600 hover:text-rose-400 transition-colors cursor-pointer rounded-lg hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="text-center py-8 text-stone-500 text-sm">
            No guests in this category.
          </div>
        )}
      </div>

      <p className="text-xs text-stone-500 text-center mt-4 font-sans">
        Total attending: <span className="text-amber-300 font-bold">{stats.attending}</span> guests
        {guests.some((g) => g.plusOne) && ` (incl. plus-ones)`}
      </p>
    </section>
  );
}
