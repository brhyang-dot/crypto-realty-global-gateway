import React, { useState, useRef, useEffect } from "react";
import { Agent, ChatMessage, Listing } from "../types";
import { Send, Sparkles, AlertCircle, RefreshCw, MessageCircleCode, Wallet, Tag } from "lucide-react";

interface AgentChatProps {
  selectedAgent: Agent;
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
  estateContextListing: Listing | null;
  onClearChatHistory: () => void;
}

export default function AgentChat({
  selectedAgent,
  chatHistory,
  onSendMessage,
  isTyping,
  estateContextListing,
  onClearChatHistory
}: AgentChatProps) {
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to latest messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText("");
  };

  return (
    <div className="flex flex-col h-[520px] rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-lg font-sans">
      {/* Broker Profile Header */}
      <div className="flex items-center justify-between bg-[#fdfcf9] p-4.5 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={selectedAgent.avatar} 
              alt={selectedAgent.name} 
              className="h-11 w-11 rounded-full object-cover border-2 border-sky-400"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
          </div>
          <div>
            <h3 className="font-heading text-sm md:text-base font-black text-[#111827] flex items-center gap-1.5 leading-tight">
              <span>{selectedAgent.name}</span>
            </h3>
            <p className="text-[11px] text-sky-600 font-black uppercase tracking-wider">{selectedAgent.role}</p>
          </div>
        </div>
        
        {/* Reset button */}
        <button 
          onClick={onClearChatHistory}
          className="text-stone-500 hover:text-stone-900 transition bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-full p-2.5 cursor-pointer"
          title="Clear chat history / Reset dealroom"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Specialty Badges and Active Listing Context Banner */}
      <div className="bg-stone-50/70 px-4.5 py-3 border-b border-stone-200 flex flex-col gap-2">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] font-mono font-black text-stone-550 mr-1 uppercase">Collaterals:</span>
          {selectedAgent.coinSpecialties.map((coin) => (
            <span 
              key={coin} 
              className="text-[10px] font-mono font-black tracking-wider bg-white border border-[#38bdf8] px-2 py-0.5 rounded text-sky-700"
            >
              {coin}
            </span>
          ))}
          <span className="text-[10px] bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-lg text-sky-700 ml-auto flex items-center gap-1 font-black">
            <Sparkles size={11} className="text-sky-500" />
            <span>82SHOPS VIP DIRECT</span>
          </span>
        </div>

        {estateContextListing && (
          <div className="flex items-center gap-2 bg-sky-50/50 border border-sky-200/80 px-3 py-2 rounded-xl mt-1 text-xs md:text-sm">
            <Tag size={13} className="text-sky-750 shrink-0" />
            <div className="truncate text-xs font-semibold">
              <span className="text-stone-500 mr-1">Inquired Property:</span>
              <span className="text-stone-900 font-extrabold">{estateContextListing.title}</span>
            </div>
            <span className="text-xs font-mono text-sky-600 ml-auto shrink-0 font-black">
              ${(estateContextListing.priceUsd / 1000000).toFixed(1)}M USD
            </span>
          </div>
        )}
      </div>

      {/* Messages Render Area */}
      <div className="flex-1 overflow-y-auto p-4.5 space-y-4 bg-[#fdfcfb]">
        {/* Agent Greeting message */}
        <div className="flex gap-2.5 max-w-[85%]">
          <img 
            src={selectedAgent.avatar} 
            alt={selectedAgent.name} 
            className="h-8 w-8 rounded-full object-cover mt-0.5 border border-stone-200"
            referrerPolicy="no-referrer"
          />
          <div className="rounded-2xl rounded-tl-none bg-white border border-stone-200 px-4 py-3 text-xs md:text-sm text-[#1f2937] leading-relaxed font-bold shadow-sm">
            <p className="font-black text-xs text-sky-600 mb-1 uppercase tracking-wider">Broker Introduction</p>
            {selectedAgent.greeting}
          </div>
        </div>

        {/* Dynamic chat history */}
        {chatHistory.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div 
              key={msg.id} 
              className={`flex gap-2.5 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : ""}`}
            >
              {!isUser && (
                <img 
                  src={selectedAgent.avatar} 
                  alt={selectedAgent.name} 
                  className="h-8 w-8 rounded-full object-cover mt-0.5 border border-stone-200"
                  referrerPolicy="no-referrer"
                />
              )}
              <div 
                className={`rounded-2xl px-4 py-3 text-xs md:text-sm leading-relaxed ${
                  isUser 
                    ? "rounded-tr-none bg-sky-500 text-white shadow-sm font-semibold" 
                    : "rounded-tl-none bg-white border border-stone-200 text-[#1f2937] font-semibold shadow-sm"
                }`}
              >
                {/* Format markdown newlines simply inside the chat bubbles */}
                <div className="whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>
                <div className={`text-[9px] mt-1 text-right font-mono ${isUser ? "text-sky-200" : "text-stone-400"}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-2.5 max-w-[80%]">
            <img 
              src={selectedAgent.avatar} 
              alt={selectedAgent.name} 
              className="h-8 w-8 rounded-full object-cover mt-0.5 animate-pulse border border-stone-200"
              referrerPolicy="no-referrer"
            />
            <div className="rounded-2xl rounded-tl-none bg-white border border-stone-200 px-4 py-3 flex items-center justify-center gap-1 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-505 bg-sky-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-1.5 w-1.5 rounded-full bg-sky-505 bg-sky-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-1.5 w-1.5 rounded-full bg-sky-505 bg-sky-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Submit form */}
      <form onSubmit={handleSend} className="p-3 bg-stone-100 border-t border-stone-200 flex gap-2 font-sans">
        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Inquire with Agent ${selectedAgent.name.split(" ")[0]}...`}
          className="flex-1 bg-white border border-stone-250 hover:border-stone-300 focus:border-sky-500 rounded-xl px-4 py-2.5 text-xs md:text-sm text-stone-900 placeholder-stone-400 focus:outline-none transition font-sans font-bold"
        />
        <button 
          type="submit"
          className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-xl transition font-black flex items-center justify-center shrink-0 cursor-pointer shadow-md"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
