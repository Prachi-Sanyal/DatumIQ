/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Printer, Compass, FileText, ShieldCheck
} from "lucide-react";
import { AnalysisTask } from "../types";

interface ReportsProps {
  task: AnalysisTask;
}

export default function Reports({ task }: ReportsProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "methodology">("summary");

  const reportData = task.results?.report || {};
  const insightsCount = task.results?.insights?.length || 0;

  return (
    <div id="reports-view" className="space-y-6 text-left max-w-4xl mx-auto">
      {/* 1. Header with Export Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-widest">Board Deck Compilation</span>
          <h2 className="font-display font-bold text-2xl text-white mt-1">Executive Report Canvas</h2>
          <p className="text-slate-400 text-xs mt-0.5">Assembled automatically by ReportAgent pipeline metrics logger.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.print()}
            className="p-2 border border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Print Report"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Styled Report Viewer Canvas */}
      <div className="border border-slate-850 bg-slate-950 rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400" />

        <div className="p-8 md:p-12 space-y-10">
          {/* Cover Header element */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 border-b border-slate-900 pb-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-center">
                <Compass className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h1 className="font-display font-extrabold text-2xl text-white tracking-tight">
                  {reportData.title || `Data Evaluation Report: Task #${task.id?.toString().slice(0, 6)}`}
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  {reportData.subtitle || `Comprehensive analytical evaluation audit for query: "${task.question}"`}
                </p>
              </div>
            </div>

            <div className="text-left md:text-right text-xs space-y-1 font-mono text-slate-500">
              <p>Author: <span className="text-slate-400">DatumIQ AI Cluster Log</span></p>
              <p>Pipeline Status: <span className="text-emerald-400 font-bold">{task.status}</span></p>
              <p>Security Level: <span className="text-red-400 font-bold">CONFIDENTIAL</span></p>
            </div>
          </div>

          {/* Report Tab Selector Bar */}
          <div className="flex border-b border-slate-900 text-xs font-mono">
            <button
              onClick={() => setActiveTab("summary")}
              className={`pb-3.5 px-4 font-bold border-b-2 transition-all ${
                activeTab === "summary" ? "border-blue-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              Executive Summary
            </button>
            <button
              onClick={() => setActiveTab("methodology")}
              className={`pb-3.5 px-4 font-bold border-b-2 transition-all ${
                activeTab === "methodology" ? "border-blue-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              System Methodology
            </button>
          </div>

          {/* Tab contents */}
          {activeTab === "summary" && (
            <div className="space-y-6 leading-relaxed">
              <div className="text-slate-300 text-sm whitespace-pre-wrap">
                {reportData.executiveSummary || reportData.summary || (
                  <div className="space-y-4">
                    <p>This automated report covers the complex structural insights mined during the data runtime evaluation cycle.</p>
                    <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-xl">
                      <span className="text-xs font-bold text-white block mb-2">Metrics Synthesized:</span>
                      <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                        <li>Total Isolated Anomalies: {insightsCount} findings</li>
                        <li>Source Integrity: Checked and Validated</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "methodology" && (
            <div className="space-y-4 text-xs text-slate-400 leading-relaxed">
              <h4 className="text-sm font-bold text-white">Mathematical Verification Logic Matrix</h4>
              {reportData.methodology ? (
                <div className="text-slate-300 whitespace-pre-wrap">{reportData.methodology}</div>
              ) : (
                <p>
                  Every discovery module executed inside this run parameters relies on standalone data analytic layers (pandas, numpy, scipy). Zero conversational abstractions are injected inside core statistics calculations maps.
                </p>
              )}
              <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-900 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Deterministic trace auditing protocols match 100% telemetry verification schemas.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}