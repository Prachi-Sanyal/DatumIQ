/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from "react";
import { 
  Lightbulb, Sparkles, ArrowRight, ShieldCheck, ChevronRight, Share2
} from "lucide-react";
import { AnalysisTask } from "../types";

interface AiInsightsProps {
  task: AnalysisTask;
  onNavigateToRecommendations: () => void;
}

export default function AiInsights({ task, onNavigateToRecommendations }: AiInsightsProps) {
  const [expandedInsight, setExpandedInsight] = useState<number | null>(0);
  const insightsList = task.results?.insights || [];

  return (
    <div id="insights-view" className="space-y-6 text-left">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-widest">AI Insights</span>
          <h2 className="font-display font-bold text-2xl text-white mt-1">What we found</h2>
          <p className="text-slate-400 text-xs mt-0.5">Ranked business anomalies isolated by logic clusters. Click any to expand mathematical tracers.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => alert("Insights copy link ready!")} className="p-2 border border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-white rounded-lg transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {insightsList.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-800 rounded-2xl text-center text-slate-500 font-mono text-sm">
              No tactical insights captured yet for this execution branch.
            </div>
          ) : (
            insightsList.map((insight: any, idx: number) => {
              const isExpanded = expandedInsight === idx;
              
              return (
                <div 
                  key={idx}
                  className={`border rounded-2xl transition-all ${
                    isExpanded 
                      ? "border-blue-500/40 bg-slate-900/30" 
                      : "border-slate-850 hover:border-slate-800 bg-slate-900/10"
                  }`}
                >
                  <div 
                    onClick={() => setExpandedInsight(isExpanded ? null : idx)}
                    className="p-5 flex items-start gap-4 cursor-pointer select-none"
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-blue-500/10 text-blue-400">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                          {insight.agent || "Insights Engine"} • High Confidence Discovery
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-base mt-1.5 leading-snug hover:text-blue-400 transition-colors">
                        {insight.title || (typeof insight === "string" ? "Analytical Finding" : insight.heading)}
                      </h4>
                      <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                        {typeof insight === "string" ? insight : insight.description || insight.finding}
                      </p>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-slate-500 mt-1 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  </div>

                  {isExpanded && (insight.details || insight.explanation) && (
                    <div className="px-5 pb-5 pt-3 border-t border-slate-900 space-y-3">
                      <h5 className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">Trace Explanatory Details</h5>
                      <div className="text-slate-300 text-xs leading-relaxed font-mono p-4 bg-slate-950 border border-slate-900 rounded-xl whitespace-pre-wrap">
                        {insight.details || insight.explanation}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-900 space-y-4 text-left">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <h4 className="text-sm font-bold text-white">Actionable Roadmaps</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our dynamic `RecommendationAgent` has structured these metrics into priority execution blocks for business operators.
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
              <h4 className="text-sm font-bold text-white">Auditable Execution</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every data point is derived via containerized mathematical statistics compiled over your file parameters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}