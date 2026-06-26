"use client";

import React from "react";
import { FileText, CheckCircle2, Leaf, Shield, Sparkles } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface HeroSectionProps {
  lang: "vi" | "en";
}

const translations = {
  vi: {
    project: "Dự án RENOVA Circular",
    description: "Quy trình kinh tế tuần hoàn số hóa đột phá. Chúng tôi chuyển đổi rác thải nhựa đa lớp (MLP) \"bất tử\" kết hợp phế phẩm vỏ trấu nông nghiệp thành gạch bông gió di sản xanh đẳng cấp—cách âm, cách nhiệt chủ động.",
    eprBtn: "Đăng ký tư vấn EPR",
    esgBtn: "Công cụ tính toán ESG"
  },
  en: {
    project: "RENOVA Circular Project",
    description: "A breakthrough digital circular economy process. We upcycle \"indestructible\" multi-layer plastic (MLP) waste and agricultural husk by-products into premium heritage breeze blocks—delivering active thermal and acoustic shielding.",
    eprBtn: "EPR Consultation",
    esgBtn: "ESG Calculator"
  }
};

export default function HeroSection({ lang }: HeroSectionProps) {
  const t = translations[lang];

  return (
    <section 
      id="trang-chu" 
      className="relative overflow-hidden min-h-[90vh] flex items-center py-20"
    >
      {/* Background Looping Eco Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 z-0 opacity-65"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-wind-blowing-in-green-leaves-42352-large.mp4" type="video/mp4" />
      </video>

      {/* Light Backdrop Overlay to soften the video and ensure high text legibility */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#f4f7f5]/95 to-white/88 z-1 dark:from-zinc-950/95 dark:to-zinc-900/88"
      ></div>

      <div className="container relative z-10 w-full flex justify-center">
        <ScrollReveal animation="fade-up" duration={800} repeat={false}>
          <div className="flex flex-col items-center text-center gap-7 max-w-3xl">
            
            <div 
              className="inline-flex items-center gap-2 bg-brand-primary/6 border border-brand-primary/15 px-4.5 py-2 rounded-full w-fit"
            >
              <Leaf size={14} className="text-brand-primary" />
              <span 
                className="text-[12px] uppercase tracking-widest font-bold text-brand-primary font-heading"
              >
                {t.project}
              </span>
            </div>
            
            <h1 
              className="text-4xl md:text-5xl lg:text-[64px] leading-[1.1] font-black text-brand-text-primary dark:text-white tracking-tight"
            >
              Trash to <span className="gradient-text">Heritage</span>
            </h1>
            
            <p 
              className="text-base md:text-lg lg:text-xl leading-relaxed text-brand-text-muted max-w-2xl"
            >
              {t.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-2 w-full sm:w-auto px-4 sm:px-0">
              <a href="#dang-ky" className="btn-primary w-full sm:w-auto justify-center">
                {t.eprBtn}
                <CheckCircle2 size={18} />
              </a>
              <a href="#tinh-toan" className="btn-secondary w-full sm:w-auto justify-center dark:text-white">
                {t.esgBtn}
                <FileText size={18} />
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
