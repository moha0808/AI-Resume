# 🚀 AI Resume Analyzer & Job Recommender Platform

A production-ready, AI-powered platform helping students and job seekers optimize their resumes, identify skill gaps, get personalized job recommendations, and prepare for interviews.

![Platform Preview](docs/preview.png)

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📊 ATS Score Analysis | Instant 0-100 ATS compatibility score with detailed breakdown |
| 🤖 AI Resume Improvement | One-click AI rewriting of summary, skills, experience, and projects |
| 💼 Smart Job Matching | Personalized job recommendations ranked by skill match percentage |
| 🎯 Skill Gap Analysis | Compare your skills vs. industry requirements with radar/pie charts |
| 💬 Interview Prep | AI-generated technical, behavioral, HR, and project questions |
| 📝 Resume Builder | Live-preview resume builder with 4 professional templates |
| 👤 User Profile | Complete profile with skills, education, and social links |
| 🔐 JWT Authentication | Secure auth with refresh tokens and protected routes |
| 🌙 Dark Mode | Default dark mode with light mode toggle |
| 📱 Fully Responsive | Desktop, tablet, and mobile optimized |

## 🛠 Tech Stack

### Frontend
- **React 18** + **Vite** — Fast build, HMR
- **Tailwind CSS** — Utility-first styling with custom design system
- **Framer Motion** — Smooth animations and page transitions  
- **Three.js** + **React Three Fiber** — 3D hero animation with floating resume
- **Zustand** — Lightweight state management with persistence
- **React Router v6** — Client-side routing with lazy loading
- **Recharts** — ATS score ring, radar chart, pie chart, bar charts
- **React Hook Form** + **Zod** — Form validation
- **Axios** — HTTP client with interceptors

### Backend
- **Node.js** + **Express.js** — REST API
- **MongoDB** + **Mongoose** — Database with ODM
- **JWT** — Access + refresh token auth
- **Bcrypt** — Password hashing
- **Multer** — File upload (PDF/DOCX)
- **Helmet** + **CORS** + **Rate Limiting** — Security

### AI Service
- **Python** + **FastAPI** — High-performance AI microservice
- **PyPDF2** + **python-docx** — Resume parsing
- **spaCy** — NLP text processing
- **Scikit-learn** — ATS scoring algorithm
- **OpenAI API** (optional) — Enhanced AI generation
- **LangChain** — LLM orchestration

## 📁 Project Structure

```
AI-Resume/
├── client/              # React/Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/  # Navbar, Sidebar, DashboardLayout
│   │   │   ├── three/   # Hero3D (Three.js)
│   │   │   └── ui/      # Reusable UI components
│   │   ├── pages/
│   │   │   ├── Landing/ # Landing page
│   │   │   ├── Auth/    # Login, Register, ForgotPassword
│   │   │   ├── Dashboard/ # All dashboard pages
│   │   │   └── Admin/   # Admin dashboard
│   │   ├── services/    # Axios API layer
│   │   ├── store/       # Zustand stores
│   │   └── styles/      # Global CSS
│   └── package.json
├── server/              # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/ # Auth, Resume, Job, Interview, User
│   │   ├── models/      # User, Resume, Job, Interview schemas
│   │   ├── routes/      # Express routes
│   │   └── middleware/  # Auth, Upload
│   └── package.json
├── ai-service/          # Python/FastAPI AI microservice
│   ├── main.py          # FastAPI app with all endpoints
│   └── requirements.txt
├── docker-compose.yml   # Full stack Docker orchestration
└── package.json         # Monorepo root
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+ (optional, for AI service)
- MongoDB (local or Atlas connection string)

### 1. Clone & Install
```bash
git clone <repo-url>
cd AI-Resume
npm run install:all
```

### 2. Environment Variables

**Server** (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-resume
JWT_SECRET=your_super_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
CLIENT_URL=http://localhost:5173
AI_SERVICE_URL=http://localhost:8000
```

**Client** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

**AI Service** (`ai-service/.env`):
```env
OPENAI_API_KEY=your_key_here  # Optional - app works without it
USE_MOCK=true
```

### 3. Run Development
```bash
# Start frontend + backend together
npm run dev

# Or individually:
npm run dev:client   # http://localhost:5173
npm run dev:server   # http://localhost:5000
```

### 4. AI Service (Optional)
```bash
cd ai-service
pip install fastapi uvicorn PyPDF2 python-docx python-dotenv
uvicorn main:app --reload --port 8000
```

### 5. Docker (Full Stack)
```bash
docker-compose up -d
```

## 📱 Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Hero with 3D animation, features, testimonials |
| `/login` | Login | Email/password authentication |
| `/register` | Register | Account creation with validation |
| `/forgot-password` | Forgot Password | OTP password reset |
| `/dashboard` | Dashboard | Stats, quick actions, recent resumes |
| `/dashboard/upload` | Upload | Drag & drop resume upload |
| `/dashboard/analysis/:id` | Analysis | ATS score, radar chart, suggestions |
| `/dashboard/skills` | Skill Gap | Radar, pie charts, missing skills |
| `/dashboard/jobs` | Jobs | Job recommendations with match % |
| `/dashboard/improve` | AI Improve | AI-generated resume sections |
| `/dashboard/builder` | Builder | Resume builder with live preview |
| `/dashboard/interview` | Interview | Interview question generator |
| `/dashboard/profile` | Profile | User profile management |
| `/admin` | Admin | User management, analytics |

## 🔐 API Endpoints

### Auth
```
POST /api/auth/register    # Register new user
POST /api/auth/login       # Login + JWT tokens
POST /api/auth/logout      # Clear tokens
POST /api/auth/refresh-token
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Resume
```
POST   /api/resume/upload         # Upload PDF/DOCX
GET    /api/resume                # Get all user resumes
GET    /api/resume/:id            # Get single resume
POST   /api/resume/:id/analyze    # Trigger AI analysis
POST   /api/resume/:id/improve    # Generate improvements
DELETE /api/resume/:id            # Soft delete
```

### Jobs
```
GET    /api/jobs              # Browse all jobs
GET    /api/jobs/recommend    # Personalized recommendations
GET    /api/jobs/saved        # Saved jobs list
POST   /api/jobs/save         # Save a job
DELETE /api/jobs/save/:id     # Unsave a job
```

### AI Service
```
POST /analyze    # Analyze resume file, return ATS score
POST /improve    # Generate improved resume sections
POST /interview  # Generate interview questions
POST /recommend  # Get job recommendations
```

## 🤖 AI Mode

The platform works in two modes:

**Demo Mode** (default, no API key needed):
- ✅ Full ATS scoring with keyword analysis
- ✅ Mock AI improvements (high-quality static examples)
- ✅ Interview question generation
- ✅ All UI features work

**AI Mode** (OpenAI API key in `ai-service/.env`):
- ✅ GPT-powered resume improvement
- ✅ Personalized analysis based on actual resume content
- ✅ Custom interview questions

## 🚢 Deployment

| Service | Platform | Notes |
|---------|----------|-------|
| Frontend | Vercel | `npm run build` → deploy `client/dist` |
| Backend | Render | Set env vars, point to MongoDB Atlas |
| AI Service | Railway | Python Dockerfile |
| Database | MongoDB Atlas | Free tier available |

## 📊 Performance
- Code splitting with React.lazy() for all pages
- Three.js loaded only on landing page
- Skeleton loading states throughout
- API response caching
- Optimized Tailwind CSS (purged in production)

---

Built with ❤️ for job seekers worldwide.
