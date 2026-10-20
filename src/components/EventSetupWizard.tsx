import React, { useState } from "react";
import type { EventFormData, EventType, Theme, Currency } from "../types";
import { validateEventInput } from "../utils/budgetCalculator";
import {
  Sparkles,
  Calendar,
  Users,
  DollarSign,
  Palette,
  MapPin,
  FileText,
  ChevronRight,
  AlertCircle,
  Info,
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
  const totalSteps = 3;

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

  const validateStep = (s: number): boolean => {
    const partialData: Partial<EventFormData> = {};
    if (s === 1) {
      Object.assign(partialData, {
        eventName: form.eventName,
        eventType: form.eventType,
        eventDate: form.eventDate,
      });
    } else if (s === 2) {
      Object.assign(partialData, {
        guestCount: form.guestCount,
        budget: form.budget,
        currency: form.currency,
        theme: form.theme,
      });
    } else {
      return true;
    }

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
    if (validateStep(step)) setStep((s) => Math.min(s + 1, totalSteps));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-purple-400" aria-hidden="true" />
            <span className="text-purple-300 text-sm font-medium">AI-Powered Event Planner</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-3">
            CelebrateAI
          </h1>
          <p className="text-slate-400 text-lg">
            Intelligent Celebration & Event Orchestrator
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-6" aria-label="Form progress">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <React.Fragment key={i}>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-300 ${
                  i + 1 <= step
                    ? "bg-purple-500 text-white shadow-lg shadow-purple-500/40"
                    : "bg-white/10 text-slate-400"
                }`}
                aria-current={i + 1 === step ? "step" : undefined}
              >
                {i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div
                  className={`flex-1 h-0.5 transition-all duration-500 ${
                    i + 1 < step ? "bg-purple-500" : "bg-white/10"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          aria-label="Event setup form"
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <section aria-labelledby="step1-heading">
              <h2 id="step1-heading" className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-purple-400" aria-hidden="true" />
                Basic Event Info
              </h2>
              <div className="space-y-5">
                {/* Event Name */}
                <div>
                  <label htmlFor="eventName" className="block text-sm font-medium text-slate-300 mb-1.5">
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
                    className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                      errors.eventName ? "border-red-500/70" : "border-white/10 hover:border-white/20"
                    }`}
                  />
                  {errors.eventName && (
                    <p id="eventName-error" role="alert" className="flex items-center gap-1 mt-1.5 text-sm text-red-400">
                      <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      {errors.eventName}
                    </p>
                  )}
                </div>

                {/* Event Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Event Type <span className="text-pink-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Event type">
                    {EVENT_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        role="radio"
                        aria-checked={form.eventType === type}
                        onClick={() => updateField("eventType", type)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                          form.eventType === type
                            ? "bg-purple-500/20 border-purple-500 text-purple-200 shadow-lg shadow-purple-500/20"
                            : "bg-white/5 border-white/10 text-slate-300 hover:border-white/30 hover:bg-white/10"
                        }`}
                      >
                        <span>{EVENT_ICONS[type]}</span>
                        <span>{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Event Date */}
                <div>
                  <label htmlFor="eventDate" className="block text-sm font-medium text-slate-300 mb-1.5">
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
                    className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all [color-scheme:dark] ${
                      errors.eventDate ? "border-red-500/70" : "border-white/10 hover:border-white/20"
                    }`}
                  />
                  {errors.eventDate && (
                    <p id="eventDate-error" role="alert" className="flex items-center gap-1 mt-1.5 text-sm text-red-400">
                      <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      {errors.eventDate}
                    </p>
                  )}
                </div>

                {/* Venue */}
                <div>
                  <label htmlFor="venue" className="block text-sm font-medium text-slate-300 mb-1.5">
                    <MapPin className="inline w-3.5 h-3.5 mr-1 text-slate-400" aria-hidden="true" />
                    Venue (Optional)
                  </label>
                  <input
                    id="venue"
                    type="text"
                    value={form.venue ?? ""}
                    onChange={(e) => updateField("venue", e.target.value)}
                    placeholder="e.g. The Grand Ballroom, Mumbai"
                    className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Step 2: Budget & Theme */}
          {step === 2 && (
            <section aria-labelledby="step2-heading">
              <h2 id="step2-heading" className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-purple-400" aria-hidden="true" />
                Budget & Theme
              </h2>
              <div className="space-y-5">
                {/* Guest Count */}
                <div>
                  <label htmlFor="guestCount" className="block text-sm font-medium text-slate-300 mb-1.5">
                    <Users className="inline w-3.5 h-3.5 mr-1 text-slate-400" aria-hidden="true" />
                    Estimated Guest Count <span className="text-pink-400">*</span>
                  </label>
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
                    className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                      errors.guestCount ? "border-red-500/70" : "border-white/10 hover:border-white/20"
                    }`}
                  />
                  {errors.guestCount && (
                    <p id="guestCount-error" role="alert" className="flex items-center gap-1 mt-1.5 text-sm text-red-400">
                      <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      {errors.guestCount}
                    </p>
                  )}
                </div>

                {/* Budget + Currency */}
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Total Budget <span className="text-pink-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      id="currency"
                      value={form.currency}
                      onChange={(e) => updateField("currency", e.target.value as Currency)}
                      aria-label="Currency"
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [color-scheme:dark]"
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
                      className={`flex-1 bg-white/5 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                        errors.budget ? "border-red-500/70" : "border-white/10 hover:border-white/20"
                      }`}
                    />
                  </div>
                  {errors.budget && (
                    <p id="budget-error" role="alert" className="flex items-center gap-1 mt-1.5 text-sm text-red-400">
                      <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      {errors.budget}
                    </p>
                  )}
                </div>

                {/* Theme */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Palette className="inline w-3.5 h-3.5 mr-1 text-slate-400" aria-hidden="true" />
                    Theme / Vibe <span className="text-pink-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Event theme">
                    {THEMES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        role="radio"
                        aria-checked={form.theme === t}
                        onClick={() => updateField("theme", t)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                          form.theme === t
                            ? "bg-pink-500/20 border-pink-500 text-pink-200 shadow-lg shadow-pink-500/20"
                            : "bg-white/5 border-white/10 text-slate-300 hover:border-white/30 hover:bg-white/10"
                        }`}
                      >
                        <span>{THEME_ICONS[t]}</span>
                        <span>{t}</span>
                      </button>
                    ))}
                  </div>
                  {errors.theme && (
                    <p role="alert" className="flex items-center gap-1 mt-1.5 text-sm text-red-400">
                      <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      {errors.theme}
                    </p>
                  )}
                  {form.theme === "Custom" && (
                    <input
                      type="text"
                      value={form.customTheme ?? ""}
                      onChange={(e) => updateField("customTheme", e.target.value)}
                      placeholder="Describe your custom theme..."
                      aria-label="Custom theme description"
                      className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Step 3: Finalize */}
          {step === 3 && (
            <section aria-labelledby="step3-heading">
              <h2 id="step3-heading" className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-purple-400" aria-hidden="true" />
                Review & Generate
              </h2>

              {/* Summary */}
              <div className="bg-white/5 rounded-2xl p-5 mb-5 space-y-3">
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
                <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-1.5">
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={form.additionalNotes ?? ""}
                  onChange={(e) => updateField("additionalNotes", e.target.value)}
                  placeholder="Any special requirements, dietary needs, or special guests..."
                  className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              {/* Gemini API Key */}
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-5">
                <div className="flex items-start gap-2 mb-2">
                  <Info className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" aria-hidden="true" />
                  <p className="text-sm text-purple-300">
                    <strong>Optional:</strong> Provide a Gemini API key for AI-generated content. Without it, a rich mock plan is generated.
                  </p>
                </div>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => onApiKeyChange(e.target.value)}
                  placeholder="AIza... (Gemini API Key)"
                  aria-label="Gemini API key (optional)"
                  className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-3 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </section>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 gap-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Next
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isGenerating}
                aria-busy={isGenerating}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" aria-hidden="true" />
                    Generate Plan
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-slate-400 text-sm shrink-0">{label}</span>
      <span className="text-white text-sm font-medium text-right">{value}</span>
    </div>
  );
}
