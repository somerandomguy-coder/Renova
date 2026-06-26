"use client";

import React, { useState } from "react";
import { Beaker, Trophy, Shield, Rocket } from "lucide-react";

interface InteractiveTimelineProps {
  lang: "vi" | "en";
}

const translations = {
  vi: {
    title: "Hành trình ",
    titleHighlight: "RENOVA",
    subtitle: "Từ phát minh khoa học trong phòng thí nghiệm trường Bách Khoa đến giải pháp vật liệu xanh có chứng nhận chất lượng quốc tế và sẵn sàng thương mại hóa.",
    steps: [
      {
        title: "Nghiên cứu Lab",
        subtitle: "Giai đoạn Nghiên cứu Cơ bản",
        description: "Thành công trong việc tổng hợp phôi vật liệu polymer composite nền từ nhựa đa lớp MLP kết hợp sợi xenlulo tự nhiên từ vỏ trấu.",
        date: "2023 - 2024"
      },
      {
        title: "Đạt giải EPICS 8",
        subtitle: "Giải thưởng Sáng kiến Cộng đồng",
        description: "Được vinh danh tại cuộc thi Engineering Projects in Community Service (EPICS 8) do ASU và Dow tài trợ nhờ dự án gạch bông gió tuần hoàn.",
        date: "Cuối 2024"
      },
      {
        title: "Thử nghiệm mẫu V16",
        subtitle: "Giai đoạn Hoàn thiện Vật lý",
        description: "Phát triển mẫu V16 với cường độ nén cao (6-8 MPa), độ hút nước dưới 2% và đạt chứng chỉ chống tia cực tím UV và thử nghiệm chống chịu thời tiết.",
        date: "2025"
      },
      {
        title: "Gọi vốn thương mại hóa",
        subtitle: "Triển khai B2B & Chuyển giao",
        description: "Mở rộng liên kết với các doanh nghiệp FMCG đóng phí EPR và các quỹ đầu tư xanh để lắp đặt dây chuyền sản xuất công nghiệp quy mô lớn.",
        date: "2026 - Tương lai"
      }
    ]
  },
  en: {
    title: "The RENOVA ",
    titleHighlight: "Journey",
    subtitle: "From a scientific breakthrough in the HCMC University of Technology lab to an eco-material solution with international quality certifications, ready for commercialization.",
    steps: [
      {
        title: "Lab Research Phase",
        subtitle: "Basic Science & Feasibility",
        description: "Successfully synthesized natural fiber polymer composite using tough multi-layer plastic (MLP) as matrix reinforced by rice husk cellulose fibers.",
        date: "2023 - 2024"
      },
      {
        title: "EPICS 8 Champion",
        subtitle: "Community Innovation Award",
        description: "Awarded top honors at the Engineering Projects in Community Service (EPICS 8) sponsored by Arizona State University & Dow Chemical.",
        date: "Late 2024"
      },
      {
        title: "Specimen V16 Testing",
        subtitle: "Physical Optimization Phase",
        description: "Developed V16 specimens featuring high compressive strength (6-8 MPa), water absorption under 2%, UV resistance and accelerated weathering certifications.",
        date: "2025"
      },
      {
        title: "Commercial Scaling",
        subtitle: "B2B Rollout & Technology Transfer",
        description: "Expanding strategic partnerships with FMCG brands subject to EPR fees and impact investment funds to launch industrial-scale production lines.",
        date: "2026 - Future"
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
      icon: <Rocket size={20} />,
      title: t.steps[3].title,
      subtitle: t.steps[3].subtitle,
      description: t.steps[3].description,
      date: t.steps[3].date
    }
  ];

  return (
    <section id="hanh-trinh" className="dark-section">
      <div className="container">
        <h2 className="section-title">
          {t.title}
          <span className="gradient-text">{t.titleHighlight}</span>
        </h2>
        <p className="section-subtitle">
          {t.subtitle}
        </p>

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
