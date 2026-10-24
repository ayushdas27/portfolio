"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome-1",
    sender: "bot",
    text: "Hi there! 👋 I'm Ayush's virtual portfolio assistant. How can I help you today?",
    time: "Just now",
  },
];

const SUGGESTIONS = [
  "Tell me about Agro Twin",
  "What is Lunar Align?",
  "GEOIMPATHON 3rd Prize",
  "What are your core skills?",
  "How to get in touch?",
];

function getBotReply(query: string): { text: string; action?: { label: string; href?: string } } {
  const q = query.toLowerCase();

  if (q.includes("agro") || q.includes("farm") || q.includes("agriculture")) {
    return {
      text: "Agro Twin is a farm decision-support platform leveraging satellite data, AI, and simulation to help farmers make informed decisions for sustainable agriculture. It was presented at GEOIMPATHON 1.0 where our team secured 3rd Prize!",
      action: {
        label: "View Live Demo",
        href: "https://agro-twin-xi.vercel.app/",
      },
    };
  }

  if (q.includes("lunar") || q.includes("align") || q.includes("moon") || q.includes("chandrayaan")) {
    return {
      text: "Lunar Align is an advanced computer vision project for satellite image correspondence across Chandrayaan-2 OHRC and TMC/TMC-2 imagery using RootSIFT, FLANN, and RANSAC for scale- and illumination-invariant matching.",
      action: {
        label: "View on GitHub",
        href: "https://github.com/ayushdas27",
      },
    };
  }

  if (q.includes("urban") || q.includes("mobility") || q.includes("traffic") || q.includes("city")) {
    return {
      text: "Urban Mobility Intelligence uses bus-mounted cameras and computer vision to monitor civic road conditions, detecting potholes, congestion, and traffic anomalies in real time.",
      action: {
        label: "View on GitHub",
        href: "https://github.com/ayushdas27/urban-mobility-intelligence-platform",
      },
    };
  }

  if (q.includes("geoimpathon") || q.includes("prize") || q.includes("hackathon") || q.includes("award")) {
    return {
      text: "At GEOIMPATHON 1.0, Ayush's team advanced from an online selection round of 64 teams to the offline finals, securing 3rd Prize and a ₹2,000 cash award with the Agro Twin platform!",
    };
  }

  if (q.includes("skill") || q.includes("stack") || q.includes("tech") || q.includes("language") || q.includes("python")) {
    return {
      text: "Ayush works primarily with Python, C, TypeScript, and SQL. His toolkit includes OpenCV, NumPy, Streamlit, Django, MySQL, Arduino IDE, Git, and GitHub.",
    };
  }

  if (q.includes("college") || q.includes("srm") || q.includes("study") || q.includes("degree") || q.includes("education")) {
    return {
      text: "Ayush is currently pursuing his B.Tech in Computer Science and Engineering with a specialization in Artificial Intelligence & Machine Learning (AI/ML) at SRM Institute of Science and Technology (SRMIST).",
    };
  }

  if (q.includes("contact") || q.includes("email") || q.includes("hire") || q.includes("message") || q.includes("collab") || q.includes("reach")) {
    return {
      text: "You can reach Ayush directly via email at ayushdps2020@gmail.com, or connect on LinkedIn and GitHub. Feel free to leave a note here as well!",
      action: {
        label: "Send Email Directly",
        href: "mailto:ayushdps2020@gmail.com?subject=Inquiry%20from%20Portfolio",
      },
    };
  }

  return {
    text: "Thanks for reaching out! Ayush specializes in AI/ML, computer vision, and software engineering. Would you like to know about his projects (Agro Twin, Lunar Align), technical skills, or send him a direct message?",
    action: {
      label: "Email Ayush",
      href: "mailto:ayushdps2020@gmail.com",
    },
  };
}

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = getBotReply(query);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: reply.text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        action: reply.action,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 550);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
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
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-graphite/90 border border-white/10 text-xs text-white/80 shadow-lg backdrop-blur-md animate-fade-in pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Chat with Ayush</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-graphite via-smoke to-graphite border border-white/15 text-white shadow-2xl flex items-center justify-center hover:scale-105 hover:border-ember/60 transition-all duration-300 group focus:outline-none"
          aria-label={isOpen ? "Close chat box" : "Open chat box"}
          aria-expanded={isOpen}
        >
          {/* Subtle outer glow */}
          <span className="absolute inset-0 rounded-full bg-ember/20 blur-md group-hover:bg-ember/40 transition-colors" />

          {/* Active online dot */}
          <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-void flex items-center justify-center z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          </span>

          <span className="relative z-10">
            {isOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            )}
          </span>
        </button>
      </aside>

      {/* Floating Chat Modal */}
      {isOpen && (
        <section
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[580px] h-[520px] rounded-2xl bg-[#0a0a0c]/95 border border-white/15 shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300"
          style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          aria-label="Ayush Das Assistant Chatbox"
        >
          {/* Header */}
          <div className="px-5 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-ember to-ember-bright flex items-center justify-center text-white font-bold text-xs tracking-wider border border-white/20 shadow-sm">
                AD
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white leading-tight">Ayush Das</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] text-ash">Online • AI Assistant</span>
                </div>
              </div>
            </div>

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

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-white/10">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    m.sender === "user"
                      ? "bg-ember text-white rounded-tr-none shadow-md"
                      : "bg-white/10 text-white/95 rounded-tl-none border border-white/10 shadow-sm"
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
                <span className="text-[10px] text-ash/80 mt-1 px-1">{m.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-ash animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-ash animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-ash animate-bounce [animation-delay:0.4s]" />
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
          <div className="p-3 bg-white/5 border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything or leave a note..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-ash/60 focus:outline-none focus:border-ember/60 transition-colors"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!input.trim()}
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
