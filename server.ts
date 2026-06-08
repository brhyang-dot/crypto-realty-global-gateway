import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// Predefined Luxury Coin-Based Resorts Real Estate Database
interface Coordinate {
  lat: number;
  lng: number;
}

interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  language: string;
  coinSpecialties: string[];
  personality: string;
  greeting: string;
}

interface Listing {
  id: string;
  title: string;
  resort: string;
  region: string;
  country: string;
  coords: Coordinate;
  priceUsd: number;
  coins: string[];
  description: string;
  image: string;
  agentId: string;
  status: "available" | "pending" | "sold";
  sizeSqm: number;
  features: string[];
  exploreUrl?: string;
}

interface MapNote {
  id: string;
  lat: number;
  lng: number;
  author: string;
  role: "buyer" | "agent" | "vip";
  content: string;
  coinType: string;
  timestamp: string;
  type: "broker_tip" | "buy_inquiry" | "market_alert";
}

interface Offer {
  id: string;
  listingId: string;
  buyerName: string;
  coinType: string;
  coinAmount: number;
  usdEquivalent: number;
  status: "submitted" | "accepted" | "declined";
  message: string;
  timestamp: string;
}

// AI Agent Brokers
const AGENTS: Agent[] = [
  {
    id: "sophia",
    name: "Sophia Vance",
    role: "Hawaii & Bora Bora Ultra-Luxury Villa Specialist",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    language: "English / Spanish",
    coinSpecialties: ["SOL", "USDT", "82SHOPS"],
    personality: "Experienced broker with 8+ years active in Maui. High-energy, articulate, and absolute expert in Solana-based resort fractionals.",
    greeting: "Aloha! I am Sophia Vance, leading luxury island transactions for 82SHOPS World. By leverage Solana (SOL) and 82SHOPS Token utilities, we execute lightning-fast sovereign listings and zero-stress title deeds."
  },
  {
    id: "pierre",
    name: "Pierre Dupont",
    role: "Monaco & French Riviera Prime Marina Estates",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    language: "English / French / Italian",
    coinSpecialties: ["BTC", "ETH", "82SHOPS"],
    personality: "Monaco Yacht Association Advisor. Distinguished, hyper-focused on asset preservation, elite escrow accounts, and global premium taxes.",
    greeting: "Bonjour. Welcome to European coastal prestige. I am Pierre Dupont, your broker for private Riviera havens and megayacht moorings. With BTC and ETH private escrow rails, we securely transition digital portfolios into generational real estate."
  },
  {
    id: "yuki",
    name: "Yuki Kawai",
    role: "Maldives & Bali Overwater Sanctuary Specialist",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    language: "English / Japanese",
    coinSpecialties: ["ETH", "USDC", "82SHOPS"],
    personality: "Detail-oriented, serene, specializing in Maldives high-yield leasebacks and wellness sanctuaries with passive yield structures.",
    greeting: "Konnichiwa. I am Yuki Kawai. Let us explore private water villas and overwater retreats in the Indian Ocean. I can coordinate dynamic ETH recurring payouts and 82SHOPS exclusive stakeholder memberships."
  },
  {
    id: "hans",
    name: "Hans Gruber",
    role: "Swiss Alps & North American High-Altitude Chalets",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    language: "English / German",
    coinSpecialties: ["BTC", "SOL", "82SHOPS"],
    personality: "Former Zug Crypto Valley trust officer. Analytical, secure, and expert in off-market alpine sales, tax-sheltered holding companies, and global trusts.",
    greeting: "Grüezi. I am Hans Gruber. Seeking secure high-altitude alpine escapes? I structure discrete, compliant sovereign mountain acquisitions through advanced digital asset trusts."
  }
];

// Default listings
let LISTINGS: Listing[] = [
  {
    id: "prop-maldives",
    title: "Aquamarine Crystal Maldives Overwater Residence",
    resort: "Soneva Jani Luxury Resort Zone",
    region: "Maldives Resort",
    country: "Maldives",
    coords: { lat: 3.2028, lng: 73.2207 },
    priceUsd: 6850000,
    coins: ["ETH", "USDC", "82SHOPS"],
    description: "Suspended flawlessly over pristine turquoise lagoons in the Noonu Atoll, this premier multi-level overwater retreat boasts private waterslides, fully retractable glass ceilings for stargazing, and personal butler services. Generates up to 12% annual yield in ETH payouts with premium 82SHOPS stakeholder rewards.",
    image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&q=80&w=1200",
    agentId: "yuki",
    status: "available",
    sizeSqm: 520,
    features: ["Private Waterslide", "Retractable Starroof", "Crystal Wine Grotto", "Private Mooring Dock", "Exclusive Wellness Spa"],
    exploreUrl: "https://82shops.com/category/properties/maldives-resort/"
  },
  {
    id: "prop-seoul",
    title: "Seoul Elite Hannam-dong Riverfront Sky Mansion",
    resort: "Hannam-dong Presidential Hilltop Zone",
    region: "Seoul Elite",
    country: "South Korea",
    coords: { lat: 37.5312, lng: 127.0105 },
    priceUsd: 14500000,
    coins: ["BTC", "USDT", "82SHOPS"],
    description: "An extraordinary high-security sanctuary nestled on the Hannam-dong hills overlooking the golden Han River. Boasts biometric glass entryways, private subterranean parking vaults with high-speed EV chargers, and complete structural steel-reinforced framing. Fully certified by Korean legal authorities and available for crypto escrow deed settlement.",
    image: "https://images.unsplash.com/photo-1541336032412-2048a678540d?auto=format&fit=crop&q=80&w=1200",
    agentId: "yuki",
    status: "available",
    sizeSqm: 620,
    features: ["Direct Han River Ascent", "Bulletproof Acoustic Glazing", "Custom Oxygen Purifying Core", "Private Subterranean Parking", "VIP Heli-Pad Dropzone"],
    exploreUrl: "https://82shops.com/category/properties/seoul-elite/"
  },
  {
    id: "prop-cote-azur",
    title: "Saint-Tropez Royal Cobalt Villa & Private Marina",
    resort: "Golfe de Saint-Tropez Haven",
    region: "Saint-Tropez",
    country: "France",
    coords: { lat: 43.2687, lng: 6.6402 },
    priceUsd: 18900000,
    coins: ["BTC", "ETH", "82SHOPS"],
    description: "The crown jewel of the French Riviera. A neoclassical compound with direct deep-water docking for superyachts up to 45 meters, sprawling lavender gardens, and absolute privacy behind elite physical and cyber barriers. Discreet BTC settlement enabled.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200",
    agentId: "pierre",
    status: "available",
    sizeSqm: 1100,
    features: ["45m Megayacht Dock", "Mediterranean Panorama", "Marble Wine Cave", "Detached VIP Guesthouse", "Hyper-secure Bunker Gate"],
    exploreUrl: "https://82shops.com/category/global-property-insights/"
  },
  {
    id: "prop-alps",
    title: "Swiss Verbier Alpine Crypto Castle Haven",
    resort: "Verbier Alpine Retreat & Peaks",
    region: "Swiss Alps",
    country: "Switzerland",
    coords: { lat: 46.0961, lng: 7.2286 },
    priceUsd: 9500000,
    coins: ["BTC", "SOL", "82SHOPS"],
    description: "Elegant dual-wing alpine timber chalet overlooking Swiss snow peaks. Boasts a massive heated geothermal pool, subterranean theater with whiskey tasting counter, and ski-in/ski-out fast access. Structured through premium trust schemes in Zug.",
    image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&q=80&w=1200",
    agentId: "hans",
    status: "available",
    sizeSqm: 680,
    features: ["Geothermal Hot Spring", "Grand Mountain Fireplace", "Ski-in/Ski-out Hub", "Subterranean Theater", "Private Rare Spirits Lounge"],
    exploreUrl: "https://82shops.com/category/properties/swiss-alps/"
  },
  {
    id: "prop-bali",
    title: "Uluwatu Genesis Cliff-edge Ocean Sanctuary",
    resort: "Uluwatu Ocean Cliffs",
    region: "Bali Retreat",
    country: "Indonesia",
    coords: { lat: -8.8458, lng: 115.1278 },
    priceUsd: 4200000,
    coins: ["ETH", "USDC", "82SHOPS"],
    description: "Commanding views from a 100-meter sheer cliff face. Modern sustainable brutalist architecture featuring saltwater infinity rockpools, modular teak yoga pavilions, and completely carbon-neutral smart operations, providing absolute zen comfort.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200",
    agentId: "yuki",
    status: "available",
    sizeSqm: 480,
    features: ["Sustainable Teak Pavilion", "Saltwater Rock Loop", "Yoga Meditation Studio", "Illuminated Indoor Waterfall", "Complimentary EV Cruisers"],
    exploreUrl: "https://82shops.com/category/properties/bali-retreat/"
  },
  {
    id: "prop-dubai",
    title: "Dubai Palm Jumeirah Sovereign Crown Mansion",
    resort: "Dubai Collection Waterfront Sanctuary",
    region: "Dubai Collection",
    country: "UAE",
    coords: { lat: 25.1124, lng: 55.1328 },
    priceUsd: 28200000,
    coins: ["BTC", "USDT", "82SHOPS"],
    description: "An ultra-opulent beachfront estate on the world-famous Palm Jumeirah. Boasts a private deep-water yacht slipway, bespoke indoor and outdoor water cascades, climate-controlled subterranean auto lounge, and a high-security tactical panic hub.",
    image: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&q=80&w=1200",
    agentId: "hans",
    status: "available",
    sizeSqm: 1850,
    features: ["Bespoke Private Yacht Dock", "120m Private Beach Front", "Subterranean Climate Garage", "Full-Floor Executive Bunker", "Stunning Burj Al Arab Sights"],
    exploreUrl: "https://82shops.com/category/properties/dubai-collection/"
  }
];

// World Collaborative Map Notes
let MAP_NOTES: MapNote[] = [
  {
    id: "note-1",
    lat: 10.0,
    lng: 60.0,
    author: "Pierre Dupont",
    role: "agent",
    content: "Attention Buyers, I have unlocked private yacht charter configurations complementing the Saint-Tropez estate acquisition. Enquire directly!",
    coinType: "82SHOPS",
    timestamp: new Date(Date.now() - 36000000).toLocaleString(),
    type: "broker_tip"
  },
  {
    id: "note-2",
    lat: -2.0,
    lng: 110.0,
    author: "Whale_Collector_7",
    role: "buyer",
    content: "Interested in the overwater Bali enclave. Yuki, can we settle 100% via custom ETH escrow contracts this quarter? Send fee outlines.",
    coinType: "ETH",
    timestamp: new Date(Date.now() - 18000000).toLocaleString(),
    type: "buy_inquiry"
  },
  {
    id: "note-3",
    lat: 41.0,
    lng: -20.0,
    author: "Sophia Vance",
    role: "agent",
    content: "Solana buying signals are peaking. The Kapalua Maui cliff estate is receiving significant interest. Submit your smart offers to secure priority queue.",
    coinType: "SOL",
    timestamp: new Date(Date.now() - 5000000).toLocaleString(),
    type: "market_alert"
  }
];

// Offers state
let OFFERS: Offer[] = [];

// Gemini Agent API Handler
let aiClientInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClientInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined.");
      return null;
    }
    aiClientInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClientInstance;
}

// REST APIs
app.get("/api/agents", (req, res) => {
  res.json(AGENTS);
});

app.get("/api/listings", (req, res) => {
  res.json(LISTINGS);
});

app.get("/api/notes", (req, res) => {
  res.json(MAP_NOTES);
});
app.post("/api/notes", (req, res) => {
  const { lat, lng, author, role, content, coinType, type } = req.body;
  if (!author || !content) {
    return res.status(400).json({ error: "Please enter both author name and content correctly." });
  }
  const newNote: MapNote = {
    id: `note-${Date.now()}`,
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    author,
    role: role || "buyer",
    content,
    coinType: coinType || "82SHOPS",
    timestamp: new Date().toLocaleString(),
    type: type || "buy_inquiry"
  };
  MAP_NOTES.push(newNote);
  res.status(201).json(newNote);
});

app.get("/api/offers", (req, res) => {
  res.json(OFFERS);
});

app.post("/api/offers", (req, res) => {
  const { listingId, buyerName, coinType, coinAmount, usdEquivalent, message } = req.body;
  
  if (!listingId || !buyerName || !coinType || !coinAmount) {
    return res.status(400).json({ error: "Please provide all required offer parameters." });
  }

  const listing = LISTINGS.find(p => p.id === listingId);
  if (!listing) {
    return res.status(404).json({ error: "Listing could not be found." });
  }

  const newOffer: Offer = {
    id: `offer-${Date.now()}`,
    listingId,
    buyerName,
    coinType,
    coinAmount: parseFloat(coinAmount),
    usdEquivalent: parseFloat(usdEquivalent) || 0,
    status: "submitted",
    message: message || "Generating coin-escrow based smart contract destination offer.",
    timestamp: new Date().toLocaleString()
  };

  OFFERS.push(newOffer);
  
  // Update listing status modestly (e.g. pending if we simulate)
  listing.status = "pending";

  // Simulate an agent message about the offer
  const agent = AGENTS.find(a => a.id === listing.agentId);
  const feedbackMessage = `Broker ${agent?.name || "Agent"} placed your offer of ${coinAmount} ${coinType} into the blockchain gateway transaction queue. An audit has been successfully initiated.`;

  res.status(201).json({ offer: newOffer, feedback: feedbackMessage, listing });
});

app.post("/api/offers/action", (req, res) => {
  const { offerId, action } = req.body; // action: "accept" | "decline"
  const offerIndex = OFFERS.findIndex(o => o.id === offerId);
  if (offerIndex === -1) {
    return res.status(404).json({ error: "Offer could not be found." });
  }

  const offer = OFFERS[offerIndex];
  offer.status = action === "accept" ? "accepted" : "declined";

  const listing = LISTINGS.find(l => l.id === offer.listingId);
  if (listing) {
    if (action === "accept") {
      listing.status = "sold";
    } else {
      // Check if there are any other active offers
      const hasOtherOffers = OFFERS.some(o => o.listingId === listing.id && o.status === "submitted");
      listing.status = hasOtherOffers ? "pending" : "available";
    }
  }

  res.json({ offer, listing });
});

// Reset simulation database endpoint
app.post("/api/reset", (req, res) => {
  LISTINGS.forEach(l => l.status = "available");
  OFFERS = [];
  MAP_NOTES = MAP_NOTES.slice(0, 3);
  res.json({ success: true, message: "Simulation database successfully restored." });
});

// Server-side Gemini Broker Agent Chat
app.post("/api/gemini/chat", async (req, res) => {
  const { agentId, userMessage, chatHistory, listingContextId } = req.body;
  
  if (!agentId || !userMessage) {
    return res.status(400).json({ error: "Agent ID and user message credentials are required." });
  }

  const agent = AGENTS.find(a => a.id === agentId);
  if (!agent) {
    return res.status(404).json({ error: "Requested broker agent could not be found." });
  }

  // Get properties belonging to this agent to provide context
  const agentListings = LISTINGS.filter(l => l.agentId === agent.id);
  const currentListing = LISTINGS.find(l => l.id === listingContextId);

  // Re-generate current exchange simulated estimates for contextual awareness
  const exchangeRates = {
    BTC: 70000, // $70,000 USD
    ETH: 3500,  // $3,500 USD
    SOL: 150,   // $150 USD
    "82SHOPS": 2.5 // $2.5 USD
  };

  const aiClient = getGeminiClient();

  if (!aiClient) {
    // Highly interactive local simulated broker agent replies if key is missing
    setTimeout(() => {
      let mockReply = "";
      const lowerMsg = userMessage.toLowerCase();
      
      const priceQuotes = agentListings.map(l => {
        const coinLines = l.coins.map(c => {
          const rate = exchangeRates[c as keyof typeof exchangeRates] || 1;
          const coinsNeeded = (l.priceUsd / rate).toLocaleString(undefined, { maximumFractionDigits: 2 });
          return `- **${c}**: Approx. ${coinsNeeded} ${c}`;
        }).join("\n");
        return `🏠 **${l.title}** (Size: ${l.sizeSqm} sqm, Rate: $${l.priceUsd.toLocaleString()} USD)\n${coinLines}`;
      }).join("\n\n");

      if (lowerMsg.includes("hello") || lowerMsg.includes("hi") || lowerMsg.includes("hey") || lowerMsg.includes("greetings")) {
        mockReply = `Welcome! I am ${agent.name}.\n${agent.greeting}\n\nOur current premium listings matching my portfolio area are:\n\n${priceQuotes}\n\nWould you like me to guide you through property specifics or the digital assets escrow process?`;
      } else if (lowerMsg.includes("coin") || lowerMsg.includes("pay") || lowerMsg.includes("fee") || lowerMsg.includes("blockchain") || lowerMsg.includes("wallet") || lowerMsg.includes("escrow")) {
        mockReply = `Absolutely! Our elite fractional and complete acquisitions are securely managed via the **82SHOPS Global Escrow Smart Contract** system based in Estonia.\n\n` +
          `1. You structure a digital asset proposal (${agent.coinSpecialties.join(", ")}) for choice properties.\n` +
          `2. Upon binding acceptance, capital is locked inside a multi-sig cryptographically guarded escrow contract.\n` +
          `3. As soon as land registries and local deed modifications complete, smart escrow triggers final release to the seller.\n\n` +
          `Furthermore, executing transactions with **82SHOPS Token** guarantees an instant 5% fee exemption & auto-mints your VIP luxury resort passes!`;
      } else if (currentListing && (lowerMsg.includes(currentListing.title.toLowerCase().slice(0, 10)) || lowerMsg.includes("listing") || lowerMsg.includes("price") || lowerMsg.includes("offer") || lowerMsg.includes("buy"))) {
        const rate = exchangeRates[currentListing.coins[0] as keyof typeof exchangeRates] || 1;
        const mainCoinNeeded = (currentListing.priceUsd / rate).toLocaleString(undefined, { maximumFractionDigits: 2 });
        mockReply = `Excellent choice focusing on **${currentListing.title}**!\n\n` +
          `This asset trades at $${currentListing.priceUsd.toLocaleString()} USD. Based on the current block rates, this equates to roughly **${mainCoinNeeded} ${currentListing.coins[0]}**.\n\n` +
          `It is actively integrated with physical upkeep schemes at '${currentListing.resort}'. We can submit an official escrow proposal on the interactive map directly. Shall we transmit the offer sheet now?`;
      } else {
        mockReply = `Thank you for your enquiry. I would be delighted to assist you with the portfolio.\n\n` +
          `Our gateway-82shops-world infrastructure provides structural tax-shielding and seamless holding setups for our premium clients purchasing in **${agentListings.map(l => l.region).join(", ")}**.\n\n` +
          `Tell me more about your optimal budget range, target square footage, or preferred cryptocurrency layer, and I'll generate a custom block-settlement outline for you!`;
      }

      return res.json({ reply: mockReply });
    }, 1000);
    return;
  }

  // If Gemini client exists, call real Gemini model
  try {
    const systemPrompt = `
You are an elite, world-class Luxury Real Estate Broker Agent in the premium application "gateway-82shops-world".
Your profile:
- Broker Name: ${agent.name}
- Role: ${agent.role}
- Language: Speaks polished, professional, elite-tier English. Maintain a sophisticated, helpful tone suited for high-net-worth (HNW) blockchain estate investors.
- Resort Specialties: ${agentListings.map(l => l.resort + ", " + l.region).join("; ")}
- Custom Coin Specialties: ${agent.coinSpecialties.join(", ")} (Highly recommend the native 82SHOPS Token which has standard 5% fee discount benefits and VIP hospitality membership).
- Personality / Tone: ${agent.personality}. Sophisticated, knowledgeable, precise. Never break character.

Here is the active properties database for your context:
${JSON.stringify(agentListings, null, 2)}

And if the user is looking at this current property listing:
${currentListing ? JSON.stringify(currentListing, null, 2) : "None selected yet."}

Currency exchange rates simulated in web app:
- 1 BTC = $70,000 USD
- 1 ETH = $3,500 USD
- 1 SOL = $150 USD
- 1 82SHOPS = $2.50 USD

Please answer questions cleanly, covering properties, escrow smart contract safety, land registry transfers, and global tax structure. Introduce listings warmly, aligning with your persona, and suggest posting map inquiries or sending a formal Offer on the board. Always reply in clear, professional English. Use pristine, elegant Markdown. Ensure your responses are detailed and highly luxurious!
`;

    const contents = [];
    if (chatHistory && Array.isArray(chatHistory)) {
      chatHistory.forEach((msg: any) => {
        contents.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      });
    }
    contents.push({
      role: "user",
      parts: [{ text: userMessage }]
    });

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    res.json({ reply: response.text || "I apologize. The secure block-gateway channels are experiencing transient latency. Please retry your message." });
  } catch (error: any) {
    console.warn("Gemini API error detected. Activating elite high-fidelity local fallback mode:", error);
    
    // Seamless local fallback so the user always has a responding AI broker
    const lowerMsg = userMessage.toLowerCase();
    let fallbackReply = "";
    
    const priceQuotes = agentListings.map(l => {
      const coinLines = l.coins.map(c => {
        const rate = exchangeRates[c as keyof typeof exchangeRates] || 1;
        const coinsNeeded = (l.priceUsd / rate).toLocaleString(undefined, { maximumFractionDigits: 2 });
        return `- **${c}**: Approx. ${coinsNeeded} ${c}`;
      }).join("\n");
      return `🏠 **${l.title}** (Size: ${l.sizeSqm} sqm, Rate: $${l.priceUsd.toLocaleString()} USD)\n${coinLines}`;
    }).join("\n\n");

    if (lowerMsg.includes("hello") || lowerMsg.includes("hi") || lowerMsg.includes("hey") || lowerMsg.includes("greetings")) {
      fallbackReply = `[Secure Proxy Active] Welcome! I am ${agent.name}.\n${agent.greeting}\n\nOur current premium listings matching my portfolio area are:\n\n${priceQuotes}\n\nWould you like me to guide you through property specifics or the digital assets escrow process?`;
    } else if (lowerMsg.includes("coin") || lowerMsg.includes("pay") || lowerMsg.includes("fee") || lowerMsg.includes("blockchain") || lowerMsg.includes("wallet") || lowerMsg.includes("escrow")) {
      fallbackReply = `[Secure Proxy Active] Absolutely! Our elite fractional and complete acquisitions are securely managed via the **82SHOPS Global Escrow Smart Contract** system based in Estonia.\n\n` +
        `1. You structure a digital asset proposal (${agent.coinSpecialties.join(", ")}) for choice properties.\n` +
        `2. Upon binding acceptance, capital is locked inside a multi-sig cryptographically guarded escrow contract.\n` +
        `3. As soon as land registries and local deed modifications complete, smart escrow triggers final release to the seller.\n\n` +
        `Furthermore, executing transactions with **82SHOPS Token** guarantees an instant 5% fee exemption & auto-mints your VIP luxury resort passes!`;
    } else if (currentListing && (lowerMsg.includes(currentListing.title.toLowerCase().slice(0, 10)) || lowerMsg.includes("listing") || lowerMsg.includes("price") || lowerMsg.includes("offer") || lowerMsg.includes("buy"))) {
      const rate = exchangeRates[currentListing.coins[0] as keyof typeof exchangeRates] || 1;
      const mainCoinNeeded = (currentListing.priceUsd / rate).toLocaleString(undefined, { maximumFractionDigits: 2 });
      fallbackReply = `[Secure Proxy Active] Excellent choice focusing on **${currentListing.title}**!\n\n` +
        `This asset trades at $${currentListing.priceUsd.toLocaleString()} USD. Based on current block rates, this equates to roughly **${mainCoinNeeded} ${currentListing.coins[0]}**.\n\n` +
        `It is actively integrated with physical upkeep schemes at '${currentListing.resort}'. We can submit an official escrow proposal on the interactive map directly. Shall we transmit the offer sheet now?`;
    } else {
      fallbackReply = `[Secure Proxy Active] Thank you for your inquiry. I would be delighted to assist you with the portfolio.\n\n` +
        `Our gateway-82shops-world infrastructure provides structural tax-shielding and seamless holding setups for our premium clients purchasing in **${agentListings.map(l => l.region).join(", ")}**.\n\n` +
        `Tell me more about your optimal budget range, target square footage, or preferred cryptocurrency layer, and I'll generate a custom block-settlement outline for you!`;
    }

    res.json({ reply: fallbackReply });
  }
});

// Configure Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting on port ${PORT}`);
  });
}

startServer();
