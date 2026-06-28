"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  LayoutDashboard, 
  Building2, 
  Leaf, 
  Truck, 
  LogOut, 
  Search, 
  Filter, 
  Download, 
  Mail, 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  Send, 
  X, 
  AlertCircle, 
  Sparkles, 
  ChevronRight,
  Database,
  Building,
  User,
  Inbox
} from "lucide-react";

// --- Types ---
interface EPRPartner {
  id: number;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  annual_plastic_waste: number;
  needs_epr_cert: boolean;
  status: string;
  created_at: string;
}

interface GreenProject {
  id: number;
  contact_name: string;
  email: string;
  phone: string;
  surface_area: number;
  location: string;
  ventilation_consult: boolean;
  status: string;
  created_at: string;
}

interface Collector {
  id: number;
  name: string;
  email: string;
  phone: string;
  collector_type: string;
  address: string;
  status: string;
  created_at: string;
}

interface ActivityItem {
  id: number;
  type: "epr" | "architecture" | "collection";
  title: string;
  subtitle: string;
  email: string;
  status: string;
  created_at: string;
}

interface StatsResponse {
  total_records: number;
  total_pending: number;
  total_success: number;
  epr_stats: { total: number; starting: number; pending: number; success: number };
  architecture_stats: { total: number; starting: number; pending: number; success: number };
  collection_stats: { total: number; starting: number; pending: number; success: number };
}

// --- Templates ---
const EMAIL_TEMPLATES = {
  epr: [
    {
      id: "epr_onboarding",
      name: "Onboarding Intake (Tiếng Việt)",
      subject: "RENOVA: Xác nhận Đăng ký Tư vấn Đối tác EPR",
      body: `Kính gửi [ContactName],

Cảm ơn công ty [CompanyName] đã đăng ký chương trình Đối tác EPR cùng RENOVA. Chúng tôi xin xác nhận thông tin đăng ký tư vấn sản lượng rác thải nhựa hàng năm là [AnnualWaste] kg.

Bộ phận kỹ thuật và pháp lý của RENOVA đang chuẩn bị hồ sơ phân tích tối ưu chi phí EPR cho doanh nghiệp của bạn. Chúng tôi sẽ liên hệ trực tiếp qua số điện thoại [Phone] trong thời gian sớm nhất để thống nhất lịch hẹn.

Trân trọng,
Ban Quản lý Chương trình RENOVA EPR.`
    },
    {
      id: "epr_followup",
      name: "Follow-up Proposal (Tiếng Việt)",
      subject: "RENOVA: Theo dõi Đề xuất Hợp tác Tối ưu EPR",
      body: `Kính gửi [ContactName],

Chúng tôi liên hệ lại để theo dõi hồ sơ Đăng ký Đối tác EPR của [CompanyName]. RENOVA đã soạn thảo bản đề xuất hợp tác thu gom nhựa MLP và tối ưu thuế phí đóng góp cho dự án.

Vui lòng phản hồi email này hoặc liên hệ lại với chúng tôi qua số điện thoại [Phone] để trao đổi chi tiết hơn về các điều khoản hợp tác.

Trân trọng,
Ban Quản lý Chương trình RENOVA EPR.`
    },
    {
      id: "epr_cert",
      name: "EPR Certificate Issuance (Song ngữ)",
      subject: "RENOVA Circular: Cấp Chứng nhận Bù đắp Dấu chân Nhựa / Plastic Footprint Offset Certificate",
      body: `Kính gửi [ContactName],

Đại diện dự án RENOVA Circular xin trân trọng gửi tới [CompanyName] Chứng nhận Tuân thủ nghĩa vụ EPR và bù đắp dấu chân nhựa năm 2026.

Hồ sơ chứng nhận điện tử và báo cáo sản lượng thu hồi thực tế đã được cập nhật thành công trên hệ thống RENOVA Circular Portal. Quý khách hàng có thể tra cứu và tích hợp báo cáo phát thải bất kỳ lúc nào.

Trân trọng / Best regards,
Ban Giám đốc RENOVA Circular.`
    }
  ],
  architecture: [
    {
      id: "arch_onboarding",
      name: "Onboarding Consultation (Tiếng Việt)",
      subject: "RENOVA: Xác nhận Đăng ký Tư vấn Công trình Xanh",
      body: `Kính gửi [ContactName],

Cảm ơn bạn đã đăng ký tư vấn giải pháp công trình xanh RENOVA cho địa điểm tại [Location] với diện tích bề mặt lắp đặt dự kiến là [SurfaceArea] m2.

Đội ngũ Kiến trúc sư và Kỹ sư RENOVA đang xem xét sơ đồ công trình của bạn để đưa ra phương án thiết kế gạch bông gió Heritage tối ưu hóa thông gió tự nhiên và cách nhiệt. Chúng tôi sẽ sớm liên hệ lại qua email hoặc số điện thoại [Phone].

Trân trọng,
Phòng Thiết kế Công trình Xanh RENOVA.`
    },
    {
      id: "arch_followup",
      name: "Request CAD Drawings (Tiếng Việt)",
      subject: "RENOVA: Yêu cầu Bản vẽ Sơ đồ Công trình",
      body: `Kính gửi [ContactName],

Chúng tôi muốn tiếp tục thảo luận về phương án thiết kế thông gió và cung cấp gạch RENOVA cho công trình tại [Location].

Vui lòng cung cấp thêm bản vẽ CAD hoặc mặt bằng chi tiết của khu vực [SurfaceArea] m2 cần lắp đặt để chúng tôi tính toán số lượng gạch chính xác và lên báo giá ưu đãi cho dự án.

Trân trọng,
Phòng Kinh doanh RENOVA.`
    },
    {
      id: "arch_proposal",
      name: "Passive Cooling Proposal (Song ngữ)",
      subject: "RENOVA: Đề xuất Giải pháp Kỹ thuật Thông gió Thụ động / Passive Cooling Technical Proposal",
      body: `Kính gửi [ContactName],

RENOVA xin gửi Bản đề xuất Giải pháp kỹ thuật thông gió thụ động và cách nhiệt cho công trình tại [Location].

Giải pháp sử dụng gạch RENOVA giúp giảm tới 35% điện năng làm mát và đạt chứng chỉ Lotus/LEED cho công trình xanh của bạn. Rất mong được hợp tác cùng bạn.

Trân trọng,
Đội ngũ kỹ thuật RENOVA.`
    }
  ],
  collection: [
    {
      id: "coll_onboarding",
      name: "Onboarding Guide (Tiếng Việt)",
      subject: "RENOVA: Xác nhận Đăng ký Mạng lưới Thu gom Nguyên liệu",
      body: `Thân gửi [ContactName],

Cảm ơn bạn đã đăng ký tham gia mạng lưới thu gom nguyên liệu rác thải nhựa MLP cùng RENOVA. Chúng tôi đã nhận được thông tin đăng ký của vựa/cá nhân tại địa chỉ [Address].

Đại diện thu mua của RENOVA sẽ liên hệ trực tiếp với bạn qua số điện thoại [Phone] để hướng dẫn quy trình phân loại nhựa sạch, đóng gói và lên lịch trình thu gom định kỳ.

Trân trọng,
Ban Điều hành Chuỗi Cung ứng RENOVA.`
    },
    {
      id: "coll_schedule",
      name: "Collection Schedule Setup (Tiếng Việt)",
      subject: "RENOVA: Điều phối Lịch trình Gom hàng",
      body: `Thân gửi [ContactName],

Chúng tôi liên hệ lại về lịch trình thu gom rác thải nhựa MLP tại địa điểm [Address].

Vui lòng xác nhận sản lượng nhựa hiện tại đã tích lũy được qua số điện thoại [Phone] để chúng tôi điều phối phương tiện vận chuyển phù hợp đến tiếp nhận.

Trân trọng,
Ban Điều hành Chuỗi Cung ứng RENOVA.`
    },
    {
      id: "coll_agreement",
      name: "Partnership updates (Tiếng Việt)",
      subject: "RENOVA: Cập nhật Bảng giá Thu mua Nguyên liệu",
      body: `Thân gửi [ContactName],

RENOVA xin gửi lời cảm ơn sâu sắc vì sự đồng hành của vựa/cá nhân tại [Address] trong chiến dịch làm sạch rác thải nhựa MLP đại dương.

Chúng tôi xin gửi thông tin cập nhật về bảng giá thu mua nguyên liệu mới nhất và các chương trình hỗ trợ thiết bị bảo hộ lao động cho các cộng tác viên.

Trân trọng,
Ban Điều hành Chuỗi Cung ứng RENOVA.`
    }
  ]
};export default function AdminDashboard() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  // UI View States
  const [activeTab, setActiveTab] = useState<"overview" | "epr" | "architecture" | "collection">("overview");
  
  // Data States
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [eprPartners, setEprPartners] = useState<EPRPartner[]>([]);
  const [greenProjects, setGreenProjects] = useState<GreenProject[]>([]);
  const [collectors, setCollectors] = useState<Collector[]>([]);
  
  // Search and Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Checkbox selection states
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  // Modal Email Flow state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailQueue, setEmailQueue] = useState<any[]>([]); // items currently queued for emailing
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Master Templates (Editable by Admin)
  const [customTemplates, setCustomTemplates] = useState<any>(EMAIL_TEMPLATES);
  const [isEditingBaseTemplate, setIsEditingBaseTemplate] = useState<boolean>(false);
  const [baseTemplateEditorText, setBaseTemplateEditorText] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  // Notification Auto-Dismiss Timer
  useEffect(() => {
    if (notificationMessage) {
      const timer = setTimeout(() => setNotificationMessage(""), 6000);
      return () => clearTimeout(timer);
    }
  }, [notificationMessage]);

  // Load token from sessionStorage on mount
  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // A secure API fetch wrapper adding JWT Authorization headers and handling auto-logout on 401
  const adminFetch = async (url: string, options: RequestInit = {}) => {
    const token = sessionStorage.getItem("adminToken");
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
    
    try {
      const res = await fetch(url, { ...options, headers });
      if (res.status === 401) {
        handleLogout();
        setAuthError("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        return null;
      }
      return res;
    } catch (err) {
      console.error(`API Request to ${url} failed:`, err);
      throw err;
    }
  };

  // Fetch Overview Stats and Activities
  const fetchOverviewData = async () => {
    try {
      const statsRes = await adminFetch("http://localhost:8000/api/v1/admin/stats");
      if (statsRes && statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      const actRes = await adminFetch("http://localhost:8000/api/v1/admin/activity");
      if (actRes && actRes.ok) {
        const actData = await actRes.json();
        setActivities(actData);
      }
    } catch (err) {
      console.error("Error fetching overview stats:", err);
    }
  };

  // Fetch Pipeline Tables Data
  const fetchPipelineData = async () => {
    try {
      const eprRes = await adminFetch("http://localhost:8000/api/v1/admin/epr-partners");
      if (eprRes && eprRes.ok) {
        const data = await eprRes.json();
        setEprPartners(data);
      }
      
      const archRes = await adminFetch("http://localhost:8000/api/v1/admin/green-projects");
      if (archRes && archRes.ok) {
        const data = await archRes.json();
        setGreenProjects(data);
      }

      const collRes = await adminFetch("http://localhost:8000/api/v1/admin/collectors");
      if (collRes && collRes.ok) {
        const data = await collRes.json();
        setCollectors(data);
      }
    } catch (err) {
      console.error("Error fetching pipeline data:", err);
    }
  };

  // Trigger loading when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchOverviewData();
      fetchPipelineData();
      setSelectedIds([]);
      setSearchQuery("");
      setStatusFilter("");
    }
  }, [isAuthenticated, activeTab]);

  // Log In action handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    try {
      const res = await fetch("http://localhost:8000/api/v1/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });

      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem("adminToken", data.token);
        setIsAuthenticated(true);
      } else {
        const errorData = await res.json();
        setAuthError(errorData.detail || "Đăng nhập thất bại");
      }
    } catch (err) {
      setAuthError("Không thể kết nối đến server");
    }
  };

  // Log Out action handler
  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    setUsernameInput("");
    setPasswordInput("");
  };

  // Checkbox management
  const handleSelectAll = (checked: boolean, itemIds: number[]) => {
    if (checked) {
      setSelectedIds(itemIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (checked: boolean, id: number) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(itemId => itemId !== id));
    }
  };

  // Bulk Status update
  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedIds.length === 0) return;
    
    let pipelineType = "";
    if (activeTab === "epr") pipelineType = "epr";
    if (activeTab === "architecture") pipelineType = "architecture";
    if (activeTab === "collection") pipelineType = "collection";

    try {
      const res = await adminFetch("http://localhost:8000/api/v1/admin/bulk-status", {
        method: "PUT",
        body: JSON.stringify({
          type: pipelineType,
          ids: selectedIds,
          status: status
        })
      });

      if (res && res.ok) {
        fetchPipelineData();
        fetchOverviewData();
        setSelectedIds([]);
      } else {
        alert("Lỗi khi cập nhật trạng thái");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Automated Email pop-up flow setup
  const openEmailModal = () => {
    if (selectedIds.length === 0) return;

    let items: any[] = [];
    if (activeTab === "epr") {
      items = eprPartners.filter(item => selectedIds.includes(item.id));
    } else if (activeTab === "architecture") {
      items = greenProjects.filter(item => selectedIds.includes(item.id));
    } else if (activeTab === "collection") {
      items = collectors.filter(item => selectedIds.includes(item.id));
    }

    if (items.length === 0) return;

    setEmailQueue(items);
    setCurrentQueueIndex(0);
    setIsEditingBaseTemplate(false);

    // Choose first template by default
    const category = activeTab === "overview" ? "epr" : activeTab;
    const templates = customTemplates[category];
    if (templates && templates.length > 0) {
      loadTemplate(templates[0], items[0]);
    }

    setIsEmailModalOpen(true);
  };

  const loadTemplate = (template: any, record: any) => {
    setSelectedTemplateId(template.id);
    setEmailSubject(template.subject);
    setBaseTemplateEditorText(template.body);
    
    // Interpolate placeholders
    let body = template.body;
    const name = record.contact_name || record.name || "";
    body = body.replace(/\[ContactName\]/g, name);
    body = body.replace(/\[Email\]/g, record.email || "");
    body = body.replace(/\[Phone\]/g, record.phone || "");

    if (activeTab === "epr") {
      body = body.replace(/\[CompanyName\]/g, record.company_name || "");
      body = body.replace(/\[AnnualWaste\]/g, record.annual_plastic_waste?.toString() || "0");
    } else if (activeTab === "architecture") {
      body = body.replace(/\[Location\]/g, record.location || "");
      body = body.replace(/\[SurfaceArea\]/g, record.surface_area?.toString() || "0");
    } else if (activeTab === "collection") {
      body = body.replace(/\[Address\]/g, record.address || "Không cung cấp");
    }

    setEmailContent(body);
  };

  // Handle template selection change in modal
  const handleTemplateChange = (templateId: string) => {
    const record = emailQueue[currentQueueIndex];
    const category = activeTab === "overview" ? "epr" : activeTab;
    const templates = customTemplates[category];
    const template = templates.find((t: any) => t.id === templateId);
    if (template && record) {
      setIsEditingBaseTemplate(false);
      loadTemplate(template, record);
    }
  };

  const handleSaveBaseTemplate = () => {
    const category = activeTab === "overview" ? "epr" : activeTab;
    const updatedTemplates = customTemplates[category].map((t: any) => {
      if (t.id === selectedTemplateId) {
        return { ...t, body: baseTemplateEditorText };
      }
      return t;
    });

    const newCustom = {
      ...customTemplates,
      [category]: updatedTemplates
    };
    setCustomTemplates(newCustom);
    
    // Regenerate preview content using the new template text!
    const record = emailQueue[currentQueueIndex];
    const updatedTemplateObj = updatedTemplates.find((t: any) => t.id === selectedTemplateId);
    if (record && updatedTemplateObj) {
      loadTemplate(updatedTemplateObj, record);
    }

    setIsEditingBaseTemplate(false);
    setNotificationMessage("Đã cập nhật mẫu thư gốc thành công!");
  };

  // Send single email in queue and advance
  const handleSendEmail = async () => {
    const record = emailQueue[currentQueueIndex];
    if (!record) return;

    setIsSendingEmail(true);
    let pipelineType = "";
    if (activeTab === "epr") pipelineType = "epr";
    if (activeTab === "architecture") pipelineType = "architecture";
    if (activeTab === "collection") pipelineType = "collection";

    try {
      const res = await adminFetch("http://localhost:8000/api/v1/admin/send-email", {
        method: "POST",
        body: JSON.stringify({
          type: pipelineType,
          id: record.id,
          subject: emailSubject,
          email_content: emailContent
        })
      });

      if (res && res.ok) {
        setNotificationMessage(`Thư đã gửi thành công tới ${record.email}! Nhật ký chi tiết đã được lưu trong mock_emails/.`);
        
        // Advance queue or finish
        if (currentQueueIndex < emailQueue.length - 1) {
          const nextIndex = currentQueueIndex + 1;
          setCurrentQueueIndex(nextIndex);
          // Load default template for the next user
          const category = activeTab === "overview" ? "epr" : activeTab;
          const templates = customTemplates[category];
          const currentTemplate = templates.find((t: any) => t.id === selectedTemplateId) || templates[0];
          loadTemplate(currentTemplate, emailQueue[nextIndex]);
        } else {
          // Finished all queue items
          setIsEmailModalOpen(false);
          setSelectedIds([]);
          fetchPipelineData();
          fetchOverviewData();
        }
      } else {
        alert("Lỗi khi gửi email");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối");
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Excel-compatible CSV export helper with UTF-8 BOM
  const handleExportCSV = (type: "epr" | "architecture" | "collection" | "all") => {
    if (type === "all") {
      // Export all three tables in separate CSV files triggered synchronously
      handleExportCSV("epr");
      setTimeout(() => handleExportCSV("architecture"), 200);
      setTimeout(() => handleExportCSV("collection"), 400);
      return;
    }

    let csvContent = "\ufeff"; // UTF-8 BOM so Excel displays Vietnamese correctly
    let filename = "";
    
    if (type === "epr") {
      filename = `EPR_Partners_Export_${new Date().toISOString().split('T')[0]}.csv`;
      const headers = ["ID", "Tên công ty", "Người liên hệ", "Email", "Số điện thoại", "Lượng rác thải nhựa (kg/năm)", "Yêu cầu EPR", "Trạng thái", "Ngày đăng ký"];
      csvContent += headers.join(",") + "\n";
      
      const rows = filteredEprData.map(item => [
        item.id,
        `"${item.company_name.replace(/"/g, '""')}"`,
        `"${item.contact_name.replace(/"/g, '""')}"`,
        item.email,
        `"${item.phone}"`,
        item.annual_plastic_waste,
        item.needs_epr_cert ? "Có" : "Không",
        item.status,
        item.created_at
      ]);
      csvContent += rows.map(r => r.join(",")).join("\n");

    } else if (type === "architecture") {
      filename = `Green_Architecture_Leads_${new Date().toISOString().split('T')[0]}.csv`;
      const headers = ["ID", "Địa điểm công trình", "Diện tích (m2)", "Người liên hệ", "Email", "Số điện thoại", "Tư vấn thông gió", "Trạng thái", "Ngày đăng ký"];
      csvContent += headers.join(",") + "\n";
      
      const rows = filteredArchData.map(item => [
        item.id,
        `"${item.location.replace(/"/g, '""')}"`,
        item.surface_area,
        `"${item.contact_name.replace(/"/g, '""')}"`,
        item.email,
        `"${item.phone}"`,
        item.ventilation_consult ? "Có" : "Không",
        item.status,
        item.created_at
      ]);
      csvContent += rows.map(r => r.join(",")).join("\n");

    } else if (type === "collection") {
      filename = `Collection_Registrations_${new Date().toISOString().split('T')[0]}.csv`;
      const headers = ["ID", "Hình thức thu gom", "Tên đối tác", "Email", "Số điện thoại", "Địa chỉ thu gom", "Trạng thái", "Ngày đăng ký"];
      csvContent += headers.join(",") + "\n";
      
      const rows = filteredCollData.map(item => [
        item.id,
        item.collector_type === "scrap_yard" ? "Vựa ve chai" : "Cá nhân",
        `"${item.name.replace(/"/g, '""')}"`,
        item.email,
        `"${item.phone}"`,
        `"${item.address.replace(/"/g, '""')}"`,
        item.status,
        item.created_at
      ]);
      csvContent += rows.map(r => r.join(",")).join("\n");
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Memoized Search & Status Filtering
  const filteredEprData = useMemo(() => {
    return eprPartners.filter(item => {
      const matchSearch = 
        item.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchStatus = statusFilter === "" || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [eprPartners, searchQuery, statusFilter]);

  const filteredArchData = useMemo(() => {
    return greenProjects.filter(item => {
      const matchSearch = 
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchStatus = statusFilter === "" || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [greenProjects, searchQuery, statusFilter]);

  const filteredCollData = useMemo(() => {
    return collectors.filter(item => {
      const matchSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchStatus = statusFilter === "" || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [collectors, searchQuery, statusFilter]);

  // Handle Tab IDs
  const activeIdsList = useMemo(() => {
    if (activeTab === "epr") return filteredEprData.map(item => item.id);
    if (activeTab === "architecture") return filteredArchData.map(item => item.id);
    if (activeTab === "collection") return filteredCollData.map(item => item.id);
    return [];
  }, [activeTab, filteredEprData, filteredArchData, filteredCollData]);

  // Format Dates safely
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
    } catch {
      return dateStr;
    }
  };

  // Status Pill component styles helper
  const renderStatusPill = (status: string) => {
    let classes = "px-2.5 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1 ";
    if (status === "Starting") {
      classes += "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30";
      return <span className={classes}><Clock size={12} /> Starting</span>;
    } else if (status === "Pending") {
      classes += "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30";
      return <span className={classes}><Clock size={12} /> Pending</span>;
    } else {
      classes += "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30";
      return <span className={classes}><CheckCircle size={12} /> Replied</span>;
    }
  };

  // --- Auth View Layout ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden font-body">
        {/* Glow backgrounds */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-brand-primary/10 to-transparent rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-brand-secondary/10 to-transparent rounded-full blur-[100px]" />
        
        <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-8 rounded-2xl shadow-2xl relative z-10 animate-float">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-2 mb-3">
              <img src="/Logo.png" alt="RENOVA Logo" className="h-10 w-auto rounded object-contain" />
              <span className="text-[10px] font-bold text-brand-secondary border border-brand-secondary/35 px-1.5 py-0.5 rounded uppercase">
                Circular
              </span>
            </div>
            <h1 className="text-2xl font-bold text-zinc-100 font-heading">Hệ thống Quản lý Đối tác</h1>
            <p className="text-sm text-zinc-400 mt-1">RENOVA Portal Administrative Sign-In</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {authError && (
              <div className="bg-red-950/40 text-red-400 border border-red-900/50 p-3 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle size={16} className="shrink-0" />
                <span>{authError}</span>
              </div>
            )}
            <div>
              <label className="text-xs text-zinc-400 font-bold block mb-2 uppercase tracking-wide">Tên đăng nhập / Username</label>
              <input 
                type="text" 
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all duration-300 text-sm"
                required
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 font-bold block mb-2 uppercase tracking-wide">Mật khẩu / Password</label>
              <input 
                type="password" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all duration-300 text-sm"
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-3.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-heading font-semibold rounded-lg hover:shadow-lg hover:shadow-brand-primary/20 transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer text-sm"
            >
              Xác thực Đăng nhập
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-zinc-500">
            Hệ thống bảo mật nội bộ của RENOVA Circular. &copy; 2026.
          </div>
        </div>
      </div>
    );
  }

  // --- Main Dashboard Layout Theme variables (Earthy Dark Mode) ---
  const isDark = true;
  const themeBg = "bg-[#12100e] text-[#FAF8F5]";
  const themeSidebar = "bg-[#1a1613] border-r border-[#28211d]";
  const themeHeader = "bg-[#1a1613]/80 border-b border-[#28211d]";
  const themeCard = "bg-[#1c1815] border border-[#2c2420] text-[#FAF8F5]";
  const themeBorder = "border-[#28211d]";
  const themeText = "text-[#FAF8F5]";
  const themeTextMuted = "text-[#a8a19c]";
  const themeTableHead = "bg-[#241e1a] text-[#a8a19c]";
  const themeTableRow = "hover:bg-[#201b17] border-b border-[#241e1a] text-zinc-200";
  const themeInput = "bg-[#12100e] border-[#2c2420] text-zinc-100 focus:border-brand-primary";
  const themeNavSelected = "bg-[#28211d] text-brand-secondary border-l-2 border-brand-secondary font-bold";
  const themeNavUnselected = "text-[#a8a19c] hover:bg-[#241e1a] hover:text-[#FAF8F5]";

  return (
    <div className={`min-h-screen flex font-body transition-all duration-300 ${themeBg}`}>
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className={`w-64 flex flex-col justify-between shrink-0 transition-all duration-300 ${themeSidebar}`}>
        <div>
          {/* Logo Brand area */}
          <div className={`p-6 border-b flex items-center justify-between ${themeBorder}`}>
            <div className="flex items-center gap-2">
              <img src="/Logo.png" alt="RENOVA Logo" className="h-7 w-auto rounded object-contain" />
              <span className="text-[9px] font-bold text-brand-secondary border border-brand-secondary/35 px-1 py-0.5 rounded uppercase">
                Circular
              </span>
            </div>
            <span className={`text-[10px] font-semibold tracking-wider uppercase ${themeTextMuted}`}>Admin</span>
          </div>

          {/* Navigation link elements */}
          <nav className="p-4 space-y-1">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === "overview" ? themeNavSelected : themeNavUnselected
              }`}
            >
              <LayoutDashboard size={18} />
              <span>Tổng quan / Overview</span>
            </button>

            <div className={`pt-4 pb-2 px-4 text-xs font-bold uppercase tracking-widest ${themeTextMuted}`}>
              Kênh đăng ký đối tác
            </div>

            <button 
              onClick={() => setActiveTab("epr")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === "epr" ? themeNavSelected : themeNavUnselected
              }`}
            >
              <Building2 size={18} />
              <span>Đối tác EPR / EPR Partners</span>
            </button>

            <button 
              onClick={() => setActiveTab("architecture")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === "architecture" ? themeNavSelected : themeNavUnselected
              }`}
            >
              <Leaf size={18} />
              <span>Công trình Xanh / Green Arch</span>
            </button>

            <button 
              onClick={() => setActiveTab("collection")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === "collection" ? themeNavSelected : themeNavUnselected
              }`}
            >
              <Truck size={18} />
              <span>Đăng ký Thu gom / Collection</span>
            </button>
          </nav>
        </div>

        {/* User logout section at bottom */}
        <div className={`p-4 border-t ${themeBorder}`}>
          <div className={`flex items-center justify-between p-2 rounded-lg mb-3 border ${
            isDark ? "bg-[#12100e] border-[#2c2420]" : "bg-[#FAF8F5] border-[#e6e1dd]"
          }`}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center font-bold text-xs text-white">
                AD
              </div>
              <div>
                <p className={`text-xs font-semibold ${themeText}`}>Administrator</p>
                <p className={`text-[10px] ${themeTextMuted}`}>Master Level</p>
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 py-2.5 border rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
              isDark 
                ? "border-[#2c2420] text-zinc-400 hover:text-red-400 hover:bg-red-950/10 hover:border-red-950/30" 
                : "border-[#e6e1dd] text-zinc-550 hover:text-red-500 hover:bg-red-50 hover:border-red-200"
            }`}
          >
            <LogOut size={14} />
            <span>Đăng xuất / Sign Out</span>
          </button>
        </div>
      </aside>

      {/* RIGHT VIEWPORT VIEW */}
      <main className={`flex-grow flex flex-col min-w-0 transition-all duration-300 ${themeBg}`}>
        
        {/* Main Content top Header Bar */}
        <header className={`h-16 flex items-center justify-between px-8 backdrop-blur-md transition-all duration-300 ${themeHeader}`}>
          <div>
            <h2 className={`text-base font-bold font-heading ${themeText}`}>
              {activeTab === "overview" && "Bảng điều khiển Tổng quan / Dashboard Overview"}
              {activeTab === "epr" && "Đối tác Đăng ký EPR / EPR B2B Partners Pipeline"}
              {activeTab === "architecture" && "Hồ sơ Công trình Xanh / Green Architecture Consulting"}
              {activeTab === "collection" && "Mạng lưới Điểm thu gom / Waste Material Suppliers"}
            </h2>
          </div>
          <div className="flex items-center gap-4">

            <div className={`text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg border ${
              isDark 
                ? "bg-[#1c1815] border-[#2c2420] text-[#a8a19c]" 
                : "bg-white border-[#e6e1dd] text-[#78726d]"
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Hệ thống hoạt động ổn định</span>
            </div>

            {(activeTab === "epr" || activeTab === "architecture" || activeTab === "collection") && (
              <button 
                onClick={fetchPipelineData}
                title="Làm mới dữ liệu"
                className={`p-2 border rounded-lg transition-all duration-150 cursor-pointer ${
                  isDark
                    ? "border-[#2c2420] bg-[#1a1613] text-[#a8a19c] hover:text-[#FAF8F5] hover:border-[#28211d]"
                    : "border-[#e6e1dd] bg-white text-[#78726d] hover:text-[#1d1815] hover:border-brand-primary/40"
                }`}
              >
                <RefreshCw size={14} />
              </button>
            )}
          </div>
        </header>

        {/* 2. VIEWS AND TABS CONTAINER */}
        <div className="flex-grow p-8 overflow-y-auto max-w-[1600px] w-full mx-auto">
          
          {notificationMessage && (
            <div className="mb-6 bg-emerald-950/45 text-emerald-400 border border-emerald-800/40 p-4 rounded-xl flex items-center gap-3 text-sm animate-pulse-glow">
              <CheckCircle size={18} className="shrink-0 text-emerald-400" />
              <span className="font-semibold">{notificationMessage}</span>
            </div>
          )}
          
          {/* TAB A: OVERVIEW DASHBOARD */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              
              {/* KPI Metric Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Total Records Card */}
                <div className={`p-6 rounded-2xl relative overflow-hidden group shadow-lg transition-all duration-300 ${themeCard}`}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-bl-[100px] transition-all group-hover:bg-brand-primary/10" />
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl text-brand-secondary border ${
                      isDark ? "bg-[#201b17] border-[#2c2420]" : "bg-zinc-50 border-brand-border"
                    }`}>
                      <Database size={24} />
                    </div>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wider ${themeTextMuted}`}>Tổng số đăng ký / Total Records</p>
                      <h3 className={`text-3xl font-extrabold mt-1 ${themeText}`}>
                        {stats ? stats.total_records : <span className="text-zinc-650">...</span>}
                      </h3>
                    </div>
                  </div>
                  <div className={`mt-4 pt-4 border-t grid grid-cols-3 gap-1 text-center ${themeBorder}`}>
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${themeTextMuted}`}>EPR</span>
                      <span className={`text-xl font-extrabold block mt-0.5 ${themeText}`}>{stats?.epr_stats.total || 0}</span>
                    </div>
                    <div className={`border-x ${themeBorder}`}>
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${themeTextMuted}`}>GREEN ARCH</span>
                      <span className={`text-xl font-extrabold block mt-0.5 ${themeText}`}>{stats?.architecture_stats.total || 0}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${themeTextMuted}`}>COLLECTOR</span>
                      <span className={`text-xl font-extrabold block mt-0.5 ${themeText}`}>{stats?.collection_stats.total || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Total Pending Updates Card */}
                <div className={`p-6 rounded-2xl relative overflow-hidden group shadow-lg transition-all duration-300 ${themeCard}`}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-[100px] transition-all group-hover:bg-amber-500/10" />
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl text-amber-400 border ${
                      isDark ? "bg-[#201b17] border-[#2c2420]" : "bg-zinc-50 border-brand-border"
                    }`}>
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wider ${themeTextMuted}`}>Chưa xử lý / Pending Items</p>
                      <h3 className={`text-3xl font-extrabold mt-1 ${themeText}`}>
                        {stats ? stats.total_pending : <span className="text-zinc-655">...</span>}
                      </h3>
                    </div>
                  </div>
                  <div className={`mt-4 pt-4 border-t grid grid-cols-3 gap-1 text-center ${themeBorder}`}>
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${themeTextMuted}`}>Starting</span>
                      <span className="text-xl font-extrabold text-blue-400 block mt-0.5">
                        {stats ? (stats.epr_stats.starting + stats.architecture_stats.starting + stats.collection_stats.starting) : 0}
                      </span>
                    </div>
                    <div className={`border-x ${themeBorder}`}>
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${themeTextMuted}`}>Pending</span>
                      <span className="text-xl font-extrabold text-amber-400 block mt-0.5">
                        {stats ? (stats.epr_stats.pending + stats.architecture_stats.pending + stats.collection_stats.pending) : 0}
                      </span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${themeTextMuted}`}>Tỷ lệ chờ</span>
                      <span className={`text-xl font-extrabold block mt-0.5 ${themeText}`}>
                        {stats && stats.total_records ? `${((stats.total_pending / stats.total_records) * 100).toFixed(0)}%` : "0%"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total Success Stories Card */}
                <div className={`p-6 rounded-2xl relative overflow-hidden group shadow-lg transition-all duration-300 ${themeCard}`}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-[100px] transition-all group-hover:bg-emerald-500/10" />
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl text-emerald-400 border ${
                      isDark ? "bg-[#201b17] border-[#2c2420]" : "bg-zinc-50 border-brand-border"
                    }`}>
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wider ${themeTextMuted}`}>Đã phản hồi / Success Stories</p>
                      <h3 className={`text-3xl font-extrabold mt-1 ${themeText}`}>
                        {stats ? stats.total_success : <span className="text-zinc-660">...</span>}
                      </h3>
                    </div>
                  </div>
                  <div className={`mt-4 pt-4 border-t grid grid-cols-3 gap-1 text-center ${themeBorder}`}>
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${themeTextMuted}`}>EPR</span>
                      <span className="text-xl font-extrabold text-emerald-400 block mt-0.5">{stats?.epr_stats.success || 0}</span>
                    </div>
                    <div className={`border-x ${themeBorder}`}>
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${themeTextMuted}`}>GREEN ARCH</span>
                      <span className="text-xl font-extrabold text-emerald-400 block mt-0.5">{stats?.architecture_stats.success || 0}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${themeTextMuted}`}>COLLECTOR</span>
                      <span className="text-xl font-extrabold text-emerald-400 block mt-0.5">{stats?.collection_stats.success || 0}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Grid with Global Activity Stream and System Summary Info */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 2/3 Width: Activity Stream */}
                <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6 border-b border-zinc-800/80 pb-4">
                    <div className="flex items-center gap-2">
                      <Inbox className="text-brand-secondary" size={20} />
                      <h4 className="font-heading font-bold text-zinc-100">Nhật ký đăng ký gần đây / Recent Global Registrations</h4>
                    </div>
                    <button 
                      onClick={fetchOverviewData}
                      className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition duration-150 border-none bg-transparent cursor-pointer"
                    >
                      <RefreshCw size={12} /> Cập nhật
                    </button>
                  </div>

                  <div className="space-y-4">
                    {activities.length === 0 ? (
                      <div className="text-center py-12 text-zinc-500 text-sm">
                        Chưa ghi nhận hoạt động nào gần đây.
                      </div>
                    ) : (
                      activities.map((item, idx) => (
                        <div 
                          key={`${item.type}-${item.id}-${idx}`}
                          className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/40 hover:border-zinc-850 hover:bg-zinc-850/20 transition duration-150"
                        >
                          <div className={`p-2 rounded-lg text-xs font-semibold ${
                            item.type === "epr" ? "bg-purple-950/40 text-purple-400 border border-purple-900/30" :
                            item.type === "architecture" ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30" :
                            "bg-amber-950/40 text-amber-400 border border-amber-900/30"
                          }`}>
                            {item.type === "epr" && <Building2 size={16} />}
                            {item.type === "architecture" && <Leaf size={16} />}
                            {item.type === "collection" && <Truck size={16} />}
                          </div>

                          <div className="flex-grow min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <h5 className="text-sm font-semibold text-zinc-200 truncate">{item.title}</h5>
                              <span className="text-[10px] text-zinc-500 shrink-0 font-medium">
                                {formatDate(item.created_at)}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400 mt-0.5 truncate">{item.subtitle}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-[11px] text-zinc-500 font-medium">{item.email}</span>
                              <span className="text-zinc-700 font-bold">•</span>
                              {renderStatusPill(item.status)}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 1/3 Width: Database System Status Info */}
                <div className="space-y-6">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-lg">
                    <h4 className="font-heading font-bold text-zinc-100 border-b border-zinc-800/80 pb-4 mb-4">
                      Trạng thái cơ sở dữ liệu
                    </h4>
                    
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between items-center py-2 border-b border-zinc-850">
                        <span className="text-zinc-400">Database Engine</span>
                        <span className="font-semibold text-zinc-200">SQLite v3</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-zinc-850">
                        <span className="text-zinc-400">Connection State</span>
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Connected
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-zinc-850">
                        <span className="text-zinc-400">Mock Outbound Logs</span>
                        <span className="font-semibold text-zinc-200">/mock_emails</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-zinc-400">Last Seeding Time</span>
                        <span className="font-semibold text-zinc-200">2026-06-28</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-lg">
                    <h4 className="font-heading font-bold text-zinc-100 border-b border-zinc-800/80 pb-4 mb-4">
                      Xuất dữ liệu toàn bộ hệ thống
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-5">
                      Tải về toàn bộ thông tin đăng ký đối tác (3 bảng dữ liệu) dưới dạng các tệp bảng tính CSV riêng biệt để phân tích hoặc báo cáo nội bộ.
                    </p>
                    <button 
                      onClick={() => handleExportCSV("all")}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-semibold font-heading rounded-xl hover:shadow-lg hover:shadow-brand-primary/10 transform hover:-translate-y-0.5 transition duration-200 cursor-pointer text-sm"
                    >
                      <Download size={16} />
                      <span>Tải xuống Tất cả (.csv)</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB B: PIPELINE TABLES VIEWS (EPR, ARCHITECTURE, COLLECTION) */}
          {activeTab !== "overview" && (
            <div className="space-y-6">
              
              {/* Filter controls search toolbar */}
              <div className={`flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-xl shadow-md transition-all duration-300 ${themeCard}`}>
                
                {/* Search query block */}
                <div className="w-full md:w-80 relative">
                  <Search size={16} className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 ${themeTextMuted}`} />
                  <input 
                    type="text" 
                    placeholder={
                      activeTab === "epr" ? "Tìm công ty, người liên hệ, email..." :
                      activeTab === "architecture" ? "Tìm địa điểm, người liên hệ, email..." :
                      "Tìm tên vựa, địa chỉ, email..."
                    }
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedIds([]); // reset checked rows on search change
                    }}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg outline-none text-sm transition duration-200 ${themeInput}`}
                  />
                </div>

                {/* Status Dropdown filter and export data actions */}
                <div className="w-full md:w-auto flex flex-wrap items-center gap-3 justify-end">
                  
                  <div className="flex items-center gap-2">
                    <Filter size={16} className={themeTextMuted} />
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setSelectedIds([]); // reset checked rows on filter change
                      }}
                      className={`px-3 py-2.5 rounded-lg text-sm outline-none cursor-pointer transition duration-150 ${themeInput}`}
                    >
                      <option value="">Tất cả trạng thái / All Status</option>
                      <option value="Starting">Starting</option>
                      <option value="Pending">Pending</option>
                      <option value="Replied">Replied</option>
                    </select>
                  </div>

                  <button 
                    onClick={() => handleExportCSV(activeTab)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition duration-150 text-sm cursor-pointer border ${
                      isDark
                        ? "bg-[#1c1815] hover:bg-[#201b17] border-[#2c2420] text-zinc-300"
                        : "bg-white hover:bg-zinc-50 border-[#e6e1dd] text-[#1d1815]"
                    }`}
                  >
                    <Download size={14} />
                    <span>Xuất bảng này (.csv)</span>
                  </button>

                </div>

              </div>

              {/* Main pipeline table render panel */}
              <div className={`rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${themeCard}`}>
                <div className="overflow-x-auto">
                  <table className={`w-full border-collapse text-left text-sm ${isDark ? "text-zinc-300" : "text-[#1d1815]"}`}>
                    
                    {/* Table Head */}
                    <thead className={`border-b font-bold uppercase text-xs tracking-wider transition-all duration-300 ${themeTableHead}`}>
                      <tr>
                        {/* Master toggle checkbox */}
                        <th className="p-4 w-12 text-center">
                          <input 
                            type="checkbox"
                            checked={activeIdsList.length > 0 && selectedIds.length === activeIdsList.length}
                            onChange={(e) => handleSelectAll(e.target.checked, activeIdsList)}
                            className={`w-4 h-4 rounded accent-brand-primary cursor-pointer ${
                              isDark ? "bg-[#12100e] border-[#2c2420]" : "bg-white border-[#e6e1dd]"
                            }`}
                          />
                        </th>

                        {/* EPR Headers */}
                        {activeTab === "epr" && (
                          <>
                            <th className="p-4">Tên Công ty / Company</th>
                            <th className="p-4">Người liên hệ / Contact</th>
                            <th className="p-4">Sản lượng (kg/năm)</th>
                            <th className="p-4">Yêu cầu EPR</th>
                            <th className="p-4">Trạng thái</th>
                            <th className="p-4">Ngày gửi</th>
                          </>
                        )}

                        {/* Architecture Headers */}
                        {activeTab === "architecture" && (
                          <>
                            <th className="p-4">Địa điểm công trình / Project Location</th>
                            <th className="p-4">Diện tích (m²)</th>
                            <th className="p-4">Người liên hệ / Contact</th>
                            <th className="p-4">Tư vấn thông gió</th>
                            <th className="p-4">Trạng thái</th>
                            <th className="p-4">Ngày gửi</th>
                          </>
                        )}

                        {/* Collection Headers */}
                        {activeTab === "collection" && (
                          <>
                            <th className="p-4">Đối tác / Supplier Name</th>
                            <th className="p-4">Hình thức</th>
                            <th className="p-4">Địa chỉ thu gom / Location Address</th>
                            <th className="p-4">Số điện thoại / Phone</th>
                            <th className="p-4">Trạng thái</th>
                            <th className="p-4">Ngày gửi</th>
                          </>
                        )}
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className={`divide-y transition-all duration-300 ${isDark ? "divide-[#241e1a] bg-[#1a1613]/15" : "divide-zinc-200 bg-white"}`}>
                      
                      {/* EPR Partners Rows */}
                      {activeTab === "epr" && (
                        filteredEprData.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-zinc-500">Không tìm thấy đối tác nào phù hợp.</td>
                          </tr>
                        ) : (
                          filteredEprData.map(item => (
                            <tr key={item.id} className={`transition duration-100 ${themeTableRow}`}>
                              <td className="p-4 text-center">
                                <input 
                                  type="checkbox"
                                  checked={selectedIds.includes(item.id)}
                                  onChange={(e) => handleSelectRow(e.target.checked, item.id)}
                                  className={`w-4 h-4 rounded accent-brand-primary cursor-pointer ${
                                    isDark ? "bg-[#12100e] border-[#2c2420]" : "bg-white border-[#e6e1dd]"
                                  }`}
                                />
                              </td>
                              <td className={`p-4 font-bold ${themeText}`}>{item.company_name}</td>
                              <td className="p-4">
                                <div className={`font-medium ${themeText}`}>{item.contact_name}</div>
                                <div className={`text-xs ${themeTextMuted}`}>{item.email}</div>
                              </td>
                              <td className={`p-4 font-semibold ${isDark ? "text-zinc-300" : "text-zinc-800"}`}>{item.annual_plastic_waste.toLocaleString("vi-VN")} kg</td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 text-[10px] rounded font-bold uppercase tracking-wide border ${
                                  item.needs_epr_cert 
                                    ? "bg-brand-primary/10 text-brand-primary border-brand-primary/20" 
                                    : isDark ? "bg-[#12100e] text-[#a8a19c] border-[#28211d]" : "bg-zinc-50 text-zinc-500 border-zinc-200"
                                  }`}>
                                  {item.needs_epr_cert ? "Cần cấp chứng nhận" : "Không yêu cầu"}
                                </span>
                              </td>
                              <td className="p-4">{renderStatusPill(item.status)}</td>
                              <td className={`p-4 text-xs ${themeTextMuted}`}>{formatDate(item.created_at)}</td>
                            </tr>
                          ))
                        )
                      )}

                      {/* Green Architecture Rows */}
                      {activeTab === "architecture" && (
                        filteredArchData.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-zinc-500">Không tìm thấy dự án nào phù hợp.</td>
                          </tr>
                        ) : (
                          filteredArchData.map(item => (
                            <tr key={item.id} className={`transition duration-100 ${themeTableRow}`}>
                              <td className="p-4 text-center">
                                <input 
                                  type="checkbox"
                                  checked={selectedIds.includes(item.id)}
                                  onChange={(e) => handleSelectRow(e.target.checked, item.id)}
                                  className={`w-4 h-4 rounded accent-brand-primary cursor-pointer ${
                                    isDark ? "bg-[#12100e] border-[#2c2420]" : "bg-white border-[#e6e1dd]"
                                  }`}
                                />
                              </td>
                              <td className={`p-4 font-bold max-w-[200px] truncate ${themeText}`} title={item.location}>
                                {item.location}
                              </td>
                              <td className={`p-4 font-semibold ${isDark ? "text-zinc-300" : "text-zinc-800"}`}>{item.surface_area} m²</td>
                              <td className="p-4">
                                <div className={`font-medium ${themeText}`}>{item.contact_name}</div>
                                <div className={`text-xs ${themeTextMuted}`}>{item.email}</div>
                                <div className={`text-xs ${themeTextMuted}`}>{item.phone}</div>
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 text-[10px] rounded font-bold uppercase tracking-wide border ${
                                  item.ventilation_consult 
                                    ? "bg-purple-950/20 text-purple-400 border-purple-900/30" 
                                    : isDark ? "bg-[#12100e] text-[#a8a19c] border-[#28211d]" : "bg-zinc-50 text-zinc-500 border-zinc-200"
                                }`}>
                                  {item.ventilation_consult ? "Cần thiết kế thông gió" : "Không yêu cầu"}
                                </span>
                              </td>
                              <td className="p-4">{renderStatusPill(item.status)}</td>
                              <td className={`p-4 text-xs ${themeTextMuted}`}>{formatDate(item.created_at)}</td>
                            </tr>
                          ))
                        )
                      )}

                      {/* Collection Rows */}
                      {activeTab === "collection" && (
                        filteredCollData.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-zinc-500">Không tìm thấy thông tin đăng ký thu gom nào.</td>
                          </tr>
                        ) : (
                          filteredCollData.map(item => (
                            <tr key={item.id} className={`transition duration-100 ${themeTableRow}`}>
                              <td className="p-4 text-center">
                                <input 
                                  type="checkbox"
                                  checked={selectedIds.includes(item.id)}
                                  onChange={(e) => handleSelectRow(e.target.checked, item.id)}
                                  className={`w-4 h-4 rounded accent-brand-primary cursor-pointer ${
                                    isDark ? "bg-[#12100e] border-[#2c2420]" : "bg-white border-[#e6e1dd]"
                                  }`}
                                />
                              </td>
                              <td className="p-4">
                                <div className={`font-bold ${themeText}`}>{item.name}</div>
                                <div className={`text-xs ${themeTextMuted}`}>{item.email}</div>
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 text-[10px] rounded font-bold uppercase tracking-wide border ${
                                  item.collector_type === "scrap_yard" 
                                    ? "bg-amber-950/20 text-amber-400 border-amber-900/30" 
                                    : "bg-blue-950/20 text-blue-400 border-blue-900/30"
                                }`}>
                                  {item.collector_type === "scrap_yard" ? "Vựa ve chai / Scrap Yard" : "Cá nhân / Individual"}
                                </span>
                              </td>
                              <td className="p-4 max-w-[250px] truncate" title={item.address}>{item.address || "Không cung cấp"}</td>
                              <td className={`p-4 font-semibold ${isDark ? "text-zinc-300" : "text-zinc-800"}`}>{item.phone}</td>
                              <td className="p-4">{renderStatusPill(item.status)}</td>
                              <td className={`p-4 text-xs ${themeTextMuted}`}>{formatDate(item.created_at)}</td>
                            </tr>
                          ))
                        )
                      )}

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* 3. MULTI-SELECT FLOATING ACTION TOOLBAR */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border border-brand-primary/30 px-6 py-4 rounded-xl shadow-2xl z-40 flex items-center gap-6 max-w-2xl w-[90%] sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-primary text-white flex items-center justify-center text-xs font-bold font-heading">
              {selectedIds.length}
            </span>
            <span className="text-xs font-bold text-zinc-800">đối tác được chọn</span>
          </div>

          <div className="h-6 w-px bg-zinc-200" />

          <div className="flex flex-wrap items-center gap-3">
            {/* Quick status manual dropdown update */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Cập nhật nhanh:</span>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkStatusUpdate(e.target.value);
                    e.target.value = ""; // reset selected selection option
                  }
                }}
                className="bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-xs text-zinc-800 outline-none cursor-pointer focus:border-brand-primary"
              >
                <option value="">-- Chọn Trạng thái --</option>
                <option value="Starting">Starting</option>
                <option value="Pending">Pending</option>
                <option value="Replied">Replied</option>
              </select>
            </div>

            <div className="h-6 w-px bg-zinc-200 hidden sm:block" />

            {/* Email Flow Action button */}
            <button 
              onClick={openEmailModal}
              className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-brand-primary to-brand-secondary hover:shadow-lg text-white rounded font-bold font-heading text-xs transition duration-150 cursor-pointer"
            >
              <Mail size={14} />
              <span>Gửi thư đồng loạt / Send Emails</span>
            </button>
            
            <button 
              onClick={() => setSelectedIds([])}
              className="p-2 border border-zinc-300 hover:bg-zinc-50 hover:text-zinc-700 rounded text-zinc-500 cursor-pointer"
              title="Hủy lựa chọn"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 4. EMAIL DRAFT QUEUED MODAL WIZARD */}
      {isEmailModalOpen && emailQueue.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] relative z-50 overflow-hidden font-body animate-float">
            
            {/* Modal Head */}
            <div className="p-6 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-2">
                <Mail className="text-brand-primary" size={20} />
                <h3 className="text-base font-bold font-heading text-zinc-800">
                  Gửi thư tự động / Safe Confirmation Queue
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                Tiến trình: {currentQueueIndex + 1} / {emailQueue.length} đối tác
              </span>
            </div>

            {/* Modal scrollable form content body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-grow text-zinc-700">
              
              {/* Target recipient details */}
              <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center font-bold text-brand-primary shrink-0">
                  {emailQueue[currentQueueIndex].company_name ? <Building size={18} /> : <User size={18} />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-800">
                    {emailQueue[currentQueueIndex].company_name || emailQueue[currentQueueIndex].contact_name || emailQueue[currentQueueIndex].name}
                  </h4>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Người nhận: {emailQueue[currentQueueIndex].contact_name || emailQueue[currentQueueIndex].name} &lt;{emailQueue[currentQueueIndex].email}&gt;
                  </p>
                </div>
              </div>

              {/* Template Picker */}
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide block mb-2">
                  Mẫu email / Select Default Template
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {customTemplates[activeTab === "overview" ? "epr" : activeTab]?.map((template: any) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateChange(template.id)}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg border text-left transition duration-150 cursor-pointer ${
                        selectedTemplateId === template.id
                          ? "bg-brand-primary/10 text-brand-primary border-brand-primary font-bold shadow-sm"
                          : "bg-white border-zinc-200 text-zinc-600 hover:text-zinc-800 hover:bg-zinc-50"
                      }`}
                    >
                      <div className="truncate">{template.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Editable Templates Section */}
              <div className="border-t border-zinc-100 pt-4">
                <div className="flex justify-between items-center pb-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide block">
                    {isEditingBaseTemplate ? "Đang sửa mẫu gốc / Editing Base Template Master" : "Tiêu đề email / Email Subject"}
                  </label>
                  <button
                    onClick={() => {
                      setIsEditingBaseTemplate(!isEditingBaseTemplate);
                    }}
                    className="text-xs text-brand-primary hover:text-brand-secondary font-bold border-none bg-transparent cursor-pointer flex items-center gap-1"
                  >
                    {isEditingBaseTemplate ? "Quay lại soạn thư / Back to Draft" : "Chỉnh sửa mẫu gốc / Edit Base Template"}
                  </button>
                </div>

                {isEditingBaseTemplate ? (
                  <div className="space-y-3 bg-brand-primary/5 border border-brand-primary/10 p-4 rounded-xl">
                    <p className="text-[11px] text-zinc-600 leading-relaxed">
                      <strong>Lưu ý:</strong> Bạn đang thay đổi trực tiếp mẫu thư gốc. Sử dụng các biến giữ chỗ sau để tự động điền thông tin:
                      <span className="inline-block bg-white border border-zinc-200 px-1.5 py-0.5 rounded mx-1 text-zinc-700">{"[ContactName]"}</span>
                      <span className="inline-block bg-white border border-zinc-200 px-1.5 py-0.5 rounded mx-1 text-zinc-700">{"[Email]"}</span>
                      <span className="inline-block bg-white border border-zinc-200 px-1.5 py-0.5 rounded mx-1 text-zinc-700">{"[Phone]"}</span>
                      {activeTab === "epr" && <span className="inline-block bg-white border border-zinc-200 px-1.5 py-0.5 rounded mx-1 text-zinc-700">{"[CompanyName]"}</span>}
                      {activeTab === "epr" && <span className="inline-block bg-white border border-zinc-200 px-1.5 py-0.5 rounded mx-1 text-zinc-700">{"[AnnualWaste]"}</span>}
                      {activeTab === "architecture" && <span className="inline-block bg-white border border-zinc-200 px-1.5 py-0.5 rounded mx-1 text-zinc-700">{"[Location]"}</span>}
                      {activeTab === "architecture" && <span className="inline-block bg-white border border-zinc-200 px-1.5 py-0.5 rounded mx-1 text-zinc-700">{"[SurfaceArea]"}</span>}
                      {activeTab === "collection" && <span className="inline-block bg-white border border-zinc-200 px-1.5 py-0.5 rounded mx-1 text-zinc-700">{"[Address]"}</span>}
                    </p>
                    <textarea 
                      rows={8}
                      value={baseTemplateEditorText}
                      onChange={(e) => setBaseTemplateEditorText(e.target.value)}
                      className="w-full p-4 bg-white border border-zinc-300 rounded-lg text-zinc-800 outline-none text-sm focus:border-brand-primary transition duration-150 font-mono leading-relaxed"
                      placeholder="Soạn nội dung mẫu gốc..."
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsEditingBaseTemplate(false)}
                        className="px-3.5 py-1.5 border border-zinc-300 text-zinc-500 rounded text-xs hover:bg-zinc-50 cursor-pointer font-semibold"
                      >
                        Hủy bỏ / Cancel
                      </button>
                      <button
                        onClick={handleSaveBaseTemplate}
                        className="px-3.5 py-1.5 bg-brand-primary text-white rounded text-xs hover:bg-brand-primary/95 cursor-pointer font-semibold"
                      >
                        Lưu mẫu gốc / Save Master
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <input 
                        type="text" 
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-lg text-zinc-800 outline-none text-sm focus:border-brand-primary transition duration-150 font-semibold"
                        placeholder="Tiêu đề email..."
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-zinc-550 uppercase tracking-wide block mb-1">Nội dung gửi / Live Preview Draft</label>
                      <textarea 
                        rows={8}
                        value={emailContent}
                        onChange={(e) => setEmailContent(e.target.value)}
                        className="w-full p-4 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-800 outline-none text-sm focus:border-brand-primary transition duration-150 font-mono leading-relaxed"
                      />
                      <p className="text-[10px] text-zinc-400 mt-1">
                        * Bạn có thể chỉnh sửa văn bản trực tiếp trong bảng soạn thảo này trước khi bấm gửi. 
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Bottom action buttons footer */}
            <div className="p-6 border-t border-zinc-200 flex items-center justify-between bg-zinc-50/50">
              
              <button 
                onClick={() => setIsEmailModalOpen(false)}
                className="px-4 py-2.5 border border-zinc-300 hover:bg-zinc-100 hover:text-zinc-800 rounded-lg font-semibold text-xs text-zinc-500 transition duration-150 cursor-pointer"
              >
                Hủy bỏ / Cancel
              </button>

              <button 
                onClick={handleSendEmail}
                disabled={isSendingEmail || isEditingBaseTemplate || !emailContent.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold font-heading rounded-lg hover:shadow-lg disabled:opacity-50 transition duration-150 cursor-pointer text-xs"
              >
                {isSendingEmail ? (
                  <span>Đang gửi / Sending...</span>
                ) : (
                  <>
                    <Send size={12} />
                    <span>
                      {currentQueueIndex === emailQueue.length - 1 
                        ? "Gửi & Hoàn tất / Confirm & Send" 
                        : "Gửi & Chuyển tiếp / Confirm & Next"}
                    </span>
                  </>
                )}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
