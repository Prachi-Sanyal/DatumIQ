/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  User, Shield, Laptop, Bell, Database, Lock, Key, Check, Info 
} from "lucide-react";
import { UserProfile } from "../types";

interface SettingsProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
}

export default function Settings({ user, onUpdateUser }: SettingsProps) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [company, setCompany] = useState(user.company);
  const [geminiKey, setGeminiKey] = useState("••••••••••••••••••••••••••••");
  
  const [activeTab, setActiveTab] = useState<"profile" | "appearance" | "notifications" | "connectors" | "api">("profile");
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      firstName,
      lastName,
      email,
      company,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div id="settings-view" className="space-y-6 text-left max-w-4xl mx-auto">
      <div>
        <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-widest">Account & Settings</span>
        <h2 className="font-display font-bold text-2xl text-white mt-1">Settings</h2>
        <p className="text-slate-400 text-sm mt-1">Manage your profile, workspace connections, and API integrations.</p>
      </div>

      {/* Selector tabs */}
      <div className="flex border-b border-slate-900 text-xs font-mono">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 px-4 font-bold border-b-2 transition-all ${
            activeTab === "profile" ? "border-blue-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("appearance")}
          className={`pb-3 px-4 font-bold border-b-2 transition-all ${
            activeTab === "appearance" ? "border-blue-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          Appearance
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`pb-3 px-4 font-bold border-b-2 transition-all ${
            activeTab === "notifications" ? "border-blue-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab("connectors")}
          className={`pb-3 px-4 font-bold border-b-2 transition-all ${
            activeTab === "connectors" ? "border-blue-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          Connectors
        </button>
        <button
          onClick={() => setActiveTab("api")}
          className={`pb-3 px-4 font-bold border-b-2 transition-all ${
            activeTab === "api" ? "border-blue-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          API Config
        </button>
      </div>

      {/* Main card panel */}
      <div className="p-6 border border-slate-850 bg-slate-950 rounded-2xl">
        {activeTab === "profile" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center border border-indigo-500/30">
                {firstName[0]}{lastName[0]}
              </div>
              <button 
                type="button" 
                onClick={() => alert("Avatar updates coming soon!")}
                className="px-3.5 py-1.5 border border-slate-800 hover:bg-slate-900 text-xs font-semibold text-slate-300 rounded-lg transition-colors"
              >
                Change avatar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">First Name</label>
                <input 
                  type="text" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                  className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Last Name</label>
                <input 
                  type="text" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                  className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Work Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-xs text-slate-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Company</label>
                <input 
                  type="text" 
                  value={company} 
                  onChange={(e) => setCompany(e.target.value)} 
                  className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-900 pt-5">
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-lg flex items-center gap-1.5 shadow"
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{isSaved ? "Saved Changes" : "Save Changes"}</span>
              </button>
            </div>
          </form>
        )}

        {activeTab === "appearance" && (
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-white">Appearance Theme</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Choose your visual aesthetic theme. DatumIQ is crafted with slate-colored dark elements by default.</p>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-blue-500/40 bg-slate-900/40 text-center cursor-pointer">
                <div className="w-full h-12 bg-slate-950 rounded-lg border border-slate-900 flex items-center justify-center mb-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <span className="text-xs font-semibold text-white">Slate Dark</span>
              </div>
              
              <div className="p-4 rounded-xl border border-slate-900 hover:border-slate-800 text-center cursor-pointer opacity-55" onClick={() => alert("Theme selection disabled for MVP baseline consistency.")}>
                <div className="w-full h-12 bg-slate-100 rounded-lg border border-slate-300 flex items-center justify-center mb-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <span className="text-xs font-semibold text-slate-400">Slate Light</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-900 hover:border-slate-800 text-center cursor-pointer opacity-55" onClick={() => alert("Theme selection disabled for MVP baseline consistency.")}>
                <div className="w-full h-12 bg-slate-900 rounded-lg border border-slate-900 flex items-center justify-center gap-1 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                </div>
                <span className="text-xs font-semibold text-slate-400">Cosmic Twilight</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-white">Email Alerts & Subscriptions</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Select what automated notification outputs your agent board compiles.</p>

            <div className="space-y-3.5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-slate-900 border-slate-800 text-blue-500 focus:ring-0 w-4 h-4 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-white block">Analytical alert flags</span>
                  <span className="text-[10px] text-slate-500 block leading-relaxed">Notify when statistical anomalies or price impacts cross standard 15% delta.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-slate-900 border-slate-800 text-blue-500 focus:ring-0 w-4 h-4 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-white block">PDF compiled reports</span>
                  <span className="text-[10px] text-slate-500 block leading-relaxed">Email consulting-grade board-ready reports automatically upon workflow complete.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="rounded bg-slate-900 border-slate-800 text-blue-500 focus:ring-0 w-4 h-4 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-slate-300 block">Weekly progress summaries</span>
                  <span className="text-[10px] text-slate-500 block leading-relaxed">Send high-level descriptive charts compiling weekly SaaS progress indicators.</span>
                </div>
              </label>
            </div>
          </div>
        )}

        {activeTab === "connectors" && (
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-white">Connected Warehouses</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Manage live write-isolated database connection drivers.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-900 bg-slate-950 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Snowflake Ingestion</span>
                  <span className="text-[9px] font-mono text-slate-500 uppercase mt-0.5 block">NOT CONFIGURED</span>
                </div>
                <button onClick={() => alert("Snowflake coming soon!")} className="text-xs text-blue-400 hover:text-blue-300 font-semibold">Connect</button>
              </div>

              <div className="p-4 rounded-xl border border-slate-900 bg-slate-950 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Google BigQuery</span>
                  <span className="text-[9px] font-mono text-slate-500 uppercase mt-0.5 block">NOT CONFIGURED</span>
                </div>
                <button onClick={() => alert("BigQuery coming soon!")} className="text-xs text-blue-400 hover:text-blue-300 font-semibold">Connect</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "api" && (
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-white">API Key Configurations</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Access and manage the secret Gemini credentials for running reasoning loops.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Gemini API Key</label>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    readOnly
                    value={geminiKey}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg py-2.5 px-3.5 text-xs text-slate-400 select-all font-mono"
                  />
                  <button 
                    type="button" 
                    onClick={() => alert("Keys are configured securely on the backend environment!")}
                    className="px-3.5 py-2 border border-slate-800 hover:bg-slate-900 text-xs font-semibold text-slate-300 rounded-lg transition-colors"
                  >
                    Reveal Key
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1 leading-relaxed">
                  <Info className="w-3.5 h-3.5 shrink-0" /> Inject GEMINI_API_KEY into your .env.example file to secure server-side execution.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
