"use client";

import React, { useState } from "react";
import { Check, Flame, Weight, ShieldAlert, Sparkles, Scale } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface ComparisonMatrixProps {
  lang: "vi" | "en";
}

const translations = {
  vi: {
    title: "Ma trận So sánh ",
    titleHighlight: "Vật liệu",
    subtitle: "Khác biệt vượt trội của gạch bông gió sinh thái RENOVA so với các vật liệu xây dựng truyền thống trên thị trường về cả thông số kỹ thuật lẫn bảo vệ môi trường.",
    techProp: "Đặc tính kỹ thuật",
    superior: "Vượt trội",
    categories: [
      { name: "Gạch bông gió RENOVA", sub: "Vật liệu sinh thái thế hệ mới" },
      { name: "Bông gió Bê tông / Xi măng", sub: "Phương pháp truyền thống nặng" },
      { name: "Bông gió Đất nung", sub: "Đất sét nung nhiệt độ cao" }
    ],
    parameters: [
      {
        name: "Trọng lượng trung bình",
        values: [
          { text: "1.5 kg (Siêu nhẹ, nhẹ gấp đôi)", highlight: true },
          { text: "3.2 kg (Nặng, tốn chi phí vận chuyển)", highlight: false },
          { text: "2.8 kg (Trung bình)", highlight: false }
        ]
      },
      {
        name: "Khả năng cách âm & cách nhiệt",
        values: [
          { text: "Tuyệt vời (Hệ số Thermal Shield cách nhiệt chủ động)", highlight: true },
          { text: "Kém (Dẫn nhiệt nhanh)", highlight: false },
          { text: "Trung bình (Giữ nhiệt lâu)", highlight: false }
        ]
      },
      {
        name: "Hồ sơ Carbon sinh ra",
        values: [
          { text: "Âm carbon (-0.8 kg CO2eq / viên)", highlight: true },
          { text: "Dương (Phát thải lớn từ nung & clinker xi măng)", highlight: false },
          { text: "Dương rất cao (Khí thải nung lò đất sét)", highlight: false }
        ]
      },
      {
        name: "Tận dụng rác thải nhựa đa lớp",
        values: [
          { text: "Có (Trung bình 0.75 kg MLP / viên)", highlight: true },
          { text: "Không", highlight: false },
          { text: "Không", highlight: false }
        ]
      },
      {
        name: "Độ bền thời tiết & chống UV",
        values: [
          { text: "Hoàn hảo (Bảo hành chống lão hóa hóa học 10 năm)", highlight: true },
          { text: "Bị thấm nứt theo thời gian", highlight: false },
          { text: "Rêu mốc và dễ vỡ dưới nắng mưa", highlight: false }
        ]
      }
    ]
  },
  en: {
    title: "Comparison ",
    titleHighlight: "Matrix",
    subtitle: "The outstanding advantages of RENOVA eco breeze blocks compared to traditional materials in terms of physical specifications and eco-impact.",
    techProp: "Technical Properties",
    superior: "Superior",
    categories: [
      { name: "RENOVA Breeze Block", sub: "Next-gen eco material" },
      { name: "Concrete / Cement Block", sub: "Heavy traditional method" },
      { name: "Clay Terracotta Block", sub: "High-heat kiln fired clay" }
    ],
    parameters: [
      {
        name: "Average Weight",
        values: [
          { text: "1.5 kg (Ultra-lightweight, 50% lighter)", highlight: true },
          { text: "3.2 kg (Heavy, high freight costs)", highlight: false },
          { text: "2.8 kg (Medium)", highlight: false }
        ]
      },
      {
        name: "Thermal & Acoustic Shielding",
        values: [
          { text: "Excellent (Active Thermal Shield coefficient)", highlight: true },
          { text: "Poor (High thermal conductivity)", highlight: false },
          { text: "Medium (Retains heat)", highlight: false }
        ]
      },
      {
        name: "Carbon Profile",
        values: [
          { text: "Carbon Negative (-0.8 kg CO2eq / block)", highlight: true },
          { text: "Positive (Heavy kiln emissions & cement clinker)", highlight: false },
          { text: "Highly positive (Fossil fuel kiln clay firing)", highlight: false }
        ]
      },
      {
        name: "Multi-layer Plastic upcycling",
        values: [
          { text: "Yes (~0.75 kg MLP upcycled / block)", highlight: true },
          { text: "No", highlight: false },
          { text: "No", highlight: false }
        ]
      },
      {
        name: "Weather & UV Durability",
        values: [
          { text: "Perfect (10-year chemical anti-aging warranty)", highlight: true },
          { text: "Prone to cracking over time", highlight: false },
          { text: "Subject to mold and degradation", highlight: false }
        ]
      }
    ]
  }
};

export default function ComparisonMatrix({ lang }: ComparisonMatrixProps) {
  const [hoveredCol, setHoveredCol] = useState<number | null>(0); // Default focus on RENOVA
  const t = translations[lang];

  const categories = t.categories;

  const parameters = [
    {
      name: t.parameters[0].name,
      icon: <Weight size={18} />,
      values: t.parameters[0].values
    },
    {
      name: t.parameters[1].name,
      icon: <Flame size={18} />,
      values: t.parameters[1].values
    },
    {
      name: t.parameters[2].name,
      icon: <Scale size={18} />,
      values: t.parameters[2].values
    },
    {
      name: t.parameters[3].name,
      icon: <Check size={18} />,
      values: t.parameters[3].values
    },
    {
      name: t.parameters[4].name,
      icon: <Sparkles size={18} />,
      values: t.parameters[4].values
    }
  ];

  return (
    <section id="so-sanh-vat-lieu" className="dark-section">
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

        <div className="overflow-x-auto pb-4">
          <table className="w-full border-separate border-spacing-2 min-w-[750px]">
            <thead>
              <tr>
                {/* Parameter header */}
                <th className="p-5 text-left text-brand-text-muted text-sm font-semibold w-1/4">
                  {t.techProp}
                </th>

                {/* Columns headers */}
                {categories.map((cat, idx) => {
                  const isRenova = idx === 0;
                  const isHighlighted = hoveredCol === idx;

                  return (
                    <th 
                      key={idx}
                      onMouseEnter={() => setHoveredCol(idx)}
                      onMouseLeave={() => setHoveredCol(0)} // Reset back to highlight RENOVA
                      className="py-6 px-5 text-center rounded-xl transition-all duration-300 cursor-default w-1/4"
                      style={{
                        background: isHighlighted 
                          ? isRenova 
                            ? "linear-gradient(180deg, rgba(145, 71, 36, 0.15) 0%, rgba(17, 21, 19, 0.9) 100%)"
                            : "rgba(255, 255, 255, 0.03)"
                          : isRenova 
                            ? "rgba(145, 71, 36, 0.05)"
                            : "transparent",
                        border: isHighlighted
                          ? isRenova
                            ? "1px solid rgba(145, 71, 36, 0.3)"
                            : "1px solid rgba(255, 255, 255, 0.1)"
                          : isRenova
                            ? "1px solid rgba(145, 71, 36, 0.15)"
                            : "1px solid transparent",
                        boxShadow: isHighlighted && isRenova ? "0 10px 30px rgba(145, 71, 36, 0.08)" : "none"
                      }}
                    >
                      <h3 
                        className="text-lg font-heading"
                        style={{ color: isRenova ? "var(--color-brand-primary)" : "#fff" }}
                      >
                        {cat.name}
                      </h3>
                      <p className="text-xs text-brand-text-muted font-medium mt-1">
                        {cat.sub}
                      </p>
                    </th>
                  );
                })}
              </tr>
            </thead>
            
            <tbody>
              {parameters.map((param, rowIdx) => (
                <tr key={rowIdx}>
                  {/* Parameter Label */}
                  <td className="p-4 rounded-xl bg-white/2 text-sm font-semibold flex items-center gap-2.5 border border-white/3">
                    <span className="text-brand-primary">{param.icon}</span>
                    {param.name}
                  </td>

                  {/* Param values for each option */}
                  {param.values.map((val, colIdx) => {
                    const isRenova = colIdx === 0;
                    const isHighlighted = hoveredCol === colIdx;

                    return (
                      <td 
                        key={colIdx}
                        onMouseEnter={() => setHoveredCol(colIdx)}
                        onMouseLeave={() => setHoveredCol(0)}
                        className="p-4 text-center rounded-xl text-xs leading-normal transition-all duration-300"
                        style={{
                          background: isHighlighted 
                            ? isRenova
                              ? "rgba(145, 71, 36, 0.08)"
                              : "rgba(255, 255, 255, 0.02)"
                            : isRenova
                              ? "rgba(145, 71, 36, 0.03)"
                              : "transparent",
                          border: isHighlighted && isRenova
                            ? "1px solid rgba(145, 71, 36, 0.2)"
                            : "1px solid transparent",
                          color: val.highlight ? "#ffffff" : "var(--color-brand-text-muted)",
                          fontWeight: val.highlight ? "700" : "400"
                        }}
                      >
                        {isRenova && (
                          <span className="text-[10px] uppercase bg-brand-primary/20 text-brand-primary px-1.5 py-0.5 rounded mr-1.5 align-middle">
                            {t.superior}
                          </span>
                        )}
                        <span className="align-middle">{val.text}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
