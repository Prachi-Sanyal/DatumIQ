/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Play, UploadCloud, HelpCircle, FileText, ArrowRight, 
  Sparkles, Database, FileSpreadsheet, Compass, CheckCircle2, MoreVertical
} from "lucide-react";
import { AnalysisTask, DatasetMetadata } from "../types";

interface DashboardProps {
  tasks: AnalysisTask[];
  datasets: DatasetMetadata[];
  onNewAnalysis: () => void;
  onSelectTask: (task: AnalysisTask) => void;
  onTabChange: (tab: "upload" | "ask" | "report") => void;
}

export default function Dashboard({ tasks, datasets, onNewAnalysis, onSelectTask, onTabChange }: DashboardProps) {
  // Stats definitions
  const kpis = [
    { label: "Analyses this month", value: "48", change: "+12 vs last month", positive: true },
    { label: "Insights generated", value: "312", change: "+61 vs last month", positive: true },
    { label: "Avg processing time", value: "1m 42s", change: "-18s faster", positive: true },
    { label: "Datasets connected", value: "17", change: "+3 new", positive: true }
  ];

  return (
    <div id="dashboard-view" className="space-y-6">
      {/* 1. Greeting row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-slate-900/20 border border-slate-900 rounded-2xl">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Good afternoon, Alex.</h1>
          <p className="text-slate-400 text-sm mt-1">Here's what your agents have been working on today.</p>
        </div>
        <button
          onClick={onNewAnalysis}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white rounded-lg shadow-lg shadow-blue-500/10 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>Start new analysis</span>
        </button>
      </div>

      {/* 2. KPIs & Usage Progress panels */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 column grid for metrics */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/40 border border-slate-850 flex flex-col justify-between">
              <span className="text-xs text-slate-500 font-medium leading-relaxed">{kpi.label}</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{kpi.value}</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-medium font-mono mt-1 flex items-center gap-1">
                {kpi.change}
              </span>
            </div>
          ))}
        </div>

        {/* Right 1 column usage meter */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-850 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white">Usage this month</span>
            <span className="text-[10px] font-mono text-slate-500">Resets in 12 days</span>
          </div>

          <div className="space-y-2 mt-3">
            {/* Meter 1 */}
            <div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Analyses</span>
                <span>48 / 200</span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full mt-1 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: "24%" }} />
              </div>
            </div>
            {/* Meter 2 */}
            <div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Data processed</span>
                <span>3.2 GB / 10 GB</span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full mt-1 overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: "32%" }} />
              </div>
            </div>
            {/* Meter 3 */}
            <div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>PDF reports</span>
                <span>12 / 100</span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full mt-1 overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: "12%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Quick Actions Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold font-mono text-slate-500 uppercase tracking-widest px-1">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Action 1 */}
          <div 
            onClick={() => onTabChange("upload")}
            className="p-5 rounded-xl bg-slate-900/20 border border-slate-850 hover:border-slate-800 cursor-pointer flex flex-col gap-4 relative group transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">Upload dataset</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">CSV or Excel files, up to 250MB. Pro-active validation and schema mapping.</p>
            </div>
            <ArrowRight className="absolute bottom-5 right-5 w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
          </div>

          {/* Action 2 */}
          <div 
            onClick={() => onTabChange("ask")}
            className="p-5 rounded-xl bg-slate-900/20 border border-slate-850 hover:border-slate-800 cursor-pointer flex flex-col gap-4 relative group transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white group-hover:text-purple-400 transition-colors">Ask a question</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Describe your target goal or query in plain English. Planner Agent maps the tasks.</p>
            </div>
            <ArrowRight className="absolute bottom-5 right-5 w-4 h-4 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
          </div>

          {/* Action 3 */}
          <div 
            onClick={() => onTabChange("report")}
            className="p-5 rounded-xl bg-slate-900/20 border border-slate-850 hover:border-slate-800 cursor-pointer flex flex-col gap-4 relative group transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Executive report</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Review synthesized findings and export board-ready professional PDFs.</p>
            </div>
            <ArrowRight className="absolute bottom-5 right-5 w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>

      {/* 4. Recent analyses table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-semibold font-mono text-slate-500 uppercase tracking-widest">Recent Analyses</h3>
          <button 
            onClick={onNewAnalysis}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            View all
          </button>
        </div>

        <div className="border border-slate-900 rounded-xl bg-slate-950 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-900/20 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  <th className="p-4 pl-6 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Dataset</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 text-center font-semibold">Insights</th>
                  <th className="p-4 font-semibold">Updated</th>
                  <th className="p-4 pr-6 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {tasks.map((task) => {
                  const ds = datasets.find(d => d.id === task.datasetId);
                  return (
                    <tr key={task.id} className="hover:bg-slate-900/20 transition-colors">
                      <td className="p-4 pl-6 font-medium text-white max-w-xs truncate">
                        {task.question}
                      </td>
                      <td className="p-4 font-mono text-slate-400">
                        {ds?.fileName || "sales_q3_2026.csv"}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                      </td>
                      <td className="p-4 text-center font-bold text-white">
                        {task.results?.insights.length || 0}
                      </td>
                      <td className="p-4 text-slate-500 font-mono text-[10px]">
                        2h ago
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => onSelectTask(task)}
                          className="px-3 py-1.5 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-200 hover:text-white hover:bg-slate-900/60 font-semibold transition-all inline-flex items-center gap-1"
                        >
                          Open <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
