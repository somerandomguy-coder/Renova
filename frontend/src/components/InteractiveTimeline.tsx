"use client";

import React, { useState } from "react";
import { Beaker, Trophy, Shield, Rocket, FileText } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface InteractiveTimelineProps {
  lang: "vi" | "en";
}

const translations = {
  vi: {
    title: "Hành trình ",
    titleHighlight: "RENOVA",
    subtitle: "Từ nghiên cứu và phát triển nguyên mẫu tại Trường Đại học Bách Khoa – ĐHQG-HCM đến giai đoạn kiểm định, pilot và chuẩn bị thương mại hóa vật liệu tuần hoàn RENOVA",
    steps: [
      {
        title: "Nghiên cứu Lab",
        subtitle: "Giai đoạn Nghiên cứu Cơ bản",
        description: "Nhóm nghiên cứu phát triển các nguyên mẫu vật liệu composite từ bao bì nhựa đa lớp (MLP), nhựa tái chế và phụ phẩm vỏ trấu, từng bước thử nghiệm cấp phối và khả năng tạo hình.",
        date: "8/2025"
      },
      {
        title: "Ghi nhận tại Cuộc thi Tái chế 2025",
        subtitle: "Hiệp hội Tái chế Chất thải Việt Nam",
        description: "Nhóm RENOVA được Hiệp hội Tái chế Chất thải Việt Nam khen tặng vì thành tích tại cuộc thi, đánh dấu bước xác nhận đầu tiên đối với hướng nghiên cứu vật liệu tuần hoàn của dự án.",
        date: "11/2025"
      },
      {
        title: "Giải Ba EPICS",
        subtitle: "Chương trình EPICS (ASU & Dow Vietnam)",
        description: "Dự án RENOVA đạt Giải Ba tại chương trình EPICS do Arizona State University và Dow Vietnam tổ chức, ghi nhận hướng tiếp cận ứng dụng kỹ thuật phục vụ cộng đồng.",
        date: "Tháng 5/2026"
      },
      {
        title: "Thiết kế sản phẩm và khuôn",
        subtitle: "Giai đoạn thiết kế kĩ thuật & tối ưu kiểu dáng",
        description: "Nghiên cứu, thiết kế chi tiết sản phẩm gạch bông gió sinh thái và chế tạo bản vẽ kĩ thuật khuôn mẫu tối ưu cho sản xuất.",
        date: "08/2026 - 10/2026"
      },
      {
        title: "Prototype: Gia công khuôn và sản xuất thử",
        subtitle: "Chế tạo khuôn & Thử nghiệm sản xuất",
        description: "Gia công thực tế hệ thống khuôn đúc, tiến hành sản xuất thử nghiệm lô mẫu prototype và đánh giá chất lượng sản phẩm.",
        date: "10/2026 - 12/2026"
      }
    ]
  },
  en: {
    title: "Hành Trình ",
    titleHighlight: "Journey",
    subtitle: "From R&D and prototype development at HCMC University of Technology (VNU-HCM) to testing, piloting, and preparing for commercialization of RENOVA circular materials.",
    steps: [
      {
        title: "Material R&D Initiation",
        subtitle: "Prototype Research & Development Start",
        description: "The research team developed composite material prototypes from multi-layer plastic (MLP) packaging, recycled plastic, and rice husk by-products, testing mixing ratios and moldability.",
        date: "8/2025"
      },
      {
        title: "Recognition at Waste Recycling Contest 2025",
        subtitle: "Vietnam Waste Recycling Association",
        description: "The RENOVA team received commendation from the Vietnam Waste Recycling Association for contest achievements, marking the first validation of the circular material research direction.",
        date: "November 2025"
      },
      {
        title: "3rd Prize - EPICS Program",
        subtitle: "Engineering Projects in Community Service (ASU & Dow)",
        description: "The RENOVA project won 3rd Prize at the EPICS program hosted by Arizona State University and Dow Vietnam, recognizing an engineering approach serving the community.",
        date: "Tháng 5/2026"
      },
      {
        title: "Product & Mold Design",
        subtitle: "Engineering Design & Mold Optimization",
        description: "Detailed R&D design for eco-breeze block products and technical mold engineering for optimized manufacturing.",
        date: "08/2026 - 10/2026"
      },
      {
        title: "Prototype: Mold Machining & Trial Run",
        subtitle: "Mold Fabrication & Trial Production",
        description: "Fabricating physical mold systems, conducting trial production runs of prototype batches, and evaluating product performance.",
        date: "10/2026 - 12/2026"
      }
    ]
  }
};

export default function InteractiveTimeline({ lang }: InteractiveTimelineProps) {
  const [activeStep, setActiveStep] = useState(2); // Default to sample testing V16 for demonstration
  const t = translations[lang];

  const milestones = [
    {
      icon: <Beaker size={20} />,
      title: t.steps[0].title,
      subtitle: t.steps[0].subtitle,
      description: t.steps[0].description,
      date: t.steps[0].date
    },
    {
      icon: <Trophy size={20} />,
      title: t.steps[1].title,
      subtitle: t.steps[1].subtitle,
      description: t.steps[1].description,
      date: t.steps[1].date
    },
    {
      icon: <Shield size={20} />,
      title: t.steps[2].title,
      subtitle: t.steps[2].subtitle,
      description: t.steps[2].description,
      date: t.steps[2].date
    },
    {
      icon: <FileText size={20} />,
      title: t.steps[3].title,
      subtitle: t.steps[3].subtitle,
      description: t.steps[3].description,
      date: t.steps[3].date
    },
    {
      icon: <Rocket size={20} />,
      title: t.steps[4].title,
      subtitle: t.steps[4].subtitle,
      description: t.steps[4].description,
      date: t.steps[4].date
    }
  ];

  return (
    <section id="hanh-trinh" className="dark-section">
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

        <div className="max-w-3xl mx-auto relative py-5">
          
          {/* Vertical Center Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-white/10 -translate-x-1/2 z-0"></div>

          {/* Active line filler */}
          <div 
            className="absolute left-6 md:left-1/2 top-0 w-0.5 bg-gradient-to-b from-brand-primary to-brand-secondary -translate-x-1/2 transition-[height] duration-750 ease-[cubic-bezier(0.16,1,0.3,1)] z-10"
            style={{ height: `${(activeStep / (milestones.length - 1)) * 100}%` }}
          ></div>

          {/* Timeline Nodes */}
          <div className="flex flex-col gap-16 relative z-20">
            {milestones.map((step, index) => {
              const isActive = index <= activeStep;
              const isEven = index % 2 === 0;

              return (
                <div 
                  key={index} 
                  className={`flex w-full relative justify-end ${isEven ? "md:justify-start" : "md:justify-end"}`}
                >
                  {/* Timeline Center Node */}
                  <div 
                    onClick={() => setActiveStep(index)}
                    className={`absolute left-6 md:left-1/2 top-6 w-11 h-11 rounded-full -translate-x-1/2 flex items-center justify-center cursor-pointer transition-all duration-300 z-30 ${
                      index === activeStep ? "animate-float" : ""
                    }`}
                    style={{ 
                      background: isActive ? "linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-secondary))" : "rgba(255, 255, 255, 0.05)",
                      border: `3px solid ${isActive ? "rgba(255,255,255,0.2)" : "rgba(255, 255, 255, 0.1)"}`,
                      color: isActive ? "#fff" : "rgba(255, 255, 255, 0.4)",
                      boxShadow: isActive ? "0 0 15px rgba(145, 71, 36, 0.4)" : "none"
                    }}
                  >
                    {step.icon}
                  </div>

                  {/* Content Card */}
                  <div 
                    onClick={() => setActiveStep(index)}
                    className={`glass-card w-[calc(100%-3.5rem)] md:w-[42%] p-6 cursor-pointer transition-all duration-300 text-left ${
                      isEven ? "md:text-right" : "md:text-left"
                    } border-l-[3px] md:border-l-0 ${
                      isActive 
                        ? "border-brand-primary opacity-100 scale-[1.02] shadow-[0_10px_30px_rgba(145,71,36,0.08)]" 
                        : "border-white/5 opacity-60 scale-100"
                    } ${
                      isEven && isActive ? "md:border-r-[3px] md:border-brand-primary" : "md:border-r-[1px] md:border-white/5"
                    } ${
                      !isEven && isActive ? "md:border-l-[3px] md:border-brand-primary" : "md:border-l-[1px] md:border-white/5"
                    }`}
                  >
                    <span 
                      className={`text-xs font-bold font-heading ${
                        isActive ? "text-brand-primary" : "text-brand-text-muted"
                      }`}
                    >
                      {step.date}
                    </span>
                    <h3 className="text-xl mt-1 mb-2">
                      {step.title}
                    </h3>
                    <h4 className="text-sm text-brand-text-muted mb-3 font-medium">
                      {step.subtitle}
                    </h4>
                    <p className="text-sm leading-relaxed text-brand-text-muted">
                      {step.description}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
