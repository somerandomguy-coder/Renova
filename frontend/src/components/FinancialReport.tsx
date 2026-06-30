"use client";

import React from "react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  CartesianGrid 
} from "recharts";
import ScrollReveal from "./ScrollReveal";

interface FinancialReportProps {
  lang: "vi" | "en";
}

const translations = {
  vi: {
    title: "Thông Tin ",
    titleHighlight: "Tài Chính",
    subtitle: "Dự báo tài chính, hiệu quả đầu tư và lộ trình gọi vốn thực tế cho dây chuyền sản xuất xanh RENOVA.",
    irrBadge: "IRR Dự Kiến",
    paybackBadge: "Hoàn Vốn",
    marketTitle: "1. Quy Mô & Tiềm Năng Thị Trường",
    marketDesc: "Ngành vật liệu xây dựng Việt Nam chuyển đổi xanh mạnh mẽ. Với ngành gạch dự kiến đạt 11,11 tỷ USD vào năm 2029, RENOVA định vị để chiếm lĩnh phân khúc xanh thông qua kinh tế tuần hoàn.",
    marketChartTitle: "Phân Tích Quy Mô Thị Trường (Tỷ USD)",
    marketSource: "Nguồn: Viện Kinh tế Xây dựng & Mordor Intelligence (2025)",
    indicator: "Chỉ số",
    metric: "Định mức / Quy mô",
    formula: "Công thức & Diễn giải",
    citation: "Nguồn trích dẫn",
    aboutMarket: "Quy mô toàn ngành gạch ốp lát Việt Nam. CAGR = 13,64%",
    targetMarket: "Phân khúc vật liệu xây dựng không nung và sinh thái. Tập trung vào > 800 dự án xanh",
    achievedMarket: "SOM = Công suất thiết kế × Hiệu suất (OEE 80%)",
    somDetail: "120.000 viên/năm (Năm 1)",
    saasTitle: "2. RENOVA Smart-Hub: Giải Pháp AI & SaaS",
    saasDesc: "Hệ sinh thái phần mềm song hành, hỗ trợ KTS tối ưu hóa thông gió và các doanh nghiệp FMCG tự động hóa báo cáo tuân thủ EPR.",
    pricingTitle: "Các Mô Hình Giá Đăng Ký",
    tierFree: "Cơ Bản",
    tierPro: "Chuyên Nghiệp",
    tierEnt: "Doanh Nghiệp",
    freeVal: "Miễn phí",
    proVal: "2 triệu VND / dự án",
    entVal: "50 triệu VND / năm",
    freeFeatures: ["Thư Viện Vật Liệu", "Mô Phỏng AI Cơ Bản", "Xuất File Tiêu Chuẩn"],
    proFeatures: ["CFD AI Nâng Cao", "Hồ Sơ Kỹ Thuật Chứng Nhận", "Hỗ Trợ Ưu Tiên"],
    entFeatures: ["Tự Động Hóa EPR Toàn Diện", "Tích Hợp API ERP", "Chứng Nhận SHA-256"],
    saasCosts: "Cơ Cơ Chi Phí Dịch Vụ SaaS (Mỗi Hợp Đồng)",
    saasGrowth: "Quỹ Đạo Doanh Thu SaaS Phần Mềm (Triệu VND)",
    economicsTitle: "3. Kinh Tế Đơn Vị & Giá Vốn Hàng Bán (COGS)",
    economicsDesc: "Quy trình sản xuất loại bỏ nhựa Epoxy đắt đỏ, ép nhiệt từ rác nhựa MLP và trấu. Mô hình doanh thu kép thu phí từ đối tác FMCG đồng thời bán gạch sinh thái cao cấp. Tính trên quy mô Pilot: Q = 10.000 viên/tháng, 1.5 kg/viên.",
    bomTitle: "Định Mức Nguyên Vật Liệu (BOM) Mỗi Viên Gạch",
    grossMargin: "Biên Lợi Nhuận Gộp",
    brickRev: "Doanh Thu Gạch",
    eprFee: "Phí Dịch Vụ EPR",
    circularAdvantage: "Lợi Thế Tuần Hoàn: Nhựa MLP thô (40%) có chi phí nguyên liệu bằng 0 VND và tạo thu nhập thông qua phí EPR, từ đó giảm hiệu quả mức sàn chi phí.",
    cogsDetailTitle: "Chi Tiết Định Mức Vật Liệu Trực Tiếp (BOM)",
    component: "Thành phần",
    ratio: "Tỷ lệ (%)",
    weight: "Khối lượng",
    unitCost: "Đơn giá",
    costPerBrick: "Chi phí/viên",
    basis: "Nguồn & Căn cứ",
    mlpDesc: "Nhận trực tiếp từ đối tác FMCG (được trả thêm phí EPR)",
    hdpeDesc: "Khảo sát giá thu gom tại Greenpoint / Trạm phế liệu",
    huskDesc: "Đơn giá bao tiêu tại ĐBSCL mùa vụ ổn định",
    peDesc: "Giá hóa chất liên kết công nghiệp nội địa",
    totalBom: "TỔNG CHI PHÍ BOM",
    bomAdv: "Tối ưu chi phí nhờ loại bỏ hoàn toàn keo Epoxy",
    opexTitle: "Chi Phí Vận Hành Hằng Tháng (OPEX)",
    opexTableHead: ["Hạng mục OPEX", "Chi phí hằng tháng", "Diễn giải & Căn cứ"],
    labor: "Nhân công trực tiếp",
    laborDesc: "3 công nhân × 8.000.000 VNĐ/người (vận hành máy trộn, máy ép)",
    utility: "Điện năng & Tiện ích",
    utilityDesc: "Ước tính công suất gia nhiệt duy trì 200°C và máy ép thủy lực",
    rent: "Thuê xưởng & Kho bãi",
    rentDesc: "Diện tích ~150m² tại vành đai công nghiệp phụ trợ (Hóc Môn, Bình Dương)",
    treatment: "Chi phí xử lý thô EPR",
    treatmentDesc: "Logistics và băm nghiền 6.000 kg MLP × 1.500 VNĐ/kg",
    depreciation: "Khấu hao thiết bị",
    depreciationDesc: "Khấu hao đường thẳng: CapEx 260tr chia đều trong 60 tháng",
    totalOpex: "TỔNG OPEX THÁNG",
    cogsGpTitle: "Giá Vốn Hàng Bán (COGS) & Lợi Nhuận Gộp (GP)",
    totalCogs: "Tổng Giá vốn (COGS)",
    brickSales: "Doanh thu Bán gạch",
    eprSales: "Doanh thu Dịch vụ EPR",
    totalRev: "Tổng Doanh Thu (TR)",
    totalCost: "Tổng Chi phí SX (TC)",
    grossProfit: "Lợi nhuận Gộp (GP)",
    cogsDetailVal: "16.258 VNĐ/viên (BOM + OPEX/Q)",
    brickSalesVal: "300.000.000 VNĐ (10.000 viên × 30.000 VNĐ)",
    eprSalesVal: "28.800.000 VNĐ (6.000 kg MLP × 4.800 VNĐ)",
    healthTitle: "4. Sức Khỏe Doanh Nghiệp & Chỉ Số Khách Hàng",
    healthDesc: "Tính bền vững của mô hình B2B/SaaS được chứng minh qua tỷ lệ LTV:COCA. Giữ chân cao từ các thương hiệu FMCG tạo ra giá trị trọn đời cực lớn.",
    ratioTitle: "Tỷ Lệ LTV:COCA",
    ltvDesc: "Nhà thầu xây dựng mua lặp lại 15k viên/năm, hoặc hãng FMCG duy trì gói SaaS EPR trong 3 năm.",
    cocaDesc: "Ngân sách Marketing/Sales B2B ~30tr/tháng. Năm 1 tốn 360tr để chốt được 10 khách hàng lớn.",
    ratioDesc: "Tỷ lệ > 3:1 chứng minh mô hình kinh doanh B2B/SaaS của RENOVA phát triển cực kỳ bền vững.",
    growthTitle: "5. Dự Báo Tăng Trưởng & Chỉ Số Đầu Tư",
    growthDesc: "Việc chuyển đổi từ sản xuất phần cứng sang mô hình SaaS lai (Smart-Hub AI) cho phép tăng trưởng doanh thu theo cấp số nhân, đồng thời duy trì cơ cấu chi phí tinh gọn.",
    y5Rev: "Doanh Thu Năm 5",
    cumCash: "Tiền Mặt Lũy Kế",
    npvProj: "NPV Dự Kiến (r=20%)",
    saasClients: "Khách Hàng SaaS (Năm 5)",
    taxNote: "Đơn vị: Triệu VNĐ. Giả định thuế TNDN = 0% nhờ ưu đãi Doanh nghiệp Xanh theo Nghị định 08/2022/NĐ-CP.",
    cashflowTable: ["Hạng mục", "Năm 0", "Năm 1", "Năm 2", "Năm 3", "Năm 4", "Năm 5"],
    volBricks: "Sản lượng gạch (viên)",
    numClients: "Khách hàng SaaS (FMCG)",
    cogsRow: "Chi phí SX (COGS)",
    marketingRow: "Chi phí Marketing & Quản lý",
    capexRow: "Đầu tư TSCĐ (CapEx)",
    netCashflow: "Dòng tiền Thuần (CFt)",
    cumCashflow: "Dòng tiền Tích lũy",
    noteY0: "Ghi chú Năm 0: Bao gồm 260tr CapEx (2 máy ép, 2 bồn trộn, 1 máy băm) + 240tr Vốn R&D/Lưu động.",
    npvValue: "17.652 Triệu VNĐ",
    npvDesc: "NPV > 0 — dự án tạo ra giá trị thặng dư cực lớn cho cổ đông.",
    irrValue: "254%",
    irrDesc: "Chỉ số IRR bứt phá nhờ đòn bẩy tài chính từ mô hình SaaS phần mềm EPR và chi phí vật liệu đầu vào siêu thấp.",
    ppValue: "≈ 5 Tháng",
    ppDesc: "Chỉ mất khoảng 5 tháng vận hành thương mại để thu hồi toàn bộ 500 triệu VNĐ đầu tư ban đầu.",
    fundingTitle: "6. Đề Xuất Gọi Vốn & Sử Dụng Vốn",
    fundingAsk: "RENOVA kêu gọi 1.000.000.000 VNĐ đổi lấy 10% cổ phần (Định giá Pre-money: 9 tỷ VNĐ). Nguồn vốn phân chia giữa nhà xưởng và R&D AI.",
    totalFunding: "Tổng Gọi Vốn",
    sharesAsk: "Cổ Phần Đề Xuất",
    postMoneyVal: "Định Giá Sau Vốn",
    useOfFunds: "Kế Hoạch Sử Dụng Vốn (Use of Funds)",
    usePilotTitle: "Thiết Lập Cụm Sản Xuất Pilot (30%)",
    usePilotDesc: "Đầu tư 2 máy ép tự động, 2 bồn gia nhiệt 200°C, 1 máy băm nghiền thô và khuôn mẫu.",
    useAiTitle: "R&D AI & Pháp Lý Chứng Nhận (20%)",
    useAiDesc: "Nghiên cứu dải nhiệt độ tối ưu. Đăng ký kiểm định TCVN tại Quatest 3. Phát triển lõi AI CFD.",
    useMktTitle: "Marketing B2B & Phát Triển Thị Trường (20%)",
    useMktDesc: "Tổ chức Tech-Talk cho giới KTS, tặng gạch mẫu. Chi phí tiếp cận các tập đoàn FMCG.",
    useCapTitle: "Vốn Lưu Động (30%)",
    useCapDesc: "Duy trì dòng tiền chi trả lương và chi phí vận hành trong 6 tháng đầu.",
    timelineTitle: "7. Lộ Trình Chiến Lược & Triển Khai",
    step1Title: "Thiết Lập Pilot",
    step1Desc: "Xây dựng cụm ép 2 máy và chứng nhận Quatest 3.",
    step2Title: "R&D Lõi AI",
    step2Desc: "Phát triển Mô Hình Đại Diện cho mô phỏng luồng khí CFD.",
    step3Title: "Tiếp Cận B2B",
    step3Desc: "Kết nối hơn 10 kiến trúc sư và 3 thương hiệu FMCG thử nghiệm.",
    step4Title: "Hòa Vốn",
    step4Desc: "Đạt lợi nhuận hoạt động trong vòng 6 tháng đầu."
  },
  en: {
    title: "Financial ",
    titleHighlight: "Information",
    subtitle: "Financial projections, investment efficiency, and fundraising roadmap for RENOVA's green production line.",
    irrBadge: "Expected IRR",
    paybackBadge: "Payback Period",
    marketTitle: "1. Market Scale & Potential",
    marketDesc: "Vietnam's construction material industry is undergoing green transformation. With the brick market projected to reach $11.11B by 2029, RENOVA is positioned to capture the green segment via circular economy principles.",
    marketChartTitle: "Market Scale Analysis (Billion USD)",
    marketSource: "Source: Construction Economics Institute & Mordor Intelligence (2025)",
    indicator: "Metric",
    metric: "Scale / Value",
    formula: "Formula & Explanation",
    citation: "Source / Citation",
    aboutMarket: "Total scale of Vietnam's tiling brick industry. CAGR = 13.64%",
    targetMarket: "Ecological and non-baked building materials segment. Target > 800 green projects",
    achievedMarket: "SOM = Design Capacity × Design Efficiency (OEE 80%)",
    somDetail: "120,000 bricks/year (Year 1)",
    saasTitle: "2. RENOVA Smart-Hub: AI & SaaS Solutions",
    saasDesc: "Co-existing software ecosystem helping architects optimize ventilation and FMCG companies automate EPR compliance reporting.",
    pricingTitle: "Subscription Pricing Models",
    tierFree: "Basic",
    tierPro: "Professional",
    tierEnt: "Enterprise",
    freeVal: "Free",
    proVal: "2M VND / project",
    entVal: "50M VND / year",
    freeFeatures: ["Material Library", "Basic AI Simulations", "Standard File Export"],
    proFeatures: ["Advanced CFD AI", "Certified Technical Reports", "Priority Support"],
    entFeatures: ["Full EPR Automation", "ERP API Integration", "SHA-256 Blockchain Certs"],
    saasCosts: "SaaS Service Cost Structure (Per Contract)",
    saasGrowth: "Software SaaS Revenue Trajectory (Million VND)",
    economicsTitle: "3. Unit Economics & Cost of Goods Sold (COGS)",
    economicsDesc: "Our production process eliminates expensive Epoxy resin, hot pressing raw MLP plastic waste and rice husks. Dual-revenue model charges FMCG partners while selling premium eco-friendly tiles. Pilot scale: Q = 10,000 bricks/month, 1.5 kg/brick.",
    bomTitle: "Direct Material Bill of Materials (BOM) Per Brick",
    grossMargin: "Gross Margin",
    brickRev: "Brick Revenue",
    eprFee: "EPR Service Fee",
    circularAdvantage: "Circular Advantage: Raw MLP plastic (40%) has 0 VND material cost and generates income through EPR fees, effectively lowering the cost floor.",
    cogsDetailTitle: "Direct Material Bill of Materials (BOM) Details",
    component: "Component",
    ratio: "Ratio (%)",
    weight: "Weight",
    unitCost: "Unit Price",
    costPerBrick: "Cost/Brick",
    basis: "Basis & Source",
    mlpDesc: "Directly from FMCG partners (with additional EPR fee)",
    hdpeDesc: "Market survey at local recycling stations",
    huskDesc: "Contract pricing at Mekong Delta, stable seasonal supply",
    peDesc: "Domestic price for industrial coupling agent",
    totalBom: "TOTAL BOM COST",
    bomAdv: "Optimized cost by completely eliminating Epoxy resin",
    opexTitle: "Monthly Operating Expenses (OPEX)",
    opexTableHead: ["OPEX Category", "Monthly Cost", "Explanation & Basis"],
    labor: "Direct Labor",
    laborDesc: "3 workers × 8,000,000 VNĐ/worker (blending, hot pressing)",
    utility: "Electricity & Utilities",
    utilityDesc: "Estimated utility consumption for 200°C heat and hydraulic press",
    rent: "Facility & Warehouse Rent",
    rentDesc: "Approx 150m² inside supporting industrial zones (Hoc Mon, Binh Duong)",
    treatment: "EPR Raw Processing Cost",
    treatmentDesc: "Logistics and shredding 6,000 kg MLP × 1,500 VNĐ/kg",
    depreciation: "Equipment Depreciation",
    depreciationDesc: "Straight-line depreciation: CapEx 260M over 60 months",
    totalOpex: "TOTAL MONTHLY OPEX",
    cogsGpTitle: "Cost of Goods Sold (COGS) & Gross Profit (GP)",
    totalCogs: "Total Cost (COGS)",
    brickSales: "Brick Sales Revenue",
    eprSales: "EPR Service Revenue",
    totalRev: "Total Revenue (TR)",
    totalCost: "Total Production Cost (TC)",
    grossProfit: "Gross Profit (GP)",
    cogsDetailVal: "16,258 VNĐ/brick (BOM + OPEX/Q)",
    brickSalesVal: "300,000,000 VNĐ (10,000 bricks × 30,000 VNĐ)",
    eprSalesVal: "28,800,000 VNĐ (6,000 kg MLP × 4,800 VNĐ)",
    healthTitle: "4. Business Health & Customer Metrics",
    healthDesc: "Sustainability of our B2B/SaaS model is proven by the LTV:COCA ratio. High retention from FMCG brands builds massive lifetime value.",
    ratioTitle: "LTV:COCA Ratio",
    ltvDesc: "B2B construction contractor repeat purchases of 15k bricks/year, or FMCG brand renewing SaaS EPR package for 3 years.",
    cocaDesc: "B2B Marketing/Sales budget ~30M VND/month. Year 1 spends 360M VND to close 10 key client accounts.",
    ratioDesc: "Ratio > 3:1 proves the RENOVA hybrid SaaS/B2B model is highly sustainable.",
    growthTitle: "5. Growth Projections & Investment Metrics",
    growthDesc: "Transitioning to a hybrid SaaS model (Smart-Hub AI) enables exponential revenue growth while maintaining a lean cost structure.",
    y5Rev: "Year 5 Revenue",
    cumCash: "Cumulative Cash Flow",
    npvProj: "Projected NPV (r=20%)",
    saasClients: "SaaS Clients (Year 5)",
    taxNote: "Unit: Million VND. Assumed corporate income tax = 0% thanks to Green Enterprise incentives (Decree 08/2022/ND-CP).",
    cashflowTable: ["Category", "Year 0", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"],
    volBricks: "Brick Volume (units)",
    numClients: "SaaS Clients (FMCG)",
    cogsRow: "COGS Production Cost",
    marketingRow: "Marketing & Admin Expenses",
    capexRow: "Capital Expenditures (CapEx)",
    netCashflow: "Net Cash Flow (CFt)",
    cumCashflow: "Cumulative Cash Flow",
    noteY0: "Year 0 Note: Includes 260M CapEx (2 presses, 2 heaters, 1 shredder) + 240M R&D/Working Capital.",
    npvValue: "17,652 Million VND",
    npvDesc: "NPV > 0 — projects extremely high value creation for shareholders.",
    irrValue: "254%",
    irrDesc: "Breakout IRR driven by high margins from SaaS software and near-zero raw material cost.",
    ppValue: "≈ 5 Months",
    ppDesc: "Takes approximately 5 months of commercial operation to recover the entire 500M VND seed investment.",
    fundingTitle: "6. Funding Proposal & Use of Funds",
    fundingAsk: "RENOVA is seeking 1,000,000,000 VND in exchange for 10% equity (Pre-money valuation: 9B VND). Split between physical plant and AI R&D.",
    totalFunding: "Total Capital Raised",
    sharesAsk: "Equity Offered",
    postMoneyVal: "Post-money Valuation",
    useOfFunds: "Strategic Allocation (Use of Funds)",
    usePilotTitle: "Setup Pilot Plant (30%)",
    usePilotDesc: "Invest in 2 automated presses, 2 heating tanks at 200°C, 1 raw shredder, and molds.",
    useAiTitle: "AI R&D & Certifications (20%)",
    useAiDesc: "Research optimal thermo-pressing temperatures. Obtain TCVN certifications at Quatest 3. Build core AI.",
    useMktTitle: "B2B Marketing & Sales (20%)",
    useMktDesc: "Organize Tech-Talks for architects, sample distribution. Inside B2B Sales to FMCG brands.",
    useCapTitle: "Working Capital (30%)",
    useCapDesc: "Maintain runway for employee payroll and general operations for the first 6 months.",
    timelineTitle: "7. Strategic Roadmap & Execution",
    step1Title: "Setup Pilot Plant",
    step1Desc: "Install 2-press cluster and get Quatest 3 certification.",
    step2Title: "AI R&D Core",
    step2Desc: "Develop machine learning surrogate model for rapid CFD simulation.",
    step3Title: "B2B Outreach",
    step3Desc: "Onboard 10 key architects and 3 FMCG brands for Beta software.",
    step4Title: "Break-even",
    step4Desc: "Achieve operating profitability within 6 months of launch."
  }
};

const marketData = [
  { name: "TAM", value: 11.11, fill: "#1d1815" },
  { name: "SAM", value: 3.89, fill: "#914724" }
];

const bomData = [
  { name: "HDPE", value: 5400, color: "#914724" },
  { name: "PE-g-MA", value: 3750, color: "#b45309" },
  { name: "Rice Husk", value: 375, color: "#d97736" },
  { name: "MLP Waste", value: 10, color: "#a19a95" } // small visual slice representing 0 raw cost
];

const opexData = [
  { name: "Pilot Set-up", value: 300, color: "#1d1815" },
  { name: "Working Capital", value: 300, color: "#914724" },
  { name: "R&D AI & Certs", value: 200, color: "#b45309" },
  { name: "B2B Marketing", value: 200, color: "#d97736" }
];

const growthData = [
  { year: "Year 1", revenue: 3945, cashflow: 1194 },
  { year: "Year 2", revenue: 8140, cashflow: 3140 },
  { year: "Year 3", revenue: 20350, cashflow: 8050 },
  { year: "Year 4", revenue: 32256, cashflow: 13656 },
  { year: "Year 5", revenue: 48560, cashflow: 20760 }
];

const ltvData = [
  { coca: 10, ltv: 50 },
  { coca: 20, ltv: 120 },
  { coca: 30, ltv: 200 },
  { coca: 36, ltv: 250 },
  { coca: 40, ltv: 300 },
  { coca: 50, ltv: 400 }
];

export default function FinancialReport({ lang }: FinancialReportProps) {
  const t = translations[lang];

  return (
    <section id="tai-chinh" className="bg-[#faf8f5] dark:bg-zinc-950 border-t border-brand-border dark:border-white/5 scroll-mt-20">
      <div className="container">
        
        {/* Header Title Section */}
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              {t.title}
              <span className="gradient-text">{t.titleHighlight}</span>
            </h2>
            <p className="text-brand-text-muted text-base sm:text-lg">
              {t.subtitle}
            </p>
            
            {/* Main Stats badging */}
            <div className="flex justify-center gap-6 mt-8 flex-wrap">
              <div className="bg-brand-primary/10 border border-brand-primary/20 dark:bg-brand-primary/5 px-6 py-3 rounded-2xl text-center min-w-[140px] transform hover:-translate-y-1 transition duration-300">
                <span className="block text-3xl font-black text-brand-primary">254%</span>
                <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">{t.irrBadge}</span>
              </div>
              <div className="bg-brand-secondary/10 border border-brand-secondary/20 dark:bg-brand-secondary/5 px-6 py-3 rounded-2xl text-center min-w-[140px] transform hover:-translate-y-1 transition duration-300">
                <span className="block text-3xl font-black text-brand-secondary">5 Mo</span>
                <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">{t.paybackBadge}</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 1. Market Scale & Potential */}
        <div className="mb-20">
          <ScrollReveal>
            <h3 className="text-xl sm:text-2xl font-extrabold mb-3 flex items-center text-brand-text-primary dark:text-white">
              <span className="w-2 h-6 bg-brand-primary rounded-full mr-3"></span>
              {t.marketTitle}
            </h3>
            <p className="text-brand-text-muted mb-8 max-w-3xl text-sm sm:text-base">
              {t.marketDesc}
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <ScrollReveal className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl border border-brand-border dark:border-white/5 p-6 shadow-sm">
              <h4 className="text-sm font-bold mb-4 text-brand-text-primary dark:text-white">{t.marketChartTitle}</h4>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={marketData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} />
                    <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} />
                    <Tooltip cursor={{ fill: "rgba(145, 71, 36, 0.05)" }} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {marketData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-brand-text-muted mt-4 italic">{t.marketSource}</p>
            </ScrollReveal>

            <ScrollReveal className="flex flex-col gap-6">
              <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-white/5 p-6 rounded-2xl border-l-4 border-l-brand-primary shadow-xs">
                <span className="text-[10px] text-brand-text-muted block uppercase font-bold tracking-wider">TAM (2029)</span>
                <span className="text-3xl font-black text-brand-text-primary dark:text-white mt-1">$11.11B</span>
                <p className="text-xs text-brand-text-muted mt-2">Tổng quy mô thị trường xanh đến năm 2029.</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-white/5 p-6 rounded-2xl border-l-4 border-l-brand-secondary shadow-xs">
                <span className="text-[10px] text-brand-text-muted block uppercase font-bold tracking-wider">SAM (2030)</span>
                <span className="text-3xl font-black text-brand-secondary mt-1">35%</span>
                <p className="text-xs text-brand-text-muted mt-2">Phần xanh / sinh thái mục tiêu.</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-white/5 p-6 rounded-2xl border-l-4 border-l-brand-accent shadow-xs">
                <span className="text-[10px] text-brand-text-muted block uppercase font-bold tracking-wider">SOM (Year 1)</span>
                <span className="text-3xl font-black text-brand-accent mt-1">120,000 Bricks</span>
                <p className="text-xs text-brand-text-muted mt-2">SOM = Công suất thiết kế × OEE 80%.</p>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal className="bg-white dark:bg-zinc-900 rounded-3xl border border-brand-border dark:border-white/5 overflow-hidden mt-8 shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-bg-dark dark:bg-zinc-800 text-brand-text-muted font-bold text-xs uppercase tracking-wider border-b border-brand-border dark:border-white/5">
                    <th className="p-4">{t.indicator}</th>
                    <th className="p-4">{t.metric}</th>
                    <th className="p-4">{t.formula}</th>
                    <th className="p-4">{t.citation}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border dark:divide-white/5 text-sm">
                  <tr className="hover:bg-brand-primary/3 dark:hover:bg-white/3 transition">
                    <td className="p-4 font-bold text-brand-text-primary dark:text-white">TAM</td>
                    <td className="p-4 font-bold text-brand-primary">11,11 tỷ USD (2029)</td>
                    <td className="p-4">{t.aboutMarket}</td>
                    <td className="p-4 text-brand-text-muted">{t.citation} Mordor (2025)</td>
                  </tr>
                  <tr className="hover:bg-brand-primary/3 dark:hover:bg-white/3 transition">
                    <td className="p-4 font-bold text-brand-text-primary dark:text-white">SAM</td>
                    <td className="p-4 font-bold text-brand-secondary">35% market share</td>
                    <td className="p-4">{t.targetMarket}</td>
                    <td className="p-4 text-brand-text-muted">VLXDgiatot & USGBC</td>
                  </tr>
                  <tr className="hover:bg-brand-primary/3 dark:hover:bg-white/3 transition">
                    <td className="p-4 font-bold text-brand-text-primary dark:text-white">SOM</td>
                    <td className="p-4 font-bold text-brand-accent">{t.somDetail}</td>
                    <td className="p-4">{t.achievedMarket}</td>
                    <td className="p-4 text-brand-text-muted">OEM Ánh Thủy Pilot line</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>

        {/* 2. RENOVA Smart-Hub: AI & SaaS */}
        <div className="mb-20">
          <ScrollReveal>
            <h3 className="text-xl sm:text-2xl font-extrabold mb-3 flex items-center text-brand-text-primary dark:text-white">
              <span className="w-2 h-6 bg-brand-primary rounded-full mr-3"></span>
              {t.saasTitle}
            </h3>
            <p className="text-brand-text-muted mb-8 max-w-3xl text-sm sm:text-base">
              {t.saasDesc}
            </p>
          </ScrollReveal>

          {/* SaaS Subscriptions */}
          <ScrollReveal className="bg-white dark:bg-zinc-900 rounded-3xl border border-brand-border dark:border-white/5 p-6 sm:p-8 shadow-sm mb-8">
            <h4 className="font-extrabold text-lg text-center mb-8">{t.pricingTitle}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Basic */}
              <div className="border border-brand-border dark:border-white/5 p-6 rounded-2xl text-center hover:border-brand-primary transition duration-300">
                <span className="text-[10px] text-brand-text-muted uppercase font-bold tracking-wider">{t.tierFree}</span>
                <span className="block text-2xl font-extrabold my-4 text-brand-text-primary dark:text-white">{t.freeVal}</span>
                <ul className="text-xs text-brand-text-muted space-y-3 border-t border-brand-border dark:border-white/5 pt-4 text-left max-w-[180px] mx-auto list-none pl-0">
                  {t.freeFeatures.map((f, i) => <li key={i}>✓ {f}</li>)}
                </ul>
              </div>

              {/* Pro */}
              <div className="border-2 border-brand-primary p-6 rounded-2xl text-center bg-brand-primary/5 dark:bg-brand-primary/3 relative shadow-sm">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-primary text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Popular</span>
                <span className="text-[10px] text-brand-primary uppercase font-bold tracking-wider">{t.tierPro}</span>
                <span className="block text-xl font-extrabold my-4 text-brand-primary">{t.proVal}</span>
                <ul className="text-xs text-brand-text-muted space-y-3 border-t border-brand-primary/20 pt-4 text-left max-w-[180px] mx-auto list-none pl-0">
                  {t.proFeatures.map((f, i) => <li key={i} className="text-brand-text-primary dark:text-zinc-200 font-semibold">✓ {f}</li>)}
                </ul>
              </div>

              {/* Enterprise */}
              <div className="border border-brand-border dark:border-white/5 p-6 rounded-2xl text-center hover:border-brand-primary transition duration-300">
                <span className="text-[10px] text-brand-text-muted uppercase font-bold tracking-wider">{t.tierEnt}</span>
                <span className="block text-2xl font-extrabold my-4 text-brand-text-primary dark:text-white">{t.entVal}</span>
                <ul className="text-xs text-brand-text-muted space-y-3 border-t border-brand-border dark:border-white/5 pt-4 text-left max-w-[180px] mx-auto list-none pl-0">
                  {t.entFeatures.map((f, i) => <li key={i}>✓ {f}</li>)}
                </ul>
              </div>

            </div>
          </ScrollReveal>
        </div>

        {/* 3. Unit Economics & COGS */}
        <div className="mb-20">
          <ScrollReveal>
            <h3 className="text-xl sm:text-2xl font-extrabold mb-3 flex items-center text-brand-text-primary dark:text-white">
              <span className="w-2 h-6 bg-brand-secondary rounded-full mr-3"></span>
              {t.economicsTitle}
            </h3>
            <p className="text-brand-text-muted mb-8 max-w-3xl text-sm sm:text-base">
              {t.economicsDesc}
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-stretch">
            {/* BOM Chart */}
            <ScrollReveal className="bg-white dark:bg-zinc-900 rounded-3xl border border-brand-border dark:border-white/5 p-6 shadow-sm flex flex-col">
              <h4 className="text-sm font-bold mb-4 text-brand-text-primary dark:text-white">{t.bomTitle}</h4>
              <div className="h-[250px] w-full flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bomData}
                      cx="50%"
                      cy="45%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {bomData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => value !== undefined && value !== null ? `${Number(value).toLocaleString()} VND` : ""} />
                    <Legend verticalAlign="bottom" height={36} iconSize={12} wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ScrollReveal>

            {/* General financial overview card */}
            <ScrollReveal className="bg-white dark:bg-zinc-900 rounded-3xl border border-brand-border dark:border-white/5 p-6 shadow-sm flex flex-col justify-center">
              <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-brand-border dark:border-white/5 pb-3">
                  <div>
                    <span className="text-[10px] text-brand-text-muted block uppercase font-bold tracking-wider">COGS</span>
                    <span className="text-3xl font-extrabold text-brand-text-primary dark:text-white">16,258 VND</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full dark:bg-emerald-950 dark:text-emerald-300">
                    50.5% {t.grossMargin}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-brand-bg-dark dark:bg-zinc-800 rounded-2xl">
                    <span className="text-[10px] text-brand-text-muted uppercase font-bold tracking-wider">{t.brickRev}</span>
                    <span className="block text-xl font-black text-brand-primary mt-1">30,000 VND</span>
                  </div>
                  <div className="p-4 bg-brand-bg-dark dark:bg-zinc-800 rounded-2xl">
                    <span className="text-[10px] text-brand-text-muted uppercase font-bold tracking-wider">{t.eprFee}</span>
                    <span className="block text-xl font-black text-brand-secondary mt-1">2,880 VND</span>
                  </div>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-2xl border border-orange-100 dark:border-orange-900/50 flex items-start gap-3">
                  <span className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand-primary text-white text-xs">💡</span>
                  <p className="text-xs sm:text-sm text-orange-800 dark:text-orange-300 leading-relaxed">
                    {t.circularAdvantage}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* BOM Breakdown Table */}
          <ScrollReveal className="bg-white dark:bg-zinc-900 rounded-3xl border border-brand-border dark:border-white/5 overflow-hidden shadow-xs mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-bg-dark dark:bg-zinc-800 text-brand-text-muted font-bold text-xs uppercase tracking-wider border-b border-brand-border dark:border-white/5">
                    <th className="p-4 font-bold">{t.component}</th>
                    <th className="p-4 font-bold">{t.ratio}</th>
                    <th className="p-4 font-bold">{t.weight}</th>
                    <th className="p-4 font-bold">{t.unitCost}</th>
                    <th className="p-4 font-bold">{t.costPerBrick}</th>
                    <th className="p-4 font-bold">{t.basis}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border dark:divide-white/5 text-sm">
                  <tr className="hover:bg-brand-primary/3 dark:hover:bg-white/3 transition">
                    <td className="p-4 font-semibold">Rác nhựa đa lớp (MLP)</td>
                    <td className="p-4">40%</td>
                    <td className="p-4">0.6 kg</td>
                    <td className="p-4">0 VNĐ/kg</td>
                    <td className="p-4 font-bold text-emerald-600">0 VNĐ</td>
                    <td className="p-4 text-brand-text-muted">{t.mlpDesc}</td>
                  </tr>
                  <tr className="hover:bg-brand-primary/3 dark:hover:bg-white/3 transition">
                    <td className="p-4 font-semibold">Nhựa HDPE Tái Chế</td>
                    <td className="p-4">30%</td>
                    <td className="p-4">0.45 kg</td>
                    <td className="p-4">12,000 VNĐ/kg</td>
                    <td className="p-4 font-bold">5,400 VNĐ</td>
                    <td className="p-4 text-brand-text-muted">{t.hdpeDesc}</td>
                  </tr>
                  <tr className="hover:bg-brand-primary/3 dark:hover:bg-white/3 transition">
                    <td className="p-4 font-semibold">Vỏ trấu nông nghiệp</td>
                    <td className="p-4">25%</td>
                    <td className="p-4">0.365 kg</td>
                    <td className="p-4">1,000 VNĐ/kg</td>
                    <td className="p-4 font-bold">375 VNĐ</td>
                    <td className="p-4 text-brand-text-muted">{t.huskDesc}</td>
                  </tr>
                  <tr className="hover:bg-brand-primary/3 dark:hover:bg-white/3 transition">
                    <td className="p-4 font-semibold">Phụ gia PE-g-MA</td>
                    <td className="p-4">5%</td>
                    <td className="p-4">0.075 kg</td>
                    <td className="p-4">50,000 VNĐ/kg</td>
                    <td className="p-4 font-bold">3,750 VNĐ</td>
                    <td className="p-4 text-brand-text-muted">{t.peDesc}</td>
                  </tr>
                  <tr className="bg-brand-primary/6 font-bold text-brand-primary dark:bg-brand-primary/5 dark:text-zinc-200">
                    <td className="p-4">{t.totalBom}</td>
                    <td className="p-4">100%</td>
                    <td className="p-4">1.5 kg</td>
                    <td className="p-4">—</td>
                    <td className="p-4">9,525 VNĐ</td>
                    <td className="p-4">{t.bomAdv}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </ScrollReveal>

          {/* OPEX Table */}
          <ScrollReveal>
            <h4 className="font-bold text-base mb-4 text-brand-text-primary dark:text-white">{t.opexTitle}</h4>
          </ScrollReveal>
          <ScrollReveal className="bg-white dark:bg-zinc-900 rounded-3xl border border-brand-border dark:border-white/5 overflow-hidden shadow-xs mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-brand-bg-dark dark:bg-zinc-800 text-brand-text-muted font-bold text-xs uppercase tracking-wider border-b border-brand-border dark:border-white/5">
                    <th className="p-4">{t.opexTableHead[0]}</th>
                    <th className="p-4">{t.opexTableHead[1]}</th>
                    <th className="p-4">{t.opexTableHead[2]}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border dark:divide-white/5">
                  <tr className="hover:bg-brand-primary/3 dark:hover:bg-white/3 transition">
                    <td className="p-4 font-semibold">{t.labor}</td>
                    <td className="p-4 font-bold text-brand-text-primary dark:text-white">24,000,000 VNĐ</td>
                    <td className="p-4 text-brand-text-muted">{t.laborDesc}</td>
                  </tr>
                  <tr className="hover:bg-brand-primary/3 dark:hover:bg-white/3 transition">
                    <td className="p-4 font-semibold">{t.utility}</td>
                    <td className="p-4 font-bold text-brand-text-primary dark:text-white">15,000,000 VNĐ</td>
                    <td className="p-4 text-brand-text-muted">{t.utilityDesc}</td>
                  </tr>
                  <tr className="hover:bg-brand-primary/3 dark:hover:bg-white/3 transition">
                    <td className="p-4 font-semibold">{t.rent}</td>
                    <td className="p-4 font-bold text-brand-text-primary dark:text-white">15,000,000 VNĐ</td>
                    <td className="p-4 text-brand-text-muted">{t.rentDesc}</td>
                  </tr>
                  <tr className="hover:bg-brand-primary/3 dark:hover:bg-white/3 transition">
                    <td className="p-4 font-semibold">{t.treatment}</td>
                    <td className="p-4 font-bold text-brand-text-primary dark:text-white">9,000,000 VNĐ</td>
                    <td className="p-4 text-brand-text-muted">{t.treatmentDesc}</td>
                  </tr>
                  <tr className="hover:bg-brand-primary/3 dark:hover:bg-white/3 transition">
                    <td className="p-4 font-semibold">{t.depreciation}</td>
                    <td className="p-4 font-bold text-brand-text-primary dark:text-white">4,333,000 VNĐ</td>
                    <td className="p-4 text-brand-text-muted">{t.depreciationDesc}</td>
                  </tr>
                  <tr className="bg-brand-primary/6 font-bold text-brand-primary dark:bg-brand-primary/5 dark:text-zinc-200 border-t border-brand-primary">
                    <td className="p-4">{t.totalOpex}</td>
                    <td className="p-4">67,333,000 VNĐ</td>
                    <td className="p-4">Phân bổ OPEX/Q = 6,733 VNĐ/viên</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </ScrollReveal>

          {/* GP Table */}
          <ScrollReveal>
            <h4 className="font-bold text-base mb-4 text-brand-text-primary dark:text-white">{t.cogsGpTitle}</h4>
          </ScrollReveal>
          <ScrollReveal className="bg-white dark:bg-zinc-900 rounded-3xl border border-brand-border dark:border-white/5 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-brand-bg-dark dark:bg-zinc-800 text-brand-text-muted font-bold text-xs uppercase tracking-wider border-b border-brand-border dark:border-white/5">
                    <th className="p-4">{t.indicator}</th>
                    <th className="p-4">{t.metric}</th>
                    <th className="p-4">{t.formula}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border dark:divide-white/5">
                  <tr className="hover:bg-brand-primary/3 dark:hover:bg-white/3 transition">
                    <td className="p-4 font-semibold">{t.totalCogs}</td>
                    <td className="p-4 font-bold">16,258 VNĐ/viên</td>
                    <td className="p-4 text-brand-text-muted">{t.cogsDetailVal}</td>
                  </tr>
                  <tr className="hover:bg-brand-primary/3 dark:hover:bg-white/3 transition">
                    <td className="p-4 font-semibold">{t.brickSales}</td>
                    <td className="p-4 font-bold">300,000,000 VNĐ</td>
                    <td className="p-4 text-brand-text-muted">{t.brickSalesVal}</td>
                  </tr>
                  <tr className="hover:bg-brand-primary/3 dark:hover:bg-white/3 transition">
                    <td className="p-4 font-semibold">{t.eprSales}</td>
                    <td className="p-4 font-bold">28,800,000 VNĐ</td>
                    <td className="p-4 text-brand-text-muted">{t.eprSalesVal}</td>
                  </tr>
                  <tr className="hover:bg-brand-primary/3 dark:hover:bg-white/3 transition">
                    <td className="p-4 font-semibold">{t.totalRev}</td>
                    <td className="p-4 font-bold">328,800,000 VNĐ</td>
                    <td className="p-4 text-brand-text-muted">TR = Doanh thu Gạch + Doanh thu EPR</td>
                  </tr>
                  <tr className="hover:bg-brand-primary/3 dark:hover:bg-white/3 transition">
                    <td className="p-4 font-semibold">{t.totalCost}</td>
                    <td className="p-4 font-bold">162,580,000 VNĐ</td>
                    <td className="p-4 text-brand-text-muted">TC = 10,000 viên × COGS</td>
                  </tr>
                  <tr className="bg-brand-primary/6 font-bold text-brand-primary dark:bg-brand-primary/5 dark:text-zinc-200">
                    <td className="p-4">{t.grossProfit}</td>
                    <td className="p-4">166,220,000 VNĐ</td>
                    <td className="p-4">GP = TR - TC (Gross Margin = 50.5%)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>

        {/* 4. Business Health & Customer Metrics */}
        <div className="mb-20">
          <ScrollReveal>
            <h3 className="text-xl sm:text-2xl font-extrabold mb-3 flex items-center text-brand-text-primary dark:text-white">
              <span className="w-2 h-6 bg-brand-text-primary rounded-full mr-3"></span>
              {t.healthTitle}
            </h3>
            <p className="text-brand-text-muted mb-8 max-w-3xl text-sm sm:text-base">
              {t.healthDesc}
            </p>
          </ScrollReveal>

          <ScrollReveal className="bg-white dark:bg-zinc-900 rounded-3xl border border-brand-border dark:border-white/5 p-6 shadow-sm mb-8">
            <h4 className="text-sm font-bold mb-4 text-brand-text-primary dark:text-white">{t.ratioTitle}</h4>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ltvData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" />
                  <XAxis dataKey="coca" stroke="#a1a1aa" fontSize={11} />
                  <YAxis stroke="#a1a1aa" fontSize={11} />
                  <Tooltip formatter={(value) => value !== undefined && value !== null ? `${value}M VND` : ""} />
                  <Line type="monotone" dataKey="ltv" stroke="#b45309" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 flex justify-around items-center border-t border-brand-border dark:border-white/5 pt-4 text-center">
              <div>
                <span className="text-[10px] text-brand-text-muted block uppercase font-bold tracking-wider font-heading">LTV</span>
                <span className="text-lg font-extrabold">250M VND</span>
              </div>
              <div className="h-8 w-px bg-brand-border dark:bg-white/10"></div>
              <div>
                <span className="text-[10px] text-brand-text-muted block uppercase font-bold tracking-wider font-heading">COCA</span>
                <span className="text-lg font-extrabold">36M VND</span>
              </div>
              <div className="h-8 w-px bg-brand-border dark:bg-white/10"></div>
              <div>
                <span className="text-[10px] text-brand-primary block uppercase font-bold tracking-wider font-heading">Ratio</span>
                <span className="text-2xl font-black text-brand-primary">6.9 : 1</span>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScrollReveal className="bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/5 p-6 shadow-xs">
              <span className="text-xs uppercase font-bold tracking-wider text-brand-text-muted">LTV (Life Time Value)</span>
              <p className="text-xl font-black text-brand-primary mt-2 mb-3">250M VND</p>
              <p className="text-xs text-brand-text-muted leading-relaxed">{t.ltvDesc}</p>
            </ScrollReveal>
            <ScrollReveal className="bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/5 p-6 shadow-xs">
              <span className="text-xs uppercase font-bold tracking-wider text-brand-text-muted">COCA</span>
              <p className="text-xl font-black text-brand-secondary mt-2 mb-3">36M VND</p>
              <p className="text-xs text-brand-text-muted leading-relaxed">{t.cocaDesc}</p>
            </ScrollReveal>
            <ScrollReveal className="bg-white dark:bg-zinc-900 rounded-2xl border border-brand-accent p-6 shadow-xs bg-brand-accent/5">
              <span className="text-xs uppercase font-bold tracking-wider text-brand-text-muted">LTV : COCA Ratio</span>
              <p className="text-xl font-black text-brand-accent mt-2 mb-3">6.9 : 1</p>
              <p className="text-xs text-brand-text-muted leading-relaxed">{t.ratioDesc}</p>
            </ScrollReveal>
          </div>
        </div>

        {/* 5. Growth Projections & Investment Metrics */}
        <div className="mb-20">
          <ScrollReveal>
            <h3 className="text-xl sm:text-2xl font-extrabold mb-3 flex items-center text-brand-text-primary dark:text-white">
              <span className="w-2 h-6 bg-brand-accent rounded-full mr-3"></span>
              {t.growthTitle}
            </h3>
          </ScrollReveal>

          <ScrollReveal className="bg-white dark:bg-zinc-900 rounded-3xl border border-brand-border dark:border-white/5 p-6 shadow-sm mb-8">
            <p className="text-brand-text-muted mb-6 text-sm sm:text-base">
              {t.growthDesc}
            </p>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" />
                  <XAxis dataKey="year" stroke="#a1a1aa" fontSize={11} />
                  <YAxis stroke="#a1a1aa" fontSize={11} />
                  <Tooltip formatter={(value) => value !== undefined && value !== null ? `${Number(value).toLocaleString()}M VND` : ""} />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" name="Doanh Thu (TR)" dataKey="revenue" stroke="#914724" strokeWidth={3} />
                  <Line type="monotone" name="Dòng Tiền Thuần (CFt)" dataKey="cashflow" stroke="#b45309" strokeDasharray="5 5" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ScrollReveal>

          <ScrollReveal className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-8">
            <div className="bg-brand-text-primary text-white dark:bg-zinc-900 p-4 rounded-xl shadow-xs">
              <span className="text-[10px] uppercase text-zinc-400 font-bold tracking-wider">{t.y5Rev}</span>
              <span className="block text-lg sm:text-xl font-extrabold mt-1">48.56B VND</span>
            </div>
            <div className="bg-brand-text-primary text-white dark:bg-zinc-900 p-4 rounded-xl shadow-xs">
              <span className="text-[10px] uppercase text-zinc-400 font-bold tracking-wider">{t.cumCash}</span>
              <span className="block text-lg sm:text-xl font-extrabold mt-1">46.30B VND</span>
            </div>
            <div className="bg-brand-primary text-white p-4 rounded-xl shadow-xs">
              <span className="text-[10px] uppercase text-orange-200 font-bold tracking-wider">{t.npvProj}</span>
              <span className="block text-lg sm:text-xl font-extrabold mt-1">17.65B VND</span>
            </div>
            <div className="bg-brand-secondary text-white p-4 rounded-xl shadow-xs">
              <span className="text-[10px] uppercase text-amber-200 font-bold tracking-wider">{t.saasClients}</span>
              <span className="block text-lg sm:text-xl font-extrabold mt-1">50 Brands</span>
            </div>
          </ScrollReveal>

          {/* Cashflow Table */}
          <ScrollReveal className="bg-white dark:bg-zinc-900 rounded-3xl border border-brand-border dark:border-white/5 overflow-hidden shadow-xs mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-brand-bg-dark dark:bg-zinc-800 text-brand-text-muted font-bold text-xs uppercase tracking-wider border-b border-brand-border dark:border-white/5">
                    <th className="p-4">{t.cashflowTable[0]}</th>
                    <th className="p-4">{t.cashflowTable[1]}</th>
                    <th className="p-4">{t.cashflowTable[2]}</th>
                    <th className="p-4">{t.cashflowTable[3]}</th>
                    <th className="p-4">{t.cashflowTable[4]}</th>
                    <th className="p-4">{t.cashflowTable[5]}</th>
                    <th className="p-4">{t.cashflowTable[6]}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border dark:divide-white/5">
                  <tr className="hover:bg-brand-primary/3 dark:hover:bg-white/3 transition">
                    <td className="p-4 font-semibold">{t.volBricks}</td>
                    <td className="p-4">0</td>
                    <td className="p-4">120,000</td>
                    <td className="p-4">240,000</td>
                    <td className="p-4">600,000</td>
                    <td className="p-4">960,000</td>
                    <td className="p-4">1,440,000</td>
                  </tr>
                  <tr className="hover:bg-brand-primary/3 dark:hover:bg-white/3 transition">
                    <td className="p-4 font-semibold">{t.numClients}</td>
                    <td className="p-4">0</td>
                    <td className="p-4">0</td>
                    <td className="p-4">5</td>
                    <td className="p-4">15</td>
                    <td className="p-4">30</td>
                    <td className="p-4">50</td>
                  </tr>
                  <tr className="hover:bg-brand-primary/3 dark:hover:bg-white/3 transition">
                    <td className="p-4 font-semibold">{t.totalRev}</td>
                    <td className="p-4">0</td>
                    <td className="p-4">3,945</td>
                    <td className="p-4">8,140</td>
                    <td className="p-4">20,350</td>
                    <td className="p-4">32,256</td>
                    <td className="p-4">48,560</td>
                  </tr>
                  <tr className="hover:bg-brand-primary/3 dark:hover:bg-white/3 transition text-red-600 dark:text-red-400">
                    <td className="p-4 font-semibold">{t.cogsRow}</td>
                    <td className="p-4">0</td>
                    <td className="p-4">(1,951)</td>
                    <td className="p-4">(3,800)</td>
                    <td className="p-4">(9,300)</td>
                    <td className="p-4">(14,600)</td>
                    <td className="p-4">(21,500)</td>
                  </tr>
                  <tr className="hover:bg-brand-primary/3 dark:hover:bg-white/3 transition text-red-600 dark:text-red-400">
                    <td className="p-4 font-semibold">{t.marketingRow}</td>
                    <td className="p-4">0</td>
                    <td className="p-4">(800)</td>
                    <td className="p-4">(1,200)</td>
                    <td className="p-4">(2,500)</td>
                    <td className="p-4">(4,000)</td>
                    <td className="p-4">(5,500)</td>
                  </tr>
                  <tr className="hover:bg-brand-primary/3 dark:hover:bg-white/3 transition text-red-600 dark:text-red-400">
                    <td className="p-4 font-semibold">{t.capexRow}</td>
                    <td className="p-4">(260)</td>
                    <td className="p-4">0</td>
                    <td className="p-4">0</td>
                    <td className="p-4">(500)</td>
                    <td className="p-4">0</td>
                    <td className="p-4">(800)</td>
                  </tr>
                  <tr className="bg-brand-primary/6 font-bold text-brand-primary dark:bg-brand-primary/5 dark:text-zinc-200">
                    <td className="p-4">{t.netCashflow}</td>
                    <td className="p-4">(500)</td>
                    <td className="p-4">1,194</td>
                    <td className="p-4">3,140</td>
                    <td className="p-4">8,050</td>
                    <td className="p-4">13,656</td>
                    <td className="p-4">20,760</td>
                  </tr>
                  <tr className="bg-brand-secondary/6 font-bold text-brand-secondary dark:bg-brand-secondary/5 dark:text-zinc-200">
                    <td className="p-4">{t.cumCashflow}</td>
                    <td className="p-4">(500)</td>
                    <td className="p-4">694</td>
                    <td className="p-4">3,834</td>
                    <td className="p-4">11,884</td>
                    <td className="p-4">25,540</td>
                    <td className="p-4">46,300</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-brand-text-muted p-4 border-t border-brand-border dark:border-white/5 italic">
              {t.noteY0}
            </p>
          </ScrollReveal>

          {/* Investment metrics cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScrollReveal className="bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/5 p-6 shadow-xs">
              <span className="text-xs uppercase font-bold tracking-wider text-brand-text-muted">{t.npvProj}</span>
              <p className="text-xl font-black text-brand-primary mt-2 mb-3">{t.npvValue}</p>
              <p className="text-xs text-brand-text-muted leading-relaxed">{t.npvDesc}</p>
            </ScrollReveal>
            <ScrollReveal className="bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/5 p-6 shadow-xs">
              <span className="text-xs uppercase font-bold tracking-wider text-brand-text-muted">{t.irrBadge}</span>
              <p className="text-xl font-black text-brand-secondary mt-2 mb-3">{t.irrValue}</p>
              <p className="text-xs text-brand-text-muted leading-relaxed">{t.irrDesc}</p>
            </ScrollReveal>
            <ScrollReveal className="bg-white dark:bg-zinc-900 rounded-2xl border border-brand-accent p-6 shadow-xs bg-brand-accent/5">
              <span className="text-xs uppercase font-bold tracking-wider text-brand-text-muted">{t.paybackBadge}</span>
              <p className="text-xl font-black text-brand-accent mt-2 mb-3">{t.ppValue}</p>
              <p className="text-xs text-brand-text-muted leading-relaxed">{t.ppDesc}</p>
            </ScrollReveal>
          </div>
        </div>

        {/* 6. Funding Ask & Use of Funds */}
        <div className="mb-20">
          <ScrollReveal>
            <h3 className="text-xl sm:text-2xl font-extrabold mb-3 flex items-center text-brand-text-primary dark:text-white">
              <span className="w-2 h-6 bg-brand-primary rounded-full mr-3"></span>
              {t.fundingTitle}
            </h3>
            <p className="text-brand-text-muted mb-8 max-w-3xl text-sm sm:text-base">
              {t.fundingAsk}
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-center">
            {/* Allocation Chart */}
            <ScrollReveal className="bg-white dark:bg-zinc-900 rounded-3xl border border-brand-border dark:border-white/5 p-6 shadow-sm">
              <h4 className="text-sm font-bold mb-4 text-brand-text-primary dark:text-white">{t.useOfFunds}</h4>
              <div className="h-[230px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={opexData}
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {opexData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => value !== undefined && value !== null ? `${value}M VND` : ""} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ScrollReveal>

            {/* Stats list */}
            <ScrollReveal className="flex flex-col gap-6">
              <div className="grid grid-cols-3 gap-4 text-center bg-white dark:bg-zinc-900 border border-brand-border dark:border-white/5 p-6 rounded-2xl shadow-xs">
                <div>
                  <span className="text-[10px] text-brand-text-muted block uppercase font-bold tracking-wider font-heading">{t.totalFunding}</span>
                  <span className="text-lg font-extrabold">1,000M VND</span>
                </div>
                <div className="h-10 w-px bg-brand-border dark:bg-white/10 mx-auto"></div>
                <div>
                  <span className="text-[10px] text-brand-text-muted block uppercase font-bold tracking-wider font-heading">{t.sharesAsk}</span>
                  <span className="text-lg font-extrabold">10%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/5">
                  <h5 className="font-bold text-xs text-brand-text-primary dark:text-white mb-2">{t.usePilotTitle}</h5>
                  <p className="text-xs text-brand-text-muted leading-relaxed">{t.usePilotDesc}</p>
                </div>
                <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/5">
                  <h5 className="font-bold text-xs text-brand-text-primary dark:text-white mb-2">{t.useAiTitle}</h5>
                  <p className="text-xs text-brand-text-muted leading-relaxed">{t.useAiDesc}</p>
                </div>
                <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/5">
                  <h5 className="font-bold text-xs text-brand-text-primary dark:text-white mb-2">{t.useMktTitle}</h5>
                  <p className="text-xs text-brand-text-muted leading-relaxed">{t.useMktDesc}</p>
                </div>
                <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/5">
                  <h5 className="font-bold text-xs text-brand-text-primary dark:text-white mb-2">{t.useCapTitle}</h5>
                  <p className="text-xs text-brand-text-muted leading-relaxed">{t.useCapDesc}</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* 7. Strategic Timeline */}
        <ScrollReveal>
          <h3 className="text-xl sm:text-2xl font-extrabold mb-6 flex items-center text-brand-text-primary dark:text-white">
            <span className="w-2 h-6 bg-brand-text-primary rounded-full mr-3"></span>
            {t.timelineTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-brand-border dark:border-white/5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold mb-4">01</div>
              <h4 className="font-bold mb-2 text-brand-text-primary dark:text-white">{t.step1Title}</h4>
              <p className="text-xs text-brand-text-muted leading-relaxed">{t.step1Desc}</p>
            </div>
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-brand-border dark:border-white/5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold mb-4">02</div>
              <h4 className="font-bold mb-2 text-brand-text-primary dark:text-white">{t.step2Title}</h4>
              <p className="text-xs text-brand-text-muted leading-relaxed">{t.step2Desc}</p>
            </div>
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-brand-border dark:border-white/5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold mb-4">03</div>
              <h4 className="font-bold mb-2 text-brand-text-primary dark:text-white">{t.step3Title}</h4>
              <p className="text-xs text-brand-text-muted leading-relaxed">{t.step3Desc}</p>
            </div>
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-brand-border dark:border-white/5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold mb-4">04</div>
              <h4 className="font-bold mb-2 text-brand-text-primary dark:text-white">{t.step4Title}</h4>
              <p className="text-xs text-brand-text-muted leading-relaxed">{t.step4Desc}</p>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
