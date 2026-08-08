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
import FinancialReport from "@/components/FinancialReport";
import AiChat from "@/components/AiChat";

const navTranslations = {
  vi: {
    about: "Giới thiệu",
    esg: "Tầm nhìn ESG",
    rd: "R&D",
    calc: "Công cụ ESG",
    epr: "Quy trình EPR",
    team: "Về chúng tôi",
    awards: "Bảng vàng",
    finance: "Thông tin tài chính",
    ai: "Trợ lý AI",
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
    finance: "Financial Info",
    ai: "AI Assistant",
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
    financeTitle: "Thông tin tài chính",
    contact: "Liên hệ",
    lab: "📍 Trường đại học bách khoa - ĐHQG-HCM",
    rights: `© ${new Date().getFullYear()} ECOVAL Sustainable Materials. Bảo lưu mọi quyền.`,
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
    financeTitle: "Financial Info",
    contact: "Contact Details",
    lab: "📍 New Materials R&D Lab, HCMC University of Technology - VNU-HCM",
    rights: `© ${new Date().getFullYear()} ECOVAL Sustainable Materials. All rights reserved.`,
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
        <div className="max-w-[1720px] mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-10 flex justify-between items-center h-20 relative">
          <div className="flex items-center gap-3 shrink-0">
            <img 
              src="/ecoval_logo.jpeg" 
              alt="ECOVAL Logo" 
              className="h-10 w-auto rounded-md object-contain" 
            />
            <span className="text-[10px] font-bold text-brand-text-muted border border-brand-border px-1.5 py-0.5 rounded uppercase">
              SUSTAINABLE MATERIALS
            </span>
          </div>

          <nav className="hidden xl:flex items-center justify-center flex-1 mx-4 xl:mx-6 min-w-0">
            <ul className="flex gap-2 xl:gap-3 2xl:gap-5 list-none justify-center">
              <li><a href="#trang-chu" className="text-brand-text-muted hover:text-brand-primary font-medium transition-colors duration-300 font-heading whitespace-nowrap text-xs xl:text-[13px] 2xl:text-sm">{nav.about}</a></li>
              <li><a href="#tam-nhin-esg" className="text-brand-text-muted hover:text-brand-primary font-medium transition-colors duration-300 font-heading whitespace-nowrap text-xs xl:text-[13px] 2xl:text-sm">{nav.esg}</a></li>
              <li><a href="#thu-vien-rd" className="text-brand-text-muted hover:text-brand-primary font-medium transition-colors duration-300 font-heading whitespace-nowrap text-xs xl:text-[13px] 2xl:text-sm">{nav.rd}</a></li>
              <li><a href="#tinh-toan" className="text-brand-text-muted hover:text-brand-primary font-medium transition-colors duration-300 font-heading whitespace-nowrap text-xs xl:text-[13px] 2xl:text-sm">{nav.calc}</a></li>
              <li><a href="#quy-trinh-epr" className="text-brand-text-muted hover:text-brand-primary font-medium transition-colors duration-300 font-heading whitespace-nowrap text-xs xl:text-[13px] 2xl:text-sm">{nav.epr}</a></li>
              <li><a href="#doi-ngu" className="text-brand-text-muted hover:text-brand-primary font-medium transition-colors duration-300 font-heading whitespace-nowrap text-xs xl:text-[13px] 2xl:text-sm">{nav.team}</a></li>
              <li><a href="#thanh-tuu" className="text-brand-text-muted hover:text-brand-primary font-medium transition-colors duration-300 font-heading whitespace-nowrap text-xs xl:text-[13px] 2xl:text-sm">{nav.awards}</a></li>
              <li><a href="#tai-chinh" className="text-brand-text-muted hover:text-brand-primary font-medium transition-colors duration-300 font-heading whitespace-nowrap text-xs xl:text-[13px] 2xl:text-sm">{nav.finance}</a></li>
              <li><a href="/ai-assistant" className="text-brand-primary font-bold hover:underline transition-colors duration-300 font-heading whitespace-nowrap text-xs xl:text-[13px] 2xl:text-sm flex items-center gap-1">✨ {nav.ai}</a></li>
            </ul>
          </nav>

          <div className="flex items-center gap-6 xl:gap-8 shrink-0">
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

            <a href="#dang-ky" className="bg-brand-primary text-white px-5 py-2.5 rounded-full font-bold text-xs hover:bg-brand-secondary transition-all duration-300 shadow-md hover:shadow-lg no-underline font-heading whitespace-nowrap hidden sm:inline-block">
              {nav.cta}
            </a>

            {/* Mobile Menu Toggle Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="xl:hidden p-2 text-brand-text-primary dark:text-white bg-transparent border-none cursor-pointer"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation Dropdown */}
          {isMenuOpen && (
            <div className="xl:hidden bg-white dark:bg-zinc-900 border-b border-brand-border px-6 py-4 flex flex-col gap-3 absolute top-20 left-0 w-full z-50">
              <a href="#trang-chu" onClick={() => setIsMenuOpen(false)} className="text-brand-text-primary dark:text-white font-medium py-2">{nav.about}</a>
              <a href="#tam-nhin-esg" onClick={() => setIsMenuOpen(false)} className="text-brand-text-primary dark:text-white font-medium py-2">{nav.esg}</a>
              <a href="#thu-vien-rd" onClick={() => setIsMenuOpen(false)} className="text-brand-text-primary dark:text-white font-medium py-2">{nav.rd}</a>
              <a href="#tinh-toan" onClick={() => setIsMenuOpen(false)} className="text-brand-text-primary dark:text-white font-medium py-2">{nav.calc}</a>
              <a href="#quy-trinh-epr" onClick={() => setIsMenuOpen(false)} className="text-brand-text-primary dark:text-white font-medium py-2">{nav.epr}</a>
              <a href="#doi-ngu" onClick={() => setIsMenuOpen(false)} className="text-brand-text-primary dark:text-white font-medium py-2">{nav.team}</a>
              <a href="#thanh-tuu" onClick={() => setIsMenuOpen(false)} className="text-brand-text-primary dark:text-white font-medium py-2">{nav.awards}</a>
              <a href="#tai-chinh" onClick={() => setIsMenuOpen(false)} className="text-brand-text-primary dark:text-white font-medium py-2">{nav.finance}</a>
              <a href="/ai-assistant" onClick={() => setIsMenuOpen(false)} className="text-brand-primary font-bold py-2 flex items-center gap-1">✨ {nav.ai}</a>
              <a href="#dang-ky" onClick={() => setIsMenuOpen(false)} className="bg-brand-primary text-white text-center py-2.5 rounded-full font-bold text-xs mt-2 no-underline">{nav.cta}</a>
            </div>
          )}
        </div>
      </header>

      {/* Main Page Layout Sections */}
      <main id="trang-chu">
        <HeroSection lang={lang} />
        <section id="tam-nhin-esg"><EsgVision lang={lang} /></section>
        <section><InteractiveTimeline lang={lang} /></section>
        <section id="thu-vien-rd"><RdShowcase lang={lang} /></section>
        <section><ComparisonMatrix lang={lang} /></section>
        <section id="tinh-toan"><EsgCalculator lang={lang} /></section>
        <section id="quy-trinh-epr"><EprStepper lang={lang} /></section>
        <section id="doi-ngu"><TeamSection lang={lang} /></section>
        <section id="thanh-tuu"><Milestones lang={lang} /></section>
        <section id="tai-chinh"><FinancialReport lang={lang} /></section>
        <section id="dang-ky"><RegistrationForms lang={lang} /></section>
        <section><Stakeholders lang={lang} /></section>
      </main>

      {/* Global Footer */}
      <footer className="bg-brand-card-light dark:bg-zinc-900 border-t border-brand-border dark:border-white/10 text-brand-text-muted text-sm py-12 px-6">
        <div className="max-w-[1720px] mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src="/ecoval_logo.jpeg" 
                  alt="ECOVAL Logo" 
                  className="h-8 w-auto rounded object-contain" 
                />
                <span className="font-black text-lg text-brand-text-primary dark:text-white">Sustainable Materials</span>
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
              <a href="#tai-chinh" className="text-inherit no-underline hover:text-brand-primary transition-colors">{foot.financeTitle}</a>
              <a href="#dang-ky" className="text-inherit no-underline hover:text-brand-primary transition-colors">{foot.partnerTitle}</a>
              <a href="/ai-assistant" className="text-brand-primary font-bold no-underline hover:underline transition-colors flex items-center gap-1">✨ ECOVAL AI Workspace</a>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-brand-text-primary dark:text-white mb-2 font-heading">{foot.contact}</h4>
              <p>{foot.lab}</p>
              <p>✉️ <a href="mailto:renova.project268@gmail.com" className="text-inherit hover:text-brand-primary transition-colors">renova.project268@gmail.com</a></p>
              <p>📞 <a href="tel:0914626717" className="text-inherit hover:text-brand-primary transition-colors">0914626717</a></p>
              <p>🌐 <a href="https://www.facebook.com/profile.php?id=61586260467256" target="_blank" rel="noopener noreferrer" className="text-inherit hover:text-brand-primary transition-colors underline">Fanpage: ECOVAL Sustainable Materials</a></p>
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

      {/* AI Chat Widget — Floating overlay, no impact on existing layout */}
      <AiChat lang={lang} />
    </>
  );
}
