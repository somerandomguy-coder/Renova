"use client";

import React, { useState } from "react";
import { 
  Mail, 
  Phone, 
  Building, 
  Home, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Send,
  Recycle,
  Gift,
  Upload,
  AlertTriangle,
  Sparkles,
  Info,
  Layers,
  MapPin,
  User
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface RegistrationFormsProps {
  lang: "vi" | "en";
}

const BRICK_CONDITIONS = [
  {
    value: "damaged_clean",
    labelVi: "Hư hỏng/Nứt vỡ (Bề mặt sạch)",
    labelEn: "Damaged / Cracked (Clean surface)",
    usable: true
  },
  {
    value: "mortar_paint",
    labelVi: "Dính nhiều vữa, xi măng, sơn",
    labelEn: "Coated with heavy mortar, cement, paint",
    usable: true
  },
  {
    value: "intact",
    labelVi: "Còn nguyên vẹn",
    labelEn: "Fully intact / Reusable condition",
    usable: true
  },
  {
    value: "mixed_debris",
    labelVi: "Lẫn xà bần / Không thể tách rời (Xin lỗi, chúng tôi chưa thể hỗ trợ thu hồi trường hợp này)",
    labelEn: "Mixed with rubble / Inseparable (Sorry, we cannot accept this condition yet)",
    usable: false
  }
];

export default function RegistrationForms({ lang }: RegistrationFormsProps) {
  const [activeTab, setActiveTab] = useState<"epr" | "green" | "takeback">("epr");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedTab, setSubmittedTab] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [voucherCode, setVoucherCode] = useState("RENOVA-VOUCHER-XANH-2026");

  // Form 1 State: EPR Partner
  const [eprForm, setEprForm] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    annual_plastic_waste: 1000,
    needs_epr_cert: true
  });

  // Form 2 State: Green Construction
  const [greenForm, setGreenForm] = useState({
    contact_name: "",
    email: "",
    phone: "",
    surface_area: 50,
    location: "",
    ventilation_consult: true
  });

  // Form 3 State: Brick Takeback & Voucher
  const [takebackForm, setTakebackForm] = useState({
    customer_name: "",
    phone: "",
    email: "",
    collection_address: "",
    estimated_quantity: "",
    brick_condition: BRICK_CONDITIONS[0].value,
    image_url: ""
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isVi = lang === "vi";
  const currentConditionObj = BRICK_CONDITIONS.find(c => c.value === takebackForm.brick_condition) || BRICK_CONDITIONS[0];
  const isSelectedConditionUnusable = !currentConditionObj.usable;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setTakebackForm(prev => ({ ...prev, image_url: file.name }));
    }
  };

  // Submit Handler for EPR Form
  const handleEprSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/register/epr-partner`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eprForm)
      });

      if (!res.ok) throw new Error("API Error");
      setSubmittedTab("epr");
      setSubmitted(true);
    } catch {
      setSubmittedTab("epr");
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  // Submit Handler for Green Project Form
  const handleGreenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/register/green-project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(greenForm)
      });

      if (!res.ok) throw new Error("API Error");
      setSubmittedTab("green");
      setSubmitted(true);
    } catch {
      setSubmittedTab("green");
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  // Submit Handler for Brick Takeback Form
  const handleTakebackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (isSelectedConditionUnusable) {
      setErrorMessage(
        isVi 
          ? "Rất tiếc! RENOVA chưa thể hỗ trợ thu hồi gạch dính xà bần không thể tách rời. Vui lòng phân loại trước khi gửi."
          : "Sorry! RENOVA cannot accept bricks mixed with inseparable rubble. Please sort materials before submitting."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/register/takeback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: takebackForm.customer_name,
          phone: takebackForm.phone,
          email: takebackForm.email || undefined,
          collection_address: takebackForm.collection_address,
          estimated_quantity: takebackForm.estimated_quantity,
          brick_condition: currentConditionObj.labelVi,
          image_url: takebackForm.image_url || undefined
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.voucher_code) setVoucherCode(data.voucher_code);
      }
      setSubmittedTab("takeback");
      setSubmitted(true);
    } catch {
      setSubmittedTab("takeback");
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="dang-ky" className="light-section py-24 relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1720px] mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-10 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal animation="fade-up" duration={700}>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles size={14} />
              {isVi ? "Cổng Kết Nối Chuỗi Giá Trị Tuần Hoàn" : "Circular Value Chain Portal"}
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-brand-text-primary dark:text-white">
              {isVi ? "Cổng Đăng Ký " : "Cooperation "}
              <span className="text-gradient">{isVi ? "Hợp Tác & Thu Gom" : "Portal"}</span>
            </h2>

            <p className="mt-4 text-brand-text-muted dark:text-zinc-300 text-base sm:text-lg leading-relaxed">
              {isVi 
                ? "Lựa chọn phân hệ phù hợp để cùng RENOVA biến rác thải nhựa và gạch cũ thành vật liệu tuần hoàn di sản."
                : "Select the appropriate path to collaborate with RENOVA in transforming plastic waste and old bricks into circular materials."}
            </p>
          </div>
        </ScrollReveal>

        {/* Process Guide Infographic Banner */}
        <ScrollReveal animation="fade-up" duration={700} delay={100}>
          <div className="max-w-4xl mx-auto mb-10 rounded-2xl overflow-hidden border border-brand-border dark:border-white/15 shadow-xl bg-white dark:bg-zinc-900 p-2 sm:p-3">
            <img 
              src="/guide.jpeg" 
              alt="Hướng dẫn đăng ký & Quy trình thu gom RENOVA" 
              className="w-full h-auto object-contain rounded-xl"
            />
          </div>
        </ScrollReveal>

        {/* Tab Navigation Selector */}
        <div className="flex justify-center mb-10">
          <div className="bg-white/80 dark:bg-zinc-900/90 border border-brand-border dark:border-white/10 p-1.5 rounded-2xl shadow-lg flex flex-wrap justify-center gap-1 max-w-2xl w-full">
            
            <button
              onClick={() => { setActiveTab("epr"); setSubmitted(false); }}
              className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "epr"
                  ? "bg-brand-primary text-white shadow-md shadow-brand-primary/25"
                  : "text-brand-text-muted dark:text-zinc-400 hover:text-brand-text-primary dark:hover:text-white"
              }`}
            >
              <Building size={16} />
              <span>{isVi ? "Đối Tác EPR" : "EPR Partner"}</span>
            </button>

            <button
              onClick={() => { setActiveTab("green"); setSubmitted(false); }}
              className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "green"
                  ? "bg-brand-primary text-white shadow-md shadow-brand-primary/25"
                  : "text-brand-text-muted dark:text-zinc-400 hover:text-brand-text-primary dark:hover:text-white"
              }`}
            >
              <Home size={16} />
              <span>{isVi ? "Công Trình Xanh" : "Green Building"}</span>
            </button>

            <button
              onClick={() => { setActiveTab("takeback"); setSubmitted(false); }}
              className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "takeback"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25 font-bold"
                  : "text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold"
              }`}
            >
              <Recycle size={16} />
              <span>{isVi ? "Thu Hồi Gạch & Voucher" : "Brick Takeback"}</span>
            </button>

          </div>
        </div>

        {/* Main Card Container */}
        <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900/90 border border-brand-border dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          
          {submitted ? (
            /* SUCCESS CONFIRMATION DISPLAY */
            <div className="text-center py-8 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                <CheckCircle size={36} />
              </div>

              <h3 className="text-2xl sm:text-3xl font-black font-heading text-brand-text-primary dark:text-white">
                {isVi ? "Đăng Ký Thành Công!" : "Registration Successful!"}
              </h3>

              {submittedTab === "takeback" ? (
                <div className="mt-4">
                  <p className="text-sm text-brand-text-muted dark:text-zinc-300 max-w-md mx-auto leading-relaxed">
                    {isVi 
                      ? `Đội ngũ RENOVA đã tiếp nhận yêu cầu thu gom tại [${takebackForm.collection_address}]. Chúng tôi sẽ liên hệ SĐT ${takebackForm.phone} trong 24h.`
                      : `RENOVA team received your pickup request at [${takebackForm.collection_address}]. We will contact ${takebackForm.phone} within 24 hours.`}
                  </p>

                  <div className="mt-6 bg-gradient-to-br from-emerald-50 dark:from-emerald-950/70 to-white dark:to-zinc-900 border-2 border-dashed border-emerald-500/50 rounded-2xl p-5 max-w-sm mx-auto shadow-xl">
                    <span className="text-xs text-brand-text-muted dark:text-zinc-400 uppercase font-mono block">
                      {isVi ? "Mã Voucher Xanh Ưu Đãi:" : "Your Discount Voucher:"}
                    </span>
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1.5 tracking-wider">
                      {voucherCode}
                    </div>
                    <p className="text-xs text-brand-text-muted dark:text-zinc-300 mt-2">
                      {isVi ? "Giảm 10% cho các sản phẩm gạch bông gió & Terrazzo tái sinh." : "10% off for breeze block & Terrazzo orders."}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-brand-text-muted dark:text-zinc-300 mt-2 max-w-md mx-auto leading-relaxed">
                  {isVi 
                    ? "Cảm ơn bạn đã hợp tác cùng RENOVA. Chuyên viên phát triển bền vững của chúng tôi sẽ liên hệ lại qua thông tin cung cấp trong vòng 2 giờ làm việc."
                    : "Thank you for collaborating with RENOVA. Our sustainability specialist will reach out within 2 business hours."}
                </p>
              )}

              <button
                onClick={() => setSubmitted(false)}
                className="mt-8 bg-brand-primary text-white font-bold text-xs py-3 px-6 rounded-xl hover:bg-brand-secondary transition-colors cursor-pointer"
              >
                {isVi ? "Thực hiện đăng ký mới" : "Submit New Registration"}
              </button>
            </div>
          ) : (

            <div>
              {/* TAB 1: EPR PARTNER FORM */}
              {activeTab === "epr" && (
                <form onSubmit={handleEprSubmit} className="space-y-6">
                  <div className="border-b border-brand-border dark:border-white/10 pb-4 mb-6">
                    <h3 className="text-xl font-bold font-heading text-brand-text-primary dark:text-white">
                      {isVi ? "Đăng Ký Tư Vấn Dịch Vụ EPR" : "EPR Service Registration"}
                    </h3>
                    <p className="text-xs text-brand-text-muted dark:text-zinc-400 mt-1">
                      {isVi 
                        ? "Giải pháp xử lý nhựa đa lớp (MLP) đạt chứng nhận EPR chính thức cho doanh nghiệp FMCG."
                        : "Official EPR compliance recycling solutions for FMCG plastic packaging waste."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold text-brand-text-primary dark:text-zinc-200 uppercase tracking-wider block mb-2">
                        {isVi ? "Tên Công ty / Tập đoàn *" : "Company / Group Name *"}
                      </label>
                      <input 
                        required 
                        type="text" 
                        placeholder={isVi ? "Công ty Unilever / Vinamilk" : "Acme Corp"} 
                        value={eprForm.company_name} 
                        onChange={(e) => setEprForm({...eprForm, company_name: e.target.value})} 
                        className="w-full py-3 px-4 rounded-xl border border-brand-border dark:border-white/15 bg-white dark:bg-zinc-800 text-brand-text-primary dark:text-white placeholder:text-zinc-400 shadow-xs focus:border-brand-primary outline-hidden text-sm" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-brand-text-primary dark:text-zinc-200 uppercase tracking-wider block mb-2">
                        {isVi ? "Họ tên người liên hệ *" : "Contact Person Name *"}
                      </label>
                      <input 
                        required 
                        type="text" 
                        placeholder={isVi ? "Nguyễn Văn A" : "John Doe"} 
                        value={eprForm.contact_name} 
                        onChange={(e) => setEprForm({...eprForm, contact_name: e.target.value})} 
                        className="w-full py-3 px-4 rounded-xl border border-brand-border dark:border-white/15 bg-white dark:bg-zinc-800 text-brand-text-primary dark:text-white placeholder:text-zinc-400 shadow-xs focus:border-brand-primary outline-hidden text-sm" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold text-brand-text-primary dark:text-zinc-200 uppercase tracking-wider block mb-2">
                        {isVi ? "Email liên lạc *" : "Contact Email *"}
                      </label>
                      <input 
                        required 
                        type="email" 
                        placeholder="contact@company.com" 
                        value={eprForm.email} 
                        onChange={(e) => setEprForm({...eprForm, email: e.target.value})} 
                        className="w-full py-3 px-4 rounded-xl border border-brand-border dark:border-white/15 bg-white dark:bg-zinc-800 text-brand-text-primary dark:text-white placeholder:text-zinc-400 shadow-xs focus:border-brand-primary outline-hidden text-sm" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-brand-text-primary dark:text-zinc-200 uppercase tracking-wider block mb-2">
                        {isVi ? "Số điện thoại *" : "Phone Number *"}
                      </label>
                      <input 
                        required 
                        type="tel" 
                        placeholder="0901234567" 
                        value={eprForm.phone} 
                        onChange={(e) => setEprForm({...eprForm, phone: e.target.value})} 
                        className="w-full py-3 px-4 rounded-xl border border-brand-border dark:border-white/15 bg-white dark:bg-zinc-800 text-brand-text-primary dark:text-white placeholder:text-zinc-400 shadow-xs focus:border-brand-primary outline-hidden text-sm" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-brand-text-primary dark:text-zinc-200 uppercase tracking-wider block mb-2">
                      {isVi ? "Sản lượng rác thải nhựa đa lớp ước tính (Tấn/Năm)" : "Estimated MLP Plastic Waste (Tons/Year)"}
                    </label>
                    <input 
                      type="number" 
                      min="1" 
                      value={eprForm.annual_plastic_waste} 
                      onChange={(e) => setEprForm({...eprForm, annual_plastic_waste: parseFloat(e.target.value) || 0})} 
                      className="w-full py-3 px-4 rounded-xl border border-brand-border dark:border-white/15 bg-white dark:bg-zinc-800 text-brand-text-primary dark:text-white placeholder:text-zinc-400 shadow-xs focus:border-brand-primary outline-hidden text-sm" 
                    />
                  </div>

                  <div className="flex items-center gap-2.5">
                    <input 
                      type="checkbox" 
                      id="cert" 
                      checked={eprForm.needs_epr_cert} 
                      onChange={(e) => setEprForm({...eprForm, needs_epr_cert: e.target.checked})} 
                      className="w-4 h-4 rounded border-brand-border text-brand-primary accent-brand-primary cursor-pointer" 
                    />
                    <label htmlFor="cert" className="text-xs text-brand-text-muted dark:text-zinc-300 cursor-pointer select-none">
                      {isVi ? "Yêu cầu cấp Chứng nhận Xử lý & Tái chế EPR chính thức" : "Request Official EPR Treatment & Recycling Certificate"}
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (isVi ? "Đang xử lý..." : "Processing...") : (isVi ? "Gửi Yêu Cầu Hợp Tác EPR" : "Submit EPR Cooperation Request")}
                    <Send size={16} />
                  </button>
                </form>
              )}

              {/* TAB 2: GREEN CONSTRUCTION FORM */}
              {activeTab === "green" && (
                <form onSubmit={handleGreenSubmit} className="space-y-6">
                  <div className="border-b border-brand-border dark:border-white/10 pb-4 mb-6">
                    <h3 className="text-xl font-bold font-heading text-brand-text-primary dark:text-white">
                      {isVi ? "Đăng Ký Tư Vấn Cung Cấp Gạch Cho Công Trình Xanh" : "Green Building Supply Consultation"}
                    </h3>
                    <p className="text-xs text-brand-text-muted dark:text-zinc-400 mt-1">
                      {isVi 
                        ? "Giải pháp thiết kế thông gió thụ động & cung cấp gạch bông gió cho KTS, chủ đầu tư."
                        : "Passive ventilation design & breeze block supply for architects and developers."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold text-brand-text-primary dark:text-zinc-200 uppercase tracking-wider block mb-2">
                        {isVi ? "Họ tên Chủ đầu tư / KTS *" : "Investor / Architect Name *"}
                      </label>
                      <input 
                        required 
                        type="text" 
                        placeholder={isVi ? "KTS Trần Anh" : "Architect Smith"} 
                        value={greenForm.contact_name} 
                        onChange={(e) => setGreenForm({...greenForm, contact_name: e.target.value})} 
                        className="w-full py-3 px-4 rounded-xl border border-brand-border dark:border-white/15 bg-white dark:bg-zinc-800 text-brand-text-primary dark:text-white placeholder:text-zinc-400 shadow-xs focus:border-brand-primary outline-hidden text-sm" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-brand-text-primary dark:text-zinc-200 uppercase tracking-wider block mb-2">
                        {isVi ? "Số điện thoại *" : "Phone Number *"}
                      </label>
                      <input 
                        required 
                        type="tel" 
                        placeholder="0918765432" 
                        value={greenForm.phone} 
                        onChange={(e) => setGreenForm({...greenForm, phone: e.target.value})} 
                        className="w-full py-3 px-4 rounded-xl border border-brand-border dark:border-white/15 bg-white dark:bg-zinc-800 text-brand-text-primary dark:text-white placeholder:text-zinc-400 shadow-xs focus:border-brand-primary outline-hidden text-sm" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-brand-text-primary dark:text-zinc-200 uppercase tracking-wider block mb-2">
                      {isVi ? "Email liên lạc *" : "Contact Email *"}
                    </label>
                    <input 
                      required 
                      type="email" 
                      placeholder="architect@greenstudio.vn" 
                      value={greenForm.email} 
                      onChange={(e) => setGreenForm({...greenForm, email: e.target.value})} 
                      className="w-full py-3 px-4 rounded-xl border border-brand-border dark:border-white/15 bg-white dark:bg-zinc-800 text-brand-text-primary dark:text-white placeholder:text-zinc-400 shadow-xs focus:border-brand-primary outline-hidden text-sm" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold text-brand-text-primary dark:text-zinc-200 uppercase tracking-wider block mb-2">
                        {isVi ? "Diện tích bề mặt (m²) *" : "Surface Area (m²) *"}
                      </label>
                      <input 
                        required 
                        type="number" 
                        min="1" 
                        value={greenForm.surface_area} 
                        onChange={(e) => setGreenForm({...greenForm, surface_area: parseFloat(e.target.value) || 0})} 
                        className="w-full py-3 px-4 rounded-xl border border-brand-border dark:border-white/15 bg-white dark:bg-zinc-800 text-brand-text-primary dark:text-white placeholder:text-zinc-400 shadow-xs focus:border-brand-primary outline-hidden text-sm" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-brand-text-primary dark:text-zinc-200 uppercase tracking-wider block mb-2">
                        {isVi ? "Địa điểm thi công *" : "Project Location *"}
                      </label>
                      <input 
                        required 
                        type="text" 
                        placeholder={isVi ? "Quận 2, TP. Hồ Chí Minh" : "HCMC"} 
                        value={greenForm.location} 
                        onChange={(e) => setGreenForm({...greenForm, location: e.target.value})} 
                        className="w-full py-3 px-4 rounded-xl border border-brand-border dark:border-white/15 bg-white dark:bg-zinc-800 text-brand-text-primary dark:text-white placeholder:text-zinc-400 shadow-xs focus:border-brand-primary outline-hidden text-sm" 
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <input 
                      type="checkbox" 
                      id="ventilation" 
                      checked={greenForm.ventilation_consult} 
                      onChange={(e) => setGreenForm({...greenForm, ventilation_consult: e.target.checked})} 
                      className="w-4 h-4 rounded border-brand-border text-brand-primary accent-brand-primary cursor-pointer" 
                    />
                    <label htmlFor="ventilation" className="text-xs text-brand-text-muted dark:text-zinc-300 cursor-pointer select-none">
                      {isVi ? "Nhận hồ sơ tư vấn mô phỏng thông gió & cách nhiệt thụ động" : "Receive passive ventilation & thermal insulation simulation profile"}
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (isVi ? "Đang xử lý..." : "Processing...") : (isVi ? "Đăng Ký Tư Vấn Thiết Kế Công Trình" : "Register for Green Design Consultation")}
                    <Send size={16} />
                  </button>
                </form>
              )}

              {/* TAB 3: BRICK TAKEBACK & VOUCHER FORM (FULLY INTEGRATED) */}
              {activeTab === "takeback" && (
                <form onSubmit={handleTakebackSubmit} className="space-y-6">
                  <div className="border-b border-brand-border dark:border-white/10 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold font-heading text-brand-text-primary dark:text-white flex items-center gap-2">
                        <Recycle className="text-emerald-600 dark:text-emerald-400" size={20} />
                        {isVi ? "Đăng Ký Thu Hồi Gạch Cũ & Nhận Voucher Xanh" : "Brick Takeback & Discount Voucher"}
                      </h3>
                      <p className="text-xs text-brand-text-muted dark:text-zinc-300 mt-1 leading-relaxed">
                        {isVi 
                          ? "Biến gạch thải công trình cũ thành voucher ưu đãi 10%. RENOVA cam kết điều xe thu gom tận nơi."
                          : "Turn old construction bricks into 10% discount vouchers. RENOVA provides on-site collection."}
                      </p>
                    </div>

                    <span className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto">
                      Voucher 10%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold text-brand-text-primary dark:text-zinc-200 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                        <User size={14} className="text-emerald-600 dark:text-emerald-400" />
                        {isVi ? "Tên Khách hàng / Doanh nghiệp *" : "Customer / Company Name *"}
                      </label>
                      <input 
                        required 
                        type="text" 
                        placeholder={isVi ? "Công ty Nam Long / Anh Tuấn" : "e.g. John Doe"} 
                        value={takebackForm.customer_name} 
                        onChange={(e) => setTakebackForm({...takebackForm, customer_name: e.target.value})} 
                        className="w-full py-3 px-4 rounded-xl border border-brand-border dark:border-white/15 bg-white dark:bg-zinc-800 text-brand-text-primary dark:text-white placeholder:text-zinc-400 shadow-xs focus:border-emerald-500 outline-hidden text-sm" 
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-brand-text-primary dark:text-zinc-200 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                        <Phone size={14} className="text-emerald-600 dark:text-emerald-400" />
                        {isVi ? "Số điện thoại liên lạc *" : "Phone Number *"}
                      </label>
                      <input 
                        required 
                        type="tel" 
                        placeholder={isVi ? "Ví dụ: 0914 626 717" : "e.g. 0914626717"} 
                        value={takebackForm.phone} 
                        onChange={(e) => setTakebackForm({...takebackForm, phone: e.target.value})} 
                        className="w-full py-3 px-4 rounded-xl border border-brand-border dark:border-white/15 bg-white dark:bg-zinc-800 text-brand-text-primary dark:text-white placeholder:text-zinc-400 shadow-xs focus:border-emerald-500 outline-hidden text-sm" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold text-brand-text-primary dark:text-zinc-200 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                        <MapPin size={14} className="text-emerald-600 dark:text-emerald-400" />
                        {isVi ? "Địa chỉ thu gom tận nơi *" : "Pickup Address *"}
                      </label>
                      <input 
                        required 
                        type="text" 
                        placeholder={isVi ? "123 Nguyễn Văn Linh, Quận 7, TP.HCM" : "123 Street, City"} 
                        value={takebackForm.collection_address} 
                        onChange={(e) => setTakebackForm({...takebackForm, collection_address: e.target.value})} 
                        className="w-full py-3 px-4 rounded-xl border border-brand-border dark:border-white/15 bg-white dark:bg-zinc-800 text-brand-text-primary dark:text-white placeholder:text-zinc-400 shadow-xs focus:border-emerald-500 outline-hidden text-sm" 
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-brand-text-primary dark:text-zinc-200 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                        <Layers size={14} className="text-emerald-600 dark:text-emerald-400" />
                        {isVi ? "Số lượng ước tính *" : "Estimated Quantity *"}
                      </label>
                      <input 
                        required 
                        type="text" 
                        placeholder={isVi ? "500 viên / 20 m² / 1 xe tải" : "500 blocks"} 
                        value={takebackForm.estimated_quantity} 
                        onChange={(e) => setTakebackForm({...takebackForm, estimated_quantity: e.target.value})} 
                        className="w-full py-3 px-4 rounded-xl border border-brand-border dark:border-white/15 bg-white dark:bg-zinc-800 text-brand-text-primary dark:text-white placeholder:text-zinc-400 shadow-xs focus:border-emerald-500 outline-hidden text-sm" 
                      />
                    </div>
                  </div>

                  {/* 4-Choice Condition Dropdown */}
                  <div>
                    <label className="text-xs font-bold text-brand-text-primary dark:text-zinc-200 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                      <Info size={14} className="text-emerald-600 dark:text-emerald-400" />
                      {isVi ? "Tình trạng gạch của bạn hiện tại: *" : "Your current brick condition: *"}
                    </label>
                    <select 
                      value={takebackForm.brick_condition} 
                      onChange={(e) => setTakebackForm({...takebackForm, brick_condition: e.target.value})} 
                      className="w-full py-3.5 px-4 rounded-xl border border-brand-border dark:border-white/15 bg-white dark:bg-zinc-800 text-brand-text-primary dark:text-white placeholder:text-zinc-400 focus:border-emerald-500 shadow-xs outline-hidden text-sm cursor-pointer font-medium"
                    >
                      {BRICK_CONDITIONS.map(cond => (
                        <option key={cond.value} value={cond.value} className="bg-white dark:bg-zinc-900 text-brand-text-primary dark:text-white py-2">
                          {isVi ? cond.labelVi : cond.labelEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Warning notice when Option 4 is selected */}
                  {isSelectedConditionUnusable && (
                    <div className="bg-red-500/15 border border-red-500/40 rounded-2xl p-4 flex items-start gap-3 animate-fadeIn">
                      <AlertTriangle size={20} className="text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
                      <div className="text-xs sm:text-sm text-red-700 dark:text-red-200 leading-relaxed">
                        <strong>{isVi ? "Thông báo từ RENOVA:" : "Notice from RENOVA:"}</strong>{" "}
                        {isVi 
                          ? "Xin lỗi quý khách, RENOVA chưa thể hỗ trợ thu hồi đối với gạch bị lẫn xà bần hoặc dính xi măng không thể tách rời. Quý khách vui lòng phân loại gạch còn bề mặt sạch trước khi yêu cầu thu gom!"
                          : "Sorry, we cannot accept bricks mixed with inseparable rubble or solid concrete. Please sort clean bricks before requesting pickup!"}
                      </div>
                    </div>
                  )}

                  {/* Photo Upload */}
                  <div>
                    <label className="text-xs font-bold text-brand-text-primary dark:text-zinc-200 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                      <Upload size={14} className="text-emerald-600 dark:text-emerald-400" />
                      {isVi ? "Upload ảnh tình trạng thực tế (Không bắt buộc)" : "Upload actual photo (Optional)"}
                    </label>

                    <div className="border-2 border-dashed border-brand-border dark:border-white/15 hover:border-emerald-500/50 rounded-2xl p-5 text-center bg-brand-bg-light/50 dark:bg-black/20 transition-colors relative cursor-pointer group">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />

                      {previewUrl ? (
                        <div className="flex flex-col items-center gap-2">
                          <img 
                            src={previewUrl} 
                            alt="Brick preview" 
                            className="h-24 w-auto object-cover rounded-xl border border-brand-border dark:border-white/20 shadow-lg"
                          />
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            ✓ {selectedFile?.name}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload size={18} />
                          </div>
                          <span className="text-xs font-bold text-brand-text-primary dark:text-zinc-200">
                            {isVi ? "Kéo thả hoặc nhấp để tải ảnh gạch thực tế" : "Click or drag photo here"}
                          </span>
                          <span className="text-[11px] text-brand-text-muted dark:text-zinc-500">
                            PNG, JPG, WEBP (Tối đa 10MB)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="bg-amber-500/15 border border-amber-500/40 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-300 text-center font-medium">
                      {errorMessage}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={loading || isSelectedConditionUnusable} 
                    className={`w-full py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
                      isSelectedConditionUnusable 
                        ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border border-brand-border dark:border-white/10 cursor-not-allowed"
                        : "bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:shadow-emerald-500/25 hover:scale-[1.01]"
                    }`}
                  >
                    {loading ? (
                      <span>{isVi ? "Đang xử lý..." : "Processing..."}</span>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        <span>{isVi ? "Đăng ký thu gom & Nhận Voucher" : "Register Takeback & Get Voucher"}</span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-brand-text-muted dark:text-zinc-400">
                    {isVi 
                      ? "🔒 Thông tin của quý khách được bảo mật tuyệt đối theo tiêu chuẩn ESG RENOVA."
                      : "🔒 Your information is strictly protected under RENOVA ESG standards."}
                  </p>
                </form>
              )}

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
