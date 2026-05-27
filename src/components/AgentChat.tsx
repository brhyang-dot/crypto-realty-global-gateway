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
    <div className="flex flex-col h-[520px] rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-lg">
      {/* Broker Profile Header */}
      <div className="flex items-center justify-between bg-stone-50 p-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={selectedAgent.avatar} 
              alt={selectedAgent.name} 
              className="h-10 w-10 rounded-full object-cover border-2 border-emerald-500"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
          </div>
          <div>
            <h3 className="font-heading text-sm font-extrabold text-stone-900 flex items-center gap-1.5">
              <span>{selectedAgent.name}</span>
            </h3>
            <p className="text-[11px] text-emerald-700 font-extrabold uppercase tracking-wide">{selectedAgent.role}</p>
          </div>
        </div>
        
        {/* Reset button */}
        <button 
          onClick={onClearChatHistory}
          className="text-stone-500 hover:text-stone-900 transition bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-full p-2"
          title="Clear chat history / Reset dealroom"
        >
          <RefreshCw size={13} />
        </button>
      </div>

      {/* Specialty Badges and Active Listing Context Banner */}
      <div className="bg-stone-50/50 px-4 py-2.5 border-b border-stone-205 flex flex-col gap-1.5">
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[9px] font-mono font-bold text-stone-500 mr-1.5 uppercase">Collaterals:</span>
          {selectedAgent.coinSpecialties.map((coin) => (
            <span 
              key={coin} 
              className="text-[9px] font-mono font-extrabold tracking-wider bg-white border border-stone-200 px-1.5 py-0.5 rounded text-emerald-800"
            >
              {coin}
            </span>
          ))}
          <span className="text-[9px] font-sans bg-emerald-50 border border-emerald-300 px-1.5 py-0.5 rounded text-emerald-800 ml-auto flex items-center gap-1 font-bold">
            <Sparkles size={10} className="text-emerald-600" />
            <span>82SHOPS VIP REPRESENTATIVE</span>
          </span>
        </div>

        {estateContextListing && (
          <div className="flex items-center gap-1.5 bg-emerald-50/50 border border-emerald-300/40 px-2 py-1.5 rounded-lg mt-1 text-xs">
            <Tag size={12} className="text-emerald-700 shrink-0" />
            <div className="truncate text-[11px] font-medium">
              <span className="text-stone-500 mr-1">Inquired Property:</span>
              <span className="text-stone-900 font-bold">{estateContextListing.title}</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-850 ml-auto shrink-0 font-extrabold">
              ${(estateContextListing.priceUsd / 1000000).toFixed(1)}M USD
            </span>
          </div>
        )}
      </div>

      {/* Messages Render Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {/* Agent Greeting message */}
        <div className="flex gap-2.5 max-w-[85%]">
          <img 
            src={selectedAgent.avatar} 
            alt={selectedAgent.name} 
            className="h-7 w-7 rounded-full object-cover mt-0.5 border border-stone-200"
            referrerPolicy="no-referrer"
          />
          <div className="rounded-2xl rounded-tl-none bg-stone-50 border border-stone-200 px-3.5 py-2.5 text-xs text-stone-800 leading-relaxed font-bold">
            <p className="font-semibold text-[11px] text-emerald-700 mb-1">Broker Introduction</p>
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
                  className="h-7 w-7 rounded-full object-cover mt-0.5 border border-stone-200"
                  referrerPolicy="no-referrer"
                />
              )}
              <div 
                className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  isUser 
                    ? "rounded-tr-none bg-emerald-500 text-white border border-emerald-600 shadow-sm font-black" 
                    : "rounded-tl-none bg-stone-50 border border-stone-200 text-stone-800 font-semibold"
                }`}
              >
                {/* Format markdown newlines simply inside the chat bubbles */}
                <div className="whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>
                <div className={`text-[9px] mt-1 text-right font-mono ${isUser ? "text-emerald-100" : "text-stone-400"}`}>
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
              className="h-7 w-7 rounded-full object-cover mt-0.5 animate-pulse border border-stone-200"
              referrerPolicy="no-referrer"
            />
            <div className="rounded-2xl rounded-tl-none bg-stone-50 border border-stone-200 px-4 py-3 flex items-center justify-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Submit form */}
      <form onSubmit={handleSend} className="p-3 bg-stone-100 border-t border-stone-200 flex gap-2">
        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Inquire with Agent ${selectedAgent.name.split(" ")[0]} about properties or smart escrows...`}
          className="flex-1 bg-white border border-stone-250 hover:border-stone-300 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none transition font-sans font-bold"
        />
        <button 
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl transition font-black flex items-center justify-center shrink-0 cursor-pointer shadow-md shadow-emerald-500/10"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
