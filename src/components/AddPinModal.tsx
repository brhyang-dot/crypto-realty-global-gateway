import React, { useState } from "react";
import { X, MapPin, MessageCircle, Sparkles, Navigation } from "lucide-react";

interface AddPinModalProps {
  isOpen: boolean;
  lat: number;
  lng: number;
  onClose: () => void;
  onSubmitNote: (
    author: string,
    role: "buyer" | "agent" | "vip",
    content: string,
    coinType: string,
    type: "broker_tip" | "buy_inquiry" | "market_alert"
  ) => Promise<void>;
}

export default function AddPinModal({
  isOpen,
  lat,
  lng,
  onClose,
  onSubmitNote
}: AddPinModalProps) {
  const [author, setAuthor] = useState("");
  const [role, setRole] = useState<"buyer" | "agent" | "vip">("buyer");
  const [content, setContent] = useState("");
  const [coinType, setCoinType] = useState("82SHOPS");
  const [type, setType] = useState<"broker_tip" | "buy_inquiry" | "market_alert">("buy_inquiry");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmitNote(author, role, content, coinType, type);
      setAuthor("");
      setContent("");
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4.5 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 rounded-full bg-sky-505 bg-sky-500 animate-pulse" />
            <h3 className="font-heading font-black text-[#111827] text-sm md:text-base uppercase tracking-tight">
              Deploy Collaborative Pin Coordinates
            </h3>
          </div>
          <button 
            disabled={isSubmitting}
            onClick={onClose}
            className="text-stone-400 hover:text-stone-900 transition p-1 hover:bg-stone-100 rounded-lg cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Info Coordinate Banner bar */}
        <div className="flex items-center gap-2.5 bg-stone-50 border-b border-stone-200 p-4 px-6 text-xs md:text-sm font-mono text-stone-600">
          <Navigation size={14} className="text-sky-500 animate-pulse fill-sky-100" />
          <span>FIXED COORDINATES:</span>
          <span className="text-[#111827] font-black">{lat.toFixed(4)}°N, {lng.toFixed(4)}°E</span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Author Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wide">Sender Identity (Author/Firm Name)</label>
            <input 
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g., Cryptobuyer Corp, VIP Global Capital"
              className="w-full bg-white border border-stone-250 focus:border-sky-500 rounded-xl px-4 py-3 text-xs md:text-sm text-[#111827] font-semibold focus:outline-none placeholder-stone-400 transition"
            />
          </div>

          {/* Role selector and Type selector */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#374151] uppercase tracking-wide">Sender Role Credentials</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-white border border-stone-250 focus:border-sky-500 rounded-xl p-3 text-xs md:text-sm text-[#111827] font-semibold focus:outline-none transition cursor-pointer"
              >
                <option value="buyer">High Net Worth Buyer</option>
                <option value="agent">Certified Broker / Agent</option>
                <option value="vip">82SHOPS VIP Shareholder</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#374151] uppercase tracking-wide">Message Category Pin</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-white border border-stone-250 focus:border-sky-500 rounded-xl p-3 text-xs md:text-sm text-[#111827] font-semibold focus:outline-none transition cursor-pointer"
              >
                <option value="buy_inquiry">Purchase Intent Inquiry</option>
                <option value="broker_tip">Off-Market Broker Tip</option>
                <option value="market_alert">Urgent Global Warning</option>
              </select>
            </div>
          </div>

          {/* Featured Coin Badge */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#374151] uppercase tracking-wide">Preferred Crypto Layer</label>
            <div className="flex flex-wrap gap-2">
              {["82SHOPS", "BTC", "ETH", "SOL", "USDT"].map((coin) => (
                <button
                  key={coin}
                  type="button"
                  onClick={() => setCoinType(coin)}
                  className={`text-xs md:text-sm px-4 py-2 rounded-xl border transition font-mono cursor-pointer ${
                    coinType === coin
                      ? "bg-sky-100 border-sky-305 text-sky-700 font-black"
                      : "bg-white border-stone-250 text-stone-600 hover:border-stone-400 font-bold"
                  }`}
                >
                  {coin}
                </button>
              ))}
            </div>
          </div>

          {/* Message content text area */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#374151] uppercase tracking-wide">Shared Pin Message Content</label>
            <textarea
              required
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter specific transaction goals, collateral queries, or off-market requests to broadcast on the world map."
              className="w-full bg-white border border-stone-250 focus:border-sky-500 rounded-xl p-3.5 text-xs md:text-sm text-[#111827] font-semibold focus:outline-none placeholder-stone-400 resize-none leading-relaxed transition"
            />
          </div>

          {/* Action Footer */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-250 font-heading font-black text-xs md:text-sm py-3 rounded-xl transition cursor-pointer"
            >
              Cancel / Close
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !author.trim() || !content.trim()}
              className="flex-1 bg-sky-500 hover:bg-sky-600 disabled:bg-stone-100 disabled:text-stone-400 text-white font-heading font-black text-xs md:text-sm py-3 rounded-xl transition cursor-pointer shadow-md shadow-sky-500/10"
            >
              {isSubmitting ? "Broadcasting pin..." : "Broadcast Pin Node"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
