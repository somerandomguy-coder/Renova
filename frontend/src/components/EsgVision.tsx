"use client";

import React from "react";
import { Leaf, Users, ShieldCheck } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface EsgVisionProps {
  lang: "vi" | "en";
}

const translations = {
  vi: {
    title: "Định vị & Sứ mệnh ",
    titleHighlight: "ESG",
    subtitle: "RENOVA kiến tạo giải pháp vật liệu xây dựng tuần hoàn, giải quyết triệt để các thách thức về môi trường và phát triển cộng đồng bền vững.",
    eTitle: "Environmental (Môi trường)",
    eDesc: "Khát vọng giải cứu dòng rác thải 'bất tử' nhựa đa lớp (MLP) và tận dụng phế phẩm nông nghiệp (Vỏ trấu) làm cốt liệu thay thế cát đá.",
    sTitle: "Social (Xã hội)",
    sDesc: "Kiến tạo giải pháp làm mát thụ động cho nhà ở xã hội, bảo tồn nét đẹp kiến trúc Á Đông thông qua gạch bông gió di sản thân thiện môi trường.",
    gTitle: "Governance (Quản trị)",
    gDesc: "Cam kết minh bạch dòng rác, dòng tiền và kiểm định chất lượng nghiêm ngặt thông qua hệ thống sổ cái kỹ thuật số, hướng tới phát thải âm carbon."
  },
  en: {
    title: "ESG Positioning & Mission ",
    titleHighlight: "ESG",
    subtitle: "RENOVA builds circular construction solutions, radically resolving environmental challenges and fostering sustainable community development.",
    eTitle: "Environmental",
    eDesc: "A passion to upcycle 'indestructible' multi-layer plastic (MLP) waste and utilize agricultural husk by-products as replacement aggregate.",
    sTitle: "Social",
    sDesc: "Providing passive cooling solutions for social housing, conserving East Asian architectural heritage via eco-friendly breeze blocks.",
    gTitle: "Governance",
    gDesc: "Committing to absolute transparency of waste and finance streams via digital ledger tracking, targeting carbon-negative emission goals."
  }
};

export default function EsgVision({ lang }: EsgVisionProps) {
  const t = translations[lang];

  const cards = [
    {
      icon: <Leaf size={32} style={{ color: "hsl(var(--primary))" }} />,
      letter: "E",
      title: t.eTitle,
      description: t.eDesc,
      color: "rgba(145, 71, 36, 0.15)",
      borderColor: "rgba(145, 71, 36, 0.3)"
    },
    {
      icon: <Users size={32} style={{ color: "hsl(var(--secondary))" }} />,
      letter: "S",
      title: t.sTitle,
      description: t.sDesc,
      color: "rgba(13, 148, 136, 0.15)",
      borderColor: "rgba(13, 148, 136, 0.3)"
    },
    {
      icon: <ShieldCheck size={32} style={{ color: "hsl(var(--accent))" }} />,
      letter: "G",
      title: t.gTitle,
      description: t.gDesc,
      color: "rgba(217, 119, 6, 0.15)",
      borderColor: "rgba(217, 119, 6, 0.3)"
    }
  ];

  return (
    <section id="tam-nhin-esg" className="relative">
      <div className="container">
        <ScrollReveal animation="fade-up" duration={700}>
          <h2 className="section-title">
            {t.title}
            <span className="gradient-text">{t.titleHighlight}</span>
          </h2>
          <p className="section-subtitle">
            {t.subtitle}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div 
              key={index}
              className="glass-card flex flex-col gap-5 relative overflow-hidden"
            >
              {/* Massive background letter for visual flair */}
              <div className="absolute -right-5 -bottom-7 text-[150px] font-black text-white/2 select-none font-heading">
                {card.letter}
              </div>

              <div 
                className="flex items-center justify-center w-15 h-15 rounded-xl border"
                style={{
                  background: card.color,
                  borderColor: card.borderColor
                }}
              >
                {card.icon}
              </div>

              <div>
                <h3 className="text-[22px] mb-3 font-heading text-brand-text-primary dark:text-white">
                  {card.title}
                </h3>
                <p className="text-brand-text-muted leading-relaxed text-[15px]">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
