"use client";

import React from "react";
import { GraduationCap, Award, ExternalLink } from "lucide-react";

interface StakeholdersProps {
  lang: "vi" | "en";
}

const translations = {
  vi: {
    title: "Bên liên quan & ",
    titleHighlight: "Hệ sinh thái",
    subtitle: "RENOVA được bảo trợ chuyên môn sâu sắc bởi các viện nghiên cứu và đồng hành cùng các hiệp hội, tập đoàn lớn trong định hình chuỗi giá trị rác thải tuần hoàn.",
    partnersHeader: "Đơn vị Đồng hành & Bảo trợ",
    advisorsHeader: "Hội đồng Cố vấn Chuyên môn (Advisory Board)",
    partners: [
      { name: "ĐHQG-HCM (HCMUT)", desc: "Trường Đại học Bách khoa" },
      { name: "FENR - HCMUT", desc: "Khoa Môi trường & Tài nguyên" },
      { name: "VWRA VIETNAM", desc: "Hiệp hội Quản lý chất thải Việt Nam" },
      { name: "DOW CHEMICAL", desc: "Dow Vietnam Corporation" },
      { name: "HCMUT LAB R&D", desc: "Lab Nghiên cứu Vật liệu mới" }
    ],
    advisors: [
      {
        title: "Giảng viên Hướng dẫn Khoa học",
        institution: "Khoa Môi trường và Tài nguyên - HCMUT",
        role: "Định hướng nghiên cứu cốt liệu composite, kiểm định và tối ưu hóa phản ứng liên kết polyme."
      },
      {
        title: "Cố vấn Công nghệ & R&D",
        institution: "Phòng Thí nghiệm Vật liệu Polymer - HCMUT",
        role: "Chỉ dẫn quy trình xử lý hóa lý nhựa đa lớp MLP thô và tích hợp phế phẩm vỏ trấu nông nghiệp."
      }
    ]
  },
  en: {
    title: "Stakeholders & ",
    titleHighlight: "Ecosystem",
    subtitle: "RENOVA is strongly supported by research institutions, working alongside industry organizations to shape the circular waste value chain.",
    partnersHeader: "Partners & Supporting Units",
    advisorsHeader: "Scientific & Technical Advisory Board",
    partners: [
      { name: "ĐHQG-HCM (HCMUT)", desc: "HCMC University of Technology" },
      { name: "FENR - HCMUT", desc: "Faculty of Environment & Natural Resources" },
      { name: "VWRA VIETNAM", desc: "Vietnam Waste Recycling Association" },
      { name: "DOW CHEMICAL", desc: "Dow Vietnam Corporation" },
      { name: "HCMUT LAB R&D", desc: "New Materials R&D Lab" }
    ],
    advisors: [
      {
        title: "Scientific Advisor",
        institution: "Faculty of Environment & Natural Resources - HCMUT",
        role: "Directing composite aggregates research, validation, and polymer binding reaction optimization."
      },
      {
        title: "Technology & R&D Advisor",
        institution: "Polymer Materials Lab - HCMUT",
        role: "Guiding raw MLP plastic physico-chemical treatment and agricultural rice husk waste integration."
      }
    ]
  }
};

export default function Stakeholders({ lang }: StakeholdersProps) {
  const t = translations[lang];

  const advisors = [
    {
      name: "Dr. Vo Thanh Hang",
      title: t.advisors[0].title,
      institution: t.advisors[0].institution,
      role: t.advisors[0].role,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300"
    },
    {
      name: "Ms. Duong Thi Thanh",
      title: t.advisors[1].title,
      institution: t.advisors[1].institution,
      role: t.advisors[1].role,
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300"
    }
  ];

  const partners = t.partners;

  return (
    <section id="doi-tac" className="relative py-20 bg-brand-bg-dark/20">
      <div className="container">
        <h2 className="section-title">
          {t.title}
          <span className="gradient-text">{t.titleHighlight}</span>
        </h2>
        <p className="section-subtitle">
          {t.subtitle}
        </p>

        {/* INFINITE LOGO CAROUSEL */}
        <div className="mb-20">
          <p className="text-xs sm:text-sm uppercase tracking-wider text-brand-text-muted text-center font-bold mb-8">
            {t.partnersHeader}
          </p>

          <div className="carousel-wrapper">
            <div className="logo-carousel">
              {/* Duplicate array to ensure seamless infinite looping */}
              {[...partners, ...partners].map((partner, idx) => (
                <div key={idx} className="logo-item">
                  <div className="bg-brand-bg-card border border-brand-border rounded-xl py-4 px-6 flex flex-col items-center justify-center w-[220px] h-20 text-center shadow-xs">
                    <span className="font-extrabold text-brand-text-primary text-[15px] font-heading">
                      {partner.name}
                    </span>
                    <span className="text-[10px] text-brand-text-muted mt-0.5">
                      {partner.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ADVISORY BOARD */}
        <div>
          <p className="text-xs sm:text-sm uppercase tracking-wider text-brand-text-muted text-center font-bold mb-10">
            {t.advisorsHeader}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[900px] mx-auto">
            {advisors.map((adv, idx) => (
              <div 
                key={idx}
                className="glass-card flex flex-col sm:grid sm:grid-cols-[100px_1fr] gap-6 items-start border-l-4 border-brand-primary p-6 sm:p-8"
              >
                {/* Advisor Photo */}
                <div className="w-[100px] h-[100px] rounded-xl overflow-hidden border-2 border-brand-border shrink-0 mx-auto sm:mx-0">
                  <img 
                    src={adv.avatar} 
                    alt={adv.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col gap-2 text-center sm:text-left">
                  <h3 className="text-xl text-brand-text-primary font-bold">{adv.name}</h3>
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-brand-primary">
                    <GraduationCap size={16} />
                    <span className="text-[13px] font-semibold font-heading">{adv.title}</span>
                  </div>
                  <p className="text-xs text-brand-text-muted font-semibold">
                    {adv.institution}
                  </p>
                  <p className="text-sm text-brand-text-muted leading-relaxed mt-1">
                    {adv.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
