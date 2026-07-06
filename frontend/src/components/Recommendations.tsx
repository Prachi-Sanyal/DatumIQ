/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  CheckSquare, Square, ArrowRight, Copy, Check, Sparkles
} from "lucide-react";
import { AnalysisTask } from "../types";

interface RecommendationsProps {
  task: AnalysisTask;
  onNavigateToReport: () => void;
}

export default function Recommendations({ task, onNavigateToReport }: RecommendationsProps) {
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const recsList = task.results?.recommendations || [];

  const toggleAction = (recId: string | number, actionIdx: number) => {
    const key = `${recId}-${actionIdx}`;
    setCompletedActions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCopyToClipboard = () => {
    const textToCopy = recsList.map((r: any, idx: number) => 
      `* [${r.priority || r.level || `P${idx}`}] ${r.title || r.heading || 'Recommendation'}\n  ${r.description || r.summary || ''}`
    ).join('\n\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="recommendations-view" className="space-y-6 text-left">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-widest">Tactical playbooks</span>
          <h2 className="font-display font-bold text-2xl text-white mt-1">Recommended next moves</h2>
          <p className="text-slate-400 text-xs mt-0.5">Ranked by expected impact and adjusted for execution risk parameters.</p>
        </div>

        {recsList.length > 0 && (
          <button 
            onClick={handleCopyToClipboard}
            className="px-3.5 py-1.5 border border-slate-800 hover:bg-slate-900 rounded-lg text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Recommendations
              </>
            )}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {recsList.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-800 rounded-2xl text-center text-slate-500 font-mono text-sm">
              No recommendations generated for this pipeline execution branch.
            </div>
          ) : (
            recsList.map((rec: any, idx: number) => {
              const recId = rec.id || `rec-${idx}`;
              const actions = Array.isArray(rec.actions) ? rec.actions : [];

              return (
                <div key={recId} className="p-6 rounded-2xl border border-slate-850 bg-slate-950 flex flex-col md:flex-row gap-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />

                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold font-mono text-blue-400 tracking-wider">
                        {rec.priority || rec.level || `P${idx}`}
                      </span>
                      {(rec.impact || rec.expectedImpact) && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold font-mono text-emerald-400 tracking-wider">
                          Impact: {rec.impact || rec.expectedImpact}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white">{rec.title || rec.heading || "Analysis Insight"}</h3>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{rec.description || rec.summary || "No description provided."}</p>
                    </div>

                    {/* Dynamic Action Plan Checklist */}
                    {actions.length > 0 && (
                      <div className="space-y-2 border-t border-slate-900 pt-4">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Action Plan checklist</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {actions.map((act: string, aIdx: number) => {
                            const isDone = !!completedActions[`${recId}-${aIdx}`];
                            return (
                              <div 
                                key={aIdx}
                                onClick={() => toggleAction(recId, aIdx)}
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
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-900 space-y-4 text-left">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <h4 className="text-sm font-bold text-white">Consolidated Insights</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              These suggestions are continuously audited using cross-correlation calculations on the loaded metrics data logs.
            </p>
            <button 
              onClick={onNavigateToReport}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-lg shadow-lg shadow-blue-500/15 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Review full compiled data</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}