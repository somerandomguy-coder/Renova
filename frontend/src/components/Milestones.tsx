"use client";

import React, { useState, useEffect, useRef } from "react";
import { Award, ShieldAlert, CheckCircle, ExternalLink, Calendar } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface MilestonesProps {
  lang: "vi" | "en";
}

const translations = {
  vi: {
    title: "Bảng vàng ",
    titleHighlight: "Thành tựu & Giải thưởng",
    subtitle: "Những dấu mốc và chứng chỉ chất lượng uy tín bảo chứng cho sự nỗ lực phát triển công nghệ và ý thức xã hội của đội ngũ dự án RENOVA.",
    awardsMetric: "Giải thưởng Lớn đạt được",
    standardsMetric: "Vật liệu Lab đạt chuẩn chất lượng",
    certScanText: " (Xem bản Scan xác thực)",
    awards: [
      {
        title: "Giải Ba Cuộc thi EPICS 8",
        subtitle: "Engineering Projects in Community Service",
        description: "Chứng minh năng lực giải quyết bài toán kỹ thuật thực tế nhằm phục vụ và nâng cao chất lượng sống cho cộng đồng xã hội thông qua gạch bông gió sinh thái.",
        certName: "Chứng nhận EPICS 8 (ASU & Dow)",
        date: "Tháng 11, 2024"
      },
      {
        title: "Giải Khuyến khích VWRA 2025",
        subtitle: "Hiệp hội Quản lý chất thải Việt Nam",
        description: "Chứng minh sự công nhận và đánh giá cao từ các chuyên gia đầu ngành trong lĩnh vực xử lý rác thải nhựa đa lớp và kinh tế tuần hoàn tại Việt Nam.",
        certName: "Bằng khen VWRA 2025",
        date: "Tháng 03, 2025"
      }
    ]
  },
  en: {
    title: "Achievements ",
    titleHighlight: "& Awards",
    subtitle: "Key milestones and quality certifications validating RENOVA's commitment to tech innovation and social responsibility.",
    awardsMetric: "Major Awards Achieved",
    standardsMetric: "Lab Quality Standards Met",
    certScanText: " (View verified scan)",
    awards: [
      {
        title: "3rd Prize - EPICS 8 Competition",
        subtitle: "Engineering Projects in Community Service",
        description: "Demonstrating capabilities in solving engineering problems to serve and uplift the community through eco-friendly breeze blocks.",
        certName: "EPICS 8 Certificate (ASU & Dow)",
        date: "November 2024"
      },
      {
        title: "Consolation Prize - VWRA 2025",
        subtitle: "Vietnam Waste Recycling Association",
        description: "Validating recognition and appreciation from leading national experts in multi-layer plastic upcycling and circular economy in Vietnam.",
        certName: "VWRA 2025 Commendation",
        date: "March 2025"
      }
    ]
  }
};

export default function Milestones({ lang }: MilestonesProps) {
  const [awardsCount, setAwardsCount] = useState(0);
  const [labPercent, setLabPercent] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);
  const t = translations[lang];

  // Count-up animation triggered when visible on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          
          const duration = 1500; // ms
          const intervalTime = 30;
          const steps = duration / intervalTime;
          
          let step = 0;
          const timer = setInterval(() => {
            step++;
            setAwardsCount(Math.min(3, Math.floor((3 / steps) * step)));
            setLabPercent(Math.min(100, Math.floor((100 / steps) * step)));
            
            if (step >= steps) {
              clearInterval(timer);
            }
          }, intervalTime);
        }
      },
      { threshold: 0.15 } // Trigger when 15% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const awards = [
    {
      title: t.awards[0].title,
      subtitle: t.awards[0].subtitle,
      description: t.awards[0].description,
      link: "#",
      certName: t.awards[0].certName,
      date: t.awards[0].date
    },
    {
      title: t.awards[1].title,
      subtitle: t.awards[1].subtitle,
      description: t.awards[1].description,
      link: "#",
      certName: t.awards[1].certName,
      date: t.awards[1].date
    }
  ];

  return (
    <section id="thanh-tuu" ref={sectionRef} className="relative py-20">
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

        {/* METRICS COUNT-UP DISPLAY */}
        <ScrollReveal animation="scale-in" duration={500} delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-[700px] mx-auto mb-16">
            
            <div className="glass-card flex flex-col items-center p-8 sm:p-10 text-center border border-brand-secondary/20 shadow-xs">
              <Award size={48} className="text-brand-secondary mb-4 animate-float" />
              <h3 className="text-5xl sm:text-6xl font-black font-heading gradient-text-gold">
                0{awardsCount}+
              </h3>
              <p className="text-sm sm:text-base text-brand-text-muted font-semibold mt-1">
                {t.awardsMetric}
              </p>
            </div>

            <div className="glass-card flex flex-col items-center p-8 sm:p-10 text-center border border-brand-primary/20 shadow-xs">
              <CheckCircle size={48} className="text-brand-primary mb-4 animate-float" />
              <h3 className="text-5xl sm:text-6xl font-black font-heading gradient-text">
                {labPercent}%
              </h3>
              <p className="text-sm sm:text-base text-brand-text-muted font-semibold mt-1">
                {t.standardsMetric}
              </p>
            </div>

          </div>
        </ScrollReveal>

        {/* DETAILED AWARD LIST */}
        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
          {awards.map((award, idx) => (
            <div 
              key={idx}
              className="glass-card flex flex-col gap-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                <div>
                  <h3 className="text-xl sm:text-2xl text-brand-text-primary font-bold">{award.title}</h3>
                  <p className="text-[13px] text-brand-primary font-semibold mt-0.5 font-heading">
                    {award.subtitle}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-brand-bg-dark border border-brand-border/40 py-1.5 px-3.5 rounded-full text-xs text-brand-text-muted font-medium">
                  <Calendar size={14} />
                  <span>{award.date}</span>
                </div>
              </div>

              <p className="text-brand-text-muted text-sm sm:text-[15px] leading-relaxed">
                {award.description}
              </p>

              <div className="flex border-t border-brand-border/50 pt-4 mt-2">
                <a 
                  href={award.link}
                  className="inline-flex items-center gap-2 text-brand-primary hover:underline text-sm font-semibold transition-all"
                >
                  <ExternalLink size={16} />
                  {award.certName}{t.certScanText}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
