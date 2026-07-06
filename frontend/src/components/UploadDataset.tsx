/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { 
  UploadCloud, FileSpreadsheet, Trash2, Table, Info, ShieldCheck, Database, Cloud, Users
} from "lucide-react";
import { DatasetMetadata } from "../types";

interface UploadDatasetProps {
  onDatasetSelected: (dataset: DatasetMetadata) => void;
  onFileUpload: (file: File) => Promise<void>;
  isUploading: boolean;
  uploadProgress: number;
  currentDataset: DatasetMetadata | null;
  onResetDataset: () => void;
}

export default function UploadDataset({ 
  onDatasetSelected, 
  onFileUpload, 
  isUploading, 
  uploadProgress, 
  currentDataset,
  onResetDataset 
}: UploadDatasetProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div id="upload-view" className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-widest">STEP 1</span>
          <h2 className="font-display font-bold text-2xl text-white mt-1">Upload your dataset</h2>
          <p className="text-slate-400 text-sm mt-1">Upload a CSV, Excel, or Parquet file. We profile schema, quality, and PII in seconds.</p>
        </div>

        <input 
          ref={fileInputRef}
          type="file" 
          accept=".csv,.xlsx,.xls,.parquet"
          className="hidden" 
          onChange={handleFileChange}
        />

        {!currentDataset && !isUploading && (
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
            <p className="text-sm font-semibold text-white">Drop your database source file here</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              or browse to select a CSV, Parquet or Excel workbook. Encrypted at rest and in transit.
            </p>

            <div className="flex items-center justify-center gap-4 mt-6">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                Browse files
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-[10px] font-mono text-slate-500">
              <span>.csv, .xlsx, .parquet</span>
              <span>Max 250 MB</span>
              <span>PII auto-detect</span>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="border border-slate-800/80 bg-slate-900/20 rounded-2xl p-8 text-center space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto">
              <FileSpreadsheet className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Uploading file to dynamic sandbox...</p>
              <p className="text-xs text-slate-500 mt-0.5">Validation, tokenization and security audit in progress...</p>
            </div>
            <div className="max-w-xs mx-auto">
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-blue-500 h-full rounded-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
              </div>
              <div className="text-[10px] font-mono text-slate-500 text-right mt-1.5">{uploadProgress}% completed</div>
            </div>
          </div>
        )}

        {currentDataset && (
          <div className="border border-slate-850 bg-slate-900/20 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-850 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">{currentDataset.filename || currentDataset.fileName}</h4>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/10">
    Successfully Staged
  </span>
                </div>
              </div>
              <button 
                onClick={onResetDataset}
                className="w-8 h-8 rounded-lg hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 text-slate-500 hover:text-rose-400 flex items-center justify-center transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <Table className="w-4 h-4 text-slate-500" />
                <h5 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">Metadata Column Profiling</h5>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(currentDataset.columns || []).map((col: any) => (
                  <div key={col.name} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-semibold text-white">{col.name}</span>
                        <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {col.type || "string"}
                        </span>
                      </div>
                      {col.sample_values && (
                        <p className="text-[10px] text-slate-500 mt-1 max-w-[180px] truncate">
                          Smp: {Array.isArray(col.sample_values) ? col.sample_values.join(", ") : col.sample_values}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      {col.is_pii || col.isPii ? (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[9px] font-bold font-mono text-red-400">
                          PII MASKED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-900 text-[9px] font-bold font-mono text-slate-500">
                          PASS
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4 pt-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Data Sources & Connectors</h3>
            <p className="text-xs text-slate-500 mt-1">Connect your workspace to any file or direct data warehouse stream.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-blue-600/5 border border-blue-500/20 text-left flex flex-col justify-between h-28 relative">
              <div className="flex justify-between items-start">
                <FileSpreadsheet className="w-6 h-6 text-blue-400" />
                <span className="text-[9px] font-mono text-blue-400 font-bold border border-blue-500/20 px-1.5 py-0.5 rounded bg-blue-500/10">ACTIVE</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-white">CSV & TSV Files</span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Local file buffer streaming</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-600/5 border border-emerald-500/20 text-left flex flex-col justify-between h-28 relative">
              <div className="flex justify-between items-start">
                <Table className="w-6 h-6 text-emerald-400" />
                <span className="text-[9px] font-mono text-emerald-400 font-bold border border-emerald-500/20 px-1.5 py-0.5 rounded bg-emerald-500/10">ACTIVE</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-white">Excel Sheets</span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Full multi-workbook parsing</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-purple-600/5 border border-purple-500/20 text-left flex flex-col justify-between h-28 relative">
              <div className="flex justify-between items-start">
                <Database className="w-6 h-6 text-purple-400" />
                <span className="text-[9px] font-mono text-purple-400 font-bold border border-purple-500/20 px-1.5 py-0.5 rounded bg-purple-500/10">ACTIVE</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-white">Apache Parquet</span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Optimized column compression</span>
              </div>
            </div>

            {[
              { name: "Google Drive", desc: "Cloud files ingestion", icon: Database },
              { name: "Snowflake", desc: "SaaS data cloud warehouse", icon: Database },
              { name: "BigQuery", desc: "Google serverless warehouse", icon: Database },
              { name: "PostgreSQL", desc: "Enterprise relational DB", icon: Database },
              { name: "AWS S3", desc: "Amazon cloud object storage", icon: Cloud },
              { name: "Salesforce", desc: "CRM transaction pipeline", icon: Users }
            ].map((conn) => {
              const IconComp = conn.icon;
              return (
                <div 
                  key={conn.name} 
                  className="p-4 rounded-xl bg-slate-900/10 border border-slate-900 text-left flex flex-col justify-between h-28 opacity-45 relative group cursor-not-allowed overflow-hidden"
                >
                  <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 z-10">
                    <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">Future Integration</span>
                  </div>
                  <div className="flex justify-between items-start relative z-0">
                    <IconComp className="w-5 h-5 text-slate-400" />
                    <span className="text-[8px] font-mono text-slate-500 font-bold border border-slate-800 px-1 py-0.5 rounded bg-slate-900">SOON</span>
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

      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-900 space-y-4 text-left">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-400" />
            <h4 className="text-sm font-bold text-white">Requirements Guideline</h4>
          </div>
          <ul className="space-y-3 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <span><strong className="text-slate-300">Header alignment</strong>: First row must include standardized structural headers.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <span><strong className="text-slate-300">ISO Date Structures</strong>: Prefer continuous standardized format attributes.</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-900 space-y-3 text-left">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">Your Data Privacy</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            All database pipelines run inside highly isolated, safe execution sandbox environments. We strictly never train base engines on user-provided telemetry context.
          </p>
        </div>
      </div>
    </div>
  );
}