"""
QA Inspection Portal - Backend API
FastAPI service providing real-time quality assurance telemetry,
inspection run auditing, and Supabase persistence.
"""

import os
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI application
app = FastAPI(
    title="QA Inspection Portal API",
    description="High-throughput API for hardware quality inspections, tolerance audits, and defect telemetry.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for Next.js frontend
allowed_origins_env = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Optional Supabase client initialization
supabase_url = os.getenv("SUPABASE_URL", "")
supabase_key = os.getenv("SUPABASE_KEY", "")
supabase_client = None

if supabase_url and supabase_key and "your-project" not in supabase_url:
    try:
        from supabase import create_client, Client
        supabase_client: Optional[Client] = create_client(supabase_url, supabase_key)
        print("✓ Supabase client initialized successfully")
    except Exception as e:
        print(f"⚠ Warning: Could not initialize Supabase client: {e}")


# ---------------------------------------------------------------------------
# Pydantic Models
# ---------------------------------------------------------------------------

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    timestamp: str
    supabase_configured: bool


class InspectionCreate(BaseModel):
    batch_number: str = Field(..., example="LOT-B402-Q1")
    line: str = Field(..., example="Assembly Line Alpha")
    stage: str = Field(..., example="Optical Surface Scan")
    tolerance_measured: float = Field(..., example=0.002)
    tolerance_limit: float = Field(..., example=0.005)
    unit: str = Field(default="mm", example="mm")
    inspector: str = Field(default="Automated Sensor Node 01", example="Automated Sensor Node 01")


class InspectionRecord(BaseModel):
    id: str
    batch_number: str
    line: str
    stage: str
    tolerance_measured: float
    tolerance_limit: float
    unit: str
    status: str  # passed | warning | flagged
    inspector: str
    timestamp: str


class ChecklistStage(BaseModel):
    id: str
    name: str
    standard: str
    description: str


# ---------------------------------------------------------------------------
# In-Memory Seed Data for Initial Development
# ---------------------------------------------------------------------------

INSPECTION_STORE: List[dict] = [
    {
        "id": "INS-8902",
        "batch_number": "LOT-B402-Q1",
        "line": "Assembly Line Alpha",
        "stage": "Optical Surface Scan",
        "tolerance_measured": 0.002,
        "tolerance_limit": 0.005,
        "unit": "mm",
        "status": "passed",
        "inspector": "Sensor Node 04",
        "timestamp": "2026-11-12T10:42:15Z"
    },
    {
        "id": "INS-8903",
        "batch_number": "LOT-B402-Q2",
        "line": "Assembly Line Beta",
        "stage": "Dimensional Tolerance",
        "tolerance_measured": 0.015,
        "tolerance_limit": 0.010,
        "unit": "mm",
        "status": "warning",
        "inspector": "Micron Probe A",
        "timestamp": "2026-11-12T10:41:02Z"
    },
    {
        "id": "INS-8904",
        "batch_number": "LOT-C119-X8",
        "line": "Line Gamma (Cleanroom)",
        "stage": "Hermetic Seal Integrity",
        "tolerance_measured": 0.03,
        "tolerance_limit": 0.05,
        "unit": "sccm",
        "status": "passed",
        "inspector": "Pressure Decay Unit",
        "timestamp": "2026-11-12T10:39:48Z"
    }
]


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/", response_model=HealthResponse, tags=["Health"])
def root_health_check():
    """
    Root health check endpoint.
    Used by load balancers, orchestrators, and the frontend to verify service status.
    """
    return HealthResponse(
        status="online",
        service="QA Inspection Portal API",
        version="1.0.0",
        timestamp=datetime.now(timezone.utc).isoformat(),
        supabase_configured=bool(supabase_client is not None)
    )


@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health():
    """Explicit /health endpoint alias."""
    return root_health_check()


@app.get("/api/inspections", response_model=List[InspectionRecord], tags=["Inspections"])
def list_inspections(status_filter: Optional[str] = None):
    """
    List all recorded QA inspection runs, optionally filtered by status (passed, warning, flagged).
    """
    if status_filter:
        return [r for r in INSPECTION_STORE if r["status"] == status_filter]
    return INSPECTION_STORE


@app.post("/api/inspections", response_model=InspectionRecord, status_code=status.HTTP_201_CREATED, tags=["Inspections"])
def create_inspection(payload: InspectionCreate):
    """
    Submit a new QA inspection run. Automatically computes pass/warning/flagged status
    based on tolerance measurements.
    """
    # Tolerance evaluation logic
    diff = abs(payload.tolerance_measured)
    limit = abs(payload.tolerance_limit)

    if diff <= limit:
        evaluation_status = "passed"
    elif diff <= limit * 1.25:
        evaluation_status = "warning"
    else:
        evaluation_status = "flagged"

    record_id = f"INS-{len(INSPECTION_STORE) + 8905}"
    new_record = {
        "id": record_id,
        "batch_number": payload.batch_number,
        "line": payload.line,
        "stage": payload.stage,
        "tolerance_measured": payload.tolerance_measured,
        "tolerance_limit": payload.tolerance_limit,
        "unit": payload.unit,
        "status": evaluation_status,
        "inspector": payload.inspector,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

    # If Supabase is connected, optionally insert to 'inspections' table
    if supabase_client:
        try:
            supabase_client.table("inspections").insert(new_record).execute()
        except Exception as err:
            print(f"Supabase sync note: {err}")

    INSPECTION_STORE.insert(0, new_record)
    return new_record


@app.get("/api/checklists", response_model=List[ChecklistStage], tags=["Checklists"])
def get_qa_checklists():
    """
    Returns standard ISO 9001 quality audit checklist stages for manufacturing lines.
    """
    return [
        ChecklistStage(
            id="STAGE-OPT-01",
            name="Optical Surface & Micro-Scratch Scan",
            standard="ISO 10110-7",
            description="High-resolution laser refraction scan for particulate and cosmetic scratch detection."
        ),
        ChecklistStage(
            id="STAGE-TOL-02",
            name="Multi-Axis Coordinate Dimensional Tolerance",
            standard="ASME Y14.5M",
            description="Contact probe audit verifying geometric dimensioning and positional tolerance."
        ),
        ChecklistStage(
            id="STAGE-SEAL-03",
            name="Hermetic Vacuum Pressure Decay",
            standard="ASTM F2095",
            description="Pressure decay measurement inside cleanroom bay to ensure hermetic enclosure rating."
        ),
        ChecklistStage(
            id="STAGE-THRM-04",
            name="Thermal Gradient & Heat Dissipation Profile",
            standard="IEC 60068-2-14",
            description="Infrared thermography scan during simulated peak operational duty cycle."
        )
    ]
