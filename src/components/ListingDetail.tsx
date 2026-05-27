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
  };
  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
        <div className="relative mb-4">
          <span className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white border border-stone-200 text-stone-500">
            <Landmark size={24} className="text-emerald-500" />
          </div>
        </div>
        <p className="font-heading text-sm font-bold text-stone-800">Exclusive Luxury Estates Awaiting</p>
        <p className="text-xs text-stone-600 max-w-[280px] mt-1.5 leading-relaxed">
          Click on any estate icon (<Landmark size={12} className="inline mx-0.5 text-emerald-500" />) on the world map to retrieve detailed collateral quote conversions, property profiles, and instant AI broker connections.
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
    <div className="flex flex-col rounded-2xl border border-stone-200 bg-white overflow-hidden h-[600px] shadow-lg text-stone-900">
      {/* Luxury Estate Hero Image */}
      <div className="relative h-44 w-full shrink-0">
        <img 
          src={listing.image} 
          alt={listing.title} 
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f6]/95 via-transparent to-black/30" />
        
        {/* Elite badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`text-[9px] uppercase font-mono tracking-widest px-2.5 py-1 rounded font-black ${
            isSold 
              ? "bg-red-550 text-white" 
              : isPending 
              ? "bg-amber-500 text-stone-950" 
              : "bg-emerald-500 text-white"
          }`}>
            {isSold ? "SOLD OUT" : isPending ? "ESCROW OPEN" : "EXCLUSIVE VERIFIED"}
          </span>
          <span className="text-[10px] font-mono bg-white/90 text-emerald-700 border border-emerald-500/20 px-2 py-0.5 rounded backdrop-blur-sm font-bold">
            {listing.sizeSqm} ㎡
          </span>
        </div>

        {/* Coords overlay */}
        <div className="absolute bottom-3 right-3 font-mono text-[9px] text-stone-800 bg-white/90 border border-stone-250 px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1 font-bold">
          <MapPin size={9} className="text-emerald-600" />
          <span>{listing.coords.lat.toFixed(4)}°N, {listing.coords.lng.toFixed(4)}°E</span>
        </div>
      </div>

      {/* Amazon-style Property & Broker Verification Title Bar */}
      <div className="bg-stone-50 px-4 py-2 border-b border-stone-200 flex justify-between items-center text-[10px] font-mono">
        <span className="text-stone-500">ID: <span className="text-stone-800 font-bold">{listing.id.toUpperCase()}</span></span>
        <span className="flex items-center gap-1 text-emerald-755 font-bold">
          <ShieldCheck size={11} className="text-emerald-600" />
          <span>82SHOPS VERIFIED CONTRACT SECURED</span>
        </span>
      </div>

      {/* Primary Eye-Catching Banner for Global Real-World Asset Insights */}
      <div className="shrink-0 p-3 bg-stone-50/50 border-b border-stone-200 space-y-2">
        {/* Working Global Hub */}
        <a 
          href="https://82shops.com/category/global-property-insights/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between gap-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 hover:from-emerald-500 hover:to-teal-500 hover:text-white border border-emerald-200 p-3 rounded-xl transition-all duration-300 shadow-sm group select-none cursor-pointer text-stone-800"
          title="Explore general legal deeds & insights directly on 82SHOPS"
          id={`hero-btn-explore-global-${listing.id}`}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 group-hover:bg-white text-emerald-700 group-hover:text-emerald-600 transition-colors">
              <Globe2 size={15} className="animate-spin-slow" />
            </div>
            <div className="text-left">
              <span className="block text-[8px] font-mono text-emerald-600 font-extrabold uppercase tracking-widest group-hover:text-white-85">
                WORKING MASTER HUB 🌐
              </span>
              <span className="block text-[11px] font-heading font-black group-hover:text-white transition-colors">
                Global Property Insights
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[9px] font-mono bg-emerald-100 group-hover:bg-white/20 text-emerald-700 group-hover:text-white px-2.5 py-1 rounded border border-emerald-200 font-black">
            LIVE ↗
          </div>
        </a>

        {/* Specific Properties Category (Beta) */}
        {listing.exploreUrl && (
          <div className="flex flex-col gap-1">
            <a 
              href={listing.exploreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between gap-2.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 hover:border-stone-300 px-3 py-2 rounded-lg text-stone-700 hover:text-stone-900 transition-all text-xs"
              title="Category stream link -- Note: Individual category posts may still be pending on Wordpress."
            >
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="font-heading font-bold text-[10px] text-stone-800">
                  {listing.region} Category Stream (BETA)
                </span>
              </div>
              <span className="text-[9px] text-amber-600 font-mono bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                Pending Sync ↗
              </span>
            </a>
            <span className="text-[9px] text-stone-500 font-sans leading-relaxed px-1">
              ※ Category upload under main site properties may occasionally display a temporary 404. Master <b>[Global Property Insights]</b> option remains fully live on 82shops.
            </span>
          </div>
        )}
      </div>

      {/* Hybrid Detail Navigation Tabs */}
      <div className="flex bg-[#fafaf9] border-b border-stone-200 shrink-0">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex-1 text-center font-heading font-bold text-[11px] py-2.5 transition border-b-2 ${
            activeTab === "overview"
              ? "border-emerald-500 text-stone-900 bg-white"
              : "border-transparent text-stone-500 hover:text-stone-900 hover:bg-stone-50"
          }`}
        >
          Overview & Value
        </button>
        <button
          onClick={() => setActiveTab("legal")}
          className={`flex-1 text-center font-heading font-bold text-[11px] py-2.5 transition border-b-2 ${
            activeTab === "legal"
              ? "border-emerald-500 text-stone-900 bg-white"
              : "border-transparent text-stone-500 hover:text-stone-900 hover:bg-stone-50"
          }`}
        >
          Tax & Local Laws
        </button>
        <button
          onClick={() => setActiveTab("exclusivity")}
          className={`flex-1 text-center font-heading font-bold text-[11px] py-2.5 transition border-b-2 ${
            activeTab === "exclusivity"
              ? "border-emerald-500 text-stone-900 bg-white"
              : "border-transparent text-stone-500 hover:text-stone-900 hover:bg-stone-50"
          }`}
        >
          Anti-Bypass Protection
        </button>
      </div>

      {/* Listing Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {activeTab === "overview" && (
          <div className="space-y-4 fade-in">
            {/* Title Block */}
            <div>
              <div className="text-[10px] font-mono text-emerald-700 uppercase tracking-widest mb-1 font-bold flex items-center gap-1">
                <span>{listing.resort}</span>
                <span>•</span>
                <span>{listing.region} ({listing.country})</span>
              </div>
              <h2 className="font-heading text-sm font-bold text-stone-900 leading-normal">
                {listing.title}
              </h2>
            </div>

            {/* Amazon Style Price Conversion Widget */}
            <div className="bg-stone-50 rounded-xl border border-stone-200 p-3 space-y-2">
              <div className="flex items-center justify-between text-xs pb-1.5 border-b border-stone-200">
                <span className="text-stone-600 font-semibold">Standard Appraisal (USD)</span>
                <span className="font-mono text-emerald-700 text-sm font-bold">${listing.priceUsd.toLocaleString()}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {listing.coins.map((coin) => {
                  const rate = exchangeRates[coin as keyof typeof exchangeRates] || 1;
                  const coinValue = (listing.priceUsd / rate).toLocaleString(undefined, { maximumFractionDigits: 1 });
                  const is82s = coin === "82SHOPS";

                  return (
                    <div key={coin} className={`p-2 rounded-lg border flex flex-col justify-between transition hover:border-stone-300 ${
                      is82s ? "bg-emerald-50/70 border-emerald-300/80" : "bg-white border-stone-200 shadow-sm"
                    }`}>
                      <span className={`text-[9px] font-mono font-bold flex items-center gap-1 leading-none ${
                        is82s ? "text-emerald-700" : "text-stone-500"
                      }`}>
                        {coin} Swap
                        {is82s && <Sparkles size={9} className="text-emerald-600 animate-pulse" />}
                      </span>
                      <span className="text-[12px] font-mono font-extrabold text-[#111827] mt-1">
                        {coinValue} <span className="text-[8px] font-medium text-stone-500">{coin}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Features layout */}
            <div className="space-y-1.5">
              <h4 className="text-[10px] uppercase tracking-wider font-mono font-semibold text-stone-500">Exclusive Luxury Accents</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {listing.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-1.5 text-[11px] text-stone-800">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="truncate font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Brief info */}
            <p className="text-[11px] text-stone-600 leading-relaxed font-sans bg-stone-50 p-2.5 rounded-lg border border-stone-200">
              {listing.description}
            </p>

            {/* Direct exploration Url (Explore Asset) */}
            <div className="pt-1">
              <a 
                href="https://82shops.com/category/global-property-insights/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 font-heading font-extrabold text-[11px] py-2.5 rounded-xl text-emerald-800 transition shadow-sm"
                id={`btn-explore-${listing.id}`}
                title="Sovereign Deeds are synchronized. Redirect to Real-world 82shops.com Intelligence Hub."
              >
                <Globe2 size={12} className="text-emerald-600" />
                <span>Explore Real-World Insights (🌐)</span>
              </a>
            </div>
          </div>
        )}

        {activeTab === "legal" && (
          <div className="space-y-3.5 fade-in">
            <div className="flex items-center gap-2 text-emerald-600 border-b border-stone-200 pb-2">
              <Scale size={14} className="text-emerald-600" />
              <h4 className="text-xs font-bold font-heading uppercase text-stone-850">Sovereign Compliance & Tax Report</h4>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                <div className="text-[10px] font-mono text-emerald-700 font-bold uppercase">Local Real Estate & Capital Gains Taxes</div>
                <p className="text-[11px] text-stone-700 leading-relaxed">{lawInfo.taxes}</p>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                <div className="text-[10px] font-mono text-emerald-700 font-bold uppercase">Land Acquisition & Property Title System</div>
                <p className="text-[11px] text-stone-700 leading-relaxed">{lawInfo.ownership}</p>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                <div className="text-[10px] font-mono text-emerald-700 font-bold uppercase">Investment-Based Residency Perks</div>
                <p className="text-[11px] text-stone-700 leading-relaxed">{lawInfo.residency}</p>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 flex justify-between items-center">
                <span className="text-[10px] font-mono text-stone-500">Escrow Fee Estimate:</span>
                <span className="font-mono text-[11px] font-bold text-stone-800">{lawInfo.commission}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "exclusivity" && (
          <div className="space-y-3.5 fade-in">
            {/* Anti-Bypass Header */}
            <div className="flex items-center gap-2 text-emerald-600 border-b border-stone-200 pb-2">
              <Lock size={14} className="text-emerald-600" />
              <h4 className="text-xs font-bold font-heading uppercase text-stone-900">Cryptographic Anti-Bypass Guard</h4>
            </div>

            {/* Warning explain */}
            <div className="bg-emerald-50 border border-emerald-250 rounded-xl p-3 text-[11px] leading-relaxed text-stone-700 flex gap-2">
              <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={16} />
              <div>
                <span className="font-bold text-stone-900 text-xs block mb-0.5">Exclusivity Seal Guarantee</span>
                To prevent unverified list takeovers, image cloning, or direct circumvention, this listing is cryptographically registered to representing Broker and 82SHOPS escrow nodes. Offline bypassed deals void developer maintenance and title warranties.
              </div>
            </div>

            {/* Technical credentials */}
            <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 font-mono text-[10px] space-y-1.5 text-stone-800">
              <div className="text-stone-500 text-[9px] pb-1 border-b border-stone-200 font-bold">DIGITAL DEED REGISTRY METADATA</div>
              
              <div className="flex justify-between">
                <span className="text-stone-500 uppercase">Exclusive Seal Code:</span>
                <span className="text-stone-900 font-bold text-[9px]">{lawInfo.exclusivityHash}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-stone-500 uppercase">Consensus Node:</span>
                <span className="text-stone-900 font-bold">{lawInfo.escrowNode}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-stone-500 uppercase">Arbitration Court:</span>
                <span className="text-stone-800">International Cryptographic Court (ICC)</span>
              </div>

              <div className="flex justify-between">
                <span className="text-stone-500">DEAL STEWARD ID:</span>
                <span className="text-emerald-700 font-bold">STEWARD-SECURE-8200</span>
              </div>

              <div className="pt-1.5 border-t border-stone-200 flex items-center justify-between">
                <span className="text-[8px] text-stone-400">SIGNATURE ALGORITHM</span>
                <span className="text-[8px] text-emerald-600 font-bold">SHA-256 / LOCK-ENABLED</span>
              </div>
            </div>

            <div className="text-center p-2.5 rounded-lg bg-stone-100 border border-stone-200">
              <span className="text-[10px] text-stone-500 font-mono italic">
                Deed rights can ONLY be extracted directly through the "Submit Offer" action link.
              </span>
            </div>
          </div>
        )}

        {/* Assigned Broker detail card always visible inside active tabs to encourage communication */}
        {agent && (
          <div className="mt-4 border-t border-stone-200 pt-4">
            <div className="bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl p-3.5 space-y-3 transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <img 
                      src={agent.avatar} 
                      alt={agent.name} 
                      className="h-10 w-10 rounded-full object-cover border-2 border-emerald-500"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white animate-pulse" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-emerald-700 uppercase tracking-wide font-bold">Vetted Sole Representative</div>
                    <div className="text-xs font-extrabold text-stone-800">{agent.name}</div>
                    <div className="text-[9px] text-stone-500 mt-0.5 flex items-center gap-1 font-semibold">
                      <Globe2 size={9} className="text-stone-400" />
                      <span>{agent.language}</span>
                    </div>
                  </div>
                </div>
                
                {/* Visual verified badge */}
                <span className="text-[8.5px] font-mono bg-emerald-50 border border-emerald-300 px-1.5 py-0.5 rounded text-emerald-700 font-extrabold shadow-sm">
                  LICID #82-PREMIUM
                </span>
              </div>

              {/* Broker micro details list */}
              <div className="grid grid-cols-2 gap-1.5 text-[9.5px] font-mono text-stone-500 border-t border-stone-200 pt-2.5">
                <div className="flex items-center gap-1">
                  <PhoneCall size={9} className="text-stone-400" />
                  <span>DEALROOM SECURE LINE ACTIVE</span>
                </div>
                <div className="flex items-center gap-1">
                  <Coins size={9} className="text-emerald-600" />
                  <span>MAPPED: {agent.coinSpecialties.join(", ")}</span>
                </div>
              </div>

              {/* Instant Contact button trigger */}
              <div className="flex gap-2 pt-1 font-sans">
                <button 
                  onClick={() => onBrowseAgentChat(agent.id)}
                  className="flex-1 text-center font-heading font-extrabold text-[10px] tracking-wide text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 py-2 rounded-lg transition"
                >
                  Encrypt-Chat Rep
                </button>
                <a 
                  href={`mailto:slynderk@gmail.com?subject=Inquiry on ${encodeURIComponent(listing.title)}`}
                  className="px-3 flex items-center justify-center bg-stone-200 hover:bg-stone-300 text-stone-700 border border-stone-300 rounded-lg transition"
                  title="Direct Sovereign Escalation Request"
                >
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Primary Call to actions Footer */}
      <div className="p-4 bg-stone-50 border-t border-stone-200 flex gap-2 shrink-0">
        <button
          disabled={isSold}
          onClick={() => onOpenOfferModal(listing)}
          className={`flex-1 flex items-center justify-center gap-2 font-heading font-extrabold text-xs py-2.5 rounded-xl transition ${
            isSold 
              ? "bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300"
              : isPending
              ? "bg-purple-600 hover:bg-purple-500 text-white cursor-pointer shadow-md shadow-purple-600/20 active:scale-95"
              : "bg-emerald-500 hover:bg-emerald-400 text-white cursor-pointer shadow-md shadow-emerald-500/20 active:scale-95"
          }`}
        >
          <Wallet size={13} />
          <span>{isSold ? "Asset Sold / Closed" : isPending ? "Submit Competing Offer" : "Submit Smart Contract Coin Offer"}</span>
        </button>
      </div>
    </div>
  );
}

