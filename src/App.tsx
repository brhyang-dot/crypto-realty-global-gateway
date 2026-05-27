import { useState, useEffect } from "react";
import { Listing, Agent, MapNote, Offer, ChatMessage } from "./types";
import { FALLBACK_AGENTS, FALLBACK_LISTINGS, FALLBACK_NOTES } from "./fallbackDb";
import WorldMap from "./components/WorldMap";
import ListingDetail from "./components/ListingDetail";
import Matchmaker from "./components/Matchmaker";
import AgentChat from "./components/AgentChat";
import OfferModal from "./components/OfferModal";
import AddPinModal from "./components/AddPinModal";
import { 
  Landmark, 
  MapPin, 
  MessageSquare, 
  CreditCard, 
  Cpu, 
  User, 
  Sparkles, 
  RefreshCcw, 
  FolderLock, 
  Globe, 
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ShieldCheck,
  Scale
} from "lucide-react";

export default function App() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [notes, setNotes] = useState<MapNote[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);

  // Legal / Compliance state
  const [isLegalHubOpen, setIsLegalHubOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string>("01");
  const [viewMode, setViewMode] = useState<"digital" | "scan">("digital");
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  // Selection states
  const [selectedListingId, setSelectedListingId] = useState<string | null>("prop-maldives");
  const [selectedAgentId, setSelectedAgentId] = useState<string>("yuki");
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  // Tab State for sidebar
  const [activeSideTab, setActiveSideTab] = useState<"detail" | "chat">("detail");

  // Wallet simulation state
  const [walletBalances, setWalletBalances] = useState<Record<string, number>>({
    BTC: 1.5,
    ETH: 32.8,
    SOL: 245.0,
    "82SHOPS": 380000.0
  });

  // Web3 actual wallet state
  const [web3Account, setWeb3Account] = useState<string | null>(null);
  const [web3Balance, setWeb3Balance] = useState<string | null>(null);
  const [web3Network, setWeb3Network] = useState<string | null>(null);
  const [web3Error, setWeb3Error] = useState<string | null>(null);

  const connectWeb3Wallet = async () => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      setWeb3Error("MetaMask is not installed.");
      alert("MetaMask (또는 Web3 지갑)이 설치되어 있지 않습니다. 브라우저 확장앱 설치 후 다시 시도해 주세요.");
      return;
    }
    try {
      setWeb3Error(null);
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        setWeb3Account(address);

        // Fetch balance
        const balanceHex = await ethereum.request({
          method: "eth_getBalance",
          params: [address, "latest"],
        });
        const balanceWei = parseInt(balanceHex, 16);
        const ethValue = (balanceWei / 1e18).toFixed(4);
        setWeb3Balance(ethValue);

        // Fetch chainId/Network
        const chainIdHex = await ethereum.request({ method: "eth_chainId" });
        const chainId = parseInt(chainIdHex, 16);
        let networkName = "EVM Chain";
        if (chainId === 1) networkName = "Ethereum Mainnet";
        else if (chainId === 137) networkName = "Polygon";
        else if (chainId === 42161) networkName = "Arbitrum One";
        else if (chainId === 10) networkName = "Optimism";
        else if (chainId === 56) networkName = "BNB Smart Chain";
        else if (chainId === 11155111) networkName = "Sepolia Testnet";
        
        setWeb3Network(`${networkName} (Chain: ${chainId})`);
      }
    } catch (err: any) {
      console.error(err);
      setWeb3Error(err.message || "Failed to connect wallet.");
    }
  };

  useEffect(() => {
    const ethereum = (window as any).ethereum;
    if (ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setWeb3Account(accounts[0]);
          ethereum.request({
            method: "eth_getBalance",
            params: [accounts[0], "latest"]
          }).then((balHex: string) => {
            const balWei = parseInt(balHex, 16);
            setWeb3Balance((balWei / 1e18).toFixed(4));
          }).catch(console.error);
        } else {
          setWeb3Account(null);
          setWeb3Balance(null);
        }
      };
      
      const handleChainChanged = () => {
        window.location.reload();
      };
      
      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("chainChanged", handleChainChanged);
      
      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
          ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, []);

  // Chat conversation state grouped per agent
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({
    sophia: [],
    pierre: [],
    yuki: [],
    hans: []
  });

  const [isTyping, setIsTyping] = useState(false);
  const [isMatchmakerActive, setIsMatchmakerActive] = useState(false);
  const [matchmakerSuccessBrief, setMatchmakerSuccessBrief] = useState<string | null>(null);

  // Modal open states
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isAddPinModalOpen, setIsAddPinModalOpen] = useState(false);
  const [pendingNoteCoords, setPendingNoteCoords] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });

  // Handle selected matchmaker result
  const handleSelectMatch = (listingId: string, customBrief: string) => {
    setSelectedListingId(listingId);
    setSelectedNoteId(null);
    setActiveSideTab("detail");
    setMatchmakerSuccessBrief(customBrief);

    const matchedListing = listings.find((l) => l.id === listingId);
    if (matchedListing) {
      const respAgentId = matchedListing.agentId;
      setSelectedAgentId(respAgentId);

      // Seed 1:1 chat history with instant analytical response
      const analystMessage: ChatMessage = {
        id: `sys-analyzed-${Date.now()}`,
        sender: "user",
        text: `[Sovereign Match Score: 98.4%] ${customBrief}`,
        timestamp: new Date().toLocaleTimeString()
      };

      const brokerWelcomeMessage: ChatMessage = {
        id: `agent-welcome-${Date.now()}`,
        sender: "agent",
        text: `Greetings! It is an honour to review your 98.4% compatibility score. Based on your target assets, I recommend moving quickly on the ${matchedListing.title} utilizing our 82SHOPS Token tax-shielding templates. Shall we draft a smart escrow offer?`,
        timestamp: new Date().toLocaleTimeString()
      };

      setChatHistories((prev) => ({
        ...prev,
        [respAgentId]: [
          ...(prev[respAgentId] || []),
          analystMessage,
          brokerWelcomeMessage
        ]
      }));
    }
  };

  // Load database on mount and handle deep-linking from 82shops.com Properties & Broker menus
  useEffect(() => {
    const initAndDeepLink = async () => {
      const loadedListings = await fetchDatabase();
      if (loadedListings && loadedListings.length > 0) {
        const params = new URLSearchParams(window.location.search);
        
        // 1. Property Deep-Linking (from 82shops.com Properties menu)
        const propParam = params.get("property") || params.get("prop");
        if (propParam) {
          const matched = loadedListings.find(
            (l) => 
              l.id.toLowerCase() === propParam.toLowerCase() || 
              l.region.toLowerCase().includes(propParam.toLowerCase()) ||
              l.title.toLowerCase().includes(propParam.toLowerCase())
          );
          if (matched) {
            setSelectedListingId(matched.id);
            setSelectedAgentId(matched.agentId);
            setSelectedNoteId(null);
            setIsMatchmakerActive(false);
            setActiveSideTab("detail");
          }
        }

        // 2. Broker Deep-Linking (from 82shops.com Broker Network menu)
        const agentParam = params.get("agent") || params.get("broker") || params.get("rep");
        if (agentParam) {
          const lowerParam = agentParam.toLowerCase();
          const targetAgentId = 
            lowerParam.includes("yuki") ? "yuki" :
            lowerParam.includes("pierre") ? "pierre" :
            lowerParam.includes("hans") || lowerParam.includes("gruber") ? "hans" :
            null;

          if (targetAgentId) {
            setSelectedAgentId(targetAgentId);
            setIsMatchmakerActive(false);
            setActiveSideTab("chat");
          }
        }
      }
    };
    initAndDeepLink();
  }, []);

  const fetchDatabase = async () => {
    try {
      const [listingsRes, agentsRes, notesRes, offersRes] = await Promise.all([
        fetch("/api/listings"),
        fetch("/api/agents"),
        fetch("/api/notes"),
        fetch("/api/offers")
      ]);

      const listingsContentType = listingsRes.headers.get("content-type");
      if (listingsContentType && listingsContentType.includes("text/html")) {
        throw new Error("HTML response received instead of JSON. Server/Nginx configuration likely serves index.html incorrectly.");
      }

      const [listingsData, agentsData, notesData, offersData] = await Promise.all([
        listingsRes.json(),
        agentsRes.json(),
        notesRes.json(),
        offersRes.json()
      ]);

      setListings(listingsData);
      setAgents(agentsData);
      setNotes(notesData);
      setOffers(offersData);
      return listingsData as Listing[];
    } catch (err) {
      console.warn("Express API failed, using robust static client-side database fallback:", err);
      setListings((curr) => curr.length > 0 ? curr : FALLBACK_LISTINGS);
      setAgents((curr) => curr.length > 0 ? curr : FALLBACK_AGENTS);
      setNotes((curr) => curr.length > 0 ? curr : FALLBACK_NOTES);
      setOffers((curr) => curr);
      return FALLBACK_LISTINGS;
    }
  };

  // Agent Selection Helper
  const handleSelectAgent = (agentId: string) => {
    setSelectedAgentId(agentId);
    setActiveSideTab("chat");
  };

  // Listing Selection Helper
  const handleSelectListing = (listingId: string | null) => {
    setSelectedListingId(listingId);
    setSelectedNoteId(null);
    setActiveSideTab("detail");

    // Automatically set the agent associated with this listing as active agent chat option
    if (listingId) {
      const chosenListing = listings.find(l => l.id === listingId);
      if (chosenListing) {
        setSelectedAgentId(chosenListing.agentId);
      }
    }
  };

  // Map Note Selection and Coordinate Highlight Focus
  const handleSelectNote = (note: MapNote | null) => {
    if (note) {
      setSelectedNoteId(note.id);
      setSelectedListingId(null);
    } else {
      setSelectedNoteId(null);
    }
  };

  // Open Notes addition modal on map click
  const handleMapClickToAddNote = (lat: number, lng: number) => {
    setPendingNoteCoords({ lat, lng });
    setIsAddPinModalOpen(true);
  };

  // Submit shared map board note
  const handleSubmitNote = async (
    author: string,
    role: "buyer" | "agent" | "vip",
    content: string,
    coinType: string,
    type: "broker_tip" | "buy_inquiry" | "market_alert"
  ) => {
    const backupId = `note-${Date.now()}`;
    const newLocalNote: MapNote = {
      id: backupId,
      lat: pendingNoteCoords.lat,
      lng: pendingNoteCoords.lng,
      author,
      role: role || "buyer",
      content,
      coinType: coinType || "82SHOPS",
      timestamp: new Date().toLocaleString(),
      type: type || "buy_inquiry"
    };

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: pendingNoteCoords.lat,
          lng: pendingNoteCoords.lng,
          author,
          role,
          content,
          coinType,
          type
        })
      });

      const resContentType = res.headers.get("content-type");
      if (resContentType && resContentType.includes("text/html")) {
        throw new Error("HTML response received instead of JSON.");
      }

      const data = await res.json();
      setNotes((prev) => [data, ...prev]);
    } catch (err) {
      console.warn("POST to /api/notes failed, falling back to local list addition:", err);
      setNotes((prev) => [newLocalNote, ...prev]);
    }
  };

  // Add virtual test funds
  const handleAddFunds = (coinType: string, amount: number) => {
    setWalletBalances((prev) => ({
      ...prev,
      [coinType]: parseFloat((prev[coinType] + amount).toFixed(4))
    }));
  };

  // Submit coin offer
  const handleSubmitOffer = async (
    coinType: string,
    amount: number,
    usdEquivalent: number,
    message: string
  ): Promise<string> => {
    if (!selectedListingId) return "";

    const backupId = `offer-${Date.now()}`;
    const localNewOffer: Offer = {
      id: backupId,
      listingId: selectedListingId,
      buyerName: "Buyer_HQ_99",
      coinType,
      coinAmount: amount,
      usdEquivalent,
      status: "submitted",
      message: message || "Generating coin-escrow based smart contract destination offer.",
      timestamp: new Date().toLocaleString()
    };

    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: selectedListingId,
          buyerName: "Buyer_HQ_99",
          coinType,
          coinAmount: amount,
          usdEquivalent,
          message
        })
      });

      const resContentType = res.headers.get("content-type");
      if (resContentType && resContentType.includes("text/html")) {
        throw new Error("HTML response received instead of JSON.");
      }

      const data = await res.json();
      
      // Update local wallet balance immediately to simulate the lockup (escrow lock)
      setWalletBalances((prev) => ({
        ...prev,
        [coinType]: parseFloat((prev[coinType] - amount).toFixed(4))
      }));

      // Re-fetch database to catch new listings and offer status
      fetchDatabase();

      return data.feedback || "Offer successfully dispatched.";
    } catch (err) {
      console.warn("POST to /api/offers failed, handling clientside locally:", err);
      
      // Update local listing status to "pending" to simulate
      setListings((curr) => curr.map(l => l.id === selectedListingId ? { ...l, status: "pending" } : l));
      
      // Add offer to state
      setOffers((prev) => [localNewOffer, ...prev]);

      // Deduct balance
      setWalletBalances((prev) => ({
        ...prev,
        [coinType]: parseFloat((prev[coinType] - amount).toFixed(4))
      }));

      // Return simulated agent response
      const matchedListing = listings.find((l) => l.id === selectedListingId);
      const agent = agents.find((a) => a.id === matchedListing?.agentId);
      return `Broker ${agent?.name || "Agent"} placed your offer of ${amount} ${coinType} into the blockchain gateway transaction queue. An audit has been successfully initiated. (Client Fallback Mode)`;
    }
  };

  // Approve or reject the Simulated offer on broker actions
  const handleOfferDecision = async (offerId: string, action: "accept" | "decline") => {
    try {
      const res = await fetch("/api/offers/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerId, action })
      });
      const resContentType = res.headers.get("content-type");
      if (resContentType && resContentType.includes("text/html")) {
        throw new Error("HTML response received instead of JSON.");
      }
      if (res.ok) {
        fetchDatabase();
      } else {
        throw new Error("Failed response code");
      }
    } catch (err) {
      console.warn("POST to /api/offers/action failed, handling and updating local state:", err);
      // Simulate locally
      setOffers((prevOffers) => prevOffers.map(o => {
        if (o.id === offerId) {
          return { ...o, status: action === "accept" ? "accepted" : "declined" };
        }
        return o;
      }));

      const offer = offers.find(o => o.id === offerId);
      if (offer) {
        setListings((prevListings) => prevListings.map(l => {
          if (l.id === offer.listingId) {
            if (action === "accept") {
              return { ...l, status: "sold" };
            } else {
              return { ...l, status: "available" };
            }
          }
          return l;
        }));
      }
    }
  };

  // Send message to current active AI broker agent
  const handleSendChatMessage = async (text: string) => {
    const newMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString()
    };

    // Update local state history
    setChatHistories((prev) => ({
      ...prev,
      [selectedAgentId]: [...(prev[selectedAgentId] || []), newMessage]
    }));

    setIsTyping(true);

    try {
      // Send message to server-side Gemini gateway
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: selectedAgentId,
          userMessage: text,
          chatHistory: chatHistories[selectedAgentId] || [],
          listingContextId: selectedListingId
        })
      });

      const resContentType = res.headers.get("content-type");
      if (resContentType && resContentType.includes("text/html")) {
        throw new Error("HTML response received instead of JSON.");
      }

      const data = await res.json();
      
      const replyMessage: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: "agent",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString()
      };

      setChatHistories((prev) => ({
        ...prev,
        [selectedAgentId]: [...(prev[selectedAgentId] || []), replyMessage]
      }));

    } catch (err) {
      console.warn("POST to /api/gemini/chat failed, triggering high-fidelity local broker simulation:", err);
      // Use local broker generator logic
      setTimeout(() => {
        const agent = agents.find(a => a.id === selectedAgentId) || FALLBACK_AGENTS.find(a => a.id === selectedAgentId)!;
        const agentListings = listings.filter(l => l.agentId === agent.id);
        const currentListing = listings.find(l => l.id === selectedListingId);
        
        const exchangeRates = {
          BTC: 70000,
          ETH: 3500,
          SOL: 150,
          "82SHOPS": 2.5
        };

        let mockReply = "";
        const lowerMsg = text.toLowerCase();
        
        const priceQuotes = agentListings.map(l => {
          const coinLines = l.coins.map(c => {
            const rate = exchangeRates[c as keyof typeof exchangeRates] || 1;
            const coinsNeeded = (l.priceUsd / rate).toLocaleString(undefined, { maximumFractionDigits: 2 });
            return `- **${c}**: Approx. ${coinsNeeded} ${c}`;
          }).join("\n");
          return `🏠 **${l.title}** (Size: ${l.sizeSqm} sqm, Rate: $${l.priceUsd.toLocaleString()} USD)\n${coinLines}`;
        }).join("\n\n");

        if (lowerMsg.includes("hello") || lowerMsg.includes("hi") || lowerMsg.includes("hey") || lowerMsg.includes("greetings") || lowerMsg.includes("안녕")) {
          mockReply = `Greetings and welcome! I am ${agent.name}.\n${agent.greeting}\n\nOur current premium listings matching my portfolio area are:\n\n${priceQuotes}\n\nWould you like me to guide you through property specifics or the digital assets escrow process?`;
        } else if (lowerMsg.includes("coin") || lowerMsg.includes("pay") || lowerMsg.includes("fee") || lowerMsg.includes("blockchain") || lowerMsg.includes("wallet") || lowerMsg.includes("escrow") || lowerMsg.includes("결제") || lowerMsg.includes("코인")) {
          mockReply = `Absolutely! Our elite fractional and complete acquisitions are securely managed via the **82SHOPS Global Escrow Smart Contract** system.\n\n` +
            `1. You structure a digital asset proposal (${agent.coinSpecialties.join(", ")}) for choice properties.\n` +
            `2. Upon binding acceptance, capital is locked inside a multi-sig cryptographically guarded escrow contract.\n` +
            `3. As soon as land registries and local deed modifications complete, smart escrow triggers final release to the seller.\n\n` +
            `Furthermore, executing transactions with **82SHOPS Token** guarantees an instant 5% fee exemption & auto-mints your VIP luxury resort passes!`;
        } else if (currentListing && (lowerMsg.includes(currentListing.title.toLowerCase().slice(0, 10)) || lowerMsg.includes("listing") || lowerMsg.includes("price") || lowerMsg.includes("offer") || lowerMsg.includes("buy") || lowerMsg.includes("가격") || lowerMsg.includes("구매"))) {
          const rate = exchangeRates[currentListing.coins[0] as keyof typeof exchangeRates] || 1;
          const mainCoinNeeded = (currentListing.priceUsd / rate).toLocaleString(undefined, { maximumFractionDigits: 2 });
          mockReply = `Excellent choice focusing on **${currentListing.title}**!\n\n` +
            `This asset trades at $${currentListing.priceUsd.toLocaleString()} USD. Based on the current block rates, this equates to roughly **${mainCoinNeeded} ${currentListing.coins[0]}**.\n\n` +
            `It is actively integrated with physical upkeep schemes at '${currentListing.resort}'. We can submit an official escrow proposal on the interactive map directly. Shall we transmit the offer sheet now?`;
        } else {
          mockReply = `Thank you for your enquiry. I would be delighted to assist you with the portfolio.\n\n` +
            `Our gateway-82shops-world infrastructure provides structural tax-shielding and seamless holding setups for our premium clients purchasing in **${agentListings.map(l => l.region).join(", ") || "our zones"}**.\n\n` +
            `Tell me more about your optimal budget range, target square footage, or preferred cryptocurrency layer, and I'll generate a custom block-settlement outline for you! (Local Fallback Mode active)`;
        }

        const replyMessage: ChatMessage = {
          id: `agent-${Date.now()}`,
          sender: "agent",
          text: mockReply,
          timestamp: new Date().toLocaleTimeString()
        };

        setChatHistories((prev) => ({
          ...prev,
          [selectedAgentId]: [...(prev[selectedAgentId] || []), replyMessage]
        }));
      }, 1000);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChatHistory = () => {
    setChatHistories((prev) => ({
      ...prev,
      [selectedAgentId]: []
    }));
  };

  const handleResetSimulation = async () => {
    try {
      const res = await fetch("/api/reset", { method: "POST" });
      const resContentType = res.headers.get("content-type");
      if (resContentType && resContentType.includes("text/html")) {
        throw new Error("HTML response received.");
      }
      if (res.ok) {
        setWalletBalances({
          BTC: 1.5,
          ETH: 32.8,
          SOL: 245.0,
          "82SHOPS": 380000.0
        });
        setChatHistories({
          sophia: [],
          pierre: [],
          yuki: [],
          hans: []
        });
        fetchDatabase();
      }
    } catch (err) {
      console.warn("POST to /api/reset failed, resetting client state locally:", err);
      setWalletBalances({
        BTC: 1.5,
        ETH: 32.8,
        SOL: 245.0,
        "82SHOPS": 380000.0
      });
      setChatHistories({
        sophia: [],
        pierre: [],
        yuki: [],
        hans: []
      });
      setListings(FALLBACK_LISTINGS);
      setOffers([]);
      setNotes(FALLBACK_NOTES);
    }
  };

  const currentListing = listings.find((l) => l.id === selectedListingId) || null;
  const currentAgent = agents.find((a) => a.id === selectedAgentId) || null;
  const selectedNote = notes.find((n) => n.id === selectedNoteId) || null;

  return (
    <div className="min-h-screen bg-[#faf9f6]/95 text-stone-900 flex flex-col font-sans select-none pb-12 antialiased relative">
      {/* Visual background ambient halo - soft, elegant cream & mint glows */}
      <div className="absolute top-0 left-1/3 w-[800px] h-[450px] rounded-full bg-emerald-300/10 blur-[130px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[350px] rounded-full bg-teal-300/10 blur-[120px] pointer-events-none" />

      {/* Primary Executive Header */}
      <header className="relative border-b border-stone-200 bg-white/90 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-30 shadow-sm">
        <div 
          onClick={() => {
            setSelectedListingId(null);
            setSelectedNoteId(null);
            setIsMatchmakerActive(false);
            setActiveSideTab("detail");
          }}
          className="flex items-center gap-3.5 cursor-pointer group active:scale-[0.98] transition-all"
          title="Return to Dealroom Home screen"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black font-heading text-xl shadow-md group-hover:scale-105 transition-all">
            82
          </div>
          <div>
            <h1 className="font-heading text-xl md:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
              <span className="group-hover:text-emerald-700 transition-colors">gateway-82shops-world</span>
              <span className="text-[10px] font-mono font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-400/30">
                PORTAL ACTIVE
              </span>
            </h1>
            <p className="text-xs font-bold text-stone-600 mt-0.5 tracking-wide uppercase group-hover:text-stone-850 transition-colors">
              Global Crypto-Backed Elite Resort & Luxury Estate Dealroom
            </p>
          </div>
        </div>

        {/* Real-time Web3 wallet balance emulator */}
        <div className="flex items-center gap-3.5 bg-stone-50 border border-stone-200 px-4 py-2 rounded-xl text-xs shadow-sm">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-mono font-bold text-stone-500 flex items-center gap-1">
              <span className={`h-1.5 w-1.5 rounded-full ${web3Account ? "bg-emerald-500 animate-pulse" : "bg-amber-500 animate-pulse"}`} />
              <span>CONNECTED WALLET: {web3Account ? `${web3Account.slice(0, 6)}...${web3Account.slice(-4)}` : "SIMULATION MODE"}</span>
            </span>
            <div className="flex items-center gap-3.5 mt-1 text-[11px] font-mono font-semibold">
              {web3Account ? (
                <>
                  <span className="text-emerald-700 font-extrabold text-[10px]">
                    🟢 {web3Network || "EVM Connected"} 
                  </span>
                  <span className="text-stone-705">
                    Ξ <span className="font-extrabold text-stone-900">{web3Balance || "0.00"} ETH</span>
                  </span>
                  <button 
                    onClick={() => { setWeb3Account(null); setWeb3Balance(null); setWeb3Network(null); }}
                    className="text-[9.5px] border border-stone-300 text-stone-500 hover:text-stone-850 bg-white px-1.5 py-0.5 rounded transition font-sans cursor-pointer"
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={connectWeb3Wallet}
                    className="text-[10px] bg-amber-500 hover:bg-amber-600 text-white font-extrabold px-2 py-0.5 rounded transition cursor-pointer"
                  >
                    Connect MetaMask
                  </button>
                  <span className="text-stone-750 opacity-40">|</span>
                  <span className="text-stone-705">
                    ₿ <span className="font-extrabold text-stone-900">{walletBalances.BTC}</span>
                  </span>
                  <span className="text-stone-705">
                    Ξ <span className="font-extrabold text-stone-900">{walletBalances.ETH}</span>
                  </span>
                  <span className="text-stone-705">
                    ◎ <span className="font-extrabold text-stone-900">{walletBalances.SOL}</span>
                  </span>
                  <span className="text-emerald-700 font-black">
                    ⊞ {walletBalances["82SHOPS"]?.toLocaleString()} <span className="text-[8px] opacity-90 text-emerald-605 font-extrabold">82S</span>
                  </span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={handleResetSimulation}
            className="p-2.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg transition flex items-center justify-center cursor-pointer border border-stone-300"
            title="Reset Simulation Database and Wallet Balances"
          >
            <RefreshCcw size={12} className="text-stone-600" />
          </button>
        </div>
      </header>

      {/* Main Multi-Pane Workspace */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 z-20">
        
        {/* Left Side elements: Map, collaborative pins, transaction queue (col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* World map widget container */}
          <WorldMap 
            listings={listings}
            notes={notes}
            selectedListingId={selectedListingId}
            onSelectListing={handleSelectListing}
            selectedNoteId={selectedNoteId}
            onSelectNote={handleSelectNote}
            onMapClickToAddNote={handleMapClickToAddNote}
          />

          {/* Quick interactive board pins widget bar */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
            <h3 className="font-heading text-xs font-bold text-stone-700 flex items-center gap-2 mb-3">
              <Globe size={13} className="text-emerald-600" />
              <span>Real-Time Collaborative Shared Message Feed</span>
            </h3>

            <div className="flex gap-3 overflow-x-auto pb-1.5 scrollbar-thin">
              {notes.map((n) => {
                const isSelected = selectedNoteId === n.id;
                const isAgent = n.role === "agent";
                
                return (
                  <button
                    key={n.id}
                    onClick={() => handleSelectNote(n)}
                    className={`flex-shrink-0 w-64 p-3.5 rounded-xl border text-left transition ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-400 shadow-md ring-1 ring-emerald-400/30"
                        : isAgent
                        ? "bg-stone-50 border-emerald-500/20 hover:border-emerald-500/40"
                        : "bg-stone-50 border-stone-205 hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                      <span className={`font-bold uppercase tracking-wider ${isAgent ? "text-emerald-700" : "text-stone-700"}`}>{n.author}</span>
                      <span className="text-emerald-700 font-extrabold">{n.coinType}</span>
                    </div>
                    <p className="text-[11px] text-stone-800 line-clamp-1 leading-snug font-medium">{n.content}</p>
                    <div className="flex justify-between items-center text-[9px] font-mono text-stone-500 mt-2 pt-2 border-t border-stone-200/80">
                      <span className="font-semibold">{n.type === "broker_tip" ? "💡 Tip" : n.type === "market_alert" ? "📢 Alert" : "📬 Enquire"}</span>
                      <span>{n.timestamp.split(" ")[1] || "Just now"}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live contract ledgers transactions widget */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-stone-250 gap-2">
              <div>
                <h3 className="font-heading text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Cpu size={15} className="text-emerald-600" />
                  <span>Decentralized Escrow Smart Contract Transaction Queue</span>
                </h3>
                <p className="text-[11px] text-stone-605">
                  Live tracking status of premium asset escrow negotiations submitted by HNW buyers worldwide.
                </p>
              </div>
              <span className="font-mono text-xs text-stone-700 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200 font-bold shrink-0">
                ACTIVE COUPLINGS: {offers.length}
              </span>
            </div>

            {offers.length === 0 ? (
              <div className="py-12 text-center text-stone-500 text-xs font-mono font-medium">
                No active smart escrows deployed. Choose an elite resort asset above and select "Make a Crypto Offer" to initiate.
              </div>
            ) : (
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-xs font-sans text-stone-800">
                  <thead>
                    <tr className="text-[10px] text-stone-500 font-mono text-left border-b border-stone-200/80 leading-normal font-bold">
                      <th className="py-3 px-2 font-black uppercase tracking-wider">TX REFERENCE</th>
                      <th className="py-3 px-2 font-black uppercase tracking-wider">REAL ESTATE ASSET</th>
                      <th className="py-3 px-2 font-black uppercase tracking-wider">BUYER INDENT</th>
                      <th className="py-3 px-2 font-black uppercase tracking-wider">COLLATERAL LAYER</th>
                      <th className="py-3 px-2 font-black uppercase tracking-wider">VALUATION</th>
                      <th className="py-3 px-2 font-black uppercase tracking-wider text-center">ESCROW STATUS</th>
                      <th className="py-3 px-2 font-black uppercase tracking-wider text-right">BROKER REVIEWS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {offers.map((off) => {
                      const associatedListing = listings.find((l) => l.id === off.listingId);
                      
                      return (
                        <tr key={off.id} className="hover:bg-stone-50 transition-colors">
                          <td className="py-3 px-2 font-mono text-[10px] text-stone-500">
                            {off.id.substring(0, 10)}... <br/>
                            <span className="text-[9px] text-stone-400 font-semibold">block #4823</span>
                          </td>
                          <td className="py-3 px-2">
                            <span className="font-extrabold text-stone-900 block truncate max-w-44">
                              {associatedListing?.title || "Unknown Property"}
                            </span>
                            <span className="text-[10px] font-mono text-stone-505 block font-bold">
                              {associatedListing?.region}
                            </span>
                          </td>
                          <td className="py-3 px-2 font-bold text-stone-800">
                            {off.buyerName}
                          </td>
                          <td className="py-3 px-2 font-mono font-extrabold text-emerald-800 text-[11px]">
                            {off.coinAmount} <span className="text-[9px] text-stone-500 font-medium">{off.coinType}</span>
                          </td>
                          <td className="py-3 px-2 font-mono font-extrabold text-stone-900">
                            ${off.usdEquivalent.toLocaleString()}
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              off.status === "accepted" 
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-300" 
                                : off.status === "declined"
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200 animate-pulse"
                            }`}>
                              {off.status === "accepted" ? "DEAL CLOSED" : off.status === "declined" ? "REJECTED" : "SIGN PENDING"}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            {off.status === "submitted" ? (
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => handleOfferDecision(off.id, "accept")}
                                  className="bg-emerald-500 hover:bg-emerald-600 hover:shadow-sm font-bold px-2.5 py-1.5 rounded-lg text-[10px] text-white transition cursor-pointer"
                                >
                                  Smart Approve
                                </button>
                                <button
                                  onClick={() => handleOfferDecision(off.id, "decline")}
                                  className="bg-stone-100 hover:bg-red-50 hover:text-red-650 font-bold px-2 py-1.5 border border-stone-200 rounded-lg text-[10px] text-stone-600 transition cursor-pointer"
                                >
                                  Decline
                                </button>
                              </div>
                            ) : off.status === "accepted" ? (
                              <div className="flex items-center justify-end gap-1.5 text-stone-500 text-[10px] font-semibold">
                                <CheckCircle2 size={13} className="text-emerald-500" />
                                <span>Registry Settled</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-1.5 text-stone-400 text-[10px] font-medium">
                                <XCircle size={13} className="text-red-500" />
                                <span>Negotiation Voided</span>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Tabbed details or agent chats sidebar panels (col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Interactive Agent Select Carousel row */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
            <h3 className="font-heading text-xs font-bold text-stone-850 flex items-center gap-1.5 mb-3">
              <User size={13} className="text-emerald-600" />
              <span>Elite Real Estate Broker Directory</span>
            </h3>

            <div className="grid grid-cols-4 gap-2">
              {agents.map((ag) => {
                const isSelected = selectedAgentId === ag.id;
                return (
                  <button
                    key={ag.id}
                    onClick={() => handleSelectAgent(ag.id)}
                    className={`flex flex-col items-center p-2 rounded-xl border text-center transition ${
                      isSelected 
                        ? "bg-emerald-50 border-emerald-450 text-emerald-800 font-bold ring-1 ring-emerald-300"
                        : "bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-702"
                    }`}
                  >
                    <img 
                      src={ag.avatar} 
                      alt="" 
                      className={`h-9 w-9 rounded-full object-cover border-2 ${
                        isSelected ? "border-emerald-500" : "border-stone-250"
                      }`}
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[9px] mt-1.5 truncate max-w-full font-bold leading-none">
                      {ag.name.split(" ")[0]}
                    </span>
                    <span className="text-[7px] text-stone-500 mt-1 font-mono tracking-tighter leading-none">
                      {ag.coinSpecialties[0]} Dev
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Matchmaker Trigger Button */}
          <button
            onClick={() => setIsMatchmakerActive(!isMatchmakerActive)}
            className={`w-full py-3 rounded-xl border font-heading font-black text-xs tracking-wide transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.99] ${
              isMatchmakerActive
                ? "bg-stone-800 border-stone-750 text-white"
                : "bg-[#10b981] hover:bg-[#059669] border-[#047857] text-white hover:shadow-lg hover:shadow-emerald-100"
            }`}
          >
            <Sparkles size={13} className="text-white animate-pulse" />
            <span>{isMatchmakerActive ? "Return to Portfolio" : "Find My Ideal Estate Match ✨"}</span>
          </button>

          {isMatchmakerActive ? (
            <Matchmaker 
              listings={listings}
              onSelectMatch={handleSelectMatch}
              onClose={() => setIsMatchmakerActive(false)}
            />
          ) : (
            <>
              {/* Tab Menu Header selection */}
              <div className="flex rounded-xl bg-stone-100 p-1 border border-stone-200/80 shadow-sm">
                <button
                  onClick={() => setActiveSideTab("detail")}
                  className={`flex-1 font-heading font-bold text-xs py-2 rounded-lg transition-all ${
                    activeSideTab === "detail"
                      ? "bg-emerald-500 text-white shadow font-black"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  Property Portfolio
                </button>
                <button
                  onClick={() => setActiveSideTab("chat")}
                  className={`flex-1 font-heading font-bold text-xs py-2 rounded-lg transition-all ${
                    activeSideTab === "chat"
                      ? "bg-emerald-500 text-white shadow font-black"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  1:1 AI Broker Dealroom
                </button>
              </div>

              {/* Dynamic Render block based on tabs selection */}
              {activeSideTab === "detail" ? (
                <ListingDetail 
                  listing={currentListing || (selectedNote ? {
                    id: selectedNote.id,
                    title: `${selectedNote.author}'s Proposal`,
                    resort: selectedNote.type === "broker_tip" ? "Exclusive Tip Location" : "Buyer Request Point",
                    region: "Cooperative Map Note",
                    country: "World Coordinates",
                    coords: { lat: selectedNote.lat, lng: selectedNote.lng },
                    priceUsd: 0,
                    coins: [selectedNote.coinType],
                    description: selectedNote.content,
                    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600",
                    agentId: selectedAgentId,
                    status: "available",
                    sizeSqm: 0,
                    features: ["Broker consultation queue active"]
                  } as any : null)}
                  agent={currentAgent}
                  onOpenOfferModal={() => setIsOfferModalOpen(true)}
                  onBrowseAgentChat={handleSelectAgent}
                />
              ) : (
                currentAgent && (
                  <AgentChat 
                    selectedAgent={currentAgent}
                    chatHistory={chatHistories[selectedAgentId] || []}
                    onSendMessage={handleSendChatMessage}
                    isTyping={isTyping}
                    estateContextListing={currentListing}
                    onClearChatHistory={handleClearChatHistory}
                  />
                )
              )}
            </>
          )}
        </div>
      </main>

      {/* Shared Interactive Dialogs block */}
      {currentListing && (
        <OfferModal 
          isOpen={isOfferModalOpen}
          onClose={() => setIsOfferModalOpen(false)}
          listing={currentListing}
          walletBalances={walletBalances}
          onAddSimulatedFunds={handleAddFunds}
          onSubmitOffer={handleSubmitOffer}
          web3Account={web3Account}
          web3Balance={web3Balance}
          web3Network={web3Network}
          connectWeb3Wallet={connectWeb3Wallet}
        />
      )}

      <AddPinModal 
        isOpen={isAddPinModalOpen}
        lat={pendingNoteCoords.lat}
        lng={pendingNoteCoords.lng}
        onClose={() => setIsAddPinModalOpen(false)}
        onSubmitNote={handleSubmitNote}
      />

      {/* Corporate Compliance & Legal Disclosure Footer */}
      <footer className="mt-12 border-t border-stone-200 bg-white py-6 px-6 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-stone-605">
          <div className="text-center md:text-left space-y-1">
            <p className="font-heading font-black text-stone-850 tracking-wider">82SHOPS | GLOBAL INVESTMENT REAL ESTATE GATEWAY</p>
            <p className="text-[10px] leading-relaxed max-w-xl text-stone-500 font-semibold">
              Licensed Real Estate Brokerage Firm registered under South Korean judicial authorities & local district governors. Escrow clearing guarantees up to 200 Million KRW.
            </p>
            <p className="text-[9px] font-mono font-bold text-stone-400">
              © 2026 82SHOPS Group. All sovereign deeds tracked and executed via secure smart contract networks.
            </p>
          </div>
          
          <button
            onClick={() => setIsLegalHubOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white border border-emerald-650 rounded-xl transition duration-300 font-heading font-black text-[11.5px] min-w-[220px] justify-center cursor-pointer shadow-md active:scale-[0.98]"
          >
            <ShieldCheck size={14} className="animate-pulse text-white" />
            <span>Authorized Licensure & Assurances Disclosures ↗</span>
          </button>
        </div>
      </footer>

      {/* Interactive Compliance Verification Hub Modal */}
      {isLegalHubOpen && (() => {
        const docsList = [
          {
            id: "01",
            title: "Real Estate Brokerage License",
            koreanTitle: "Certificate of Certified Brokerage Office",
            regId: "No. REG-41281-2024-00151",
            authority: "Governor of Deogyang-gu, Goyang-si",
            licensee: "Seon-Yeong Kim (Slynder K)",
            officeName: "SEOBU CERTIFIED REAL ESTATE BROKERAGE OFFICE",
            issueDate: "2024-11-20",
            fileNameBase: "broker_registration",
            legalSection: "Certified Real Estate Agents Act, Article 9"
          },
          {
            id: "02",
            title: "Business Registration Certificate",
            koreanTitle: "Certificate of Corporate Business Registry",
            regId: "No. REG-533-04-03470",
            authority: "Director of Goyang Tax Office Office",
            licensee: "Seon-Yeong Kim",
            officeName: "SEOBU CERTIFIED REAL ESTATE BROKERAGE OFFICE",
            issueDate: "2024-06-15",
            fileNameBase: "business_registration",
            legalSection: "Value Added Tax Act, Article 8"
          },
          {
            id: "03",
            title: "₩200 Million Escrow Indemnity Bond",
            koreanTitle: "Brokerage Indemnity Bond Certificate",
            regId: "No. BOND-0126251207550-PQ-0445246",
            authority: "President of Korea Association of Realtors",
            licensee: "Seon-Yeong Kim",
            officeName: "SEOBU CERTIFIED REAL ESTATE BROKERAGE OFFICE",
            issueDate: "2026-01-01",
            fileNameBase: "guarantee_bond",
            legalSection: "Certified Real Estate Agents Act, Article 30"
          },
          {
            id: "04",
            title: "Telecommunications Commerce License",
            koreanTitle: "Mail-Order Business Registration Filing Certificate",
            regId: "No. REG-2025-GOYANGDUGYANGGU-0562",
            authority: "Governor of Deogyang-gu, Goyang-si",
            licensee: "Seon-Yeong Kim",
            officeName: "SEOBU CERTIFIED REAL ESTATE BROKERAGE OFFICE",
            issueDate: "2025-01-15",
            fileNameBase: "telecom_registration",
            legalSection: "Electronic Commerce Act, Article 12"
          },
          {
            id: "05",
            title: "Professional Realty License",
            koreanTitle: "Professional Licensed Realtor Qualification",
            regId: "No. QUAL-11-2021-03088",
            authority: "Mayor of Seoul Metropolitan Government",
            licensee: "Seon-Yeong Kim",
            officeName: "Seoul Metropolitan City License Authority",
            issueDate: "2021-11-28",
            fileNameBase: "licensed_realtor",
            legalSection: "Certified Real Estate Agents Act, Article 5"
          }
        ];

        const selectedDoc = docsList.find(d => d.id === selectedDocId) || docsList[0];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-stone-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
            <div className="relative bg-white border border-stone-250 rounded-3xl w-full max-w-6xl max-h-[92vh] overflow-y-auto shadow-2xl p-4 md:p-8 space-y-6 text-stone-850 flex flex-col">
              
              {/* Header */}
              <div className="flex justify-between items-start pb-4 border-b border-stone-200 shrink-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <ShieldCheck size={20} className="animate-pulse" />
                    <span className="font-mono text-xs font-bold tracking-widest uppercase">Institutional Compliance Gateway</span>
                  </div>
                  <h2 className="font-heading text-xl md:text-2xl font-black text-stone-900 tracking-tight">
                    Authorized Licensing & Compliance Disclosures
                  </h2>
                  <p className="text-xs text-stone-550 font-medium">
                    Officially approved brokerage credentials aligned with South Korean regulatory guidelines. All raw labels are verified in professional English.
                  </p>
                </div>
                <button
                  onClick={() => setIsLegalHubOpen(false)}
                  className="p-1.5 px-3 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl text-stone-700 text-xs font-mono transition cursor-pointer active:scale-95"
                >
                  Close (ESC)
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200 text-center shrink-0 text-xs text-stone-700">
                <div className="p-1 space-y-0.5">
                  <span className="text-[9px] uppercase font-mono text-stone-550 block font-bold">Sovereign Guarantor</span>
                  <span className="font-heading font-extrabold text-stone-900 text-[11px] block">Korea Association of Realtors</span>
                  <span className="text-[9px] font-mono text-emerald-700 block font-bold">Verified Member ✔</span>
                </div>
                <div className="p-1 space-y-0.5 border-y sm:border-y-0 sm:border-x border-stone-200">
                  <span className="text-[9px] uppercase font-mono text-stone-550 block font-bold">Professional Liability Fund</span>
                  <span className="font-heading font-extrabold text-amber-700 text-[11px] block">₩200,000,000 KRW Escrow Bond</span>
                  <span className="text-[9px] font-mono text-stone-500 block font-semibold">Active Bond Protection</span>
                </div>
                <div className="p-1 space-y-0.5">
                  <span className="text-[9px] uppercase font-mono text-stone-550 block font-bold">Escrow Clearance Code</span>
                  <span className="font-heading font-extrabold text-stone-900 text-[11px] block">Authorized Reg No. 41281</span>
                  <span className="text-[9px] font-mono text-emerald-700 block font-bold">State Audited Ledger</span>
                </div>
              </div>

              {/* Main Content Area (2-Column Grid) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 flex-1">
                
                {/* Column 1: Interactive Credential Viewer Frame (7/12 Width) */}
                <div className="lg:col-span-7 bg-[#faf9f6] rounded-2xl border border-stone-200 p-4 md:p-6 flex flex-col justify-between overflow-hidden relative shadow-inner space-y-4">
                  
                  {/* Viewer Navigation Modes */}
                  <div className="flex justify-between items-center bg-white p-1 rounded-xl border border-stone-200 shrink-0">
                    <div className="flex gap-1" id="nav-viewer-modes">
                      <button
                        onClick={() => setViewMode("digital")}
                        className={`px-3 py-1.5 text-[11px] font-heading font-bold rounded-lg transition-all ${
                          viewMode === "digital"
                            ? "bg-emerald-500 text-white border border-emerald-600 shadow-sm"
                            : "text-stone-605 hover:text-stone-900"
                        }`}
                      >
                        Digital Ledger Seal
                      </button>
                      <button
                        onClick={() => {
                          setViewMode("scan");
                          setImageError(prev => ({ ...prev, [selectedDoc.id]: false }));
                        }}
                        className={`px-3 py-1.5 text-[11px] font-heading font-bold rounded-lg transition-all ${
                          viewMode === "scan"
                            ? "bg-emerald-500 text-white border border-emerald-600 shadow-sm"
                            : "text-stone-605 hover:text-stone-900"
                        }`}
                      >
                        Physical Document Scan
                      </button>
                    </div>

                    <a
                      href={`/certs/${selectedDoc.fileNameBase}.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 text-[10px] font-mono text-stone-500 hover:text-emerald-700 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200 transition flex items-center gap-1"
                    >
                      <span className="font-bold text-[9px]">PDF Agency Copy ↗</span>
                    </a>
                  </div>

                  {/* Canvas View Content */}
                  <div className="flex-1 overflow-y-auto flex items-center justify-center min-h-[300px] rounded-2xl p-2 relative">
                    
                    {viewMode === "digital" ? (
                      /* Mode A: Gorgeous glowing CSS digital certificate contract format */
                      <div className="w-full max-w-md bg-white border-4 border-double border-amber-600/40 rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-md">
                        
                        {/* Background Holographic Seal Pattern */}
                        <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none select-none">
                          <ShieldCheck size={280} className="text-amber-600 rotate-12" />
                        </div>

                        {/* Top Decorative Border */}
                        <div className="flex justify-between items-center pb-4 border-b border-stone-100">
                          <div className="h-6 w-12 border border-stone-200 rounded flex items-center justify-center">
                            <span className="text-[8px] font-mono text-amber-600 font-black tracking-widest">KRA</span>
                          </div>
                          <div className="h-6 w-6 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-full flex items-center justify-center text-slate-950 font-black text-[9px] shadow-sm">
                            印
                          </div>
                        </div>

                        {/* Certificate Main Title */}
                        <div className="text-center space-y-1">
                          <h4 className="font-heading text-lg font-black text-amber-800 tracking-tight leading-tight">
                            {selectedDoc.koreanTitle}
                          </h4>
                          <span className="block text-[9.5px] font-mono font-extrabold uppercase tracking-widest text-[#059669] mt-0.5">
                            {selectedDoc.title}
                          </span>
                          <span className="inline-block text-[9px] font-mono bg-stone-100 text-stone-605 px-3 py-1 rounded border border-stone-200 mt-1.5 font-bold">
                            Registry Indent: {selectedDoc.regId}
                          </span>
                        </div>

                        {/* Metadata grid */}
                        <div className="space-y-3.5 text-xs text-stone-700 font-sans border-y border-stone-100 py-5">
                          <div className="grid grid-cols-12 gap-1 pb-1">
                            <span className="col-span-5 text-stone-500 font-bold">Corporate Name:</span>
                            <span className="col-span-7 font-extrabold text-stone-900 text-left">{selectedDoc.officeName}</span>
                          </div>
                          <div className="grid grid-cols-12 gap-1 pb-1">
                            <span className="col-span-5 text-stone-500 font-bold">Licensed representative:</span>
                            <span className="col-span-7 font-extrabold text-emerald-700 text-left">{selectedDoc.licensee}</span>
                          </div>
                          <div className="grid grid-cols-12 gap-1 pb-1">
                            <span className="col-span-5 text-stone-500 font-bold">Statutory Code:</span>
                            <span className="col-span-7 text-[10px] text-stone-600 font-mono text-left leading-tight font-semibold">{selectedDoc.legalSection}</span>
                          </div>
                        </div>

                        {/* Stamps / Bottom declaration */}
                        <div className="pt-2 text-center space-y-4">
                          <p className="text-[10px] text-stone-600 leading-relaxed font-sans font-medium">
                            This ledger serves as an official, certified digital representation of the brokerage authority granted under the statutes of the Republic of Korea. Real-time verification is actively recorded.
                          </p>
                          <div className="flex flex-col items-center gap-1.5">
                            <span className="font-heading font-black text-xs text-stone-900 uppercase tracking-wider block leading-tight">
                              {selectedDoc.authority}
                            </span>
                            <span className="text-[8.5px] font-mono text-stone-500 block font-bold">
                              APPROVED DATE: {selectedDoc.issueDate} // SECURE TRANSACTION GATEWAY
                            </span>
                          </div>
                        </div>

                        {/* Holographic glowing seal emblem bottom right */}
                        <div className="absolute bottom-4 right-4 h-12 w-12 opacity-40 select-none pointer-events-none border border-stone-200 rounded-full flex items-center justify-center text-[8px] text-emerald-700 font-mono font-black border-dashed animate-spin-[20s]">
                          SEALED
                        </div>

                      </div>
                    ) : (
                      /* Mode B: Live JPG preview checking with explicit error state and drag-and-drop helper */
                      <div className="w-full max-w-lg aspect-[3/4] md:aspect-[1/1.3] bg-white border border-stone-200 rounded-2xl flex items-center justify-center p-4 relative group shadow-sm">
                        {!imageError[selectedDoc.id] ? (
                          <img
                            src={`/certs/${selectedDoc.fileNameBase}.jpg`}
                            alt={selectedDoc.koreanTitle}
                            className="max-h-full max-w-full object-contain rounded-xl select-none shadow-md transition duration-300 hover:scale-[1.02]"
                            onError={() => {
                              setImageError(prev => ({ ...prev, [selectedDoc.id]: true }));
                            }}
                          />
                        ) : (
                          /* Error fallback & Interactive Upload Helper guide */
                          <div className="flex flex-col items-center justify-center p-6 text-center max-w-sm space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center border border-amber-200 animate-pulse">
                              <FolderLock size={22} />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono font-black tracking-widest text-amber-700 uppercase block">Scanned Copy Registry</span>
                              <h5 className="font-heading font-black text-sm text-stone-900">
                                Physical Scan Copy upload for {selectedDoc.title}
                              </h5>
                              <p className="text-[10px] text-stone-605 leading-relaxed font-sans font-medium">
                                You can place a high-resolution scanned copy of your official physical credentials in the local directory at <code className="bg-stone-100 px-1 py-0.5 rounded text-red-650 text-[9px] font-mono">/public/certs/{selectedDoc.fileNameBase}.jpg</code>. Once placed, it overlays directly into this interactive inspection viewer.
                              </p>
                            </div>
                            
                            <div className="text-[9.5px] p-3 text-left font-mono leading-relaxed bg-stone-50 border border-stone-200 rounded-xl w-full text-stone-600 space-y-1.5">
                              <p className="font-bold text-stone-800 border-b border-stone-200 pb-1 flex items-center gap-1">
                                <span className="h-1.5 w-1.5 bg-amber-500 rounded-full" />
                                Recommended file format & naming standard
                              </p>
                              <div>• Target File Path: <span className="text-emerald-700 font-extrabold">{selectedDoc.fileNameBase}.jpg</span></div>
                              <p className="text-[8.5px] text-stone-500 pt-1 leading-normal">
                                ※ Placing safe documents in this public folder triggers active on-demand distribution and legal compliance transparency.
                              </p>
                            </div>

                            <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-250 text-emerald-800 text-[10px] font-heading font-black rounded-lg">
                              Digital verification is fully active and legally compliant even without scan uploads.
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  </div>

                </div>

                {/* Column 2: Licensing List Selection (5/12 Width) */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <h3 className="font-heading text-xs font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2 px-1">
                      <Scale size={13} className="text-emerald-600 animate-bounce" />
                      <span>Regulatory License Registries (5 Core Pillars)</span>
                    </h3>

                    <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                      {docsList.map((doc) => {
                        const isSelected = selectedDocId === doc.id;
                        return (
                          <div
                            key={doc.id}
                            onClick={() => {
                              setSelectedDocId(doc.id);
                              setImageError(prev => ({ ...prev, [doc.id]: false }));
                            }}
                            className={`p-3.5 rounded-2xl border transition-all duration-300 text-left cursor-pointer group hover:bg-[#faf9f6] relative overflow-hidden select-none ${
                              isSelected
                                ? "bg-emerald-50/50 border-emerald-500 shadow-sm"
                                : "bg-stone-50 border-stone-200 hover:border-stone-300 text-stone-800"
                            }`}
                          >
                            <div className="absolute top-3 right-3 opacity-[0.06] text-[32px] font-black font-mono text-stone-900 pointer-events-none">
                              {doc.id}
                            </div>
                            
                            <div className="flex items-center gap-2 pb-1.5 border-b border-stone-150">
                              <span className={`h-2 w-2 rounded-full ${isSelected ? "bg-emerald-500 animate-pulse" : "bg-stone-400"}`} />
                              <span className={`font-heading font-bold text-[12px] ${isSelected ? "text-emerald-800" : "text-stone-800"}`}>
                                {doc.id}. {doc.title}
                              </span>
                            </div>

                            <div className="pt-2 flex justify-between items-center text-[11px]">
                              <div>
                                <span className="block font-black text-stone-900">{doc.koreanTitle}</span>
                                <span className="text-[10px] font-mono text-stone-500 font-semibold">{doc.regId}</span>
                              </div>
                              <span className="text-[9px] font-mono bg-white px-2.5 py-1 rounded border border-stone-200 text-stone-605 group-hover:text-emerald-700 group-hover:border-emerald-500/20 transition font-bold shadow-sm">
                                SELECT ↗
                              </span>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Legal Operational Tips */}
                  <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl text-stone-605 text-[10px] space-y-2 leading-relaxed shrink-0 font-medium">
                    <p className="font-black text-stone-800 uppercase tracking-wide">💡 [Operational Disclosure & Guidelines]:</p>
                    <p>
                      1. Loading physical <b>.jpg image files</b> to the <code>/public/certs/</code> directory enables client magnifier zoom instantly, maximizing transaction escrow confidence.
                    </p>
                    <p>
                      2. The registry registration numbers and bilingual compliance statements follow global fintech-tier legal standards. Displaying the Digital Ledger Verification fulfills full regulatory disclosure automatically.
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </div>
        );
      })()}
    </div>
  );
}

