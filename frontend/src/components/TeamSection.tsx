"use client";

import React from "react";
import { Mail, Phone } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface TeamSectionProps {
  lang: "vi" | "en";
}

const translations = {
  vi: {
    title: "Đội ngũ Nhân lực ",
    titleHighlight: "Cốt lõi",
    subtitle: "Sự kết hợp đa ngành giữa môi trường, vật liệu, kinh tế và truyền thông đến từ Trường Đại học Bách Khoa - ĐHQG-HCM, bảo chứng cho năng lực thực thi dự án.",
    members: [
      {
        role: "Trưởng dự án & Quản lý sản xuất",
        major: "Chuyên ngành: Kỹ thuật Môi trường"
      },
      {
        role: "Trưởng nhóm R&D & Kỹ thuật vật liệu",
        major: "Chuyên ngành: Kỹ thuật Ô tô"
      },
      {
        role: "Trưởng nhóm Phát triển Bền vững & EPR",
        major: "Chuyên ngành: Kinh tế Tuần hoàn"
      },
      {
        role: "Quản lý Tài chính & Vận hành",
        major: "Chuyên ngành: Kinh doanh số"
      },
      {
        role: "Trưởng nhóm Truyền thông & Khảo sát",
        major: "Chuyên ngành: Công nghệ Dệt may"
      },
      {
        role: "Trưởng nhóm Đối ngoại & Thuyết trình",
        major: "Chuyên ngành: Thiết kế vi mạch"
      },
      {
        role: "Kỹ sư Phần mềm chính & Kiến trúc sư AI",
        major: "Chuyên ngành: Trí tuệ Nhân tạo (AI)"
      }
    ]
  },
  en: {
    title: "Our Core ",
    titleHighlight: "Team",
    subtitle: "An interdisciplinary combination of environmental engineering, materials science, economics, and media from HCMC University of Technology, guaranteeing project execution capabilities.",
    members: [
      {
        role: "Project Leader & Production Manager",
        major: "Major: Environmental Engineering"
      },
      {
        role: "R&D & Material Engineering Lead",
        major: "Major: Automotive Engineering"
      },
      {
        role: "Sustainability & EPR Compliance Lead",
        major: "Major: Circular Economy"
      },
      {
        role: "Finance & Operations Manager",
        major: "Major: Digital Business"
      },
      {
        role: "Media Lead & Survey",
        major: "Major: Textile Technology"
      },
      {
        role: "External Relations & Presentation",
        major: "Major: Digital VLSI Design"
      },
      {
        role: "Lead Software Engineer & AI Architect",
        major: "Major: Artificial Intelligence (AI)"
      }
    ]
  }
};

export default function TeamSection({ lang }: TeamSectionProps) {
  const t = translations[lang];

  const members = [
    {
      name: "Lê Nhật Huy",
      role: t.members[0].role,
      major: t.members[0].major,
      email: "lenhathuyaya@gmail.com",
      phone: "0914626717",
      linkedin: "https://www.linkedin.com/in/huylenhat",
      avatar: "/team/le_nhat_huy.jpg"
    },
    {
      name: "Nguyễn Trần Thế Vinh",
      role: t.members[1].role,
      major: t.members[1].major,
      email: "vinh.nguyentrth07@hcmut.edu.vn",
      phone: "0983582579",
      linkedin: "https://www.linkedin.com/in/vinh-nguy%E1%BB%85n-tr%E1%BA%A7n-th%E1%BA%BF",
      avatar: "/team/nguyen_tran_the_vinh.png"
    },
    {
      name: "Nguyễn Phúc Minh Anh",
      role: t.members[2].role,
      major: t.members[2].major,
      email: "anh.nguyenphucminh76@hcmut.edu.vn",
      phone: "0703959204",
      linkedin: "https://www.linkedin.com/in/nguyen-phuc-minh-anh-807a8930a",
      avatar: "/team/nguyen_phuc_minh_anh.png"
    },
    {
      name: "Nguyễn Phúc Minh Thư",
      role: t.members[3].role,
      major: t.members[3].major,
      email: "thunguyen.phucvn@gmail.com",
      phone: "0829354286",
      linkedin: "https://www.linkedin.com/in/npmt868686/",
      avatar: "/team/nguyen_phuc_minh_thu.png"
    },
    {
      name: "Trần Thị Tuyết Minh",
      role: t.members[4].role,
      major: t.members[4].major,
      email: "minh.trantyetmin95@hcmut.edu.vn",
      phone: "0385747277",
      linkedin: "https://www.linkedin.com/in/minh-tuyết-32ab683a6?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      avatar: "/team/tran_thi_tuyet_minh.jpg"
    },
    {
      name: "Lê Phúc Khang",
      role: t.members[5].role,
      major: t.members[5].major,
      email: "lephuckhang0@gmail.com",
      phone: "0981976880",
      linkedin: "https://www.linkedin.com/in/khanglephuc/",
      avatar: "/team/le_phuc_khang.png"
    },
    {
      name: "Lê Nam",
      role: t.members[6].role,
      major: t.members[6].major,
      email: "nicholasle0205@gmail.com",
      phone: "(+61)426649419",
      linkedin: "https://www.linkedin.com/in/nam-le-1227a7279/",
      avatar: "/team/nam_le.jpeg"
    }
  ];

  return (
    <section id="doi-ngu" className="dark-section py-20">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member, index) => (
            <div 
              key={index}
              className="glass-card group flex flex-col items-center text-center p-8 px-6 relative overflow-hidden"
            >
              {/* Profile Image with frame */}
              <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-[3px] border-brand-border/20 mb-5 relative">
                <img 
                  src={member.avatar} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name & Role */}
              <h3 className="text-xl mb-1.5 text-white">{member.name}</h3>
              <p className="text-brand-primary text-[13px] font-semibold mb-2 font-heading">
                {member.role}
              </p>
              <p className="text-brand-text-muted text-xs leading-relaxed max-w-[220px] mx-auto">
                {member.major}
              </p>

              {/* Hover / Click Contacts Overlay */}
              <div 
                className="contact-overlay relative md:absolute bottom-0 left-0 w-full py-2 md:py-4 bg-transparent md:bg-gradient-to-t md:from-neutral-950 md:via-neutral-950/95 md:to-transparent flex justify-center gap-5 mt-4 md:mt-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 border-t border-white/10 md:border-t-0"
              >
                <a 
                  href={`mailto:${member.email}`}
                  title={member.email}
                  className="text-brand-text-muted hover:text-brand-primary transition-colors duration-200 flex items-center"
                >
                  <Mail size={20} />
                </a>
                
                <a 
                  href={`tel:${member.phone}`}
                  title={member.phone}
                  className="text-brand-text-muted hover:text-brand-primary transition-colors duration-200 flex items-center"
                >
                  <Phone size={20} />
                </a>

                <a 
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-text-muted hover:text-brand-primary transition-colors duration-200 flex items-center"
                >
                  <LinkedInIcon />
                </a>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
