import { useState } from "react";
import { motion } from "framer-motion";
import { CloudSun, Wind, Droplets, Eye, Thermometer, AlertTriangle } from "lucide-react";

interface Props {
  eventDate: string;
  venue?: string;
}

interface WeatherData {
  condition: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  visibility: string;
  feelsLike: number;
  uv: number;
  icon: string;
  outdoor_alert: boolean;
  recommendation: string;
}

// Deterministic "forecast" seeded by event date for consistent demo UX
function getSeededForecast(eventDate: string): WeatherData {
  const seed = new Date(eventDate).getDate() + new Date(eventDate).getMonth();
  const conditions: WeatherData[] = [
    { condition: "Partly Cloudy", temp: 28, humidity: 65, windSpeed: 12, visibility: "10 km", feelsLike: 30, uv: 5, icon: "⛅", outdoor_alert: false, recommendation: "Great weather for an outdoor event! Keep light backup shading ready." },
    { condition: "Clear Sky", temp: 32, humidity: 45, windSpeed: 8, visibility: "15 km", feelsLike: 34, uv: 8, icon: "☀️", outdoor_alert: true, recommendation: "Sunny & hot — arrange shaded zones, misting fans, and chilled water stations." },
    { condition: "Light Rain", temp: 22, humidity: 88, windSpeed: 18, visibility: "6 km", feelsLike: 20, uv: 2, icon: "🌧️", outdoor_alert: true, recommendation: "Rain likely — ensure tent covers, waterproof décor, and indoor backup plan." },
    { condition: "Overcast", temp: 25, humidity: 72, windSpeed: 15, visibility: "8 km", feelsLike: 24, uv: 3, icon: "☁️", outdoor_alert: false, recommendation: "Overcast sky keeps temperatures comfortable. Perfect for outdoor celebrations." },
    { condition: "Breezy & Cool", temp: 20, humidity: 55, windSpeed: 25, visibility: "12 km", feelsLike: 17, uv: 4, icon: "🌬️", outdoor_alert: true, recommendation: "Wind may affect light décor — secure balloons, draping, and candle centerpieces." },
    { condition: "Thunderstorm", temp: 19, humidity: 95, windSpeed: 40, visibility: "3 km", feelsLike: 16, uv: 1, icon: "⛈️", outdoor_alert: true, recommendation: "Thunderstorm alert — move the event indoors. Contact venue for contingency plan." },
    { condition: "Pleasant & Clear", temp: 24, humidity: 50, windSpeed: 10, visibility: "15 km", feelsLike: 24, uv: 4, icon: "🌤️", outdoor_alert: false, recommendation: "Near-perfect conditions. Ideal for both indoor and outdoor celebrations!" },
  ];
  return conditions[seed % conditions.length];
}

function MetricBadge({ icon: Icon, label, value, className = "" }: {
  icon: React.ElementType; label: string; value: string; className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 p-2.5 bg-white/5 border border-white/8 rounded-xl ${className}`}>
      <Icon className="w-4 h-4 text-stone-400 shrink-0" aria-hidden="true" />
      <div>
        <p className="text-[10px] text-stone-500 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-bold text-stone-200">{value}</p>
      </div>
    </div>
  );
}

export default function WeatherWidget({ eventDate, venue }: Props) {
  const [forecast] = useState<WeatherData>(() => getSeededForecast(eventDate));

  const daysUntil = Math.ceil((new Date(eventDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const formattedDate = new Date(eventDate).toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });

  const tempColor = forecast.temp >= 35 ? "text-red-400" : forecast.temp <= 15 ? "text-blue-400" : "text-amber-300";

  return (
    <section aria-label="Weather forecast for event" className="human-card rounded-3xl p-6 border border-amber-500/15 relative overflow-hidden">
      {/* Sky ambient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: forecast.outdoor_alert
            ? "radial-gradient(ellipse at top, rgba(239,68,68,0.3) 0%, transparent 60%)"
            : "radial-gradient(ellipse at top, rgba(56,189,248,0.3) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-sky-500/15 border border-sky-500/25">
              <CloudSun className="w-5 h-5 text-sky-400" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-200 uppercase tracking-widest">Event Day Forecast</h2>
              <p className="text-xs text-stone-400 mt-0.5 truncate max-w-[180px]">
                {venue || "Event Venue"} · {formattedDate}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-4xl font-bold font-cinzel ${tempColor}`}>{forecast.temp}°C</span>
            <p className="text-xs text-stone-400 mt-0.5">Feels like {forecast.feelsLike}°C</p>
          </div>
        </div>

        {/* Condition & Icon */}
        <div className="flex items-center gap-3 mb-4 p-3.5 bg-white/5 rounded-2xl border border-white/8">
          <span className="text-4xl" role="img" aria-label={forecast.condition}>{forecast.icon}</span>
          <div>
            <p className="text-base font-bold text-stone-100">{forecast.condition}</p>
            <p className="text-xs text-stone-400">
              {daysUntil > 0 ? `${daysUntil} days away` : daysUntil === 0 ? "Today!" : "Past event"}
              {" · "}UV Index: {forecast.uv}
            </p>
          </div>
        </div>

        {/* Outdoor Alert */}
        {forecast.outdoor_alert && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2.5 p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl mb-4"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-amber-200 leading-relaxed">{forecast.recommendation}</p>
          </motion.div>
        )}

        {!forecast.outdoor_alert && (
          <div className="flex items-start gap-2.5 p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl mb-4">
            <span className="text-sm mt-0.5">✅</span>
            <p className="text-xs text-emerald-200 leading-relaxed">{forecast.recommendation}</p>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <MetricBadge icon={Droplets} label="Humidity" value={`${forecast.humidity}%`} />
          <MetricBadge icon={Wind} label="Wind" value={`${forecast.windSpeed} km/h`} />
          <MetricBadge icon={Eye} label="Visibility" value={forecast.visibility} />
          <MetricBadge icon={Thermometer} label="UV Index" value={`${forecast.uv} / 10`} />
        </div>

        <p className="text-[10px] text-stone-600 text-center mt-3 font-sans">
          ⚡ Simulated forecast · Actual conditions may vary · Verify 48 hrs before event
        </p>
      </div>
    </section>
  );
}
