# QA Inspection Portal - Monorepo

Enterprise Full-Stack Quality Assurance Inspection Portal with a Next.js 15 App Router frontend and a Python FastAPI backend.

```
/
├── frontend/                     # Frontend Application (Next.js & Vite support)
│   ├── package.json              # All frontend dependencies (next, react, supabase, lucide, tailwind)
│   ├── tsconfig.json             # TypeScript configuration
│   ├── vite.config.ts            # Vite bundler configuration
│   ├── next.config.mjs           # Next.js configuration (ESLint & TS build errors ignored for Vercel)
│   ├── index.html                # Entry point
│   ├── .env.example              # Frontend environment variables template
│   ├── .env.local                # Supabase URL & Anon Key placeholders
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx        # Inter font root layout with dark glassmorphic baseline
│   │   │   ├── page.tsx          # Modern glassmorphism QA Inspection Portal landing page
│   │   │   └── globals.css       # Tailwind CSS & glassmorphic utilities
│   │   ├── lib/
│   │   │   └── supabase.ts       # Supabase client factory helper
│   │   ├── App.tsx               # QA Portal interactive suite & monorepo explorer
│   │   ├── main.tsx              # React mounting entry point
│   │   └── index.css             # Glassmorphic layer utilities
│   └── README.md
│
├── backend/                      # Python FastAPI + Uvicorn
│   ├── requirements.txt          # fastapi, uvicorn, supabase, pydantic, python-dotenv
│   ├── .env.example              # Server port, CORS origins, Supabase keys
│   ├── app/
│   │   ├── __init__.py
│   │   └── main.py               # FastAPI app with root health check, CORS, & QA endpoints
│   └── README.md
│
├── .gitignore                    # Git ignore rules for node_modules, .env, __pycache__, dist
├── metadata.json                 # AI Studio applet metadata
├── package.json                  # Root monorepo workspace runner (delegates to /frontend)
└── README.md                     # Monorepo architecture & setup guide
```

---

## Getting Started

### 1. Frontend Setup (`/frontend`)
```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:3000`.

### 2. Backend Setup (`/backend`)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```
Runs at `http://localhost:8000`. Interactive OpenAPI documentation available at `http://localhost:8000/docs`.

---

## Key Features

1. **Strict Monorepo Separation**: Independent dependency trees, runtime configurations, and environments.
2. **Glassmorphic UI**: High-contrast dark industrial aesthetics with ambient blur, zero-pill typography, and tabular figures.
3. **CORS Pre-Configured**: FastAPI allows requests from `http://localhost:3000` with configurable `CORS_ORIGINS`.
4. **Supabase Ready**: Both frontend and backend include ready-to-wire Supabase clients for unified database and authentication storage.
