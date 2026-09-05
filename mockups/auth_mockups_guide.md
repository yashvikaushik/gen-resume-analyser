# GenResume UI Mockups & Specifications

This folder maintains all design references, UI specifications, and component tokens for the GenResume project.

---

## 1. Sign In Page (`/login`)
- **Theme**: Dark Cyan / Teal Minimalist Glassmorphism
- **Background**: Deep Obsidian `#06090e` with ambient cyan glows and bottom fluid wave ribbons with glowing node dot.
- **Left Hero**:
  - Logo: Cyan square outline badge + `GenResume`
  - Tag: `WELCOME BACK —` (uppercase, cyan accent)
  - Headline: `Let AI open` <br> `doors for you.` (with cyan-to-teal gradient on `doors`)
  - Subtitle: `Smart resume analysis that helps you stand out and land your dream role faster.`
  - Feature Cards:
    1. **AI insights** — *Get personalized feedback in seconds* (Line chart icon)
    2. **Your data is safe** — *We never share your information* (Shield check icon)
    3. **Faster growth** — *Actionable tips to help you grow* (Trend up icon)
- **Right Form Card**:
  - Title: `Sign in`
  - Subtitle: `Glad to see you again!`
  - Fields:
    - Email address (`you@example.com` placeholder)
    - Password with lock icon & show/hide toggle
    - `Forgot password?` right-aligned link below password input
  - Action: `Sign in →` gradient cyan/teal button
  - Footer: `Don't have an account? Create account` (links to `/register`)

---

## 2. Registration Page (`/register`)
- **Theme**: Dark Cyan / Teal Minimalist Glassmorphism
- **Background**: Deep Obsidian `#06090e` with ambient cyan glows and bottom fluid wave ribbons with glowing node dot.
- **Left Hero**:
  - Logo: Cyan square outline badge + `GenResume`
  - Tag: `START YOUR JOURNEY —` (uppercase, cyan accent)
  - Headline: `A smarter` <br> `career starts` <br> `here.` (with cyan-to-teal gradient on `here.`)
  - Subtitle: `Create your account and get personalized resume insights to stand out and land your dream role.`
  - Feature Cards:
    1. **Upload & Analyze** — *Get instant AI feedback* (Document upload icon)
    2. **Improve Faster** — *Actionable suggestions* (Bar chart icon)
    3. **Your Data, Your Control** — *We keep your information safe* (Shield check icon)
- **Right Form Card**:
  - Title: `Create your account`
  - Subtitle: `Join GenResume and take the next step towards a brighter career!`
  - Fields:
    - Full name (`Enter your full name` placeholder, user profile icon)
    - Email address (`you@example.com` placeholder, mail icon)
    - Password (`Create a password` placeholder, lock icon, visibility toggle)
    - Helper: `Use at least 8 characters with a number and a symbol.`
  - Action: `Create account →` gradient cyan/teal button
  - Footer: `Already have an account? Sign in` (links to `/login`)

---

## 3. Design Tokens
- **Background**: `#06090e`
- **Card Background**: `rgba(12, 17, 24, 0.8)` with `backdrop-filter: blur(28px)`
- **Border**: `1px solid rgba(255, 255, 255, 0.08)`
- **Focus Border**: `#06b6d4` with `box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.18)`
- **Primary Gradient**: `linear-gradient(90deg, #0e7490 0%, #0891b2 35%, #06b6d4 75%, #22d3ee 100%)`
- **Text Gradient**: `linear-gradient(110deg, #38bdf8 0%, #22d3ee 45%, #06b6d4 75%, #14b8a6 100%)`
- **Font Family**: `'Plus Jakarta Sans', sans-serif`
