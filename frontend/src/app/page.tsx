'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Play,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  Database,
  Server,
  FileCheck2
} from 'lucide-react';

interface AuditRecord {
  id: string;
  batchNumber: string;
  line: string;
  stage: string;
  tolerance: string;
  status: 'passed' | 'warning' | 'flagged';
  timestamp: string;
  inspector: string;
}

const INITIAL_AUDITS: AuditRecord[] = [
  {
    id: 'INS-8902',
    batchNumber: 'LOT-B402-Q1',
    line: 'Assembly Line Alpha',
    stage: 'Optical Surface Scan',
    tolerance: '±0.002 mm',
    status: 'passed',
    timestamp: '10:42:15',
    inspector: 'Sensor Node 04'
  },
  {
    id: 'INS-8903',
    batchNumber: 'LOT-B402-Q2',
    line: 'Assembly Line Beta',
    stage: 'Dimensional Tolerance',
    tolerance: '±0.015 mm',
    status: 'warning',
    timestamp: '10:41:02',
    inspector: 'Micron Probe A'
  },
  {
    id: 'INS-8904',
    batchNumber: 'LOT-C119-X8',
    line: 'Line Gamma (Cleanroom)',
    stage: 'Hermetic Seal Integrity',
    tolerance: '< 0.05 sccm',
    status: 'passed',
    timestamp: '10:39:48',
    inspector: 'Pressure Decay Unit'
  },
  {
    id: 'INS-8905',
    batchNumber: 'LOT-D022-P4',
    line: 'Thermal Cycling Bay 2',
    stage: 'Thermal Drift Profile',
    tolerance: 'ΔT ≤ 1.2°C',
    status: 'flagged',
    timestamp: '10:35:12',
    inspector: 'IR Pyro Chamber'
  }
];

export default function QAInspectionPortalPage() {
  const [audits, setAudits] = useState<AuditRecord[]>(INITIAL_AUDITS);
  const [activeTab, setActiveTab] = useState<'all' | 'passed' | 'flagged'>('all');
  const [isAuditing, setIsAuditing] = useState(false);
  const [lastBatchId, setLastBatchId] = useState('LOT-B402-Q1');
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord>(INITIAL_AUDITS[0]);

  const handleSimulateInspection = () => {
    setIsAuditing(true);
    setTimeout(() => {
      const nextId = Math.floor(8906 + Math.random() * 900);
      const newAudit: AuditRecord = {
        id: `INS-${nextId}`,
        batchNumber: `LOT-E${Math.floor(100 + Math.random() * 900)}-K1`,
        line: 'Assembly Line Alpha',
        stage: 'Automated Micro-Visual Scan',
        tolerance: '±0.003 mm',
        status: Math.random() > 0.25 ? 'passed' : 'warning',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        inspector: 'High-Res Optical Scanner'
      };
      setAudits(prev => [newAudit, ...prev]);
      setSelectedRecord(newAudit);
      setLastBatchId(newAudit.batchNumber);
      setIsAuditing(false);
    }, 700);
  };

  const filteredAudits = audits.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'passed') return item.status === 'passed';
    if (activeTab === 'flagged') return item.status === 'flagged' || item.status === 'warning';
    return true;
  });

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100 selection:bg-indigo-500/20">
      {/* Ambient background glows for glassmorphism */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-cyan-600/15 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-96 w-96 rounded-full bg-emerald-600/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
      </div>

      {/* Top Bar Contract: Brand, Nav, Single CTA */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-indigo-500/10 text-indigo-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-base font-semibold tracking-tight text-white whitespace-nowrap">
              QA Inspection Portal
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
            <a href="#dashboard" className="transition-colors hover:text-slate-100 whitespace-nowrap">Inspection Hub</a>
            <a href="#pipeline" className="transition-colors hover:text-slate-100 whitespace-nowrap">Audit Pipeline</a>
            <a href="#architecture" className="transition-colors hover:text-slate-100 whitespace-nowrap">Monorepo Specs</a>
            <a href="#compliance" className="transition-colors hover:text-slate-100 whitespace-nowrap">ISO Protocols</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulateInspection}
              disabled={isAuditing}
              className="inline-flex items-center gap-2 rounded-lg border border-indigo-400/30 bg-indigo-500/20 px-4 py-2 text-xs font-semibold text-indigo-200 transition-all hover:bg-indigo-500/30 active:scale-95 disabled:opacity-50 whitespace-nowrap"
            >
              <Play className={`h-3.5 w-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
              <span>{isAuditing ? 'Auditing Batch...' : 'Trigger Inspection'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <div className="mb-4 inline-flex items-center gap-2 text-xs text-indigo-400 font-medium">
              <span>Full-Stack QA Architecture</span>
              <span aria-hidden="true">·</span>
              <span>Next.js 15 App Router</span>
              <span aria-hidden="true">·</span>
              <span>FastAPI Backend</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white" style={{ textWrap: 'balance' }}>
              Precision Quality Assurance & Real-Time Defect Telemetry
            </h1>

            <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-400 max-w-2xl">
              A unified monorepo framework for automated optical scanning, tolerance verification, and non-destructive testing pipelines with instant Supabase logging.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={handleSimulateInspection}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 active:scale-95 whitespace-nowrap"
              >
                <span>Run Inspection Pass</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <a
                href="#architecture"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white whitespace-nowrap"
              >
                <Server className="h-4 w-4 text-slate-400" />
                <span>Backend Endpoints</span>
              </a>
            </div>

            {/* Metrics Strip */}
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              <div>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono tabular-nums">99.84%</p>
                <p className="mt-1 text-xs text-slate-400">First-pass yield</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono tabular-nums">14.2 ms</p>
                <p className="mt-1 text-xs text-slate-400">Scan latency</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono tabular-nums">4,820</p>
                <p className="mt-1 text-xs text-slate-400">Batches certified</p>
              </div>
            </div>
          </div>

          {/* Glassmorphic Live Inspection Console Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-2xl shadow-2xl shadow-black/60">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Live Sensor Feed</span>
                  <h3 className="text-sm font-semibold text-white">{selectedRecord.batchNumber}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`inline-flex items-center gap-1.5 font-medium ${
                    selectedRecord.status === 'passed' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {selectedRecord.status === 'passed' ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                    {selectedRecord.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Active Test Stage</span>
                    <span className="font-mono text-slate-300">{selectedRecord.id}</span>
                  </div>
                  <p className="text-sm font-medium text-white">{selectedRecord.stage}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3">
                    <span className="text-xs text-slate-400">Tolerance Spec</span>
                    <p className="mt-1 font-mono text-sm font-semibold text-slate-200">{selectedRecord.tolerance}</p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3">
                    <span className="text-xs text-slate-400">Timestamp</span>
                    <p className="mt-1 font-mono text-sm font-semibold text-slate-200">{selectedRecord.timestamp}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3">
                  <span className="text-xs text-slate-400">Hardware Node / Sensor</span>
                  <p className="mt-1 text-xs font-mono text-indigo-300">{selectedRecord.inspector}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Supabase Sync Active</span>
                </span>
                <span className="font-mono text-[11px] text-slate-500">FastAPI :8000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Stream Table Section */}
        <section id="dashboard" className="mt-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Recent Inspection Runs</h2>
              <p className="text-xs text-slate-400 mt-1">Real-time log of physical component audits verified against calibration specs.</p>
            </div>

            {/* Segmented Filter Control */}
            <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-slate-900/60 p-1 backdrop-blur-md">
              <button
                onClick={() => setActiveTab('all')}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Runs ({audits.length})
              </button>
              <button
                onClick={() => setActiveTab('passed')}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === 'passed' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Passed
              </button>
              <button
                onClick={() => setActiveTab('flagged')}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === 'flagged' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Flagged / Warnings
              </button>
            </div>
          </div>

          {/* Glassmorphic Table Container */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="border-b border-white/5 bg-slate-950/40 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-3.5">Record ID</th>
                    <th scope="col" className="px-6 py-3.5">Batch / Lot</th>
                    <th scope="col" className="px-6 py-3.5">Inspection Stage</th>
                    <th scope="col" className="px-6 py-3.5">Tolerance</th>
                    <th scope="col" className="px-6 py-3.5">Status</th>
                    <th scope="col" className="px-6 py-3.5 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredAudits.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedRecord(item)}
                      className={`cursor-pointer transition-colors hover:bg-white/5 ${
                        selectedRecord.id === item.id ? 'bg-indigo-500/10' : ''
                      }`}
                    >
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-200">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-white">
                        {item.batchNumber}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-200">{item.stage}</span>
                        <span className="block text-xs text-slate-500">{item.line}</span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-300 tabular-nums">
                        {item.tolerance}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                          item.status === 'passed' ? 'text-emerald-400' :
                          item.status === 'warning' ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {item.status === 'passed' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                          <span className="capitalize">{item.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-xs text-slate-400 tabular-nums">
                        {item.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Monorepo Architecture Highlights */}
        <section id="architecture" className="mt-20">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white tracking-tight">Monorepo System Design</h2>
            <p className="text-xs text-slate-400 mt-1">Strict boundary separation between client-side UX and high-throughput Python telemetry services.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-blue-500/10 text-blue-400">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">/frontend</h3>
                  <span className="text-xs text-slate-400 font-mono">Next.js 15 App Router · Tailwind CSS</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Glassmorphic dashboard with reactive sensor widgets</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Integrated @supabase/supabase-js client for persistent logs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Typed Next.js layout with modern Inter font pairing</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-emerald-500/10 text-emerald-400">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">/backend</h3>
                  <span className="text-xs text-slate-400 font-mono">FastAPI · Uvicorn · Supabase Python</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>High-speed asynchronous CORS-ready REST API endpoints</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Automated root health check and tolerance evaluation logic</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Zero-delay ingestion for robotic optical & probe sensors</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/5 bg-slate-950/80 py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 QA Inspection Portal. Industrial Grade Monorepo Foundation.</p>
          <div className="flex items-center gap-6">
            <span className="font-mono text-slate-400">FastAPI :8000</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="font-mono text-slate-400">Next.js :3000</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="font-mono text-slate-400">Supabase Connected</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
