# Design Spec: ECOVAL Rebrand, DeepSeek API Integration & AI Workspace Page

**Date**: 2026-08-09  
**Status**: Approved by User  
**Target Deadline**: 7:00 AM (09/08/2026 Vietnam Time)

---

## 1. Executive Summary

This design covers three core updates for the RENOVA application:
1. **Full Rebranding**: Migrate all user-facing and backend brand references from **RENOVA** to **ECOVAL** (ECOVAL Sustainable Materials / ECOVAL Circular). Replace the brand logo across the site with the newly supplied `new_logo.jpeg`.
2. **DeepSeek API Integration & Benchmarking**: Migrate the LLM inference layer from Groq/Ollama to DeepSeek API (`deepseek-chat` / DeepSeek-V3). Include a automated benchmark suite (`test_deepseek_bench.py`) to measure latency, token usage, cost variance, and answer quality across 10 realistic customer inquiries.
3. **Dedicated ECOVAL AI Workspace Page (`/ai-assistant`)**: Build a full-featured, 3-column AI interactive page at `frontend/src/app/ai-assistant/page.tsx` for purchasing gạch bông gió (breeze blocks), calculating ESG/EPR savings, and viewing technical drawings & CAD specifications.

---

## 2. Rebranding & Asset Migration Specs

### 2.1 Asset Updates
- Source Logo: `c:\Users\Nam\Projects\Web Development (On-going)\Renova\new_logo.jpeg`
- Destination Logo: `frontend/public/ecoval_logo.jpeg`
- Update Header/Navigation logo references in `frontend/src/app/page.tsx` and Footer to point to `/ecoval_logo.jpeg`.

### 2.2 Brand Text Substitutions
Replace all brand instances across the codebase:
- `RENOVA` ➔ `ECOVAL`
- `RENOVA Circular` ➔ `ECOVAL Sustainable Materials`
- `Gạch RENOVA` / `Gạch bông gió RENOVA` ➔ `Gạch ECOVAL` / `Gạch bông gió ECOVAL`
- `renova_knowledge` ➔ `ecoval_knowledge`
- Affected areas: `frontend/src/components/*`, `frontend/src/app/*`, `ai/knowledge/*.md`, `ai/rag/config.py`, `backend/app/services/*.py`, `backend/app/schemas.py`, `backend/app/main.py`.

---

## 3. DeepSeek API Architecture & Benchmarking

### 3.1 LLM Engine Integration
DeepSeek API adheres to OpenAI Chat Completion standards (`https://api.deepseek.com` / `deepseek-chat`).
- Environment variables setup:
  ```bash
  LLM_PROVIDER=openai
  LLM_BASE_URL=https://api.deepseek.com
  LLM_API_KEY=<user_deepseek_api_key>
  LLM_MODEL=deepseek-chat
  ```
- **Embedding / Vector Search**: Groq is completely removed. DeepSeek handles all chat completion and reasoning. Vector retrieval continues to use ChromaDB (`EMBEDDING_PROVIDER=local` locally, or HuggingFace cloud in production).

### 3.2 Automated Local Benchmark Suite (`test_deepseek_bench.py`)
Create a local benchmark script that runs 10 realistic customer scenarios:
1. Product specs & compressive strength (MPa)
2. Breeze block dimensions & weight (1.5 kg, 70/25/5 ratio)
3. Pricing & bulk order quote requests
4. ESG CO2 reduction calculations
5. EPR compliance & refund mechanisms
6. Climate resilience & thermal insulation properties
7. Raw material supply partnership (MLP plastic & rice husk)
8. Custom CAD drawing & ventilation design inquiries
9. Company background & contact details
10. Irrelevant topic handling & system prompt guardrails

**Metrics Measured**:
- Time to First Token (TTFT)
- Total Latency (seconds)
- Input & Output Token Counts
- Cost per query (USD & VND based on $0.14/1M input, $0.28/1M output)
- Answer Accuracy & Citation Quality

---

## 4. ECOVAL AI Workspace Page (`/ai-assistant`)

### 4.1 Page Layout (`frontend/src/app/ai-assistant/page.tsx`)
A 3-column layout:

```
+------------------+----------------------------------+-----------------------------+
| Left Sidebar     | Main Chat Column                 | Right Interactive Viewer    |
| (Quick Tools)    | (DeepSeek Streaming Chat)        | (Drawing & Order Summary)   |
| - 🛒 Quick Order | - Real-time SSE Token Output     | - 📐 CAD & Spec Preview     |
| - 🧮 ESG Calc    | - Suggested Prompt Chips         | - 📊 Cost & EPR Summary     |
| - 📐 Spec Viewer | - Bilingual Toggle (VI / EN)     | - 📄 Cert & PDF Link        |
+------------------+----------------------------------+-----------------------------+
```

### 4.2 Features
- **Header**: Back to Home link, ECOVAL logo, language selector, and DeepSeek AI Status badge.
- **Quick Actions**: Buttons on left panel populate chat inputs or open drawing modals automatically.
- **Interactive Technical Viewer**: Displays block geometry (200x200x65mm), weight (1.5kg), 70% MLP / 25% Rice Husk / 5% Additives formula, and 7.8-8.2 MPa strength badge.

---

## 5. Verification Plan

1. Run `python -m ai.rag.ingest` to re-index knowledge under ECOVAL branding.
2. Execute `python test_deepseek_bench.py` locally to record latency & cost report.
3. Verify Next.js build passes cleanly (`npm run build`).
4. Verify `/` and `/ai-assistant` UI render the new logo and brand text correctly in both dark and light modes.
