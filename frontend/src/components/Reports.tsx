/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  FileText, Download, Share2, Printer, CheckCircle, ShieldCheck, 
  ChevronRight, Compass, Sparkles, AlertTriangle, ArrowRight,
  Clock, Mail, MessageSquare, Users
} from "lucide-react";
import { AnalysisResults } from "../types";

interface ReportsProps {
  results: AnalysisResults;
}

export default function Reports({ results }: ReportsProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "recommendations" | "methodology">("summary");

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    alert("Exporting consulting-grade Executive PDF report...");
    // Simulate downloading by opening a printable window or triggering simple alert
  };

  return (
    <div id="reports-view" className="space-y-6 text-left max-w-4xl mx-auto">
      {/* 1. Header with Export Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-widest">Board Deck Compilation</span>
          <h2 className="font-display font-bold text-2xl text-white mt-1">Executive PDF Report</h2>
          <p className="text-slate-400 text-xs mt-0.5">Assembled by the Report Agent • Compiled October 2026</p>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrint}
            className="p-2 border border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Print Report"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button 
            disabled
            className="px-3.5 py-1.5 border border-slate-850 text-slate-500 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-not-allowed opacity-50"
            title="Available in Version 2"
          >
            Export as slides <span className="text-[8px] font-mono font-bold bg-slate-900 text-slate-600 border border-slate-800 px-1 rounded uppercase">Soon</span>
          </button>
          <button 
            disabled
            className="px-3.5 py-1.5 bg-blue-600/50 text-xs font-semibold text-white/50 rounded-lg flex items-center gap-2 cursor-not-allowed opacity-50"
            title="Available in Version 2"
          >
            <Download className="w-3.5 h-3.5" /> Download PDF
          </button>
        </div>
      </div>

      {/* 2. Styled Report Viewer Canvas */}
      <div className="border border-slate-850 bg-slate-950 rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400" />

        {/* Inner padding / layout */}
        <div className="p-8 md:p-12 space-y-10">
          {/* Cover Header element */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 border-b border-slate-900 pb-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-center">
                <Compass className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h1 className="font-display font-extrabold text-3xl text-white tracking-tight">{results.report.title}</h1>
                <p className="text-slate-400 text-sm mt-1">{results.report.subtitle}</p>
              </div>
            </div>

            <div className="text-left md:text-right text-xs space-y-1 font-mono text-slate-500">
              <p>Prepared for: <strong className="text-slate-300">{results.report.preparedFor}</strong></p>
              <p>Author: <span className="text-slate-400">DatumIQ CDO Agent</span></p>
              <p>Date: <span className="text-slate-400">{results.report.date}</span></p>
              <p>Security level: <span className="text-red-400">CONFIDENTIAL</span></p>
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
              onClick={() => setActiveTab("recommendations")}
              className={`pb-3.5 px-4 font-bold border-b-2 transition-all ${
                activeTab === "recommendations" ? "border-blue-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              4 Recommendations
            </button>
            <button
              onClick={() => setActiveTab("methodology")}
              className={`pb-3.5 px-4 font-bold border-b-2 transition-all ${
                activeTab === "methodology" ? "border-blue-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              Audit Methodology
            </button>
          </div>

          {/* Tab contents */}
          {activeTab === "summary" && (
            <div className="space-y-6 leading-relaxed">
              <p className="text-slate-300 text-sm">{results.report.executiveSummary}</p>
              
              {/* Highlight Metrics Callout Box */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-slate-900/20 border border-slate-900 rounded-xl">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Q3 Revenue</span>
                  <div className="text-xl font-bold text-white mt-1">{results.summary.revenue.value}</div>
                  <span className="text-[10px] text-slate-500">vs $5.62M plan</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">EMEA Delta</span>
                  <div className="text-xl font-bold text-rose-400 mt-1">-14.2%</div>
                  <span className="text-[10px] text-slate-500">vs +6% plan</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Modeled ARR impact</span>
                  <div className="text-xl font-bold text-emerald-400 mt-1">+$1.6M</div>
                  <span className="text-[10px] text-slate-500">by end of Q4</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "recommendations" && (
            <div className="space-y-6">
              {results.recommendations.map((rec) => (
                <div key={rec.id} className="p-4 bg-slate-950 border border-slate-900 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold font-mono text-blue-400">
                      {rec.priority}
                    </span>
                    <h4 className="font-bold text-white text-sm">{rec.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-12">{rec.description}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "methodology" && (
            <div className="space-y-6">
              <p className="text-slate-300 text-sm leading-relaxed">{results.report.methodology}</p>
              
              <div className="p-4 bg-slate-900/10 border border-slate-900 rounded-xl space-y-3">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Trace Audit Integrity Parameters</span>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300">Stateless Sandbox execution</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300">Automated PII masking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300">Deterministically mapped code</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300">Traceable database connection strings</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Roadmap Pipelines: Automation & Delivery */}
      <div className="space-y-4 border-t border-slate-900 pt-8">
        <div>
          <h3 className="text-sm font-semibold text-white">Report Delivery & Collaboration Pipelines</h3>
          <p className="text-xs text-slate-500 mt-1">Configure automated delivery alerts and collaborative workspaces for your analytical results.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {/* Active: Local Print */}
          <div className="p-4 rounded-xl bg-blue-600/5 border border-blue-500/20 text-left flex flex-col justify-between h-28 relative group">
            <div className="flex justify-between items-start">
              <Printer className="w-5 h-5 text-blue-400" />
              <span className="text-[8px] font-mono text-blue-400 font-bold border border-blue-500/20 px-1.5 py-0.5 rounded bg-blue-500/10">ACTIVE</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-white">Direct Print</span>
              <span className="block text-[10px] text-slate-500 mt-0.5">Local printer & PDF print-save</span>
            </div>
          </div>

          {[
            { name: "Export to PDF", desc: "Consulting-grade PDF document", icon: FileText },
            { name: "Share Dashboard", desc: "Interactive shared web workspace", icon: Share2 },
            { name: "Schedule Reports", desc: "Recurring daily/weekly cron delivery", icon: Clock },
            { name: "Slack Integration", desc: "Instant alert triggers on Slack", icon: MessageSquare },
            { name: "Microsoft Teams", desc: "Enterprise teams message channels", icon: Users },
            { name: "Email Automation", desc: "Scheduled executive summary emails", icon: Mail }
          ].map((pipeline) => {
            const IconComp = pipeline.icon;
            return (
              <div 
                key={pipeline.name} 
                className="p-4 rounded-xl bg-slate-900/10 border border-slate-900 text-left flex flex-col justify-between h-28 opacity-45 select-none relative group cursor-not-allowed overflow-hidden"
              >
                {/* Hover Overlay Tooltip */}
                <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 z-10">
                  <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">Roadmap Feature</span>
                  <span className="text-[9px] text-slate-300 font-medium mt-1">Available in Version 2</span>
                </div>

                <div className="flex justify-between items-start relative z-0">
                  <IconComp className="w-5 h-5 text-slate-400" />
                  <span className="text-[8px] font-mono text-slate-500 font-bold border border-slate-800 px-1 py-0.5 rounded bg-slate-900">COMING SOON</span>
                </div>
                <div className="relative z-0">
                  <span className="block text-xs font-bold text-slate-300">{pipeline.name}</span>
                  <span className="block text-[9px] text-slate-600 truncate mt-0.5">{pipeline.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
