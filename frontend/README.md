# QA Inspection Portal - Frontend

Next.js 15 App Router application with Tailwind CSS and modern glassmorphism design for the QA Inspection Portal.

## Features
- **Next.js 15 App Router** with TypeScript and Inter font
- **Glassmorphic Industrial UI** with ambient lighting and blur effects
- **Real-Time Inspection Runner** with live tolerance check simulation
- **Supabase JS Client** pre-configured in `src/lib/supabase.ts`
- **Strict Separation** from the backend Python service

## Quickstart

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
```bash
# Review and populate with your credentials if using Supabase
cat .env.local
```

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` to view the QA Inspection Portal.
