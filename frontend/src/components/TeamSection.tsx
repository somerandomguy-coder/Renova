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
        major: "Chuyên ngành: Kỹ thuật Vật liệu / Polyme"
      },
      {
        role: "Trưởng nhóm Phát triển Bền vững & EPR",
        major: "Chuyên ngành: Quản lý Môi trường / Kinh tế Tuần hoàn"
      },
      {
        role: "Quản lý Tài chính & Vận hành",
        major: "Chuyên ngành: Quản trị / Kinh tế"
      },
      {
        role: "Trưởng nhóm Truyền thông & Khảo sát",
        major: "Chuyên ngành: Truyền thông / Đồ họa"
      },
      {
        role: "Trưởng nhóm Đối ngoại & Thuyết trình",
        major: "Chuyên ngành: Quản lý Dự án / Đối ngoại"
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
        major: "Major: Materials / Polymer Engineering"
      },
      {
        role: "Sustainability & EPR Compliance Lead",
        major: "Major: Environmental Management / Circular Economy"
      },
      {
        role: "Finance & Operations Manager",
        major: "Major: Business Administration / Economics"
      },
      {
        role: "Media Lead & Survey",
        major: "Major: Communications / Graphic Design"
      },
      {
        role: "External Relations & Presentation",
        major: "Major: Project Management / External Relations"
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
      email: "huy.lenhat@hcmut.edu.vn",
      phone: "0901234561",
      linkedin: "https://linkedin.com/in/lenhathuy",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"
    },
    {
      name: "Nguyen Tran The Vinh",
      role: t.members[1].role,
      major: t.members[1].major,
      email: "vinh.nguyentran@hcmut.edu.vn",
      phone: "0901234562",
      linkedin: "https://linkedin.com/in/nguyentranthevinh",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300"
    },
    {
      name: "Nguyen Phuc Minh Anh",
      role: t.members[2].role,
      major: t.members[2].major,
      email: "anh.nguyenphucminh@hcmut.edu.vn",
      phone: "0901234563",
      linkedin: "https://linkedin.com/in/nguyenphucminhanh",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"
    },
    {
      name: "Nguyen Phuc Minh Thu",
      role: t.members[3].role,
      major: t.members[3].major,
      email: "thu.nguyenphucminh@hcmut.edu.vn",
      phone: "0901234564",
      linkedin: "https://linkedin.com/in/nguyenphucminhthu",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300"
    },
    {
      name: "Tran Thi Tuyet Minh",
      role: t.members[4].role,
      major: t.members[4].major,
      email: "minh.tranthituyet@hcmut.edu.vn",
      phone: "0901234565",
      linkedin: "https://linkedin.com/in/tranthituyetminh",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300"
    },
    {
      name: "Le Phuc Khang",
      role: t.members[5].role,
      major: t.members[5].major,
      email: "khang.lephuc@hcmut.edu.vn",
      phone: "0901234566",
      linkedin: "https://linkedin.com/in/lephuckhang",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=300"
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
