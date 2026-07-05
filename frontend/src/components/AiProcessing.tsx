/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Play, Sparkles, Brain, CheckCircle, ShieldAlert, 
  Terminal, BarChart3, FileText, Send, HelpCircle, Loader2, Compass, ArrowRight
} from "lucide-react";
import { AgentId, AgentStatus, AgentStep, AnalysisTask } from "../types";
import { MOCK_TASKS } from "../mockData";

interface AiProcessingProps {
  onWorkflowComplete: (task: AnalysisTask) => void;
  datasetId: string;
}

export default function AiProcessing({ onWorkflowComplete, datasetId }: AiProcessingProps) {
  const [question, setQuestion] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const suggestedQuestions = [
    "Why did revenue drop in EMEA in Q3, and which segments were most affected?",
    "Which customer segments have the highest LTV and retention over the last 12 months?",
    "Forecast our segment gross margin over the next 6 months.",
    "Which SKUs are cannibalizing each other?"
  ];

  // Pipeline steps definition
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

  // Live Stats
  const [rowsScanned, setRowsScanned] = useState(0);
  const [statTests, setStatTests] = useState(0);
  const [chartsDrafted, setChartsDrafted] = useState(0);
  const [confidence, setConfidence] = useState("--");

  const runPipeline = () => {
    setIsProcessing(true);
    setProgress(0);
    setCurrentStepIndex(0);
    
    // Reset steps
    setSteps(initialSteps.map(s => ({ ...s, status: AgentStatus.IDLE })));
  };

  useEffect(() => {
    if (!isProcessing) return;

    const stepMs = [1000, 1500, 1200, 2500, 1800, 1200, 1000];
    const totalDuration = stepMs.reduce((a, b) => a + b, 0);

    let elapsedTime = 0;
    let stepIdx = 0;

    const timer = setInterval(() => {
      elapsedTime += 100;
      const calculatedProgress = Math.min(Math.round((elapsedTime / totalDuration) * 100), 100);
      setProgress(calculatedProgress);

      // Stat Counters simulation
      if (stepIdx >= 1) setRowsScanned(Math.min(Math.round((elapsedTime / totalDuration) * 48231), 48231));
      if (stepIdx >= 3) setStatTests(Math.min(Math.round((elapsedTime / totalDuration) * 7), 7));
      if (stepIdx >= 4) setChartsDrafted(Math.min(Math.round((elapsedTime / totalDuration) * 4), 4));

      // Check step changes
      let currentStepSum = 0;
      for (let i = 0; i < stepMs.length; i++) {
        currentStepSum += stepMs[i];
        if (elapsedTime >= currentStepSum && i === stepIdx) {
          // Complete current step
          setSteps(prev => {
            const next = [...prev];
            next[i].status = AgentStatus.COMPLETED;
            const now = new Date();
            next[i].timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            
            // Custom success message
            if (i === 0) next[0].message = "Deconstructed query into 6 analytical Directed Acyclic Graphs (DAG).";
            if (i === 1) next[1].message = "Scanned 48k rows; automatically resolved 14 missing discounts.";
            if (i === 2) next[2].message = "Masked raw customer name columns, emails, and SSN parameters.";
            if (i === 3) next[3].message = "Discovered EMEA SMB customer retention dropped 14.2% post-price increase.";
            if (i === 4) next[4].message = "Generated Area chart, segment Ring chart, and Forecast model.";
            if (i === 5) next[5].message = "Formulated 3 high-impact tactical sales recommendations.";
            if (i === 6) next[6].message = "Compiled board-ready PDF summary. Results packaged.";
            return next;
          });

          stepIdx++;
          setCurrentStepIndex(stepIdx);
        }
      }

      // Update current running status
      if (stepIdx < stepMs.length) {
        setSteps(prev => {
          const next = [...prev];
          if (next[stepIdx].status !== AgentStatus.RUNNING) {
            next[stepIdx].status = AgentStatus.RUNNING;
            next[stepIdx].message = "Executing autonomous reasoning...";
          }
          return next;
        });
      }

      // Complete pipeline
      if (elapsedTime >= totalDuration) {
        clearInterval(timer);
        setIsProcessing(false);
        setConfidence("97%");
        
        // Return task_1 from MOCK_TASKS
        setTimeout(() => {
          onWorkflowComplete(MOCK_TASKS[0]);
        }, 800);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [isProcessing]);

  // Agent Icon Resolver
  const getAgentIcon = (id: AgentId) => {
    switch (id) {
      case AgentId.PLANNER: return Brain;
      case AgentId.VALIDATION: return CheckCircle;
      case AgentId.SECURITY: return ShieldAlert;
      case AgentId.ANALYSIS: return Terminal;
      case AgentId.VISUALIZATION: return BarChart3;
      case AgentId.RECOMMENDATION: return Sparkles;
      case AgentId.REPORT: return FileText;
      default: return HelpCircle;
    }
  };

  return (
    <div id="processing-view" className="space-y-6">
      {/* Step 2 Form view if not processing */}
      {!isProcessing && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Question Form */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-widest">STEP 2</span>
              <h2 className="font-display font-bold text-2xl text-white mt-1">What do you want to know?</h2>
              <p className="text-slate-400 text-sm mt-1">Ask in plain English. Our Planner Agent translates it into a rigorous analysis plan.</p>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                  <Terminal className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="w-full">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Selected Ingestion File</span>
                  <p className="text-xs font-semibold text-white mt-0.5">sales_q3_2026.csv</p>
                </div>
              </div>

              {/* Chat-style text input */}
              <div className="relative">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. Why did revenue drop in EMEA in Q3, and which segments were most affected?"
                  rows={4}
                  className="w-full bg-slate-900/60 border border-slate-800 focus:border-blue-500 rounded-xl py-4 pl-4 pr-12 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none transition-all placeholder:text-slate-500"
                />
                <button
                  onClick={runPipeline}
                  disabled={!question.trim()}
                  className="absolute right-3.5 bottom-4 w-9 h-9 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white disabled:text-slate-600 flex items-center justify-center transition-all shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Suggestions */}
              <div className="space-y-2.5">
                <span className="text-xs font-semibold text-slate-500 px-1">Suggested prompts</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuestion(q)}
                      className="p-3 bg-slate-900/20 border border-slate-850 hover:border-slate-800 hover:bg-slate-900/40 text-left rounded-xl text-xs text-slate-300 transition-all flex items-center justify-between group"
                    >
                      <span className="max-w-[220px] truncate leading-relaxed">{q}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar details */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-900 space-y-4 text-left">
              <div className="flex items-center gap-2 text-indigo-400">
                <Brain className="w-4 h-4" />
                <h4 className="text-sm font-bold">How Agents Analyze</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                When you input a query, the <strong className="text-slate-200">Planner Agent</strong> generates a task plan containing: statistical analysis requirements, visualization layouts, and recommendation outlines.
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                The execution pipeline then spins up sandboxed, stateless containers to compute math variables directly—eliminating logic hallucinations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 3 processing view */}
      {isProcessing && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main timeline tracker */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> STEP 3
              </span>
              <h2 className="font-display font-bold text-2xl text-white mt-1">Your agents are working.</h2>
              <p className="text-slate-400 text-sm mt-1">A specialized team is analyzing your data in parallel. Usually takes under two minutes.</p>
            </div>

            {/* Overall Progress panel */}
            <div className="p-5 border border-slate-850 bg-slate-900/40 rounded-2xl flex items-center justify-between gap-6">
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-blue-400 animate-spin-slow" /> Overall Progress
                  </span>
                  <span className="text-xs font-mono text-blue-400 font-bold">{progress}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-150" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>

            {/* Timeline Agent List */}
            <div className="border border-slate-900 bg-slate-950 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-semibold font-mono text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-3">Agent Orchestration DAG</h3>

              <div className="relative pl-6 space-y-5">
                {/* Visual vertical pipeline connecting lines */}
                <div className="absolute left-3.5 top-2 bottom-6 w-[1.5px] bg-slate-850/80" />

                {steps.map((step, idx) => {
                  const AgentIcon = getAgentIcon(step.agentId);
                  
                  return (
                    <div key={step.agentId} className="flex items-start gap-4 relative">
                      {/* Left Dot bullet representing status */}
                      <div className="absolute -left-6 top-1 flex items-center justify-center">
                        {step.status === AgentStatus.COMPLETED ? (
                          <div className="w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 z-10">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                        ) : step.status === AgentStatus.RUNNING ? (
                          <div className="w-7 h-7 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 z-10 animate-pulse">
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 z-10">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                          </div>
                        )}
                      </div>

                      {/* Content panel */}
                      <div className="flex-1 ml-4 p-4 rounded-xl border border-slate-900 bg-slate-900/10 flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-white">{step.name}</span>
                            {step.status === AgentStatus.RUNNING && (
                              <span className="text-[9px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 rounded uppercase animate-pulse">Running</span>
                            )}
                            {step.status === AgentStatus.COMPLETED && (
                              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 rounded uppercase">Done</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{step.message}</p>
                        </div>

                        {step.timestamp && (
                          <span className="text-[10px] font-mono text-slate-500">{step.timestamp}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Live signals sidebar */}
          <div className="space-y-6">
            {/* Live Signals list */}
            <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-900 space-y-4 text-left">
              <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-3">Live Signals</h4>
              
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Rows scanned</span>
                  <span className="font-mono text-white font-bold">{rowsScanned.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Statistical tests</span>
                  <span className="font-mono text-white font-bold">{statTests} / 7</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Charts drafted</span>
                  <span className="font-mono text-white font-bold">{chartsDrafted}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Confidence score</span>
                  <span className="font-mono text-emerald-400 font-bold">{confidence}</span>
                </div>
              </div>
            </div>

            {/* Informative panel explaining timelines */}
            <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-900 space-y-3 text-left">
              <h4 className="text-sm font-bold text-indigo-400">Why this takes minutes</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Seven agents run in parallel with a shared memory blackboard context, verifying metrics, running python scripts, drafting diagrams, and cross-auditing business recommendations before drafting the final PDF.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
