import { Agent, Listing, MapNote } from "./types";

export const FALLBACK_AGENTS: Agent[] = [
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

export const FALLBACK_LISTINGS: Listing[] = [
  {
    id: "prop-maldives",
    title: "Aquamarine Crystal Maldives Overwater Residence",
    resort: "Soneva Jani Luxury Resort Zone",
    region: "Maldives Resort",
    country: "Maldives",
    coords: { lat: 3.2028, lng: 73.2207 },
    priceUsd: 6850000,
    coins: ["ETH", "USDC", "82SHOPS"],
    description: "Suspended flawlessly over pristine turquoise lagoons in the Noonu Atoll, this premier multi-level overwater retreat boasts private waterslides, fully retractable glass ceilings for stargazing, and personal butter services. Generates up to 12% annual yield in ETH payouts with premium 82SHOPS stakeholder rewards.",
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

export const FALLBACK_NOTES: MapNote[] = [
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
