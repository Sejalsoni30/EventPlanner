import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Brain, CheckCircle2 } from "lucide-react";

const MESSAGES = [
  "Analyzing guest dynamics and venue geometry...",
  "Synthesizing dynamic hourly timeline with POC roles...",
  "Optimizing budget distribution across 5 core tiers...",
  "Drafting personalized invitation & vendor scripts...",
  "Calibrating milestone checklist & critical deadlines...",
  "Finalizing AI celebration blueprint...",
];

interface Props {
  eventName?: string;
}

export default function LoadingScreen({ eventName }: Props) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < MESSAGES.length - 1 ? prev + 1 : prev));
    }, 400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="min-h-screen bg-gradient-to-tr from-[#0b0c16] via-[#151226] to-[#0d0d1a] flex items-center justify-center p-4 relative overflow-hidden"
      role="status"
      aria-live="polite"
      aria-label="Generating your event plan"
    >
      {/* Dynamic ambient lights */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[140px] animate-pulse delay-700" />
      </div>

      <div className="relative text-center max-w-md w-full glass-card p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-2xl">
        {/* Animated Central Ring */}
        <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping" aria-hidden="true" />
          <div className="absolute -inset-2 rounded-full border border-purple-500/30 animate-spin" style={{ animationDuration: "6s" }} />
          <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 rounded-full w-20 h-20 flex items-center justify-center shadow-xl shadow-purple-500/40">
            <Sparkles className="w-9 h-9 text-white animate-spin" style={{ animationDuration: "4s" }} aria-hidden="true" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
          <Brain className="w-3.5 h-3.5" />
          <span>Gemini AI Synthesis Engine</span>
        </div>

        <h2 className="text-2xl font-black text-white mb-1 tracking-tight">
          Crafting Event Architecture
        </h2>
        {eventName && (
          <p className="text-purple-300 text-sm font-semibold mb-6 truncate max-w-xs mx-auto">
            "{eventName}"
          </p>
        )}

        {/* Phase List with Progressive Checkmarks */}
        <div className="space-y-2 text-left mt-4">
          {MESSAGES.map((msg, i) => {
            const isDone = i < currentStep;
            const isCurrent = i === currentStep;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2 text-xs transition-all ${
                  isCurrent
                    ? "bg-purple-500/20 border border-purple-500/40 text-purple-200 shadow-md font-medium"
                    : isDone
                    ? "bg-white/5 border border-white/5 text-slate-300 font-normal"
                    : "bg-transparent text-slate-500"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                )}
                <span className="truncate">{msg}</span>
              </motion.div>
            );
          })}
        </div>

        <p className="text-slate-500 text-[11px] mt-6 font-mono">
          Assembling schedules • 5 budget tiers • RSVP board
        </p>
      </div>
    </div>
  );
}
