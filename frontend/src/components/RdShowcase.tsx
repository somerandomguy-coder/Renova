"use client";

import React from "react";
import { 
  CheckCircle2, 
  Clock, 
  Compass, 
  Search, 
  Palette, 
  Flame, 
  ShieldCheck, 
  Zap, 
  Sun, 
  Award,
  Layers,
  Sparkles
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface RdShowcaseProps {
  lang: "vi" | "en";
}

const translations = {
  vi: {
    title: "Thư viện số ",
    titleHighlight: "Mẫu thử R&D",
    subtitle: "Khám phá chi tiết các giai đoạn nghiên cứu, thử nghiệm và tối ưu hóa các phiên bản vật liệu RENOVA qua từng cột mốc kỹ thuật khắt khe.",
    colVersion: "Phiên bản",
    colStatus: "Trạng thái",
    statusCompleted: "Đã xong",
    statusInProgress: "Đang diễn ra",
    versions: [
      { code: "V0 – thiết kế khuôn", status: "completed" },
      { code: "V1 – nguyên mẫu, xác định khiếm khuyết", status: "completed" },
      { code: "V2 – đổi màu, biến tính vật liệu", status: "completed" },
      { code: "V3 – tạo hình nhiệt", status: "completed" },
      { code: "V4 – áp dụng tính chịu nhiệt", status: "completed" },
      { code: "V5 – ứng suất nhiệt và môi trường", status: "in_progress" },
      { code: "V6 – giữ màu/tối ưu thời tiết", status: "in_progress" },
      { code: "Kiểm tra chất lượng", status: "in_progress" }
    ]
  },
  en: {
    title: "Digital R&D ",
    titleHighlight: "Specimen Matrix",
    subtitle: "Detailed overview of research, testing, and optimization stages across all RENOVA material iterations subject to strict engineering protocols.",
    colVersion: "Version & Iteration",
    colStatus: "Development Status",
    statusCompleted: "Completed",
    statusInProgress: "In Progress",
    versions: [
      { code: "V0 – Mold Design", status: "completed" },
      { code: "V1 – Prototype & Defect Identification", status: "completed" },
      { code: "V2 – Color & Material Modification", status: "completed" },
      { code: "V3 – Thermal Forming", status: "completed" },
      { code: "V4 – Heat Resistance Application", status: "completed" },
      { code: "V5 – Thermal & Environmental Stress Testing", status: "in_progress" },
      { code: "V6 – Color Retention & Weather Optimization", status: "in_progress" },
      { code: "Quality Control & Inspection", status: "in_progress" }
    ]
  }
};

export default function RdShowcase({ lang }: RdShowcaseProps) {
  const t = translations[lang];

  // Matching generated icons for each of the 8 version milestones
  const icons = [
    <Compass key="v0" size={18} className="text-brand-primary" />,
    <Search key="v1" size={18} className="text-brand-primary" />,
    <Palette key="v2" size={18} className="text-brand-primary" />,
    <Flame key="v3" size={18} className="text-brand-primary" />,
    <ShieldCheck key="v4" size={18} className="text-brand-primary" />,
    <Zap key="v5" size={18} className="text-amber-500" />,
    <Sun key="v6" size={18} className="text-amber-500" />,
    <Award key="v7" size={18} className="text-amber-500" />
  ];

  return (
    <section id="thu-vien-rd" className="dark-section relative py-20">
      <div className="container max-w-4xl mx-auto">
        <ScrollReveal animation="fade-up" duration={700}>
          <h2 className="section-title text-center">
            {t.title}
            <span className="gradient-text">{t.titleHighlight}</span>
          </h2>
          <p className="section-subtitle text-center max-w-2xl mx-auto mb-12">
            {t.subtitle}
          </p>
        </ScrollReveal>

        <ScrollReveal animation="scale-in" duration={600} delay={100}>
          <div className="glass-card !p-0 overflow-hidden border border-white/10 shadow-2xl rounded-2xl bg-zinc-950/80">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="py-4.5 px-6 text-sm font-bold text-white tracking-wide uppercase font-heading w-2/3">
                      <div className="flex items-center gap-2">
                        <Layers size={18} className="text-brand-primary" />
                        <span>{t.colVersion}</span>
                      </div>
                    </th>
                    <th className="py-4.5 px-6 text-sm font-bold text-white tracking-wide uppercase font-heading w-1/3">
                      <div className="flex items-center justify-between">
                        <span>{t.colStatus}</span>
                        <Sparkles size={16} className="text-brand-secondary" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {t.versions.map((item, idx) => {
                    const isCompleted = item.status === "completed";

                    return (
                      <tr 
                        key={idx}
                        className="hover:bg-white/[0.03] transition-colors duration-200"
                      >
                        {/* Version Column */}
                        <td className="py-4 px-6 font-medium text-sm sm:text-base text-zinc-100 dark:text-zinc-200">
                          <div className="flex items-center gap-3.5">
                            <div className="p-2 rounded-lg bg-white/5 border border-white/5 shrink-0">
                              {icons[idx]}
                            </div>
                            <span className={!isCompleted ? "font-bold text-white" : ""}>
                              {item.code}
                            </span>
                          </div>
                        </td>

                        {/* Status Column */}
                        <td className="py-4 px-6">
                          {isCompleted ? (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold">
                              <CheckCircle2 size={16} className="text-emerald-400" />
                              <span>{t.statusCompleted}</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-bold shadow-xs">
                              <Clock size={16} className="text-amber-400 animate-pulse" />
                              <span>{t.statusInProgress}</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
