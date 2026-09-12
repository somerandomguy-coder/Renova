"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  Layers, 
  ArrowRight, 
  Check, 
  X, 
  Eye, 
  FileText, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Palette,
  Recycle,
  Flower2
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface ProductShowcaseProps {
  lang: "vi" | "en";
}

interface ProductItem {
  id: string;
  code: string;
  nameVi: string;
  nameEn: string;
  patternVi: string;
  patternEn: string;
  dimensions: string;
  weight: string;
  price: string;
  image: string;
  descriptionVi: string;
  descriptionEn: string;
  specs: {
    labelVi: string;
    labelEn: string;
    val: string;
  }[];
}

const BRICK_PRODUCTS: ProductItem[] = [
  {
    id: "gach-001",
    code: "Mã 001",
    nameVi: "Gạch Bông Gió Khung Đôi Cân Đối",
    nameEn: "Dual-Frame Breeze Block",
    patternVi: "Họa tiết ô chữ nhật đôi",
    patternEn: "Dual rectangular pattern",
    dimensions: "190 x 190 x 65 mm",
    weight: "1.3 kg (-40% so với xi măng)",
    price: "35.000 VNĐ",
    image: "/products/gach1.png",
    descriptionVi: "Thiết kế khe gió hình chữ nhật bất đối xứng hiện đại, tối ưu khả năng hút gió đối lưu và giảm bức xạ nhiệt mặt trời.",
    descriptionEn: "Asymmetric modern rectangular ventilation slot optimizing air convection and solar heat deflection.",
    specs: [
      { labelVi: "Kích thước", labelEn: "Dimensions", val: "190 x 190 x 65 mm" },
      { labelVi: "Trọng lượng", labelEn: "Weight", val: "1.3 kg / viên" },
      { labelVi: "Thành phần", labelEn: "Composition", val: "50% Nhựa MLP + 50% Vỏ trấu" },
      { labelVi: "Chống thấm", labelEn: "Water absorption", val: "< 0.5% (Không rêu mốc)" }
    ]
  },
  {
    id: "gach-002",
    code: "Mã 002",
    nameVi: "Gạch Bông Gió Vòng Tròn Đồng Tâm",
    nameEn: "Concentric Circle Breeze Block",
    patternVi: "Họa tiết vòng tròn lồng ô vuông",
    patternEn: "Square-framed circle pattern",
    dimensions: "190 x 190 x 65 mm",
    weight: "1.25 kg (-42% so với xi măng)",
    price: "35.000 VNĐ",
    image: "/products/gach2.png",
    descriptionVi: "Họa tiết hình học tròn mang tính kinh điển, lấy sáng tự nhiên 360 độ và tạo hiệu ứng bóng đổ nghệ thuật cho mặt dựng.",
    descriptionEn: "Classic geometric circular aperture offering 360-degree natural daylight and artistic facade shadowing.",
    specs: [
      { labelVi: "Kích thước", labelEn: "Dimensions", val: "190 x 190 x 65 mm" },
      { labelVi: "Trọng lượng", labelEn: "Weight", val: "1.25 kg / viên" },
      { labelVi: "Thành phần", labelEn: "Composition", val: "50% Nhựa MLP + 50% Vỏ trấu" },
      { labelVi: "Cường độ nén", labelEn: "Compressive Strength", val: "16.8 MPa" }
    ]
  },
  {
    id: "gach-003",
    code: "Mã 003",
    nameVi: "Gạch Bông Gió Họa Tiết Chiếc Lá",
    nameEn: "Autumn Maple Leaf Block",
    patternVi: "Họa tiết hoa văn lá phong di sản",
    patternEn: "Heritage leaf motif pattern",
    dimensions: "190 x 190 x 65 mm",
    weight: "1.35 kg (-38% so với xi măng)",
    price: "35.000 VNĐ",
    image: "/products/gach3.png",
    descriptionVi: "Đường nét chiếc lá sinh thái cách điệu mềm mại, tái hiện hồn di sản kiến trúc nhiệt đới trong diện mạo vật liệu xanh tương lai.",
    descriptionEn: "Stylized organic leaf pattern reviving tropical architectural heritage in a future-ready circular material.",
    specs: [
      { labelVi: "Kích thước", labelEn: "Dimensions", val: "190 x 190 x 65 mm" },
      { labelVi: "Trọng lượng", labelEn: "Weight", val: "1.35 kg / viên" },
      { labelVi: "Thành phần", labelEn: "Composition", val: "50% Nhựa MLP + 50% Vỏ trấu" },
      { labelVi: "Độ bền màu", labelEn: "Color fastness", val: "UV Resistant Class A" }
    ]
  },
  {
    id: "gach-004",
    code: "Mã 004",
    nameVi: "Gạch Bông Gió Hình Học Tứ Giác",
    nameEn: "Geometric Quadrant Breeze Block",
    patternVi: "Họa tiết góc vuông & đa giác phối",
    patternEn: "Geometric polygon pattern",
    dimensions: "190 x 190 x 65 mm",
    weight: "1.3 kg (-40% so với xi măng)",
    price: "35.000 VNĐ",
    image: "/products/gach4.png",
    descriptionVi: "Bố cục ô gió đa diện màu hổ phách ấm cúng, phù hợp cho các vách ngăn nội thất, quầy bar và mặt dựng công trình xanh resort.",
    descriptionEn: "Multi-faceted amber layout suited for acoustic interior partitions, feature bars, and resort facades.",
    specs: [
      { labelVi: "Kích thước", labelEn: "Dimensions", val: "190 x 190 x 65 mm" },
      { labelVi: "Trọng lượng", labelEn: "Weight", val: "1.3 kg / viên" },
      { labelVi: "Thành phần", labelEn: "Composition", val: "50% Nhựa MLP + 50% Vỏ trấu" },
      { labelVi: "Cách âm", labelEn: "Sound Insulation", val: "32 dB NRC" }
    ]
  },
  {
    id: "gach-005",
    code: "Mã 005",
    nameVi: "Gạch Bông Gió Mắt Gió Khí Động Học",
    nameEn: "Aerodynamic Eye Breeze Block",
    patternVi: "Họa tiết mắt lượn khí động",
    patternEn: "Curved aerodynamic flow",
    dimensions: "190 x 190 x 65 mm",
    weight: "1.28 kg (-41% so với xi măng)",
    price: "35.000 VNĐ",
    image: "/products/gach5.png",
    descriptionVi: "Đường cong vát cánh buồm dẫn hướng luồng gió mát tự nhiên xuyên phòng, cản mưa hắt trực diện hiệu quả 95%.",
    descriptionEn: "Aerodynamic sail curve channeling natural airflow through spaces while deflecting 95% of direct driving rain.",
    specs: [
      { labelVi: "Kích thước", labelEn: "Dimensions", val: "190 x 190 x 65 mm" },
      { labelVi: "Trọng lượng", labelEn: "Weight", val: "1.28 kg / viên" },
      { labelVi: "Thành phần", labelEn: "Composition", val: "50% Nhựa MLP + 50% Vỏ trấu" },
      { labelVi: "Chắn mưa hắt", labelEn: "Rain deflection", val: "95% hiệu quả" }
    ]
  }
];

export default function ProductShowcase({ lang }: ProductShowcaseProps) {
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteTargetProduct, setQuoteTargetProduct] = useState<string>("Tất cả mẫu gạch RENOVA");
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    phone: "",
    email: "",
    projectName: "",
    quantity: "",
    productModel: "Mã 001",
    location: "",
    notes: ""
  });

  const isVi = lang === "vi";

  const handleOpenQuoteModal = (productCode?: string) => {
    if (productCode) {
      setQuoteTargetProduct(productCode);
      setQuoteForm(prev => ({ ...prev, productModel: productCode }));
    } else {
      setQuoteTargetProduct(isVi ? "Tất cả mẫu gạch RENOVA" : "All RENOVA Models");
    }
    setIsQuoteModalOpen(true);
    setQuoteSubmitted(false);
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitted(true);
  };

  return (
    <section id="showcase-san-pham" className="light-section py-24 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1720px] mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-10 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal animation="fade-up" duration={700}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-brand-border dark:border-white/10 pb-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary/15 border border-brand-primary/30 text-brand-primary text-xs font-bold uppercase tracking-wider mb-4">
                <Palette size={14} />
                {isVi ? "Bộ Sưu Tập Gạch Bông Gió Tuần Hoàn" : "Circular Breeze Block Collection"}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-text-primary dark:text-white tracking-tight font-heading leading-tight">
                {isVi ? "Showcase Sản Phẩm & " : "Product Showcase & "}
                <span className="text-gradient">
                  {isVi ? "Mẫu Mã Độc Bản" : "Unique Patterns"}
                </span>
              </h2>
              <p className="mt-4 text-brand-text-muted dark:text-zinc-300 text-base sm:text-lg leading-relaxed">
                {isVi 
                  ? "Từng viên gạch bông gió RENOVA là minh chứng sống động của công nghệ ép nhiệt không nung: đồng giá niêm yết 35.000 VNĐ, nhẹ hơn 40% so với gạch xi măng, bền bỉ chống nứt vỡ và không bám rêu mốc."
                  : "Every RENOVA breeze block embodies our zero-firing hot compression: uniform listed price of 35,000 VND, 40% lighter than concrete blocks, non-porous and moss-resistant."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
              <div className="bg-brand-bg-light/80 dark:bg-white/5 border border-brand-border dark:border-white/10 px-5 py-3 rounded-2xl flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-brand-text-muted dark:text-zinc-300">
                  {isVi ? "Đồng giá niêm yết:" : "Listed Uniform Price:"}{" "}
                  <strong className="text-brand-primary font-black text-sm">35.000 VNĐ / viên</strong>
                </span>
              </div>
              <button 
                onClick={() => handleOpenQuoteModal()}
                className="bg-brand-primary hover:bg-brand-secondary text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-brand-primary/25 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText size={16} />
                {isVi ? "Nhận Báo Giá Dự Án" : "Request Project Quote"}
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-20">
          {BRICK_PRODUCTS.map((prod, index) => (
            <ScrollReveal key={prod.id} animation="fade-up" duration={700} delay={index * 100}>
              <div className="group bg-white dark:bg-zinc-900/90 border border-brand-border dark:border-white/10 hover:border-brand-primary/60 shadow-md hover:shadow-2xl rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-brand-primary/10 hover:-translate-y-1.5 h-full">
                
                {/* Product Badge & Code */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="bg-brand-primary/20 text-brand-primary border border-brand-primary/30 text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                      {prod.code}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                      {prod.price}
                    </span>
                  </div>

                  {/* High Quality Product Angle Photo Container */}
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gradient-to-b from-white/5 to-black/30 border border-white/5 p-4 flex items-center justify-center group-hover:border-brand-primary/30 transition-colors">
                    <img 
                      src={prod.image} 
                      alt={isVi ? prod.nameVi : prod.nameEn}
                      className="w-full h-full object-contain filter drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <button 
                      onClick={() => setSelectedProduct(prod)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-white text-xs font-bold backdrop-blur-xs cursor-pointer"
                    >
                      <Eye size={16} />
                      {isVi ? "Xem chi tiết thông số" : "View Specs"}
                    </button>
                  </div>

                  {/* Title & Pattern */}
                  <div className="mt-4">
                    <span className="text-[11px] font-semibold text-brand-primary/90 block uppercase tracking-wider">
                      {isVi ? prod.patternVi : prod.patternEn}
                    </span>
                    <h3 className="font-heading font-black text-lg text-brand-text-primary dark:text-white mt-1 leading-snug">
                      {isVi ? prod.nameVi : prod.nameEn}
                    </h3>
                    <p className="text-xs text-brand-text-muted dark:text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                      {isVi ? prod.descriptionVi : prod.descriptionEn}
                    </p>
                  </div>

                  {/* Quick Specs Pill */}
                  <div className="mt-4 pt-3 border-t border-brand-border/60 dark:border-white/5 flex flex-col gap-1.5 text-[11px] text-brand-text-muted dark:text-zinc-300 font-mono">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{isVi ? "Kích thước:" : "Size:"}</span>
                      <span className="font-semibold text-brand-text-primary dark:text-white">{prod.dimensions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{isVi ? "Trọng lượng:" : "Weight:"}</span>
                      <span className="font-semibold text-emerald-400">{prod.weight}</span>
                    </div>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="mt-5 pt-3">
                  <button 
                    onClick={() => handleOpenQuoteModal(prod.code)}
                    className="w-full bg-brand-bg-dark/5 dark:bg-white/10 hover:bg-brand-primary text-brand-text-primary dark:text-white hover:text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer group-hover:bg-brand-primary"
                  >
                    <span>{isVi ? "Nhận báo giá dự án" : "Get Project Quote"}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Real Architectural Applications Gallery */}
        <ScrollReveal animation="fade-up" duration={700}>
          <div className="bg-white/90 dark:bg-zinc-900/60 border border-brand-border dark:border-white/10 rounded-3xl p-6 sm:p-8 lg:p-10 mb-20 backdrop-blur-xl shadow-lg">
            <div className="max-w-2xl mb-8">
              <span className="text-xs font-bold text-brand-primary uppercase tracking-wider block mb-1">
                {isVi ? "Ứng Dụng Thực Tế" : "Built Applications"}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-brand-text-primary dark:text-white font-heading tracking-tight">
                {isVi ? "Bức Tường Di Sản Xanh Tại Công Trình Thực Tế" : "Green Heritage Wall in Actual Projects"}
              </h3>
              <p className="text-sm text-brand-text-muted dark:text-zinc-300 mt-2">
                {isVi 
                  ? "Sự phối hợp hài hòa giữa các mẫu gạch bông gió RENOVA Mã 001 đến Mã 005 tạo nên diện mạo mặt đứng kiêu sa, thông gió tự nhiên và chống bức xạ nhiệt hoàn hảo."
                  : "Harmonious combinations of RENOVA breeze block patterns create sublime facades, natural ventilation, and effective heat deflection."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 group aspect-4/3 sm:aspect-16/10">
                <img 
                  src="/products/tuong01.png" 
                  alt="RENOVA Green Wall Installation Outdoors"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent flex flex-col justify-end p-6 sm:p-8">
                  <span className="inline-block bg-black/85 backdrop-blur-md px-3 py-1 rounded-full text-emerald-400 font-mono text-xs font-bold uppercase border border-emerald-500/30 mb-2 shadow-md">Mặt đứng ngoài trời • RENOVA Lab</span>
                  <h4 className="text-white font-black text-lg sm:text-xl font-heading mt-1">
                    {isVi ? "Vách Ngăn Thông Gió Biophilic Ngoài Trời" : "Biophilic Outdoor Ventilation Facade"}
                  </h4>
                  <p className="text-zinc-300 text-xs mt-1">
                    {isVi ? "Tích hợp bồn cây xanh tuần hoàn và logo RENOVA đúc nổi đồng khối di sản." : "Integrated circular planter bed with 3D embossed RENOVA emblem."}
                  </p>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-white/10 group aspect-4/3 sm:aspect-16/10">
                <img 
                  src="/products/tuong02.png" 
                  alt="RENOVA Architectural Interior Screen"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent flex flex-col justify-end p-6 sm:p-8">
                  <span className="inline-block bg-black/85 backdrop-blur-md px-3 py-1 rounded-full text-emerald-400 font-mono text-xs font-bold uppercase border border-emerald-500/30 mb-2 shadow-md">Không gian nội thất • Không gian sống xanh</span>
                  <h4 className="text-white font-black text-lg sm:text-xl font-heading mt-1">
                    {isVi ? "Mặt Dựng Lấy Sáng & Chiếu Bóng Nghệ Thuật" : "Artistic Daylight & Shadow Projection Screen"}
                  </h4>
                  <p className="text-zinc-300 text-xs mt-1">
                    {isVi ? "Ánh nắng đổ bóng hoa văn lá phong và ô tròn lãng mạn vào ban ngày, lung linh ánh đèn vào ban đêm." : "Soft daylight casts picturesque maple and circular silhouettes across interior floors."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* SECTION: Dòng Đời Thứ Hai (The Second Life Collection) */}
        <ScrollReveal animation="fade-up" duration={700}>
          <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/40 bg-zinc-950 p-6 sm:p-10 lg:p-12 shadow-2xl">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/10">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                  <Recycle size={14} />
                  {isVi ? "Tái Sinh & Vòng Lặp Tuần Hoàn Mới" : "Regeneration & New Circular Loop"}
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-white font-heading tracking-tight">
                  {isVi ? "Dòng Đời Thứ Hai" : "The Second Life"}
                </h3>
                <p className="text-base sm:text-lg font-semibold text-brand-primary mt-1">
                  The Second Life Collection
                </p>
                <p className="text-zinc-100 text-sm sm:text-base mt-3 leading-relaxed font-medium">
                  {isVi 
                    ? "Thể hiện rõ việc viên gạch cũ được tái sinh thành hình hài mới. Không bỏ phí bất kỳ gram vật liệu nào, gạch sau vòng đời công trình được nghiền vụn và tái tổ hợp thành gạch terrazzo lộng lẫy và chậu cây xanh tuần hoàn."
                    : "Showcasing how worn bricks are reborn into beautiful new forms. Crushed and recombined into lustrous terrazzo tiles and circular planters without wasting a single gram of material."}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-4">
                <button 
                  onClick={() => handleOpenQuoteModal("The Second Life Collection")}
                  className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles size={16} />
                  {isVi ? "Báo Giá Dòng Đời Thứ Hai" : "Quote Second Life Collection"}
                </button>
              </div>
            </div>

            {/* Second Life Items Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
              
              {/* Product 1: Gạch Terrazzo Tái Sinh */}
              <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-center hover:border-emerald-400/40 transition-colors">
                <div className="w-full sm:w-56 aspect-square rounded-xl overflow-hidden shrink-0 border border-white/10 bg-black/40 relative group">
                  <img 
                    src="/products/terrazzo_bricks.jpeg" 
                    alt="RENOVA Terrazzo Bricks" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-emerald-500 text-zinc-950 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                    Terrazzo 40k
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-400">SL-TRZ-01</span>
                      <span className="text-base font-black text-white bg-white/5 px-3 py-1 rounded-full border border-white/10">
                        40.000 VNĐ / viên
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-white font-heading mt-2">
                      {isVi ? "Gạch Terrazzo Tái Chế RENOVA" : "RENOVA Upcycled Terrazzo Tiles"}
                    </h4>
                    <p className="text-xs sm:text-sm text-brand-text-muted dark:text-zinc-300 mt-2 leading-relaxed">
                      {isVi 
                        ? "Được sản xuất từ cốt liệu gạch cũ nghiền mịn hòa quyện cùng trấu và nhựa tái chế bề mặt bóng gương, kháng nước 100%, vân đá terrazzo ngẫu nhiên sang trọng."
                        : "Manufactured from crushed reclaimed blocks blended with rice husk and circular polymers with a lustrous, water-repellent terrazzo finish."}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Kích thước: 300 × 300 × 20 mm</span>
                    <button 
                      onClick={() => handleOpenQuoteModal("Gạch Terrazzo 40k")}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                    >
                      {isVi ? "Đặt hàng ngay" : "Order now"} <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product 2: Chậu Cây Tuần Hoàn */}
              <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-center hover:border-emerald-400/40 transition-colors">
                <div className="w-full sm:w-56 aspect-square rounded-xl overflow-hidden shrink-0 border border-white/10 bg-black/40 relative group flex items-center justify-center p-4">
                  {/* Visual Representation of Eco Planter using Brick Biophilic design */}
                  <img 
                    src="/cups.jpeg" 
                    alt="Chậu Cây Tuần Hoàn Eco-Planter" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-xl"
                  />
                  <div className="absolute top-2 left-2 bg-brand-primary text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                    Chậu Cây 35k
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-brand-primary">SL-PLT-02</span>
                      <span className="text-base font-black text-white bg-white/5 px-3 py-1 rounded-full border border-white/10">
                        35.000 VNĐ / chậu
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-white font-heading mt-2">
                      {isVi ? "Chậu Cây Tuần Hoàn Eco-Planter" : "Circular Eco-Planter Pot"}
                    </h4>
                    <p className="text-xs sm:text-sm text-brand-text-muted dark:text-zinc-300 mt-2 leading-relaxed">
                      {isVi 
                        ? "Thiết kế đúc nguyên khối chống ẩm mốc, bền bỉ ngoài trời trên 15 năm. Hoàn hảo cho ban công căn hộ, quán cafe và không gian xanh trường học."
                        : "Molded monolithic pot resistant to fungal growth and durable outdoors for 15+ years. Ideal for modern balconies, cafes, and campus gardens."}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Dung tích: 2.5L • Siêu nhẹ</span>
                    <button 
                      onClick={() => handleOpenQuoteModal("Chậu Cây 35k")}
                      className="text-xs font-bold text-brand-primary hover:text-brand-secondary flex items-center gap-1 cursor-pointer"
                    >
                      {isVi ? "Đặt hàng ngay" : "Order now"} <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </ScrollReveal>

      </div>

      {/* MODAL: Báo Giá Dự Án (Project Quote Request Modal) */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-zinc-900 border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsQuoteModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>

            {!quoteSubmitted ? (
              <>
                <div className="mb-6">
                  <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                    {isVi ? "Báo Giá Dự Án Nhanh" : "Fast Project Quote"}
                  </span>
                  <h3 className="text-2xl font-black text-white font-heading mt-1">
                    {isVi ? "Yêu Cầu Báo Giá & Mẫu Thử" : "Request Quote & Sample"}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    {isVi 
                      ? `Sản phẩm quan tâm: ${quoteTargetProduct}. Nhận chiết khấu theo khối lượng công trình.`
                      : `Selected item: ${quoteTargetProduct}. Receive bulk tiered discounts for construction projects.`}
                  </p>
                </div>

                <form onSubmit={handleSubmitQuote} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      {isVi ? "Họ tên người liên hệ / Kiến trúc sư *" : "Contact Name / Architect *"}
                    </label>
                    <input 
                      type="text" 
                      required 
                      value={quoteForm.name}
                      onChange={e => setQuoteForm({ ...quoteForm, name: e.target.value })}
                      placeholder={isVi ? "Nguyễn Văn A" : "John Doe"}
                      className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-hidden focus:border-brand-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1">
                        {isVi ? "Số điện thoại liên lạc *" : "Phone Number *"}
                      </label>
                      <input 
                        type="tel" 
                        required 
                        value={quoteForm.phone}
                        onChange={e => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                        placeholder="0912 345 678"
                        className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-hidden focus:border-brand-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1">
                        {isVi ? "Email nhận báo giá *" : "Email Address *"}
                      </label>
                      <input 
                        type="email" 
                        required 
                        value={quoteForm.email}
                        onChange={e => setQuoteForm({ ...quoteForm, email: e.target.value })}
                        placeholder="contact@duan.vn"
                        className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-hidden focus:border-brand-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1">
                        {isVi ? "Mẫu gạch quan tâm" : "Brick Model"}
                      </label>
                      <select 
                        value={quoteForm.productModel}
                        onChange={e => setQuoteForm({ ...quoteForm, productModel: e.target.value })}
                        className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-hidden focus:border-brand-primary"
                      >
                        <option value="Mã 001">Mã 001 - Khung Đôi (35k)</option>
                        <option value="Mã 002">Mã 002 - Vòng Tròn (35k)</option>
                        <option value="Mã 003">Mã 003 - Họa Tiết Lá (35k)</option>
                        <option value="Mã 004">Mã 004 - Hình Học Tứ Giác (35k)</option>
                        <option value="Mã 005">Mã 005 - Mắt Gió Khí Động (35k)</option>
                        <option value="Gạch Terrazzo 40k">Gạch Terrazzo Tái Chế (40k)</option>
                        <option value="Chậu Cây 35k">Chậu Cây Tuần Hoàn (35k)</option>
                        <option value="Hỗn hợp tất cả mẫu">Hỗn hợp tất cả mẫu</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1">
                        {isVi ? "Số lượng ước tính (viên hoặc m²)" : "Estimated Quantity"}
                      </label>
                      <input 
                        type="text" 
                        value={quoteForm.quantity}
                        onChange={e => setQuoteForm({ ...quoteForm, quantity: e.target.value })}
                        placeholder={isVi ? "VD: 500 viên / 25 m²" : "e.g. 500 pcs / 25 m²"}
                        className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-hidden focus:border-brand-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      {isVi ? "Địa điểm công trình / Giao hàng" : "Project / Delivery Location"}
                    </label>
                    <input 
                      type="text" 
                      value={quoteForm.location}
                      onChange={e => setQuoteForm({ ...quoteForm, location: e.target.value })}
                      placeholder={isVi ? "TP. Hồ Chí Minh, Bình Dương, Đà Nẵng..." : "City / Province"}
                      className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-hidden focus:border-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      {isVi ? "Ghi chú thêm (yêu cầu gửi mẫu thực tế, v.v.)" : "Additional Notes"}
                    </label>
                    <textarea 
                      rows={2}
                      value={quoteForm.notes}
                      onChange={e => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                      placeholder={isVi ? "Ghi rõ yêu cầu gửi mẫu gạch đến văn phòng kiến trúc..." : "Specify sample requests..."}
                      className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-hidden focus:border-brand-primary resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <CheckCircle2 size={16} />
                    {isVi ? "Gửi Yêu Cầu Báo Giá Dự Án" : "Submit Quote Request"}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-black text-white font-heading">
                  {isVi ? "Tiếp Nhận Báo Giá Thành Công!" : "Quote Request Received!"}
                </h3>
                <p className="text-sm text-brand-text-muted dark:text-zinc-300 mt-2 max-w-sm mx-auto leading-relaxed">
                  {isVi 
                    ? `Cảm ơn bạn! Đội ngũ RENOVA sẽ gửi bảng báo giá chi tiết và hồ sơ kỹ thuật cho mẫu [${quoteForm.productModel}] qua email ${quoteForm.email} trong vòng 2 giờ làm việc.`
                    : `Thank you! The RENOVA team will send full specifications and bulk pricing for [${quoteForm.productModel}] to ${quoteForm.email} within 2 business hours.`}
                </p>
                <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-zinc-300 text-left">
                  <p>• <strong>{isVi ? "Người nhận:" : "Recipient:"}</strong> {quoteForm.name} ({quoteForm.phone})</p>
                  <p>• <strong>{isVi ? "Số lượng dự kiến:" : "Quantity:"}</strong> {quoteForm.quantity || "Chưa xác định"}</p>
                  <p>• <strong>{isVi ? "Địa điểm:" : "Location:"}</strong> {quoteForm.location || "Đang cập nhật"}</p>
                </div>
                <button 
                  onClick={() => setIsQuoteModalOpen(false)}
                  className="mt-6 bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-colors cursor-pointer"
                >
                  {isVi ? "Đóng cửa sổ" : "Close"}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* MODAL: Chi tiết sản phẩm (Single Product Detail Modal) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-zinc-900 border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/2 aspect-square rounded-2xl bg-black/40 border border-white/10 p-6 flex items-center justify-center">
                <img 
                  src={selectedProduct.image} 
                  alt={isVi ? selectedProduct.nameVi : selectedProduct.nameEn}
                  className="w-full h-full object-contain filter drop-shadow-2xl"
                />
              </div>

              <div className="w-full md:w-1/2">
                <span className="text-xs font-mono font-bold text-brand-primary bg-brand-primary/10 border border-brand-primary/20 px-2.5 py-1 rounded-full uppercase">
                  {selectedProduct.code}
                </span>
                <h3 className="text-2xl font-black text-white font-heading mt-2 leading-tight">
                  {isVi ? selectedProduct.nameVi : selectedProduct.nameEn}
                </h3>
                <p className="text-xl font-black text-emerald-400 mt-2 font-mono">
                  {selectedProduct.price} <span className="text-xs font-normal text-zinc-400">/ viên</span>
                </p>
                <p className="text-xs text-zinc-300 mt-3 leading-relaxed">
                  {isVi ? selectedProduct.descriptionVi : selectedProduct.descriptionEn}
                </p>

                <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 text-xs">
                  {selectedProduct.specs.map((s, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-zinc-400">{isVi ? s.labelVi : s.labelEn}:</span>
                      <span className="font-semibold text-brand-text-primary dark:text-white">{s.val}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex gap-3">
                  <button 
                    onClick={() => {
                      const code = selectedProduct.code;
                      setSelectedProduct(null);
                      handleOpenQuoteModal(code);
                    }}
                    className="flex-1 bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileText size={14} />
                    {isVi ? "Nhận báo giá dự án" : "Request Quote"}
                  </button>
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-3 px-4 rounded-xl transition-colors cursor-pointer"
                  >
                    {isVi ? "Đóng" : "Close"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
