import { Sparkles } from "lucide-react";

const MESSAGES = [
  "Orchestrating your perfect event...",
  "Designing your hourly itinerary...",
  "Allocating budget across tiers...",
  "Crafting personalized vendor scripts...",
  "Building your milestone checklist...",
  "Adding final magic touches...",
];

interface Props {
  eventName?: string;
}

export default function LoadingScreen({ eventName }: Props) {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4"
      role="status"
      aria-live="polite"
      aria-label="Generating your event plan"
    >
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative text-center max-w-md">
        {/* Animated Icon */}
        <div className="relative inline-flex items-center justify-center w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping" aria-hidden="true" />
          <div className="absolute inset-2 rounded-full bg-purple-500/30 animate-pulse" aria-hidden="true" />
          <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 rounded-full w-20 h-20 flex items-center justify-center shadow-2xl shadow-purple-500/50">
            <Sparkles className="w-10 h-10 text-white animate-spin" style={{ animationDuration: "3s" }} aria-hidden="true" />
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Crafting Your Event Plan
        </h2>
        {eventName && (
          <p className="text-purple-300 text-lg mb-6 font-medium">"{eventName}"</p>
        )}

        <div className="space-y-2.5 text-left">
          {MESSAGES.map((msg, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2.5 animate-pulse"
              style={{ animationDelay: `${i * 0.3}s`, animationDuration: "2s" }}
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-white" aria-hidden="true" />
              </div>
              <span className="text-slate-300 text-sm">{msg}</span>
            </div>
          ))}
        </div>

        <p className="text-slate-500 text-xs mt-6">This usually takes a few seconds...</p>
      </div>
    </div>
  );
}
