"use client";

import React, { useState } from "react";
import { 
  BarChart3, 
  ShieldCheck, 
  Layers, 
  Calculator, 
  Users, 
  Award, 
  FileText, 
  Bot, 
  Globe, 
  Menu, 
  X,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Leaf
} from "lucide-react";

import HeroSection from "../components/HeroSection";
import EsgVision from "../components/EsgVision";
import InteractiveTimeline from "../components/InteractiveTimeline";
import RdShowcase from "../components/RdShowcase";
import ComparisonMatrix from "../components/ComparisonMatrix";
import ProductShowcase from "../components/ProductShowcase";
import EsgCalculator from "../components/EsgCalculator";
import EprStepper from "../components/EprStepper";
import TeamSection from "../components/TeamSection";
import Milestones from "../components/Milestones";
import FinancialReport from "../components/FinancialReport";
import RegistrationForms from "../components/RegistrationForms";
import Stakeholders, { AdvisoryBoard, PartnersEcosystem } from "../components/Stakeholders";
import AiChat from "../components/AiChat";

const translations = {
  vi: {
    nav: {
      home: "Trang chủ",
      esg: "Sứ mệnh ESG",
      product: "Ưu thế Sản phẩm",
      epr: "Hợp tác EPR",
      rd: "Hành trình R&D",
      about: "Về chúng tôi",
      ai: "Trợ lý AI",
      cta: "Đăng ký Hợp tác"
    },
    foot: {
      slogan: "Tiên phong chuyển đổi phế phẩm rác thải nhựa đa lớp và vỏ trấu thành vật liệu sinh thái di sản.",
      quickLinks: "Liên kết Nhanh",
      home: "Trang chủ ECOVAL",
      esgTitle: "Định vị & Sứ mệnh ESG",
      productTitle: "Sản phẩm & Ưu thế vượt trội",
      calcTitle: "Bộ công cụ Tính toán ESG/EPR",
      rdTitle: "Hành trình R&D",
      aboutTitle: "Hội đồng Cố vấn & Đội ngũ",
      financeTitle: "Minh bạch Tài chính",
      partnerTitle: "Cổng Đăng ký Hợp tác & Thu gom",
      contact: "Liên hệ & Hợp tác",
      lab: "📍 PTN Vật liệu Xanh & Kinh tế Tuần hoàn ECOVAL - ĐHQG TP.HCM",
      rights: "© 2026 ECOVAL Circular Materials Joint Stock Company. Bảo lưu mọi quyền.",
      privacy: "Chính sách Bảo mật",
      terms: "Điều khoản Sử dụng"
    }
  },
  en: {
    nav: {
      home: "Home",
      esg: "ESG Mission",
      product: "Products",
      epr: "EPR Solution",
      rd: "R&D Journey",
      about: "About Us",
      ai: "AI Assistant",
      cta: "Partner With Us"
    },
    foot: {
      slogan: "Pioneering the upcycling of multi-layer plastic (MLP) waste and rice husk into green heritage materials.",
      quickLinks: "Quick Links",
      home: "ECOVAL Home",
      esgTitle: "ESG Mission",
      productTitle: "Products",
      calcTitle: "ESG & EPR Calculator",
      rdTitle: "R&D Roadmap",
      aboutTitle: "Advisory Board & Team",
      financeTitle: "Financial Transparency",
      partnerTitle: "Cooperation Portal",
      contact: "Contact & Collaboration",
      lab: "📍 ECOVAL Circular Materials & Green Tech Lab - VNU HCMC",
      rights: "© 2026 ECOVAL Circular Materials Joint Stock Company. All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Service"
    }
  }
};

export default function Home() {
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const t = translations[lang];
  const nav = t.nav;
  const foot = t.foot;

  return (
    <>
      {/* Sticky Global Navigation Bar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-zinc-950/80 border-b border-brand-border dark:border-white/10 text-brand-text-primary dark:text-white transition-colors duration-300">
        <div className="max-w-[1720px] mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-10 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Identifier */}
          <a href="#hero" className="flex items-center gap-3 no-underline group shrink-0">
            <img 
              src="/ecoval_logo.png" 
              alt="ECOVAL Logo" 
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105 dark:brightness-110" 
            />
            <div className="flex flex-col">
              <span className="font-heading font-black text-xl tracking-tight text-brand-text-primary dark:text-white leading-none">
                ECOVAL
              </span>
              <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mt-0.5 font-mono">
                Circular Materials
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-7 text-sm font-medium">
            <a href="#hero" className="text-brand-text-primary dark:text-zinc-200 hover:text-brand-primary transition-colors no-underline font-medium">
              {nav.home}
            </a>
            <a href="#su-menh-esg" className="text-brand-text-primary dark:text-zinc-200 hover:text-brand-primary transition-colors no-underline font-medium">
              {nav.esg}
            </a>
            <a href="#uu-the-san-pham" className="text-brand-text-primary dark:text-zinc-200 hover:text-brand-primary transition-colors no-underline font-medium">
              {nav.product}
            </a>
            <a href="#hop-tac-epr" className="text-brand-text-primary dark:text-zinc-200 hover:text-brand-primary transition-colors no-underline font-medium">
              {nav.epr}
            </a>
            <a href="#hanh-trinh-rd" className="text-brand-text-primary dark:text-zinc-200 hover:text-brand-primary transition-colors no-underline font-medium">
              {nav.rd}
            </a>
            <a href="#ve-chung-toi" className="text-brand-text-primary dark:text-zinc-200 hover:text-brand-primary transition-colors no-underline font-medium">
              {nav.about}
            </a>
            <a href="/ai-assistant" className="text-brand-primary font-bold hover:underline transition-colors no-underline flex items-center gap-1.5 bg-brand-primary/10 px-3 py-1.5 rounded-full border border-brand-primary/20">
              {nav.ai}
            </a>
          </nav>

          {/* Action CTAs & Controls */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Language Selector Toggle */}
            <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-full border border-brand-border dark:border-white/10">
              <button 
                onClick={() => setLang("vi")}
                className={`border-none rounded-full px-2.5 py-1 font-bold text-xs cursor-pointer transition-all duration-200 ${
                  lang === "vi" ? "bg-brand-primary text-white shadow-xs" : "bg-transparent text-brand-text-muted hover:text-white"
                }`}
              >
                VI
              </button>
              <button 
                onClick={() => setLang("en")}
                className={`border-none rounded-full px-2.5 py-1 font-bold text-xs cursor-pointer transition-all duration-200 ${
                  lang === "en" ? "bg-brand-primary text-white shadow-xs" : "bg-transparent text-brand-text-muted hover:text-white"
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
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="xl:hidden bg-white dark:bg-zinc-950 border-b border-brand-border dark:border-white/10 px-6 py-5 flex flex-col gap-3 absolute top-20 left-0 w-full z-50 shadow-2xl">
            <a href="#hero" onClick={() => setIsMenuOpen(false)} className="text-brand-text-primary dark:text-white font-medium py-2 border-b border-white/5">{nav.home}</a>
            <a href="#su-menh-esg" onClick={() => setIsMenuOpen(false)} className="text-brand-text-primary dark:text-white font-medium py-2 border-b border-white/5">{nav.esg}</a>
            <a href="#uu-the-san-pham" onClick={() => setIsMenuOpen(false)} className="text-brand-text-primary dark:text-white font-medium py-2 border-b border-white/5">{nav.product}</a>
            <a href="#hop-tac-epr" onClick={() => setIsMenuOpen(false)} className="text-brand-text-primary dark:text-white font-medium py-2 border-b border-white/5">{nav.epr}</a>
            <a href="#hanh-trinh-rd" onClick={() => setIsMenuOpen(false)} className="text-brand-text-primary dark:text-white font-medium py-2 border-b border-white/5">{nav.rd}</a>
            <a href="#ve-chung-toi" onClick={() => setIsMenuOpen(false)} className="text-brand-text-primary dark:text-white font-medium py-2 border-b border-white/5">{nav.about}</a>
            <a href="/ai-assistant" onClick={() => setIsMenuOpen(false)} className="text-brand-primary font-bold py-2 flex items-center gap-1.5">{nav.ai}</a>
            <a href="#dang-ky" onClick={() => setIsMenuOpen(false)} className="bg-brand-primary text-white text-center py-3 rounded-full font-bold text-xs mt-2 no-underline">{nav.cta}</a>
          </div>
        )}
      </header>

      {/* Main Page Layout Sections — Structured According to Customer Sitemap */}
      <main>
        {/* Section 1: Hero Section */}
        <section id="hero">
          <HeroSection lang={lang} />
        </section>

        {/* Section 2: Định vị & Sứ mệnh ESG */}
        <section id="su-menh-esg">
          <EsgVision lang={lang} />
        </section>

        {/* Section 3: Sản phẩm & Ưu thế vượt trội */}
        <section id="uu-the-san-pham">
          {/* Bảng so sánh đặc tính kỹ thuật */}
          <ComparisonMatrix lang={lang} />
          {/* Tab Cửa hàng / Showcase Sản phẩm (Mã 001 - Mã 005 Đồng giá 35k & Dòng Đời Thứ Hai) */}
          <ProductShowcase lang={lang} />
        </section>

        {/* Section 4: Giải pháp Doanh nghiệp & Hợp tác EPR (Gộp 2 mục) */}
        <section id="hop-tac-epr">
          {/* Quy trình 4 bước */}
          <EprStepper lang={lang} />
          {/* Bộ công cụ tính toán ESG/EPR ngay bên dưới */}
          <EsgCalculator lang={lang} />
        </section>

        {/* Section 5: Hành trình Nghiên cứu & Phát triển - R&D (Gộp 2 mục) */}
        <section id="hanh-trinh-rd">
          {/* Timeline các cột mốc (8/2025 - 12/2026) */}
          <InteractiveTimeline lang={lang} />
          {/* Bảng trạng thái các phiên bản V0 - V6 ngay bên dưới */}
          <RdShowcase lang={lang} />
        </section>

        {/* Section 6: Về chúng tôi & Năng lực thực thi */}
        <section id="ve-chung-toi">
          {/* 1. Hội đồng Cố vấn Chuyên môn (Advisory Board) ngay trên Đội ngũ Cốt lõi */}
          <AdvisoryBoard lang={lang} />

          {/* 2. Đội ngũ Nhân lực Cốt lõi (Core Team) */}
          <TeamSection lang={lang} />

          {/* 3. Thành tựu / Milestones & Minh bạch tài chính */}
          <Milestones lang={lang} />
          <div id="minh-bach-tai-chinh">
            <FinancialReport lang={lang} />
          </div>

          {/* 4. Bên liên quan & Hệ sinh thái (Partners & Ecosystem) */}
          <PartnersEcosystem lang={lang} />
        </section>

        {/* Section 7: Cổng Đăng ký Hợp tác & Thu gom (Unified Registration Portal) */}
        <section id="dang-ky">
          <RegistrationForms lang={lang} />
        </section>
      </main>

      {/* Global Footer */}
      <footer className="bg-brand-card-light dark:bg-zinc-950 border-t border-brand-border dark:border-white/10 text-brand-text-muted text-sm py-12 px-6">
        <div className="max-w-[1720px] mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src="/ecoval_logo.png" 
                  alt="ECOVAL Logo" 
                  className="h-9 w-auto object-contain dark:brightness-110" 
                />
                <span className="font-black text-lg text-brand-text-primary dark:text-white">Circular Materials</span>
              </div>
              <p className="leading-relaxed max-w-sm">
                {foot.slogan}
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <h4 className="font-bold text-brand-text-primary dark:text-white mb-2 font-heading">{foot.quickLinks}</h4>
              <a href="#hero" className="text-inherit no-underline hover:text-brand-primary transition-colors text-sm">{foot.home}</a>
              <a href="#su-menh-esg" className="text-inherit no-underline hover:text-brand-primary transition-colors text-sm">{foot.esgTitle}</a>
              <a href="#uu-the-san-pham" className="text-inherit no-underline hover:text-brand-primary transition-colors text-sm">{foot.productTitle}</a>
              <a href="#hop-tac-epr" className="text-inherit no-underline hover:text-brand-primary transition-colors text-sm">{foot.calcTitle}</a>
              <a href="#hanh-trinh-rd" className="text-inherit no-underline hover:text-brand-primary transition-colors text-sm">{foot.rdTitle}</a>
              <a href="#hoi-dong-co-van" className="text-inherit no-underline hover:text-brand-primary transition-colors text-sm">{foot.aboutTitle}</a>
              <a href="#minh-bach-tai-chinh" className="text-inherit no-underline hover:text-brand-primary transition-colors text-sm">{foot.financeTitle}</a>
              <a href="#dang-ky" className="text-inherit no-underline hover:text-brand-primary transition-colors text-sm">{foot.partnerTitle}</a>
              <a href="/ai-assistant" className="text-brand-primary font-bold no-underline hover:underline transition-colors flex items-center gap-1.5 text-sm mt-1">✨ ECOVAL AI Workspace</a>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-brand-text-primary dark:text-white mb-2 font-heading">{foot.contact}</h4>
              <p>{foot.lab}</p>
              <p>✉️ <a href="mailto:ecoval.project268@gmail.com" className="text-inherit hover:text-brand-primary transition-colors">ecoval.project268@gmail.com</a></p>
              <p>📞 <a href="tel:0914626717" className="text-inherit hover:text-brand-primary transition-colors">0914626717</a></p>
              <p>🌐 <a href="https://www.facebook.com/profile.php?id=61586260467256" target="_blank" rel="noopener noreferrer" className="text-inherit hover:text-brand-primary transition-colors underline">Fanpage: ECOVAL Circular Materials</a></p>
            </div>

          </div>

          <div className="border-t border-brand-border pt-6 text-center text-xs flex flex-col md:flex-row justify-between items-center flex-wrap gap-3 dark:border-white/10">
            <p>{foot.rights}</p>
            <p className="flex gap-4">
              <a href="/privacy" className="text-inherit no-underline hover:text-brand-primary transition-colors">{foot.privacy}</a>
              <a href="/terms" className="text-inherit no-underline hover:text-brand-primary transition-colors">{foot.terms}</a>
            </p>
          </div>
        </div>
      </footer>

      {/* Global Floating AI Assistant Widget Overlay */}
      <AiChat lang={lang} />
    </>
  );
}
