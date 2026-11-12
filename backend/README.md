# QA Inspection Portal - Backend

FastAPI Python service for real-time quality assurance inspection telemetry, defect verification, and Supabase database synchronization.

## Features
- **FastAPI with async performance** and automatic Swagger documentation at `/docs`
- **CORS enabled** for Next.js frontend running on `http://localhost:3000`
- **Root Health Check** at `/` and `/health`
- **QA Inspection Endpoints** for creating, retrieving, and evaluating physical hardware tolerance checks
- **Supabase Integration** ready for automated cloud data persistence

## Quickstart

### 1. Create a Python Virtual Environment
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables
```bash
cp .env.example .env
# Edit .env with your Supabase URL & Key if available
```

### 4. Run the Dev Server
```bash
uvicorn app.main:app --reload --port 8000
```
API will be live at `http://localhost:8000` with interactive docs at `http://localhost:8000/docs`.
