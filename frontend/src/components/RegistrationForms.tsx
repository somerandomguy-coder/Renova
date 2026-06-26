"use client";

import React, { useState } from "react";
import { Mail, Phone, Building, Home, Users, CheckCircle, AlertCircle, Send } from "lucide-react";

interface RegistrationFormsProps {
  lang: "vi" | "en";
}

const translations = {
  vi: {
    title: "Cổng Đăng ký ",
    titleHighlight: "Hợp tác",
    subtitle: "Lựa chọn phân hệ phù hợp để tham gia chuỗi giá trị tuần hoàn cùng RENOVA. Chúng tôi sẽ liên hệ lại ngay sau khi tiếp nhận thông tin.",
    successTitle: "Đăng ký Thành công!",
    successDesc: "Cảm ơn bạn đã đăng ký thông tin hợp tác với RENOVA. Chúng tôi đã tiếp nhận thông tin và sẽ liên hệ lại qua email {email} trong thời gian sớm nhất.",
    infoReceived: "Thông tin đã tiếp nhận:",
    companyLabel: "• Doanh nghiệp: ",
    contactLabel: "• Người đại diện: ",
    annualWasteLabel: "• Sản lượng nhựa thải: ",
    customerLabel: "• Khách hàng: ",
    installAreaLabel: "• Diện tích lắp đặt: ",
    locationLabel: "• Địa điểm: ",
    collectorLabel: "• Đối tác thu gom: ",
    typeLabel: "• Hình thức: ",
    addressLabel: "• Địa chỉ: ",
    notProvided: "Không cung cấp",
    scrapYard: "Vựa ve chai",
    individual: "Cá nhân",
    registerNewBtn: "Thực hiện đăng ký mới",
    tabEpr: "Đối tác EPR",
    tabGreen: "Công trình Xanh",
    tabCollector: "Vựa thu gom",
    processing: "Đang xử lý...",
    failMsg: "Đăng ký thất bại",
    connError: "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.",
    // Form 1 fields
    companyName: "Tên công ty / Tập đoàn",
    contactPerson: "Họ tên người liên hệ",
    emailLabel: "Email liên lạc",
    phoneLabel: "Số điện thoại",
    annualPlastic: "Sản lượng rác thải nhựa phát sinh hàng năm (kg)",
    requestEpr: "Yêu cầu ký kết dịch vụ tái chế cấp chứng nhận EPR",
    eprSubmitBtn: "Đăng ký tư vấn đối tác",
    // Form 2 fields
    architectName: "Họ tên chủ đầu tư / KTS",
    surfaceArea: "Diện tích bề mặt cần lắp đặt (m²)",
    constructionLocation: "Địa điểm thi công công trình",
    ventilationRequest: "Mong muốn nhận tư vấn thiết kế thông gió và cách nhiệt thụ động",
    greenSubmitBtn: "Đăng ký tư vấn thiết kế",
    // Form 3 fields
    collectorName: "Tên vựa / Họ tên cá nhân",
    collectorType: "Hình thức thu gom",
    collectorYardOpt: "Vựa ve chai trung gian",
    collectorIndivOpt: "Cá nhân cung cấp nguyên liệu",
    addressInputLabel: "Địa chỉ điểm gom hàng (Không bắt buộc)",
    collectorSubmitBtn: "Gửi đăng ký cung ứng"
  },
  en: {
    title: "Cooperation ",
    titleHighlight: "Register",
    subtitle: "Select the appropriate module to participate in the circular value chain with RENOVA. We will contact you soon after receiving your submission.",
    successTitle: "Registration Success!",
    successDesc: "Thank you for registering your cooperation information with RENOVA. We have received your submission and will contact you via email at {email} as soon as possible.",
    infoReceived: "Received Information:",
    companyLabel: "• Company: ",
    contactLabel: "• Representative: ",
    annualWasteLabel: "• Plastic waste output: ",
    customerLabel: "• Customer: ",
    installAreaLabel: "• Installation area: ",
    locationLabel: "• Location: ",
    collectorLabel: "• Collection Partner: ",
    typeLabel: "• Type: ",
    addressLabel: "• Address: ",
    notProvided: "Not provided",
    scrapYard: "Scrap yard",
    individual: "Individual",
    registerNewBtn: "Submit New Registration",
    tabEpr: "EPR Partner",
    tabGreen: "Green Project",
    tabCollector: "Collector Yard",
    processing: "Processing...",
    failMsg: "Registration failed",
    connError: "Cannot connect to the server. Please try again later.",
    // Form 1 fields
    companyName: "Company / Group Name",
    contactPerson: "Contact Person Name",
    emailLabel: "Contact Email",
    phoneLabel: "Phone Number",
    annualPlastic: "Annual plastic waste output (kg)",
    requestEpr: "Request recycling services with official EPR certificate",
    eprSubmitBtn: "Register for Partner Consultation",
    // Form 2 fields
    architectName: "Investor / Architect Name",
    surfaceArea: "Surface Area to Install (m²)",
    constructionLocation: "Project Construction Location",
    ventilationRequest: "Request passive ventilation & thermal insulation design consultation",
    greenSubmitBtn: "Register for Design Consultation",
    // Form 3 fields
    collectorName: "Yard / Individual Name",
    collectorType: "Collection Type",
    collectorYardOpt: "Intermediary Scrap Collection Yard",
    collectorIndivOpt: "Individual Material Supplier",
    addressInputLabel: "Collection Point Address (Optional)",
    collectorSubmitBtn: "Submit Supply Registration"
  }
};

export default function RegistrationForms({ lang }: RegistrationFormsProps) {
  const [activeTab, setActiveTab] = useState<"epr" | "green" | "collector">("epr");
  const t = translations[lang];
  
  // Form submission status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);

  // Form Fields
  // Tab 1: EPR Partner
  const [eprForm, setEprForm] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    annual_plastic_waste: 2000,
    needs_epr_cert: true
  });

  // Tab 2: Green Project
  const [greenForm, setGreenForm] = useState({
    contact_name: "",
    email: "",
    phone: "",
    surface_area: 50,
    location: "",
    ventilation_consult: true
  });

  // Tab 3: Collector
  const [collectorForm, setCollectorForm] = useState({
    name: "",
    email: "",
    phone: "",
    collector_type: "scrap_yard",
    address: ""
  });

  const parseErrorMessage = (detail: any): string => {
    if (!detail) return t.failMsg;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail.map((err: any) => {
        const fieldName = err.loc ? err.loc[err.loc.length - 1] : "";
        const msg = err.msg || "Invalid input";
        return `${fieldName ? `${fieldName}: ` : ""}${msg}`;
      }).join(", ");
    }
    return typeof detail === "object" ? JSON.stringify(detail) : String(detail);
  };

  const handleEprSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/api/v1/register/epr-partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eprForm)
      });
      if (response.ok) {
        const data = await response.json();
        setSuccessData({ type: "epr", data });
      } else {
        const errDetail = await response.json();
        throw new Error(parseErrorMessage(errDetail.detail));
      }
    } catch (err: any) {
      setError(err.message || t.connError);
    } finally {
      setLoading(false);
    }
  };

  const handleGreenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/api/v1/register/green-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(greenForm)
      });
      if (response.ok) {
        const data = await response.json();
        setSuccessData({ type: "green", data });
      } else {
        const errDetail = await response.json();
        throw new Error(parseErrorMessage(errDetail.detail));
      }
    } catch (err: any) {
      setError(err.message || t.connError);
    } finally {
      setLoading(false);
    }
  };

  const handleCollectorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/api/v1/register/collector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(collectorForm)
      });
      if (response.ok) {
        const data = await response.json();
        setSuccessData({ type: "collector", data });
      } else {
        const errDetail = await response.json();
        throw new Error(parseErrorMessage(errDetail.detail));
      }
    } catch (err: any) {
      setError(err.message || t.connError);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccessData(null);
    setError(null);
  };

  const formatNum = (value: number) => {
    const locale = lang === "vi" ? "vi-VN" : "en-US";
    return value.toLocaleString(locale);
  };

  return (
    <section id="dang-ky" className="relative py-20">
      <div className="container max-w-3xl">
        <h2 className="section-title">
          {t.title}
          <span className="gradient-text">{t.titleHighlight}</span>
        </h2>
        <p className="section-subtitle">
          {t.subtitle}
        </p>

        {successData ? (
          /* SUCCESS SCREEN */
          <div className="glass-card text-center flex flex-col items-center gap-6 p-8 md:p-12 border border-brand-primary/30">
            <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center text-brand-primary justify-center border border-brand-primary/30 animate-float">
              <CheckCircle size={44} />
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-2 text-brand-text-primary">{t.successTitle}</h3>
              <p className="text-brand-text-muted text-sm md:text-base leading-relaxed max-w-[500px] mx-auto">
                {t.successDesc.replace("{email}", successData.data.email)}
              </p>
            </div>

            <div className="w-full bg-brand-bg-dark/50 border border-brand-border rounded-lg p-4 text-sm text-left">
              <p className="font-bold mb-2 border-b border-brand-border/50 pb-1.5 text-brand-text-primary">{t.infoReceived}</p>
              {successData.type === "epr" && (
                <>
                  <p className="text-brand-text-muted mt-1">{t.companyLabel}<span className="text-brand-text-primary font-medium">{successData.data.company_name}</span></p>
                  <p className="text-brand-text-muted mt-1">{t.contactLabel}<span className="text-brand-text-primary font-medium">{successData.data.contact_name}</span></p>
                  <p className="text-brand-text-muted mt-1">{t.annualWasteLabel}<span className="text-brand-text-primary font-medium">{formatNum(successData.data.annual_plastic_waste)} kg</span></p>
                </>
              )}
              {successData.type === "green" && (
                <>
                  <p className="text-brand-text-muted mt-1">{t.customerLabel}<span className="text-brand-text-primary font-medium">{successData.data.contact_name}</span></p>
                  <p className="text-brand-text-muted mt-1">{t.installAreaLabel}<span className="text-brand-text-primary font-medium">{formatNum(successData.data.surface_area)} m²</span></p>
                  <p className="text-brand-text-muted mt-1">{t.locationLabel}<span className="text-brand-text-primary font-medium">{successData.data.location}</span></p>
                </>
              )}
              {successData.type === "collector" && (
                <>
                  <p className="text-brand-text-muted mt-1">{t.collectorLabel}<span className="text-brand-text-primary font-medium">{successData.data.name}</span></p>
                  <p className="text-brand-text-muted mt-1">{t.typeLabel}<span className="text-brand-text-primary font-medium">{successData.data.collector_type === "scrap_yard" ? t.scrapYard : t.individual}</span></p>
                  <p className="text-brand-text-muted mt-1">{t.addressLabel}<span className="text-brand-text-primary font-medium">{successData.data.address || t.notProvided}</span></p>
                </>
              )}
            </div>

            <button onClick={resetForm} className="btn-primary">
              {t.registerNewBtn}
            </button>
          </div>
        ) : (
          /* FORM SCREEN */
          <div className="glass-card p-0 overflow-hidden">
            
            {/* Tabs Headers */}
            <div className="flex flex-col sm:flex-row border-b border-brand-border">
              <button 
                onClick={() => { setActiveTab("epr"); setError(null); }}
                className={`flex-1 py-4 sm:py-5 px-4 font-bold flex items-center justify-center gap-2 text-sm font-heading transition-all duration-300 border-b-2 outline-none ${
                  activeTab === "epr"
                    ? "bg-brand-primary/5 text-brand-primary border-brand-primary"
                    : "bg-transparent text-brand-text-muted hover:text-brand-primary border-transparent"
                }`}
              >
                <Building size={16} />
                {t.tabEpr}
              </button>
              <button 
                onClick={() => { setActiveTab("green"); setError(null); }}
                className={`flex-1 py-4 sm:py-5 px-4 font-bold flex items-center justify-center gap-2 text-sm font-heading transition-all duration-300 border-b-2 outline-none ${
                  activeTab === "green"
                    ? "bg-brand-primary/5 text-brand-primary border-brand-primary"
                    : "bg-transparent text-brand-text-muted hover:text-brand-primary border-transparent"
                }`}
              >
                <Home size={16} />
                {t.tabGreen}
              </button>
              <button 
                onClick={() => { setActiveTab("collector"); setError(null); }}
                className={`flex-1 py-4 sm:py-5 px-4 font-bold flex items-center justify-center gap-2 text-sm font-heading transition-all duration-300 border-b-2 outline-none ${
                  activeTab === "collector"
                    ? "bg-brand-primary/5 text-brand-primary border-brand-primary"
                    : "bg-transparent text-brand-text-muted hover:text-brand-primary border-transparent"
                }`}
              >
                <Users size={16} />
                {t.tabCollector}
              </button>
            </div>

            {/* Forms body */}
            <div className="p-6 sm:p-8">
              
              {error && (
                <div className="flex items-center gap-2.5 p-3.5 sm:p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm mb-6">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {/* FORM 1: EPR PARTNER */}
              {activeTab === "epr" && (
                <form onSubmit={handleEprSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[13px] text-brand-text-muted block mb-1.5 font-medium">{t.companyName}</label>
                      <input required type="text" placeholder="FMCG Group" value={eprForm.company_name} onChange={(e) => setEprForm({...eprForm, company_name: e.target.value})} className="w-full py-3 px-4 rounded-lg border border-brand-border bg-brand-bg-dark/30 text-brand-text-primary placeholder-brand-text-muted/40 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none text-[15px] font-body transition-all" />
                    </div>
                    <div>
                      <label className="text-[13px] text-brand-text-muted block mb-1.5 font-medium">{t.contactPerson}</label>
                      <input required type="text" placeholder="Nguyễn Văn A" value={eprForm.contact_name} onChange={(e) => setEprForm({...eprForm, contact_name: e.target.value})} className="w-full py-3 px-4 rounded-lg border border-brand-border bg-brand-bg-dark/30 text-brand-text-primary placeholder-brand-text-muted/40 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none text-[15px] font-body transition-all" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[13px] text-brand-text-muted block mb-1.5 font-medium">{t.emailLabel}</label>
                      <input required type="email" placeholder="partner@fmcg.com" value={eprForm.email} onChange={(e) => setEprForm({...eprForm, email: e.target.value})} className="w-full py-3 px-4 rounded-lg border border-brand-border bg-brand-bg-dark/30 text-brand-text-primary placeholder-brand-text-muted/40 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none text-[15px] font-body transition-all" />
                    </div>
                    <div>
                      <label className="text-[13px] text-brand-text-muted block mb-1.5 font-medium">{t.phoneLabel}</label>
                      <input required type="tel" placeholder="0901234567" value={eprForm.phone} onChange={(e) => setEprForm({...eprForm, phone: e.target.value})} className="w-full py-3 px-4 rounded-lg border border-brand-border bg-brand-bg-dark/30 text-brand-text-primary placeholder-brand-text-muted/40 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none text-[15px] font-body transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[13px] text-brand-text-muted block mb-1.5 font-medium">{t.annualPlastic}</label>
                    <input required type="number" min="1" value={eprForm.annual_plastic_waste} onChange={(e) => setEprForm({...eprForm, annual_plastic_waste: parseInt(e.target.value) || 0})} className="w-full py-3 px-4 rounded-lg border border-brand-border bg-brand-bg-dark/30 text-brand-text-primary placeholder-brand-text-muted/40 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none text-[15px] font-body transition-all" />
                  </div>
                  <div className="flex items-start sm:items-center gap-2.5 mt-1">
                    <input type="checkbox" id="needs_epr" checked={eprForm.needs_epr_cert} onChange={(e) => setEprForm({...eprForm, needs_epr_cert: e.target.checked})} className="w-[18px] h-[18px] rounded border-brand-border text-brand-primary accent-brand-primary cursor-pointer mt-0.5 sm:mt-0" />
                    <label htmlFor="needs_epr" className="text-sm text-brand-text-muted cursor-pointer select-none">
                      {t.requestEpr}
                    </label>
                  </div>
                  
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-3 h-12 flex items-center gap-2">
                    {loading ? t.processing : t.eprSubmitBtn}
                    <Send size={16} />
                  </button>
                </form>
              )}

              {/* FORM 2: GREEN PROJECT */}
              {activeTab === "green" && (
                <form onSubmit={handleGreenSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[13px] text-brand-text-muted block mb-1.5 font-medium">{t.architectName}</label>
                      <input required type="text" placeholder="Trần Minh B" value={greenForm.contact_name} onChange={(e) => setGreenForm({...greenForm, contact_name: e.target.value})} className="w-full py-3 px-4 rounded-lg border border-brand-border bg-brand-bg-dark/30 text-brand-text-primary placeholder-brand-text-muted/40 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none text-[15px] font-body transition-all" />
                    </div>
                    <div>
                      <label className="text-[13px] text-brand-text-muted block mb-1.5 font-medium">{t.phoneLabel}</label>
                      <input required type="tel" placeholder="0918765432" value={greenForm.phone} onChange={(e) => setGreenForm({...greenForm, phone: e.target.value})} className="w-full py-3 px-4 rounded-lg border border-brand-border bg-brand-bg-dark/30 text-brand-text-primary placeholder-brand-text-muted/40 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none text-[15px] font-body transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[13px] text-brand-text-muted block mb-1.5 font-medium">{t.emailLabel}</label>
                    <input required type="email" placeholder="architect@greenstudio.vn" value={greenForm.email} onChange={(e) => setGreenForm({...greenForm, email: e.target.value})} className="w-full py-3 px-4 rounded-lg border border-brand-border bg-brand-bg-dark/30 text-brand-text-primary placeholder-brand-text-muted/40 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none text-[15px] font-body transition-all" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[13px] text-brand-text-muted block mb-1.5 font-medium">{t.surfaceArea}</label>
                      <input required type="number" min="1" value={greenForm.surface_area} onChange={(e) => setGreenForm({...greenForm, surface_area: parseFloat(e.target.value) || 0})} className="w-full py-3 px-4 rounded-lg border border-brand-border bg-brand-bg-dark/30 text-brand-text-primary placeholder-brand-text-muted/40 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none text-[15px] font-body transition-all" />
                    </div>
                    <div>
                      <label className="text-[13px] text-brand-text-muted block mb-1.5 font-medium">{t.constructionLocation}</label>
                      <input required type="text" placeholder="Quận 2, TP. Hồ Chí Minh" value={greenForm.location} onChange={(e) => setGreenForm({...greenForm, location: e.target.value})} className="w-full py-3 px-4 rounded-lg border border-brand-border bg-brand-bg-dark/30 text-brand-text-primary placeholder-brand-text-muted/40 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none text-[15px] font-body transition-all" />
                    </div>
                  </div>
                  <div className="flex items-start sm:items-center gap-2.5 mt-1">
                    <input type="checkbox" id="ventilation" checked={greenForm.ventilation_consult} onChange={(e) => setGreenForm({...greenForm, ventilation_consult: e.target.checked})} className="w-[18px] h-[18px] rounded border-brand-border text-brand-primary accent-brand-primary cursor-pointer mt-0.5 sm:mt-0" />
                    <label htmlFor="ventilation" className="text-sm text-brand-text-muted cursor-pointer select-none">
                      {t.ventilationRequest}
                    </label>
                  </div>
                  
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-3 h-12 flex items-center gap-2">
                    {loading ? t.processing : t.greenSubmitBtn}
                    <Send size={16} />
                  </button>
                </form>
              )}

              {/* FORM 3: COLLECTOR */}
              {activeTab === "collector" && (
                <form onSubmit={handleCollectorSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[13px] text-brand-text-muted block mb-1.5 font-medium">{t.collectorName}</label>
                      <input required type="text" placeholder="Vựa ve chai Hoàng" value={collectorForm.name} onChange={(e) => setCollectorForm({...collectorForm, name: e.target.value})} className="w-full py-3 px-4 rounded-lg border border-brand-border bg-brand-bg-dark/30 text-brand-text-primary placeholder-brand-text-muted/40 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none text-[15px] font-body transition-all" />
                    </div>
                    <div>
                      <label className="text-[13px] text-brand-text-muted block mb-1.5 font-medium">{t.collectorType}</label>
                      <select value={collectorForm.collector_type} onChange={(e) => setCollectorForm({...collectorForm, collector_type: e.target.value})} className="w-full py-3 px-4 rounded-lg border border-brand-border bg-brand-bg-dark/30 text-brand-text-primary outline-none text-[15px] font-body transition-all cursor-pointer focus:border-brand-primary focus:ring-1 focus:ring-brand-primary">
                        <option value="scrap_yard" className="bg-white text-brand-text-primary">{t.collectorYardOpt}</option>
                        <option value="individual" className="bg-white text-brand-text-primary">{t.collectorIndivOpt}</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[13px] text-brand-text-muted block mb-1.5 font-medium">{t.emailLabel}</label>
                      <input required type="email" placeholder="vechai.quan5@gmail.com" value={collectorForm.email} onChange={(e) => setCollectorForm({...collectorForm, email: e.target.value})} className="w-full py-3 px-4 rounded-lg border border-brand-border bg-brand-bg-dark/30 text-brand-text-primary placeholder-brand-text-muted/40 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none text-[15px] font-body transition-all" />
                    </div>
                    <div>
                      <label className="text-[13px] text-brand-text-muted block mb-1.5 font-medium">{t.phoneLabel}</label>
                      <input required type="tel" placeholder="0988776655" value={collectorForm.phone} onChange={(e) => setCollectorForm({...collectorForm, phone: e.target.value})} className="w-full py-3 px-4 rounded-lg border border-brand-border bg-brand-bg-dark/30 text-brand-text-primary placeholder-brand-text-muted/40 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none text-[15px] font-body transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[13px] text-brand-text-muted block mb-1.5 font-medium">{t.addressInputLabel}</label>
                    <input type="text" placeholder="123 Hùng Vương, Quận 5, TP.HCM" value={collectorForm.address} onChange={(e) => setCollectorForm({...collectorForm, address: e.target.value})} className="w-full py-3 px-4 rounded-lg border border-brand-border bg-brand-bg-dark/30 text-brand-text-primary placeholder-brand-text-muted/40 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none text-[15px] font-body transition-all" />
                  </div>
                  
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-3 h-12 flex items-center gap-2">
                    {loading ? t.processing : t.collectorSubmitBtn}
                    <Send size={16} />
                  </button>
                </form>
              )}

            </div>
          </div>
        )}
      </div>
    </section>
  );
}
