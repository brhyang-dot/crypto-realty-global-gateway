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
    <div className="relative w-full rounded-2xl border border-stone-200 bg-white p-6 shadow-md overflow-hidden text-stone-900 font-sans">
      {/* Map Header */}
      <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-heading text-base md:text-lg font-black text-stone-900 flex flex-wrap items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-sky-55 px-1 py-1 rounded bg-sky-500 animate-pulse" />
            <span>Real-Time Collaborative World Map Board</span>
            <span className="text-[10px] md:text-xs font-mono font-black text-sky-700 border border-sky-300 px-2.5 py-0.5 rounded-lg bg-sky-50 uppercase">
              LIVE BROADCAST
            </span>
          </h2>
          <p className="text-xs md:text-sm text-stone-500 font-semibold mt-1">
            Click any coordinate on the map to place a purchase request inquiry or broker advice pin.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono font-bold">
          <div className="flex items-center gap-1.5 bg-stone-100 border border-stone-200 px-2.5 py-1.5 rounded-lg">
            <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
            <span className="text-stone-700">Active Listings</span>
          </div>
          <div className="flex items-center gap-1.5 bg-stone-100 border border-stone-200 px-2.5 py-1.5 rounded-lg">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
            <span className="text-stone-700">Shared Pins / Notes</span>
          </div>
        </div>
      </div>

      {/* Map Interactive Canvas */}
      <div 
        ref={mapContainerRef}
        onClick={handleMapClick}
        className="relative w-full aspect-[2/1] bg-[#eef8fe] border border-stone-200 rounded-xl overflow-hidden cursor-crosshair select-none shadow-inner"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(14, 165, 233, 0.2) 1.5px, transparent 0),
            linear-gradient(to right, rgba(14, 165, 233, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(14, 165, 233, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px, 4.16% 8.33%, 8.33% 4.16%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Beautiful tech display markings */}
        <div className="absolute top-2.5 left-3.5 font-mono text-[9px] md:text-[10px] text-stone-500 pointer-events-none tracking-widest leading-normal font-black">
          LATITUDE & LONGITUDE TRANSIT RECEPTOR <br/>
          SYS: ACTIVE // GP-82SHOPS-NETWORK
        </div>
        <div className="absolute bottom-2.5 right-3.5 font-mono text-[9px] md:text-[10px] text-stone-500 pointer-events-none tracking-wider font-semibold">
          WGS 84 / MERCATOR PROJECTION SCREEN
        </div>

        {/* Major Latitude Lines Indicators */}
        <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-stone-300 pointer-events-none flex justify-between px-2.5">
          <span className="font-mono text-[8px] md:text-[9.5px] text-stone-500 -translate-y-2.5 font-bold">(EQUATOR 0°N)</span>
          <span className="font-mono text-[8px] md:text-[9.5px] text-stone-500 -translate-y-2.5 font-bold">0°W</span>
        </div>
        <div className="absolute top-0 bottom-0 left-1/2 border-l border-dashed border-stone-300 pointer-events-none flex flex-col justify-end p-2.5">
          <span className="font-mono text-[8px] md:text-[9px] text-stone-500 leading-none font-bold">PRIME MERIDIAN</span>
        </div>

        {/* Visual Simulated Continents Overlay for Atmosphere - Highly Visible Standard Coordinates Map */}
        <svg 
          viewBox="0 0 360 180" 
          className="absolute inset-0 w-full h-full opacity-[0.95] pointer-events-none z-10"
          preserveAspectRatio="none"
        >
          <g stroke="rgba(14, 165, 233, 0.3)" strokeWidth="0.8" fill="#f6fbfd">
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
          <g fill="rgba(56, 189, 248, 0.7)">
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
        </svg>        {/* MAP NOISE LABELS for Luxury Vibe */}
        <div className="absolute top-[25%] left-[20%] font-mono text-[10px] text-stone-500 font-black pointer-events-none tracking-widest leading-none uppercase">
          NORTH AMERICA
        </div>
        <div className="absolute top-[60%] left-[30%] font-mono text-[10px] text-stone-500 font-black pointer-events-none tracking-widest leading-none uppercase">
          SOUTH AMERICA
        </div>
        <div className="absolute top-[22%] left-[49%] font-mono text-[10px] text-stone-500 font-black pointer-events-none tracking-widest leading-none uppercase">
          EUROPE
        </div>
        <div className="absolute top-[48%] left-[51%] font-mono text-[10px] text-stone-500 font-black pointer-events-none tracking-widest leading-none uppercase">
          AFRICA
        </div>
        <div className="absolute top-[28%] left-[72%] font-mono text-[10px] text-stone-500 font-black pointer-events-none tracking-widest leading-none uppercase">
          ASIA
        </div>
        <div className="absolute top-[72%] left-[81%] font-mono text-[10px] text-stone-500 font-black pointer-events-none tracking-widest leading-none uppercase">
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
                <span className="absolute -inset-4 rounded-full bg-sky-45 bg-sky-400/30 animate-ping pointer-events-none z-0" />
              )}
              
              {/* Pin UI */}
              <button 
                className={`relative flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 shadow-xl cursor-pointer ${
                  isSelected
                    ? "bg-sky-500 border-sky-300 text-white scale-125 z-40 shadow-sky-500/20 font-black"
                    : isSold
                    ? "bg-stone-300 border-stone-400 text-stone-605 scale-90"
                    : isPending
                    ? "bg-purple-600 border-purple-300 text-[#ffffff] animate-pulse"
                    : "bg-[#ffffff] hover:bg-stone-50 border-stone-400 text-stone-850 hover:scale-110"
                }`}
              >
                <Landmark size={14} className={isSelected ? "animate-bounce text-white" : "text-sky-600"} />
                
                {/* Visual indicator of luxury status */}
                <span className={`absolute -top-1 -right-1 flex h-2.5 w-2.5 rounded-full ${
                  isSold ? "bg-red-500" : isPending ? "bg-purple-500" : "bg-sky-500"
                }`} />
              </button>

              {/* Mini Info tooltip */}
              {hoveredListing?.id === l.id && (
                <div className="absolute bottom-9 left-1/2 -translate-x-1/2 bg-white border-2 border-sky-300 px-4 py-3 rounded-xl text-stone-900 min-w-56 text-xs font-sans shadow-2xl pointer-events-none z-50 animate-fade-in">
                  <div className="font-black text-xs md:text-sm text-[#111827] truncate leading-tight">{l.title}</div>
                  <div className="text-[10px] md:text-xs text-stone-500 font-mono mt-1.5 flex justify-between font-bold">
                    <span>{l.region} ({l.country})</span>
                    <span className="text-sky-700 font-black">${(l.priceUsd / 1000000).toFixed(1)}M USD</span>
                  </div>
                  <div className="flex gap-1 mt-2.5 overflow-hidden">
                    {l.coins.map(c => (
                      <span key={c} className="text-[9.5px] font-mono bg-sky-500 text-white border border-[#111827]/10 px-1.5 py-0.5 rounded-md font-black">
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
              {/* Highlight Circle for Selected Note Pin */}
              {isSelected && (
                <span className="absolute -inset-2.5 rounded-lg bg-sky-200/40 animate-ping pointer-events-none z-0" />
              )}

              {/* Map Note Anchor icon */}
              <button
                className={`relative flex h-7 w-7 items-center justify-center rounded-lg border transition-all duration-300 shadow-lg cursor-pointer ${
                  isSelected
                    ? "bg-sky-505 bg-sky-500 border-sky-300 text-white scale-125 z-40 shadow-stone-900/10 font-black"
                    : isAgent
                    ? "bg-sky-400/80 hover:bg-sky-500 text-white hover:scale-110 border-sky-300"
                    : "bg-white border-stone-300 text-stone-850 hover:scale-110"
                }`}
              >
                <MessageSquare size={13} className={isSelected ? "text-white" : "text-sky-600"} />
              </button>

              {/* Hover Box for Map Note */}
              {hoveredNote?.id === n.id && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white border border-stone-300 p-3.5 rounded-xl text-stone-800 min-w-60 text-xs font-sans shadow-2xl pointer-events-none z-50">
                  <div className="flex items-center justify-between text-[10px] md:text-xs font-mono text-sky-750 mb-1.5 font-black">
                    <span>{n.author}</span>
                    <span className="opacity-85">{n.coinType}</span>
                  </div>
                  <p className="text-stone-700 line-clamp-2 leading-relaxed text-xs font-bold font-sans">
                    {n.content}
                  </p>
                  <div className="text-[9.5px] text-stone-500 font-mono mt-2 text-right">
                    {n.timestamp}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Helper Legend Panel */}
      <div className="mt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-t border-stone-200 pt-4 text-xs text-stone-550 text-stone-500">
        <div className="flex flex-wrap items-center gap-4 text-stone-600 font-semibold">
          <span className="flex items-center gap-1.5">
            <Info size={14} className="text-sky-500" />
            <span>Click any coastal point or tourist spot on the map to drop a collaborative pin note.</span>
          </span>
        </div>
        <div className="font-mono text-[11px] text-stone-600 flex items-center gap-1.5 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-lg font-black shrink-0">
          <Sparkles size={13} className="text-sky-500 animate-pulse" />
          <span className="text-sky-700">82SHOPS Token Special Exemption Active</span>
        </div>
      </div>
    </div>
  );
}
