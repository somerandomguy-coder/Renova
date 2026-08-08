"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  ArrowLeft, 
  Send, 
  Sparkles, 
  ShoppingCart, 
  Calculator, 
  FileText, 
  Layers, 
  CheckCircle2, 
  ShieldAlert, 
  RefreshCw,
  Box,
  ChevronRight,
  Maximize2
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
        ? "Xin chào! 👋 Tôi là Trợ lý AI Chuyên sâu của ECOVAL. Tôi có thể hỗ trợ bạn tính toán số lượng gạch, lên báo giá đơn hàng, tính dòng tiền bù trừ EPR và xem bản vẽ kỹ thuật gạch bông gió. Hãy nhập câu hỏi hoặc chọn công cụ nhanh ở cột bên trái!"
        : "Hello! 👋 I am ECOVAL's Advanced AI Assistant. I can help you calculate brick quantities, generate instant order quotes, analyze EPR offset cashflows, and view technical CAD drawings. Type your query or choose a tool from the left panel!"
    }
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  // Dynamic Quote & Spec State
  const [wallArea, setWallArea] = useState<number>(40);
  const [plasticWaste, setPlasticWaste] = useState<number>(5000);
  const [activeTab, setActiveTab] = useState<"cad" | "cogs" | "epr">("cad");
  const [isCadModalOpen, setIsCadModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // Derived Calculations
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
                setMessages(prev => {
                  const updated = [...prev];
                  const lastIdx = updated.length - 1;
                  updated[lastIdx] = {
                    ...updated[lastIdx],
                    content: updated[lastIdx].content + data.content
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
            ? "⚠️ Không thể kết nối với DeepSeek AI API. Vui lòng kiểm tra lại dịch vụ backend."
            : "⚠️ Unable to connect to DeepSeek AI API. Please verify backend service status."
        };
        return updated;
      });
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Header Navigation Bar */}
      <header className="h-16 border-b border-zinc-800/80 bg-zinc-900/90 backdrop-blur-md px-6 flex items-center justify-between shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <a 
            href="/" 
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50"
          >
            <ArrowLeft size={16} />
            {lang === "vi" ? "Trang Chủ" : "Home"}
          </a>
          <div className="h-4 w-px bg-zinc-800" />
          <div className="flex items-center gap-2.5">
            <img src="/ecoval_logo.png" alt="ECOVAL" className="h-7 w-auto object-contain" />
            <span className="font-bold text-sm tracking-wide bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              ECOVAL AI WORKSPACE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* DeepSeek API Engine Status */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            DeepSeek-V3 Engine Active
          </div>

          {/* Bilingual Selector */}
          <div className="flex items-center gap-1 bg-zinc-800/80 p-1 rounded-lg border border-zinc-700/60">
            <button 
              onClick={() => setLang("vi")} 
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${lang === "vi" ? "bg-amber-600 text-white" : "text-zinc-400 hover:text-white"}`}
            >
              VI
            </button>
            <button 
              onClick={() => setLang("en")} 
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${lang === "en" ? "bg-amber-600 text-white" : "text-zinc-400 hover:text-white"}`}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      {/* 3-Column Interactive Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        
        {/* COLUMN 1: Quick Interactive Tools (3 Columns on LG) */}
        <div className="lg:col-span-3 border-r border-zinc-800/80 bg-zinc-900/40 p-5 overflow-y-auto flex flex-col gap-6">
          <div>
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-2">
              <Sparkles size={14} />
              {lang === "vi" ? "Công Cụ Tương Tác Nhanh" : "Interactive Tools"}
            </h3>
            <p className="text-xs text-zinc-400">
              {lang === "vi" ? "Nhập thông số để tự động tạo báo giá & câu hỏi cho AI" : "Enter parameters to auto-generate quotes & AI prompts"}
            </p>
          </div>

          {/* Quick Tool 1: Order & Price Estimator */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                <ShoppingCart size={15} className="text-amber-400" />
                {lang === "vi" ? "Tính Báo Giá Đặt Hàng" : "Order Quotation"}
              </span>
              <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                45.000đ/viên
              </span>
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">
                {lang === "vi" ? "Diện tích công trình (m²):" : "Project Surface Area (m²):"}
              </label>
              <input 
                type="number" 
                min="1" 
                value={wallArea}
                onChange={(e) => setWallArea(Math.max(1, Number(e.target.value)))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/60 text-xs flex flex-col gap-1.5">
              <div className="flex justify-between text-zinc-400">
                <span>{lang === "vi" ? "Số gạch cần:" : "Bricks Needed:"}</span>
                <span className="font-bold text-white">{calculatedBricks.toLocaleString()} viên</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>{lang === "vi" ? "Tổng chi phí mua:" : "Total Brick Cost:"}</span>
                <span className="font-bold text-amber-400">{totalCostVnd.toLocaleString()} VNĐ</span>
              </div>
              <div className="flex justify-between text-zinc-400 text-[11px]">
                <span>🌱 Giảm CO2:</span>
                <span className="text-emerald-400">{co2SavedKg.toLocaleString()} kg</span>
              </div>
            </div>

            <button 
              onClick={() => handleSendMessage(
                lang === "vi" 
                  ? `Tôi muốn báo giá chính thức cho dự án diện tích ${wallArea}m² (cần ${calculatedBricks} viên gạch ECOVAL). Chi phí là bao nhiêu và có chính sách chiết khấu không?`
                  : `I need an official quotation for a ${wallArea}m² project (${calculatedBricks} ECOVAL bricks). What is the total cost and bulk discount?`
              )}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send size={12} />
              {lang === "vi" ? "Hỏi AI Báo Giá Chi Tiết" : "Ask AI For Full Quote"}
            </button>
          </div>

          {/* Quick Tool 2: EPR Fee Savings */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                <Calculator size={15} className="text-teal-400" />
                {lang === "vi" ? "Tính Tiết Kiệm Phí EPR" : "EPR Offset Calculator"}
              </span>
              <span className="text-[10px] font-semibold bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded">
                -40% EPR Fee
              </span>
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">
                {lang === "vi" ? "Bao bì nhựa MLP xả ra (kg/năm):" : "Annual MLP Waste Output (kg/yr):"}
              </label>
              <input 
                type="number" 
                min="100" 
                step="500"
                value={plasticWaste}
                onChange={(e) => setPlasticWaste(Math.max(100, Number(e.target.value)))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/60 text-xs flex flex-col gap-1.5">
              <div className="flex justify-between text-zinc-400">
                <span>{lang === "vi" ? "Tiền tiết kiệm EPR:" : "EPR Cashflow Savings:"}</span>
                <span className="font-bold text-teal-400">{eprSavingsVnd.toLocaleString()} VNĐ</span>
              </div>
            </div>

            <button 
              onClick={() => handleSendMessage(
                lang === "vi"
                  ? `Công ty tôi thải ra ${plasticWaste} kg bao bì nhựa MLP hàng năm. Hãy tư vấn phương án ký hợp đồng hợp tác tái chế với ECOVAL để giảm 40% phí EPR.`
                  : `My company generates ${plasticWaste} kg of MLP plastic waste annually. Advise us on signing an EPR recycling contract with ECOVAL to claim 40% fee reduction.`
              )}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send size={12} />
              {lang === "vi" ? "Hỏi AI Tư Vấn EPR" : "Ask AI EPR Strategy"}
            </button>
          </div>

          {/* Quick Tool 3: Technical Drawings & Specs */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
            <span className="text-xs font-bold text-zinc-200 flex items-center gap-2">
              <FileText size={15} className="text-purple-400" />
              {lang === "vi" ? "Bản Vẽ & Cấp Phối R&D" : "CAD Drawings & Specs"}
            </span>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              {lang === "vi" 
                ? "Gạch bông gió Gen3 Heritage: Cường độ nén 7.8-8.2 MPa, tỷ lệ 70% nhựa MLP + 25% vỏ trấu + 5% phụ gia." 
                : "Gen3 Heritage Block: 7.8-8.2 MPa strength, 70% MLP plastic + 25% rice husk + 5% additives."}
            </p>
            <button 
              onClick={() => setIsCadModalOpen(true)}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Maximize2 size={12} />
              {lang === "vi" ? "Mở Bản Vẽ CAD 2D/3D" : "View Full CAD Blueprint"}
            </button>
          </div>
        </div>

        {/* COLUMN 2: Main DeepSeek AI Streaming Chat (5 Columns on LG) */}
        <div className="lg:col-span-5 flex flex-col bg-zinc-950 h-[calc(100vh-4rem)]">
          
          {/* Chat Messages Log */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-5">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shrink-0 shadow-md">
                    <Sparkles size={16} className="text-white" />
                  </div>
                )}

                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-amber-600 text-white rounded-tr-none font-medium"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>

                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-zinc-800 text-[11px] text-zinc-400 flex flex-col gap-1">
                      <span className="font-semibold text-amber-400">📄 {lang === "vi" ? "Trích dẫn tài liệu:" : "Knowledge Sources:"}</span>
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
              <div className="flex gap-3.5 items-center text-zinc-400 text-xs">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center animate-spin">
                  <RefreshCw size={14} className="text-amber-400" />
                </div>
                <span>DeepSeek-V3 {lang === "vi" ? "đang truy xuất tri thức và suy luận..." : "is retrieving context & reasoning..."}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestion Chips */}
          <div className="px-6 py-2 border-t border-zinc-900 bg-zinc-950/80 flex items-center gap-2 overflow-x-auto">
            {[
              lang === "vi" ? "ECOVAL là gì?" : "What is ECOVAL?",
              lang === "vi" ? "Gạch Gen3 chịu lực mấy MPa?" : "Gen3 Strength (MPa)?",
              lang === "vi" ? "Quy trình giảm 40% phí EPR" : "EPR 40% Fee Refund",
              lang === "vi" ? "Bản vẽ hoa văn di sản" : "Heritage CAD Specs"
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap px-3 py-1 rounded-full text-xs bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-300 hover:border-amber-500/50 transition-all cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input Field */}
          <div className="p-4 border-t border-zinc-800/80 bg-zinc-900/60">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 focus-within:border-amber-500 transition-colors"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={lang === "vi" ? "Hỏi DeepSeek AI về sản phẩm, giá bán, ESG, EPR..." : "Ask DeepSeek AI about products, pricing, ESG, EPR..."}
                className="flex-1 bg-transparent border-none text-sm text-white placeholder-zinc-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || isThinking}
                className="p-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white transition-colors cursor-pointer"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* COLUMN 3: Dynamic Technical Drawing & Order Viewer (4 Columns on LG) */}
        <div className="lg:col-span-4 border-l border-zinc-800/80 bg-zinc-900/30 p-6 overflow-y-auto flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Box size={16} />
              {lang === "vi" ? "Xem Trước Sản Phẩm & Bản Vẽ" : "Product Spec & CAD Preview"}
            </h3>

            <div className="flex gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-[11px]">
              <button 
                onClick={() => setActiveTab("cad")}
                className={`px-2 py-1 rounded font-semibold ${activeTab === "cad" ? "bg-amber-600 text-white" : "text-zinc-400"}`}
              >
                CAD 2D
              </button>
              <button 
                onClick={() => setActiveTab("cogs")}
                className={`px-2 py-1 rounded font-semibold ${activeTab === "cogs" ? "bg-amber-600 text-white" : "text-zinc-400"}`}
              >
                Formula
              </button>
            </div>
          </div>

          {/* Interactive CAD Drawing Box */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />
            
            {/* Visual CAD Representation */}
            <div className="relative z-10 w-36 h-36 border-2 border-amber-500/80 rounded-xl p-3 flex flex-col items-center justify-center bg-amber-500/5 shadow-inner">
              <div className="w-20 h-20 border border-dashed border-amber-400/60 rounded-lg flex items-center justify-center">
                <span className="text-[10px] text-amber-300 font-mono">190×190mm</span>
              </div>
              <span className="text-[10px] text-zinc-400 mt-2 font-mono">Thickness: 65mm</span>
            </div>

            <div className="mt-4 text-center relative z-10">
              <h4 className="text-sm font-bold text-white">ECOVAL Gen3 Heritage Block</h4>
              <p className="text-[11px] text-zinc-400">Compressive Strength: 7.8 – 8.2 MPa</p>
            </div>
          </div>

          {/* Detailed Material Composition Breakdown */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
            <h4 className="text-xs font-bold text-zinc-200 border-b border-zinc-800 pb-2">
              {lang === "vi" ? "Cấp Phối Vật Liệu Chịu Lực (Locked Ratio)" : "Material Composition Ratio"}
            </h4>
            
            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-zinc-300">Nhựa đa lớp MLP (Recycled Polymer)</span>
                  <span className="font-bold text-amber-400">70%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[70%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-zinc-300">Vỏ trấu nông nghiệp (Cellulose Fiber)</span>
                  <span className="font-bold text-teal-400">25%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 w-[25%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-zinc-300">Phụ gia liên kết chéo & Chống UV</span>
                  <span className="font-bold text-purple-400">5%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-[5%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Download Specifications Certificate Simulation */}
          <div className="mt-auto bg-gradient-to-r from-amber-950/40 to-zinc-900 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between">
            <div>
              <h5 className="text-xs font-bold text-amber-200">Bản Cứng Chứng Nhận TCVN</h5>
              <p className="text-[10px] text-zinc-400">Tải file PDF kiểm định chất lượng Quatest 3</p>
            </div>
            <button 
              onClick={() => alert(lang === "vi" ? "Đã tải file PDF chứng nhận TCVN & Kết quả kiểm định Quatest 3 thành công!" : "Downloaded TCVN & Quatest 3 Certificate PDF!")}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Download PDF
            </button>
          </div>
        </div>

      </div>

      {/* CAD Blueprint Full Screen Modal */}
      {isCadModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-3xl w-full p-6 flex flex-col gap-4 shadow-2xl relative">
            <button 
              onClick={() => setIsCadModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
              <Box size={20} />
              ECOVAL Gen3 Heritage Breeze Block — Technical Drawing Specification
            </h3>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center min-h-[320px]">
              <div className="w-56 h-56 border-2 border-amber-500 rounded-2xl p-4 flex flex-col items-center justify-center bg-amber-500/10 relative">
                <div className="w-32 h-32 border-2 border-dashed border-amber-300 rounded-xl flex items-center justify-center">
                  <span className="text-xs text-amber-300 font-mono">HOLLOW AIRWAY</span>
                </div>
                <span className="absolute -bottom-6 text-xs text-zinc-400 font-mono">Width: 190mm | Height: 190mm</span>
                <span className="absolute -right-16 text-xs text-zinc-400 font-mono rotate-90">Depth: 65mm</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-xs">
              <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                <span className="text-zinc-400 block">Unit Weight:</span>
                <span className="font-bold text-white text-sm">1.5 kg / block</span>
              </div>
              <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                <span className="text-zinc-400 block">Compressive Endurance:</span>
                <span className="font-bold text-amber-400 text-sm">7.8 – 8.2 MPa</span>
              </div>
              <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                <span className="text-zinc-400 block">Water Absorption:</span>
                <span className="font-bold text-teal-400 text-sm">&lt; 1.2%</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
