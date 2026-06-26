"use client";

import React, { useState } from "react";
import { Info, X, ShieldCheck, Compass, Activity, Layers } from "lucide-react";

interface RdShowcaseProps {
  lang: "vi" | "en";
}

const translations = {
  vi: {
    title: "Thư viện số ",
    titleHighlight: "Mẫu thử R&D",
    subtitle: "Khám phá chi tiết các thế hệ mẫu thử RENOVA đã qua kiểm định khắt khe về độ bền cơ lý, khả năng chịu nhiệt và đặc tính chống chịu môi trường.",
    viewSpecs: "Xem thông số kỹ thuật",
    close: "Đóng lại",
    compressiveLabel: "Cường độ nén",
    absorptionLabel: "Độ hút nước",
    uvLabel: "Kiểm định tia cực tím UV",
    compositionLabel: "Thành phần cấp phối:",
    densityLabel: "Tỷ trọng vật liệu:",
    samples: [
      {
        title: "Mẫu phôi composite nền",
        generation: "Generation 1 (Giai đoạn Lab)",
        summary: "Phôi nền liên kết polymer nhựa tái chế đa lớp và vỏ trấu thô làm nền tảng chịu lực vững chắc.",
        specs: {
          compressive: "5.5 - 6.5 MPa",
          absorption: "< 2.5%",
          uv: "Đạt chuẩn SGS thử nghiệm UV 500 giờ",
          composition: "50% Nhựa đa lớp (MLP) + 50% Sợi trấu xenlulo",
          density: "1.2 g/cm³",
          development: "Nghiên cứu cấu trúc liên kết phân tử tế bào thực nghiệm."
        }
      },
      {
        title: "Mẫu gạch đặc V16",
        generation: "Generation 2 (Giai đoạn Thử nghiệm)",
        summary: "Gạch khối bán đặc V16 tối ưu hóa cho tường bao chịu nén lớn, tăng khả năng cách âm & nhiệt.",
        specs: {
          compressive: "6.8 - 7.5 MPa",
          absorption: "< 1.8%",
          uv: "Chứng chỉ chống tia UV cao cấp (ASTM G154)",
          composition: "60% Nhựa MLP + 40% Vỏ trấu và phụ gia liên kết chéo",
          density: "1.35 g/cm³",
          development: "Chịu lực cao gấp đôi gạch nhẹ bê tông thông thường."
        }
      },
      {
        title: "Gạch bông gió Heritage",
        generation: "Generation 3 (Thương mại hóa)",
        summary: "Thiết kế gạch bông gió hoa văn di sản Á Đông đặc trưng, tăng đối lưu không khí tự nhiên.",
        specs: {
          compressive: "7.8 - 8.2 MPa",
          absorption: "< 1.2%",
          uv: "Không phai màu dưới tác động UV ngoài trời (10 năm bảo hành)",
          composition: "45% Nhựa MLP + 45% Vỏ trấu + 10% Khoáng vô cơ & sắc tố di sản",
          density: "1.4 g/cm³",
          development: "Thiết kế hoa văn rỗng thông gió chủ động, giảm nhiệt độ phòng đến 3-4°C."
        }
      }
    ]
  },
  en: {
    title: "Digital Library ",
    titleHighlight: "R&D Specimens",
    subtitle: "Explore detailed technical data of RENOVA specimen generations, certified under strict mechanical strength, thermal shielding and environmental tests.",
    viewSpecs: "View Specifications",
    close: "Close",
    compressiveLabel: "Compressive Strength",
    absorptionLabel: "Water Absorption",
    uvLabel: "UV Resistance Test",
    compositionLabel: "Mixture Composition:",
    densityLabel: "Material Density:",
    samples: [
      {
        title: "Base Composite Specimen",
        generation: "Generation 1 (Lab Phase)",
        summary: "Core composite base integrating recycled multi-layer plastic polymer with raw husk fiber for load-bearing foundation.",
        specs: {
          compressive: "5.5 - 6.5 MPa",
          absorption: "< 2.5%",
          uv: "SGS 500-hour UV chamber test certified",
          composition: "50% Multi-Layer Plastic (MLP) + 50% Rice Husk Cellulose Fibers",
          density: "1.2 g/cm³",
          development: "Basic molecular cellular bond structures research."
        }
      },
      {
        title: "Solid Brick Specimen V16",
        generation: "Generation 2 (Pilot Phase)",
        summary: "Semi-solid block optimized for perimeter load walls, amplifying thermal & acoustic shielding.",
        specs: {
          compressive: "6.8 - 7.5 MPa",
          absorption: "< 1.8%",
          uv: "Premium UV resistance certification (ASTM G154)",
          composition: "60% MLP Plastic + 40% Rice Husk and cross-linking additives",
          density: "1.35 g/cm³",
          development: "Twice the compressive endurance of ordinary autoclaved aerated concrete."
        }
      },
      {
        title: "Heritage Breeze Block",
        generation: "Generation 3 (Commercialization)",
        summary: "Iconic East Asian heritage breeze block hollow design, fostering natural ventilation.",
        specs: {
          compressive: "7.8 - 8.2 MPa",
          absorption: "< 1.2%",
          uv: "Colorfast under direct sunlight (10-year outdoor warranty)",
          composition: "45% MLP Plastic + 45% Rice Husk + 10% Inorganic minerals & heritage pigments",
          density: "1.4 g/cm³",
          development: "Hollow aerodynamic ventilation design, actively lowering indoor temperatures by 3-4°C."
        }
      }
    ]
  }
};

export default function RdShowcase({ lang }: RdShowcaseProps) {
  const [selectedSample, setSelectedSample] = useState<number | null>(null);
  const t = translations[lang];

  const samples = [
    {
      id: 0,
      title: t.samples[0].title,
      generation: t.samples[0].generation,
      image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=600",
      icon: <Layers size={24} />,
      summary: t.samples[0].summary,
      specs: t.samples[0].specs
    },
    {
      id: 1,
      title: t.samples[1].title,
      generation: t.samples[1].generation,
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600",
      icon: <Activity size={24} />,
      summary: t.samples[1].summary,
      specs: t.samples[1].specs
    },
    {
      id: 2,
      title: t.samples[2].title,
      generation: t.samples[2].generation,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600",
      icon: <Compass size={24} />,
      summary: t.samples[2].summary,
      specs: t.samples[2].specs
    }
  ];

  return (
    <section id="thu-vien-rd" className="relative">
      <div className="container">
        <h2 className="section-title">
          {t.title}
          <span className="gradient-text">{t.titleHighlight}</span>
        </h2>
        <p className="section-subtitle">
          {t.subtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {samples.map((sample) => (
            <div 
              key={sample.id}
              className="glass-card !p-0 overflow-hidden flex flex-col"
            >
              {/* Image Banner */}
              <div className="w-full h-[200px] relative overflow-hidden">
                <img 
                  src={sample.image} 
                  alt={sample.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-108"
                />
                <div className="absolute top-4 left-4 bg-zinc-900/75 border border-white/10 px-3 py-1 rounded-full text-xs text-brand-primary font-semibold">
                  {sample.generation}
                </div>
              </div>

              {/* Content body */}
              <div className="p-7 flex flex-col gap-4 flex-grow">
                <div className="flex items-center gap-3">
                  <div className="text-brand-primary">{sample.icon}</div>
                  <h3 className="text-xl">{sample.title}</h3>
                </div>
                
                <p className="text-brand-text-muted text-sm leading-relaxed flex-grow">
                  {sample.summary}
                </p>

                <button 
                  onClick={() => setSelectedSample(sample.id)}
                  className="btn-secondary w-full py-2.5 justify-center text-sm dark:text-white"
                >
                  <Info size={16} />
                  {t.viewSpecs}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Spec Pop-up Modal */}
        {selectedSample !== null && (
          <div 
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedSample(null);
              }
            }}
            className="fixed inset-0 w-full h-full bg-black/80 backdrop-blur-md z-[1000] flex items-center justify-center p-6"
          >
            <div 
              className="glass-card max-w-xl w-full p-9 relative animate-float border border-brand-primary/20 bg-zinc-950/95 text-white"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedSample(null)}
                className="absolute top-5 right-5 bg-transparent border-none text-brand-text-muted hover:text-white cursor-pointer"
              >
                <X size={24} />
              </button>

              <h3 className="text-2xl font-bold mb-1 text-white">
                {samples[selectedSample].title}
              </h3>
              <p className="text-brand-primary text-xs font-bold mb-6">
                {samples[selectedSample].generation}
              </p>

              {/* Specs List */}
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/2 border border-white/4 p-3 rounded-lg">
                    <p className="text-xs text-brand-text-muted">{t.compressiveLabel}</p>
                    <p className="text-lg font-bold text-white">
                      {samples[selectedSample].specs.compressive}
                    </p>
                  </div>
                  <div className="bg-white/2 border border-white/4 p-3 rounded-lg">
                    <p className="text-xs text-brand-text-muted">{t.absorptionLabel}</p>
                    <p className="text-lg font-bold text-white">
                      {samples[selectedSample].specs.absorption}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-center bg-brand-primary/5 p-3.5 rounded-lg border border-brand-primary/10">
                  <ShieldCheck size={20} className="text-brand-primary" />
                  <div>
                    <p className="text-xs text-brand-text-muted">{t.uvLabel}</p>
                    <p className="text-sm font-semibold text-white">
                      {samples[selectedSample].specs.uv}
                    </p>
                  </div>
                </div>

                <div className="text-sm border-t border-white/8 pt-4 flex flex-col gap-1.5">
                  <p>
                    <span className="text-brand-text-muted">{t.compositionLabel}</span>{" "}
                    <strong className="text-white">{samples[selectedSample].specs.composition}</strong>
                  </p>
                  <p>
                    <span className="text-brand-text-muted">{t.densityLabel}</span>{" "}
                    <strong className="text-white">{samples[selectedSample].specs.density}</strong>
                  </p>
                  <p className="leading-relaxed mt-3 text-brand-text-muted italic">
                    {samples[selectedSample].specs.development}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedSample(null)}
                className="btn-primary w-full mt-6 justify-center"
              >
                {t.close}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
