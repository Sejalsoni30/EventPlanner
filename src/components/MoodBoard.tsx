import { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Check, Sparkles, RefreshCw } from "lucide-react";
import type { Theme, EventType } from "../types";

interface ColorSwatch {
  hex: string;
  name: string;
  role: string;
}

interface MoodBoard {
  palette: ColorSwatch[];
  description: string;
  ambiance: string[];
  decor: string[];
  textiles: string[];
  lighting: string[];
}

const MOOD_BOARDS: Record<string, MoodBoard[]> = {
  "Boho Chic": [
    {
      palette: [
        { hex: "#C4956A", name: "Terracotta", role: "Primary" },
        { hex: "#E8D5B0", name: "Sand", role: "Background" },
        { hex: "#8B7355", name: "Warm Brown", role: "Accent" },
        { hex: "#6B8F71", name: "Sage Green", role: "Accent" },
        { hex: "#F5E6C8", name: "Cream", role: "Text" },
      ],
      description: "Earthy warmth meets free-spirited elegance",
      ambiance: ["Macramé wall hangings", "Rattan & wicker furniture", "Vintage rugs & poufs"],
      decor: ["Dried pampas grass", "Wildflower arrangements", "Dream catchers", "Lanterns"],
      textiles: ["Linen drapes", "Embroidered cushions", "Tassel garlands"],
      lighting: ["Edison string lights", "Candle clusters", "Warm fairy lights"],
    },
  ],
  "Minimalist Tech": [
    {
      palette: [
        { hex: "#1A1A2E", name: "Deep Navy", role: "Primary" },
        { hex: "#00F5D4", name: "Neon Teal", role: "Accent" },
        { hex: "#E0E0E0", name: "Platinum", role: "Text" },
        { hex: "#6C63FF", name: "Electric Violet", role: "Highlight" },
        { hex: "#0F3460", name: "Steel Blue", role: "Secondary" },
      ],
      description: "Clean lines, digital precision, futuristic sophistication",
      ambiance: ["LED wall panels", "Geometric sculptures", "Holographic table runners"],
      decor: ["Binary code projections", "Metallic centerpieces", "Digital photo frames"],
      textiles: ["Carbon fiber table covers", "Sleek vinyl runners"],
      lighting: ["Neon RGB strips", "Laser projections", "Smart color-changing bulbs"],
    },
  ],
  "Royal Indian": [
    {
      palette: [
        { hex: "#8B0000", name: "Royal Crimson", role: "Primary" },
        { hex: "#D4AF37", name: "Gold", role: "Accent" },
        { hex: "#1C0A00", name: "Deep Ebony", role: "Background" },
        { hex: "#FF6B35", name: "Saffron", role: "Highlight" },
        { hex: "#F5E6C8", name: "Cream", role: "Text" },
      ],
      description: "Opulent Mughal grandeur with rich cultural splendor",
      ambiance: ["Draped silk canopies", "Carved wooden arches", "Persian carpet flooring"],
      decor: ["Marigold & rose garlands", "Diyas & oil lamps", "Peacock motifs", "Kundan centerpieces"],
      textiles: ["Silk drapes", "Brocade table runners", "Velvet cushions"],
      lighting: ["Hanging brass lanterns", "Candlelit chandeliers", "Colored uplighting"],
    },
  ],
  "Garden Party": [
    {
      palette: [
        { hex: "#7FB77E", name: "Leaf Green", role: "Primary" },
        { hex: "#FFB347", name: "Peach Blossom", role: "Accent" },
        { hex: "#E8F5E9", name: "Mint Dew", role: "Background" },
        { hex: "#FF85A1", name: "Blush Pink", role: "Highlight" },
        { hex: "#FFFDE7", name: "Ivory", role: "Text" },
      ],
      description: "Fresh botanical charm with romantic floral whimsy",
      ambiance: ["Floral arches", "Wooden garden furniture", "Topiary sculptures"],
      decor: ["Seasonal flower arrangements", "Herb pot centerpieces", "Butterfly nets"],
      textiles: ["Floral linen tablecloths", "Lace overlays", "Striped garden umbrellas"],
      lighting: ["Solar fairy lights", "Hanging glass lanterns", "Floral candle wreaths"],
    },
  ],
  "Retro Glam": [
    {
      palette: [
        { hex: "#F5E6BE", name: "Champagne", role: "Primary" },
        { hex: "#C9A951", name: "Vintage Gold", role: "Accent" },
        { hex: "#1B1B2F", name: "Midnight", role: "Background" },
        { hex: "#FF4E6A", name: "Retro Pink", role: "Highlight" },
        { hex: "#FFFFFF", name: "Cream White", role: "Text" },
      ],
      description: "1920s-inspired jazz-age glamour meets Hollywood regency",
      ambiance: ["Art Deco geometric patterns", "Vintage Hollywood mirrors", "Black & gold panels"],
      decor: ["Feather centerpieces", "Vintage phonographs", "Crystal candelabras"],
      textiles: ["Velvet table runners", "Gold sequin overlays", "Satin chair covers"],
      lighting: ["Crystal chandeliers", "Spotlight beams", "Gold candelabras"],
    },
  ],
  "Black Tie Formal": [
    {
      palette: [
        { hex: "#1A1A1A", name: "Jet Black", role: "Primary" },
        { hex: "#D4AF37", name: "Champagne Gold", role: "Accent" },
        { hex: "#F8F8F8", name: "Pure White", role: "Background" },
        { hex: "#C0C0C0", name: "Silver", role: "Highlight" },
        { hex: "#2C2C2C", name: "Charcoal", role: "Secondary" },
      ],
      description: "Timeless monochromatic elegance with gilded sophistication",
      ambiance: ["Floor-length white table linen", "Silver candelabras", "Orchid centerpieces"],
      decor: ["White floral sculptures", "Monogram ice sculptures", "Formal place settings"],
      textiles: ["Organza overlays", "Satin sashes", "Velvet chair covers"],
      lighting: ["Crystal chandeliers", "Warm white uplighting", "Candlelit tables"],
    },
  ],
  "Tropical Paradise": [
    {
      palette: [
        { hex: "#00B4D8", name: "Ocean Blue", role: "Primary" },
        { hex: "#FF6B6B", name: "Hibiscus", role: "Accent" },
        { hex: "#2EC4B6", name: "Turquoise", role: "Highlight" },
        { hex: "#FFE66D", name: "Sunshine", role: "Secondary" },
        { hex: "#FFFFFF", name: "Sand White", role: "Text" },
      ],
      description: "Vibrant island vibes with lush tropical abundance",
      ambiance: ["Palm leaf canopy", "Tiki bar setup", "Bamboo furniture"],
      decor: ["Tropical flower leis", "Pineapple table runners", "Seashell accents"],
      textiles: ["Banana leaf prints", "Woven bamboo mats", "Bright sarong drapes"],
      lighting: ["Tiki torches", "Blue LED water effects", "String lanterns"],
    },
  ],
  Custom: [
    {
      palette: [
        { hex: "#9B5DE5", name: "Electric Purple", role: "Primary" },
        { hex: "#F15BB5", name: "Hot Pink", role: "Accent" },
        { hex: "#FEE440", name: "Vivid Yellow", role: "Highlight" },
        { hex: "#00BBF9", name: "Sky Blue", role: "Secondary" },
        { hex: "#FFFFFF", name: "Pure White", role: "Text" },
      ],
      description: "Bold and eclectic — your vision, your rules",
      ambiance: ["Mixed-era furniture", "Gallery wall of personal photos", "Neon signs"],
      decor: ["DIY centrepieces", "Mixed flora", "Personalized signage"],
      textiles: ["Pattern-mix tablecloths", "Colorful napkins", "Statement runners"],
      lighting: ["Color-wash uplighting", "Neon signs", "Edison festoon bulbs"],
    },
  ],
  // Event type fallbacks
  Birthday: [],
  Wedding: [],
  "Corporate Gala": [],
  "College Fest": [],
  Anniversary: [],
  "Tech Conference": [],
};

// Extra boards for event types
const EVENT_TYPE_BOARDS: Record<string, MoodBoard> = {
  Wedding: {
    palette: [
      { hex: "#FAF0E6", name: "Linen", role: "Primary" },
      { hex: "#D4AF37", name: "Gold", role: "Accent" },
      { hex: "#C8A2C8", name: "Lilac", role: "Highlight" },
      { hex: "#FFFFFF", name: "Pearl White", role: "Background" },
      { hex: "#8B6914", name: "Antique Gold", role: "Secondary" },
    ],
    description: "Romantic ivory & gold — eternally classic",
    ambiance: ["White silk draping", "Floral mandap", "Crystal centrepieces"],
    decor: ["White rose cascades", "Floating candles", "Gold charger plates"],
    textiles: ["Organza overlays", "Lace table runners", "Silk chair sashes"],
    lighting: ["Fairy light canopy", "Warm pin spots", "Lantern walkway"],
  },
  Birthday: {
    palette: [
      { hex: "#FF6B6B", name: "Party Red", role: "Primary" },
      { hex: "#FFE66D", name: "Confetti Yellow", role: "Accent" },
      { hex: "#4ECDC4", name: "Mint Teal", role: "Highlight" },
      { hex: "#1A1A2E", name: "Midnight", role: "Background" },
      { hex: "#FFFFFF", name: "White", role: "Text" },
    ],
    description: "Festive, vibrant, and full of joyful energy",
    ambiance: ["Balloon arch walls", "Photo booth setup", "Streamer canopy"],
    decor: ["Custom cake stand", "Confetti table scatter", "Birthday banners"],
    textiles: ["Colorful table runners", "Mylar balloon clusters"],
    lighting: ["Disco ball effect", "Neon name sign", "Colored spotlights"],
  },
  "Corporate Gala": {
    palette: [
      { hex: "#1C1C1E", name: "Carbon", role: "Primary" },
      { hex: "#0A84FF", name: "Corporate Blue", role: "Accent" },
      { hex: "#AFAFAF", name: "Slate", role: "Highlight" },
      { hex: "#D4AF37", name: "Gold", role: "Secondary" },
      { hex: "#FFFFFF", name: "White", role: "Text" },
    ],
    description: "Sleek corporate prestige with premium gold accents",
    ambiance: ["Backlit company logo", "Registration kiosks", "Branded backdrop"],
    decor: ["White orchid centerpieces", "Crystal awards display", "Brand merchandise"],
    textiles: ["Midnight blue table linen", "Silver chair covers"],
    lighting: ["Gobo logo projections", "Blue & gold uplighting", "Stage spot"],
  },
};

function CopiedHex({ hex, name, role }: ColorSwatch) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={copy}
      aria-label={`Copy ${name} color ${hex}`}
      className="flex flex-col items-center gap-2 cursor-pointer group"
    >
      <div
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shadow-lg border-2 border-white/10 group-hover:border-white/30 transition-all relative"
        style={{ backgroundColor: hex }}
      >
        {copied && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
      <div className="text-center">
        <p className="text-[10px] font-bold text-stone-300">{name}</p>
        <p className="text-[9px] text-stone-500 font-mono">{hex}</p>
        <p className="text-[9px] text-stone-600 uppercase tracking-wide">{role}</p>
      </div>
    </motion.button>
  );
}

export default function MoodBoard({ theme, eventType }: { theme: Theme; eventType: EventType }) {
  const boards = [
    ...(MOOD_BOARDS[theme] || MOOD_BOARDS.Custom),
    ...(EVENT_TYPE_BOARDS[eventType] ? [EVENT_TYPE_BOARDS[eventType]] : []),
  ];

  const [idx, setIdx] = useState(0);
  const board = boards[idx] || boards[0];

  const cycle = () => setIdx((i) => (i + 1) % boards.length);

  return (
    <section aria-label="Color palette and mood board" className="human-card rounded-3xl p-6 sm:p-8 border border-amber-500/15 relative overflow-hidden">
      {/* Ambient color wash from palette primary */}
      <div
        className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-[90px] opacity-20 pointer-events-none"
        style={{ backgroundColor: board.palette[0]?.hex }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/25">
              <Palette className="w-5 h-5 text-purple-400" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-200">Decor Mood Board</h2>
              <p className="text-xs text-stone-400">{theme} · {eventType}</p>
            </div>
          </div>
          {boards.length > 1 && (
            <button
              onClick={cycle}
              aria-label="Cycle to next color board"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-300 hover:text-white border border-white/10 hover:border-white/25 rounded-xl cursor-pointer transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Next Board
            </button>
          )}
        </div>

        {/* Description */}
        <div className="mb-5 p-3.5 bg-white/5 rounded-2xl border border-white/8">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Vibe</span>
          </div>
          <p className="text-sm text-stone-300 italic">{board.description}</p>
        </div>

        {/* Color Swatches */}
        <div className="flex items-start justify-center gap-3 sm:gap-4 mb-6 flex-wrap">
          {board.palette.map((swatch) => (
            <CopiedHex key={swatch.hex} {...swatch} />
          ))}
        </div>

        {/* Gradient Preview */}
        <div
          className="h-10 rounded-2xl mb-6 shadow-inner"
          style={{
            background: `linear-gradient(135deg, ${board.palette.map((s) => s.hex).join(", ")})`,
          }}
          aria-label="Color gradient preview"
        />

        {/* Decor Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "🏛️ Ambiance", items: board.ambiance },
            { label: "🌸 Décor", items: board.decor },
            { label: "🧶 Textiles", items: board.textiles },
            { label: "💡 Lighting", items: board.lighting },
          ].map(({ label, items }) => (
            <div key={label} className="bg-white/5 border border-white/8 rounded-2xl p-3.5">
              <p className="text-xs font-bold text-stone-300 mb-2">{label}</p>
              <ul className="space-y-1">
                {items.map((item, i) => (
                  <li key={i} className="text-xs text-stone-400 flex items-start gap-1.5">
                    <span className="text-amber-500/60 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
