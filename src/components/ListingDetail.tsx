import { useState } from "react";
import { Listing, Agent } from "../types";
import { 
  Landmark, 
  MapPin, 
  Wallet, 
  Sparkles, 
  ShieldCheck, 
  Scale, 
  Coins, 
  Fingerprint, 
  CheckCircle,
  AlertTriangle,
  Lock,
  PhoneCall,
  ExternalLink,
  Globe2
} from "lucide-react";

interface ListingDetailProps {
  listing: Listing | null;
  agent: Agent | null;
  onOpenOfferModal: (listing: Listing) => void;
  onBrowseAgentChat: (agentId: string) => void;
}

interface RegionalLawInfo {
  taxes: string;
  ownership: string;
  residency: string;
  exclusivityHash: string;
  escrowNode: string;
  commission: string;
}

const REGIONAL_LAWS: Record<string, RegionalLawInfo> = {
  "prop-maldives": {
    taxes: "10% TGST (Tourism Goods & Services Tax) applicable on luxury resort long-term leases. 0% personal capital gains.",
    ownership: "35-Year Renewable Leasehold. Multi-sig escrow locks guarantee automatic title succession upon payment validation.",
    residency: "Qualified for the 5-Year Maldivian Elite Residence Visa automatically on transactions over $1,000,000 USD.",
    exclusivityHash: "MDV-092-ESCROW-SEAL-82S",
    escrowNode: "Malé Sovereign Node #09",
    commission: "2.4% with 82SHOPS discount applied"
  },
  "prop-hawaii": {
    taxes: "4.5% Hawaiian conveyance tax + 15% FIRPTA backup withholding protection automatically structured via qualified escrows.",
    ownership: "100% Feehold residential deed. Cryptographic land registry mirror is compiled with the Maui County Clerk.",
    residency: "Eligible for US EB-5 investor visa pathways through registered smart trust corporate routing.",
    exclusivityHash: "USA-HI-382-CLIFF-ESTATES-MUI",
    escrowNode: "Honolulu Ocean Node #44",
    commission: "2.8% exclusive listing fee"
  },
  "prop-cote-azur": {
    taxes: "5.1% French asset transfer duty. Opt-in virtual SCI holding entity eliminates standard European luxury wealth taxes (IFI).",
    ownership: "100% Freehold estate. Deep-water yacht docking certificate officially registered with the Toulon Maritime Port.",
    residency: "Compliant EU Golden Residency fast-route counseling included. Automatic Schengen clearance guarantees.",
    exclusivityHash: "FRA-COT-771-ROYAL-COBALT-82S",
    escrowNode: "Nice Riviera Node #12",
    commission: "3.0% with multi-sig secure processing"
  },
  "prop-alps": {
    taxes: "Cantonal Verbier property levy capped at 3.3%. Capital gains tax-sheltering through Zug trust structures.",
    ownership: "Lex Koller compliant. Non-Swiss resident quota pre-cleared for the maximum 200 sqm residential frame.",
    residency: "Swiss Cantonal tax privilege residency privilege qualifying option for qualifying HNW accounts.",
    exclusivityHash: "CHE-ZUG-119-ALPS-CASTLE-VERB",
    escrowNode: "Zug Valley Consensus Node #82",
    commission: "2.5% fixed premium broker fee"
  },
  "prop-bali": {
    taxes: "11% Indonesian VAT on sales transaction + 2.5% transfer duty. Tax shelter optimization supported through Tallinn hubs.",
    ownership: "Hak Pakai (Right to Use / Protected Freehold equivalent) for 30 years + pre-guaranteed 20-year extension contracts.",
    residency: "Indonesian Second Home Golden Visa (10 Years residency) backed by registered luxury land investment.",
    exclusivityHash: "IDN-BAL-884-ULU-GENESIS-CLIFF",
    escrowNode: "Denpasar East Node #55",
    commission: "2.0% with 82SHOPS coin rebate"
  },
  "prop-monaco": {
    taxes: "0% Income, 0% Capital Gains, and 0% property taxes. Pure offshore generational estate sanctuary.",
    ownership: "Freehold luxury title deed with premium priority voting rights in the Monte Carlo Bay Club syndicate.",
    residency: "Direct Monaco Bank clearance references and residency fast-track assistance provided for HNW investors.",
    exclusivityHash: "MCO-MON-513-PENTHOUSE-BAY-82S",
    escrowNode: "Monte Carlo Harbor Hub Node #01",
    commission: "3.5% premium high-security fee"
  }
};

export default function ListingDetail({
  listing,
  agent,
  onOpenOfferModal,
  onBrowseAgentChat
}: ListingDetailProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "legal" | "exclusivity">("overview");

  const exchangeRates = {
    BTC: 70000,
    ETH: 3500,
    SOL: 150,
    "82SHOPS": 2.5
  };  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] rounded-2xl border border-dashed border-sky-300 bg-white/70 p-8 text-center text-slate-900 shadow-sm">
        <div className="relative mb-4">
          <span className="absolute inset-0 rounded-full bg-sky-200/25 animate-ping" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 border border-sky-300 text-sky-750">
            <Landmark size={24} className="text-sky-600" />
          </div>
        </div>
        <p className="font-heading text-base font-bold text-slate-900">Exclusive Luxury Estates Awaiting</p>
        <p className="text-xs md:text-sm text-slate-600 max-w-[280px] mt-2 leading-relaxed">
          Click on any estate icon (<Landmark size={14} className="inline mx-0.5 text-sky-600" />) on the world map to retrieve detailed collateral quote conversions, property profiles, and instant AI broker connections.
        </p>
      </div>
    );
  }

  const isSold = listing.status === "sold";
  const isPending = listing.status === "pending";
  const lawInfo = REGIONAL_LAWS[listing.id] || {
    taxes: "Subject to destination municipality criteria. Coordinated by our registered block broker.",
    ownership: "Traditional real-estate registry backed by multi-sig secure digital smart escrow.",
    residency: "Investment-based residency eligibility depends on local sovereign legislation.",
    exclusivityHash: "GENERIC-82S-SECURE-DEED-DEAL",
    escrowNode: "Global Sovereign Relay",
    commission: "2.5% standard escrow fee"
  };

  return (
    <div className="flex flex-col rounded-2xl border border-sky-200 bg-white/95 overflow-hidden h-[600px] shadow-md text-slate-900">
      {/* Luxury Estate Hero Image */}
      <div className="relative h-44 w-full shrink-0">
        <img 
          src={listing.image} 
          alt={listing.title} 
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-transparent to-black/30" />
        
        {/* Elite badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`text-[10px] uppercase font-mono tracking-widest px-3 py-1 rounded font-black ${
            isSold 
              ? "bg-red-650 text-white" 
              : isPending 
              ? "bg-amber-500 text-stone-950" 
              : "bg-sky-500 text-white shadow-sm"
          }`}>
            {isSold ? "SOLD OUT" : isPending ? "ESCROW OPEN" : "EXCLUSIVE VERIFIED"}
          </span>
          <span className="text-xs font-mono bg-white text-sky-700 border border-sky-250 px-2.5 py-1 rounded-lg backdrop-blur-sm font-extrabold shadow-sm">
            {listing.sizeSqm} ㎡
          </span>
        </div>

        {/* Coords overlay */}
        <div className="absolute bottom-3 right-3 font-mono text-xs text-sky-700 bg-white/95 border border-sky-200 px-3 py-1.5 rounded-lg backdrop-blur-sm flex items-center gap-1 font-bold shadow-sm">
          <MapPin size={11} className="text-sky-500" />
          <span>{listing.coords.lat.toFixed(4)}°N, {listing.coords.lng.toFixed(4)}°E</span>
        </div>
      </div>

      {/* Amazon-style Property & Broker Verification Title Bar */}
      <div className="bg-sky-100 px-4 py-3 border-b border-sky-200 flex justify-between items-center text-xs font-mono text-slate-800">
        <span className="text-slate-650">ID: <span className="text-sky-750 font-bold">{listing.id.toUpperCase()}</span></span>
        <span className="flex items-center gap-1 text-sky-750 font-extrabold uppercase">
          <ShieldCheck size={13} className="text-sky-600" />
          <span>82SHOPS VERIFIED CONTRACT SECURED</span>
        </span>
      </div>

      {/* Primary Eye-Catching Banner for Global Real-World Asset Insights */}
      <div className="shrink-0 p-3 bg-sky-50/50 border-b border-sky-150 space-y-2">
        {/* Working Global Hub */}
        <a 
          href="https://82shops.com/category/global-property-insights/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between gap-3 bg-white hover:bg-sky-500 hover:text-white border border-sky-200 p-3.5 rounded-xl transition-all duration-300 shadow-sm group select-none cursor-pointer text-slate-800"
          title="Explore general legal deeds & insights directly on 82SHOPS"
          id={`hero-btn-explore-global-${listing.id}`}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 group-hover:bg-sky-600 group-hover:text-white text-sky-700 transition-colors border border-sky-200">
              <Globe2 size={16} className="animate-spin-slow" />
            </div>
            <div className="text-left">
              <span className="block text-[10px] font-mono text-sky-750 font-extrabold uppercase tracking-widest">
                WORKING MASTER HUB 🌐
              </span>
              <span className="block text-sm font-heading font-black text-slate-900 group-hover:text-white transition-colors">
                Global Property Insights
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-mono bg-sky-100 text-sky-700 px-3 py-1 rounded-lg border border-sky-200 font-black shadow-sm">
            LIVE ↗
          </div>
        </a>

        {/* Specific Properties Category (Beta) */}
        {listing.exploreUrl && (
          <div className="flex flex-col gap-1.5">
            <a 
              href={listing.exploreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between gap-2.5 bg-white hover:bg-sky-50 border border-sky-200 px-3 py-2.5 rounded-xl text-slate-700 transition-all text-xs"
              title="Category stream link -- Note: Individual category posts may still be pending on Wordpress."
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                <span className="font-heading font-extrabold text-sky-750 text-sm">
                  {listing.region} Category Stream (BETA)
                </span>
              </div>
              <span className="text-xs text-sky-700 font-mono bg-sky-100 border border-sky-200 px-2 py-0.5 rounded-lg font-bold">
                Pending Sync ↗
              </span>
            </a>
            <span className="text-[10px] text-slate-500 font-sans leading-relaxed px-1">
              ※ Category upload under main site properties may occasionally display a temporary 404. Master <b>[Global Property Insights]</b> option remains fully live on 82shops.
            </span>
          </div>
        )}
      </div>

      {/* Hybrid Detail Navigation Tabs */}
      <div className="flex bg-sky-100 border-b border-sky-250 shrink-0">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex-1 text-center font-heading font-black text-xs md:text-sm py-3 transition border-b-2 uppercase tracking-wide cursor-pointer ${
            activeTab === "overview"
              ? "border-sky-500 text-sky-700 bg-white"
              : "border-transparent text-slate-600 hover:text-slate-950 hover:bg-sky-50"
          }`}
        >
          Overview & Value
        </button>
        <button
          onClick={() => setActiveTab("legal")}
          className={`flex-1 text-center font-heading font-black text-xs md:text-sm py-3 transition border-b-2 uppercase tracking-wide cursor-pointer ${
            activeTab === "legal"
              ? "border-sky-500 text-sky-700 bg-white"
              : "border-transparent text-slate-600 hover:text-slate-950 hover:bg-sky-50"
          }`}
        >
          Tax & Local Laws
        </button>
        <button
          onClick={() => setActiveTab("exclusivity")}
          className={`flex-1 text-center font-heading font-black text-xs md:text-sm py-3 transition border-b-2 uppercase tracking-wide cursor-pointer ${
            activeTab === "exclusivity"
              ? "border-sky-500 text-sky-700 bg-white"
              : "border-transparent text-slate-600 hover:text-slate-950 hover:bg-sky-50"
          }`}
        >
          Anti-Bypass Protection
        </button>
      </div>

      {/* Listing Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        
        {activeTab === "overview" && (
          <div className="space-y-5 fade-in">
            {/* Title Block */}
            <div>
              <div className="text-xs font-mono text-sky-700 uppercase tracking-widest mb-1.5 font-bold flex items-center gap-1.5">
                <span>{listing.resort}</span>
                <span>•</span>
                <span>{listing.region} ({listing.country})</span>
              </div>
              <h2 className="font-heading text-base md:text-lg font-black text-slate-900 leading-snug">
                {listing.title}
              </h2>
            </div>

            {/* Amazon Style Price Conversion Widget */}
            <div className="bg-sky-55 bg-sky-50/50 rounded-xl border border-sky-150 p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-sm pb-2 border-b border-sky-150">
                <span className="text-slate-655 text-slate-600 font-extrabold">Standard Appraisal (USD)</span>
                <span className="font-mono text-sky-850 text-base font-black">${listing.priceUsd.toLocaleString()}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 pt-1.5">
                {listing.coins.map((coin) => {
                  const rate = exchangeRates[coin as keyof typeof exchangeRates] || 1;
                  const coinValue = (listing.priceUsd / rate).toLocaleString(undefined, { maximumFractionDigits: 1 });
                  const is82s = coin === "82SHOPS";

                  return (
                    <div key={coin} className={`p-3 rounded-xl border flex flex-col justify-between transition hover:border-[#38bdf8] ${
                      is82s ? "bg-sky-100 border-sky-305" : "bg-white border-sky-150 shadow-sm"
                    }`}>
                      <span className={`text-xs font-mono font-bold flex items-center gap-1.5 leading-none ${
                        is82s ? "text-sky-750" : "text-slate-500"
                      }`}>
                        {coin} Swap
                        {is82s && <Sparkles size={11} className="text-sky-600 animate-pulse" />}
                      </span>
                      <span className="text-sm md:text-base font-mono font-black text-slate-900 mt-1.5">
                        {coinValue} <span className="text-xs font-medium text-slate-500">{coin}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Features layout */}
            <div className="space-y-2">
              <h4 className="text-[11px] uppercase tracking-wider font-mono font-black text-sky-700">Exclusive Luxury Accents</h4>
              <div className="grid grid-cols-2 gap-2">
                {listing.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-xs text-slate-700">
                    <div className="h-2 w-2 rounded-full bg-sky-500 shrink-0" />
                    <span className="truncate font-semibold">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Brief info */}
            <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-sans bg-sky-50/50 p-3 rounded-xl border border-sky-150">
              {listing.description}
            </p>

            {/* Direct exploration Url (Explore Asset) */}
            <div className="pt-1.5">
              <a 
                href="https://82shops.com/category/global-property-insights/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 font-heading font-black text-xs md:text-sm py-3 rounded-xl text-white transition shadow-sm cursor-pointer"
                id={`btn-explore-${listing.id}`}
                title="Sovereign Deeds are synchronized. Redirect to Real-world 82shops.com Intelligence Hub."
              >
                <Globe2 size={14} className="text-white" />
                <span>Explore Real-World Insights (🌐)</span>
              </a>
            </div>
          </div>
        )}

        {activeTab === "legal" && (
          <div className="space-y-4 fade-in">
            <div className="flex items-center gap-2 text-slate-900 border-b border-sky-150 pb-2.5">
              <Scale size={16} className="text-sky-500" />
              <h4 className="text-sm font-black font-heading uppercase text-sky-700">Sovereign Compliance & Tax Report</h4>
            </div>

            <div className="space-y-3.5 font-sans text-xs">
              <div className="bg-sky-50/50 p-3.5 rounded-xl border border-sky-150 space-y-1.5 shadow-sm">
                <div className="text-[11px] font-mono text-sky-750 font-black uppercase">Local Real Estate & Capital Gains Taxes</div>
                <p className="text-xs text-slate-700 leading-relaxed font-semibold">{lawInfo.taxes}</p>
              </div>

              <div className="bg-sky-50/50 p-3.5 rounded-xl border border-sky-150 space-y-1.5 shadow-sm">
                <div className="text-[11px] font-mono text-sky-750 font-black uppercase">Land Acquisition & Property Title System</div>
                <p className="text-xs text-slate-700 leading-relaxed font-semibold">{lawInfo.ownership}</p>
              </div>

              <div className="bg-sky-50/50 p-3.5 rounded-xl border border-sky-150 space-y-1.5 shadow-sm">
                <div className="text-[11px] font-mono text-sky-750 font-black uppercase">Investment-Based Residency Perks</div>
                <p className="text-xs text-slate-700 leading-relaxed font-semibold">{lawInfo.residency}</p>
              </div>

              <div className="bg-sky-50/20 p-3 rounded-xl border border-sky-150 flex justify-between items-center shadow-sm">
                <span className="text-xs font-mono text-slate-500 font-bold">Escrow Fee Estimate:</span>
                <span className="font-mono text-xs font-black text-sky-700">{lawInfo.commission}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "exclusivity" && (
          <div className="space-y-4 fade-in">
            {/* Anti-Bypass Header */}
            <div className="flex items-center gap-2 text-slate-900 border-b border-sky-150 pb-2.5">
              <Lock size={16} className="text-sky-500" />
              <h4 className="text-sm font-black font-heading uppercase text-sky-700">Cryptographic Anti-Bypass Guard</h4>
            </div>

            {/* Warning explain */}
            <div className="bg-[#fffbeb] border border-amber-200 rounded-xl p-4 text-xs leading-relaxed text-amber-900 flex gap-2.5 shadow-sm">
              <ShieldCheck className="text-amber-600 shrink-0 mt-0.5" size={18} />
              <div>
                <span className="font-black text-amber-955 text-sm block mb-1">Exclusivity Seal Guarantee</span>
                To prevent unverified list takeovers, image cloning, or direct circumvention, this listing is cryptographically registered to representing Broker and 82SHOPS escrow nodes. Offline bypassed deals void developer maintenance and title warranties.
              </div>
            </div>

            {/* Technical credentials */}
            <div className="bg-sky-50/50 rounded-xl p-4 border border-sky-150 font-mono text-xs space-y-2 text-slate-700 shadow-inner">
              <div className="text-slate-500 text-[10px] pb-1.5 border-b border-sky-150 font-black tracking-wider">DIGITAL DEED REGISTRY METADATA</div>
              
              <div className="flex justify-between">
                <span className="text-slate-500 uppercase">Exclusive Seal Code:</span>
                <span className="text-slate-900 font-bold text-xs">{lawInfo.exclusivityHash}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500 uppercase">Consensus Node:</span>
                <span className="text-slate-900 font-black">{lawInfo.escrowNode}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500 uppercase">Arbitration Court:</span>
                <span className="text-sky-750 font-black">International Cryptographic Court (ICC)</span>
              </div>

              <div className="flex justify-between font-bold">
                <span className="text-slate-500">DEAL STEWARD ID:</span>
                <span className="text-sky-750 font-black">STEWARD-SECURE-8200</span>
              </div>

              <div className="pt-2 border-t border-sky-150 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-bold">SIGNATURE ALGORITHM</span>
                <span className="text-[10px] text-sky-600 font-black">SHA-256 / LOCK-ENABLED</span>
              </div>
            </div>

            <div className="text-center p-3 rounded-xl bg-sky-50 border border-sky-150 shadow-sm">
              <span className="text-xs text-sky-750 font-mono italic font-bold">
                Deed rights can ONLY be extracted directly through the "Submit Offer" action link.
              </span>
            </div>
          </div>
        )}

        {/* Assigned Broker detail card always visible inside active tabs to encourage communication */}
        {agent && (
          <div className="mt-5 border-t border-sky-200 pt-5">
            <div className="bg-sky-100/60 hover:bg-sky-100 border border-sky-150 rounded-xl p-4 space-y-4.5 transition shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={agent.avatar} 
                      alt={agent.name} 
                      className="h-12 w-12 rounded-full object-cover border-2 border-sky-400"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border border-white animate-pulse" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-sky-600 font-black uppercase tracking-wide">Vetted Sole Representative</div>
                    <div className="text-sm font-black text-slate-900">{agent.name}</div>
                    <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-1 font-bold">
                      <Globe2 size={11} className="text-slate-450" />
                      <span>{agent.language}</span>
                    </div>
                  </div>
                </div>
                
                {/* Visual verified badge */}
                <span className="text-xs font-mono bg-white border border-sky-250 px-2.5 py-1 rounded-lg text-sky-700 font-black shadow-sm">
                  LICID #82-PREMIUM
                </span>
              </div>

              {/* Broker micro details list */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-600 border-t border-sky-150 pt-3">
                <div className="flex items-center gap-1.5 font-bold">
                  <PhoneCall size={11} className="text-slate-500" />
                  <span>SECURE LINE ACTIVE</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold col-span-1">
                  <Coins size={11} className="text-sky-655 text-sky-600" />
                  <span className="truncate">MAPPED: {agent.coinSpecialties.join(", ")}</span>
                </div>
              </div>

              {/* Instant Contact button trigger */}
              <div className="flex gap-2.5 pt-1 font-sans">
                <button 
                  onClick={() => onBrowseAgentChat(agent.id)}
                  className="flex-1 text-center font-heading font-black text-xs md:text-sm tracking-wide text-white bg-sky-500 hover:bg-sky-600 border border-sky-500 py-2.5 rounded-xl transition cursor-pointer shadow-sm"
                >
                  Encrypt-Chat Rep
                </button>
                <a 
                  href={`mailto:slynderk@gmail.com?subject=Inquiry on ${encodeURIComponent(listing.title)}`}
                  className="px-4 flex items-center justify-center bg-sky-100 hover:bg-sky-200 text-sky-700 border border-sky-200 rounded-xl transition cursor-pointer"
                  title="Direct Sovereign Escalation Request"
                >
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Primary Call to actions Footer */}
      <div className="p-4 bg-sky-100 border-t border-sky-200 flex gap-2 shrink-0 font-sans">
        <button
          disabled={isSold}
          onClick={() => onOpenOfferModal(listing)}
          className={`flex-1 flex items-center justify-center gap-2.5 font-heading font-black text-xs md:text-sm py-3.5 rounded-xl transition ${
            isSold 
              ? "bg-slate-200 text-slate-450 cursor-not-allowed border border-slate-300"
              : isPending
              ? "bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shadow-md active:scale-95 animate-pulse"
              : "bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white cursor-pointer shadow-md active:scale-95 border border-sky-400"
          }`}
        >
          <Wallet size={14} />
          <span>{isSold ? "Asset Sold / Closed" : isPending ? "Submit Competing Offer" : "Submit Smart Escrow Coin Offer"}</span>
        </button>
      </div>
    </div>
  );
}

