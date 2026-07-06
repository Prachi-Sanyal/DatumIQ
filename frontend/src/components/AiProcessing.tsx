/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from "react";
import { 
  Sparkles, Brain, CheckCircle, ShieldAlert, 
  Terminal, BarChart3, FileText, Send, HelpCircle, Loader2, Compass, AlertCircle
} from "lucide-react";
import { AgentId, AgentStatus, AgentStep, AnalysisTask } from "../types";

interface AiProcessingProps {
  datasetId: number | string;
  datasetName?: string;
  onWorkflowComplete: (taskData: AnalysisTask) => void;
}

export default function AiProcessing({ datasetId, datasetName, onWorkflowComplete }: AiProcessingProps) {
  const [question, setQuestion] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialSteps: AgentStep[] = [
    { agentId: AgentId.PLANNER, name: "Planner Agent", status: AgentStatus.IDLE, message: "Awaiting task deconstruction plan...", timestamp: "" },
    { agentId: AgentId.VALIDATION, name: "Validation Agent", status: AgentStatus.IDLE, message: "Awaiting schema analysis...", timestamp: "" },
    { agentId: AgentId.SECURITY, name: "Security Agent", status: AgentStatus.IDLE, message: "Awaiting privacy compliance checking...", timestamp: "" },
    { agentId: AgentId.ANALYSIS, name: "Analysis Agent", status: AgentStatus.IDLE, message: "Awaiting Python statistical query sandbox...", timestamp: "" },
    { agentId: AgentId.VISUALIZATION, name: "Visualization Agent", status: AgentStatus.IDLE, message: "Awaiting chart generation...", timestamp: "" },
    { agentId: AgentId.RECOMMENDATION, name: "Recommendation Agent", status: AgentStatus.IDLE, message: "Awaiting business strategic mapping...", timestamp: "" },
    { agentId: AgentId.REPORT, name: "Report Agent", status: AgentStatus.IDLE, message: "Awaiting executive PDF packaging...", timestamp: "" }
  ];

  const [steps, setSteps] = useState<AgentStep[]>(initialSteps);

  const runPipeline = async () => {
    if (!question.trim()) return;
    
    setIsProcessing(true);
    setError(null);
    setSteps(initialSteps.map(s => ({ ...s, status: AgentStatus.IDLE })));

    try {
      const token = localStorage.getItem("token");
      
      // CRITICAL PROXY FIX: Internal relative call hits the exact Vite config route wrapper
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify({
          question: question,
          dataset_id: parseInt(datasetId.toString()) || 1
        })
      });

      if (!response.ok) {
        throw new Error(`Server execution failed with status code ${response.status}`);
      }

      const completedTask: AnalysisTask = await response.json();
      onWorkflowComplete(completedTask);
    } catch (err: any) {
      console.error("Pipeline trace error context:", err);
      setError(err.message || "Backend orchestration pipeline execution failed");
      setIsProcessing(false);
    }
  };

  return (
    <div id="processing-view" className="space-y-6">
      {!isProcessing && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-widest">STEP 2</span>
              <h2 className="font-display font-bold text-2xl text-white mt-1">What do you want to know?</h2>
              <p className="text-slate-400 text-sm mt-1">Ask in plain English. Our Planner Agent translates it into a rigorous analysis plan.</p>
            </div>

            <div className="space-y-4">
              {/* Dynamic Target Context Header */}
              <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl flex gap-3 items-center justify-between">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 text-indigo-400">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Active Connected Target File</span>
<p className="text-xs font-semibold text-white mt-0.5">
                      {datasetName ? datasetName : `Dataset ID: #${datasetId}`}
                    </p>                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  Ready
                </span>
              </div>

              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3 text-xs text-rose-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">Execution Interrupted</span>
                    {error}. Check local backend terminal scripts.
                  </div>
                </div>
              )}

              {/* Text Input Block */}
              <div className="relative">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type your custom query targeted regarding your uploaded dataset matrix columns..."
                  rows={4}
                  className="w-full bg-slate-900/60 border border-slate-800 focus:border-blue-500 rounded-xl py-4 pl-4 pr-12 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none transition-all placeholder:text-slate-500"
                />
                <button
                  onClick={runPipeline}
                  disabled={!question.trim()}
                  className="absolute right-3.5 bottom-4 w-9 h-9 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white disabled:text-slate-600 flex items-center justify-center transition-all shadow-md cursor-pointer disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-900 space-y-4 text-left">
              <div className="flex items-center gap-2 text-indigo-400">
                <Brain className="w-4 h-4" />
                <h4 className="text-sm font-bold">How Agents Analyze</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                When you input a query, the Planner Agent generates a task plan containing: statistical analysis requirements, visualization layouts, and recommendation outlines.
              </p>
            </div>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> PIPELINE TRACE
              </span>
              <h2 className="font-display font-bold text-2xl text-white mt-1">Executing Multi-Agent Orchestration Engine...</h2>
              <p className="text-slate-400 text-sm mt-1">Spawning sandbox environments to calculate dynamic insights over your data variables.</p>
            </div>

            {/* Prompt Preview Banner */}
            <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-xl text-left space-y-1">
              <span className="text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase block">Active Processing Prompt Target</span>
              <span className="text-xs italic text-slate-300">"{question}"</span>
            </div>

            <div className="p-5 border border-slate-850 bg-slate-900/40 rounded-2xl flex items-center justify-between gap-6">
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-blue-400 animate-spin" /> Real-time Proxy Execution Stream
                  </span>
                </div>
              </div>
            </div>

            <div className="border border-slate-900 bg-slate-950 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-semibold font-mono text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-3">Agent Sequence DAG</h3>
              <div className="text-center py-8 text-slate-500 font-mono text-sm flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <span>Processing backend sandbox scripts... Complete view updates on workflow completion.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}