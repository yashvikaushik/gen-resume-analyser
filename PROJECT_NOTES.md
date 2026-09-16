# 📝 Complete Project Notes: HirePath (AI-Powered Career & Resume Intelligence)

> **Comprehensive End-to-End Guide & Architecture Breakdown**  
> *Everything you need to understand, explain, present, or publish this project.*

---

## 📌 1. Project Overview & Vision

**HirePath** (Gen Resume Analyser) is an enterprise-grade, full-stack AI career acceleration platform. It solves a critical problem in the modern hiring landscape: **candidates often struggle to know how well their resumes match specific job descriptions and lack structured, role-targeted preparation for technical and behavioral interviews.**

### The Solution
HirePath allows candidates to:
1. **Upload their resume in PDF format** alongside a target Job Description and personal Self-Description.
2. **Extract and parse resume text on the fly** without storing sensitive files permanently on disk.
3. **Execute AI inference using Google Gemini Flash** (with fallback failover to **Groq Llama-3.3**) with strict typed JSON schema validation.
4. **Receive a comprehensive Interview Intelligence Report**:
   - Quantitative **Role Match Score (0–100%)**
   - **Executive Summary & Key Strengths**
   - **Skill Gaps Analysis** categorized by severity
   - **Technical Questions** with interviewer assessment intent, full answers, and pro-tips
   - **Behavioral Questions** with STAR method frameworks
   - **Actionable Day-by-Day Preparation Plan**
5. **Download a clean, one-click PDF report** optimized with custom print stylesheets that strip all browser URLs, headers, and navigation artifacts.

---

## 🛠️ 2. Comprehensive Tech Stack

| Layer | Technologies Used | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | **React 19**, **Vite** | Modern, blazing-fast Single Page Application (SPA) |
| **Routing** | **React Router v7** | Declarative client-side routing with route guards |
| **State Management** | **React Context API** (`useAuth`) | Global authentication state and session persistence |
| **Styling** | **Vanilla SCSS / CSS3** | Custom design system, CSS variables, Dark/Light modes, Glassmorphism |
| **HTTP Client** | **Axios** | API calls with `withCredentials: true` for HTTP-only cookies |
| **Notifications** | **react-hot-toast** | Sleek user alerts and feedback toasts |
| **Backend Runtime** | **Node.js** & **Express 5** | High-performance RESTful API microservices |
| **Database** | **MongoDB** & **Mongoose ORM** | Document store for users and structured interview reports |
| **Cache & Invalidation** | **Upstash Redis** | Instant JWT token blacklisting on user logout |
| **PDF Extraction** | **pdf-parse** + **Multer** | Memory-buffered parsing of binary PDF resume text |
| **Primary AI Model** | **Google Gemini 3.6 Flash** (`@google/genai`) | Structured multimodal text reasoning & report generation |
| **AI Schema Validation** | **Zod** + **zod-to-json-schema** | Guarantees 100% type-safe JSON schema responses from LLMs |
| **Fallback AI Model** | **Groq Cloud AI** (`groq-sdk`, Llama-3.3-70B) | High-speed backup model for 99.9% uptime reliability |

---

## 🏗️ 3. Architecture & Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                CLIENT (React 19)                             │
│                                                                              │
│  [ Login / Register ] ──► [ Dashboard ] ──► [ Analyze Resume ] ──► [ Report] │
│          │                      │                   │                    │   │
│          ▼                      ▼                   ▼                    ▼   │
│   (useAuth Hook)        (Metrics & Cards)     (PDF + Form Data)   (Tabs/PDF) │
└────────────────────────────────────────┬─────────────────────────────────────┘
                                         │ HTTPS Requests (Cookies / Multipart)
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                             EXPRESS 5 BACKEND API                            │
│                                                                              │
│  ├── [ Auth Middleware ] ────► Checks JWT Cookie & Redis Blacklist           │
│  │                                                                           │
│  ├── [ Multer Upload Middleware ] ──► Extracts PDF buffer in-memory          │
│  │                                                                           │
│  ├── [ PDF Parser Service ] ──► Converts binary PDF buffer to clean text     │
│  │                                                                           │
│  └── [ AI Orchestration Service ]                                            │
│            │                                                                 │
│            ├──► 1. Google Gemini Flash (Zod Schema Validation)               │
│            │        └── Automatic Retries on 429 / 503 / 5xx                 │
│            │                                                                 │
│            └──► 2. Failover to Groq Llama-3.3-70B (if Gemini unavailable)    │
└──────────────────┬─────────────────────────────────────┬─────────────────────┘
                   ▼                                     ▼
      ┌─────────────────────────┐           ┌─────────────────────────┐
      │     MongoDB Database    │           │      Upstash Redis      │
      │  - User Collections     │           │  - JWT Blacklisted Keys │
      │  - Interview Reports    │           │  - Expiration TTL Cache │
      └─────────────────────────┘           └─────────────────────────┘
```

---

## 🔍 4. Deep Dive into Key Modules

### A. Authentication & Session Security
- **Registration**: User inputs `username`, `email`, and `password`. The password is encrypted with `bcrypt` (10 salt rounds) before storing in MongoDB.
- **HTTP-Only Cookies**: Instead of vulnerable `localStorage` JWT storage, tokens are sent via `httpOnly`, `sameSite: strict` cookies, defending against XSS attacks.
- **Token Blacklisting with Redis**: When a user logs out, the JWT is stored in Upstash Redis with a TTL matching the token’s remaining lifespan. The `auth.middleware.js` checks both signature validity and the Redis blacklist before authorizing any request.

### B. In-Memory Resume PDF Parsing
- Traditional apps write uploaded files to disk (`/tmp`), posing storage cleanup risks and multi-tenant security concerns.
- **HirePath approach**: Uses `multer.memoryStorage()`, keeping the uploaded PDF file as a binary buffer in memory.
- `pdf.service.js` parses the buffer using `pdf-parse`, extracting clean plaintext paragraphs and stripping out unreadable metadata before feeding it directly to the AI prompt.

### C. Resilient AI Orchestration Pipeline
- **Zod Schema Definition (`interviewReport.schema.js`)**:
  Defines strict schemas for `technicalQuestions`, `behavioralQuestions`, `skillGaps`, `preparationPlan`, and `matchScore`.
- **Gemini Structured Output**: Uses `zodToJsonSchema` to force Gemini to return valid, uncorrupted JSON adhering to the exact schema.
- **Fail-Safe Retries & Groq Fallback**:
  If Gemini hits rate limits (HTTP `429`) or temporary upstream outages (HTTP `503`), the engine performs exponential backoff retries. If errors persist, it automatically switches to **Groq Cloud's `llama-3.3-70b-versatile`** model, guaranteeing continuous user experience.

### D. Multi-Step Interactive Form (`AnalyzeResume.jsx`)
- 4-Step visual indicator that reacts dynamically as the user interacts:
  1. **Upload Resume**: Validates file format (`.pdf`), size (`< 5MB`), and displays file name and size badge.
  2. **Candidate Bio / Self-Description**: Textarea capturing current role, projects, and key competencies.
  3. **Target Job Description**: Captures specific job requirements and tech stack expectations.
  4. **AI Generation**: Displays animated status indicators, processing tips, and seamlessly routes to the generated report upon completion.

### E. Interactive Report Viewer (`ReportDetails.jsx`)
- **Overview Tab**: Animated SVG circular match gauge, quick metric stats, executive summary, and side-by-side key strengths vs. improvement areas.
- **Technical Tab**: Expandable accordions with Question title, Interviewer assessment intent, comprehensive technical solution, and pro-tips.
- **Behavioral Tab**: Full STAR-method (Situation, Task, Action, Result) scenario answers.
- **Skill Gaps Tab**: Two-column matrix listing missing or insufficiently demonstrated skills with color-coded severity badges (`HIGH`, `MEDIUM`, `LOW`).
- **Preparation Plan Tab**: Grid and card layout dividing the preparation roadmap into structured days with daily task checklists.

### F. Print & PDF Export Engine
- Standard browser printing embeds unwanted header/footer artifacts like `localhost:5173/report/...` and timestamps.
- HirePath implements a custom `@media print` style system:
  - `@page { margin: 0; size: auto; }` strips all default browser URL headers and footers.
  - `a[href]::after { content: "" !important; display: none !important; }` prevents link URL text expansion.
  - Formats a dedicated `.print-full-report` container with `18mm 20mm` page padding, official vector branding, crisp headers, and `page-break-inside: avoid` card formatting for clean multi-page printing.

---

## 🗄️ 5. Database Schema & Data Models

### User Model (`user.model.js`)
```javascript
{
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  createdAt: Date,
  updatedAt: Date
}
```

### Interview Report Model (`InterviewReport.model.js`)
```javascript
{
  user: { type: ObjectId, ref: "users" },
  jobDescription:  { type: String, required: true },
  selfDescription: { type: String, required: true },
  resume:          { type: String, required: true },
  matchScore:      { type: Number, min: 0, max: 100, required: true },
  technicalQuestions: [{
    question: String,
    intend: String,
    answer: String
  }],
  behavioralQuestions: [{
    question: String,
    intend: String,
    answer: String
  }],
  skillGaps: [{
    skill: String,
    severity: { type: String, enum: ["low", "medium", "high"] }
  }],
  preparationPlan: [{
    day: Number,
    focusAreas: String,
    tasksOfDay: [String]
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📡 6. Complete API Reference

### 🔐 Authentication Endpoints (`/api/auth`)

| Endpoint | Method | Request Body | Response | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | `{ username, email, password }` | `{ user, message }` + Set-Cookie | Registers candidate & sets JWT |
| `/api/auth/login` | `POST` | `{ email, password }` | `{ user, message }` + Set-Cookie | Authenticates candidate |
| `/api/auth/logout` | `POST` | *None* | `{ message }` | Adds JWT to Redis blacklist & clears cookie |
| `/api/auth/me` | `GET` | *None* | `{ user }` | Checks active session |
| `/api/auth/profile` | `PUT` | `{ username }` | `{ user, message }` | Updates candidate profile |

### 📄 AI Resume & Interview Endpoints (`/api/interview` & `/api/resume`)

| Endpoint | Method | Request Type / Body | Response | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/api/interview/generate` | `POST` | `multipart/form-data`<br>- `resume` (PDF file)<br>- `jobDescription`<br>- `selfDescription` | `{ report, message }` | Parses PDF, executes AI inference, saves report |
| `/api/interview/reports` | `GET` | *None* | `{ reports: [...] }` | Returns all reports belonging to candidate |
| `/api/interview/report/:id` | `GET` | *URL Param: id* | `{ report }` | Returns complete report details |
| `/api/interview/report/:id` | `DELETE` | *URL Param: id* | `{ message }` | Deletes report by ID |
| `/api/resume/extract` | `POST` | `multipart/form-data` (PDF) | `{ text }` | Raw text extraction from PDF |

---

## ⚙️ 7. Environment Variables Configuration

### Backend `.env`
```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hirepath?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
UPSTASH_REDIS_REST_URL=https://<your-redis-instance>.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
GOOGLE_GENAI_API_KEY=your_google_gemini_api_key
GROQ_API_KEY=your_groq_api_key
```

### Frontend Configuration
Vite proxy or environment:
```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## 🚀 8. Running the Application Locally

```bash
# 1. Clone repository
git clone https://github.com/yashvikaushik/gen-resume-analyser.git
cd gen-resume-analyser

# 2. Setup Backend
cd backend
npm install
npm run dev # Starts Express server on http://localhost:3000

# 3. Setup Frontend (in another terminal)
cd ../frontend
npm install
npm run dev # Starts Vite server on http://localhost:5173
```

---

## 💡 9. Key Technical Talking Points for Presentations / Interviews

1. **Why in-memory buffer parsing?**  
   *Eliminates I/O disk bottlenecks, avoids filesystem permission issues, and adheres to data privacy standards by never saving raw PDFs permanently.*
2. **Why Zod JSON Schema with Gemini?**  
   *LLMs naturally output conversational markdown which can break frontends. Zod enforces deterministic, type-safe JSON structures.*
3. **Why Upstash Redis for Token Blacklisting?**  
   *Provides O(1) lightning-fast lookup on every request without burdening MongoDB, while automatic TTL expirations prevent database bloat.*
4. **Why custom `@media print` styling over client-side canvas renderers?**  
   *Native browser print stylesheets produce crisp, selectable vector text and scalable typography at any DPI without adding heavy external library dependencies.*

---

*Authored by Yashvi Kaushik • HirePath Platform*
