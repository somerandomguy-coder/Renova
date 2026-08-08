"use client";

import React, { useState } from "react";
import { ArrowLeft, BookOpen, CheckCircle, Scale, Shield } from "lucide-react";

export default function TermsOfServicePage() {
  const [lang, setLang] = useState<"vi" | "en">("vi");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Header Bar */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
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
            <span className="font-bold text-sm tracking-wide text-amber-400">
              ECOVAL — TERMS OF SERVICE
            </span>
          </div>
        </div>

        {/* Language Selector */}
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
      </header>

      {/* Main Terms Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 sm:p-12 shadow-2xl backdrop-blur-sm space-y-8">
          
          <div className="border-b border-zinc-800 pb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3 font-heading">
              <BookOpen className="text-amber-400 w-8 h-8" />
              {lang === "vi" ? "Quy Chế Thanh Vien & Dieu Khoan Su Dung" : "Terms of Service & Membership Rules"}
            </h1>
            <p className="text-xs text-zinc-400 mt-2">
              {lang === "vi" ? "Hieu luc tu: Ngay 09 thang 08 nam 2026 | Ap dung cho he sinh thai ECOVAL Sustainable Materials" : "Effective date: August 09, 2026 | Governs ECOVAL Sustainable Materials Ecosystem"}
            </p>
          </div>

          {lang === "vi" ? (
            <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
              <section className="space-y-2">
                <h2 className="text-base font-bold text-amber-300 flex items-center gap-2">
                  <CheckCircle size={18} /> 1. Pham Vi Ap Dung
                </h2>
                <p>
                  Văn bản này quy định các điều khoản sử dụng nền tảng số, bộ tính toán ESG, mô hình hoàn phí EPR và dịch vụ trợ lý AI của ECOVAL Sustainable Materials. Việc truy cập và gửi thông tin đăng ký đồng nghĩa với việc đối tác chấp thuận các quy định này.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-amber-300 flex items-center gap-2">
                  <Scale size={18} /> 2. Quy Chuan Chat Luong & Kiem Dinh Gach
                </h2>
                <p>
                  Sản phẩm gạch bông gió sinh thái ECOVAL tuân thủ nghiêm ngặt các chứng nhận kiểm định chất lượng:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                  <li><strong>Cuong do nen:</strong> Dat 7.8 - 8.2 MPa (Gen3 Heritage Breeze Block) theo kiem dinh Quatest 3.</li>
                  <li><strong>Chong tia UV:</strong> Kiem dinh 500 gio phong SGS & ASTM G154, bao hanh giu mau 10 nam ngoai troi.</li>
                  <li><strong>Cap phoi tuan hoan:</strong> Co dinh 70% Nhua MLP + 25% Vo trấu + 5% Phu gia chong lao hoa.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-amber-300 flex items-center gap-2">
                  <Shield size={18} /> 3. Trach Nhiem Thu Gom & Cap Chung Chi EPR
                </h2>
                <p>
                  Các doanh nghiệp ký kết hợp tác xử lý rác thải nhựa đa lớp (MLP) với ECOVAL sẽ được cấp Chứng nhận Hoàn thành Trách nhiệm EPR điện tử. Kết quả tính toán cắt giảm phí EPR (giảm tối đa 40%) dựa trên công thức quy định tại Nghị định 08/2022/NĐ-CP và Nghị định 05/2025/NĐ-CP.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-amber-300">4. Quyen So Huu Tri Tue</h2>
                <p>
                  Toàn bộ thiết kế khuôn mẫu gạch bông gió di sản, mã nguồn công cụ tính toán ESG/EPR và nhãn hiệu **ECOVAL Sustainable Materials** thuộc bản quyền sở hữu trí tuệ của đội ngũ dự án ECOVAL.
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
              <section className="space-y-2">
                <h2 className="text-base font-bold text-amber-300 flex items-center gap-2">
                  <CheckCircle size={18} /> 1. Scope of Agreement
                </h2>
                <p>
                  These Terms of Service govern the use of ECOVAL's digital platform, ESG calculators, EPR fee optimization engine, and AI assistant services. By accessing or submitting forms on the platform, partners agree to abide by these terms.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-amber-300 flex items-center gap-2">
                  <Scale size={18} /> 2. Quality Standards & Certifications
                </h2>
                <p>ECOVAL eco-breeze block products strictly comply with verified technical standards:</p>
                <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                  <li><strong>Compressive Strength:</strong> Certified 7.8 - 8.2 MPa (Gen3 Heritage) via Quatest 3.</li>
                  <li><strong>UV Resistance:</strong> Tested under SGS 500-hour UV chamber & ASTM G154, backed by a 10-year colorfast warranty.</li>
                  <li><strong>Material Ratio:</strong> Locked formula of 70% MLP plastic + 25% rice husk + 5% additives.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-amber-300 flex items-center gap-2">
                  <Shield size={18} /> 3. EPR Collection & Certification
                </h2>
                <p>
                  FMCG partners contracting MLP waste upcycling with ECOVAL receive official digital EPR Compliance Certificates. Fee reduction estimates (up to 40%) adhere to Vietnamese Decrees 08/2022/ND-CP and 05/2025/ND-CP.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-amber-300">4. Intellectual Property</h2>
                <p>
                  All heritage block mold designs, ESG calculation algorithms, and the **ECOVAL Sustainable Materials** trademark are the exclusive intellectual property of the ECOVAL project team.
                </p>
              </section>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
