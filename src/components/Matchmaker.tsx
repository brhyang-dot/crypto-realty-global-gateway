import { useState } from "react";
import { Sparkles, ShieldCheck, Coins, HelpCircle, Compass, Zap, MapPin } from "lucide-react";
import { Listing } from "../types";

interface MatchmakerProps {
  listings: Listing[];
  onSelectMatch: (listingId: string, customBrief: string) => void;
  onClose: () => void;
}

export default function Matchmaker({ listings, onSelectMatch, onClose }: MatchmakerProps) {
  const [step, setStep] = useState(1);
  const [preferredCoin, setPreferredCoin] = useState("82SHOPS");
  const [preferredVibe, setPreferredVibe] = useState("lagoon"); // lagoon, alpine, yacht, cliff
  const [budgetRange, setBudgetRange] = useState("ultra"); // high, sovereign, ultra

  const handleMatchCalculation = () => {
    // Determine best match listing based on selections
    let bestMatchId = "prop-maldives"; // fallback default

    if (preferredVibe === "alpine") {
      bestMatchId = "prop-alps";
    } else if (preferredVibe === "cliff") {
      bestMatchId = "prop-seoul";
    } else if (preferredVibe === "yacht") {
      bestMatchId = budgetRange === "ultra" ? "prop-dubai" : "prop-cote-azur";
    } else {
      // lagoon vibe
      bestMatchId = budgetRange === "high" ? "prop-bali" : "prop-maldives";
    }

    // Generate a beautiful, custom, simulated investor profile string
    const coinNames: Record<string, string> = {
      "82SHOPS": "82SHOPS Exemption Tokens",
      "BTC": "Bitcoin Sovereign Escrows",
      "ETH": "Ethereum Smart Settlement",
      "SOL": "Solana High-Speed Layer-1 Assets"
    };

    const vibeNames: Record<string, string> = {
      "lagoon": "Maldives Overwater Lagoons",
      "alpine": "Swiss Alpine Geothermal Chalets",
      "yacht": "Dubai Harbour & Riviera Yacht Marinas",
      "cliff": "Seoul Elite Han River Estates"
    };

    const briefText = `Matched profile: Prefers ${coinNames[preferredCoin]} inside ${vibeNames[preferredVibe]} with ${
      budgetRange === "ultra" ? "maximum generational scale" : budgetRange === "sovereign" ? "strategic holding structures" : "high passive yield margins"
    }. Let's discuss physical deed transition!`;

    onSelectMatch(bestMatchId, briefText);
    setStep(3);
  };

  return (
    <div className="bg-[#fafcf6] border border-stone-200 rounded-2xl p-5 shadow-lg space-y-4 fade-in min-h-[480px] flex flex-col justify-between">
      <div>
        {/* Header decoration */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2">
            <Compass className="text-emerald-600 animate-spin-slow" size={16} />
            <h3 className="font-heading font-extrabold text-sm text-stone-900 tracking-tight uppercase">
              Elite Estate Matchmaker
            </h3>
          </div>
          <span className="text-[9px] font-mono text-emerald-805 text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded font-black uppercase">
            STEP {step} OF 3
          </span>
        </div>

        {step === 1 && (
          <div className="space-y-4 mt-3 fade-in">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-black text-emerald-700 uppercase tracking-widest block">
                Question 01
              </span>
              <h4 className="text-xs font-bold text-stone-900 text-sm">
                Which digital asset layer is your primary liquidation standard?
              </h4>
              <p className="text-[10px] text-stone-500 font-medium">
                Sovereign contracts will execute automatically in this chosen denomination.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "82SHOPS", name: "82SHOPS Token", desc: "5% Fee Exemption", rate: "◎ Native" },
                { id: "BTC", name: "Bitcoin (BTC)", desc: "Generational Value", rate: "₿ Layer-1" },
                { id: "ETH", name: "Ethereum (ETH)", desc: "Smart Escrows", rate: "Ξ Layer-1" },
                { id: "SOL", name: "Solana (SOL)", desc: "Instant Transfers", rate: "◎ Layer-1" }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setPreferredCoin(item.id)}
                  className={`p-3 rounded-xl border text-left transition select-none ${
                    preferredCoin === item.id
                      ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-extrabold"
                      : "bg-white border-stone-200 text-stone-600 font-bold hover:border-stone-400"
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>{item.name}</span>
                    <span className="text-[8px] font-mono text-emerald-800 font-black">{item.rate}</span>
                  </div>
                  <span className="text-[9px] block text-stone-500 mt-1">{item.desc}</span>
                </button>
              ))}
            </div>

            <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200 text-[10px] text-stone-605 text-stone-600 flex items-center gap-1.5 leading-relaxed font-mono font-bold shadow-sm">
              <Coins size={12} className="text-emerald-600" />
              <span>Native 82SHOPS token includes free Swiss trust structuring templates.</span>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 mt-3 fade-in">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-black text-emerald-700 uppercase tracking-widest block">
                Question 02
              </span>
              <h4 className="text-xs font-bold text-stone-900 text-sm">
                Describe your desired estate physical atmosphere and vibe:
              </h4>
            </div>

            <div className="space-y-2">
              {[
                { id: "lagoon", title: "Tropical Overwater Lagoon Retreat", desc: "Pristine waterslides, stargazing glass ceiling, and reef-rich lagoons." },
                { id: "alpine", title: "Swiss Alps Cantonal Timber Chalet", desc: "Ski-in ski-out high alpine trails, thermal pools, and custom private trust safes." },
                { id: "yacht", title: "Dubai & Riviera Deep-Water Yacht Mooring", desc: "Megayacht clearance berths, custom beachfront, and spectacular modern towers." },
                { id: "cliff", title: "Seoul Elite Han Riverfront Hilltop Penthouse", desc: "Reinforced steel framing, high security, river vistas, and biometric elevators." }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setPreferredVibe(item.id)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-3 transition ${
                    preferredVibe === item.id
                      ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-extrabold"
                      : "bg-white border-stone-200 text-stone-600 font-bold hover:border-stone-400"
                  }`}
                >
                  <div className={`h-2.5 w-2.5 rounded-full ${preferredVibe === item.id ? "bg-emerald-500 animate-pulse" : "bg-stone-300"}`} />
                  <div>
                    <div className="text-xs font-extrabold text-stone-900">{item.title}</div>
                    <div className="text-[9.5px] text-stone-500 mt-0.5 font-bold">{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="space-y-1 pt-1.5 border-t border-stone-200">
              <span className="text-[10px] font-mono font-black text-emerald-700 uppercase tracking-widest block">
                Question 03
              </span>
              <h4 className="text-xs font-bold text-stone-900 text-sm">Target Budget Class limits:</h4>
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {[
                  { id: "high", label: "Strategic ($3M-$7M)" },
                  { id: "sovereign", label: "Premium ($7M-$12M)" },
                  { id: "ultra", label: "Generational ($12M+)" }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setBudgetRange(item.id)}
                    className={`text-[9px] font-mono py-1.5 px-1.5 rounded-lg border text-center transition ${
                      budgetRange === item.id
                        ? "bg-emerald-500 border-emerald-600 text-white font-black"
                        : "bg-white border-stone-250 text-stone-500 font-bold hover:border-stone-400"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-6 mt-4 space-y-4 fade-in flex-1 flex flex-col justify-center items-center">
            <div className="relative">
              <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
              <div className="relative h-14 w-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <ShieldCheck size={28} />
              </div>
            </div>

            <div>
              <h4 className="font-heading font-black text-sm text-stone-905 text-stone-900">
                Sovereign Estate Sync Implemented!
              </h4>
              <p className="text-[11px] text-stone-605 text-stone-600 max-w-[290px] mx-auto mt-2 leading-relaxed font-semibold">
                We calculated your physical compatibility ratio at <span className="text-emerald-705 text-emerald-750 text-emerald-800 font-black font-mono">98.4%</span>.
                Your perfect matching listing is officially selected and highlighted on the map!
              </p>
            </div>

            <div className="text-[10.5px] font-mono text-stone-800 bg-stone-50 p-3 rounded-lg border border-stone-200 max-w-[280px] shadow-sm">
              <div className="text-[9px] text-stone-500 uppercase font-bold mb-1 flex items-center gap-1 justify-center font-mono">
                <MapPin size={9} className="text-emerald-600" />
                <span>Selected Destination Coords locked</span>
              </div>
              "Your personalized deed setup and trust planning is actively synced in the 1:1 broker dealroom."
            </div>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-stone-200 flex gap-2">
        {step < 3 ? (
          <>
            {step > 1 && (
              <button
                onClick={() => setStep(prev => prev - 1)}
                className="px-3 bg-stone-100 hover:bg-stone-200 hover:text-stone-900 border border-stone-250 text-stone-600 font-bold text-xs py-2 rounded-xl transition cursor-pointer"
              >
                Prev
              </button>
            )}
            <button
              onClick={step === 2 ? handleMatchCalculation : () => setStep(prev => prev + 1)}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-heading font-black text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/10"
            >
              <Sparkles size={12} className="text-white shrink-0" />
              <span>{step === 2 ? "Generate Sovereign Match" : "Proceed"}</span>
            </button>
          </>
        ) : (
          <button
            onClick={onClose}
            className="w-full bg-stone-905 bg-stone-900 hover:bg-stone-850 border border-stone-800 text-white font-heading font-black text-xs py-2.5 rounded-xl transition cursor-pointer"
          >
            Settle Into Dealroom Workspace
          </button>
        )}
      </div>
    </div>
  );
}
