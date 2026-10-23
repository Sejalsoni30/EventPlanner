import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { CelebrateLogo } from "./CelebrateLogo";
import { ThemeToggle } from "./ThemeToggle";
import {
  Sparkles, ArrowRight, Star, Zap, Shield, Users, Calendar,
  Palette, BarChart3, MapPin, MessageSquare, Gift,
  ChevronDown, Play, Check, ArrowUp,
} from "lucide-react";

import confetti from "canvas-confetti";
import type { EventType } from "../types";

interface Props {
  onGetStarted: (eventType?: EventType) => void;
}

// ─── FLOATING PARTICLE SYSTEM ───────────────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.5 + 0.1,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(212,175,55,${p.opacity}) 0%, transparent 70%)`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [p.opacity, p.opacity * 1.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── ANIMATED COUNTER ────────────────────────────────────────────────────────
function AnimatedCounter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setStarted(true);
      return;
    }
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) setStarted(true);
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const increment = to / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= to) { setCount(to); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 30);
    return () => clearInterval(timer);
  }, [started, to]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── FEATURE CARDS DATA ───────────────────────────────────────────────────────
const FEATURES = [
  { icon: BarChart3, label: "Smart Budget AI", desc: "Intelligent 5-tier budget distribution with per-head analytics and savings tips", color: "from-amber-500/20 to-orange-600/10", border: "border-amber-500/25", iconColor: "text-amber-400", glow: "rgba(245,158,11,0.15)" },
  { icon: Calendar, label: "Hourly Itinerary", desc: "AI-crafted minute-by-minute event timeline with role assignments", color: "from-purple-500/20 to-indigo-600/10", border: "border-purple-500/25", iconColor: "text-purple-400", glow: "rgba(139,92,246,0.15)" },
  { icon: Users, label: "RSVP Tracker", desc: "Real-time guest management with dietary preferences and +1 tracking", color: "from-emerald-500/20 to-teal-600/10", border: "border-emerald-500/25", iconColor: "text-emerald-400", glow: "rgba(16,185,129,0.15)" },
  { icon: Palette, label: "Mood Board Studio", desc: "Curated color palettes and decor themes per event type and vibe", color: "from-pink-500/20 to-rose-600/10", border: "border-pink-500/25", iconColor: "text-pink-400", glow: "rgba(236,72,153,0.15)" },
  { icon: MapPin, label: "Venue Map", desc: "Integrated location finder and interactive map embedding", color: "from-cyan-500/20 to-sky-600/10", border: "border-cyan-500/25", iconColor: "text-cyan-400", glow: "rgba(6,182,212,0.15)" },
  { icon: MessageSquare, label: "Invite Sender", desc: "WhatsApp, SMS and Email templates with one-click bulk blast", color: "from-green-500/20 to-emerald-600/10", border: "border-green-500/25", iconColor: "text-green-400", glow: "rgba(34,197,94,0.15)" },
  { icon: Gift, label: "Gift Registry", desc: "Create & track gift wishlists with claim status and price tags", color: "from-rose-500/20 to-pink-600/10", border: "border-rose-500/25", iconColor: "text-rose-400", glow: "rgba(244,63,94,0.15)" },
  { icon: Shield, label: "Seating Planner", desc: "Drag-assign seats across round and rectangle tables with capacity alerts", color: "from-indigo-500/20 to-blue-600/10", border: "border-indigo-500/25", iconColor: "text-indigo-400", glow: "rgba(99,102,241,0.15)" },
];

// ─── EVENT TYPE SHOWCASE ──────────────────────────────────────────────────────
const EVENT_TYPES = [
  { emoji: "💍", label: "Wedding", color: "#d4af37", tagline: "Royal Heritage & Vows", badge: "Popular", guests: "100–1,000+ Guests" },
  { emoji: "🎂", label: "Birthday", color: "#f59e0b", tagline: "Milestone Bashes & Fun", badge: "Trending", guests: "20–250+ Guests" },
  { emoji: "🏆", label: "Corporate Gala", color: "#3b82f6", tagline: "Summits & Award Nights", badge: "Enterprise", guests: "100–2,500+ Guests" },
  { emoji: "🎓", label: "College Fest", color: "#f97316", tagline: "Campus Beats & Cultural", badge: "Campus", guests: "500–10,000+ Guests" },
  { emoji: "🥂", label: "Anniversary", color: "#10b981", tagline: "Romance & Milestone Feasts", badge: "Bespoke", guests: "30–300+ Guests" },
  { emoji: "💻", label: "Tech Conference", color: "#06b6d4", tagline: "Keynotes & Hackathons", badge: "Flagship", guests: "150–5,000+ Guests" },
];

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Priya Mehta", role: "Wedding Planner, Mumbai", quote: "CelebrateAI saved me 40 hours of work. The budget breakdown and itinerary were spot-on for a 400-guest wedding.", stars: 5, avatar: "PM" },
  { name: "Rohan Kapoor", role: "Corporate Events Head, Delhi", quote: "The vendor scripts alone are worth it. Professional, polished, and perfectly themed for our annual gala.", stars: 5, avatar: "RK" },
  { name: "Aarav Singh", role: "Student Event Lead, IIT Bombay", quote: "Ran our entire college fest from this dashboard. The checklist Kanban board kept 20 coordinators aligned!", stars: 5, avatar: "AS" },
];

// ─── STATS ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: 10000, suffix: "+", label: "Events Planned" },
  { value: 98, suffix: "%", label: "Satisfaction Rate" },
  { value: 40, suffix: "hrs", label: "Avg Time Saved" },
  { value: 6, suffix: " Types", label: "Event Categories" },
];

export default function LandingPage({ onGetStarted }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const [activeEventType, setActiveEventType] = useState(0);
  const [showVideoPlaceholder, setShowVideoPlaceholder] = useState(false);

  // Auto-cycle event types
  useEffect(() => {
    const id = setInterval(() => setActiveEventType((i) => (i + 1) % EVENT_TYPES.length), 2500);
    return () => clearInterval(id);
  }, []);

  const current = EVENT_TYPES[activeEventType];

  const handleLaunch = (eventType?: EventType) => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#d4af37", "#f59e0b", "#fbbf24", "#ffffff", "#10b981", "#38bdf8"],
      });
    } catch {
      // Non-blocking fallback
    }
    setTimeout(() => {
      onGetStarted(eventType);
    }, 250);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#080a0f] text-stone-100 overflow-x-hidden">
      <Particles />

      {/* ─── GIANT AMBIENT GLOWS ──────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full blur-[200px] opacity-20"
          style={{ background: "radial-gradient(circle, rgba(212,175,55,0.6) 0%, rgba(184,134,11,0.3) 40%, transparent 70%)" }} />
        <div className="absolute top-[60vh] -right-64 w-[600px] h-[600px] rounded-full blur-[160px] opacity-15"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.7) 0%, transparent 70%)" }} />
        <div className="absolute top-[120vh] -left-64 w-[500px] h-[500px] rounded-full blur-[140px] opacity-15"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.6) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(212,175,55,0.025)_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      {/* ─── NAVBAR ──────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 py-4 human-card border-b border-white/10"
        aria-label="Main navigation">
        <div className="flex items-center gap-2.5">
          <CelebrateLogo size={32} />
          <span className="font-editorial font-bold text-lg bg-gradient-to-r from-stone-100 via-amber-100 to-amber-300 bg-clip-text text-transparent">
            CelebrateAI
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-stone-400">
          <a href="#features" className="hover:text-amber-300 transition-colors">Features</a>
          <a href="#events" className="hover:text-amber-300 transition-colors">Event Types</a>
          <a href="#testimonials" className="hover:text-amber-300 transition-colors">Reviews</a>
        </div>
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleLaunch()}
            id="nav-get-started-btn"
            aria-label="Start planning your event"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-bold rounded-xl text-sm shadow-lg shadow-amber-600/25 cursor-pointer transition-all"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            Start Planning
          </motion.button>
        </div>
      </nav>

      {/* ─── HERO SECTION ────────────────────────────────────────────────── */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20"
        aria-label="Hero section"
      >
        {/* Live event type badge */}
        <motion.div
          key={activeEventType}
          initial={{ opacity: 0, y: -12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-sm font-semibold"
          style={{
            background: `rgba(${current.color === "#d4af37" ? "212,175,55" : current.color === "#f59e0b" ? "245,158,11" : current.color === "#3b82f6" ? "59,130,246" : current.color === "#f97316" ? "249,115,22" : current.color === "#10b981" ? "16,185,129" : "6,182,212"},0.12)`,
            borderColor: `${current.color}40`,
            color: current.color,
          }}
        >
          <span className="text-lg">{current.emoji}</span>
          <span>Now planning: {current.label}</span>
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: current.color }}
          />
        </motion.div>

        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-editorial font-bold leading-[1.05] tracking-tight mb-6">
            <span className="bg-gradient-to-br from-white via-stone-100 to-stone-300 bg-clip-text text-transparent">
              Plan Events
            </span>
            <br />
            <span className="relative">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(135deg, #d4af37 0%, #f5e07a 30%, #b8860b 60%, #d4af37 100%)",
                  backgroundSize: "200% 200%",
                }}
              >
                Like a Legend
              </span>
              {/* Underline glow */}
              <span className="absolute -bottom-2 left-0 right-0 h-1 rounded-full opacity-60"
                style={{ background: "linear-gradient(90deg, transparent, #d4af37, transparent)" }} />
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="text-lg sm:text-xl text-stone-400 max-w-2xl mx-auto leading-relaxed mb-10 font-sans"
        >
          The world's most elegant AI event planner. From royal weddings to tech summits —
          craft unforgettable celebrations with AI-powered budgets, itineraries, guest management and more.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(212,175,55,0.4)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleLaunch()}
            id="hero-get-started-btn"
            aria-label="Start planning your perfect event"
            className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-extrabold text-lg text-stone-950 cursor-pointer transition-all shadow-2xl shadow-amber-600/30"
            style={{ background: "linear-gradient(135deg, #d4af37 0%, #f5e07a 50%, #b8860b 100%)" }}
          >
            <Sparkles className="w-5 h-5" aria-hidden="true" />
            Plan My Event — Free
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </motion.span>
          </motion.button>

          <button
            onClick={() => setShowVideoPlaceholder(true)}
            aria-label="Watch product demo"
            className="flex items-center gap-2.5 px-6 py-4 rounded-2xl border border-white/15 text-stone-300 hover:text-white hover:border-white/30 bg-white/5 hover:bg-white/10 font-semibold cursor-pointer transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Play className="w-3.5 h-3.5 text-amber-400 ml-0.5" aria-hidden="true" />
            </div>
            Watch Demo
          </button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500"
        >
          {["✅ No credit card required", "✅ Setup in 60 seconds", "✅ Works without API key", "✅ 81/81 tests passing"].map((badge) => (
            <span key={badge} className="font-medium">{badge}</span>
          ))}
        </motion.div>

        {/* Hero Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="relative mt-20 w-full max-w-5xl mx-auto"
        >
          {/* Browser chrome */}
          <div className="rounded-2xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.8)] border border-white/10">
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-stone-900 border-b border-white/8">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 mx-4 bg-white/5 rounded-lg px-4 py-1.5 text-xs text-stone-500 border border-white/8">
                celebrate-ai.app
              </div>
            </div>

            {/* Dashboard preview */}
            <div className="relative bg-gradient-to-br from-[#0c0d12] via-[#14161d] to-[#0e0f14] p-6 overflow-hidden" style={{ minHeight: 340 }}>
              {/* Mock stat cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {[
                  { label: "Date", value: "15 Dec 2027", icon: "📅" },
                  { label: "Guests", value: "350 Attendees", icon: "👥" },
                  { label: "Budget", value: "₹25,00,000", icon: "💰" },
                  { label: "Theme", value: "Royal Indian", icon: "👑" },
                ].map((card) => (
                  <div key={card.label} className="rounded-xl p-3 border border-amber-500/15 bg-white/5">
                    <p className="text-[10px] text-stone-500 uppercase tracking-widest">{card.label}</p>
                    <p className="text-xs sm:text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                      <span>{card.icon}</span>{card.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Mock budget bar */}
              <div className="rounded-xl p-4 border border-white/8 bg-white/5 mb-4">
                <p className="text-xs text-stone-400 mb-3">Budget Distribution</p>
                <div className="space-y-2">
                  {[
                    { label: "Catering", pct: 35, color: "#d4af37" },
                    { label: "Venue", pct: 25, color: "#a78bfa" },
                    { label: "Décor", pct: 20, color: "#34d399" },
                    { label: "Entertainment", pct: 12, color: "#f87171" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-3">
                      <span className="text-[10px] text-stone-400 w-24 shrink-0">{row.label}</span>
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${row.pct}%` }}
                          transition={{ delay: 1.2, duration: 0.8 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: row.color }}
                        />
                      </div>
                      <span className="text-[10px] text-stone-400 w-8 text-right">{row.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating feature pills */}
              {[
                { label: "✅ RSVP Tracker", x: "right-4", y: "top-24", color: "emerald" },
                { label: "⏱️ Countdown Live", x: "left-4", y: "bottom-8", color: "amber" },
                { label: "🎨 Mood Board", x: "right-4", y: "bottom-8", color: "purple" },
              ].map((pill, i) => (
                <motion.div
                  key={pill.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 + i * 0.2 }}
                  className={`absolute ${pill.x} ${pill.y} hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold`}
                  style={{
                    background: `rgba(${pill.color === "emerald" ? "16,185,129" : pill.color === "amber" ? "212,175,55" : "139,92,246"},0.15)`,
                    borderColor: `rgba(${pill.color === "emerald" ? "16,185,129" : pill.color === "amber" ? "212,175,55" : "139,92,246"},0.35)`,
                    color: pill.color === "emerald" ? "#34d399" : pill.color === "amber" ? "#fbbf24" : "#c084fc",
                  }}
                >
                  {pill.label}
                </motion.div>
              ))}

              {/* Glow overlays */}
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-20 pointer-events-none"
                style={{ background: "rgba(212,175,55,0.4)" }} />
            </div>
          </div>

          {/* Shadow beneath */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 rounded-full blur-2xl opacity-40"
            style={{ background: "rgba(212,175,55,0.3)" }} />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-stone-600"
          aria-hidden="true"
        >
          <span className="text-xs">Scroll to explore</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.section>

      {/* ─── STATS SECTION ───────────────────────────────────────────────── */}
      <section className="py-20 px-4 relative" aria-label="Statistics">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="text-center p-6 rounded-2xl border border-amber-500/15 bg-white/3"
                style={{ background: "rgba(22,24,30,0.6)" }}
              >
                <p className="text-4xl sm:text-5xl font-bold font-cinzel text-amber-300 mb-1">
                  <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ────────────────────────────────────────────── */}
      <section id="features" className="py-20 px-4 relative" aria-label="Features">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/25 rounded-full text-xs font-bold text-amber-400 uppercase tracking-widest mb-4">
              <Zap className="w-3.5 h-3.5" aria-hidden="true" />
              Everything You Need
            </span>
            <h2 className="text-4xl sm:text-5xl font-editorial font-bold text-white mb-4">
              A Complete Event Command Center
            </h2>
            <p className="text-stone-400 max-w-xl mx-auto text-lg font-sans">
              8 powerful planning modules, all in one gorgeous dashboard. Built for planners who refuse to settle.
            </p>
          </motion.div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className={`relative rounded-2xl p-5 border ${feat.border} bg-gradient-to-br ${feat.color} overflow-hidden cursor-default`}
                  style={{ background: "rgba(18,20,26,0.8)" }}
                >
                  <div
                    className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-[40px] opacity-30 pointer-events-none"
                    style={{ backgroundColor: feat.glow }}
                  />
                  <div className={`p-3 rounded-xl bg-white/8 border ${feat.border} inline-flex mb-4`}>
                    <Icon className={`w-5 h-5 ${feat.iconColor}`} aria-hidden="true" />
                  </div>
                  <h3 className="text-sm font-bold text-stone-100 mb-1.5">{feat.label}</h3>
                  <p className="text-xs text-stone-400 leading-relaxed">{feat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── EVENT TYPES SECTION ─────────────────────────────────────────── */}
      <section id="events" className="py-20 px-4 relative" aria-label="Event types">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 border border-purple-500/25 rounded-full text-xs font-bold text-purple-400 uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              6 Event Categories
            </span>
            <h2 className="text-4xl sm:text-5xl font-editorial font-bold text-white mb-4">
              Built for Every Celebration
            </h2>
            <p className="text-stone-400 max-w-lg mx-auto font-sans text-lg">
              From intimate birthdays to grand corporate galas — CelebrateAI adapts to every event perfectly.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {EVENT_TYPES.map((et, i) => (
              <motion.button
                key={et.label}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={{ scale: 1.03, y: -6 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleLaunch(et.label as EventType)}
                aria-label={`Plan a ${et.label} event`}
                className="relative group flex flex-col items-center justify-between p-6 sm:p-7 rounded-3xl border cursor-pointer transition-all duration-300 overflow-hidden text-center min-h-[260px]"
                style={{
                  borderColor: `${et.color}35`,
                  background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.04) 0%, rgba(18,20,26,0.85) 80%)",
                  boxShadow: `0 12px 36px -12px ${et.color}25`,
                }}
              >
                {/* Top Glowing Color Accent Bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 opacity-70 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${et.color}, transparent)` }}
                />

                {/* Category Badge top right */}
                {et.badge && (
                  <span
                    className="absolute top-3.5 right-3.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full border tracking-wide uppercase font-sans"
                    style={{
                      background: `${et.color}18`,
                      borderColor: `${et.color}50`,
                      color: et.color,
                    }}
                  >
                    {et.badge}
                  </span>
                )}

                {/* Ambient Radial Hover Glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at center, ${et.color}20 0%, transparent 70%)` }}
                />

                {/* Icon with glowing backdrop */}
                <div className="relative mb-3 mt-1">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl border transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: `radial-gradient(circle at center, ${et.color}25 0%, rgba(255,255,255,0.03) 70%)`,
                      borderColor: `${et.color}40`,
                      boxShadow: `0 8px 24px ${et.color}20`,
                    }}
                  >
                    <span role="img" aria-hidden="true">{et.emoji}</span>
                  </div>
                </div>

                {/* Event Name & Tagline */}
                <div className="mb-4">
                  <h3 className="font-bold text-stone-100 text-lg group-hover:text-white transition-colors mb-1 font-editorial">
                    {et.label}
                  </h3>
                  <p className="text-xs text-stone-400 font-sans">{et.tagline}</p>
                  <span className="text-[10px] text-stone-500 font-sans block mt-1">{et.guests}</span>
                </div>

                {/* Attractive Action Pill with Always Visible Glow */}
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full border transition-all duration-300 group-hover:scale-105"
                  style={{
                    color: et.color,
                    borderColor: `${et.color}50`,
                    background: `${et.color}15`,
                    boxShadow: `0 2px 10px ${et.color}18`,
                  }}
                >
                  <span>Plan Now</span>
                  <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS SECTION ────────────────────────────────────────── */}
      <section id="testimonials" className="py-20 px-4 relative" aria-label="Testimonials">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">
              <Star className="w-3.5 h-3.5" aria-hidden="true" />
              Loved by Planners
            </span>
            <h2 className="text-4xl sm:text-5xl font-editorial font-bold text-white mb-4">
              Real Planners. Real Results.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="p-6 rounded-2xl border border-white/8 flex flex-col gap-4"
                style={{ background: "rgba(22,24,30,0.7)" }}
              >
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-stone-300 text-sm leading-relaxed italic flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-700/30 border border-amber-500/25 flex items-center justify-center text-xs font-bold text-amber-300">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-xs text-stone-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA SECTION ───────────────────────────────────────────── */}
      <section className="py-28 px-4 relative overflow-hidden" aria-label="Call to action">
        {/* CTA ambient glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 opacity-30"
            style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.25) 0%, transparent 60%)" }} />
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-7xl mb-6 select-none" aria-hidden="true">✨</div>
            <h2 className="text-5xl sm:text-6xl font-editorial font-bold text-white mb-5 leading-tight">
              Your Perfect Event
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                Starts Here
              </span>
            </h2>
            <p className="text-stone-400 text-xl mb-10 leading-relaxed font-sans">
              Join thousands of event professionals who plan smarter, faster, and more beautifully with CelebrateAI.
            </p>

            {/* Feature checklist */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              {["Free to use", "AI-powered", "Zero setup required", "Works instantly"].map((item) => (
                <span key={item} className="flex items-center gap-2 text-sm text-stone-300">
                  <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.06, boxShadow: "0 0 60px rgba(212,175,55,0.5)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleLaunch()}
              id="cta-final-btn"
              aria-label="Start planning your event for free"
              className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-extrabold text-xl text-stone-950 cursor-pointer shadow-2xl"
              style={{
                background: "linear-gradient(135deg, #d4af37 0%, #f5e07a 40%, #b8860b 100%)",
                boxShadow: "0 20px 60px rgba(212,175,55,0.25)",
              }}
            >
              <Sparkles className="w-6 h-6" aria-hidden="true" />
              Start Planning for Free
              <motion.span
                animate={{ x: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-6 h-6" aria-hidden="true" />
              </motion.span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="py-10 px-6 border-t border-white/6 text-center" aria-label="Footer">
        <div className="flex items-center justify-center gap-2.5 mb-3">
          <CelebrateLogo size={24} />
          <span className="font-editorial font-bold text-base bg-gradient-to-r from-stone-300 to-amber-300 bg-clip-text text-transparent">
            CelebrateAI
          </span>
        </div>
        <p className="text-stone-600 text-xs font-sans">
          Built with ❤️ for hospitality excellence · Powered by Google Gemini AI · MIT License
        </p>
        <p className="text-stone-700 text-xs mt-1">
          &copy; {new Date().getFullYear()} Sejal Soni ·{" "}
          <a href="https://github.com/Sejalsoni30/EventPlanner" target="_blank" rel="noopener noreferrer" className="text-amber-600/60 hover:text-amber-400 transition-colors">
            GitHub
          </a>
        </p>
      </footer>

      {/* Video placeholder modal */}
      <AnimatePresence>
        {showVideoPlaceholder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowVideoPlaceholder(false)}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-pointer"
            role="dialog"
            aria-modal="true"
            aria-label="Demo video"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-stone-900 border border-white/10 rounded-3xl p-8 max-w-lg w-full text-center cursor-default shadow-2xl"
            >
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-bold text-white mb-2">CelebrateAI Product Walkthrough</h3>
              <p className="text-stone-400 text-sm mb-6">
                Watch the full HD walkthrough of CelebrateAI orchestrating weddings, corporate summits, deterministic budgets, hourly timelines, and invitations.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <a
                  href="https://drive.google.com/file/d/1OebwLDdS-MnmgkcDqt8URBZzvurPQh7j/view?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-bold rounded-xl cursor-pointer inline-flex items-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-amber-600/30"
                >
                  <Play className="w-4 h-4 fill-stone-950" />
                  Watch Video on Google Drive ↗
                </a>
                <button
                  onClick={() => { setShowVideoPlaceholder(false); handleLaunch(); }}
                  className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl cursor-pointer hover:bg-white/15"
                  aria-label="Launch app now"
                >
                  Launch App Now
                </button>
                <button
                  onClick={() => setShowVideoPlaceholder(false)}
                  className="px-6 py-3 border border-white/15 text-stone-300 rounded-xl cursor-pointer hover:bg-white/5"
                  aria-label="Close dialog"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Back to Top Button */}
      <BackToTopButton />
    </div>
  );
}

function BackToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setShow(window.scrollY > 350);
    };
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 15 }}
          whileHover={{ scale: 1.08, boxShadow: "0 0 25px rgba(212,175,55,0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          id="landing-back-to-top-btn"
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#12141a]/90 border border-amber-500/35 text-amber-300 backdrop-blur-md shadow-2xl text-xs font-bold cursor-pointer transition-all hover:bg-stone-800"
        >
          <ArrowUp className="w-4 h-4 text-amber-400" aria-hidden="true" />
          <span className="hidden sm:inline">Back to Top</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
