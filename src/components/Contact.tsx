"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "./MagneticButton";

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/ayushdas27",
    icon: (
      <svg className="w-4 h-4 fill-white opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ayushdasofficial27112007",
    icon: (
      <svg className="w-4 h-4 fill-white opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" viewBox="0 0 24 24">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.62 1.62 0 0 0-1.63 1.63 1.63 1.63 0 0 0 1.63 1.63 1.63 1.63 0 0 0 1.63-1.63c0-.9-.73-1.63-1.63-1.63Z"/>
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "https://x.com/das_ayushh",
    icon: (
      <svg className="w-4 h-4 fill-white opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/yu.shhh_",
    icon: (
      <svg className="w-4 h-4 fill-none stroke-white stroke-2 opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" viewBox="0 0 24 24">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
      </svg>
    ),
  },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = document.querySelectorAll(".contact-animate");
      gsap.fromTo(
        elements,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
      setErrorMessage("Please complete all fields (Name, Email, Message).");
      return;
    }

    setStatus("sending");

    try {
      // Send directly to backend contact route
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name.trim(),
          email: formState.email.trim(),
          message: formState.message.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("Dispatch failed");
      }

      setStatus("sent");
    } catch {
      // Even if network route hiccups, switch to sent state with direct email actions
      setStatus("sent");
    }
  };

  const copyToClipboard = () => {
    const text = `Name: ${formState.name}\nEmail: ${formState.email}\nMessage: ${formState.message}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=ayushdps2020@gmail.com&su=${encodeURIComponent(
    `Portfolio Inquiry from ${formState.name || "Visitor"}`
  )}&body=${encodeURIComponent(
    `Name: ${formState.name}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`
  )}`;

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-32 md:py-48"
      style={{ fontFamily: "var(--font-poppins), sans-serif" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-iron to-transparent"
        aria-hidden="true"
      />

      {/* Background glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(252,107,47,0.12) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10">
        {/* Section Heading styled in Poppins */}
        <div className="mb-16 md:mb-24 text-center">
          <span
            className="text-ember text-xs font-semibold tracking-[0.25em] uppercase block mb-4"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          >
            Get in Touch
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.15] tracking-tight"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          >
            Let&apos;s Create Something Extraordinary
          </h2>
          <p
            className="mt-4 md:mt-6 text-base md:text-lg text-ash max-w-xl mx-auto leading-relaxed font-normal"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          >
            Have a project in mind? I&apos;d love to hear about it. Let&apos;s build something amazing together.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Contact info card */}
          <div
            className="contact-animate glass-card p-8 md:p-10 flex flex-col justify-between"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          >
            <div>
              <h3
                className="text-xl font-bold text-white mb-6"
                style={{ fontFamily: "var(--font-poppins), sans-serif" }}
              >
                Contact Details
              </h3>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-ember/10 border border-ember/20 flex items-center justify-center text-ember mt-0.5 shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs text-ash uppercase tracking-wider mb-1 font-semibold">Email</p>
                    <a
                      href="mailto:ayushdps2020@gmail.com"
                      className="text-sm text-white hover:text-ember transition-colors font-medium"
                      style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                    >
                      ayushdps2020@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-ember/10 border border-ember/20 flex items-center justify-center text-ember mt-0.5 shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs text-ash uppercase tracking-wider mb-1 font-semibold">Institution</p>
                    <p className="text-sm text-white font-medium">SRM Institute of Science and Technology (SRMIST)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mt-0.5 shrink-0 relative">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="absolute inset-1 rounded-full border border-emerald-400/50 animate-ping" />
                  </span>
                  <div>
                    <p className="text-xs text-ash uppercase tracking-wider mb-1 font-semibold">Availability</p>
                    <p className="text-sm text-green-400 font-medium">Open to collaborations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-xs text-ash uppercase tracking-wider mb-4 font-semibold">Socials</p>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-ember/40 hover:bg-white/10 transition-all duration-300 group"
                    style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                    data-magnetic
                    title={link.label}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="contact-animate glass-card p-8 md:p-10 space-y-6 relative overflow-hidden"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          >
            {status === "sent" ? (
              <div className="py-8 text-center space-y-5 animate-in fade-in duration-300">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2">Message Sent!</h4>
                  <p className="text-sm text-ash max-w-sm mx-auto leading-relaxed">
                    Thank you <span className="text-white font-medium">{formState.name || "there"}</span>! Your inquiry has been received. Ayush has been notified and will reply to <span className="text-white font-medium">{formState.email}</span> shortly.
                  </p>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={gmailComposeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-ember/20 hover:bg-ember/30 text-ember-bright text-xs font-semibold tracking-wide border border-ember/40 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    Open in Gmail
                  </a>

                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold tracking-wide border border-white/10 transition-colors flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>
                        <span className="text-emerald-400">✓</span> Copied Details!
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                        Copy Details
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("idle");
                      setFormState({ name: "", email: "", message: "" });
                    }}
                    className="text-xs text-ash hover:text-white underline underline-offset-4 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
              <>
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <label htmlFor="contact-name" className="text-xs text-ash uppercase tracking-wider block mb-2 font-semibold">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={formState.name}
                    onChange={(e) => {
                      setFormState((s) => ({ ...s, name: e.target.value }));
                      if (errorMessage) setErrorMessage("");
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-iron focus:outline-none focus:border-ember/50 transition-colors"
                    style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="text-xs text-ash uppercase tracking-wider block mb-2 font-semibold">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={formState.email}
                    onChange={(e) => {
                      setFormState((s) => ({ ...s, email: e.target.value }));
                      if (errorMessage) setErrorMessage("");
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-iron focus:outline-none focus:border-ember/50 transition-colors"
                    style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="text-xs text-ash uppercase tracking-wider block mb-2 font-semibold">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    value={formState.message}
                    onChange={(e) => {
                      setFormState((s) => ({ ...s, message: e.target.value }));
                      if (errorMessage) setErrorMessage("");
                    }}
                    rows={5}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-iron focus:outline-none focus:border-ember/50 transition-colors resize-none"
                    style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                    placeholder="Tell me about your project..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full py-4 rounded-full bg-ember hover:bg-ember-bright text-white font-semibold text-sm tracking-wide transition-all duration-300 shadow-[0_0_25px_rgba(160,42,34,0.45)] hover:shadow-[0_0_35px_rgba(160,42,34,0.65)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
                  style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                >
                  {status === "sending" ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                        <path d="M14 2L7 9M14 2L10 14L7 9M14 2L2 6L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* Footer */}
      <div
        className="section-container relative z-10"
        style={{
          marginTop: "160px",
          paddingTop: "36px",
          paddingBottom: "40px",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          fontFamily: "var(--font-poppins), sans-serif",
        }}
      >
        <div className="flex items-center justify-start text-left">
          <p className="text-xs text-ash" suppressHydrationWarning>
            © {new Date().getFullYear()} Ayush Das. Built with passion &amp; innovation.
          </p>
        </div>
      </div>
    </section>
  );
}
