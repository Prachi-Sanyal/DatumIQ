/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  CheckSquare, Square, ShieldCheck, HelpCircle, ArrowRight,
  TrendingUp, Copy, Check, Users, Sparkles
} from "lucide-react";
import { AnalysisResults } from "../types";

interface RecommendationsProps {
  results: AnalysisResults;
  onNavigateToReport: () => void;
}

export default function Recommendations({ results, onNavigateToReport }: RecommendationsProps) {
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const toggleAction = (recId: string, actionIdx: number) => {
    const key = `${recId}-${actionIdx}`;
    setCompletedActions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCopyToNotion = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="recommendations-view" className="space-y-6 text-left">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-widest">Tactical playbooks</span>
          <h2 className="font-display font-bold text-2xl text-white mt-1">Recommended next moves</h2>
          <p className="text-slate-400 text-xs mt-0.5">Ranked by expected impact and adjusted for execution risk.</p>
        </div>

        <button 
          onClick={handleCopyToNotion}
          className="px-3.5 py-1.5 border border-slate-800 hover:bg-slate-900 rounded-lg text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" /> Copy to Notion
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main action board list */}
        <div className="lg:col-span-2 space-y-6">
          {results.recommendations.map((rec) => (
            <div key={rec.id} className="p-6 rounded-2xl border border-slate-850 bg-slate-950 flex flex-col md:flex-row gap-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />

              {/* Main card detail */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Priority Badge */}
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold font-mono text-blue-400 tracking-wider">
                    {rec.priority}
                  </span>
                  {/* Impact Badge */}
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold font-mono text-emerald-400 tracking-wider">
                    Impact: {rec.impact}
                  </span>
                  {/* Risk Badge */}
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-[9px] font-bold font-mono text-slate-500 tracking-wider">
                    Risk: {rec.risk}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">{rec.title}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{rec.description}</p>
                </div>

                {/* Sub checklists */}
                <div className="space-y-2 border-t border-slate-900 pt-4">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Action Plan checklist</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {rec.actions.map((act, idx) => {
                      const isDone = !!completedActions[`${rec.id}-${idx}`];
                      return (
                        <div 
                          key={idx}
                          onClick={() => toggleAction(rec.id, idx)}
                          className="flex items-center gap-2.5 cursor-pointer text-xs p-2 rounded-lg bg-slate-900/40 hover:bg-slate-900/80 border border-slate-900/60 select-none transition-all"
                        >
                          {isDone ? (
                            <CheckSquare className="w-4 h-4 text-blue-400 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-600 shrink-0" />
                          )}
                          <span className={isDone ? "text-slate-500 line-through" : "text-slate-300"}>
                            {act}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Dismiss/Assign button panel */}
              <div className="md:w-36 flex flex-row md:flex-col md:justify-center items-center gap-3 md:border-l border-slate-900 md:pl-6 shrink-0 justify-end">
                <button 
                  onClick={() => alert("Action dismissed")}
                  className="px-3.5 py-1.5 border border-transparent hover:border-slate-800 rounded-lg text-xs text-slate-500 hover:text-slate-300 font-medium transition-all"
                >
                  Dismiss
                </button>
                <button 
                  onClick={() => alert("Assigned owner!")}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-lg flex items-center justify-center gap-1.5 shadow shadow-blue-500/10 transition-all w-full"
                >
                  <span>Assign owner</span> <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar stats and guides */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-900 space-y-4 text-left">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <h4 className="text-sm font-bold text-white">Consolidated Report</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              These recommendations have been compiled with supporting charts and math models into an executive-level PDF report.
            </p>
            <button 
              onClick={onNavigateToReport}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-lg shadow-lg shadow-blue-500/15 hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Review full report</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-900 space-y-3.5 text-left">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">Impact Analysis</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Model recovery ARR</span>
                <span className="font-mono text-white font-bold">+$1.62M</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Expected payback</span>
                <span className="font-mono text-white font-bold">4 weeks</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Implementation cost</span>
                <span className="font-mono text-emerald-400 font-bold">Negligible</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
