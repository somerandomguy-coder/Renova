# RENOVA Circular: Digital ESG & EPR Platform

**RENOVA Circular** is a digital platform designed to digitalize circular economy models, offering visual forecasts of ecological impacts and financial benefits for enterprises. The platform showcases how hard-to-recycle multi-layer plastics (MLP) and agricultural husks are processed into ecological building materials (e.g., breeze blocks) that can be offset against corporate Extended Producer Responsibility (EPR) obligations.

---

## 🚀 Key Features

*   **ESG Environmental Impact Calculator:** Computes CO2 reduction and equivalent trees saved based on the quantity of eco-friendly building blocks. Includes dynamic, scroll-triggered visual charts (using Recharts).
*   **EPR Cashflow Optimization Engine:** Minimizes government-mandated EPR fees by calculating the exact discount and net cash benefit of investing in RENOVA building materials to offset packaging waste.
*   **R&D Specifications Showcase:** Interactive library featuring material composition, compressive strength, UV certifications, and water absorption rates of different R&D generations.
*   **Closed-Loop Stepper:** Visualizes the 4-step logistics chain—from sourcing multi-layer plastic from factories, to transport, green block fabrication, and digital ESG cert validation.
*   **Dual Frontend Deployments:**
    1.  **Next.js Web Application:** Fully responsive app built with Next.js 14, React, and TypeScript.
    2.  **Standalone HTML Preview (`renova_demo.html`):** A single self-contained document using CDN libraries (Chart.js, Lucide Icons) for instant client-side testing with zero dependencies.

---

## 🛠️ Technology Stack

*   **Core Frontend:** Next.js (App Router), React, TypeScript.
*   **Visual Charts:** Recharts (React version) & Chart.js (HTML version).
*   **Icons:** Lucide Icons.
*   **Styling:** Vanilla CSS, CSS Modules, HSL color tokens, glassmorphism, and custom scroll-triggered keyframe animations.
*   **Design System:** Sleek light/eco theme with alternating dark sections for high contrast readability.

---

## 💻 Local Setup & Execution

### 1. Running the Next.js Web App
Navigate to the frontend folder, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 2. Standalone HTML Preview
Double-click `renova_demo.html` in the project root to open it directly in any web browser, or serve it locally.
