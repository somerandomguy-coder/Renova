"use client";
import React, { useState } from "react";
import { FileText, CheckCircle2, Leaf, Play, X } from "lucide-react";
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
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section 
      id="trang-chu" 
      className="relative overflow-hidden min-h-[90vh] flex items-center py-20 bg-brand-bg-dark dark:bg-zinc-950"
    >
      {/* Animated Eco-Mesh background glows */}
      <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-brand-primary/6 rounded-full filter blur-[120px] pointer-events-none z-0 dark:bg-brand-primary/2"></div>
      <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-brand-secondary/6 rounded-full filter blur-[140px] pointer-events-none z-0 dark:bg-brand-secondary/2"></div>

      {/* Light Backdrop Overlay to soften mesh and ensure high text legibility */}
      <div 
        className="absolute inset-0 bg-white/70 z-1 dark:bg-zinc-950/70"
      ></div>

      <div className="container relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Headline & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left gap-7">
            <ScrollReveal animation="fade-up" duration={800} repeat={false}>
              <div className="flex flex-col items-center lg:items-start gap-7">
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
                  className="text-4xl md:text-5xl lg:text-[60px] leading-[1.15] font-black text-brand-text-primary dark:text-white tracking-tight"
                >
                  Trash to <span className="gradient-text">Heritage</span>
                </h1>
                
                <p 
                  className="text-base md:text-lg lg:text-xl leading-relaxed text-brand-text-muted max-w-2xl"
                >
                  {t.description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-2 w-full sm:w-auto">
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

          {/* Right Column - Pitch Video Card */}
          <div className="lg:col-span-5 flex justify-center items-center w-full">
            <ScrollReveal animation="scale-in" duration={800} delay={200} repeat={false} className="w-full">
              <div 
                onClick={() => setIsVideoOpen(true)}
                className="glass-card group relative overflow-hidden rounded-2xl w-full max-w-[500px] aspect-video cursor-pointer shadow-lg hover:shadow-2xl transition duration-300 border border-brand-primary/15 bg-white/40 dark:bg-zinc-900/40 p-0"
              >
                {/* Looping Muted Preview Video */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-103"
                >
                  <source src="/renova_intro.mp4" type="video/mp4" />
                </video>

                {/* Video Play Overlay */}
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-brand-secondary transition duration-300">
                    <Play size={24} className="ml-1 fill-white text-white" />
                  </div>
                </div>

                {/* Floating Tag */}
                <div className="absolute bottom-4 left-4 bg-brand-bg-card/90 dark:bg-zinc-950/90 border border-brand-border dark:border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1.5 shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-primary relative flex">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-primary"></span>
                  </span>
                  <span className="text-brand-text-primary dark:text-white uppercase tracking-wider font-bold">
                    {lang === "vi" ? "Video giới thiệu" : "Pitch Video"}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>

      {/* Video Modal Overlay */}
      {isVideoOpen && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsVideoOpen(false);
            }
          }}
          className="fixed inset-0 w-full h-full bg-black/95 backdrop-blur-md z-[2000] flex items-center justify-center p-4"
        >
          <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-950">
            {/* Close Button */}
            <button 
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 border border-white/10 text-white/80 hover:text-white flex items-center justify-center hover:bg-black/80 transition duration-200"
            >
              <X size={20} />
            </button>

            {/* Full Player Video */}
            <video
              autoPlay
              controls
              playsInline
              className="w-full h-full object-contain"
            >
              <source src="/renova_intro.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </section>
  );
}
