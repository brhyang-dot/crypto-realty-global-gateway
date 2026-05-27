export interface Coordinate {
  lat: number;
  lng: number;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  language: string;
  coinSpecialties: string[];
  personality: string;
  greeting: string;
}

export interface Listing {
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

export interface MapNote {
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

export interface Offer {
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

export interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: string;
}
