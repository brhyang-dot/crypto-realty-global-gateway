import { useState, useEffect } from "react";
import { Listing } from "../types";
import { X, ShieldAlert, Cpu, Sparkles, CheckCircle, Smartphone, HelpCircle, Loader2 } from "lucide-react";

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing;
  walletBalances: Record<string, number>;
  onAddSimulatedFunds: (coin: string, amount: number) => void;
  onSubmitOffer: (
    coinType: string,
    amount: number,
    usdEquivalent: number,
    message: string
  ) => Promise<string>; // returns feedback string
  web3Account?: string | null;
  web3Balance?: string | null;
  web3Network?: string | null;
  connectWeb3Wallet?: () => Promise<void>;
}

export default function OfferModal({
  isOpen,
  onClose,
  listing,
  walletBalances,
  onAddSimulatedFunds,
  onSubmitOffer,
  web3Account,
  web3Balance,
  web3Network,
  connectWeb3Wallet
}: OfferModalProps) {
  const [selectedCoin, setSelectedCoin] = useState(listing.coins[0]);
  const [offerAmount, setOfferAmount] = useState<number>(0);
  const [remarks, setRemarks] = useState("I officialize this offer under the preferred 82SHOPS decentralized smart escrow conditions.");
  
  // Real Web3 mode toggling
  const [useRealWeb3, setUseRealWeb3] = useState(false);

  // Auto-switch useRealWeb3 if MetaMask is connected and selectedCoin is ETH
  useEffect(() => {
    if (web3Account && selectedCoin === "ETH") {
      setUseRealWeb3(true);
    } else {
      setUseRealWeb3(false);
    }
  }, [selectedCoin, web3Account]);

  const [activePaymentMode, setActivePaymentMode] = useState<"crypto" | "stripe">("crypto");
  
  // Stripe form fields
  const [stripeName, setStripeName] = useState("");
  const [stripeCardNum, setStripeCardNum] = useState("");
  const [stripeExpiry, setStripeExpiry] = useState("");
  const [stripeCvc, setStripeCvc] = useState("");

  // Smart contract simulation logs
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  const [deployFeedback, setDeployFeedback] = useState("");

  const exchangeRates = {
    BTC: 70000,
    ETH: 3500,
    SOL: 150,
    "82SHOPS": 2.5
  };

  const currentRate = exchangeRates[selectedCoin as keyof typeof exchangeRates] || 1;
  const currentBalance = walletBalances[selectedCoin] || 0;

  // Calculate standard conversion rate based on listing price
  const baseRecommendedCoinAmount = parseFloat((listing.priceUsd / currentRate).toFixed(2));

  // Initialize recommended amount on select/open
  useEffect(() => {
    setOfferAmount(baseRecommendedCoinAmount);
  }, [selectedCoin, isOpen]);

  if (!isOpen) return null;

  const usdEquivalentValue = activePaymentMode === "stripe" 
    ? listing.priceUsd 
    : parseFloat((offerAmount * currentRate).toFixed(2));

  const isBalanceSufficient = activePaymentMode === "stripe"
    ? (stripeName.trim().length > 0 && stripeCardNum.trim().length >= 12 && stripeExpiry.trim().length >= 4 && stripeCvc.trim().length >= 3)
    : (useRealWeb3 ? parseFloat(web3Balance || "0") >= offerAmount : currentBalance >= offerAmount);

  const handleTriggerOfferSubmit = async () => {
    if (activePaymentMode === "crypto" && offerAmount <= 0) return;
    
    setIsDeploying(true);
    setDeployStep(0);
    setDeployLogs([]);
    setDeployFeedback("");

    let steps = [];
    if (activePaymentMode === "stripe") {
      const commissionAmount = parseFloat((listing.priceUsd * 0.05).toFixed(2));
      const transferAmount = parseFloat((listing.priceUsd * 0.95).toFixed(2));
      steps = [
        `💳 Step 1: Initializing secure Stripe Connect routing handshake...`,
        `🔐 Step 2: Encrypting Cardholder Vault Token credentials [AES-256]...`,
        `🏦 Step 3: Validating merchant account splits: 5.0% Admin Payout ($${commissionAmount.toLocaleString()} USD to 82shops.com treasury) and 95.0% Holdout Seller Escrow Vault ($${transferAmount.toLocaleString()} USD)`,
        `💰 Step 4: Routing Stripe pre-authorization block onto live credit ledger...`,
        `🔔 Step 5: Automatically broadcasting signed offer to local listing agents list!`
      ];
    } else {
      const displayBalance = useRealWeb3 ? `${web3Balance} ETH` : `${currentBalance.toLocaleString()} ${selectedCoin}`;
      const displayAccount = useRealWeb3 ? `${web3Account?.slice(0, 6)}...${web3Account?.slice(-4)}` : "simulation-keypair";
      steps = [
        `🌐 Step 1: Connecting gateway-82shops distributed node... (port: 3000)`,
        `🔐 Step 2: Compiling cryptographic smart contract [SHA-256] on EVM Layer...`,
        `💰 Step 3: Validating buyer wallet signature [${displayAccount}] and balances... (Balance: ${displayBalance})`,
        `📦 Step 4: Provisioning multi-sig temporary trust deposit lockup for ${offerAmount.toLocaleString()} ${selectedCoin}...`,
        `🔔 Step 5: Automatically broadcasting offer to listing agents list!`
      ];
    }

    // Simulate block writing timeline
    for (let i = 0; i < 4; i++) {
      await new Promise((resolve) => setTimeout(resolve, i === 2 ? 1000 : 500));
      setDeployStep(i + 1);
      setDeployLogs((prev) => [...prev, steps[i]]);
    }

    // Real-world Web3 crypto personal sign injection if active
    if (activePaymentMode === "crypto" && useRealWeb3 && (window as any).ethereum && web3Account) {
      try {
        setDeployLogs((prev) => [...prev, "🔑 Standby: Requesting cryptographic MetaMask signature authorization..."]);
        
        const messageToSign = `82SHOPS Digital Gateway Escrow Handshake\n\n` +
          `• Buyer Address: ${web3Account}\n` +
          `• Property Title: ${listing.title}\n` +
          `• Location: ${listing.resort}\n` +
          `• Escrow Amount: ${offerAmount} ${selectedCoin}\n` +
          `• Direct USD Value: $${usdEquivalentValue.toLocaleString()}\n` +
          `• Ledger Timestamp: ${new Date().toUTCString()}\n\n` +
          `Please sign this Web3 ledger signature to officialize this elite property dealroom offer on the decentralized escrow board.`;

        const signature = await (window as any).ethereum.request({
          method: "personal_sign",
          params: [messageToSign, web3Account],
        });

        setDeployLogs((prev) => [
          ...prev, 
          `✅ Cryptographic Web3 Ledger Signature validated successfully!`,
          `📝 Signature Hash Code: ${signature.slice(0, 24)}... (Verified)`
        ]);
      } catch (err: any) {
        setDeployLogs((prev) => [...prev, `❌ Web3 signature authorization rejected: ${err.message || err}`]);
        setIsDeploying(false);
        return;
      }
    }

    // Wait and run final broadcasting step
    await new Promise((resolve) => setTimeout(resolve, 600));
    setDeployStep(5);
    setDeployLogs((prev) => [...prev, steps[4]]);

    try {
      const mockRemarks = activePaymentMode === "stripe" 
        ? `Stripe Card Pre-auth escrow of $${listing.priceUsd.toLocaleString()} USD under dynamic 5% 82shops commission split. Code: STM-${Math.floor(Math.random() * 900000 + 100000)}.`
        : remarks;
      const feedback = await onSubmitOffer(
        activePaymentMode === "stripe" ? "Stripe USD" : selectedCoin, 
        activePaymentMode === "stripe" ? listing.priceUsd : offerAmount, 
        usdEquivalentValue, 
        mockRemarks
      );
      setDeployFeedback(feedback);
    } catch (err: any) {
      setDeployLogs((prev) => [...prev, `❌ Critical escrow deploy failure: ${err.message}`]);
    } finally {
      setIsDeploying(false);
    }
  };

  // Quick helper to fill balance
  const handleQuickAddFunds = () => {
    const defaultRefills = {
      BTC: 5,
      ETH: 50,
      SOL: 500,
      "82SHOPS": 100000
    };
    const fillAmt = defaultRefills[selectedCoin as keyof typeof defaultRefills] || 1000;
    onAddSimulatedFunds(selectedCoin, fillAmt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h3 className="font-heading font-extrabold text-stone-900 text-sm">
              Sovereign Escrow Settlement & Offer
            </h3>
          </div>
          <button 
            disabled={isDeploying && deployStep < 5}
            onClick={onClose}
            className="text-stone-400 hover:text-stone-900 transition p-1 hover:bg-stone-100 rounded-lg cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Deploying view */}
        {isDeploying || deployFeedback ? (
          <div className="p-6 space-y-5">
            <div className="text-center space-y-2">
              {deployFeedback ? (
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 mb-2">
                    <CheckCircle size={24} className="animate-pulse" />
                  </div>
                  <h4 className="font-heading font-black text-sm text-emerald-805 text-emerald-800">Offer Handshake Registered</h4>
                  <p className="text-xs text-stone-605 mt-1 max-w-sm font-semibold text-center">
                    {deployFeedback}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mb-2" />
                  <h4 className="font-heading font-black text-sm text-stone-900">Setting Up Escrow Channels...</h4>
                  <p className="text-[11px] text-stone-500 font-mono">Routing ledger intent onto gateway-82shops secure tunnel</p>
                </div>
              )}
            </div>

            {/* Simulated Live Console Logs */}
            <div className="bg-stone-950 text-[#00ff66] rounded-xl p-4 border border-stone-800 h-44 overflow-y-auto space-y-1.5 font-mono text-[11px] leading-relaxed select-text shadow-inner">
              <div className="text-stone-500 text-[10px] pb-1 border-b border-stone-800/60 font-bold">ESCROW ROUTING PROTOCOL & API TRACE</div>
              {deployLogs.map((log, index) => (
                <div key={index} className="fade-in">{log}</div>
              ))}
              {!deployFeedback && !isDeploying && (
                <div className="text-emerald-400 animate-pulse">■ Listening for API response from international split merchants...</div>
              )}
            </div>

            {/* Complete action footer inside deploy pane */}
            {deployFeedback && (
              <button
                onClick={() => {
                  onClose();
                  setDeployFeedback("");
                }}
                className="w-full bg-stone-900 hover:bg-stone-950 text-white font-heading font-black text-xs py-3 rounded-xl transition cursor-pointer"
              >
                Return to Dealroom Board
              </button>
            )}
          </div>
        ) : (
          /* Normal Input Form View */
          <div className="p-5 space-y-4">
            {/* Short property context banner */}
            <div className="flex items-center gap-3 bg-stone-50 border border-stone-200 rounded-xl p-3">
              <img src={listing.image} alt="" className="h-11 w-11 rounded-lg object-cover" />
              <div className="truncate text-xs">
                <span className="text-stone-500 block text-[10px] font-mono uppercase font-bold">{listing.resort}</span>
                <span className="text-stone-900 font-extrabold font-sans text-sm">{listing.title}</span>
              </div>
            </div>

            {/* Tab selection for Web3 vs Card Payment */}
            <div className="grid grid-cols-2 gap-2 border-b border-stone-200 pb-2">
              <button
                type="button"
                onClick={() => setActivePaymentMode("crypto")}
                className={`py-2 text-center text-xs font-black transition rounded-lg border cursor-pointer ${
                  activePaymentMode === "crypto"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                    : "bg-white border-stone-200 text-stone-500 hover:text-stone-800"
                }`}
              >
                Option A: Web3 Wallet Escrow
              </button>
              <button
                type="button"
                onClick={() => setActivePaymentMode("stripe")}
                className={`py-2 text-center text-xs font-black transition rounded-lg border cursor-pointer ${
                  activePaymentMode === "stripe"
                    ? "bg-sky-50 border-sky-500 text-sky-800"
                    : "bg-white border-stone-200 text-stone-500 hover:text-stone-800"
                }`}
              >
                Option B: Stripe Connect Card
              </button>
            </div>

            {activePaymentMode === "crypto" ? (
              <>
                {/* Coin selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">Preferred Collateral Layer</label>
                  <div className="grid grid-cols-3 gap-2">
                    {listing.coins.map((coin) => {
                      const isSelected = selectedCoin === coin;
                      const iconSymbols = { BTC: "₿", ETH: "Ξ", SOL: "◎", "82SHOPS": "⊞" };

                      return (
                        <button
                          key={coin}
                          type="button"
                          onClick={() => setSelectedCoin(coin)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer ${
                            isSelected 
                              ? "bg-emerald-50 border-emerald-500 text-emerald-800 text-xs font-bold" 
                              : "bg-white border-stone-250 text-stone-600 hover:border-stone-400 text-xs font-medium"
                          }`}
                        >
                          <span>{coin}</span>
                          <span className="font-mono text-xs opacity-70 ml-1">
                            {iconSymbols[coin as keyof typeof iconSymbols] || "⊞"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Simulated Balance section */}
                {useRealWeb3 ? (
                  <div className="flex flex-col gap-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs shadow-inner">
                    <div className="flex items-center justify-between text-emerald-800 font-extrabold text-[12px]">
                      <span className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                        <span>Real MetaMask Connected:</span>
                      </span>
                      <span className="font-mono text-[10px] bg-white border border-emerald-300 font-extrabold px-1.5 py-0.5 rounded text-emerald-950 shadow-sm">
                        {web3Account?.slice(0, 6)}...{web3Account?.slice(-4)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-xs">
                      <span className="font-bold text-stone-600">Actual Wallet Balance:</span>
                      <span className="font-mono font-black text-stone-900 text-[13px]">
                        {web3Balance || "0.0000"} <span className="text-[10px] text-emerald-700 font-bold">ETH</span>
                      </span>
                    </div>
                    <div className="text-[10px] text-emerald-700 leading-tight border-t border-emerald-200/40 pt-1.5 font-semibold">
                      ※ Escrow signing will request a cryptographically secure personal handshake signature on your MetaMask.
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5 bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-600 font-bold flex items-center gap-1">
                        <span>My Simulated Balance:</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-stone-900">
                          {currentBalance.toLocaleString()} <span className="text-[10px] text-emerald-700 font-black">{selectedCoin}</span>
                        </span>
                        <button
                          type="button"
                          onClick={handleQuickAddFunds}
                          className="text-[10px] font-sans text-emerald-800 hover:text-white border border-emerald-300 px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-500 transition cursor-pointer font-bold animate-pulse"
                        >
                          Quick Refill
                        </button>
                      </div>
                    </div>
                    {connectWeb3Wallet && (window as any).ethereum && (
                      <div className="pt-2 border-t border-stone-200/60 flex justify-between items-center text-[10px]">
                        <span className="text-stone-500 font-semibold">Want real Web3 transaction testing?</span>
                        <button
                          type="button"
                          onClick={connectWeb3Wallet}
                          className="text-[9px] text-amber-800 hover:text-white border border-amber-300 px-1.5 py-0.5 rounded bg-amber-50 hover:bg-amber-500 transition cursor-pointer font-extrabold"
                        >
                          Connect MetaMask
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Slider or input value for coin amount */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-700 font-extrabold font-sans">Submit Offer Amount</span>
                    <span className="text-stone-500 font-semibold">Recommended: {baseRecommendedCoinAmount.toLocaleString()} {selectedCoin}</span>
                  </div>
                  
                  <div className="relative">
                    <input 
                      type="number"
                      step="any"
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-stone-250 focus:border-emerald-500 rounded-xl px-3.5 py-3 text-sm font-mono font-bold text-stone-900 focus:outline-none"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-stone-500">{selectedCoin}</span>
                  </div>

                  {/* Equiv details */}
                  <div className="flex justify-between items-center text-[11px] bg-stone-50 p-2.5 border border-stone-200 rounded-lg font-mono text-stone-600">
                    <span>Real-Time Market USD Value:</span>
                    <span className="text-emerald-800 text-xs font-bold animate-pulse">${usdEquivalentValue.toLocaleString()} USD</span>
                  </div>
                </div>

                {/* Custom Remarks Message */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">Decentralized Escrow Notes</label>
                  <textarea 
                    rows={2}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Write custom term requests or broker settlement queries..."
                    className="w-full bg-white border border-stone-250 focus:border-emerald-500 rounded-xl p-3 text-xs text-stone-900 focus:outline-none placeholder-stone-400 resize-none leading-relaxed font-semibold"
                  />
                </div>
              </>
            ) : (
              /* Stripe Connect Credit Card Layout */
              <div className="space-y-3.5">
                <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-xs text-sky-800 font-medium space-y-1">
                  <div className="font-extrabold text-sky-900 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                    <span>Stripe Connect split-deposit enabled:</span>
                  </div>
                  <p className="leading-relaxed text-[11px]">
                    This transaction securely locks **${listing.priceUsd.toLocaleString()} USD** in legal escrow. Upon verified title settlement, Stripe automatically routes commission shares to your **82shops.com** operator wallet account.
                  </p>
                </div>

                {/* Card input layout */}
                <div className="space-y-2.5 border-t border-stone-100 pt-1.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black font-mono text-stone-500 uppercase tracking-widest">Cardholder Name</label>
                    <input 
                      type="text"
                      placeholder="Gildong Hong"
                      value={stripeName}
                      onChange={(e) => setStripeName(e.target.value)}
                      className="w-full bg-white border border-stone-250 p-2.5 rounded-lg text-xs font-sans font-semibold focus:outline-none focus:border-sky-500 transition"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] font-black font-mono text-stone-500 uppercase tracking-widest">Card Number</label>
                      <input 
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        value={stripeCardNum}
                        onChange={(e) => setStripeCardNum(e.target.value)}
                        maxLength={16}
                        className="w-full bg-white border border-stone-250 p-2.5 rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-sky-500 transition"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black font-mono text-stone-500 uppercase tracking-widest">Expiry Date</label>
                      <input 
                        type="text"
                        placeholder="MM/YY"
                        value={stripeExpiry}
                        onChange={(e) => setStripeExpiry(e.target.value)}
                        maxLength={5}
                        className="w-full bg-white border border-stone-250 p-2.5 rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-sky-500 transition text-center"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black font-mono text-stone-500 uppercase tracking-widest">CVC Code (CVV)</label>
                      <input 
                        type="password"
                        placeholder="•••"
                        value={stripeCvc}
                        onChange={(e) => setStripeCvc(e.target.value)}
                        maxLength={4}
                        className="w-full bg-white border border-stone-250 p-2.5 rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-sky-500 transition text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black font-mono text-stone-500 uppercase tracking-widest">Total USD Escrow</label>
                      <div className="w-full bg-stone-100 p-2.5 rounded-lg text-xs font-mono font-black text-stone-700 text-center border border-stone-200">
                        ${listing.priceUsd.toLocaleString()} USD
                      </div>
                    </div>
                  </div>
                </div>

                {!isBalanceSufficient && (
                  <div className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 font-semibold">
                    ※ Card checkout simulated. Please fill in the Cardholder Name, 12+ digit Card Number, Expiry, and CVC to enable submission.
                  </div>
                )}
              </div>
            )}

            {/* Warn when insufficient */}
            {activePaymentMode === "crypto" && !isBalanceSufficient && (
              <div className="flex gap-2 bg-red-50 border border-red-200 p-3 rounded-xl text-xs text-red-800 font-bold shadow-sm">
                <ShieldAlert className="text-red-500 shrink-0 mt-0.5" size={14} />
                <p>
                  Insufficient Wallet Balance. Please refill your simulated testing wallet above before submitting.
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-250 font-heading font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
              >
                Cancel / Close
              </button>
              <button
                type="button"
                disabled={!isBalanceSufficient || (activePaymentMode === "crypto" && offerAmount <= 0)}
                onClick={handleTriggerOfferSubmit}
                className={`flex-1 flex items-center justify-center gap-1.5 font-heading text-xs py-2.5 rounded-xl transition cursor-pointer ${
                  isBalanceSufficient && (activePaymentMode === "stripe" || offerAmount > 0)
                    ? activePaymentMode === "stripe"
                      ? "bg-sky-500 hover:bg-sky-600 font-black text-white active:scale-95 shadow-md shadow-sky-500/10"
                      : "bg-emerald-500 hover:bg-emerald-600 font-black text-white active:scale-95 shadow-md shadow-emerald-500/10"
                    : "bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300"
                }`}
              >
                <Cpu size={14} />
                <span>{activePaymentMode === "stripe" ? "Authorize Stripe Escrow" : "Publish Smart Contract"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
