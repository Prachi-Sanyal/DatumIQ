/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { UserProfile, AnalysisTask, DatasetMetadata } from "./types";
import { TabId } from "./components/Sidebar";
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

export default function App() {
  const [appLoading, setAppLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "signup" | "forgot" | null>(null);
  const [currentTab, setCurrentTab] = useState<TabId>("dashboard");
  
  const [tasks, setTasks] = useState<AnalysisTask[]>([]);
  const [datasets, setDatasets] = useState<DatasetMetadata[]>([]);
  const [activeTask, setActiveTask] = useState<AnalysisTask | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedDataset, setUploadedDataset] = useState<DatasetMetadata | null>(null);

  const filteredTasks = React.useMemo(() => {
    if (!searchQuery) return tasks;
    const query = searchQuery.toLowerCase();
    return tasks.filter(task => 
      task.question.toLowerCase().includes(query) ||
      task.results?.report?.title?.toLowerCase().includes(query) ||
      task.results?.report?.executiveSummary?.toLowerCase().includes(query)
    );
  }, [tasks, searchQuery]);

  const filteredDatasets = React.useMemo(() => {
    if (!searchQuery) return datasets;
    const query = searchQuery.toLowerCase();
    return datasets.filter(dataset => 
      (dataset.filename || dataset.fileName || "").toLowerCase().includes(query)
    );
  }, [datasets, searchQuery]);

  const filteredActiveTask = React.useMemo(() => {
    if (!activeTask) return null;
    if (!searchQuery) return activeTask;

    const query = searchQuery.toLowerCase();
    const matchesQuery = (text?: string) => text?.toLowerCase().includes(query) ?? false;

    const filteredInsights = activeTask.results?.insights?.filter((ins: any) => 
      matchesQuery(ins.title) || matchesQuery(ins.description) || matchesQuery(ins.details)
    ) || [];

    const filteredRecommendations = activeTask.results?.recommendations?.filter((rec: any) => 
      matchesQuery(rec.title) || matchesQuery(rec.description)
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!token) return;

    fetch("http://127.0.0.1:8000/api/me",{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    .then(res=>{
        if(!res.ok) throw new Error();
        return res.json();
    })
    .then(user=>{
        setUser({
            firstName:user.first_name,
            lastName:user.last_name,
            email:user.email,
            company:user.company
        });
    })
    .catch(()=>{
        localStorage.removeItem("token");
    });
  }, []);

  const handleAuthSuccess = (profile: UserProfile) => {
    setUser(profile);
    setAuthMode(null);
    setCurrentTab("dashboard");
  };

  const handleNewAnalysis = () => {
    setCurrentTab("upload");
  };

  const handleSelectTask = (task: AnalysisTask) => {
    setActiveTask(task);
    setCurrentTab("analytics");
  };

  const handleStartLanding = () => {
    setAuthMode("signup");
  };

  const handleDatasetSelected = (ds: DatasetMetadata) => {
    setCurrentTab("ask");
  };

  const handleWorkflowComplete = (task: AnalysisTask) => {
    setTasks(prev => [task, ...prev]);
    setActiveTask(task);
    setCurrentTab("analytics");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFileUpload = async (file: File) => {
  setIsUploading(true);
  setUploadProgress(10);
  
  try {
    const token = localStorage.getItem("token") || "";
    const formData = new FormData();
    formData.append("file", file);

    // 1. Pura direct backend api endpoint call karein upload ke liye
    const response = await fetch("http://127.0.0.1:8000/api/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error("File upload failed on server");
    }

    // 2. Real dataset info jo backend se return hui hai use parse karein
    const serverDataset = await response.json(); 
    // serverDataset ke paas ab real 'id', 'filename', aur 'file_size_bytes' hai!

    const dynamicMetadata: DatasetMetadata = {
      id: serverDataset.id, // ⚡ Random hatao! Asli Database wali ID yahan aayegi
      fileName: serverDataset.filename,
      filename: serverDataset.filename,
      fileSize: `${(serverDataset.file_size_bytes / (1024 * 1024)).toFixed(2)} MB`,
      rowsCount: 0,
      columnsCount: 0,
      columns: []
    };
    
    setUploadProgress(100);
    setUploadedDataset(dynamicMetadata);
    setDatasets(prev => [dynamicMetadata, ...prev]);
    
    setTimeout(() => {
      setIsUploading(false);
      setCurrentTab("ask");
    }, 400);

  } catch (error) {
    console.error("Upload error details:", error);
    setIsUploading(false);
  }
};
  const handleResetDataset = () => {
    setUploadedDataset(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  const renderHelpCenter = () => {
    const faqs = [
      { q: "What file types does DatumIQ support?", a: "We support CSV, Excel (XLSX, XLS), and Parquet files natively up to 250MB." },
      { q: "Is my data used to train models?", a: "Absolutely not. Your data remains local and sandboxed inside secure container instances." },
      { q: "How accurate are the AI agents?", a: "DatumIQ utilizes multi-agent consensus protocols executing pure deterministic scripts directly on your data matrix." }
    ];

    return (
      <div className="space-y-6 text-left max-w-4xl mx-auto">
        <div>
          <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-widest">FAQ & Documentation</span>
          <h2 className="font-display font-bold text-2xl text-white mt-1">How can we help?</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-5 rounded-xl border border-slate-900 bg-slate-950 space-y-2">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                {faq.q}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!user && !authMode) {
    return (
      <LandingPage 
        onStart={handleStartLanding} 
        onSignIn={() => setAuthMode("login")} 
      />
    );
  }

  if (authMode) {
    return (
      <AuthPages 
        initialMode={authMode} 
        onSuccess={handleAuthSuccess} 
        onBackToLanding={() => setAuthMode(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans select-none">
      <Sidebar 
        currentTab={currentTab} 
        onTabChange={(tab) => setCurrentTab(tab)} 
        user={user!} 
        onSignOut={() => {
          localStorage.removeItem("token");
          setUser(null);
        }}      
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          user={user!} 
          onNewAnalysis={handleNewAnalysis} 
          onSearch={handleSearch} 
        />

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
              onFileUpload={handleFileUpload}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              currentDataset={uploadedDataset}
              onResetDataset={handleResetDataset}
            />
          )}

          {currentTab === "ask" && (
            <AiProcessing 
              onWorkflowComplete={handleWorkflowComplete} 
              datasetId={uploadedDataset ? (uploadedDataset.id || uploadedDataset.fileName) : ""} 
            />
          )}

          {currentTab === "processing" && (
            <AiProcessing 
              onWorkflowComplete={handleWorkflowComplete} 
              datasetId={uploadedDataset ? (uploadedDataset.id || uploadedDataset.fileName) : ""} 
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
              task={filteredActiveTask} 
              onNavigateToRecommendations={() => setCurrentTab("recommendations")} 
            />
          )}

          {currentTab === "recommendations" && filteredActiveTask && (
            <Recommendations 
              task={filteredActiveTask} 
              onNavigateToReport={() => setCurrentTab("report")} 
            />
          )}

          {currentTab === "report" && filteredActiveTask && (
            <Reports 
              task={filteredActiveTask} 
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