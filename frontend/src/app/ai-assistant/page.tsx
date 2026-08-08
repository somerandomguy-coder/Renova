"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  ArrowLeft, 
  Send, 
  Sparkles, 
  ShoppingCart, 
  Calculator, 
  FileText, 
  Box, 
  RefreshCw,
  Layers,
  Leaf,
  ShieldCheck,
  Building
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

export default function AiAssistantPage() {
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: lang === "vi" 
        ? "Xin chào! 👋 Tôi là Trợ lý AI Chuyên sâu của ECOVAL. Tôi có thể hỗ trợ bạn về thông số sản phẩm gạch bông gió, tính toán báo giá, dòng tiền bù trừ phí EPR và các chứng nhận thử nghiệm. Hãy nhập câu hỏi hoặc bấm chọn công cụ nhanh bên dưới!"
        : "Hello! 👋 I am ECOVAL's AI Assistant. I can help you with breeze block technical specs, project quotation calculations, EPR fee offset analysis, and certified test data. Feel free to type your question or select a quick tool!"
    }
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  // Dynamic Calculation States
  const [wallArea, setWallArea] = useState<number>(40);
  const [plasticWaste, setPlasticWaste] = useState<number>(5000);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // Calculations
  const calculatedBricks = Math.ceil(wallArea * 25);
  const totalCostVnd = calculatedBricks * 45000;
  const plasticSavedKg = Math.round(calculatedBricks * 1.05);
  const co2SavedKg = Math.round(calculatedBricks * 1.50);

  const standardEprFee = plasticWaste * 15000;
  const optimizedEprFee = standardEprFee * 0.60;
  const eprSavingsVnd = standardEprFee - optimizedEprFee;

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isThinking) return;

    const userMessage: Message = { role: "user", content: query };
    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInput("");
    setIsThinking(true);

    const historyPayload = messages.map(m => ({ role: m.role, content: m.content }));
    const assistantMessage: Message = { role: "assistant", content: "" };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      const response = await fetch("http://localhost:8000/api/v1/ai/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: historyPayload
        })
      });

      if (!response.ok || !response.body) {
        throw new Error("API request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.replace("data: ", "").trim();
            if (!jsonStr) continue;

            try {
              const data = JSON.parse(jsonStr);

              if (data.type === "token") {
                const textChunk = data.token || data.content || "";
                setMessages(prev => {
                  const updated = [...prev];
                  const lastIdx = updated.length - 1;
                  updated[lastIdx] = {
                    ...updated[lastIdx],
                    content: updated[lastIdx].content + textChunk
                  };
                  return updated;
                });
              } else if (data.type === "sources") {
                setMessages(prev => {
                  const updated = [...prev];
                  const lastIdx = updated.length - 1;
                  updated[lastIdx] = {
                    ...updated[lastIdx],
                    sources: data.sources
                  };
                  return updated;
                });
              }
            } catch (e) {
              console.error("Error parsing SSE line:", e);
            }
          }
        }
      }
    } catch (err) {
      console.error("Streaming error:", err);
      setMessages(prev => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        updated[lastIdx] = {
          role: "assistant",
          content: lang === "vi"
            ? "⚠️ Không thể kết nối với máy chủ AI. Vui lòng thử lại sau."
            : "⚠️ Unable to connect to AI server. Please try again later."
        };
        return updated;
      });
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-zinc-950 text-brand-text-primary dark:text-zinc-100 flex flex-col font-sans selection:bg-brand-primary/20">
      
      {/* Sticky Header — Matches Main Page Style */}
      <header className="sticky top-0 z-50 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md border-b border-black/5 dark:border-white/5 h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <a 
            href="/" 
            className="flex items-center gap-2 text-brand-text-muted hover:text-brand-primary transition-colors text-xs font-semibold px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 border border-brand-border dark:border-white/10"
          >
            <ArrowLeft size={16} />
            {lang === "vi" ? "Trang Chủ" : "Home"}
          </a>
          <div className="h-4 w-px bg-brand-border dark:bg-zinc-800" />
          <div className="flex items-center gap-3">
            <img src="/ecoval_logo.png" alt="ECOVAL Logo" className="h-9 w-auto object-contain dark:brightness-110" />
            <span className="text-[10px] font-bold text-brand-text-muted border border-brand-border dark:border-zinc-800 px-1.5 py-0.5 rounded uppercase hidden sm:inline-block">
              SUSTAINABLE MATERIALS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* DeepSeek API Engine Active Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            DeepSeek-V3 Engine Active
          </div>

          {/* Bilingual Toggle */}
          <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-full border border-brand-border dark:border-zinc-800">
            <button 
              onClick={() => setLang("vi")} 
              className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all ${lang === "vi" ? "bg-brand-primary text-white" : "text-brand-text-muted"}`}
            >
              VI
            </button>
            <button 
              onClick={() => setLang("en")} 
              className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all ${lang === "en" ? "bg-brand-primary text-white" : "text-brand-text-muted"}`}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      {/* 3-Column Interactive Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        
        {/* COLUMN 1: Interactive Calculators (3 Columns on LG) */}
        <div className="lg:col-span-3 border-r border-brand-border dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/40 p-5 overflow-y-auto flex flex-col gap-6">
          <div>
            <h3 className="text-xs font-bold text-brand-primary dark:text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-2 font-heading">
              <Sparkles size={14} />
              {lang === "vi" ? "Công Cụ Tính Toán Nhanh" : "Quick Interactive Tools"}
            </h3>
            <p className="text-xs text-brand-text-muted dark:text-zinc-400">
              {lang === "vi" ? "Nhập thông số công trình để xem dự toán và hỏi AI" : "Enter parameters to estimate costs and ask AI"}
            </p>
          </div>

          {/* Order & Cost Calculator */}
          <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-text-primary dark:text-zinc-200 flex items-center gap-2 font-heading">
                <ShoppingCart size={15} className="text-brand-primary dark:text-amber-400" />
                {lang === "vi" ? "Dự Toán Gạch & Chi Phí" : "Order Quotation"}
              </span>
              <span className="text-[10px] font-semibold bg-brand-primary/10 text-brand-primary dark:bg-amber-500/20 dark:text-amber-300 px-2 py-0.5 rounded">
                45.000đ/viên
              </span>
            </div>

            <div>
              <label className="text-[11px] text-brand-text-muted dark:text-zinc-400 block mb-1">
                {lang === "vi" ? "Diện tích tường thi công (m²):" : "Installation Surface Area (m²):"}
              </label>
              <input 
                type="number" 
                min="1" 
                value={wallArea}
                onChange={(e) => setWallArea(Math.max(1, Number(e.target.value)))}
                className="w-full bg-black/3 dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-brand-text-primary dark:text-white focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="bg-[#FAF8F5] dark:bg-zinc-950/60 p-3 rounded-xl border border-brand-border dark:border-zinc-800/60 text-xs flex flex-col gap-1.5">
              <div className="flex justify-between text-brand-text-muted dark:text-zinc-400">
                <span>{lang === "vi" ? "Số gạch ước tính:" : "Bricks Needed:"}</span>
                <span className="font-bold text-brand-text-primary dark:text-white">{calculatedBricks.toLocaleString()} viên</span>
              </div>
              <div className="flex justify-between text-brand-text-muted dark:text-zinc-400">
                <span>{lang === "vi" ? "Tổng chi phí gốc:" : "Total Brick Cost:"}</span>
                <span className="font-bold text-brand-primary dark:text-amber-400">{totalCostVnd.toLocaleString()} VNĐ</span>
              </div>
              <div className="flex justify-between text-brand-text-muted dark:text-zinc-400 text-[11px]">
                <span>🌱 Giảm khí nhà kính:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{co2SavedKg.toLocaleString()} kg CO2</span>
              </div>
            </div>

            <button 
              onClick={() => handleSendMessage(
                lang === "vi" 
                  ? `Tôi cần báo giá chính thức cho dự án diện tích ${wallArea}m² (cần khoảng ${calculatedBricks} viên gạch ECOVAL). Chi phí là bao nhiêu và có chính sách chiết khấu không?`
                  : `I need a formal quote for a ${wallArea}m² project (${calculatedBricks} ECOVAL bricks). What is the total cost and bulk discount policy?`
              )}
              className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Send size={12} />
              {lang === "vi" ? "Hỏi AI Báo Giá Chi Tiết" : "Ask AI For Full Quote"}
            </button>
          </div>

          {/* EPR Cashflow Savings Calculator */}
          <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-text-primary dark:text-zinc-200 flex items-center gap-2 font-heading">
                <Calculator size={15} className="text-teal-600 dark:text-teal-400" />
                {lang === "vi" ? "Tối Ưu Phí EPR" : "EPR Offset Calculator"}
              </span>
              <span className="text-[10px] font-semibold bg-teal-500/10 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300 px-2 py-0.5 rounded">
                -40% EPR Fee
              </span>
            </div>

            <div>
              <label className="text-[11px] text-brand-text-muted dark:text-zinc-400 block mb-1">
                {lang === "vi" ? "Bao bì nhựa MLP xả ra (kg/năm):" : "Annual MLP Waste Output (kg/yr):"}
              </label>
              <input 
                type="number" 
                min="100" 
                step="500"
                value={plasticWaste}
                onChange={(e) => setPlasticWaste(Math.max(100, Number(e.target.value)))}
                className="w-full bg-black/3 dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-brand-text-primary dark:text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="bg-[#FAF8F5] dark:bg-zinc-950/60 p-3 rounded-xl border border-brand-border dark:border-zinc-800/60 text-xs flex flex-col gap-1.5">
              <div className="flex justify-between text-brand-text-muted dark:text-zinc-400">
                <span>{lang === "vi" ? "Tiền tiết kiệm EPR:" : "EPR Cashflow Savings:"}</span>
                <span className="font-bold text-teal-600 dark:text-teal-400">{eprSavingsVnd.toLocaleString()} VNĐ</span>
              </div>
            </div>

            <button 
              onClick={() => handleSendMessage(
                lang === "vi"
                  ? `Công ty tôi thải ra ${plasticWaste} kg bao bì nhựa MLP hàng năm. Hãy tư vấn phương án ký hợp đồng hợp tác tái chế với ECOVAL để giảm 40% phí EPR.`
                  : `My company generates ${plasticWaste} kg of MLP plastic waste annually. Advise us on signing an EPR recycling contract with ECOVAL to claim 40% fee reduction.`
              )}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Send size={12} />
              {lang === "vi" ? "Hỏi AI Tư Vấn EPR" : "Ask AI EPR Strategy"}
            </button>
          </div>
        </div>

        {/* COLUMN 2: Main DeepSeek AI Streaming Chat (5 Columns on LG) */}
        <div className="lg:col-span-5 flex flex-col bg-[#FAF8F5] dark:bg-zinc-950 h-[calc(100vh-5rem)]">
          
          {/* Chat Messages Log */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-5">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="w-8 h-8 rounded-xl bg-brand-primary text-white flex items-center justify-center shrink-0 shadow-md">
                    <Sparkles size={16} />
                  </div>
                )}

                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-brand-primary text-white rounded-tr-none font-medium shadow-sm"
                      : "bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 text-brand-text-primary dark:text-zinc-200 rounded-tl-none shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>

                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-brand-border dark:border-zinc-800 text-[11px] text-brand-text-muted dark:text-zinc-400 flex flex-col gap-1">
                      <span className="font-semibold text-brand-primary dark:text-amber-400">📄 {lang === "vi" ? "Trích dẫn tài liệu:" : "Knowledge Sources:"}</span>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {m.sources.map((src, i) => (
                          <li key={i}>{src}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex gap-3.5 items-center text-brand-text-muted dark:text-zinc-400 text-xs">
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 flex items-center justify-center animate-spin">
                  <RefreshCw size={14} className="text-brand-primary dark:text-amber-400" />
                </div>
                <span>DeepSeek-V3 {lang === "vi" ? "đang suy luận và truy xuất thông tin..." : "is retrieving context & reasoning..."}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestion Chips */}
          <div className="px-6 py-2 border-t border-brand-border dark:border-zinc-900 bg-white/60 dark:bg-zinc-950/80 flex items-center gap-2 overflow-x-auto">
            {[
              lang === "vi" ? "ECOVAL là gì?" : "What is ECOVAL?",
              lang === "vi" ? "Gạch Gen3 chịu lực mấy MPa?" : "Gen3 Strength (MPa)?",
              lang === "vi" ? "Quy trình giảm 40% phí EPR" : "EPR 40% Fee Refund",
              lang === "vi" ? "Kích thước gạch chuẩn" : "Standard Dimensions"
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap px-3 py-1 rounded-full text-xs bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 text-brand-text-muted dark:text-zinc-400 hover:text-brand-primary dark:hover:text-amber-300 hover:border-brand-primary transition-all cursor-pointer shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input Field */}
          <div className="p-4 border-t border-brand-border dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-3 bg-[#FAF8F5] dark:bg-zinc-950 border border-brand-border dark:border-zinc-800 rounded-xl px-4 py-2.5 focus-within:border-brand-primary transition-colors"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={lang === "vi" ? "Hỏi DeepSeek AI về sản phẩm gạch, ESG, EPR..." : "Ask DeepSeek AI about products, pricing, ESG, EPR..."}
                className="flex-1 bg-transparent border-none text-sm text-brand-text-primary dark:text-white placeholder-brand-text-muted focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || isThinking}
                className="p-2 rounded-xl bg-brand-primary hover:bg-brand-secondary disabled:opacity-40 text-white transition-colors cursor-pointer shadow-sm"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* COLUMN 3: Technical Specifications Panel (4 Columns on LG) */}
        <div className="lg:col-span-4 border-l border-brand-border dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/30 p-6 overflow-y-auto flex flex-col gap-6">
          
          <div className="border-b border-brand-border dark:border-zinc-800 pb-3">
            <h3 className="text-xs font-bold text-brand-primary dark:text-amber-400 uppercase tracking-wider flex items-center gap-2 font-heading">
              <Box size={16} />
              {lang === "vi" ? "Thông Số Kỹ Thuật Sản Phẩm" : "Product Technical Specifications"}
            </h3>
            <p className="text-xs text-brand-text-muted dark:text-zinc-400 mt-1">
              {lang === "vi" ? "Dữ liệu kiểm định bởi Phòng thí nghiệm HCMUT & Ánh Thủy JSC" : "Validated by HCMUT R&D Lab & Anh Thuy JSC"}
            </p>
          </div>

          {/* Key Product Parameters Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white dark:bg-zinc-950 p-3.5 rounded-xl border border-brand-border dark:border-zinc-800">
              <span className="text-brand-text-muted dark:text-zinc-400 block mb-1 font-medium">Kích thước chuẩn:</span>
              <span className="font-bold text-brand-text-primary dark:text-white text-sm">190 × 190 × 65 mm</span>
            </div>

            <div className="bg-white dark:bg-zinc-950 p-3.5 rounded-xl border border-brand-border dark:border-zinc-800">
              <span className="text-brand-text-muted dark:text-zinc-400 block mb-1 font-medium">Trọng lượng viên:</span>
              <span className="font-bold text-brand-text-primary dark:text-white text-sm">1.5 kg (Siêu nhẹ)</span>
            </div>

            <div className="bg-white dark:bg-zinc-950 p-3.5 rounded-xl border border-brand-border dark:border-zinc-800">
              <span className="text-brand-text-muted dark:text-zinc-400 block mb-1 font-medium">Cường độ nén Gen3:</span>
              <span className="font-bold text-brand-primary dark:text-amber-400 text-sm">7.8 – 8.2 MPa</span>
            </div>

            <div className="bg-white dark:bg-zinc-950 p-3.5 rounded-xl border border-brand-border dark:border-zinc-800">
              <span className="text-brand-text-muted dark:text-zinc-400 block mb-1 font-medium">Độ hút nước:</span>
              <span className="font-bold text-teal-600 dark:text-teal-400 text-sm">&lt; 1.2%</span>
            </div>
          </div>

          {/* Material Composition Breakdown */}
          <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
            <h4 className="text-xs font-bold text-brand-text-primary dark:text-zinc-200 border-b border-brand-border dark:border-zinc-800 pb-2 font-heading">
              {lang === "vi" ? "Cấp Phối Cố Định (Locked Formula)" : "Locked Material Formula"}
            </h4>
            
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-brand-text-primary dark:text-zinc-300 font-medium">Nhựa đa lớp MLP (Polymer tái chế)</span>
                  <span className="font-bold text-brand-primary dark:text-amber-400">70%</span>
                </div>
                <div className="w-full h-2 bg-black/5 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-primary dark:bg-amber-500 w-[70%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-brand-text-primary dark:text-zinc-300 font-medium">Vỏ trấu nông nghiệp (Sợi Xenlulo)</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">25%</span>
                </div>
                <div className="w-full h-2 bg-black/5 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 w-[25%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-brand-text-primary dark:text-zinc-300 font-medium">Phụ gia liên kết & Chống tia UV</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">5%</span>
                </div>
                <div className="w-full h-2 bg-black/5 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-[5%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Environmental Impact Summary */}
          <div className="bg-gradient-to-br from-brand-primary/10 to-teal-500/10 dark:from-amber-950/40 dark:to-zinc-900 border border-brand-primary/20 dark:border-amber-500/30 rounded-2xl p-4 flex flex-col gap-2">
            <h4 className="text-xs font-bold text-brand-primary dark:text-amber-300 flex items-center gap-1.5 font-heading">
              <Leaf size={15} />
              {lang === "vi" ? "Tác Động Sinh Thái Mỗi Viên Gạch" : "Eco Impact Per Brick"}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-brand-text-muted dark:text-zinc-300 mt-1">
              <div>
                <span className="block text-[11px]">Bảo vệ môi trường:</span>
                <span className="font-bold text-brand-text-primary dark:text-white">1.05 kg rác nhựa</span>
              </div>
              <div>
                <span className="block text-[11px]">Giảm phát thải CO2:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">1.50 kg CO2</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
