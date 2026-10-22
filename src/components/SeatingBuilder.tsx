import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Armchair, Plus, Trash2, Edit3, Check, X, RotateCcw } from "lucide-react";

interface Seat {
  id: string;
  guestName: string;
}

interface Table {
  id: string;
  name: string;
  capacity: number;
  shape: "round" | "rectangle";
  seats: Seat[];
  color: string;
}

const TABLE_COLORS = [
  "border-amber-500/50 bg-amber-500/10",
  "border-sky-500/50 bg-sky-500/10",
  "border-emerald-500/50 bg-emerald-500/10",
  "border-rose-500/50 bg-rose-500/10",
  "border-purple-500/50 bg-purple-500/10",
  "border-cyan-500/50 bg-cyan-500/10",
];

const TABLE_COLORS_DOT = ["bg-amber-500", "bg-sky-500", "bg-emerald-500", "bg-rose-500", "bg-purple-500", "bg-cyan-500"];

function createTable(idx: number, capacity = 8, shape: "round" | "rectangle" = "round"): Table {
  return {
    id: crypto.randomUUID(),
    name: `Table ${idx + 1}`,
    capacity,
    shape,
    color: String(idx % TABLE_COLORS.length),
    seats: Array.from({ length: capacity }, () => ({ id: crypto.randomUUID(), guestName: "" })),
  };
}

const SAMPLE_TABLES: Table[] = [
  { ...createTable(0, 8, "round"), name: "Head Table", seats: Array.from({ length: 8 }, (_, i) => ({ id: crypto.randomUUID(), guestName: ["Bride & Groom", "Best Man", "Maid of Honor", "Father of Bride", "Mother of Bride", "Father of Groom", "Mother of Groom", ""][i] })) },
  { ...createTable(1, 6, "rectangle"), name: "Family Table", seats: Array.from({ length: 6 }, (_, i) => ({ id: crypto.randomUUID(), guestName: ["Rohan M.", "Anjali M.", "Priya S.", "", "", ""][i] })) },
  { ...createTable(2, 8, "round"), name: "Friends Zone", seats: Array.from({ length: 8 }, () => ({ id: crypto.randomUUID(), guestName: "" })) },
];

interface TableCardProps {
  table: Table;
  onUpdateSeat: (tableId: string, seatId: string, name: string) => void;
  onDelete: (tableId: string) => void;
  onRenameTable: (tableId: string, name: string) => void;
}

function TableCard({ table, onUpdateSeat, onDelete, onRenameTable }: TableCardProps) {
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(table.name);
  const [editingSeat, setEditingSeat] = useState<string | null>(null);
  const [seatTemp, setSeatTemp] = useState("");
  const colorClass = TABLE_COLORS[Number(table.color)] || TABLE_COLORS[0];
  const dotColor = TABLE_COLORS_DOT[Number(table.color)] || TABLE_COLORS_DOT[0];
  const filled = table.seats.filter((s) => s.guestName.trim()).length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`rounded-2xl border-2 p-4 bg-white/4 ${colorClass} relative`}
    >
      {/* Table header */}
      <div className="flex items-center justify-between mb-3">
        {editingName ? (
          <div className="flex items-center gap-1.5 flex-1">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="bg-white/10 border border-white/15 rounded-lg px-2 py-1 text-sm text-stone-200 flex-1 focus:outline-none"
              autoFocus
              aria-label="Table name"
            />
            <button onClick={() => { onRenameTable(table.id, tempName); setEditingName(false); }} className="text-emerald-400 cursor-pointer"><Check className="w-4 h-4" /></button>
            <button onClick={() => setEditingName(false)} className="text-stone-500 cursor-pointer"><X className="w-4 h-4" /></button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`} aria-hidden="true" />
            <span className="text-sm font-bold text-stone-200">{table.name}</span>
            <button onClick={() => { setTempName(table.name); setEditingName(true); }} aria-label={`Rename ${table.name}`} className="text-stone-500 hover:text-stone-200 cursor-pointer p-0.5">
              <Edit3 className="w-3 h-3" />
            </button>
          </div>
        )}
        <div className="flex items-center gap-1.5 ml-auto pl-2">
          <span className="text-xs text-stone-400">{filled}/{table.capacity}</span>
          <button onClick={() => onDelete(table.id)} aria-label={`Delete ${table.name}`} className="text-stone-600 hover:text-rose-400 cursor-pointer p-0.5 rounded-lg hover:bg-rose-500/10 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Shape badge */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-stone-400 border border-white/10 capitalize">{table.shape}</span>
        <span className="text-[10px] text-stone-500">{table.capacity} seats</span>
      </div>

      {/* Seats grid */}
      <div className="grid grid-cols-2 gap-1.5">
        {table.seats.map((seat, i) => (
          <div key={seat.id}>
            {editingSeat === seat.id ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={seatTemp}
                  onChange={(e) => setSeatTemp(e.target.value)}
                  onBlur={() => { onUpdateSeat(table.id, seat.id, seatTemp); setEditingSeat(null); }}
                  onKeyDown={(e) => { if (e.key === "Enter") { onUpdateSeat(table.id, seat.id, seatTemp); setEditingSeat(null); } }}
                  placeholder="Guest name"
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-xs text-stone-200 placeholder-stone-600 focus:outline-none min-w-0"
                  autoFocus
                  aria-label={`Seat ${i + 1} guest name`}
                />
              </div>
            ) : (
              <button
                onClick={() => { setSeatTemp(seat.guestName); setEditingSeat(seat.id); }}
                aria-label={seat.guestName ? `Seat ${i + 1}: ${seat.guestName}. Click to edit.` : `Seat ${i + 1} is empty. Click to assign guest.`}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer border truncate ${
                  seat.guestName
                    ? "bg-white/10 border-white/15 text-stone-300 hover:bg-white/15"
                    : "bg-white/5 border-dashed border-white/10 text-stone-600 hover:border-white/20 hover:text-stone-400"
                }`}
              >
                {seat.guestName || `Seat ${i + 1}`}
              </button>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function SeatingBuilder({ totalGuests }: { totalGuests: number }) {
  const [tables, setTables] = useState<Table[]>(SAMPLE_TABLES);
  const [newShape, setNewShape] = useState<"round" | "rectangle">("round");
  const [newCap, setNewCap] = useState(8);

  const totalSeats = tables.reduce((s, t) => s + t.capacity, 0);
  const filledSeats = tables.reduce((s, t) => s + t.seats.filter((seat) => seat.guestName.trim()).length, 0);

  const addTable = () => {
    setTables((prev) => [...prev, createTable(prev.length, newCap, newShape)]);
  };

  const deleteTable = useCallback((id: string) => {
    setTables((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateSeat = useCallback((tableId: string, seatId: string, name: string) => {
    setTables((prev) => prev.map((t) =>
      t.id === tableId
        ? { ...t, seats: t.seats.map((s) => s.id === seatId ? { ...s, guestName: name } : s) }
        : t
    ));
  }, []);

  const renameTable = useCallback((tableId: string, name: string) => {
    setTables((prev) => prev.map((t) => t.id === tableId ? { ...t, name } : t));
  }, []);

  const clearAll = () => {
    setTables((prev) => prev.map((t) => ({ ...t, seats: t.seats.map((s) => ({ ...s, guestName: "" })) })));
  };

  return (
    <section aria-label="Seating Arrangement Builder" className="human-card rounded-3xl p-6 sm:p-8 border border-amber-500/15">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/25">
            <Armchair className="w-5 h-5 text-indigo-400" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-200">Seating Arrangement</h2>
            <p className="text-xs text-stone-400">{filledSeats}/{totalSeats} seats filled · {tables.length} tables</p>
          </div>
        </div>
        <button
          onClick={clearAll}
          aria-label="Clear all seat assignments"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-400 hover:text-white border border-white/10 hover:border-white/20 rounded-xl cursor-pointer transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear All
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="text-center p-3 bg-white/5 rounded-2xl border border-white/8">
          <p className="text-xl font-bold font-cinzel text-indigo-300">{tables.length}</p>
          <p className="text-[11px] text-stone-400 uppercase tracking-wider mt-0.5">Tables</p>
        </div>
        <div className="text-center p-3 bg-white/5 rounded-2xl border border-white/8">
          <p className="text-xl font-bold font-cinzel text-amber-300">{totalSeats}</p>
          <p className="text-[11px] text-stone-400 uppercase tracking-wider mt-0.5">Total Seats</p>
        </div>
        <div className="text-center p-3 bg-white/5 rounded-2xl border border-white/8">
          <p className={`text-xl font-bold font-cinzel ${totalSeats >= totalGuests ? "text-emerald-300" : "text-rose-400"}`}>{totalSeats - filledSeats}</p>
          <p className="text-[11px] text-stone-400 uppercase tracking-wider mt-0.5">Available</p>
        </div>
      </div>

      {/* Add Table Controls */}
      <div className="flex items-center gap-2.5 mb-5 p-4 bg-white/5 border border-white/8 rounded-2xl flex-wrap">
        <span className="text-xs font-bold text-stone-300 whitespace-nowrap">Add Table:</span>
        <select
          value={newShape}
          onChange={(e) => setNewShape(e.target.value as "round" | "rectangle")}
          className="bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-stone-300 focus:outline-none cursor-pointer"
          aria-label="Table shape"
        >
          <option value="round">🔵 Round</option>
          <option value="rectangle">🟦 Rectangle</option>
        </select>
        <select
          value={newCap}
          onChange={(e) => setNewCap(Number(e.target.value))}
          className="bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-stone-300 focus:outline-none cursor-pointer"
          aria-label="Table capacity"
        >
          {[4, 6, 8, 10, 12].map((n) => (
            <option key={n} value={n}>{n} seats</option>
          ))}
        </select>
        <button
          onClick={addTable}
          aria-label="Add new table"
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs font-bold cursor-pointer transition-all ml-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Table
        </button>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[560px] overflow-y-auto pr-1">
        <AnimatePresence>
          {tables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              onUpdateSeat={updateSeat}
              onDelete={deleteTable}
              onRenameTable={renameTable}
            />
          ))}
        </AnimatePresence>
      </div>

      {totalSeats < totalGuests && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl"
        >
          <span className="text-amber-400 text-sm">⚠️</span>
          <p className="text-xs text-amber-200">
            You need <span className="font-bold">{totalGuests - totalSeats} more seats</span> for all {totalGuests} guests.
          </p>
        </motion.div>
      )}
    </section>
  );
}
