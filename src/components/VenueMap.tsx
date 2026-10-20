import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  ExternalLink,
  Navigation,
  Copy,
  Check,
  Search,
  Car,
  ShieldCheck,
  Building,
} from "lucide-react";

interface Props {
  venue?: string;
  eventName: string;
  onUpdateVenue?: (venue: string) => void;
}

export default function VenueMap({
  venue = "Grand Palace Ballroom, New Delhi",
  eventName,
  onUpdateVenue,
}: Props) {
  const [currentVenue, setCurrentVenue] = useState(venue || "Umaid Bhawan Palace, Jodhpur");
  const [searchInput, setSearchInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const effectiveVenue = currentVenue.trim() || "The Grand Ballroom";

  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    effectiveVenue
  )}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    effectiveVenue
  )}`;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    effectiveVenue
  )}`;

  const handleCopyLocation = async () => {
    try {
      await navigator.clipboard.writeText(effectiveVenue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCurrentVenue(searchInput.trim());
      if (onUpdateVenue) onUpdateVenue(searchInput.trim());
      setIsEditing(false);
      setSearchInput("");
    }
  };

  return (
    <section
      aria-labelledby="venue-heading"
      className="human-card rounded-3xl p-6 backdrop-blur-xl border border-amber-500/20 shadow-2xl transition-all"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-white/10 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/15 border border-amber-500/30 rounded-2xl shadow-lg shadow-amber-500/10">
            <MapPin className="w-5 h-5 text-amber-400" aria-hidden="true" />
          </div>
          <div>
            <h2 id="venue-heading" className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Venue & Map Location
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Live Coordinates
              </span>
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Interactive navigation, arrival logistics & destination mapping
            </p>
          </div>
        </div>

        {/* Change Venue Button */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          aria-label="Change venue location"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-amber-500/40 text-stone-300 hover:text-white rounded-xl text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer self-start sm:self-auto"
        >
          <Search className="w-3.5 h-3.5 text-amber-400" />
          <span>{isEditing ? "Cancel" : "Change Venue"}</span>
        </button>
      </div>

      {/* Edit Venue Search Input */}
      {isEditing && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleSearchSubmit}
          className="mb-5 flex gap-2"
        >
          <div className="relative flex-1">
            <Building className="absolute left-3.5 top-3 w-4 h-4 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter venue name or city (e.g. Taj Lake Palace, Udaipur)..."
              aria-label="New venue address"
              className="w-full bg-black/40 border border-amber-500/40 rounded-xl pl-10 pr-4 py-2 text-white text-xs sm:text-sm placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-bold rounded-xl text-xs sm:text-sm hover:from-amber-500 hover:to-amber-400 transition-all cursor-pointer shadow-md shadow-amber-600/30"
          >
            Update Map
          </button>
        </motion.form>
      )}

      {/* Content Grid: Map Preview + Logistics Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Interactive Map Iframe */}
        <div className="lg:col-span-7 h-64 sm:h-80 rounded-2xl overflow-hidden border border-white/15 relative bg-stone-950 shadow-inner group">
          <iframe
            title={`Map preview of ${effectiveVenue}`}
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0, filter: "brightness(0.92) contrast(1.08)" }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />

          {/* Quick External Map Badge Overlay */}
          <div className="absolute top-3 left-3 bg-stone-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-medium text-stone-200 flex items-center gap-1.5 shadow-lg pointer-events-none">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate max-w-[200px]">{effectiveVenue}</span>
          </div>
        </div>

        {/* Venue Information & Directions */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block mb-1">
                Official Event Destination
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                {effectiveVenue}
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Configured for {eventName}
              </p>
            </div>

            {/* Logistics Pointers */}
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5">
                <Car className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-200 block">Valet & Guest Parking</span>
                  <span className="text-stone-400 text-[11px]">Dedicated bays available for attendees with designated drop-off lane.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-200 block">Accessibility & Entry</span>
                  <span className="text-stone-400 text-[11px]">Step-free ramp access, guest registration desk at the main atrium.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-600/25"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Google Maps</span>
            </a>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white/10 hover:bg-white/15 border border-white/15 hover:border-amber-500/40 text-stone-200 hover:text-white font-semibold rounded-xl text-xs transition-all"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-400" />
              <span>Get Directions</span>
            </a>

            <button
              onClick={handleCopyLocation}
              aria-label="Copy venue address"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium text-stone-300 hover:text-white transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
