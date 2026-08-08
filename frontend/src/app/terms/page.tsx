"use client";

import React, { useState } from "react";
import { ArrowLeft, BookOpen, CheckCircle, Scale, Shield } from "lucide-react";

export default function TermsOfServicePage() {
  const [lang, setLang] = useState<"vi" | "en">("vi");

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-zinc-950 text-brand-text-primary dark:text-zinc-100 font-sans selection:bg-brand-primary/20">
      
      {/* Sticky Header Bar */}
      <header className="h-20 border-b border-black/5 dark:border-white/5 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3 sm:gap-4">
          <a 
            href="/" 
            className="flex items-center gap-2 text-brand-text-muted hover:text-brand-primary transition-colors text-xs font-semibold px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 border border-brand-border dark:border-white/10"
          >
            <ArrowLeft size={16} />
            {lang === "vi" ? "Trang Chủ" : "Home"}
          </a>
          <div className="h-4 w-px bg-brand-border dark:bg-zinc-800" />
          <div className="flex items-center gap-2.5">
            <img src="/ecoval_logo.png" alt="ECOVAL Logo" className="h-8 sm:h-9 w-auto object-contain dark:brightness-110" />
            <span className="font-bold text-xs sm:text-sm tracking-wide text-brand-primary dark:text-amber-400 hidden xs:inline-block">
              ECOVAL — TERMS OF SERVICE
            </span>
          </div>
        </div>

        {/* Language Selector */}
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
      </header>

      {/* Main Terms Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 shadow-xl backdrop-blur-sm space-y-8">
          
          <div className="border-b border-brand-border dark:border-zinc-800 pb-6">
            <h1 className="text-xl sm:text-3xl font-extrabold text-brand-text-primary dark:text-white flex items-center gap-3 font-heading">
              <BookOpen className="text-brand-primary dark:text-amber-400 w-7 h-7 sm:w-9 sm:h-9 shrink-0" />
              {lang === "vi" ? "Quy Chế Thành Viên & Điều Khoản Sử Dụng" : "Terms of Service & Membership Rules"}
            </h1>
            <p className="text-xs sm:text-sm text-brand-text-muted dark:text-zinc-400 mt-2">
              {lang === "vi" ? "Hiệu lực từ: Ngày 09 tháng 08 năm 2026 | Áp dụng cho hệ sinh thái ECOVAL Sustainable Materials" : "Effective date: August 09, 2026 | Governs ECOVAL Sustainable Materials Ecosystem"}
            </p>
          </div>

          {lang === "vi" ? (
            <div className="space-y-6 text-xs sm:text-sm text-brand-text-primary dark:text-zinc-300 leading-relaxed">
              <section className="space-y-2">
                <h2 className="text-sm sm:text-base font-bold text-brand-primary dark:text-amber-300 flex items-center gap-2 font-heading">
                  <CheckCircle size={18} className="shrink-0" /> 1. Phạm Vi Áp Dụng
                </h2>
                <p>
                  Văn bản này quy định các điều khoản sử dụng nền tảng số, bộ tính toán ESG, mô hình hoàn phí EPR và dịch vụ trợ lý AI của ECOVAL Sustainable Materials. Việc truy cập và gửi thông tin đăng ký đồng nghĩa với việc đối tác chấp thuận các quy định này.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm sm:text-base font-bold text-brand-primary dark:text-amber-300 flex items-center gap-2 font-heading">
                  <Scale size={18} className="shrink-0" /> 2. Quy Chuẩn Chất Lượng & Kiểm Định Gạch
                </h2>
                <p>
                  Sản phẩm gạch bông gió sinh thái ECOVAL tuân thủ nghiêm ngặt các chứng nhận kiểm định chất lượng:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-brand-text-muted dark:text-zinc-400">
                  <li><strong>Cường độ nén:</strong> Đạt 7.8 - 8.2 MPa (Gen3 Heritage Breeze Block) theo kiểm định Quatest 3.</li>
                  <li><strong>Chống tia UV:</strong> Thử nghiệm 500 giờ phòng SGS & ASTM G154, bảo hành giữ màu 10 năm ngoài trời.</li>
                  <li><strong>Cấp phối tuần hoàn:</strong> Cố định 70% Nhựa MLP + 25% Vỏ trấu + 5% Phụ gia liên kết & chống lão hóa.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm sm:text-base font-bold text-brand-primary dark:text-amber-300 flex items-center gap-2 font-heading">
                  <Shield size={18} className="shrink-0" /> 3. Trách Nhiệm Thu Gom & Cấp Chứng Chỉ EPR
                </h2>
                <p>
                  Các doanh nghiệp ký kết hợp tác xử lý rác thải nhựa đa lớp (MLP) với ECOVAL sẽ được cấp Chứng nhận Hoàn thành Trách nhiệm EPR điện tử. Kết quả tính toán cắt giảm phí EPR (giảm tối đa 40%) dựa trên công thức quy định tại Nghị định 08/2022/NĐ-CP và Nghị định 05/2025/NĐ-CP.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm sm:text-base font-bold text-brand-primary dark:text-amber-300 font-heading">4. Quyền Sở Hữu Trí Tuệ</h2>
                <p>
                  Toàn bộ thiết kế khuôn mẫu gạch bông gió di sản, mã nguồn công cụ tính toán ESG/EPR và nhãn hiệu <strong>ECOVAL Sustainable Materials</strong> thuộc bản quyền sở hữu trí tuệ của đội ngũ dự án ECOVAL.
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-6 text-xs sm:text-sm text-brand-text-primary dark:text-zinc-300 leading-relaxed">
              <section className="space-y-2">
                <h2 className="text-sm sm:text-base font-bold text-brand-primary dark:text-amber-300 flex items-center gap-2 font-heading">
                  <CheckCircle size={18} className="shrink-0" /> 1. Scope of Agreement
                </h2>
                <p>
                  These Terms of Service govern the use of ECOVAL's digital platform, ESG calculators, EPR fee optimization engine, and AI assistant services. By accessing or submitting forms on the platform, partners agree to abide by these terms.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm sm:text-base font-bold text-brand-primary dark:text-amber-300 flex items-center gap-2 font-heading">
                  <Scale size={18} className="shrink-0" /> 2. Quality Standards & Certifications
                </h2>
                <p>ECOVAL eco-breeze block products strictly comply with verified technical standards:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-brand-text-muted dark:text-zinc-400">
                  <li><strong>Compressive Strength:</strong> Certified 7.8 - 8.2 MPa (Gen3 Heritage) via Quatest 3.</li>
                  <li><strong>UV Resistance:</strong> Tested under SGS 500-hour UV chamber & ASTM G154, backed by a 10-year colorfast warranty.</li>
                  <li><strong>Material Ratio:</strong> Locked formula of 70% MLP plastic + 25% rice husk + 5% additives.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm sm:text-base font-bold text-brand-primary dark:text-amber-300 flex items-center gap-2 font-heading">
                  <Shield size={18} className="shrink-0" /> 3. EPR Collection & Certification
                </h2>
                <p>
                  FMCG partners contracting MLP waste upcycling with ECOVAL receive official digital EPR Compliance Certificates. Fee reduction estimates (up to 40%) adhere to Vietnamese Decrees 08/2022/ND-CP and 05/2025/ND-CP.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm sm:text-base font-bold text-brand-primary dark:text-amber-300 font-heading">4. Intellectual Property</h2>
                <p>
                  All heritage block mold designs, ESG calculation algorithms, and the <strong>ECOVAL Sustainable Materials</strong> trademark are the exclusive intellectual property of the ECOVAL project team.
                </p>
              </section>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
