"use client";

import React, { useState } from "react";
import { Truck, Factory, ShieldCheck, ClipboardCheck, ArrowRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface EprStepperProps {
  lang: "vi" | "en";
}

const translations = {
  vi: {
    title: "Quy trình Hợp tác ",
    titleHighlight: "EPR Kỹ thuật số",
    subtitle: "Quy trình 4 bước khép kín được tối ưu hóa bằng công nghệ số giúp doanh nghiệp của bạn dễ dàng thực thi trách nhiệm mở rộng của nhà sản xuất (EPR) và nhận chứng chỉ carbon.",
    statusLabel: "Trạng thái: ",
    nextBtn: "Bước tiếp theo",
    restartBtn: "Quay lại bước 1",
    steps: [
      {
        title: "1. Thu gom rác MLP",
        status: "Thu gom tại nhà máy đối tác",
        description: "Nhựa đa lớp (MLP) phát sinh từ hoạt động sản xuất bao bì hoặc phế phẩm của đối tác được phân loại tại nguồn và đóng kiện tiêu chuẩn để chờ vận chuyển."
      },
      {
        title: "2. Vận chuyển",
        status: "Vận chuyển về xưởng RENOVA",
        description: "Các đơn vị đối tác vận tải sinh thái của RENOVA tiến hành cân khối lượng thô tại cổng và vận chuyển rác thải nhựa về xưởng xử lý trung tâm."
      },
      {
        title: "3. Sản xuất gạch",
        status: "Gia công & Đúc bông gió sinh thái",
        description: "Nhựa MLP được nghiền nhỏ và ép nóng cùng vỏ trấu và chất liên kết sinh học để tạo nên các khối gạch bông gió có khả năng chịu lực vượt trội."
      },
      {
        title: "4. Cấp chứng chỉ ESG",
        status: "Nghiệm thu & Cấp chứng chỉ số",
        description: "Hệ thống tự động đối soát khối lượng đầu vào và đầu ra, lập báo cáo carbon âm và cấp Chứng chỉ Hoàn thành Trách nhiệm EPR điện tử để đối tác khai trình Bộ TN&MT."
      }
    ]
  },
  en: {
    title: "Digital ",
    titleHighlight: "EPR Workflow",
    subtitle: "A digitalized, closed-loop 4-step workflow that helps your business seamlessly comply with Extended Producer Responsibility (EPR) obligations and claim carbon offsets.",
    statusLabel: "Status: ",
    nextBtn: "Next Step",
    restartBtn: "Back to Step 1",
    steps: [
      {
        title: "1. MLP Collection",
        status: "In-situ sorting at partner factories",
        description: "Indestructible multi-layer plastic (MLP) packaging waste and manufacturing scrap are sorted at source and baled under standard specifications for dispatch."
      },
      {
        title: "2. Eco Transportation",
        status: "Hauling to RENOVA upcycling center",
        description: "RENOVA's certified green logistics partners perform automated raw weight scale tickets at gates and transport sorted plastic wastes to our hub."
      },
      {
        title: "3. Breeze Block Production",
        status: "Granulation & molding green blocks",
        description: "MLP polymers are shredded and hot-pressed with agricultural rice husk fiber and bio-binders into high mechanical strength heritage breeze blocks."
      },
      {
        title: "4. ESG Certification",
        status: "Reconciliation & digital ledger issue",
        description: "System reconciles mass inputs/outputs, audits carbon-negative metrics, and issues a tamperproof electronic EPR Certificate for Ministry compliance submission."
      }
    ]
  }
};

export default function EprStepper({ lang }: EprStepperProps) {
  const [activeStep, setActiveStep] = useState(0);
  const t = translations[lang];

  const steps = [
    {
      title: t.steps[0].title,
      icon: <Factory size={22} />,
      status: t.steps[0].status,
      description: t.steps[0].description
    },
    {
      title: t.steps[1].title,
      icon: <Truck size={22} />,
      status: t.steps[1].status,
      description: t.steps[1].description
    },
    {
      title: t.steps[2].title,
      icon: <ClipboardCheck size={22} />,
      status: t.steps[2].status,
      description: t.steps[2].description
    },
    {
      title: t.steps[3].title,
      icon: <ShieldCheck size={22} />,
      status: t.steps[3].status,
      description: t.steps[3].description
    }
  ];

  return (
    <section id="quy-trinh-epr" className="dark-section">
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

        <div className="glass-card max-w-4xl mx-auto">
          
          {/* Progress Stepper Bar */}
          <div className="stepper-container flex justify-between relative mb-12">
            <div className="stepper-line absolute left-0 right-0 w-full bg-white/10 z-0 h-0.5 top-5 sm:top-6">
              <div 
                className="stepper-line-progress h-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-[width] duration-500 ease-out" 
                style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>

            {steps.map((step, idx) => {
              const isCompleted = idx < activeStep;
              const isActive = idx === activeStep;

              return (
                <div 
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`stepper-step flex flex-col items-center relative z-10 w-10 sm:w-28 text-center cursor-pointer ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
                >
                  <div className="stepper-icon w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-zinc-900 border-2 border-brand-border flex items-center justify-center text-brand-text-muted transition-all duration-300">
                    {step.icon}
                  </div>
                  <div className="stepper-label text-[13px] font-semibold mt-3 text-brand-text-muted font-heading hidden sm:block">{step.title}</div>
                </div>
              );
            })}
          </div>

          {/* Stepper Content Detail */}
          <div className="bg-white/2 border border-white/4 rounded-xl p-7 mt-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <span className="text-xs text-brand-primary font-bold uppercase tracking-wider font-heading">
                {t.statusLabel}{steps[activeStep].status}
              </span>
              <h3 className="text-2xl mt-1.5 mb-3">
                {steps[activeStep].title}
              </h3>
              <p className="text-brand-text-muted text-[15px] leading-relaxed">
                {steps[activeStep].description}
              </p>
            </div>
            
            <div className="w-full md:w-auto flex justify-start md:justify-end">
              {activeStep < steps.length - 1 ? (
                <button 
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="btn-primary w-full md:w-auto justify-center px-5 py-3"
                >
                  {t.nextBtn}
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button 
                  onClick={() => setActiveStep(0)}
                  className="btn-secondary w-full md:w-auto justify-center px-5 py-3 dark:text-white"
                >
                  {t.restartBtn}
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
