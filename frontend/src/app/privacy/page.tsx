"use client";

import React, { useState } from "react";
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
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
              ECOVAL — PRIVACY POLICY
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

      {/* Main Privacy Document Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 shadow-xl backdrop-blur-sm space-y-8">
          
          <div className="border-b border-brand-border dark:border-zinc-800 pb-6">
            <h1 className="text-xl sm:text-3xl font-extrabold text-brand-text-primary dark:text-white flex items-center gap-3 font-heading">
              <ShieldCheck className="text-brand-primary dark:text-amber-400 w-7 h-7 sm:w-9 sm:h-9 shrink-0" />
              {lang === "vi" ? "Chính Sách & Điều Khoản Bảo Mật" : "Privacy Policy & Data Security"}
            </h1>
            <p className="text-xs sm:text-sm text-brand-text-muted dark:text-zinc-400 mt-2">
              {lang === "vi" ? "Cập nhật lần cuối: Ngày 09 tháng 08 năm 2026 | Áp dụng cho hệ sinh thái ECOVAL Sustainable Materials" : "Last updated: August 09, 2026 | Applies to ECOVAL Sustainable Materials Platform"}
            </p>
          </div>

          {lang === "vi" ? (
            <div className="space-y-6 text-xs sm:text-sm text-brand-text-primary dark:text-zinc-300 leading-relaxed">
              <section className="space-y-2">
                <h2 className="text-sm sm:text-base font-bold text-brand-primary dark:text-amber-300 flex items-center gap-2 font-heading">
                  <Lock size={18} className="shrink-0" /> 1. Cam Kết Bảo Mật Thông Tin
                </h2>
                <p>
                  ECOVAL Sustainable Materials ("chúng tôi") cam kết bảo vệ tuyệt đối thông tin cá nhân và dữ liệu doanh nghiệp của khách hàng khi đăng ký tư vấn giải pháp gạch bông gió sinh thái, báo cáo ESG và chứng nhận EPR.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm sm:text-base font-bold text-brand-primary dark:text-amber-300 flex items-center gap-2 font-heading">
                  <Eye size={18} className="shrink-0" /> 2. Dữ Liệu Thu Thập & Mục Đích Sử Dụng
                </h2>
                <p>Chúng tôi chỉ thu thập các thông tin cần thiết nhằm phục vụ hoạt động tư vấn và tính toán kinh tế tuần hoàn:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-brand-text-muted dark:text-zinc-400">
                  <li><strong>Thông tin đối tác EPR:</strong> Tên doanh nghiệp, sản lượng rác thải nhựa đa lớp (MLP) phát sinh hàng năm, nhu cầu cấp chứng nhận EPR.</li>
                  <li><strong>Thông tin công trình xanh:</strong> Họ tên chủ đầu tư / Kiến trúc sư, diện tích bề mặt thi công (m²), địa điểm công trình.</li>
                  <li><strong>Thông tin thu gom nguyên liệu:</strong> Tên vựa ve chai / cá nhân cung ứng nguyên liệu thô, số điện thoại liên lạc.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm sm:text-base font-bold text-brand-primary dark:text-amber-300 flex items-center gap-2 font-heading">
                  <FileText size={18} className="shrink-0" /> 3. Mã Hóa & Lưu Trữ Dữ Liệu
                </h2>
                <p>
                  Tất cả thông tin nhạy cảm (như mã hóa thông tin liên hệ và cơ sở dữ liệu đối tác) đều được mã hóa bằng chuẩn thuật toán <strong>Fernet AES-256</strong> trước khi lưu trữ trong cơ sở dữ liệu. Chúng tôi tuyệt đối không bán hoặc chia sẻ dữ liệu cho bên thứ ba vì mục đích thương mại.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm sm:text-base font-bold text-brand-primary dark:text-amber-300 font-heading">4. Quyền Hạn Của Người Dùng</h2>
                <p>
                  Khách hàng có quyền yêu cầu trích xuất, chỉnh sửa hoặc xóa hoàn toàn dữ liệu cá nhân khỏi hệ thống của ECOVAL bất kỳ lúc nào bằng cách gửi yêu cầu về email chính thức: 
                  <span className="text-brand-primary dark:text-amber-400 font-semibold ml-1">renova.project268@gmail.com</span>.
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-6 text-xs sm:text-sm text-brand-text-primary dark:text-zinc-300 leading-relaxed">
              <section className="space-y-2">
                <h2 className="text-sm sm:text-base font-bold text-brand-primary dark:text-amber-300 flex items-center gap-2 font-heading">
                  <Lock size={18} className="shrink-0" /> 1. Privacy Commitment
                </h2>
                <p>
                  ECOVAL Sustainable Materials ("we", "our") is strictly committed to protecting the privacy of personal and corporate data submitted through our ESG & EPR calculation portals and partner consultation forms.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm sm:text-base font-bold text-brand-primary dark:text-amber-300 flex items-center gap-2 font-heading">
                  <Eye size={18} className="shrink-0" /> 2. Data Collection & Purpose
                </h2>
                <p>We collect essential data required solely to process circular economy consultations:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-brand-text-muted dark:text-zinc-400">
                  <li><strong>EPR Partners:</strong> Company name, annual MLP plastic waste output (kg), EPR certification requirements.</li>
                  <li><strong>Green Projects:</strong> Client/Architect name, surface installation area (m²), construction location.</li>
                  <li><strong>Collection Suppliers:</strong> Scrap yard / individual supplier name and contact phone number.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm sm:text-base font-bold text-brand-primary dark:text-amber-300 flex items-center gap-2 font-heading">
                  <FileText size={18} className="shrink-0" /> 3. Data Encryption & Storage
                </h2>
                <p>
                  Sensitive fields are encrypted using <strong>Fernet AES-256</strong> prior to database persistence. We never sell, rent, or trade your personal data to third parties.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm sm:text-base font-bold text-brand-primary dark:text-amber-300 font-heading">4. User Rights</h2>
                <p>
                  You have full rights to request data access, correction, or complete deletion by emailing our compliance team at: 
                  <span className="text-brand-primary dark:text-amber-400 font-semibold ml-1">renova.project268@gmail.com</span>.
                </p>
              </section>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
