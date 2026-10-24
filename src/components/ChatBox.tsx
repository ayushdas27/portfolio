"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  source?: "claude-sonnet" | "claude-haiku" | "portfolio-assistant" | "fallback";
  action?: {
    label: string;
    href?: string;
  };
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome-1",
    sender: "bot",
    text: "Hi there! 👋 I'm Ayush's AI Assistant, powered by Claude. Feel free to ask about Ayush's projects (Agro Twin, Lunar Align, Urban Mobility), research, skills, or any out-of-the-box coding or technical questions!",
    time: "Just now",
    source: "claude-sonnet",
  },
];

const SUGGESTIONS = [
  "Tell me about Agro Twin",
  "What is Lunar Align?",
  "GEOIMPATHON 3rd Prize",
  "What is your tech stack?",
  "How can I contact Ayush?",
  "Explain computer vision in agriculture",
];

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [activeEngine, setActiveEngine] = useState<string>("AI");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load custom API key from localStorage if saved
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("ayush_portfolio_ai_key") || localStorage.getItem("ayush_portfolio_claude_key") || "";
      setApiKey(savedKey);
    }
  }, []);

  const saveApiKey = (key: string) => {
    setApiKey(key);
    if (typeof window !== "undefined") {
      if (key) {
        localStorage.setItem("ayush_portfolio_ai_key", key);
      } else {
        localStorage.removeItem("ayush_portfolio_ai_key");
        localStorage.removeItem("ayush_portfolio_claude_key");
      }
    }
    setShowKeyModal(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    if (!textToSend) setInput("");
    setIsTyping(true);

    try {
      // Call backend API route connected to Claude
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
          apiKey: apiKey.trim() || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Chat request failed");
      }

      const data = await res.json();
      if (data.source?.startsWith("gemini")) {
        setActiveEngine("Gemini AI");
      } else if (data.source?.startsWith("claude")) {
        setActiveEngine("Claude AI");
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: data.reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        source: data.source,
        action:
          data.reply.toLowerCase().includes("ayushdps2020@gmail.com")
            ? {
                label: "Send Email Directly",
                href: "mailto:ayushdps2020@gmail.com?subject=Portfolio%20Inquiry",
              }
            : undefined,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const fallbackMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: "Thanks for reaching out! Ayush specializes in AI/ML, computer vision, and software engineering at SRMIST. Feel free to connect directly at ayushdps2020@gmail.com!",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        action: {
          label: "Email Ayush",
          href: "mailto:ayushdps2020@gmail.com",
        },
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <aside
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
        aria-label="Chat assistant toggle"
      >
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-graphite/95 border border-white/10 text-xs text-white shadow-xl backdrop-blur-md animate-fade-in pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">Claude AI Assistant</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-graphite via-smoke to-graphite border border-white/15 text-white shadow-2xl flex items-center justify-center hover:scale-105 hover:border-ember/60 transition-all duration-300 group focus:outline-none overflow-hidden"
          aria-label={isOpen ? "Close chat box" : "Open chat box"}
          aria-expanded={isOpen}
        >
          {/* Outer glow */}
          <span className="absolute inset-0 rounded-full bg-ember/25 blur-md group-hover:bg-ember/50 transition-colors pointer-events-none" />

          {/* Active online dot */}
          <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-void flex items-center justify-center z-20">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          </span>

          <span className="relative z-10 w-full h-full flex items-center justify-center">
            {isOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <img
                src="/images/avatar.png"
                alt="Ayush Das Avatar"
                className="w-full h-full object-cover object-top scale-105"
              />
            )}
          </span>
        </button>
      </aside>

      {/* Floating Chat Modal */}
      {isOpen && (
        <section
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[410px] max-h-[620px] h-[550px] rounded-2xl bg-[#0a0a0d]/95 border border-white/15 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300"
          style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          aria-label="Ayush Das Claude AI Assistant"
        >
          {/* Header */}
          <div className="px-5 py-3.5 bg-white/[0.04] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/20 shadow-md ring-1 ring-ember/50 shrink-0 bg-graphite">
                <img
                  src="/images/avatar.png"
                  alt="Ayush Das Avatar"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white leading-tight">Ayush Das</h4>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-ember/20 text-ember-bright border border-ember/30 uppercase tracking-wider">
                    {activeEngine}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] text-ash">Online • Ready for any question</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowKeyModal(!showKeyModal)}
                title="Configure Gemini or Claude API Key"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-ash hover:text-white flex items-center justify-center transition-colors"
                aria-label="API Settings"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-ash hover:text-white flex items-center justify-center transition-colors"
                aria-label="Close chat"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Optional API Key Configuration Panel */}
          {showKeyModal && (
            <div className="p-3.5 bg-graphite border-b border-white/10 text-xs space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-white font-medium">
                <span>Gemini or Claude API Key</span>
                <span className="text-[10px] text-ash">Loaded from .env automatically</span>
              </div>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy... (Gemini) or sk-ant... (Claude)"
                className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-iron focus:outline-none focus:border-ember/60 font-mono"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => saveApiKey("")}
                  className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-ash text-[11px]"
                >
                  Clear Key
                </button>
                <button
                  type="button"
                  onClick={() => saveApiKey(apiKey)}
                  className="px-3 py-1 rounded bg-ember hover:bg-ember-bright text-white text-[11px] font-semibold"
                >
                  Save Key
                </button>
              </div>
            </div>
          )}

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-white/10">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    m.sender === "user"
                      ? "bg-ember text-white rounded-tr-none shadow-md"
                      : "bg-white/[0.08] text-white/95 rounded-tl-none border border-white/10 shadow-sm"
                  }`}
                >
                  <p>{m.text}</p>

                  {m.action && (
                    <div className="mt-2.5 pt-2 border-t border-white/10">
                      <a
                        href={m.action.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white font-medium text-xs transition-colors"
                      >
                        {m.action.label}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M7 17L17 7M17 7H7M17 7V17" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-ash/70 mt-1 px-1">
                  <span>{m.time}</span>
                  {m.source?.startsWith("claude") && (
                    <span className="text-[9px] text-ember-bright/90 font-mono">Claude 3.5</span>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 w-fit">
                <span className="text-[11px] text-ash">Claude is thinking</span>
                <span className="w-1.5 h-1.5 rounded-full bg-ember animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-ember animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-ember animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-3 py-2 bg-white/[0.02] border-t border-white/5 overflow-x-auto flex gap-1.5 no-scrollbar">
            {SUGGESTIONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleSend(item)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/5 hover:bg-ember/20 hover:border-ember/40 text-ash hover:text-white border border-white/10 transition-colors shrink-0"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white/[0.04] border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything (Ayush, coding, AI, math...)"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-ash/60 focus:outline-none focus:border-ember/60 transition-colors"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="w-9 h-9 rounded-xl bg-ember hover:bg-ember-bright disabled:opacity-40 disabled:hover:bg-ember text-white flex items-center justify-center transition-all shrink-0"
              aria-label="Send message"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </section>
      )}
    </>
  );
}
