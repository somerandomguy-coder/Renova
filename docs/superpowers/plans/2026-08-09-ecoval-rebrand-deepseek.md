# ECOVAL Rebrand, DeepSeek Migration & AI Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand the application from RENOVA to ECOVAL (incorporating new logo), configure DeepSeek API support with local benchmarking tools, and build a dedicated `/ai-assistant` AI Workspace page.

**Architecture:** Frontend Next.js app updated with new logo (`ecoval_logo.jpeg`), rebranded UI components, and new 3-column AI Workspace route at `/ai-assistant`. Backend RAG engine (`ai/rag/`) updated to default to `ecoval_knowledge` collection and DeepSeek API compatibility. Automated benchmark script (`test_deepseek_bench.py`) created to test 10 customer question scenarios.

**Tech Stack:** Next.js 16 (React 19), Tailwind CSS v4, Lucide React, FastAPI, ChromaDB, DeepSeek API (OpenAI SDK Compatible).

## Global Constraints
- Target Deadline: 7:00 AM (09/08/2026 Vietnam Time).
- Rebrand terms: `RENOVA` ➔ `ECOVAL`, `RENOVA Circular` ➔ `ECOVAL Sustainable Materials`, `Gạch RENOVA` ➔ `Gạch ECOVAL`.
- Logo location: `/ecoval_logo.jpeg` in `frontend/public/`.

---

### Task 1: Rebrand Asset & Knowledge Base (`ai/knowledge/`)

**Files:**
- Create: `frontend/public/ecoval_logo.jpeg` (copied from `new_logo.jpeg`)
- Modify: `ai/knowledge/company_overview.md`, `ai/knowledge/epr_regulations.md`, `ai/knowledge/esg_formulas.md`, `ai/knowledge/faq.md`, `ai/knowledge/product_specs.md`, `ai/knowledge/rd_specimens.md`
- Modify: `ai/rag/config.py`, `ai/rag/vector_store.py`

- [ ] **Step 1: Copy logo file**

Copy `C:\Users\Nam\Projects\Web Development (On-going)\Renova\new_logo.jpeg` to `frontend/public/ecoval_logo.jpeg`.

- [ ] **Step 2: Update Knowledge Base markdown files**

Replace all references to RENOVA with ECOVAL across `ai/knowledge/*.md`.

- [ ] **Step 3: Update Vector Store collection name**

In `ai/rag/vector_store.py`, change `COLLECTION_NAME = "renova_knowledge"` to `COLLECTION_NAME = "ecoval_knowledge"`. In `ai/rag/config.py`, update system prompt to "You are ECOVAL AI Assistant — a sustainability advisor for ECOVAL Sustainable Materials...".

- [ ] **Step 4: Re-ingest knowledge base**

Run: `.\backend\.venv\Scripts\python.exe -m ai.rag.ingest`
Expected output: `[INGEST] DONE: 7 chunks from 6 files ingested.`

- [ ] **Step 5: Commit**

`git add frontend/public/ecoval_logo.jpeg ai/ ai/rag/`
`git commit -m "feat(rebrand): update logo and knowledge base from RENOVA to ECOVAL"`

---

### Task 2: Rebrand Frontend Components & Navigation

**Files:**
- Modify: `frontend/src/app/page.tsx`
- Modify: `frontend/src/components/HeroSection.tsx`
- Modify: `frontend/src/components/AiChat.tsx`
- Modify: `frontend/src/components/ComparisonMatrix.tsx`
- Modify: `frontend/src/components/EprStepper.tsx`
- Modify: `frontend/src/components/EsgCalculator.tsx`
- Modify: `frontend/src/components/EsgVision.tsx`
- Modify: `frontend/src/components/FinancialReport.tsx`
- Modify: `frontend/src/components/InteractiveTimeline.tsx`
- Modify: `frontend/src/components/Milestones.tsx`
- Modify: `frontend/src/components/RdShowcase.tsx`
- Modify: `frontend/src/components/RegistrationForms.tsx`
- Modify: `frontend/src/components/Stakeholders.tsx`

- [ ] **Step 1: Update Logo & Brand Header in page.tsx and HeroSection.tsx**

Update `<img>` tag in `page.tsx` to point to `/ecoval_logo.jpeg` and update alt/title text to "ECOVAL". Update brand badges to "SUSTAINABLE MATERIALS".

- [ ] **Step 2: Update all text strings in frontend components**

Replace all RENOVA references with ECOVAL across all 13 components in `frontend/src/components/` and `page.tsx`. Add "Trợ lý ECOVAL AI" nav link pointing to `/ai-assistant`.

- [ ] **Step 3: Test Next.js build**

Run: `npm --prefix frontend run build`
Expected: Successful Turbopack / Next.js build.

- [ ] **Step 4: Commit**

`git add frontend/`
`git commit -m "feat(rebrand): update frontend UI text and logo to ECOVAL"`

---

### Task 3: Rebrand Backend API Services & Schemas

**Files:**
- Modify: `backend/app/config.py`
- Modify: `backend/app/main.py`
- Modify: `backend/app/schemas.py`
- Modify: `backend/app/services/emails.py`
- Modify: `backend/app/services/security.py`

- [ ] **Step 1: Replace RENOVA text in backend files**

Update `PROJECT_NAME = "ECOVAL Sustainable Materials & ESG API"`, email templates in `emails.py`, schemas field descriptions in `schemas.py`, and endpoint docstrings in `main.py`.

- [ ] **Step 2: Run pytest suite**

Run: `.\backend\.venv\Scripts\pytest backend/test_backend.py -v`
Expected: PASS all tests.

- [ ] **Step 3: Commit**

`git add backend/`
`git commit -m "feat(rebrand): update backend API schemas and services to ECOVAL"`

---

### Task 4: DeepSeek API Benchmark Suite (`test_deepseek_bench.py`)

**Files:**
- Create: `test_deepseek_bench.py`

- [ ] **Step 1: Create test_deepseek_bench.py**

Build a Python script with 10 real customer questions (breeze block weight, compressive strength 7.8-8.2 MPa, prices, EPR refund mechanism, custom CAD inquiries). Measure latency (s), TTFT (s), input/output token counts, and cost in USD & VND.

- [ ] **Step 2: Run benchmark locally**

Run: `.\backend\.venv\Scripts\python.exe test_deepseek_bench.py`
Expected: Formatted table with per-question latency, token breakdown, accuracy, and total cost report.

- [ ] **Step 3: Commit**

`git add test_deepseek_bench.py`
`git commit -m "feat(ai): add DeepSeek API customer Q&A benchmarking suite"`

---

### Task 5: Build Standalone ECOVAL AI Workspace (`/ai-assistant`)

**Files:**
- Create: `frontend/src/app/ai-assistant/page.tsx`

- [ ] **Step 1: Build the 3-column AI Workspace page**

Build `frontend/src/app/ai-assistant/page.tsx` featuring:
- Left Column: Quick Action Tools (🛒 Order Quote, 🧮 ESG/EPR Calc, 📐 Technical Drawings).
- Middle Column: DeepSeek RAG AI Chatbot with real-time SSE streaming, token-by-token typewriter effect, quick prompt chips, and bilingual support.
- Right Column: Interactive Spec & Technical Drawing Viewer showing 1.5kg block specs (70% plastic / 25% rice husk / 5% additives), 7.8-8.2 MPa strength, 2D/3D CAD preview modal, and instant order quotation summary.

- [ ] **Step 2: Verify page build**

Run: `npm --prefix frontend run build`
Expected: Build succeeds with `/ai-assistant` static/SSR route generated.

- [ ] **Step 3: Commit**

`git add frontend/src/app/ai-assistant/`
`git commit -m "feat(ai): add standalone ECOVAL AI Workspace page at /ai-assistant"`
