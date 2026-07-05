/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Upload, CheckCircle, Shield, Brain, BarChart3, 
  Sparkles, Award, ArrowRight, Play, Database, Lock, Eye, 
  FileText, MessageSquare, Compass, Terminal, HelpCircle, 
  Activity, ArrowDown, Cpu, Sparkle
} from "lucide-react";
import DatumIQLogo from "./DatumIQLogo";

interface LandingPageProps {
  onStart: () => void;
  onSignIn: () => void;
}

export default function LandingPage({ onStart, onSignIn }: LandingPageProps) {
  const [activeDemoTab, setActiveDemoTab] = useState<"dashboard" | "pipeline" | "report">("dashboard");
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [activeNodeIndex, setActiveNodeIndex] = useState(0);
  const [liveKpiVal, setLiveKpiVal] = useState(4821034);

  // Auto-animate values on the mock dashboard
  useEffect(() => {
    const kpiInterval = setInterval(() => {
      setLiveKpiVal(prev => prev + Math.floor(Math.random() * 120) - 45);
    }, 1200);

    const pipelineInterval = setInterval(() => {
      setActiveNodeIndex(prev => (prev + 1) % 8);
    }, 2500);

    return () => {
      clearInterval(kpiInterval);
      clearInterval(pipelineInterval);
    };
  }, []);

  // Strict Brand Compliant 8-Node visual pipeline steps
  const pipelineNodes = [
    { id: "p1", label: "Upload Dataset", icon: Upload, color: "from-blue-600 to-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400" },
    { id: "p2", label: "Validation Agent", icon: CheckCircle, color: "from-emerald-600 to-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400" },
    { id: "p3", label: "Security Agent", icon: Shield, color: "from-purple-600 to-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400" },
    { id: "p4", label: "Planner Agent", icon: Brain, color: "from-blue-600 to-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400" },
    { id: "p5", label: "Analysis Agent", icon: Terminal, color: "from-emerald-600 to-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400" },
    { id: "p6", label: "Visualization Agent", icon: BarChart3, color: "from-purple-600 to-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400" },
    { id: "p7", label: "Recommendation Agent", icon: Sparkles, color: "from-blue-600 to-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400" },
    { id: "p8", label: "Executive Report", icon: FileText, color: "from-emerald-600 to-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400" }
  ];

  const features = [
    {
      title: "Multi-Agent AI",
      desc: "Seven specialized, autonomous agents working as a synchronized board of directors.",
      icon: Brain,
    },
    {
      title: "Privacy First",
      desc: "Automatic PII scrubbing and isolation before analysis runtime executes in the sandbox.",
      icon: Lock,
    },
    {
      title: "Explainable Analytics",
      desc: "Full trace auditability and transparent code blocks for every metric calculated.",
      icon: Eye,
    },
    {
      title: "Natural Language Insights",
      desc: "Ask business questions in plain English—no complex SQL queries or DAX expressions required.",
      icon: MessageSquare,
    },
    {
      title: "Executive Reporting",
      desc: "Get decision-ready, consulting-grade executive summaries of key findings instantly.",
      icon: FileText,
    },
    {
      title: "Decision Intelligence",
      desc: "Transforms descriptive graphs into ranked, impact-weighted business action items.",
      icon: Award,
    },
  ];

  return (
    <div id="landing-page" className="min-h-screen bg-[#060B1F] text-slate-100 selection:bg-blue-500 selection:text-white font-sans overflow-hidden">
      {/* Background radial gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="border-b border-slate-900/80 bg-[#060B1F]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <DatumIQLogo />

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#workflow" className="hover:text-blue-400 transition-colors">Features & Workflow</a>
            <a href="#why" className="hover:text-blue-400 transition-colors">Why DatumIQ</a>
            <a 
              href="/internal-documentation" 
              onClick={(e) => {
                e.preventDefault();
                alert("Documentation page loaded at /internal-documentation");
              }} 
              className="hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              Documentation <Compass className="w-3.5 h-3.5" />
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={onSignIn} 
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Sign in
            </button>
            <button 
              onClick={onStart}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Series A: Multi-agent BI, generally available</span>
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight text-white mb-6 leading-tight">
            Turn Business Data into Decisions. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400">Instantly.</span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-3xl mx-auto mb-10 leading-relaxed">
            Upload your CSV, Excel or business data. Ask questions in plain English. DatumIQ's AI Agent team validates, analyzes, visualizes and explains your data before generating executive dashboards, insights and reports.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-base font-semibold text-white rounded-xl shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Start Analysis <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById("demo-preview-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-base font-semibold text-slate-200 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-200 text-slate-200" /> Watch Demo
            </button>
          </div>

          <p className="mt-4 text-xs font-mono text-slate-500">
            Enterprise Grade Security • Instant Sandbox Isolation • SOC 2 Compliant Infrastructure
          </p>
        </div>

        {/* 3. WATCH DEMO (Animated Demo Placeholder Section) */}
        <div id="demo-preview-section" className="max-w-5xl mx-auto mt-24 border border-slate-800/80 rounded-2xl bg-slate-900/30 p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-850 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <span className="text-sm font-bold text-white ml-2 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                ▶ Demo Preview
              </span>
            </div>

            {/* Simulated Window Tabs */}
            <div className="flex bg-slate-950/80 p-1 rounded-lg border border-slate-850 gap-1 text-xs font-mono">
              <button 
                onClick={() => setActiveDemoTab("dashboard")}
                className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  activeDemoTab === "dashboard" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                📊 Live Dashboard
              </button>
              <button 
                onClick={() => setActiveDemoTab("pipeline")}
                className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  activeDemoTab === "pipeline" ? "bg-purple-600 text-white" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                ⚙️ AI Workflow Pipeline
              </button>
              <button 
                onClick={() => setActiveDemoTab("report")}
                className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  activeDemoTab === "report" ? "bg-emerald-600 text-white" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                📝 Executive Report
              </button>
            </div>
          </div>

          {/* TAB CONTENT: 1. LIVE DASHBOARD PREVIEW */}
          {activeDemoTab === "dashboard" && (
            <div className="space-y-6">
              {/* Floating KPI Widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-850 relative group overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                  <span className="text-xs text-slate-500 font-mono uppercase tracking-wider block">Live Revenue</span>
                  <div className="text-2xl font-bold text-white mt-1 font-mono">
                    ${(liveKpiVal / 1000000).toFixed(6)}M
                  </div>
                  <span className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
                    +18.4% <span className="text-slate-600 font-mono">vs plan</span>
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-850 relative group overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
                  <span className="text-xs text-slate-500 font-mono uppercase tracking-wider block">Gross Margin</span>
                  <div className="text-2xl font-bold text-white mt-1 font-mono">62.15%</div>
                  <span className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
                    +3.2 pts <span className="text-slate-600 font-mono font-normal">stable</span>
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-850 relative group overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                  <span className="text-xs text-slate-500 font-mono uppercase tracking-wider block">Active Accounts</span>
                  <div className="text-2xl font-bold text-white mt-1 font-mono">1,284</div>
                  <span className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
                    +4 new today <span className="text-slate-600 font-mono font-normal">active</span>
                  </span>
                </div>
              </div>

              {/* Live updating charts & bars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                {/* Bar chart widget */}
                <div className="md:col-span-2 p-4 bg-slate-950/80 border border-slate-850 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-slate-300">Revenue Distribution Trend</span>
                    <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Live Auto-Stream</span>
                  </div>
                  <div className="h-44 flex items-end justify-between gap-2.5 pt-4">
                    {Array.from({ length: 12 }, (_, idx) => {
                      const heights = ["35%", "45%", "55%", "85%", "68%", "72%", "92%", "88%", "98%", "90%", "95%", "89%"];
                      return (
                        <div key={idx} className="w-full flex flex-col items-center gap-1.5 h-full justify-end">
                          <div 
                            className="w-full rounded-t-sm bg-gradient-to-t from-blue-600/20 via-blue-500/80 to-purple-500/90 transition-all duration-1000 ease-in-out relative group" 
                            style={{ height: heights[(idx + activeNodeIndex) % heights.length] }}
                          >
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-[9px] font-mono text-white py-0.5 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {heights[(idx + activeNodeIndex) % heights.length]}
                            </div>
                          </div>
                          <span className="text-[9px] font-mono text-slate-600">Q{Math.floor(idx/3)+1}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pie/Segment & moving insight card */}
                <div className="space-y-4">
                  <div className="p-4 bg-slate-950/80 border border-slate-850 rounded-xl">
                    <span className="text-xs font-semibold text-slate-300 block mb-3">Enterprise Core Segment</span>
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                          <span>Enterprise (52%)</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                          <span>Mid-market (38%)</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          <span>SMB (10%)</span>
                        </div>
                      </div>
                      {/* Animated circular meter */}
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path className="text-slate-900" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          <path className="text-blue-500 animate-pulse" strokeDasharray="52, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <span className="absolute text-[10px] font-mono text-slate-400">52%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-950/40 to-purple-950/40 border border-blue-500/20 rounded-xl relative group">
                    <span className="text-[9px] font-mono text-blue-400 uppercase tracking-wider block font-bold">Auto Insight</span>
                    <p className="text-xs text-slate-200 mt-1.5 leading-relaxed font-sans">
                      "Enterprise retention matches <span className="text-emerald-400 font-semibold font-mono">92% baseline</span>. Core DACH recovery modeled at <span className="text-purple-400 font-semibold font-mono">+$620k ARR</span>."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: 2. AI WORKFLOW PIPELINE DIAGRAM */}
          {activeDemoTab === "pipeline" && (
            <div className="py-6 relative text-left">
              <div className="text-center max-w-xl mx-auto mb-8">
                <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-widest">Multi-Agent State</span>
                <h4 className="font-bold text-lg text-white mt-1">Autonomous Reasoning Orchestration</h4>
                <p className="text-xs text-slate-400 mt-1">Specialized agents validate, sanitize, program, compute, and draft answers autonomously.</p>
              </div>

              {/* Visual Horizontal Node Flow */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                {pipelineNodes.map((node, idx) => {
                  const NodeIcon = node.icon;
                  const isActive = idx === activeNodeIndex;
                  return (
                    <div 
                      key={node.id}
                      className={`p-4 rounded-xl border relative overflow-hidden transition-all duration-500 ${
                        isActive 
                          ? `bg-[#0B1536] ${node.border} shadow-lg shadow-purple-500/5 scale-102`
                          : "bg-slate-950/60 border-slate-900 opacity-60"
                      }`}
                    >
                      {/* Active glowing indicator */}
                      {isActive && (
                        <div className="absolute top-2 right-2 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest">Processing</span>
                        </div>
                      )}

                      <div className={`w-8 h-8 rounded-lg ${isActive ? node.bg : "bg-slate-900"} ${isActive ? node.text : "text-slate-500"} flex items-center justify-center mb-3`}>
                        <NodeIcon className="w-4 h-4" />
                      </div>

                      <div className="text-[9px] font-mono text-slate-500">STAGE 0{idx+1}</div>
                      <h5 className={`text-xs font-bold mt-1 ${isActive ? "text-white" : "text-slate-400"}`}>{node.label}</h5>
                      <p className="text-[10px] text-slate-500 mt-1 font-sans leading-tight">
                        {idx === 0 && "CSV upload & index mappings"}
                        {idx === 1 && "Outlier checks & columns validation"}
                        {idx === 2 && "Scrub PII & isolate sandbox safe"}
                        {idx === 3 && "Generate analysis code plan"}
                        {idx === 4 && "Run Python arithmetic loops"}
                        {idx === 5 && "Synthesize vector charts"}
                        {idx === 6 && "Model impact plays & risk matrices"}
                        {idx === 7 && "Compile board-ready PDF summaries"}
                      </p>

                      {/* Connection Line */}
                      {idx < 7 && (
                        <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20">
                          <ArrowRight className={`w-3.5 h-3.5 ${isActive ? "text-purple-400 animate-pulse" : "text-slate-800"}`} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Progress Bar Flow */}
              <div className="mt-8 bg-slate-950/80 p-3 rounded-xl border border-slate-850 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Current Agent Executing: <span className="text-purple-400 font-bold">{pipelineNodes[activeNodeIndex].label}</span></span>
                <div className="w-32 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${(activeNodeIndex + 1) * 12.5}%` }} />
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: 3. GENERATED EXECUTIVE REPORT */}
          {activeDemoTab === "report" && (
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-850 text-left text-xs font-mono relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 text-[9px] text-emerald-400 uppercase tracking-widest font-bold">100% SECURE SANDBOX</div>
              
              <div className="border-b border-slate-900 pb-3 mb-4">
                <div className="text-[10px] text-slate-500">PREPARED BY DATUMIQ BOARD OF AGENTS</div>
                <h4 className="text-sm font-bold text-white mt-1">Q3 Revenue Growth & DACH Segment Diagnosis</h4>
                <div className="text-[10px] text-slate-400 mt-1">October 2026 • Confidential Executive Briefing</div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-slate-500 uppercase text-[9px] tracking-wider block font-bold">Executive Summary</span>
                  <p className="text-slate-300 leading-relaxed font-sans mt-1 text-xs">
                    "Our diagnosis attributes EMEA revenue contraction strictly to the price adjustment applied on Jul 12. SMB DACH churn spiked 3.4x over model rate. However, Enterprise ACV expansion remains strong at +42% YoY with CS qualified engagement. Reverting DACH baseline pricing for 90 days captures a recovery of +$620k ARR."
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-900 pt-3">
                  <div>
                    <span className="text-slate-500 uppercase text-[9px] tracking-wider block font-bold">Recommended Playbook Actions</span>
                    <div className="space-y-1.5 mt-2">
                      <div className="flex items-center gap-2 text-slate-300">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Revert DACH SMB price adjust (P0, High Impact)</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Establish CS bundle SKU in Gainsight (P1)</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 uppercase text-[9px] tracking-wider block font-bold">Isolate Audited Math Trace</span>
                    <pre className="bg-slate-900/60 p-2 border border-slate-850 rounded text-[9px] text-blue-400 mt-2 overflow-x-auto">
                      {`SELECT count(1), sum(revenue), segment
FROM transactions 
WHERE region = 'EMEA' AND country IN ('DE', 'AT', 'CH') 
GROUP BY segment;`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 7. LANDING PAGE PIPELINE (Enterprise AI Workflow Section) */}
      <section id="workflow" className="py-24 border-t border-slate-900 bg-[#060B1F] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">Enterprise Integrity</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mt-2 mb-4">
              Visual AI Pipeline Orchestration
            </h2>
            <p className="text-slate-400">
              No black-box guesses. Data flows through specialized, isolated reasoning steps.
            </p>
          </div>

          {/* Visual connected enterprise diagram */}
          <div className="relative border border-slate-900 rounded-3xl bg-slate-950/40 p-8 overflow-hidden">
            {/* Pulsing connections bg line */}
            <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-900 -translate-y-1/2 hidden xl:block" />
            <div 
              className="absolute top-1/2 left-8 right-8 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 -translate-y-1/2 hidden xl:block transition-all duration-1000" 
              style={{
                backgroundSize: "200% 100%",
                animation: "pulseGlow 3s linear infinite"
              }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-8 gap-4 relative z-10">
              {pipelineNodes.map((step, idx) => {
                const StepIcon = step.icon;
                const isActive = idx === activeNodeIndex;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div 
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 relative ${
                        isActive 
                          ? `${step.bg} ${step.border} text-white shadow-xl shadow-purple-500/10 scale-110` 
                          : "bg-slate-950 border-slate-900 text-slate-500"
                      }`}
                    >
                      <StepIcon className="w-6 h-6" />
                      {isActive && (
                        <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#060B1F] rounded-full animate-ping" />
                      )}
                    </div>
                    
                    <span className="text-[10px] font-mono text-slate-500 mt-3">STEP 0{idx+1}</span>
                    <span className={`text-xs font-bold text-center mt-1 whitespace-nowrap ${isActive ? "text-white" : "text-slate-400"}`}>
                      {step.label}
                    </span>

                    {/* Small vertical connector arrow for mobile screen widths */}
                    {idx < 7 && (
                      <div className="xl:hidden my-4">
                        <ArrowDown className="w-4 h-4 text-slate-800" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Injected CSS Animations for custom flowing gradient background */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes pulseGlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}} />
      </section>

      {/* Why DatumIQ Section */}
      <section id="why" className="py-24 border-t border-slate-900 bg-slate-950/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider font-bold">The DatumIQ Edge</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mt-2 mb-4">
              Why Decision Makers Choose DatumIQ
            </h2>
            <p className="text-slate-400 text-sm">
              Moving beyond descriptive charts. Get secure, trace-audited recommendations backed by deterministic python execution engines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-slate-900/10 border border-slate-900 hover:border-slate-800 transition-all flex flex-col gap-4 text-left">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 border-t border-slate-900 bg-slate-950 relative">
        <div className="max-w-4xl mx-auto text-center px-4">
          <Compass className="w-12 h-12 text-blue-500 mx-auto mb-6 animate-spin-slow" />
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white mb-6">
            Turn your next dataset into a decision.
          </h2>
          <p className="text-slate-400 text-base mb-8 max-w-xl mx-auto">
            Start with your last quarterly export. Get your first comprehensive executive audit in under 180 seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all cursor-pointer"
            >
              Start Analysis
            </button>
            <button 
              onClick={onSignIn}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl transition-all cursor-pointer"
            >
              Sign in
            </button>
          </div>
          <p className="mt-4 text-xs font-mono text-slate-500">
            No integration required • Pure self-service CSV analytics
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900/80 bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <DatumIQLogo showText={true} size={28} />
          </div>
          <div>
            © 2026 DatumIQ, Inc. All rights reserved. Built for teams that move on evidence.
          </div>
          <div className="flex gap-6">
            <a href="#landing-page" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#landing-page" className="hover:text-slate-300 transition-colors">Terms</a>
            <a href="#landing-page" className="hover:text-slate-300 transition-colors">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
