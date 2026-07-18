"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, ChevronDown } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface AiChatProps {
  lang: "vi" | "en";
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

const translations = {
  vi: {
    title: "RENOVA AI",
    subtitle: "Trợ lý bền vững",
    placeholder: "Hỏi về sản phẩm, ESG, EPR...",
    thinking: "Đang suy nghĩ...",
    welcome: "Xin chào! 👋 Tôi là trợ lý AI của RENOVA. Tôi có thể giúp bạn về sản phẩm gạch bông gió, tính toán ESG, quy trình EPR và nhiều hơn nữa. Hãy hỏi tôi bất cứ điều gì!",
    suggestions: [
      "RENOVA là gì?",
      "Gạch bông gió có bền không?",
      "EPR hoạt động như nào?",
      "Giá gạch RENOVA bao nhiêu?",
    ],
    sourceLabel: "Nguồn tham khảo:",
    errorOffline: "Không thể kết nối đến máy chủ AI. Vui lòng thử lại sau.",
  },
  en: {
    title: "RENOVA AI",
    subtitle: "Sustainability Advisor",
    placeholder: "Ask about products, ESG, EPR...",
    thinking: "Thinking...",
    welcome: "Hello! 👋 I'm RENOVA's AI assistant. I can help you with breeze block products, ESG calculations, EPR workflows, and more. Ask me anything!",
    suggestions: [
      "What is RENOVA?",
      "How strong are the bricks?",
      "How does EPR work?",
      "How much do bricks cost?",
    ],
    sourceLabel: "Sources:",
    errorOffline: "Cannot connect to AI server. Please try again later.",
  },
};

const formatMessage = (content: string) => {
  const lines = content.split("\n");
  return lines.map((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={index} className="h-2" />;
    }

    // Check if numbered list (e.g., 1. )
    const numListMatch = trimmed.match(/^(\d+)\.\s(.*)/);
    if (numListMatch) {
      const num = numListMatch[1];
      const textToParse = numListMatch[2];
      
      const parts = textToParse.split("**");
      const formattedLine = parts.map((part, i) => {
        if (i % 2 === 1) {
          return <strong key={i} className="font-bold text-white">{part}</strong>;
        }
        return part;
      });

      return (
        <div key={index} className="flex gap-2 items-start my-1 pl-1">
          <span className="text-[12px] font-bold shrink-0 text-brand-primary" style={{ color: "var(--color-brand-primary)" }}>
            {num}.
          </span>
          <span className="flex-1 text-[13px]">{formattedLine}</span>
        </div>
      );
    }

    // Check if bullet point (* or -)
    const isBullet = trimmed.startsWith("* ") || trimmed.startsWith("- ");
    const textToParse = isBullet ? trimmed.slice(2) : line;

    // Parse **bold** text
    const parts = textToParse.split("**");
    const formattedLine = parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-bold text-white">{part}</strong>;
      }
      return part;
    });

    if (isBullet) {
      return (
        <div key={index} className="flex gap-2 items-start my-1 pl-1">
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0 mt-2"
            style={{ background: "var(--color-brand-primary)" }}
          />
          <span className="flex-1 text-[13px]">{formattedLine}</span>
        </div>
      );
    }

    return (
      <p key={index} className="m-0 text-[13px] leading-relaxed">
        {formattedLine}
      </p>
    );
  });
};

export default function AiChat({ lang }: AiChatProps) {
  const t = translations[lang];
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: t.welcome },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update welcome message when language changes
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].role === "assistant") {
        return [{ role: "assistant", content: t.welcome }];
      }
      return prev;
    });
  }, [lang, t.welcome]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: messageText.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Build history (exclude the welcome message and the latest user message)
      const history = updatedMessages
        .slice(1, -1) // skip welcome, skip latest user message (it goes in 'message')
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch(`${API_BASE_URL}/api/v1/ai/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText.trim(),
          history,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let streamedContent = "";
      let streamedSources: string[] | undefined;

      // Add a placeholder assistant message that we'll update as tokens arrive
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", sources: undefined },
      ]);

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Parse SSE events from buffer (split on double newlines)
        const events = buffer.split("\n\n");
        buffer = events.pop() || ""; // Keep incomplete event in buffer

        for (const event of events) {
          const dataLine = event.trim();
          if (!dataLine.startsWith("data: ")) continue;

          try {
            const data = JSON.parse(dataLine.slice(6));

            if (data.type === "sources") {
              streamedSources = data.sources?.length > 0 ? data.sources : undefined;
            } else if (data.type === "token") {
              streamedContent += data.token;
              // Update the last message with new content
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: streamedContent,
                  sources: streamedSources,
                };
                return updated;
              });
            } else if (data.type === "error") {
              streamedContent = data.message || t.errorOffline;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: streamedContent,
                };
                return updated;
              });
            }
            // "done" type — streaming complete, no action needed
          } catch {
            // Skip malformed JSON
          }
        }
      }

      // Final update with sources attached
      if (streamedContent) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: streamedContent,
            sources: streamedSources,
          };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev.filter((m) => m.content !== ""), // Remove empty placeholder if exists
        {
          role: "assistant",
          content: t.errorOffline,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestion = (suggestion: string) => {
    sendMessage(suggestion);
  };

  // Only show suggestions if chat just has the welcome message
  const showSuggestions = messages.length === 1 && messages[0].role === "assistant";

  return (
    <>
      {/* Floating Action Button */}
      <button
        id="ai-chat-fab"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[999] w-14 h-14 rounded-full border-none cursor-pointer flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          background: "linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-secondary, #b45309))",
          boxShadow: isOpen
            ? "0 0 0 3px rgba(145, 71, 36, 0.3), 0 8px 32px rgba(0,0,0,0.3)"
            : "0 8px 32px rgba(0,0,0,0.3), 0 0 20px rgba(145, 71, 36, 0.2)",
        }}
        aria-label="Toggle AI Chat"
      >
        {isOpen ? (
          <X size={22} color="white" />
        ) : (
          <MessageCircle size={22} color="white" />
        )}

        {/* Pulse ring when closed */}
        {!isOpen && (
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              background: "var(--color-brand-primary)",
              opacity: 0.25,
              animationDuration: "2s",
            }}
          />
        )}
      </button>

      {/* Chat Panel */}
      <div
        className="fixed bottom-24 right-6 z-[998] flex flex-col overflow-hidden transition-all duration-300 ease-out"
        style={{
          width: isOpen ? "min(380px, calc(100vw - 48px))" : "0px",
          height: isOpen ? "min(560px, calc(100vh - 140px))" : "0px",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
          pointerEvents: isOpen ? "auto" : "none",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(17, 21, 19, 0.97)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(145,71,36,0.1)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-5 py-4 shrink-0"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "linear-gradient(135deg, rgba(145,71,36,0.15), rgba(180,83,9,0.08))",
          }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-secondary, #b45309))",
            }}
          >
            <Sparkles size={18} color="white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white m-0 leading-tight">{t.title}</h4>
            <p className="text-[11px] m-0 leading-tight" style={{ color: "var(--color-brand-primary)" }}>
              {t.subtitle}
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="bg-transparent border-none cursor-pointer p-1 rounded-lg transition-colors hover:bg-white/5"
            style={{ color: "var(--color-brand-text-muted)" }}
          >
            <ChevronDown size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className="max-w-[85%] px-3.5 py-2.5 text-[13px] leading-relaxed"
                style={{
                  borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background:
                    msg.role === "user"
                      ? "linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-secondary, #b45309))"
                      : "rgba(255,255,255,0.04)",
                  color: msg.role === "user" ? "white" : "rgba(255,255,255,0.88)",
                  border: msg.role === "user" ? "none" : "1px solid rgba(255,255,255,0.06)",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {formatMessage(msg.content)}

                {/* Source citations */}
                {msg.sources && msg.sources.length > 0 && (
                  <div
                    className="mt-2 pt-2 flex flex-wrap gap-1.5"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <span className="text-[10px] w-full" style={{ color: "var(--color-brand-text-muted)" }}>
                      {t.sourceLabel}
                    </span>
                    {msg.sources.map((src, j) => (
                      <span
                        key={j}
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{
                          background: "rgba(145,71,36,0.15)",
                          color: "var(--color-brand-primary)",
                          border: "1px solid rgba(145,71,36,0.2)",
                        }}
                      >
                        {src}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div
                className="px-4 py-3 rounded-2xl flex items-center gap-2 text-[13px]"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "var(--color-brand-text-muted)",
                }}
              >
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "var(--color-brand-primary)", animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "var(--color-brand-primary)", animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "var(--color-brand-primary)", animationDelay: "300ms" }} />
                </span>
                {t.thinking}
              </div>
            </div>
          )}

          {/* Suggestion chips */}
          {showSuggestions && (
            <div className="flex flex-wrap gap-2 mt-1">
              {t.suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestion(suggestion)}
                  className="text-[12px] px-3 py-1.5 rounded-full border cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: "rgba(145,71,36,0.08)",
                    borderColor: "rgba(145,71,36,0.2)",
                    color: "var(--color-brand-primary)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(145,71,36,0.18)";
                    e.currentTarget.style.borderColor = "rgba(145,71,36,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(145,71,36,0.08)";
                    e.currentTarget.style.borderColor = "rgba(145,71,36,0.2)";
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 px-4 py-3 shrink-0"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
            disabled={isLoading}
            className="flex-1 bg-transparent border-none outline-none text-[13px] text-white placeholder-[rgba(255,255,255,0.3)]"
            style={{ caretColor: "var(--color-brand-primary)" }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-8 h-8 rounded-full border-none cursor-pointer flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
            style={{
              background: input.trim()
                ? "linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-secondary, #b45309))"
                : "rgba(255,255,255,0.05)",
            }}
          >
            <Send size={14} color="white" />
          </button>
        </form>
      </div>
    </>
  );
}
