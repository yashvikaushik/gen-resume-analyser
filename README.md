# 🚀 Gen Resume Analyser

An AI-powered full-stack application designed to help users analyse their resumes, optimize their job applications, and prepare for interviews using Generative AI.

> 🚧 **Status**: Active Development — Authentication & Full-Stack Foundation Complete

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Architecture & Implemented Flow](#-architecture--implemented-flow)
  - [1. User Registration Flow](#1-user-registration-flow)
  - [2. User Login Flow](#2-user-login-flow)
  - [3. Session Verification & Protected Routes](#3-session-verification--protected-routes)
  - [4. Logout & Token Blacklisting](#4-logout--token-blacklisting)
- [Frontend Features & Design System](#-frontend-features--design-system)
- [Backend Architecture & API Endpoints](#-backend-architecture--api-endpoints)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)

---

## 🎯 Overview

**Gen Resume Analyser** is a production-grade full-stack web application designed to empower job seekers. It features a modern, high-performance frontend coupled with a secure Node.js/Express backend, MongoDB database, Redis caching for token blacklisting, and forthcoming Google Gemini AI integration for resume insights.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Routing**: React Router v7 (BrowserRouter with Route Guards)
- **State Management**: React Context API (`AuthContext` + `AuthProvider` + custom `useAuth` hook)
- **HTTP Client**: Axios (configured with `withCredentials: true` and base URL)
- **Styling**: SCSS (Custom Glassmorphism, Ambient Cyan/Teal Gradients, CSS Keyframe Animations)
- **Feedback & Notifications**: `react-hot-toast`

### Backend
- **Runtime & Framework**: Node.js & Express 5
- **Database**: MongoDB & Mongoose ORM
- **In-Memory Store**: Upstash Redis (for token blacklisting on logout)
- **Security & Auth**: JWT (`jsonwebtoken`), `bcrypt` (password hashing), `cookie-parser`, `cors`

### AI (Upcoming)
- **Engine**: Google Gemini AI (Multimodal resume analysis, ATS scoring, and feedback generation)

---

## 🔄 Architecture & Implemented Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (Vite / React)                       │
│                                                                         │
│   [ Register.jsx ]  ───►  [ Login.jsx ]  ───►  [ Protected Route (/) ]  │
│          │                      │                         │             │
│          └──────────────┬───────┘                         │             │
│                         ▼                                 ▼             │
│                 [ useAuth Hook ]                 [ AuthContext ]        │
│                         │                         (Global State)        │
│                         ▼                                 │             │
│                 [ auth.api.js (Axios) ]                   │             │
└─────────────────────────┬─────────────────────────────────┴─────────────┘
                          │ HTTP Requests (JSON + Cookies)
                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        BACKEND (Express / Node.js)                      │
│                                                                         │
│   [ CORS & CookieParser Middleware ]                                    │
│          │                                                              │
│          ▼                                                              │
│   [ /api/auth Routes ] ──► [ Auth Middleware (JWT & Redis Check) ]      │
│          │                                                              │
│          ▼                                                              │
│   [ Auth Controller ]                                                   │
│     ├── bcrypt (hash/compare)                                           │
│     ├── MongoDB (User Collection)                                       │
│     └── Redis (Token Blacklist)                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 1. User Registration Flow

1. **User Input**: User fills out Full Name, Email, and Password on `/register`.
2. **Validation**: Client-side validation checks for valid email format and minimum password length (8 characters).
3. **Dispatch**: Form calls `register({ username, email, password })` from `useAuth()`.
4. **Loading State**: Submit button activates a rotating `.btn-spinner` and disables inputs.
5. **Backend Processing**:
   - Checks MongoDB if `username` or `email` already exists.
   - Hashes password using `bcrypt` (salt rounds: 10).
   - Creates the user in MongoDB.
   - Generates JWT token and sets an HTTP-only cookie.
6. **Feedback & Redirect**: Toast notification displays `"Registration successful!"` and the user is redirected to `/login`.

---

### 2. User Login Flow

1. **User Input**: User enters Email and Password on `/login`.
2. **API Call**: `login({ email, password })` via `auth.api.js` dispatches `POST /api/auth/login`.
3. **Backend Authentication**:
   - Finds user by email in MongoDB.
   - Validates password hash with `bcrypt.compare`.
   - Generates signed JWT (`process.env.JWT_SECRET`, expires in 1 day).
   - Stores JWT in HTTP-only cookie (`res.cookie("token", token)`).
4. **Global State Update**: `AuthProvider` updates `user` state across the application.
5. **Redirect**: Toast displays `"Logged in successfully!"` and routes the user to the protected Home page (`/`).

---

### 3. Session Verification & Protected Routes

1. **Auto-Login on Mount**: When the application loads, `AuthProvider` makes a `GET /api/auth/get-me` request.
2. **JWT Verification**: The backend `authUser` middleware verifies the cookie token against `JWT_SECRET` and checks Redis to ensure the token isn't blacklisted.
3. **Protected Component (`<Protected>` in `components/protected.jsx`)**:
   - **Loading**: Renders a themed cyan spinner while session status is verified.
   - **Unauthenticated**: Redirects unauthorized visitors to `/login` via `<Navigate to="/login" replace />`.
   - **Authenticated**: Renders the protected child components (e.g., Home page `/`).

---

### 4. Logout & Token Blacklisting

1. **Trigger**: User initiates logout via `logout()` in `useAuth()`.
2. **Backend**:
   - `GET /api/auth/logout` retrieves the current token from cookies.
   - Stores `redis.set(token, "blacklisted")` in Redis.
   - Clears cookie via `res.clearCookie("token")`.
3. **Client**: Resets `user` state to `null` and redirects to `/login`.

---

## 🎨 Frontend Features & Design System

- **Glassmorphic Aesthetic**: Deep charcoal/navy background (`#06090e`) with ambient teal/cyan radial glow circles.
- **Micro-Animations**:
  - CSS `@keyframes spin-clockwise` button loading spinner.
  - Hover elevation effects with neon cyan drop-shadows.
  - Smooth input glow transitions on focus.
- **Interactive Form Utilities**:
  - Show/Hide password toggle.
  - Real-time client-side error handling with field indicators.
  - Non-intrusive themed toast alerts via `react-hot-toast`.
- **Responsive Layout**: Fluid CSS grid & flexbox optimized for desktop, tablet, and mobile displays.

---

## 📡 Backend Architecture & API Endpoints

| Method | Endpoint | Access | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user | `{ username, email, password }` | `201 Created` + user object |
| `POST` | `/api/auth/login` | Public | Authenticate user & set cookie | `{ email, password }` | `200 OK` + user object |
| `GET` | `/api/auth/logout` | Public | Blacklist JWT in Redis & clear cookie | _None_ | `200 OK` |
| `GET` | `/api/auth/get-me` | Private | Fetch logged-in user profile | _None (Cookie)_ | `200 OK` + user details |

---

## 📁 Project Directory Structure

```text
Gen-resume-analyser/
├── README.md
├── backend/
│   ├── package.json
│   ├── server.js               # Server entry point & Redis connection
│   └── src/
│       ├── app.js              # Express app configuration & CORS
│       ├── config/
│       │   ├── databse.js      # MongoDB Mongoose connection
│       │   └── redis.js        # Upstash Redis client
│       ├── controller/
│       │   └── auth.controller.js # Auth handlers (register, login, logout, getMe)
│       ├── midlleware/
│       │   └── auth.middleware.js # JWT verification & Redis blacklist check
│       ├── models/
│       │   └── user.model.js   # User schema definition
│       └── routes/
│           └── auth.routes.js  # Auth route definitions
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx             # AuthProvider & Toaster root wrapper
        ├── app.routes.jsx      # React Router definitions with Protected guard
        ├── main.jsx            # React root mount
        └── features/
            └── auth/
                ├── auth.context.jsx        # Global AuthContext & state provider
                ├── components/
                │   └── protected.jsx       # Route guard component
                ├── hooks/
                │   └── useAuth.js          # Custom hook to consume AuthContext
                ├── pages/
                │   ├── Login.jsx           # Sign in page
                │   ├── Register.jsx        # Registration page
                │   └── auth.form.scss      # Glassmorphic auth styles & animations
                └── services/
                    └── auth.api.js         # Axios API client functions
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster or local MongoDB instance
- Upstash Redis instance (REST URL & Token)

---

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `backend/` with the following variables:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   UPSTASH_REDIS_REST_URL=your_upstash_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
   ```
4. Start the backend server:
   ```bash
   npm run dev
   # or
   nodemon server.js
   ```

---

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.