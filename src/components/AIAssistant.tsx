"use client";

import React, { useState, useRef, useEffect } from "react";

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Hi! 👋 I'm your AI Study Coach. Ask me for a mock interview question, roadmap advice, or a quick VLSI/Cyber Security tip!" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await res.json();
      if (data.response) {
        setMessages(prev => [...prev, { role: "ai", text: data.response }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "I'm offline right now. Try again shortly!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="AI Study Coach"
        style={{
          position: "fixed", bottom: 28, right: 28,
          width: 58, height: 58, borderRadius: "50%",
          background: isOpen ? "var(--danger)" : "linear-gradient(135deg, var(--cyber), #00b300)",
          color: isOpen ? "#fff" : "#000",
          border: "none",
          boxShadow: isOpen ? "0 4px 20px rgba(255,68,68,0.4)" : "0 4px 20px rgba(0,255,170,0.45)",
          fontSize: "1.6rem", cursor: "pointer",
          display: "flex", justifyContent: "center", alignItems: "center",
          zIndex: 1000,
          transition: "all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)"
        }}
      >
        {isOpen ? "✕" : "🤖"}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: "fixed", bottom: 100, right: 28,
          width: 360, height: 520,
          background: "var(--bg-card)",
          backdropFilter: "blur(20px)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
          display: "flex", flexDirection: "column",
          zIndex: 999, overflow: "hidden",
          animation: "bubble-in 0.25s ease-out"
        }}>
          {/* Header */}
          <div style={{
            padding: "14px 18px",
            background: "linear-gradient(135deg, rgba(0,212,255,0.08), rgba(57,255,20,0.08))",
            borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "center", gap: 10
          }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, var(--vlsi), var(--cyber))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>🤖</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>AI Study Coach</div>
              <div style={{ fontSize: "0.72rem", color: "var(--cyber)" }}>● Online</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: "16px 14px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} className="chat-bubble" style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "82%" }}>
                <div style={{
                  padding: "10px 14px",
                  borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: m.role === "user"
                    ? "linear-gradient(135deg, var(--vlsi), #0070e0)"
                    : "rgba(255,255,255,0.06)",
                  border: m.role === "ai" ? "1px solid var(--border)" : "none",
                  color: m.role === "user" ? "#fff" : "var(--text-primary)",
                  fontSize: "0.88rem",
                  lineHeight: 1.5
                }}>
                  {m.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-bubble" style={{ alignSelf: "flex-start" }}>
                <div style={{
                  padding: "12px 16px",
                  borderRadius: "16px 16px 16px 4px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid var(--border)",
                  display: "flex", gap: 4, alignItems: "center"
                }}>
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div style={{ padding: "0 14px 8px", display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["Mock interview Q", "VLSI tip", "Study plan"].map(p => (
              <button
                key={p}
                onClick={() => { setInput(p); }}
                style={{
                  padding: "4px 10px", fontSize: "0.72rem", fontWeight: 600,
                  background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)",
                  borderRadius: 100, color: "var(--text-secondary)", cursor: "pointer",
                  transition: "all 0.15s"
                }}
                onMouseOver={e => { (e.target as HTMLElement).style.borderColor = "var(--vlsi)"; (e.target as HTMLElement).style.color = "var(--vlsi)"; }}
                onMouseOut={e => { (e.target as HTMLElement).style.borderColor = "var(--border)"; (e.target as HTMLElement).style.color = "var(--text-secondary)"; }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: "10px 14px 14px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Ask me anything..."
              disabled={isTyping}
              style={{
                flex: 1, padding: "10px 14px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border)",
                borderRadius: 10, color: "var(--text-primary)",
                outline: "none", fontSize: "0.88rem",
                transition: "border-color 0.2s"
              }}
              onFocus={e => e.target.style.borderColor = "var(--vlsi)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
            <button
              onClick={sendMessage}
              disabled={isTyping || !input.trim()}
              style={{
                padding: "10px 16px",
                background: input.trim() && !isTyping ? "var(--vlsi)" : "rgba(255,255,255,0.06)",
                color: input.trim() && !isTyping ? "#000" : "var(--text-muted)",
                border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700,
                transition: "all 0.2s"
              }}
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  );
}
