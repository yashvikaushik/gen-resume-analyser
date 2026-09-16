# 🚀 HirePath – AI-Powered Resume Analyser & Interview Preparation Platform

An enterprise-grade, end-to-end full-stack platform that transforms resumes into targeted interview preparation roadmaps using Generative AI (Google Gemini & Groq).

![HirePath Platform](frontend/public/favicon.svg)

---

## 📖 Table of Contents

- [🌟 Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ System Architecture](#️-system-architecture)
- [🔄 Core Workflows & Data Flow](#-core-workflows--data-flow)
  - [1. Authentication & Security Flow](#1-authentication--security-flow)
  - [2. Resume PDF Parsing & AI Intelligence Pipeline](#2-resume-pdf-parsing--ai-intelligence-pipeline)
  - [3. Report Deep-Dive & PDF Export Engine](#3-report-deep-dive--pdf-export-engine)
- [📂 Project Directory Structure](#-project-directory-structure)
- [🔌 API Reference](#-api-reference)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Interview & Resume Report Endpoints](#interview--resume-report-endpoints)
- [⚙️ Environment Variables & Configuration](#️-environment-variables--configuration)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [🎨 Design System & Theme Support](#-design-system--theme-support)
- [🛡️ Reliability & Fallback Strategy](#️-reliability--fallback-strategy)

---

## 🌟 Key Features

### 📄 1. Intelligent Multimodal Resume Ingestion
- Upload PDF resumes (up to 5MB) via drag-and-drop or file picker.
- Server-side text extraction using `pdf-parse` with memory-buffer handling (no temp files on disk).
- Multi-input contextual analysis combining **Resume Text**, **Target Job Description**, and **Candidate Self-Description**.

### 🧠 2. Generative AI Career & Interview Engine
- **Role Match Score (0–100%)**: Quantitative score evaluating alignment between experience and requirements.
- **Executive Summary & Key Strengths**: High-level evaluation and candidate advantages.
- **Skill Gaps Analysis**: Identifies missing capabilities with categorized severity (`HIGH`, `MEDIUM`, `LOW`).
- **Technical Interview Questions & Solutions**: Tailored questions with interviewer assessment intent, recommended technical answers, and pro-tips.
- **Behavioral Questions & STAR Framework**: Culture-fit and scenario questions with STAR (Situation, Task, Action, Result) response guides.
- **Actionable Day-by-Day Preparation Plan**: Daily breakdown of focus topics and actionable tasks leading up to the interview.

### 📊 3. Interactive Analytics & Dashboard
- **Candidate Dashboard**: Overview of recent reports, average match scores, opportunities matching, and quick actions.
- **Reports History**: Searchable, filterable list of all past analyses with date sorting and instant report navigation.
- **Interactive Report Viewer**: Tabbed navigation, animated SVG match score gauge, collapsible question accordions, and day-by-day plan views.

### 🖨️ 4. Clean One-Click PDF Export Engine
- High-fidelity PDF generation via print stylesheet.
- Strips browser headers, footers, and localhost URLs (`@page { margin: 0; }`).
- Produces a clean, formatted multi-page executive report.

### 🔐 5. Enterprise Authentication & Security
- Secure registration and login with bcrypt password hashing (10 salt rounds).
- HTTP-only JWT cookies preventing XSS token theft.
- Token blacklisting on logout using Upstash Redis.
- Protected React route guards with persistent session verification.

---

## 🛠️ Tech Stack

### Frontend
- **Core**: React 19, Vite
- **Routing**: React Router v7 (`BrowserRouter`, Protected Route Guards)
- **State Management**: React Context API (`AuthContext`, custom `useAuth` hook)
- **HTTP Client**: Axios (configured with credentials and base URLs)
- **Styling**: Vanilla SCSS / CSS3 (Design tokens, Dark/Light theme switching, Glassmorphism, CSS Grid/Flexbox)
- **UI & Feedback**: `react-hot-toast`, custom vector SVG icons

### Backend
- **Runtime**: Node.js & Express 5
- **Database**: MongoDB & Mongoose ORM
- **Cache / Store**: Upstash Redis (JWT token blacklisting)
- **PDF Extraction**: `pdf-parse` & Multer memory storage
- **Security**: `jsonwebtoken` (JWT), `bcrypt`, `cookie-parser`, `cors`

### AI Engines
- **Primary Model**: Google Gemini Flash (`@google/genai`) with structured JSON schema validation via Zod (`zod-to-json-schema`)
- **Fallback / Backup Model**: Groq Cloud AI (`groq-sdk` with `llama-3.3-70b-versatile`) for 99.9% uptime reliability

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                            FRONTEND (React 19 / Vite)                        │
│                                                                              │
│  [ Auth Pages ]       [ Dashboard ]        [ Analyze Resume ]  [ Report View ]│
│  (Login/Register)     (Overview/Stats)     (Multi-Step Upload)  (Tabs/PDF)   │
│         │                   │                       │                │       │
│         └───────────────────┴───────────┬───────────┴────────────────┘       │
│                                         ▼                                    │
│                              [ React Context & API ]                         │
│                               (auth.api / interview.api)                     │
└─────────────────────────────────────────┬────────────────────────────────────┘
                                          │ HTTP / JSON / Multipart
                                          ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         BACKEND (Node.js / Express 5)                        │
│                                                                              │
│  [ CORS / Cookies / Multer ]                                                 │
│         │                                                                    │
│         ├──► [ /api/auth ] ──────► [ Auth Controller ]                       │
│         │                            ├── MongoDB (User Records)              │
│         │                            └── Upstash Redis (Token Blacklist)     │
│         │                                                                    │
│         └──► [ /api/interview ] ──► [ Interview Controller ]                 │
│                                      ├── [ PDF Extraction Service ]          │
│                                      └── [ AI Orchestration Service ]        │
│                                             ├── 1. Google Gemini Flash       │
│                                             └── 2. Groq Llama-3.3 Fallback   │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Core Workflows & Data Flow

### 1. Authentication & Security Flow
1. **User Registration / Login**: Credentials sent over HTTPS; password hashed with `bcrypt`.
2. **JWT Cookie**: Server sets an `httpOnly`, `secure`, `sameSite: strict` cookie containing the JWT.
3. **Session Verification**: Client invokes `/api/auth/me` on boot to initialize user state.
4. **Logout**: Token is extracted and stored in Upstash Redis with a TTL equal to token expiration, immediately invalidating the session.

### 2. Resume PDF Parsing & AI Intelligence Pipeline
1. **Upload**: User uploads a resume PDF alongside a Target Job Description and Self-Description.
2. **Buffer Parsing**: Multer passes the file buffer to `pdf-parse`, converting binary PDF streams into normalized plaintext.
3. **AI Generation with Strict Schema**:
   - The backend constructs an analysis prompt and invokes **Google Gemini Flash** with a typed Zod response schema.
   - If Gemini encounters temporary errors (503/429), the orchestrator automatically executes retries before seamlessly failing over to **Groq Llama-3.3-70B**.
4. **Persistence**: The structured JSON analysis is saved to MongoDB associated with the candidate's account.

### 3. Report Deep-Dive & PDF Export Engine
1. **Interactive Review**: Candidates explore their score, review accordion questions, and follow day-by-day prep tasks.
2. **PDF Export**: Triggering "Download PDF" leverages `@media print` stylesheets configured with `@page { margin: 0; }`, rendering a complete, formatted document without browser headers or footer URLs.

---

## 📂 Project Directory Structure

```
Gen-resume-analyser/
├── backend/
│   ├── server.js                          # Express server entry point
│   ├── package.json
│   └── src/
│       ├── app.js                         # App setup, middleware, routes mounting
│       ├── config/
│       │   ├── databse.js                 # MongoDB connection
│       │   └── redis.config.js            # Upstash Redis client
│       ├── controller/
│       │   ├── auth.controller.js         # Register, login, logout, me, profile
│       │   ├── interviewReport.controller.js # AI report generation & queries
│       │   └── resume.controller.js       # Resume extraction handlers
│       ├── midlleware/
│       │   ├── auth.middleware.js         # JWT validation & Redis blacklist check
│       │   └── upload.middleware.js       # Multer memory-storage PDF filter
│       ├── models/
│       │   ├── user.model.js              # User schema
│       │   └── InterviewReport.model.js   # Interview report schema & sub-documents
│       ├── routes/
│       │   ├── auth.routes.js             # Auth endpoints
│       │   ├── interviewReport.routes.js  # Report generation & retrieval
│       │   └── resume.routes.js           # Resume extraction route
│       └── services/
│           ├── ai.service.js              # Gemini AI service & retry handler
│           ├── groq.service.js            # Groq fallback AI service
│           ├── interviewReport.schema.js  # Zod schema for structured output
│           └── pdf.service.js             # pdf-parse text extraction
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── public/
│   │   └── favicon.svg                    # HirePath brand mark
│   └── src/
│       ├── main.jsx                       # React entry point
│       ├── app.routes.jsx                 # Router config & protected route guards
│       ├── index.css                      # Global theme tokens & print reset
│       ├── style.scss                     # Global utility classes & animations
│       ├── components/
│       │   └── layout/
│       │       ├── AppLayout.jsx          # Sidebar, topbar, brand logo, navigation
│       │       └── AppLayout.scss
│       └── features/
│           ├── auth/
│           │   ├── auth.context.jsx       # AuthContext & useAuth hook
│           │   ├── pages/
│           │   │   ├── Login.jsx          # Login view
│           │   │   ├── Register.jsx       # Register view
│           │   │   ├── ProfileSettings.jsx# Profile management
│           │   │   └── auth.form.scss
│           │   └── services/
│           │       └── auth.api.js        # Auth Axios API endpoints
│           ├── dashboard/
│           │   └── pages/
│           │       ├── Dashboard.jsx      # Metrics, opportunities, quick actions
│           │       └── Dashboard.scss
│           └── interview/
│               ├── pages/
│               │   ├── AnalyzeResume.jsx  # Multi-step resume upload & generator
│               │   ├── AnalyzeResume.scss
│               │   ├── ReportsList.jsx    # Searchable reports history
│               │   ├── ReportsList.scss
│               │   ├── ReportDetails.jsx  # Report view & print export
│               │   └── ReportDetails.scss
│               └── services/
│                   └── interview.api.js   # Interview API service
└── README.md
```

---

## 🔌 API Reference

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Create a new user account | No |
| `POST` | `/api/auth/login` | Authenticate and receive HTTP-only JWT | No |
| `POST` | `/api/auth/logout` | Invalidate token via Redis blacklist | Yes |
| `GET` | `/api/auth/me` | Fetch currently authenticated user | Yes |
| `PUT` | `/api/auth/profile` | Update username / profile details | Yes |

### Interview & Resume Report Endpoints (`/api/interview` & `/api/resume`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/interview/generate` | Upload PDF resume, job description, self-description & generate AI report | Yes |
| `GET` | `/api/interview/reports` | Get all generated reports for the current user | Yes |
| `GET` | `/api/interview/report/:id` | Fetch specific report details by ID | Yes |
| `DELETE` | `/api/interview/report/:id` | Delete a specific report | Yes |
| `POST` | `/api/resume/extract` | Extract raw text from an uploaded PDF | Yes |

---

## ⚙️ Environment Variables & Configuration

### Backend (`backend/.env`)

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hirepath?retryWrites=true&w=majority

# Security
JWT_SECRET=your_jwt_secret_key_here

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://<your-redis-instance>.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_token_here

# AI APIs
GOOGLE_GENAI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

### Frontend (`frontend/.env` optional)

```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0+ or v20.0+
- **MongoDB**: Local instance or MongoDB Atlas URI
- **Redis**: Upstash Redis or local Redis instance
- **API Keys**: Google Gemini API key and/or Groq API key

### Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env # Add your API keys and MongoDB URI

# 4. Start development server
npm run dev
# Server will run on http://localhost:3000
```

### Frontend Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
# Client will run on http://localhost:5173
```

---

## 🎨 Design System & Theme Support

- **Theme Mode**: Full Dark and Light theme support toggled in the application header and persisted in `localStorage`.
- **Responsive Layout**: Fluid layouts adapting across Mobile (< 768px), Tablet, and Desktop (1440px+).
- **Glassmorphism & Micro-animations**: Modern backdrop blurs, floating glow accents, and interactive transitions.

---

## 🛡️ Reliability & Fallback Strategy

To ensure zero downtime when calling LLM APIs:
1. **Primary Request**: Dispatches prompt to **Google Gemini Flash** with strict JSON schema enforcement.
2. **Automatic Retries**: If rate limits (`429`) or temporary service unavailability (`503`) occur, exponential backoff retries execute.
3. **Graceful Failover**: If Gemini is unreachable, the system automatically routes to **Groq Llama-3.3-70B**, ensuring reports always generate reliably.

---

## 📄 License

This project is licensed under the **ISC License**. Built with ❤️ for developers and job seekers.