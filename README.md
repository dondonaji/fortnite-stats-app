# 🎮 Fortnite Stats Tracker 2.0

> A next-generation competitive analytics dashboard built with **Next.js 16** and **Supabase**.

![Next.js 16](https://img.shields.io/badge/Next.js-16.1-black)
![React 19](https://img.shields.io/badge/React-19-blue)
![Supabase](https://img.shields.io/badge/Backend-Supabase-green)
![Tailwind](https://img.shields.io/badge/Style-Tailwind_v4-cyan)

## 🚀 Overview

**Fortnite Stats Tracker 2.0** represents a complete architectural overhaul of the original Python/Streamlit tool. It transforms the project into a high-performance, real-time web application designed for competitive players who need deep insights into their gameplay.

The goal is to provide **Professional Grade Analytics** with a UI that feels as responsive as the game itself.

## ✨ Key Features

-   **⚡ Blazing Fast**: Powered by Next.js 16 App Router and React Server Components (RSC).
-   **📊 Deep Analytics**: K/D visualization, Win Rate trends, and Loadout efficacy analysis using `recharts`.
-   **🎨 Modern UI**: Fully responsive, dark-themed interface built with **Tailwind CSS v4** and **Radix UI**.
-   **🔁 Real-time Data**: Integration with Fortnite API via Supabase edge functions (planned).

## 🏗️ Architecture

This repository contains two generations of the application:

### 🌟 `fortnite-stats-web` (Current)
The production-ready web application.
*   **Framework**: Next.js 16 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS v4
*   **State**: SWR + React Server Actions

### 📦 `_legacy` / Root (Deprecated)
The original prototype built with Python and Streamlit. Kept for historical reference of the logic.

## 🛠️ Getting Started

To run the modern web application:

### 1. Navigate to the web project
```bash
cd fortnite-stats-web
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📄 License
MIT
