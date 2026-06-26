"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import EsgVision from "@/components/EsgVision";
import InteractiveTimeline from "@/components/InteractiveTimeline";
import RdShowcase from "@/components/RdShowcase";
import ComparisonMatrix from "@/components/ComparisonMatrix";
import EsgCalculator from "@/components/EsgCalculator";
import EprStepper from "@/components/EprStepper";
import RegistrationForms from "@/components/RegistrationForms";
import TeamSection from "@/components/TeamSection";
import Stakeholders from "@/components/Stakeholders";
import Milestones from "@/components/Milestones";

const navTranslations = {
  vi: {
    about: "Giới thiệu",
    esg: "Tầm nhìn ESG",
    rd: "R&D",
    calc: "Công cụ ESG",
    epr: "Quy trình EPR",
    team: "Về chúng tôi",
    awards: "Bảng vàng",
    cta: "Hợp tác ngay"
  },
  en: {
    about: "About Us",
    esg: "ESG Vision",
    rd: "R&D Showcase",
    calc: "ESG Calculators",
    epr: "EPR Workflow",
    team: "Core Team",
    awards: "Milestones",
    cta: "Partner Now"
  }
};

const footerTranslations = {
  vi: {
    slogan: "Phát triển và ứng dụng công nghệ xanh để chuyển đổi dòng rác thải nhựa khó tái chế thành giải pháp vật liệu xây dựng sinh thái có giá trị di sản và kinh tế cao.",
    quickLinks: "Liên kết nhanh",
    home: "Trang chủ",
    esgTitle: "Tầm nhìn ESG",
    calcTitle: "Bộ tính toán ESG",
    partnerTitle: "Đăng ký hợp tác",
    contact: "Liên hệ",
    lab: "📍 Lab Nghiên cứu R&D Vật liệu mới, Đại học Bách khoa TP.HCM",
    rights: `© ${new Date().getFullYear()} RENOVA Circular. Bảo lưu mọi quyền.`,
    privacy: "Điều khoản bảo mật",
    terms: "Quy chế thành viên"
  },
  en: {
    slogan: "Developing and applying green technology to transform hard-to-recycle plastic waste streams into ecological building material solutions with high heritage and economic value.",
    quickLinks: "Quick Links",
    home: "Home",
    esgTitle: "ESG Vision",
    calcTitle: "ESG Calculator",
    partnerTitle: "Partner Registration",
    contact: "Contact Details",
    lab: "📍 New Materials R&D Lab, HCMC University of Technology (BK-HCMUT)",
    rights: `© ${new Date().getFullYear()} RENOVA Circular. All rights reserved.`,
    privacy: "Privacy Policy",
    terms: "Terms of Service"
  }
};

export default function Home() {
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const nav = navTranslations[lang];
  const foot = footerTranslations[lang];

  return (
    <>
      {/* Sticky Header / Navigation */}
      <header className="sticky top-0 z-50 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md border-b border-black/5 dark:border-white/5">
        <div className="container flex justify-between items-center h-20 relative">
          <div className="flex items-center gap-3">
            <img 
              src="/Logo.png" 
              alt="RENOVA Logo" 
              className="h-9 w-auto rounded-md object-contain" 
            />
            <span className="text-[10px] font-bold text-brand-text-muted border border-brand-border px-1.5 py-0.5 rounded uppercase">
              Circular
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-6">
            <ul className="flex gap-8 list-none">
              <li><a href="#trang-chu" className="text-brand-text-muted hover:text-brand-primary font-medium transition-colors duration-300 font-heading">{nav.about}</a></li>
              <li><a href="#tam-nhin-esg" className="text-brand-text-muted hover:text-brand-primary font-medium transition-colors duration-300 font-heading">{nav.esg}</a></li>
              <li><a href="#thu-vien-rd" className="text-brand-text-muted hover:text-brand-primary font-medium transition-colors duration-300 font-heading">{nav.rd}</a></li>
              <li><a href="#tinh-toan" className="text-brand-text-muted hover:text-brand-primary font-medium transition-colors duration-300 font-heading">{nav.calc}</a></li>
              <li><a href="#quy-trinh-epr" className="text-brand-text-muted hover:text-brand-primary font-medium transition-colors duration-300 font-heading">{nav.epr}</a></li>
              <li><a href="#doi-ngu" className="text-brand-text-muted hover:text-brand-primary font-medium transition-colors duration-300 font-heading">{nav.team}</a></li>
              <li><a href="#thanh-tuu" className="text-brand-text-muted hover:text-brand-primary font-medium transition-colors duration-300 font-heading">{nav.awards}</a></li>
            </ul>
          </nav>

          <div className="flex items-center gap-5">
            {/* Language Selector Toggle */}
            <div className="flex items-center gap-1.5 bg-black/3 dark:bg-white/3 p-1 rounded-full border border-brand-border">
              <button 
                onClick={() => setLang("vi")}
                className={`border-none rounded-xl px-2 py-1 font-bold text-xs cursor-pointer transition-all duration-200 ${
                  lang === "vi" ? "bg-brand-primary text-white" : "bg-transparent text-brand-text-muted"
                }`}
              >
                VI
              </button>
              <button 
                onClick={() => setLang("en")}
                className={`border-none rounded-xl px-2 py-1 font-bold text-xs cursor-pointer transition-all duration-200 ${
                  lang === "en" ? "bg-brand-primary text-white" : "bg-transparent text-brand-text-muted"
                }`}
              >
                EN
              </button>
            </div>

            <a href="#dang-ky" className="btn-primary header-cta hidden lg:inline-flex px-5 py-2 text-sm">
              {nav.cta}
            </a>

            {/* Mobile Menu Toggle Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden bg-transparent border-none text-brand-text-primary dark:text-white cursor-pointer p-1"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Drawer Menu */}
          {isMenuOpen && (
            <div className="absolute top-20 left-[-16px] sm:left-[-24px] w-[calc(100%+32px)] sm:w-[calc(100%+48px)] bg-white/98 dark:bg-zinc-950/98 backdrop-blur-md border-b border-brand-border p-6 flex flex-col gap-4 z-50 shadow-lg max-h-[80vh] overflow-y-auto">
              <ul className="flex flex-col gap-4 list-none">
                <li><a href="#trang-chu" onClick={() => setIsMenuOpen(false)} className="block py-2 text-brand-text-muted hover:text-brand-primary font-medium border-b border-black/3 dark:border-white/4 font-heading">{nav.about}</a></li>
                <li><a href="#tam-nhin-esg" onClick={() => setIsMenuOpen(false)} className="block py-2 text-brand-text-muted hover:text-brand-primary font-medium border-b border-black/3 dark:border-white/4 font-heading">{nav.esg}</a></li>
                <li><a href="#thu-vien-rd" onClick={() => setIsMenuOpen(false)} className="block py-2 text-brand-text-muted hover:text-brand-primary font-medium border-b border-black/3 dark:border-white/4 font-heading">{nav.rd}</a></li>
                <li><a href="#tinh-toan" onClick={() => setIsMenuOpen(false)} className="block py-2 text-brand-text-muted hover:text-brand-primary font-medium border-b border-black/3 dark:border-white/4 font-heading">{nav.calc}</a></li>
                <li><a href="#quy-trinh-epr" onClick={() => setIsMenuOpen(false)} className="block py-2 text-brand-text-muted hover:text-brand-primary font-medium border-b border-black/3 dark:border-white/4 font-heading">{nav.epr}</a></li>
                <li><a href="#doi-ngu" onClick={() => setIsMenuOpen(false)} className="block py-2 text-brand-text-muted hover:text-brand-primary font-medium border-b border-black/3 dark:border-white/4 font-heading">{nav.team}</a></li>
                <li><a href="#thanh-tuu" onClick={() => setIsMenuOpen(false)} className="block py-2 text-brand-text-muted hover:text-brand-primary font-medium border-b border-black/3 dark:border-white/4 font-heading">{nav.awards}</a></li>
              </ul>
              
              <a 
                href="#dang-ky" 
                onClick={() => setIsMenuOpen(false)} 
                className="btn-primary w-full justify-center py-3 text-center text-sm mt-2"
              >
                {nav.cta}
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Main Sections Wrapper */}
      <main className="pt-20">
        <HeroSection lang={lang} />
        <EsgVision lang={lang} />
        <InteractiveTimeline lang={lang} />
        <RdShowcase lang={lang} />
        <ComparisonMatrix lang={lang} />
        <EsgCalculator lang={lang} />
        <EprStepper lang={lang} />
        <RegistrationForms lang={lang} />
        <TeamSection lang={lang} />
        <Stakeholders lang={lang} />
        <Milestones lang={lang} />
      </main>

      {/* Footer */}
      <footer className="bg-[#f4f7f5]/98 border-t border-brand-border py-16 text-brand-text-muted text-sm dark:bg-zinc-950 dark:border-white/10">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src="/Logo.png" 
                  alt="RENOVA Logo" 
                  className="h-8 w-auto rounded object-contain" 
                />
                <span className="font-black text-lg text-brand-text-primary dark:text-white">Circular</span>
              </div>
              <p className="leading-relaxed max-w-sm">
                {foot.slogan}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-brand-text-primary dark:text-white mb-2 font-heading">{foot.quickLinks}</h4>
              <a href="#trang-chu" className="text-inherit no-underline hover:text-brand-primary transition-colors">{foot.home}</a>
              <a href="#tam-nhin-esg" className="text-inherit no-underline hover:text-brand-primary transition-colors">{foot.esgTitle}</a>
              <a href="#tinh-toan" className="text-inherit no-underline hover:text-brand-primary transition-colors">{foot.calcTitle}</a>
              <a href="#dang-ky" className="text-inherit no-underline hover:text-brand-primary transition-colors">{foot.partnerTitle}</a>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-brand-text-primary dark:text-white mb-2 font-heading">{foot.contact}</h4>
              <p>{foot.lab}</p>
              <p>✉️ info@renova.vn</p>
              <p>📞 0901 234 567</p>
            </div>

          </div>

          <div className="border-t border-brand-border pt-6 text-center text-xs flex flex-col md:flex-row justify-between items-center flex-wrap gap-3 dark:border-white/10">
            <p>{foot.rights}</p>
            <p className="flex gap-4">
              <a href="#" className="text-inherit no-underline hover:text-brand-primary transition-colors">{foot.privacy}</a>
              <a href="#" className="text-inherit no-underline hover:text-brand-primary transition-colors">{foot.terms}</a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
