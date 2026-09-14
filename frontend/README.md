# 🌾 AgriMitra AI — Frontend & Android Mobile App
### *India's Multi-Agent Agricultural Intelligence & Precision Farming Platform*

<div align="center">

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Capacitor Android](https://img.shields.io/badge/Capacitor-Android%20Native-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![NVIDIA AI](https://img.shields.io/badge/NVIDIA-Nemotron--30B%20Omni-76B900?style=for-the-badge&logo=nvidia&logoColor=white)](https://build.nvidia.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Cloud%20Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-FF6B6B?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

[✨ Live Demo](https://agrimitra.vercel.app) • [📱 Download APK](https://github.com/KUNAHARISH/frontend_agrimitra/actions) • [📖 Documentation](#-core-features) • [🚀 Quick Start](#-quick-start)

</div>

---

## 🌟 Overview

**AgriMitra AI** is a modern, responsive web application and native Android mobile application designed to empower Indian farmers with real-time AI reasoning, visual leaf disease detection, localized Mandi price telemetry, and ICAR-backed agronomy practices.

Built with **React 19**, **Vite**, and **Capacitor**, it delivers seamless sub-second token streaming via NVIDIA Nemotron-30B and instant cross-device synchronization using Supabase Cloud.

---

## 🚀 Core Features

```
├── 🌿 AI Leaf Disease Doctor      Instant visual pathology detection with organic & chemical remedies
├── 💬 Multi-Agent Chatbot         Sub-second streaming assistant powered by NVIDIA Nemotron-30B
├── 🌾 My Crops & Farm Tracker      Interactive crop growth stages, NPK fertilizer alerts & task checklists
├── 📚 ICAR Crop Agronomy Guide     Comprehensive package-of-practices for 25+ major Indian cash & grain crops
├── 📈 Live Mandi Market Prices     Agmarknet wholesale price tracker with MSP benchmarks across states
├── ⛅ Agromet Weather Advisory     Hyperlocal rain telemetry, humidity indices & spray window recommendations
├── 🏛️ Government Schemes Portal    Central & State welfare schemes (PM-KISAN, PMFBY, Rythu Bharosa)
└── 📞 Kisan Helpline Directory    One-tap emergency access to Kisan Call Centre (1800-180-1551) & scientists
```

---

## 📱 Cross-Platform: Web + Android Native

AgriMitra AI is designed to run everywhere without separate codebases:

- **🌐 Responsive Web App**: Optimized for Desktops, Laptops, and Tablets.
- **📱 Android Native App (APK)**: Packaged via **Capacitor** with native camera and storage access for instant crop leaf scanning.
- **📲 Progressive Web App (PWA)**: 1-click installable from Google Chrome with offline caching and standalone full-screen view.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/) |
| **Styling & UI** | Curated Custom Glassmorphism CSS + [Lucide Icons](https://lucide.dev/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Mobile Runtime** | [Capacitor 8](https://capacitorjs.com/) (Android SDK 34+) |
| **AI Inference** | NVIDIA Nemotron-3-nano-omni-30b-reasoning (Multimodal) |
| **Cloud Database** | [Supabase](https://supabase.com/) (PostgreSQL & S3-compatible Object Storage) |
| **Routing** | [React Router v7](https://reactrouter.com/) |

---

## 🚀 Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

### 2. Installation
```bash
# Clone repository
git clone https://github.com/KUNAHARISH/frontend_agrimitra.git
cd frontend_agrimitra

# Install dependencies
npm install
```

### 3. Run Locally (Development)
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📦 Build & Deployment

### Build for Production Web
```bash
npm run build
```
The optimized production bundle will be created in the `dist/` directory, ready to deploy to **Vercel**, **Netlify**, or **Cloudflare Pages**.

### Build & Sync for Android
```bash
npm run android:build
```
This compiles the web app and synchronizes assets directly into the native Android Gradle project in `android/`.

---

## 🌐 Deploying to Vercel (1-Click)

1. Import this repository into [Vercel](https://vercel.com).
2. Configure settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variable:
   - `VITE_BACKEND_URL`: `https://your-agrimitra-backend.onrender.com`
4. Click **Deploy**.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/KUNAHARISH/frontend_agrimitra/issues).

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<div align="center">
  <sub>Built with ❤️ for Indian Farmers by <b>Kuna Harish</b></sub>
</div>
