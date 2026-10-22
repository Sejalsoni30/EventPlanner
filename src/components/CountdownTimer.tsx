import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timer, Sparkles } from "lucide-react";

interface Props {
  eventDate: string;
  eventName: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function calculateTimeLeft(eventDate: string): TimeLeft {
  if (!eventDate) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }
  const target = new Date(eventDate);
  if (isNaN(target.getTime())) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }
  target.setHours(0, 0, 0, 0);
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    isPast: false,
  };
}

function FlipUnit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative">
        <motion.div
          key={display}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center rounded-2xl font-cinzel font-bold text-3xl sm:text-4xl text-amber-200"
          style={{
            background: "rgba(22, 24, 30, 0.85)",
            border: "1px solid rgba(212, 175, 55, 0.25)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,175,55,0.1)",
          }}
        >
          {display}
        </motion.div>
        <div
          className="absolute top-1/2 left-0 right-0 h-px opacity-20"
          style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)" }}
        />
      </div>
      <span className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-stone-400 font-semibold">{label}</span>
    </div>
  );
}

export default function CountdownTimer({ eventDate, eventName }: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(eventDate));

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(calculateTimeLeft(eventDate));
    }, 1000);
    return () => clearInterval(id);
  }, [eventDate]);

  return (
    <section
      aria-label="Event countdown timer"
      className="human-card rounded-3xl p-6 sm:p-8 border border-amber-500/15 relative overflow-hidden"
    >
      <div
        className="absolute -top-10 right-10 w-48 h-48 rounded-full blur-[80px] opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%)" }}
      />
      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/25">
            <Timer className="w-5 h-5 text-amber-400" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-200 uppercase tracking-widest">Event Countdown</h2>
            <p className="text-xs text-stone-400 font-sans truncate max-w-[200px]">{eventName}</p>
          </div>
        </div>

        {timeLeft.isPast ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-6"
          >
            <div className="text-5xl mb-3">🎉</div>
            <p className="text-2xl font-editorial font-bold text-amber-300">Event is Live!</p>
            <p className="text-stone-400 text-sm mt-1 font-sans">The celebration has begun!</p>
          </motion.div>
        ) : (
          <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
            <FlipUnit value={timeLeft.days} label="Days" />
            <span className="text-3xl text-amber-500/50 font-bold mb-5 font-cinzel">:</span>
            <FlipUnit value={timeLeft.hours} label="Hours" />
            <span className="text-3xl text-amber-500/50 font-bold mb-5 font-cinzel">:</span>
            <FlipUnit value={timeLeft.minutes} label="Mins" />
            <span className="text-3xl text-amber-500/50 font-bold mb-5 font-cinzel">:</span>
            <FlipUnit value={timeLeft.seconds} label="Secs" />
          </div>
        )}

        {!timeLeft.isPast && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center justify-center gap-1.5 mt-5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
            <span className="text-xs text-amber-400/80 font-semibold tracking-wider">
              {timeLeft.days === 0 ? "Event starts today!" : `${timeLeft.days} day${timeLeft.days !== 1 ? "s" : ""} to go!`}
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
          </motion.div>
        )}
      </div>
    </section>
  );
}
