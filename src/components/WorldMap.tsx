import React, { useState, useRef, useEffect } from "react";
import { Listing, MapNote } from "../types";
import { MapPin, MessageSquare, Landmark, Plus, Info, Sparkles, Navigation } from "lucide-react";

interface WorldMapProps {
  listings: Listing[];
  notes: MapNote[];
  selectedListingId: string | null;
  onSelectListing: (id: string | null) => void;
  selectedNoteId: string | null;
  onSelectNote: (note: MapNote | null) => void;
  onMapClickToAddNote: (lat: number, lng: number) => void;
}

export default function WorldMap({
  listings,
  notes,
  selectedListingId,
  onSelectListing,
  selectedNoteId,
  onSelectNote,
  onMapClickToAddNote
}: WorldMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredListing, setHoveredListing] = useState<Listing | null>(null);
  const [hoveredNote, setHoveredNote] = useState<MapNote | null>(null);

  // Convert (lat, lng) to (x%, y%) equirectangular projection coordinates
  const getCoordinatesPercent = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    
    // Prevent clicking a pin from triggering a new note popup
    const target = e.target as HTMLElement;
    if (target.closest('.map-element')) return;

    const rect = mapContainerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const xPercent = (clickX / rect.width) * 100;
    const yPercent = (clickY / rect.height) * 100;

    // Convert percent back to lat/lng
    const lng = (xPercent / 100) * 360 - 180;
    const lat = 90 - (yPercent / 100) * 180;

    // Call the parent handler to show note addition modal at clicked coord
    onMapClickToAddNote(parseFloat(lat.toFixed(4)), parseFloat(lng.toFixed(4)));
  };

  return (
    <div className="relative w-full rounded-2xl border border-stone-200 bg-white p-6 shadow-md overflow-hidden text-stone-900">
      {/* Map Header */}
      <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-heading text-lg font-bold text-stone-900 flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Real-Time Collaborative World Map Board</span>
            <span className="text-xs font-mono font-normal text-emerald-700 border border-emerald-400/40 px-2 py-0.5 rounded bg-emerald-50">
              LIVE BROADCAST
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Click any coordinate on the map to place a purchase request inquiry or broker advice pin.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-stone-100 border border-stone-200 px-2.5 py-1.5 rounded-md">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-stone-700">Active Listings</span>
          </div>
          <div className="flex items-center gap-1.5 bg-stone-100 border border-stone-200 px-2.5 py-1.5 rounded-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-stone-700">Shared Pins / Notes</span>
          </div>
        </div>
      </div>

      {/* Map Interactive Canvas */}
      <div 
        ref={mapContainerRef}
        onClick={handleMapClick}
        className="relative w-full aspect-[2/1] bg-[#e3e9f0] border border-stone-200 rounded-xl overflow-hidden cursor-crosshair select-none shadow-inner"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(16, 185, 129, 0.25) 1.5px, transparent 0),
            linear-gradient(to right, rgba(16, 185, 129, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16, 185, 129, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px, 4.16% 8.33%, 8.33% 4.16%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Beautiful tech display markings */}
        <div className="absolute top-2 left-3 font-mono text-[9px] text-stone-500 pointer-events-none tracking-widest leading-none">
          LATITUDE & LONGITUDE TRANSIT RECEPTOR <br/>
          SYS: ACTIVE // GP-82SHOPS-NETWORK
        </div>
        <div className="absolute bottom-2 right-3 font-mono text-[9px] text-stone-500 pointer-events-none tracking-wider">
          WGS 84 / MERCATOR PROJECTION SCREEN
        </div>

        {/* Major Latitude Lines Indicators */}
        <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-stone-300 pointer-events-none flex justify-between px-2">
          <span className="font-mono text-[8px] text-stone-500 -translate-y-2.5">(EQUATOR 0°N)</span>
          <span className="font-mono text-[8px] text-stone-500 -translate-y-2.5">0°W</span>
        </div>
        <div className="absolute top-0 bottom-0 left-1/2 border-l border-dashed border-stone-300 pointer-events-none flex flex-col justify-end p-2">
          <span className="font-mono text-[8px] text-stone-500 leading-none">PRIME MERIDIAN</span>
        </div>

        {/* Visual Simulated Continents Overlay for Atmosphere - Highly Visible Standard Coordinates Map */}
        <svg 
          viewBox="0 0 360 180" 
          className="absolute inset-0 w-full h-full opacity-[0.95] pointer-events-none z-10"
          preserveAspectRatio="none"
        >
          <g stroke="rgba(16, 185, 129, 0.45)" strokeWidth="0.8" fill="#ffffff">
            {/* North America */}
            <polygon points="30,15 95,15 115,22 135,28 128,45 118,52 124,68 112,78 100,75 92,60 76,58 64,42 42,48 30,35 15,30 20,20" />
            
            {/* Greenland */}
            <polygon points="110,8 140,8 152,18 135,25 115,18" />

            {/* South America */}
            <polygon points="102,78 124,78 142,95 150,110 135,145 120,165 115,165 106,120 96,95" />

            {/* Africa */}
            <polygon points="162,56 195,56 208,60 220,68 232,74 218,88 220,105 210,125 198,150 190,152 186,120 166,108 155,85 152,70" />

            {/* Eurasia (Europe & Asia) */}
            <polygon points="170,18 200,12 250,10 320,12 345,15 355,25 340,42 320,40 300,55 285,68 280,82 272,92 260,110 248,112 245,100 238,98 228,88 205,80 195,68 178,56 168,52 172,35" />

            {/* Southeast Asia Islands & Indonesia detail */}
            <polygon points="262,100 274,102 284,108 268,114 260,110" />

            {/* Australia & New Zealand */}
            <polygon points="280,115 315,115 328,125 330,142 325,155 310,155 292,148 274,136" />
          </g>

          {/* Cyan glow markers at major resort hubs */}
          <g fill="rgba(6, 182, 212, 0.75)">
            {/* Maldives Hub Anchor */}
            <circle cx="253.2" cy="86.8" r="3" className="animate-pulse" />
            {/* Saint-Tropez / Monaco Anchor */}
            <circle cx="186.8" cy="46.5" r="2.5" />
            {/* Swiss Alps Peak */}
            <circle cx="187.2" cy="43.9" r="2.5" />
            {/* Bali Hub */}
            <circle cx="295.1" cy="98.8" r="3" />
            {/* Hawaii Hub */}
            <circle cx="23.7" cy="69.2" r="3" className="animate-pulse" />
          </g>
        </svg>

        {/* MAP NOISE LABELS for Luxury Vibe */}
        <div className="absolute top-[25%] left-[20%] font-mono text-[10px] text-stone-500 font-bold pointer-events-none tracking-wide">
          NORTH AMERICA
        </div>
        <div className="absolute top-[60%] left-[30%] font-mono text-[10px] text-stone-500 font-bold pointer-events-none tracking-wide">
          SOUTH AMERICA
        </div>
        <div className="absolute top-[22%] left-[49%] font-mono text-[10px] text-stone-500 font-bold pointer-events-none tracking-wide">
          EUROPE
        </div>
        <div className="absolute top-[48%] left-[51%] font-mono text-[10px] text-stone-500 font-bold pointer-events-none tracking-wide">
          AFRICA
        </div>
        <div className="absolute top-[28%] left-[72%] font-mono text-[10px] text-stone-500 font-bold pointer-events-none tracking-wide">
          ASIA
        </div>
        <div className="absolute top-[72%] left-[81%] font-mono text-[10px] text-stone-500 font-bold pointer-events-none tracking-wide">
          OCEANIA
        </div>

        {/* Render Listings Pins */}
        {listings.map((l) => {
          const { x, y } = getCoordinatesPercent(l.coords.lat, l.coords.lng);
          const isSelected = selectedListingId === l.id;
          const isPending = l.status === "pending";
          const isSold = l.status === "sold";

          return (
            <div
              key={l.id}
              className="map-element absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
              style={{ left: `${x}%`, top: `${y}%` }}
              onMouseEnter={() => setHoveredListing(l)}
              onMouseLeave={() => setHoveredListing(null)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectListing(l.id);
              }}
            >
              {/* Highlight Circle for Selected Listing */}
              {isSelected && (
                <span className="absolute -inset-4 rounded-full bg-emerald-500/35 animate-ping pointer-events-none z-0" />
              )}
              
              {/* Pin UI */}
              <button 
                className={`relative flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 shadow-xl ${
                  isSelected
                    ? "bg-emerald-500 border-white text-white scale-125 z-40 shadow-emerald-500/30"
                    : isSold
                    ? "bg-stone-300 border-stone-400 text-stone-600 scale-90"
                    : isPending
                    ? "bg-purple-600 border-purple-300 text-[#ffffff] animate-pulse"
                    : "bg-[#ffffff] hover:bg-emerald-50 border-emerald-500 text-emerald-700 hover:scale-110"
                }`}
              >
                <Landmark size={14} className={isSelected ? "animate-bounce" : ""} />
                
                {/* Visual indicator of luxury status */}
                <span className={`absolute -top-1 -right-1 flex h-2.5 w-2.5 rounded-full ${
                  isSold ? "bg-red-500" : isPending ? "bg-purple-500" : "bg-emerald-400"
                }`} />
              </button>

              {/* Mini Info tooltip */}
              {hoveredListing?.id === l.id && (
                <div className="absolute bottom-9 left-1/2 -translate-x-1/2 bg-white border-2 border-emerald-500/80 px-3 py-2 rounded-xl text-stone-900 min-w-48 text-xs font-sans shadow-2xl pointer-events-none z-50">
                  <div className="font-bold text-stone-900 truncate">{l.title}</div>
                  <div className="text-[10px] text-stone-500 font-mono mt-0.5 mt-1 flex justify-between">
                    <span>{l.region} ({l.country})</span>
                    <span className="text-emerald-600 font-bold">${(l.priceUsd / 1000000).toFixed(1)}M USD</span>
                  </div>
                  <div className="flex gap-1 mt-1.5 overflow-hidden">
                    {l.coins.map(c => (
                      <span key={c} className="text-[9px] font-mono bg-stone-100 border border-stone-250 px-1.5 rounded text-stone-600">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Render Cooperative Map Notes */}
        {notes.map((n) => {
          const { x, y } = getCoordinatesPercent(n.lat, n.lng);
          const isSelected = selectedNoteId === n.id;
          const isAgent = n.role === "agent";

          return (
            <div
              key={n.id}
              className="map-element absolute -translate-x-1/2 -translate-y-1/2 z-10 group"
              style={{ left: `${x}%`, top: `${y}%` }}
              onMouseEnter={() => setHoveredNote(n)}
              onMouseLeave={() => setHoveredNote(null)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectNote(n);
              }}
            >
              {/* Map Note Anchor icon */}
              <button
                className={`relative flex h-7 w-7 items-center justify-center rounded-lg border transition-all duration-300 shadow-lg ${
                  isSelected
                    ? "bg-emerald-550 border-white text-white scale-125 z-40 shadow-emerald-500/30"
                    : isAgent
                    ? "bg-emerald-50 hover:bg-emerald-100 border-emerald-500 text-emerald-800 hover:scale-110"
                    : "bg-stone-50 hover:bg-stone-100 border-emerald-400 text-emerald-700 hover:scale-110"
                }`}
              >
                <MessageSquare size={13} className={isSelected ? "text-white" : ""} />
              </button>

              {/* Hover Box for Map Note */}
              {hoveredNote?.id === n.id && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white border-2 border-emerald-500 px-3 py-2.5 rounded-xl text-stone-800 min-w-56 text-xs font-sans shadow-2xl pointer-events-none z-50">
                  <div className="flex items-center justify-between text-[10px] font-mono text-emerald-700 mb-1 font-bold">
                    <span className="font-semibold">{n.author}</span>
                    <span className="opacity-80 font-normal">{n.coinType}</span>
                  </div>
                  <p className="text-stone-700 line-clamp-2 leading-relaxed text-[11px] font-sans">
                    {n.content}
                  </p>
                  <div className="text-[9px] text-stone-500 font-mono mt-1 text-right">
                    {n.timestamp}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Helper Legend Panel */}
      <div className="mt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-t border-stone-200 pt-4 text-xs text-stone-500">
        <div className="flex flex-wrap items-center gap-4 text-stone-600">
          <span className="flex items-center gap-1">
            <Info size={13} className="text-emerald-600" />
            <span>Click any coastal point or tourist spot on the map to drop a collaborative pin note.</span>
          </span>
        </div>
        <div className="font-mono text-[11px] text-stone-600 flex items-center gap-1.5 bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-lg font-medium">
          <Sparkles size={12} className="text-emerald-600 animate-pulse" />
          <span className="text-stone-800 font-bold">82SHOPS Token Special Exemption Active</span>
        </div>
      </div>
    </div>
  );
}
