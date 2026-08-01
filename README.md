# MarketIntel AI | Autonomous Agentic Research Platform

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![CrewAI](https://img.shields.io/badge/CrewAI-FF4F00?style=for-the-badge&logo=python&logoColor=white)

**Beyond the Prompt. Into the Engine.** MarketIntel AI is a production-ready, 3-tier SaaS platform that orchestrates a specialized crew of autonomous AI agents to dissect a company’s technical DNA, market trajectory, and user sentiment. Deep-stack intelligence, delivered in minutes.

---

## 🏗️ System Architecture

To ensure high availability and scalability, the application is decoupled into a **3-Tier Microservices Architecture**:

1. **Client (React/Vite):** A high-performance, glassmorphism dashboard built with Tailwind and Shadcn/UI. Deployed on **Vercel**.
2. **Gateway Server (Node.js/Express):** Handles JWT authentication, request rate-limiting (Credit System), and persistent report storage via **MongoDB Atlas**. Deployed on **Render**.
3. **AI Core Microservice (FastAPI):** A private, high-timeout backend that executes long-running multi-agent workflows using **CrewAI** and **LiteLLM**. Deployed on **Render**.

---

## 🤖 The Sequential Multi-Agent Relay

Instead of relying on a single LLM prompt, this engine uses a specialized relay of agents powered by **Groq (Llama-3.3-70B-Versatile)** and **Gemini-2.5-flash** for high-speed, high-fidelity reasoning.

* 🔍 **The Investigator:** Bypasses marketing noise, using custom Token-Safe scrapers (Firecrawl + Serper) to extract raw technical stacks and Reddit/G2 sentiment.
* ♟️ **The Strategist:** Identifies technical friction points and market gaps from the raw signals.
* 🏗️ **The Architect:** Maps out concrete technical execution paths to solve identified friction points.
* 🛡️ **The Auditor:** Stress-tests the roadmap, flagging regulatory, competitive, or technical adoption risks.
* 📄 **The Reporter:** Synthesizes the relay into a strict, production-ready JSON schema for the UI.

---

## ✨ Key Technical Features

* **Custom Token-Safe Web Scrapers:** Engineered a wrapper around Firecrawl API to hard-truncate HTML/DOM noise, dropping token consumption by 70% and bypassing strict LLM rate limits.
* **Context Contamination Guardrails:** Agents are initialized with strict "Clean-Room" personas to prevent identity leaks and hallucinations.
* **Asynchronous Data Vault:** Intelligence reports are cached in MongoDB, allowing users to instantly retrieve historical analyses without triggering expensive 8-minute AI runs.
* **Portable Intelligence:** Integrated PDF export functionality (`react-to-print`) for immediate report sharing.

---

## 📂 Monorepo Structure

```text
Market_Intelligence_Agent/
├── agentservice/         # FastAPI, CrewAI logic, Custom Tools
├── backend/              # Node.js, Express, MongoDB schemas
└── frontend/             # React, Vite, Tailwind, Components
