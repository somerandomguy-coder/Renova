"use client";

import React, { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { Calculator, ArrowRight, Activity, Percent, Sparkles, TrendingUp } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface EsgCalculatorProps {
  lang: "vi" | "en";
}

const translations = {
  vi: {
    title: "Bộ công cụ Tính toán ",
    titleHighlight: "ESG & EPR",
    subtitle: "Số hóa các mô hình kinh tế tuần hoàn để đưa ra dự đoán trực quan về tác động sinh thái và lợi ích tài chính thực tế khi đồng hành cùng RENOVA.",
    envTitle: "Dự đoán Tác động Môi trường",
    modeBricks: "Nhập số lượng gạch",
    modeArea: "Nhập diện tích lắp đặt",
    labelBricks: "Số lượng gạch RENOVA dự kiến",
    labelArea: "Diện tích bề mặt thi công (m²)",
    convertEquivalent: "Quy đổi tương đương: ~ {bricks} viên gạch",
    ratioLabel: "Tỷ lệ phối trộn nguyên liệu",
    ratioDesc: "{plastic}% Nhựa / {husk}% Trấu",
    treesLabel: "Cây xanh tương đương / năm",
    treesUnit: "cây",
    co2Label: "Khí nhà kính CO2 cắt giảm",
    co2Unit: "kg",
    rawCompositeTitle: "Cấp phối nhựa đa lớp thô",
    rawCompositeDesc: "Nhựa composite được gia cường bởi sợi thực vật vỏ trấu.",
    eprTitle: "EPR Cashflow Engine (Tối ưu đóng phí EPR)",
    labelPkg: "Lượng bao bì MLP doanh nghiệp thải ra thị trường (kg/năm)",
    labelPrice: "Giá bán gạch dự kiến (VND/viên)",
    eprSavingsLabel: "Dòng tiền tiết kiệm trực tiếp từ Quỹ EPR",
    eprSavingsDesc: "Giảm 40% nghĩa vụ đóng phí bảo vệ môi trường",
    standardEprLabel: "Phí EPR tiêu chuẩn:",
    optimizedEprLabel: "Lệ phí sau tối ưu:",
    analysisTitle: "Bảng Phân Tích Mua Sản Phẩm Bù Trừ EPR",
    netCostLabel: "Chi phí thực tế mua gạch sau khấu hao bù trừ EPR",
    netCostDesc: "Được Quỹ EPR tài trợ hoàn lại {pct}% chi phí vật tư!",
    bricksOffsetLabel: "Số gạch cần mua offset:",
    bricksUnit: " viên",
    grossCostLabel: "Chi phí gạch gốc:",
    footerDesc: "Nhờ cơ chế bù trừ nghĩa vụ nộp quỹ EPR, doanh nghiệp thu hồi lại một phần chi phí vật tư khi tái đầu tư gạch bông gió RENOVA vào xây dựng cảnh quan nhà máy hoặc văn phòng.",
    chartMlp: "MLP Giải cứu",
    chartHusk: "Vỏ trấu tiêu thụ",
    chartCo2: "CO2 Cắt giảm",
    pieMlp: "Nhựa MLP",
    pieHusk: "Vỏ trấu"
  },
  en: {
    title: "ESG & EPR ",
    titleHighlight: "Calculator Hub",
    subtitle: "Digitizing circular economy models to deliver visual predictions of ecological impact and actual financial benefits when partnering with RENOVA.",
    envTitle: "Environmental Impact Prediction",
    modeBricks: "Enter Brick Quantity",
    modeArea: "Enter Installation Area",
    labelBricks: "Estimated RENOVA Bricks",
    labelArea: "Installation Surface Area (m²)",
    convertEquivalent: "Equivalent conversion: ~ {bricks} bricks",
    ratioLabel: "Raw Material Mixture Ratio",
    ratioDesc: "{plastic}% Plastic / {husk}% Rice Husk",
    treesLabel: "Equivalent Trees / Year",
    treesUnit: "trees",
    co2Label: "Greenhouse Gas CO2 Reduced",
    co2Unit: "kg",
    rawCompositeTitle: "Raw Multi-Layer Plastic Mix",
    rawCompositeDesc: "Composite polymer reinforced by natural rice husk cellulose fibers.",
    eprTitle: "EPR Cashflow Engine (EPR Fee Optimization)",
    labelPkg: "Annual MLP packaging released to market (kg/year)",
    labelPrice: "Estimated brick price (VND/piece)",
    eprSavingsLabel: "Direct Savings Cashflow from EPR Fund",
    eprSavingsDesc: "40% reduction in environmental fee obligations",
    standardEprLabel: "Standard EPR Fee:",
    optimizedEprLabel: "Optimized EPR Fee:",
    analysisTitle: "EPR Offset Purchase Analysis",
    netCostLabel: "Net Brick Purchase Cost After EPR Offset",
    netCostDesc: "EPR Fund offsets {pct}% of material cost!",
    bricksOffsetLabel: "Bricks needed to fully offset:",
    bricksUnit: " bricks",
    grossCostLabel: "Gross material cost:",
    footerDesc: "Through the EPR obligation offset mechanism, enterprises recoup a portion of material expenditures by reinvesting in RENOVA breeze blocks for factory or office landscaping.",
    chartMlp: "MLP Rescued",
    chartHusk: "Husk Consumed",
    chartCo2: "CO2 Reduced",
    pieMlp: "MLP Plastic",
    pieHusk: "Rice Husk"
  }
};

export default function EsgCalculator({ lang }: EsgCalculatorProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isChartVisible, setIsChartVisible] = useState(false);
  const t = translations[lang];

  // ESG Calculator States
  const [numBricks, setNumBricks] = useState<number>(1000);
  const [inputMode, setInputMode] = useState<"bricks" | "area">("bricks");
  const [surfaceArea, setSurfaceArea] = useState<number>(40);
  const [plasticRatio, setPlasticRatio] = useState<number>(50);
  const [esgResult, setEsgResult] = useState({
    mlp_rescued_kg: 750,
    husk_consumed_kg: 750,
    co2_reduced_kg: 2362.5,
    trees_equivalent: 107.4
  });

  // EPR Cashflow States
  const [pkgVolume, setPkgVolume] = useState<number>(5000); // Annual packaging weight (kg)
  const [brickPrice, setBrickPrice] = useState<number>(45000); // 45k VND per brick
  const [eprResult, setEprResult] = useState({
    standard_epr_fee_vnd: 75000000,
    optimized_epr_fee_vnd: 45000000,
    epr_savings_vnd: 30000000,
    renova_bricks_needed: 6667,
    total_brick_cost_vnd: 300015000,
    net_cost_after_epr_offset_vnd: 225015000,
    net_savings_percentage: 25.0
  });

  // Sync inputs
  useEffect(() => {
    if (inputMode === "area") {
      // 1 m2 surface area needs approx 25 standard breeze bricks (size 19x19x6.5 cm)
      setNumBricks(Math.round(surfaceArea * 25));
    }
  }, [surfaceArea, inputMode]);

  // Fetch or calculate ESG Impact
  const fetchEsgCalculations = async (bricks: number, pRatio: number) => {
    const hRatio = 100 - pRatio;
    try {
      const response = await fetch("http://localhost:8000/api/v1/calculate/esg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ num_bricks: bricks, plastic_ratio: pRatio, husk_ratio: hRatio })
      });
      if (response.ok) {
        const data = await response.json();
        setEsgResult(data);
      } else {
        throw new Error("API call failed");
      }
    } catch (e) {
      // Fallback local calculations if backend is offline
      const weight = 1.5;
      const mlp = bricks * (pRatio / 100) * weight;
      const husk = bricks * (hRatio / 100) * weight;
      const co2 = (mlp * 1.95) + (husk * 1.20);
      setEsgResult({
        mlp_rescued_kg: parseFloat(mlp.toFixed(2)),
        husk_consumed_kg: parseFloat(husk.toFixed(2)),
        co2_reduced_kg: parseFloat(co2.toFixed(2)),
        trees_equivalent: parseFloat((co2 / 22).toFixed(1))
      });
    }
  };

  // Fetch or calculate EPR Cashflow
  const fetchEprCalculations = async (volume: number, price: number) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/calculate/epr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packaging_volume_kg: volume, brick_price_vnd: price })
      });
      if (response.ok) {
        const data = await response.json();
        setEprResult(data);
      } else {
        throw new Error("API call failed");
      }
    } catch (e) {
      // Fallback local calculations
      const standardFee = volume * 15000; // 15,000 VND / kg Fs norm
      const optimizedFee = standardFee * 0.60;
      const savings = standardFee - optimizedFee;
      const bricksNeeded = Math.ceil(volume / 0.75); // 0.75kg plastic per brick
      const totalCost = bricksNeeded * price;
      const netCost = totalCost - standardFee;
      const savingsPct = totalCost > 0 ? (standardFee / totalCost) * 100 : 0;
      setEprResult({
        standard_epr_fee_vnd: standardFee,
        optimized_epr_fee_vnd: optimizedFee,
        epr_savings_vnd: savings,
        renova_bricks_needed: bricksNeeded,
        total_brick_cost_vnd: totalCost,
        net_cost_after_epr_offset_vnd: netCost,
        net_savings_percentage: parseFloat(Math.min(savingsPct, 100).toFixed(2))
      });
    }
  };

  // Intersection Observer to trigger chart columns grow animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsChartVisible(true);
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Recalculate on inputs change
  useEffect(() => {
    fetchEsgCalculations(numBricks, plasticRatio);
  }, [numBricks, plasticRatio]);

  useEffect(() => {
    fetchEprCalculations(pkgVolume, brickPrice);
  }, [pkgVolume, brickPrice]);

  // Chart data formatting (starts at 0 values and animates when visible on scroll)
  const chartData = isChartVisible ? [
    { name: t.chartMlp, value: esgResult.mlp_rescued_kg, unit: "kg", color: "#914724" },
    { name: t.chartHusk, value: esgResult.husk_consumed_kg, unit: "kg", color: "#b45309" },
    { name: t.chartCo2, value: esgResult.co2_reduced_kg, unit: "kg", color: "#fbbf24" }
  ] : [
    { name: t.chartMlp, value: 0, unit: "kg", color: "#914724" },
    { name: t.chartHusk, value: 0, unit: "kg", color: "#b45309" },
    { name: t.chartCo2, value: 0, unit: "kg", color: "#fbbf24" }
  ];

  const pieData = [
    { name: t.pieMlp, value: plasticRatio, color: "#914724" },
    { name: t.pieHusk, value: 100 - plasticRatio, color: "#b45309" }
  ];

  // Helper format currency
  const formatCurrency = (value: number) => {
    const locale = lang === "vi" ? "vi-VN" : "en-US";
    return new Intl.NumberFormat(locale, { style: "currency", currency: "VND" }).format(value);
  };

  const formatNumber = (value: number) => {
    const locale = lang === "vi" ? "vi-VN" : "en-US";
    return value.toLocaleString(locale);
  };

  return (
    <section id="tinh-toan" ref={sectionRef} className="relative">
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

        <div className="grid grid-cols-1 gap-12">
          
          {/* TAB 1: ESG ENVIRONMENTAL CALCULATOR */}
          <div className="glass-card grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            
            {/* Input Controls */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <Calculator className="text-brand-primary" />
                <h3 className="text-2xl font-bold">{t.envTitle}</h3>
              </div>

              {/* Mode Toggle */}
              <div className="flex bg-white/2 p-1 rounded-xl border border-white/5">
                <button 
                  onClick={() => setInputMode("bricks")}
                  className="flex-1 py-2 border-none rounded-lg cursor-pointer font-semibold transition-all duration-300"
                  style={{
                    background: inputMode === "bricks" ? "var(--color-brand-primary)" : "transparent",
                    color: inputMode === "bricks" ? "#fff" : "var(--color-brand-text-muted)"
                  }}
                >
                  {t.modeBricks}
                </button>
                <button 
                  onClick={() => setInputMode("area")}
                  className="flex-1 py-2 border-none rounded-lg cursor-pointer font-semibold transition-all duration-300"
                  style={{
                    background: inputMode === "area" ? "var(--color-brand-primary)" : "transparent",
                    color: inputMode === "area" ? "#fff" : "var(--color-brand-text-muted)"
                  }}
                >
                  {t.modeArea}
                </button>
              </div>

              {/* Dynamic input fields */}
              {inputMode === "bricks" ? (
                <div>
                  <label className="text-sm text-brand-text-muted block mb-2">{t.labelBricks}</label>
                  <input 
                    type="number" 
                    value={numBricks}
                    onChange={(e) => setNumBricks(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-bg-card text-brand-text-primary outline-none text-base"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-sm text-brand-text-muted block mb-2">{t.labelArea}</label>
                  <input 
                    type="number" 
                    value={surfaceArea}
                    onChange={(e) => setSurfaceArea(Math.max(1, parseFloat(e.target.value) || 0))}
                    className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-bg-card text-brand-text-primary outline-none text-base"
                  />
                  <p className="text-xs text-brand-text-muted mt-1.5">{t.convertEquivalent.replace("{bricks}", formatNumber(numBricks))}</p>
                </div>
              )}

              {/* Slider for plastic ratio */}
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-brand-text-muted">{t.ratioLabel}</span>
                  <span className="font-bold">{t.ratioDesc.replace("{plastic}", plasticRatio.toString()).replace("{husk}", (100 - plasticRatio).toString())}</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="80" 
                  value={plasticRatio}
                  onChange={(e) => setPlasticRatio(parseInt(e.target.value))}
                  className="w-full accent-brand-primary bg-brand-border h-1.5 rounded-lg outline-none cursor-pointer"
                />
              </div>

              {/* Calculated Outputs Numbers */}
              <ScrollReveal animation="scale-in" duration={500} delay={100}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div className="p-4 rounded-xl bg-white/2 border border-white/3">
                    <p className="text-xs text-brand-text-muted">{t.treesLabel}</p>
                    <p className="text-3xl font-extrabold text-brand-primary">
                      {formatNumber(esgResult.trees_equivalent)} <span className="text-sm font-medium text-brand-text-muted">{t.treesUnit}</span>
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/2 border border-white/3">
                    <p className="text-xs text-brand-text-muted">{t.co2Label}</p>
                    <p className="text-3xl font-extrabold text-[#fbbf24]">
                      {formatNumber(esgResult.co2_reduced_kg)} <span className="text-sm font-medium text-brand-text-muted">{t.co2Unit}</span>
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Graphics Column */}
            <ScrollReveal animation="scale-in" duration={600} delay={200} className="h-full flex flex-col justify-center gap-5 min-w-0">
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart key={isChartVisible ? "visible" : "hidden"} data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="var(--color-brand-text-muted)" fontSize={11} tickLine={false} />
                    <YAxis stroke="var(--color-brand-text-muted)" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "rgba(17, 21, 19, 0.9)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex items-center gap-4 bg-white/2 p-4 rounded-xl">
                <div className="flex-grow">
                  <p className="text-sm font-semibold mb-1">{t.rawCompositeTitle}</p>
                  <p className="text-xs text-brand-text-muted">{t.rawCompositeDesc}</p>
                </div>
                <div className="w-[70px] h-[70px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={15}
                        outerRadius={28}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </ScrollReveal>

          </div>

          {/* TAB 2: EPR CASHFLOW ENGINE */}
          <div className="glass-card grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            
            {/* Input Controls */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <TrendingUp className="text-brand-primary" />
                <h3 className="text-2xl font-bold">{t.eprTitle}</h3>
              </div>

              <div>
                <label className="text-sm text-brand-text-muted block mb-2">
                  {t.labelPkg}
                </label>
                <input 
                  type="number" 
                  value={pkgVolume}
                  onChange={(e) => setPkgVolume(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-bg-card text-brand-text-primary outline-none text-base"
                />
              </div>

              <div>
                <label className="text-sm text-brand-text-muted block mb-2">
                  {t.labelPrice}
                </label>
                <input 
                  type="number" 
                  step="5000"
                  value={brickPrice}
                  onChange={(e) => setBrickPrice(Math.max(1000, parseInt(e.target.value) || 0))}
                  className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-bg-card text-brand-text-primary outline-none text-base"
                />
              </div>

              <ScrollReveal animation="scale-in" duration={500} delay={100}>
                <div className="flex flex-col gap-3">
                  {/* Savings Summary Box */}
                  <div className="bg-brand-primary/8 p-5 rounded-xl border border-brand-primary/20 text-center">
                    <p className="text-xs text-brand-text-muted mb-1">
                      {t.eprSavingsLabel}
                    </p>
                    <p className="text-3xl font-extrabold text-brand-primary my-1">
                      - {formatCurrency(eprResult.epr_savings_vnd)}
                    </p>
                    <p className="text-xs text-brand-primary font-semibold">
                      {t.eprSavingsDesc}
                    </p>
                  </div>

                  {/* Smaller details */}
                  <div className="grid grid-cols-2 gap-3 px-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] text-brand-text-muted">{t.standardEprLabel}</span>
                      <span className="text-sm font-semibold text-red-400">{formatCurrency(eprResult.standard_epr_fee_vnd)}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] text-brand-text-muted">{t.optimizedEprLabel}</span>
                      <span className="text-sm font-semibold text-brand-primary">{formatCurrency(eprResult.optimized_epr_fee_vnd)}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Calculations Analysis Result Column */}
            <ScrollReveal animation="scale-in" duration={600} delay={200} className="flex flex-col gap-5">
              <h4 className="text-base text-brand-primary flex items-center gap-2 font-heading">
                <Sparkles size={16} /> {t.analysisTitle}
              </h4>

              <div className="flex flex-col gap-4">
                {/* Net Cost Highlight Box */}
                <div className="bg-gradient-to-br from-brand-primary/12 to-brand-secondary/12 border border-brand-primary/25 p-6 rounded-xl text-center">
                  <p className="text-xs text-brand-text-muted mb-1">
                    {t.netCostLabel}
                  </p>
                  <p className="text-3xl font-extrabold text-brand-text-primary dark:text-white my-1">
                    {formatCurrency(eprResult.net_cost_after_epr_offset_vnd)}
                  </p>
                  <p className="text-xs text-brand-primary font-semibold">
                    {t.netCostDesc.replace("{pct}", formatNumber(eprResult.net_savings_percentage))}
                  </p>
                </div>

                {/* Smaller details */}
                <div className="grid grid-cols-2 gap-3 px-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-brand-text-muted">{t.bricksOffsetLabel}</span>
                    <span className="text-sm font-semibold text-brand-text-primary dark:text-white">{formatNumber(eprResult.renova_bricks_needed)}{t.bricksUnit}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-brand-text-muted">{t.grossCostLabel}</span>
                    <span className="text-sm font-semibold text-brand-text-muted line-through opacity-60">{formatCurrency(eprResult.total_brick_cost_vnd)}</span>
                  </div>
                </div>

                <div className="p-3 px-4 rounded-lg bg-white/1 border border-white/2">
                  <p className="text-xs text-brand-text-muted leading-relaxed">
                    {t.footerDesc}
                  </p>
                </div>
              </div>
            </ScrollReveal>

          </div>

        </div>
      </div>
    </section>
  );
}
