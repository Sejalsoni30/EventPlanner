import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { EventFormData, EventType, Theme, Currency } from "../types";
import { validateEventInput } from "../utils/budgetCalculator";
import {
  Sparkles,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  FileText,
  ChevronRight,
  AlertCircle,
  Info,
  Check,
  Wand2,
} from "lucide-react";

const EVENT_TYPES: EventType[] = [
  "Birthday",
  "Wedding",
  "Corporate Gala",
  "College Fest",
  "Anniversary",
  "Tech Conference",
];

const THEMES: Theme[] = [
  "Boho Chic",
  "Minimalist Tech",
  "Royal Indian",
  "Garden Party",
  "Retro Glam",
  "Black Tie Formal",
  "Tropical Paradise",
  "Custom",
];

const EVENT_ICONS: Record<EventType, string> = {
  Birthday: "🎂",
  Wedding: "💍",
  "Corporate Gala": "🏆",
  "College Fest": "🎓",
  Anniversary: "🥂",
  "Tech Conference": "💻",
};

const THEME_ICONS: Record<Theme, string> = {
  "Boho Chic": "🌿",
  "Minimalist Tech": "⬜",
  "Royal Indian": "👑",
  "Garden Party": "🌸",
  "Retro Glam": "✨",
  "Black Tie Formal": "🎩",
  "Tropical Paradise": "🌺",
  Custom: "🎨",
};

// Dynamic theme configuration based on EventType
interface ThemeAccent {
  glowPrimary: string;
  glowSecondary: string;
  ringColor: string;
  badgeBg: string;
  badgeText: string;
  activeBorder: string;
  activeBg: string;
  buttonGradient: string;
}

const EVENT_ACCENTS: Record<EventType, ThemeAccent> = {
  Birthday: {
    glowPrimary: "rgba(236, 72, 153, 0.22)",
    glowSecondary: "rgba(168, 85, 247, 0.20)",
    ringColor: "ring-pink-500/40",
    badgeBg: "bg-pink-500/15 border-pink-500/30",
    badgeText: "text-pink-300",
    activeBorder: "border-pink-500/80 shadow-pink-500/20",
    activeBg: "bg-pink-500/20 text-pink-100",
    buttonGradient: "from-pink-600 via-purple-600 to-pink-500",
  },
  Wedding: {
    glowPrimary: "rgba(244, 63, 94, 0.22)",
    glowSecondary: "rgba(251, 191, 36, 0.18)",
    ringColor: "ring-rose-500/40",
    badgeBg: "bg-rose-500/15 border-rose-500/30",
    badgeText: "text-rose-300",
    activeBorder: "border-rose-500/80 shadow-rose-500/20",
    activeBg: "bg-rose-500/20 text-rose-100",
    buttonGradient: "from-rose-600 via-pink-600 to-amber-600",
  },
  "Corporate Gala": {
    glowPrimary: "rgba(99, 102, 241, 0.22)",
    glowSecondary: "rgba(234, 179, 8, 0.16)",
    ringColor: "ring-indigo-500/40",
    badgeBg: "bg-indigo-500/15 border-indigo-500/30",
    badgeText: "text-indigo-300",
    activeBorder: "border-indigo-500/80 shadow-indigo-500/20",
    activeBg: "bg-indigo-500/20 text-indigo-100",
    buttonGradient: "from-indigo-600 via-blue-600 to-violet-600",
  },
  "College Fest": {
    glowPrimary: "rgba(249, 115, 22, 0.22)",
    glowSecondary: "rgba(168, 85, 247, 0.18)",
    ringColor: "ring-orange-500/40",
    badgeBg: "bg-orange-500/15 border-orange-500/30",
    badgeText: "text-orange-300",
    activeBorder: "border-orange-500/80 shadow-orange-500/20",
    activeBg: "bg-orange-500/20 text-orange-100",
    buttonGradient: "from-orange-600 via-amber-600 to-purple-600",
  },
  Anniversary: {
    glowPrimary: "rgba(16, 185, 129, 0.20)",
    glowSecondary: "rgba(245, 158, 11, 0.18)",
    ringColor: "ring-emerald-500/40",
    badgeBg: "bg-emerald-500/15 border-emerald-500/30",
    badgeText: "text-emerald-300",
    activeBorder: "border-emerald-500/80 shadow-emerald-500/20",
    activeBg: "bg-emerald-500/20 text-emerald-100",
    buttonGradient: "from-emerald-600 via-teal-600 to-amber-600",
  },
  "Tech Conference": {
    glowPrimary: "rgba(6, 182, 212, 0.22)",
    glowSecondary: "rgba(59, 130, 246, 0.20)",
    ringColor: "ring-cyan-500/40",
    badgeBg: "bg-cyan-500/15 border-cyan-500/30",
    badgeText: "text-cyan-300",
    activeBorder: "border-cyan-500/80 shadow-cyan-500/20",
    activeBg: "bg-cyan-500/20 text-cyan-100",
    buttonGradient: "from-cyan-600 via-blue-600 to-indigo-600",
  },
};

// Preset demo templates for 1-click testing
const DEMO_TEMPLATES: { label: string; icon: string; data: EventFormData }[] = [
  {
    label: "Royal Wedding",
    icon: "💍",
    data: {
      eventName: "Aarav & Maya's Royal Heritage Wedding",
      eventType: "Wedding",
      guestCount: 350,
      budget: 2500000,
      currency: "INR",
      theme: "Royal Indian",
      customTheme: "",
      eventDate: "2027-11-20",
      venue: "Umaid Bhawan Palace, Jodhpur",
      additionalNotes: "Grand baraat entrance, traditional Rajasthani sit-down dinner, live sitar players.",
    },
  },
  {
    label: "AI Summit",
    icon: "💻",
    data: {
      eventName: "Nexus Global AI Summit 2027",
      eventType: "Tech Conference",
      guestCount: 650,
      budget: 150000,
      currency: "USD",
      theme: "Minimalist Tech",
      customTheme: "",
      eventDate: "2027-09-18",
      venue: "Moscone Center, San Francisco",
      additionalNotes: "Keynote live streaming, VIP VC lounge, catered artisan coffee stations.",
    },
  },
  {
    label: "Neon Birthday",
    icon: "🎂",
    data: {
      eventName: "Aanya's 30th Neon Retro Gala",
      eventType: "Birthday",
      guestCount: 75,
      budget: 350000,
      currency: "INR",
      theme: "Retro Glam",
      customTheme: "",
      eventDate: "2027-08-14",
      venue: "Skyline Rooftop Lounge, Mumbai",
      additionalNotes: "Custom LED cocktail bar, 90s synthwave DJ set, midnight cake reveal.",
    },
  },
];

interface Props {
  onSubmit: (data: EventFormData) => void;
  isGenerating: boolean;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

const defaultForm: EventFormData = {
  eventName: "",
  eventType: "Birthday",
  guestCount: 50,
  budget: 200000,
  currency: "INR",
  theme: "Royal Indian",
  customTheme: "",
  eventDate: "",
  venue: "",
  additionalNotes: "",
};

export default function EventSetupWizard({
  onSubmit,
  isGenerating,
  apiKey,
  onApiKeyChange,
}: Props) {
  const [form, setForm] = useState<EventFormData>({ ...defaultForm });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([1]));
  const [activeTemplateToast, setActiveTemplateToast] = useState<string | null>(null);

  const totalSteps = 3;
  const currentAccent = EVENT_ACCENTS[form.eventType] || EVENT_ACCENTS.Birthday;

  const updateField = <K extends keyof EventFormData>(
    key: K,
    value: EventFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const applyDemoTemplate = (template: typeof DEMO_TEMPLATES[0]) => {
    setForm({ ...template.data });
    setErrors({});
    setVisitedSteps(new Set([1, 2, 3]));
    setActiveTemplateToast(`Loaded "${template.label}"!`);
    setTimeout(() => setActiveTemplateToast(null), 3000);
  };

  const validateStep = (s: number): boolean => {
    const allErrors = validateEventInput({ ...form });
    const stepErrors: Record<string, string> = {};
    const stepFields =
      s === 1
        ? ["eventName", "eventType", "eventDate"]
        : ["guestCount", "budget", "currency", "theme"];

    allErrors.forEach((e) => {
      if (stepFields.includes(e.field)) {
        stepErrors[e.field] = e.message;
      }
    });

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      const nextStep = Math.min(step + 1, totalSteps);
      setStep(nextStep);
      setVisitedSteps((prev) => new Set([...prev, nextStep]));
    }
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleStepClick = (targetStep: number) => {
    // Allow jumping to already visited steps or previous steps
    if (targetStep < step || visitedSteps.has(targetStep)) {
      if (targetStep > step && !validateStep(step)) return;
      setStep(targetStep);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allErrors = validateEventInput(form);
    if (allErrors.length > 0) {
      const errMap: Record<string, string> = {};
      allErrors.forEach((e) => (errMap[e.field] = e.message));
      setErrors(errMap);
      return;
    }
    onSubmit(form);
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  const stepLabels = ["Event Details", "Budget & Vibe", "Review & Launch"];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#0b0c16] via-[#151226] to-[#0d0d1a] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-700">
      {/* Dynamic Ambient Mesh Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute -top-32 -right-32 w-[550px] h-[550px] rounded-full blur-[120px] transition-all duration-1000 ease-out"
          style={{ backgroundColor: currentAccent.glowPrimary }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-[550px] h-[550px] rounded-full blur-[120px] transition-all duration-1000 ease-out"
          style={{ backgroundColor: currentAccent.glowSecondary }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none" />
        {/* Subtle grid texture */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <div className="relative w-full max-w-2xl my-6">
        {/* Header Bar */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${currentAccent.badgeBg} ${currentAccent.badgeText} backdrop-blur-md transition-all duration-500`}>
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              AI-Powered Event Orchestrator
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent mb-2 tracking-tight">
            CelebrateAI
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
            Design bespoke celebrations, optimize budgets, and orchestrate seamless itineraries in seconds.
          </p>

          {/* Try Demo Template Chips */}
          <div className="mt-4 flex items-center justify-center gap-2 flex-wrap" role="region" aria-label="Demo templates">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Wand2 className="w-3.5 h-3.5 text-purple-400" aria-hidden="true" />
              Try Demo:
            </span>
            {DEMO_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.label}
                type="button"
                onClick={() => applyDemoTemplate(tmpl)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 text-slate-300 hover:text-white rounded-full text-xs font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <span>{tmpl.icon}</span>
                <span>{tmpl.label}</span>
              </button>
            ))}
          </div>

          {/* Template Toast Feedback */}
          <AnimatePresence>
            {activeTemplateToast && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium"
              >
                <Check className="w-3 h-3 text-emerald-400" />
                {activeTemplateToast}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Enhanced 3-Step Wizard Progress Indicator */}
        <div className="mb-6 px-2" aria-label="Form progress">
          <div className="flex items-center justify-between relative">
            {/* Connecting lines */}
            <div className="absolute top-4 left-6 right-6 -translate-y-1/2 h-0.5 bg-white/10 -z-0">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-400 transition-all duration-500 ease-out"
                style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
              />
            </div>

            {Array.from({ length: totalSteps }).map((_, i) => {
              const stepNumber = i + 1;
              const isCompleted = stepNumber < step;
              const isActive = stepNumber === step;
              const isClickable = stepNumber < step || visitedSteps.has(stepNumber);

              return (
                <div key={i} className="flex flex-col items-center z-10">
                  <button
                    type="button"
                    onClick={() => handleStepClick(stepNumber)}
                    disabled={!isClickable}
                    aria-label={`Step ${stepNumber}: ${stepLabels[i]}`}
                    aria-current={isActive ? "step" : undefined}
                    className={`relative w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 focus:outline-none ${
                      isClickable ? "cursor-pointer" : "cursor-default"
                    } ${
                      isCompleted
                        ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 scale-100"
                        : isActive
                        ? `bg-purple-600 text-white ring-4 ${currentAccent.ringColor} shadow-xl shadow-purple-900/50 scale-110`
                        : "bg-white/5 border border-white/15 text-slate-400"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 stroke-[3]" aria-hidden="true" />
                    ) : (
                      <span>{stepNumber}</span>
                    )}
                  </button>
                  <span
                    className={`text-[11px] mt-1.5 font-medium transition-colors hidden sm:block ${
                      isActive ? "text-white font-semibold" : isCompleted ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    {stepLabels[i]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Glassmorphic Form Card */}
        <form
          onSubmit={handleSubmit}
          aria-label="Event setup form"
          className="relative glass-card rounded-3xl p-6 sm:p-8 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-purple-950/40 transition-all duration-300"
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <motion.section
                key="step1"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                aria-labelledby="step1-heading"
              >
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
                  <h2 id="step1-heading" className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                    <div className="p-2 bg-purple-500/20 rounded-xl">
                      <Calendar className="w-5 h-5 text-purple-400" aria-hidden="true" />
                    </div>
                    Basic Event Info
                  </h2>
                  <span className="text-xs text-slate-400 font-mono">Step 1 of 3</span>
                </div>

                <div className="space-y-5">
                  {/* Event Name */}
                  <div>
                    <label htmlFor="eventName" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Event Name <span className="text-pink-400">*</span>
                    </label>
                    <input
                      id="eventName"
                      type="text"
                      value={form.eventName}
                      onChange={(e) => updateField("eventName", e.target.value)}
                      placeholder="e.g. Priya's 30th Birthday Bash"
                      aria-required="true"
                      aria-invalid={!!errors.eventName}
                      aria-describedby={errors.eventName ? "eventName-error" : undefined}
                      className={`w-full bg-black/30 border rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                        errors.eventName ? "border-red-500/80 ring-1 ring-red-500/30" : "border-white/10 hover:border-white/20"
                      }`}
                    />
                    {errors.eventName && (
                      <p id="eventName-error" role="alert" className="flex items-center gap-1.5 mt-2 text-xs text-red-400 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        {errors.eventName}
                      </p>
                    )}
                  </div>

                  {/* Event Type Grid */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Event Type <span className="text-pink-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5" role="radiogroup" aria-label="Event type">
                      {EVENT_TYPES.map((type) => {
                        const isSelected = form.eventType === type;
                        return (
                          <motion.button
                            key={type}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => updateField("eventType", type)}
                            className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl border text-sm font-medium transition-all text-left ${
                              isSelected
                                ? `${currentAccent.activeBg} ${currentAccent.activeBorder} shadow-lg ring-1 ring-white/20`
                                : "bg-white/5 border-white/10 text-slate-300 hover:border-white/30 hover:bg-white/10"
                            }`}
                          >
                            <span className="text-lg">{EVENT_ICONS[type]}</span>
                            <span className="truncate">{type}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Date & Venue 2-Column */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Event Date */}
                    <div>
                      <label htmlFor="eventDate" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Event Date <span className="text-pink-400">*</span>
                      </label>
                      <input
                        id="eventDate"
                        type="date"
                        value={form.eventDate}
                        min={minDateStr}
                        onChange={(e) => updateField("eventDate", e.target.value)}
                        aria-required="true"
                        aria-invalid={!!errors.eventDate}
                        aria-describedby={errors.eventDate ? "eventDate-error" : undefined}
                        className={`w-full bg-black/30 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all [color-scheme:dark] ${
                          errors.eventDate ? "border-red-500/80 ring-1 ring-red-500/30" : "border-white/10 hover:border-white/20"
                        }`}
                      />
                      {errors.eventDate && (
                        <p id="eventDate-error" role="alert" className="flex items-center gap-1.5 mt-2 text-xs text-red-400 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          {errors.eventDate}
                        </p>
                      )}
                    </div>

                    {/* Venue */}
                    <div>
                      <label htmlFor="venue" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Venue <span className="text-slate-500 font-normal lowercase">(Optional)</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden="true" />
                        <input
                          id="venue"
                          type="text"
                          value={form.venue ?? ""}
                          onChange={(e) => updateField("venue", e.target.value)}
                          placeholder="e.g. Grand Ballroom, Mumbai"
                          className="w-full bg-black/30 border border-white/10 hover:border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {/* Step 2: Budget & Theme */}
            {step === 2 && (
              <motion.section
                key="step2"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                aria-labelledby="step2-heading"
              >
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
                  <h2 id="step2-heading" className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-500/20 rounded-xl">
                      <DollarSign className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                    </div>
                    Budget & Theme
                  </h2>
                  <span className="text-xs text-slate-400 font-mono">Step 2 of 3</span>
                </div>

                <div className="space-y-5">
                  {/* Guests & Budget Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Guest Count */}
                    <div>
                      <label htmlFor="guestCount" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Guest Count <span className="text-pink-400">*</span>
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden="true" />
                        <input
                          id="guestCount"
                          type="number"
                          value={form.guestCount}
                          min={1}
                          max={100000}
                          onChange={(e) => updateField("guestCount", parseInt(e.target.value) || 0)}
                          aria-required="true"
                          aria-invalid={!!errors.guestCount}
                          aria-describedby={errors.guestCount ? "guestCount-error" : undefined}
                          className={`w-full bg-black/30 border rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                            errors.guestCount ? "border-red-500/80 ring-1 ring-red-500/30" : "border-white/10 hover:border-white/20"
                          }`}
                        />
                      </div>
                      {errors.guestCount && (
                        <p id="guestCount-error" role="alert" className="flex items-center gap-1.5 mt-2 text-xs text-red-400 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          {errors.guestCount}
                        </p>
                      )}
                    </div>

                    {/* Total Budget */}
                    <div>
                      <label htmlFor="budget" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Total Budget <span className="text-pink-400">*</span>
                      </label>
                      <div className="flex gap-2">
                        <select
                          id="currency"
                          value={form.currency}
                          onChange={(e) => updateField("currency", e.target.value as Currency)}
                          aria-label="Currency"
                          className="bg-black/40 border border-white/15 rounded-xl px-3 py-3 text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 [color-scheme:dark]"
                        >
                          <option value="INR">₹ INR</option>
                          <option value="USD">$ USD</option>
                        </select>
                        <input
                          id="budget"
                          type="number"
                          value={form.budget}
                          min={1}
                          onChange={(e) => updateField("budget", parseFloat(e.target.value) || 0)}
                          aria-required="true"
                          aria-invalid={!!errors.budget}
                          aria-describedby={errors.budget ? "budget-error" : undefined}
                          className={`flex-1 bg-black/30 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                            errors.budget ? "border-red-500/80 ring-1 ring-red-500/30" : "border-white/10 hover:border-white/20"
                          }`}
                        />
                      </div>
                      {errors.budget && (
                        <p id="budget-error" role="alert" className="flex items-center gap-1.5 mt-2 text-xs text-red-400 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          {errors.budget}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Theme Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Theme / Vibe <span className="text-pink-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup" aria-label="Event theme">
                      {THEMES.map((t) => {
                        const isSelected = form.theme === t;
                        return (
                          <motion.button
                            key={t}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => updateField("theme", t)}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                              isSelected
                                ? "bg-purple-500/25 border-purple-500 text-purple-100 shadow-md ring-1 ring-purple-400/30"
                                : "bg-white/5 border-white/10 text-slate-300 hover:border-white/30 hover:bg-white/10"
                            }`}
                          >
                            <span className="text-base">{THEME_ICONS[t]}</span>
                            <span className="truncate">{t}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                    {errors.theme && (
                      <p role="alert" className="flex items-center gap-1.5 mt-2 text-xs text-red-400 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        {errors.theme}
                      </p>
                    )}
                    {form.theme === "Custom" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3">
                        <input
                          type="text"
                          value={form.customTheme ?? ""}
                          onChange={(e) => updateField("customTheme", e.target.value)}
                          placeholder="Describe your custom theme vibe (e.g. Cyberpunk Neon Garden)..."
                          aria-label="Custom theme description"
                          className="w-full bg-black/30 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.section>
            )}

            {/* Step 3: Review & Launch */}
            {step === 3 && (
              <motion.section
                key="step3"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                aria-labelledby="step3-heading"
              >
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
                  <h2 id="step3-heading" className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                    <div className="p-2 bg-pink-500/20 rounded-xl">
                      <FileText className="w-5 h-5 text-pink-400" aria-hidden="true" />
                    </div>
                    Review & Generate
                  </h2>
                  <span className="text-xs text-slate-400 font-mono">Step 3 of 3</span>
                </div>

                {/* Review Glass Summary */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 mb-5 space-y-2.5 backdrop-blur-md">
                  <SummaryRow label="Event" value={`${EVENT_ICONS[form.eventType]} ${form.eventName || "(Unnamed)"}`} />
                  <SummaryRow label="Type" value={form.eventType} />
                  <SummaryRow label="Date" value={form.eventDate || "(Not set)"} />
                  <SummaryRow label="Guests" value={form.guestCount.toLocaleString()} />
                  <SummaryRow
                    label="Budget"
                    value={`${form.currency === "INR" ? "₹" : "$"}${form.budget.toLocaleString()} ${form.currency}`}
                  />
                  <SummaryRow
                    label="Theme"
                    value={`${THEME_ICONS[form.theme]} ${form.theme === "Custom" ? form.customTheme || "Custom" : form.theme}`}
                  />
                  {form.venue && <SummaryRow label="Venue" value={form.venue} />}
                </div>

                {/* Notes */}
                <div className="mb-5">
                  <label htmlFor="notes" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Additional Notes <span className="text-slate-500 font-normal lowercase">(Optional)</span>
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={form.additionalNotes ?? ""}
                    onChange={(e) => updateField("additionalNotes", e.target.value)}
                    placeholder="Any special VIP guests, dietary preferences, or scheduling constraints..."
                    className="w-full bg-black/30 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none transition-all"
                  />
                </div>

                {/* Optional Gemini API Key Box */}
                <div className="bg-purple-950/30 border border-purple-500/30 rounded-2xl p-4 mb-2">
                  <div className="flex items-start gap-2.5 mb-2">
                    <Info className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" aria-hidden="true" />
                    <p className="text-xs text-purple-300 leading-relaxed">
                      <strong>AI Generation:</strong> Provide an optional Gemini API key for live real-time synthesis. If omitted, CelebrateAI automatically synthesizes a rich, deterministic event plan.
                    </p>
                  </div>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => onApiKeyChange(e.target.value)}
                    placeholder="AIza... (Gemini API Key, Optional)"
                    aria-label="Gemini API key (optional)"
                    className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/10 gap-4">
            {step > 1 ? (
              <motion.button
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Back
              </motion.button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleNext}
                className={`flex items-center gap-2 px-7 py-3 bg-gradient-to-r ${currentAccent.buttonGradient} text-white font-semibold rounded-xl shadow-lg shadow-purple-900/40 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer`}
              >
                Next
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isGenerating}
                aria-busy={isGenerating}
                className={`flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r ${currentAccent.buttonGradient} disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-xl shadow-purple-900/50 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                    Synthesizing Event Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" aria-hidden="true" />
                    Generate Event Plan
                  </>
                )}
              </motion.button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4 py-0.5">
      <span className="text-slate-400 text-xs shrink-0">{label}</span>
      <span className="text-white text-xs font-semibold text-right truncate max-w-[280px]">{value}</span>
    </div>
  );
}
