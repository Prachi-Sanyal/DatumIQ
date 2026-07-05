/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  UploadCloud, FileSpreadsheet, CheckCircle, AlertCircle, ShieldCheck, 
  Trash2, ArrowRight, Table, Info, UserCheck, Eye, EyeOff,
  HardDrive, Database, Cloud, Globe, Building2, Users
} from "lucide-react";
import { DatasetMetadata } from "../types";
import { SAMPLE_DATASETS } from "../mockData";

interface UploadDatasetProps {
  onDatasetSelected: (dataset: DatasetMetadata) => void;
}

export default function UploadDataset({ onDatasetSelected }: UploadDatasetProps) {
  const [selectedDs, setSelectedDs] = useState<DatasetMetadata | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Trigger simulated file upload
  const handleUploadFile = (dataset: DatasetMetadata) => {
    setUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setSelectedDs(dataset);
          onDatasetSelected(dataset);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Simulate uploading SaaS sales dataset
      handleUploadFile(SAMPLE_DATASETS[0]);
    }
  };

  return (
    <div id="upload-view" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left 2 cols for Ingestion */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-widest">STEP 1</span>
          <h2 className="font-display font-bold text-2xl text-white mt-1">Upload your dataset</h2>
          <p className="text-slate-400 text-sm mt-1">Upload a CSV, Excel, or Parquet file. We profile schema, quality, and PII in seconds.</p>
        </div>

        {/* Drag/Drop Box */}
        {!selectedDs && !uploading && (
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-10 text-center relative transition-all ${
              dragActive 
                ? "border-blue-500 bg-blue-500/5" 
                : "border-slate-800 bg-slate-900/10 hover:border-slate-700/80"
            }`}
          >
            <UploadCloud className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-sm font-semibold text-white">Drop your file here</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              or browse to select a CSV, Parquet or Excel workbook. Encrypted at rest and in transit.
            </p>

            <div className="flex items-center justify-center gap-4 mt-6">
              <button 
                onClick={() => handleUploadFile(SAMPLE_DATASETS[0])}
                className="px-4 py-2 bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                Browse files
              </button>
              <button 
                onClick={() => handleUploadFile(SAMPLE_DATASETS[0])}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-lg shadow-lg shadow-blue-500/15 transition-all"
              >
                Use sample data
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-[10px] font-mono text-slate-500">
              <span>.csv, .xlsx, .xls</span>
              <span>Max 250 MB</span>
              <span>PII auto-detect</span>
            </div>
          </div>
        )}

        {/* Progress box during uploading */}
        {uploading && (
          <div className="border border-slate-800/80 bg-slate-900/20 rounded-2xl p-8 text-center space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto">
              <FileSpreadsheet className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Processing sales_q3_2026.csv</p>
              <p className="text-xs text-slate-500 mt-0.5">Validation and security audit in progress...</p>
            </div>
            <div className="max-w-xs mx-auto">
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-blue-500 h-full rounded-full transition-all duration-150" style={{ width: `${progress}%` }} />
              </div>
              <div className="text-[10px] font-mono text-slate-500 text-right mt-1.5">{progress}% completed</div>
            </div>
          </div>
        )}

        {/* Selected File Overview Table */}
        {selectedDs && (
          <div className="border border-slate-850 bg-slate-900/20 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-850 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">{selectedDs.fileName}</h4>
                  <p className="text-xs font-mono text-slate-500 mt-0.5">
                    {selectedDs.fileSize} • {selectedDs.rowsCount.toLocaleString()} rows • {selectedDs.columnsCount} columns
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDs(null)}
                className="w-8 h-8 rounded-lg hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 text-slate-500 hover:text-rose-400 flex items-center justify-center transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Column Profile Summary Grid */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <Table className="w-4 h-4 text-slate-500" />
                <h5 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">Metadata Column Profiling</h5>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedDs.columns.map((col) => (
                  <div key={col.name} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-semibold text-white">{col.name}</span>
                        <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {col.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 max-w-[180px] truncate">
                        Smp: {col.sampleValues.join(", ")}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      {col.isPii ? (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[9px] font-bold font-mono text-red-400">
                          PII MASKED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-900 text-[9px] font-bold font-mono text-slate-500">
                          PASS
                        </span>
                      )}
                      {col.hasNulls && (
                        <span className="text-[9px] text-amber-500 font-mono">
                          {col.anomaliesCount} Nulls
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Enterprise Data Connectors Baseline */}
        <div className="space-y-4 pt-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Data Sources & Connectors</h3>
            <p className="text-xs text-slate-500 mt-1">Connect your workspace to any file or direct data warehouse stream.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {/* Active: CSV/TSV */}
            <div className="p-4 rounded-xl bg-blue-600/5 border border-blue-500/20 text-left flex flex-col justify-between h-28 relative group">
              <div className="flex justify-between items-start">
                <FileSpreadsheet className="w-6 h-6 text-blue-400" />
                <span className="text-[9px] font-mono text-blue-400 font-bold border border-blue-500/20 px-1.5 py-0.5 rounded bg-blue-500/10">ACTIVE</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-white">CSV & TSV Files</span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Local drag-and-drop</span>
              </div>
            </div>

            {/* Active: Excel */}
            <div className="p-4 rounded-xl bg-emerald-600/5 border border-emerald-500/20 text-left flex flex-col justify-between h-28 relative group">
              <div className="flex justify-between items-start">
                <Table className="w-6 h-6 text-emerald-400" />
                <span className="text-[9px] font-mono text-emerald-400 font-bold border border-emerald-500/20 px-1.5 py-0.5 rounded bg-emerald-500/10">ACTIVE</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-white">Excel Sheets</span>
                <span className="block text-[10px] text-slate-500 mt-0.5">.xlsx & .xls supported</span>
              </div>
            </div>

            {/* Active: Parquet */}
            <div className="p-4 rounded-xl bg-purple-600/5 border border-purple-500/20 text-left flex flex-col justify-between h-28 relative group">
              <div className="flex justify-between items-start">
                <Database className="w-6 h-6 text-purple-400" />
                <span className="text-[9px] font-mono text-purple-400 font-bold border border-purple-500/20 px-1.5 py-0.5 rounded bg-purple-500/10">ACTIVE</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-white">Apache Parquet</span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Optimized columnar files</span>
              </div>
            </div>

            {/* Disabled Connectors list */}
            {[
              { name: "Google Drive", desc: "Cloud files ingestion", icon: HardDrive },
              { name: "Snowflake", desc: "SaaS data cloud warehouse", icon: Database },
              { name: "BigQuery", desc: "Google serverless warehouse", icon: Database },
              { name: "MySQL", desc: "Relational database server", icon: Database },
              { name: "PostgreSQL", desc: "Enterprise relational DB", icon: Database },
              { name: "MongoDB", desc: "NoSQL document store", icon: Database },
              { name: "AWS S3", desc: "Amazon cloud object storage", icon: Cloud },
              { name: "Azure Blob", desc: "Microsoft cloud storage", icon: Cloud },
              { name: "API Endpoint", desc: "Direct REST/JSON streams", icon: Globe },
              { name: "SAP ERP", desc: "Enterprise resource planning", icon: Building2 },
              { name: "Salesforce", desc: "CRM transaction pipeline", icon: Users }
            ].map((conn) => {
              const IconComp = conn.icon;
              return (
                <div 
                  key={conn.name} 
                  className="p-4 rounded-xl bg-slate-900/10 border border-slate-900 text-left flex flex-col justify-between h-28 opacity-45 select-none relative group cursor-not-allowed overflow-hidden"
                >
                  {/* Hover Overlay Tooltip */}
                  <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 z-10">
                    <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">Future Integration</span>
                    <span className="text-[9px] text-slate-300 font-medium mt-1">Available in Version 2</span>
                  </div>

                  <div className="flex justify-between items-start relative z-0">
                    <IconComp className="w-5 h-5 text-slate-400" />
                    <span className="text-[8px] font-mono text-slate-500 font-bold border border-slate-800 px-1 py-0.5 rounded bg-slate-900">COMING SOON</span>
                  </div>
                  <div className="relative z-0">
                    <span className="block text-xs font-bold text-slate-300">{conn.name}</span>
                    <span className="block text-[9px] text-slate-600 truncate mt-0.5">{conn.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Guidelines */}
      <div className="space-y-6">
        {/* Requirements */}
        <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-900 space-y-4 text-left">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-400" />
            <h4 className="text-sm font-bold text-white">What DatumIQ needs</h4>
          </div>
          <ul className="space-y-3 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <span><strong className="text-slate-300">Header row in the first line</strong>: Let our schema parser align transaction details accurately.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <span><strong className="text-slate-300">One row per record</strong>: Denormalized transactional or cohort tables yield optimal agent depth.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <span><strong className="text-slate-300">Consistent date formats</strong>: Standard ISO format (YYYY-MM-DD) is highly recommended.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <span><strong className="text-slate-300">Numeric columns free of strings</strong>: Raw numbers are automatically typed to decimal formatting.</span>
            </li>
          </ul>
        </div>

        {/* Privacy statement */}
        <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-900 space-y-3 text-left">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">Your Data Privacy</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            All data uploaded is encrypted, isolated to your secure local sandboxed workspace session, and instantly scrubbed when you logout. We strictly NEVER use user data to train models.
          </p>
        </div>

        {/* Supported formats panel */}
        <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-900 space-y-3 text-left">
          <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">Supported Formats</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>CSV & TSV</span>
              <span className="text-[10px] text-emerald-400 font-mono">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Excel (.xlsx, .xls)</span>
              <span className="text-[10px] text-emerald-400 font-mono">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Google Sheets</span>
              <span className="text-[10px] text-slate-500 font-mono uppercase">Coming Soon</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Postgres & BigQuery</span>
              <span className="text-[10px] text-slate-500 font-mono uppercase">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
