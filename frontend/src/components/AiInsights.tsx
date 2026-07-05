/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Lightbulb, Sparkles, TrendingUp, TrendingDown, Eye, AlertTriangle, 
  ArrowRight, ShieldCheck, CornerDownRight, ChevronRight, Share2, Printer
} from "lucide-react";
import { AnalysisResults } from "../types";

interface AiInsightsProps {
  results: AnalysisResults;
  onNavigateToRecommendations: () => void;
}

export default function AiInsights({ results, onNavigateToRecommendations }: AiInsightsProps) {
  const [expandedInsight, setExpandedInsight] = useState<string | null>("ins_1");

  const toggleExpand = (id: string) => {
    setExpandedInsight(expandedInsight === id ? null : id);
  };

  return (
    <div id="insights-view" className="space-y-6 text-left">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-widest">AI Insights</span>
          <h2 className="font-display font-bold text-2xl text-white mt-1">What we found</h2>
          <p className="text-slate-400 text-xs mt-0.5">Ranked by novelty and business impact. Click to expand detailed math traces.</p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => alert("Insights shared!")} className="p-2 border border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-white rounded-lg transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Insights list */}
        <div className="lg:col-span-2 space-y-4">
          {results.insights.map((insight) => {
            const isExpanded = expandedInsight === insight.id;
            const isRootCause = insight.type === "root-cause";
            const isAnomaly = insight.type === "anomaly";

            return (
              <div 
                key={insight.id}
                className={`border rounded-2xl transition-all ${
                  isExpanded 
                    ? "border-blue-500/40 bg-slate-900/30" 
                    : "border-slate-850 hover:border-slate-800 bg-slate-900/10"
                }`}
              >
                {/* Header card banner */}
                <div 
                  onClick={() => toggleExpand(insight.id)}
                  className="p-5 flex items-start gap-4 cursor-pointer select-none"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isRootCause 
                      ? "bg-red-500/10 text-red-400" 
                      : isAnomaly 
                        ? "bg-amber-500/10 text-amber-400" 
                        : "bg-blue-500/10 text-blue-400"
                  }`}>
                    {isRootCause ? <AlertTriangle className="w-4 h-4" /> : <Lightbulb className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                        {insight.agent} • {Math.round(insight.confidence * 100)}% Confidence
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-base mt-1.5 leading-snug hover:text-blue-400 transition-colors">
                      {insight.title}
                    </h4>
                    <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{insight.description}</p>
                  </div>

                  <ChevronRight className={`w-4 h-4 text-slate-500 mt-1 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                </div>

                {/* Expanded Disclosure Area */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-3 border-t border-slate-900 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Math Trace */}
                    <div className="md:col-span-2 space-y-3">
                      <h5 className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">Trace Audit Log</h5>
                      <p className="text-slate-300 text-xs leading-relaxed font-mono p-3 bg-slate-950 border border-slate-900 rounded-xl">
                        {insight.details}
                      </p>
                    </div>

                    {/* Root Cause decomposition metrics on the right if available */}
                    {insight.subItems && (
                      <div className="space-y-3 p-4 bg-slate-950/40 border border-slate-900 rounded-xl">
                        <h5 className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-bold">Root-Cause Decomp</h5>
                        <ul className="space-y-2">
                          {insight.subItems.map((sub, sIdx) => (
                            <li key={sIdx} className="flex items-center justify-between text-xs">
                              <span className="text-slate-400 truncate max-w-[120px]">{sub.label}</span>
                              <span className={`font-mono font-bold ${sub.positive ? "text-emerald-400" : "text-rose-400"}`}>
                                {sub.value}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {!insight.subItems && insight.metricLabel && (
                      <div className="space-y-3 p-4 bg-slate-950/40 border border-slate-900 rounded-xl flex flex-col justify-between">
                        <h5 className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">Observed Metric</h5>
                        <div>
                          <span className="text-xs text-slate-400">{insight.metricLabel}</span>
                          <div className={`text-2xl font-extrabold mt-1 ${insight.type === "trend" ? "text-emerald-400" : "text-rose-400"}`}>
                            {insight.metricValue}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Sidebar Checklist / Next Actions */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-900 space-y-4 text-left">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <h4 className="text-sm font-bold text-white">Next Step</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our Recommendation Agent has translated these metrics into ranked, actionable initiatives (P0, P1, P2) for business operators.
            </p>
            <button 
              onClick={onNavigateToRecommendations}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-lg shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5"
            >
              <span>See recommendations</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-900 space-y-3 text-left">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">Auditable Math</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every insight is mathematically derived using containerized Python statistics and verified cross-correlation models. Zero hallucinated conceptual suggestions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
