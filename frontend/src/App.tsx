/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { UserProfile, AnalysisTask, DatasetMetadata } from "./types";
import { TabId } from "./components/Sidebar";
import { MOCK_TASKS, SAMPLE_DATASETS } from "./mockData";
import LandingPage from "./components/LandingPage";
import AuthPages from "./components/AuthPages";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import UploadDataset from "./components/UploadDataset";
import AiProcessing from "./components/AiProcessing";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import AiInsights from "./components/AiInsights";
import Recommendations from "./components/Recommendations";
import Reports from "./components/Reports";
import Settings from "./components/Settings";
import DatumIQLogo from "./components/DatumIQLogo";
import { 
  Compass, HelpCircle, FileText, ChevronDown, CheckCircle, Clock 
} from "lucide-react";

export default function App() {
  const [appLoading, setAppLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "signup" | "forgot" | null>(null);
  const [currentTab, setCurrentTab] = useState<TabId>("dashboard");
  const [tasks, setTasks] = useState<AnalysisTask[]>(MOCK_TASKS);
  const [datasets, setDatasets] = useState<DatasetMetadata[]>(SAMPLE_DATASETS);
  
  // Default to pre-analyzed task 1 so the tabs are fully populated on start
  const [activeTask, setActiveTask] = useState<AnalysisTask | null>(MOCK_TASKS[0]);
  const [searchQuery, setSearchQuery] = useState("");

  // Compute filtered tasks and datasets
  const filteredTasks = React.useMemo(() => {
    if (!searchQuery) return tasks;
    const query = searchQuery.toLowerCase();
    return tasks.filter(task => 
      task.question.toLowerCase().includes(query) ||
      task.results?.report?.title?.toLowerCase().includes(query) ||
      task.results?.report?.executiveSummary?.toLowerCase().includes(query) ||
      task.steps?.some(step => step.name.toLowerCase().includes(query) || step.message.toLowerCase().includes(query))
    );
  }, [tasks, searchQuery]);

  const filteredDatasets = React.useMemo(() => {
    if (!searchQuery) return datasets;
    const query = searchQuery.toLowerCase();
    return datasets.filter(dataset => 
      dataset.fileName.toLowerCase().includes(query) ||
      dataset.columns.some(col => col.name.toLowerCase().includes(query))
    );
  }, [datasets, searchQuery]);

  // Filter activeTask based on searchQuery for Reports, Insights, and Recommendations
  const filteredActiveTask = React.useMemo(() => {
    if (!activeTask) return null;
    if (!searchQuery) return activeTask;

    const query = searchQuery.toLowerCase();
    const matchesQuery = (text?: string) => text?.toLowerCase().includes(query) ?? false;

    // Filter insights
    const filteredInsights = activeTask.results?.insights.filter(ins => 
      matchesQuery(ins.title) || 
      matchesQuery(ins.description) || 
      matchesQuery(ins.details) || 
      matchesQuery(ins.agent)
    ) || [];

    // Filter recommendations
    const filteredRecommendations = activeTask.results?.recommendations.filter(rec => 
      matchesQuery(rec.title) || 
      matchesQuery(rec.description) || 
      rec.actions.some(act => matchesQuery(act))
    ) || [];

    return {
      ...activeTask,
      results: activeTask.results ? {
        ...activeTask.results,
        insights: filteredInsights,
        recommendations: filteredRecommendations
      } : undefined
    };
  }, [activeTask, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (appLoading) {
    return (
      <div className="min-h-screen bg-[#060B1F] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-[120px]" />

        <div className="flex flex-col items-center max-w-sm w-full px-6 text-center space-y-6 z-10">
          {/* Logo container */}
          <div className="scale-125 transform mb-4 animate-pulse">
            <DatumIQLogo />
          </div>

          <div className="space-y-2 w-full">
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
              Initializing Data Intelligence Engine...
            </p>
            {/* Elegant loading bar */}
            <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full animate-loading-bar" 
                style={{
                  width: "100%",
                  animation: "loadingProgress 1.5s ease-in-out infinite"
                }} 
              />
            </div>
          </div>
        </div>

        {/* CSS Keyframes injected directly for the loadingProgress animation to be 100% reliable */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes loadingProgress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}} />
      </div>
    );
  }

  // Handle Auth success
  const handleAuthSuccess = (profile: UserProfile) => {
    setUser(profile);
    setAuthMode(null);
    setCurrentTab("dashboard");
  };

  // Quick Action triggers
  const handleNewAnalysis = () => {
    setCurrentTab("upload");
  };

  const handleSelectTask = (task: AnalysisTask) => {
    setActiveTask(task);
    setCurrentTab("analytics");
  };

  // Landing triggers
  const handleStartLanding = () => {
    setUser({
      firstName: "Alex",
      lastName: "Liu",
      email: "alex@acme.com",
      company: "Acme Inc."
    });
    setCurrentTab("dashboard");
  };

  // Dataset selected on step 1
  const handleDatasetSelected = (ds: DatasetMetadata) => {
    setCurrentTab("ask");
  };

  // Pipeline execution completes
  const handleWorkflowComplete = (task: AnalysisTask) => {
    setTasks(prev => [task, ...prev]);
    setActiveTask(task);
    setCurrentTab("analytics");
  };

  // Search filter implementation
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Filters are now computed up at the top level to adhere strictly to the Rules of Hooks.

  // Render help center FAQs matching page 9
  const renderHelpCenter = () => {
    const faqs = [
      { q: "What file types does DatumIQ support?", a: "We support CSV, Excel (XLSX, XLS), and Parquet files natively up to 250MB. Support for SQL databases and Google Sheets are coming soon on our enterprise plan." },
      { q: "Is my data used to train models?", a: "Absolutely not. Your data remains local and sandboxed inside secure container instances. Traces are instantly scrubbed from the active memory stack when your session terminates." },
      { q: "How accurate are the AI agents?", a: "DatumIQ utilizes multi-agent consensus protocols. Our Analysis Agent runs reproducible, audited Python execution strings directly on your data rather than guessing mathematical sums — guaranteeing 100% computational accuracy." },
      { q: "Can I export dashboards and reports?", a: "Yes. You can instantly export consulting-grade executive PDF reports containing compiled descriptive summaries and full strategic next-step recommendation matrices." }
    ];

    return (
      <div className="space-y-6 text-left max-w-4xl mx-auto">
        <div>
          <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-widest">FAQ & Documentation</span>
          <h2 className="font-display font-bold text-2xl text-white mt-1">How can we help?</h2>
          <p className="text-slate-400 text-sm mt-1">Search our guides, documentation, or get in touch with the core development team.</p>
        </div>

        {/* FAQ Cards */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-5 rounded-xl border border-slate-900 bg-slate-950 space-y-2">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-400" /> {faq.q}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 1. LANDING PAGE VIEW
  if (!user && !authMode) {
    return (
      <LandingPage 
        onStart={handleStartLanding} 
        onSignIn={() => setAuthMode("login")} 
      />
    );
  }

  // 2. AUTHENTICATION PAGES VIEW
  if (authMode) {
    return (
      <AuthPages 
        initialMode={authMode} 
        onSuccess={handleAuthSuccess} 
        onBackToLanding={() => setAuthMode(null)} 
      />
    );
  }

  // 3. LOGGED-IN PRIMARY PANEL LAYOUT
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans select-none">
      {/* Sidebar Wrapper */}
      <Sidebar 
        currentTab={currentTab} 
        onTabChange={(tab) => setCurrentTab(tab)} 
        user={user!} 
        onSignOut={() => setUser(null)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          user={user!} 
          onNewAnalysis={handleNewAnalysis} 
          onSearch={handleSearch} 
        />

        {/* Scrollable Panel Grid content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {currentTab === "dashboard" && (
            <Dashboard 
              tasks={filteredTasks} 
              datasets={filteredDatasets} 
              onNewAnalysis={handleNewAnalysis} 
              onSelectTask={handleSelectTask}
              onTabChange={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === "upload" && (
            <UploadDataset 
              onDatasetSelected={handleDatasetSelected} 
            />
          )}

          {currentTab === "ask" && (
            <AiProcessing 
              onWorkflowComplete={handleWorkflowComplete} 
              datasetId="sales_q3_2026" 
            />
          )}

          {currentTab === "processing" && (
            <AiProcessing 
              onWorkflowComplete={handleWorkflowComplete} 
              datasetId="sales_q3_2026" 
            />
          )}

          {currentTab === "analytics" && activeTask && (
            <AnalyticsDashboard 
              results={activeTask.results!} 
              question={activeTask.question} 
            />
          )}

          {currentTab === "insights" && filteredActiveTask && (
            <AiInsights 
              results={filteredActiveTask.results!} 
              onNavigateToRecommendations={() => setCurrentTab("recommendations")} 
            />
          )}

          {currentTab === "recommendations" && filteredActiveTask && (
            <Recommendations 
              results={filteredActiveTask.results!} 
              onNavigateToReport={() => setCurrentTab("report")} 
            />
          )}

          {currentTab === "report" && filteredActiveTask && (
            <Reports 
              results={filteredActiveTask.results!} 
            />
          )}

          {currentTab === "settings" && (
            <Settings 
              user={user!} 
              onUpdateUser={(updated) => setUser({ ...user!, ...updated })} 
            />
          )}

          {currentTab === "help" && renderHelpCenter()}
        </main>
      </div>
    </div>
  );
}
