"use client";

import React, { useState } from "react";
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
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
              ECOVAL — PRIVACY POLICY
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

      {/* Main Privacy Document Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 sm:p-12 shadow-2xl backdrop-blur-sm space-y-8">
          
          <div className="border-b border-zinc-800 pb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3 font-heading">
              <ShieldCheck className="text-amber-400 w-8 h-8" />
              {lang === "vi" ? "Chính Sách & Điều Khoản Bảo Mật" : "Privacy Policy & Data Security"}
            </h1>
            <p className="text-xs text-zinc-400 mt-2">
              {lang === "vi" ? "Cập nhật lần cuối: Ngày 09 tháng 08 năm 2026 | Áp dụng cho toàn bộ nền tảng ECOVAL Sustainable Materials" : "Last updated: August 09, 2026 | Applies to ECOVAL Sustainable Materials Platform"}
            </p>
          </div>

          {lang === "vi" ? (
            <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
              <section className="space-y-2">
                <h2 className="text-base font-bold text-amber-300 flex items-center gap-2">
                  <Lock size={18} /> 1. Cam Kết Bảo Mật Thông Tin
                </h2>
                <p>
                  ECOVAL Sustainable Materials ("chúng tôi") cam kết bảo vệ tuyệt đối thông tin cá nhân và dữ liệu doanh nghiệp của khách hàng khi đăng ký tư vấn giải pháp gạch bông gió sinh thái, báo cáo ESG và chứng chỉ EPR.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-amber-300 flex items-center gap-2">
                  <Eye size={18} /> 2. Dữ Liệu Thu Thập & Mục Đích Sử Dụng
                </h2>
                <p>Chúng tôi chỉ thu thập các thông tin cần thiết nhằm phục vụ hoạt động tư vấn và tính toán kinh tế tuần hoàn:</p>
                <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                  <li><strong>Thông tin đối tác EPR:</strong> Tên doanh nghiệp, sản lượng rác thải nhựa đa lớp (MLP) phát sinh hàng năm, nhu cầu cấp chứng nhận EPR.</li>
                  <li><strong>Thông tin công trình xanh:</strong> Họ tên chủ đầu tư / KTS, diện tích bề mặt thi công (m²), địa điểm công trình.</li>
                  <li><strong>Thông tin thu gom:</strong> Tên vựa ve chai / cá nhân cung ứng nguyên liệu thô, số điện thoại liên lạc.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-amber-300 flex items-center gap-2">
                  <FileText size={18} /> 3. Mã Hóa & Lưu Trữ Dữ Liệu
                </h2>
                <p>
                  Tất cả thông tin nhạy cảm (như mã hóa thông tin liên hệ và cơ sở dữ liệu đối tác) đều được mã hóa bằng chuẩn thuật toán quân sự <strong>Fernet AES-256</strong> trước khi lưu trữ trong cơ sở dữ liệu Turso/SQLite. Chúng tôi tuyệt đối không bán hoặc chia sẻ dữ liệu cho bên thứ ba vì mục đích thương mại.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-amber-300">4. Quyền Hạn Của Người Dùng</h2>
                <p>
                  Khách hàng có quyền yêu cầu trích xuất, chỉnh sửa hoặc xóa hoàn toàn dữ liệu cá nhân khỏi hệ thống của ECOVAL bất kỳ lúc nào bằng cách gửi yêu cầu về email chính thức: 
                  <span className="text-amber-400 font-semibold ml-1">renova.project268@gmail.com</span>.
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
              <section className="space-y-2">
                <h2 className="text-base font-bold text-amber-300 flex items-center gap-2">
                  <Lock size={18} /> 1. Privacy Commitment
                </h2>
                <p>
                  ECOVAL Sustainable Materials ("we", "our") is strictly committed to protecting the privacy of personal and corporate data submitted through our ESG & EPR calculation portals and partner consultation forms.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-amber-300 flex items-center gap-2">
                  <Eye size={18} /> 2. Data Collection & Purpose
                </h2>
                <p>We collect essential data required solely to process circular economy consultations:</p>
                <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                  <li><strong>EPR Partners:</strong> Company name, annual MLP plastic waste output (kg), EPR certification requirements.</li>
                  <li><strong>Green Projects:</strong> Client/Architect name, surface installation area (m²), construction location.</li>
                  <li><strong>Collection Suppliers:</strong> Scrap yard / individual supplier name and contact phone number.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-amber-300 flex items-center gap-2">
                  <FileText size={18} /> 3. Data Encryption & Storage
                </h2>
                <p>
                  Sensitive fields are encrypted using military-grade <strong>Fernet AES-256</strong> prior to database persistence. We never sell, rent, or trade your personal data to third parties.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-amber-300">4. User Rights</h2>
                <p>
                  You have full rights to request data access, correction, or complete deletion by emailing our compliance team at: 
                  <span className="text-amber-400 font-semibold ml-1">renova.project268@gmail.com</span>.
                </p>
              </section>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
