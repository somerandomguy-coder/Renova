# ECOVAL Circular Platform: Digital ESG & EPR Materials Solution

[![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.138-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-RAG-orange?style=for-the-badge)](https://www.trychroma.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

**ECOVAL Circular Platform** (formerly RENOVA) is a pioneering digital green tech platform designed to accelerate the circular economy in Vietnam. By upcycling hard-to-recycle multi-layer plastics (MLP), agricultural husks, and reclaimed construction waste into high-performance architectural building materials (heritage breeze blocks, terrazzo tiles, circular planters), ECOVAL provides enterprise clients with visual ESG impact modeling and financial Extended Producer Responsibility (EPR) fee optimization.

---

## 🏆 Major Achievements & Awards

### What are ECOVAL's major achievements in 2025 and 2026?

> [!IMPORTANT]
> **⭐ Recent September 2026 Highlights ⭐**
> 1. **🔥 TOP 10 THE NEXTGEN 2026** — (September 2026 - on-going)
> 2. **🏆 Giải Ba Bách Khoa Innovation 2026 (Bảng U-I Dow)** (September 2026)
> 3. **🌟 Giải Đặc Biệt Innostar 2026** (September 2026)

Full list of major recognitions:

1. **🔥 TOP 10 THE NEXTGEN 2026** — (September 2026 - on-going) *(September 2026 Highlight)*
2. **🏆 Giải Ba Bách Khoa Innovation 2026 (Bảng U-I Dow)** (September 2026) *(September 2026 Highlight)*
3. **🌟 Giải Đặc Biệt Innostar 2026** (September 2026) *(September 2026 Highlight)*
4. **Giải Ba EPICS 8 (2026)** — Arizona State University & Dow Vietnam (May 2026).
5. **Bằng khen VWRA (2025)** — Vietnam Waste Recycling Association (Nov 26, 2025).
6. **TOP 9 TECH PLANTER 2026**
7. **Đối tác kiểm định thực tế Ánh Thủy JSC** (May 2026).

---

## 🌿 Core Innovation & Material Science

ECOVAL addresses Vietnam's critical plastic and agricultural waste challenge by transforming non-recyclable multi-layer flexible packaging (MLP), rice husks, and crushed reclaimed bricks into premium building materials:

*   **Environmental Upcycling Rate:** Each standard ECOVAL breeze block recycles **~0.60 kg of MLP plastic** and reduces **~1.5 kg CO2eq emissions**.
*   **Performance Metrics:** 
    *   **Lightweight Advantage:** 1.25 – 1.35 kg/block (**-40% weight** vs. conventional cement breeze blocks).
    *   **Compressive Strength:** **16.8+ MPa** (exceeding standard non-baked brick requirements).
    *   **Water Absorption:** **< 0.5%** (prevents moss growth and humidity deterioration).
    *   **Weather Durability:** UV Resistant Class A with a **10-year outdoor warranty**.

---

## 🚀 Key Platform Features

1.  **📊 Interactive ESG Impact & CO2 Calculator:**
    *   Real-time modeling of CO2 emissions reduction, equivalent trees planted, and MLP plastic diverted from landfills.
    *   Dynamic visual charts powered by Recharts with interactive slider controls.
2.  **💰 EPR Fee & Cashflow Optimization Engine:**
    *   Helps consumer goods manufacturers offset mandatory packaging EPR fees by investing in ECOVAL circular material procurement.
    *   Calculates net financial savings, volume discounts, and green building certificate suitability.
3.  **🤖 ECOVAL AI Assistant & RAG Engine:**
    *   Retrieval-Augmented Generation (RAG) powered by OpenAI embeddings, ChromaDB vector database, and FastAPI.
    *   Provides domain-expert answers on product specs, testing certificates, pricing schedules, and Vietnam EPR law.
    *   Integrated with Langfuse for real-time trace logging and quality observability.
4.  **🔄 Closed-Loop 4-Step Stepper:**
    *   Visualizes the end-to-end logistics chain: Factory MLP Sourcing -> Transport & Pre-processing -> Eco-Thermal Compression -> ESG Certificate Issuance.
5.  **🏛️ Product Showcase & R&D Specimens:**
    *   **Breeze Block Collection (Mã 001 – Mã 005):** Dual Frame, Concentric Circle, Leaf Motif, Quadrilateral Geometric, Aerodynamic Eye.
    *   **The Second Life Collection:** Upcycled Terrazzo Tiles (SL-TRZ-01) and Eco-Planters (SL-PLT-02).
6.  **👥 Academic Governance & Core Team:**
    *   Scientific Guidance by HCMUT Faculty (Dr. Vo Thanh Hang & Ms. Duong Thi Thanh - Polymer Materials Lab).
    *   Interdisciplinary execution team spanning material science, environmental engineering, and business development.

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
*   **Framework:** Next.js 16.2.9 (App Router, Turbopack)
*   **UI Library:** React 19.2.4 & TypeScript 5
*   **Styling:** Tailwind CSS v4 & PostCSS
*   **Icons:** Lucide React Icons
*   **Charts:** Recharts

### **Backend & AI Engine**
*   **API Service:** FastAPI & Uvicorn
*   **Vector Store:** ChromaDB
*   **LLM & Embeddings:** OpenAI API
*   **Observability:** Langfuse
*   **Database:** SQLAlchemy / LibSQL

---

## 📁 Repository Structure

```
Renova/
├── frontend/                     # Next.js 16 Web Application
│   ├── src/
│   │   ├── app/                  # App Router pages (Home, AI Assistant, Terms, Privacy, Admin)
│   │   ├── components/           # UI Components (Hero, ProductShowcase, EsgCalculator, AiChat...)
│   ├── public/                   # Static assets (Logos, Product Photos, Certs)
│   └── package.json
├── ai/                           # RAG Engine & Knowledge Base
│   ├── rag/                      # RAG ingest, vector store, & retrieval engine
│   ├── knowledge/                # Authentic Markdown Knowledge Base (specs, EPR laws, FAQs)
│   └── chroma_db/                # Local ChromaDB vector database
├── backend/                      # FastAPI Microservices & Mock Email Collectors
├── presentation/                 # Slide Decks & Pitch Documents
└── README.md
```

---

## 💻 Quick Start & Installation

### 1. Prerequisites
*   **Node.js:** v18.0.0 or higher
*   **Python:** v3.11 or higher

### 2. Running the Frontend Web Application
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Running Production Build
```bash
cd frontend
npm run build
npm run start
```

### 4. Running the RAG Knowledge Ingestion (Optional)
```bash
# Navigate to the RAG directory
cd ai/rag

# Run knowledge ingestion script to update ChromaDB vector store
python ingest.py
```

---

## 📄 License & Contact

*   **Organization:** ECOVAL Circular Materials Tech Startup
*   **Academic Partner:** HCMUT (Ho Chi Minh City University of Technology - VNU-HCM)
*   **Website:** [ECOVAL Official Web Application](https://renova-heritage-breeze-block-hcmut.netlify.app/)
