/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  LayoutDashboard, UploadCloud, HelpCircle, Settings, 
  BarChart3, Lightbulb, Compass, FileText, Sparkles, AlertCircle
} from "lucide-react";
import { UserProfile } from "../types";
import DatumIQLogo from "./DatumIQLogo";

export type TabId = 
  | "dashboard" 
  | "upload" 
  | "ask" 
  | "processing" 
  | "analytics" 
  | "insights" 
  | "recommendations" 
  | "report" 
  | "settings" 
  | "help";

interface SidebarProps {
  currentTab: TabId;
  onTabChange: (tab: TabId) => void;
  user: UserProfile;
  onSignOut: () => void;
}

export default function Sidebar({ currentTab, onTabChange, user, onSignOut }: SidebarProps) {
  const sections = [
    {
      title: "Workspace",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "upload", label: "Upload dataset", icon: UploadCloud },
        { id: "ask", label: "Ask a question", icon: HelpCircle },
        { id: "processing", label: "Agent runs", icon: Compass, badge: "Live" }
      ]
    },
    {
      title: "Insights",
      items: [
        { id: "analytics", label: "Analytics", icon: BarChart3 },
        { id: "insights", label: "AI Insights", icon: Lightbulb },
        { id: "recommendations", label: "Recommendations", icon: Sparkles },
        { id: "report", label: "Executive report", icon: FileText }
      ]
    },
    {
      title: "Account",
      items: [
        { id: "settings", label: "Settings", icon: Settings },
        { id: "help", label: "Help center", icon: HelpCircle }
      ]
    }
  ];

  return (
    <aside id="sidebar" className="w-64 border-r border-slate-900 bg-slate-950 flex flex-col justify-between h-screen sticky top-0 shrink-0">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-900 flex items-center">
          <DatumIQLogo size={28} />
        </div>

        {/* Navigation items */}
        <nav className="p-4 space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="space-y-1.5">
              <h4 className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{section.title}</h4>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const IconComp = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => onTabChange(item.id as TabId)}
                        className={`w-full px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between transition-all ${
                          isActive 
                            ? "bg-blue-600/10 border border-blue-500/20 text-blue-400" 
                            : "border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <IconComp className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400 font-mono tracking-wider animate-pulse">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-slate-900 space-y-4">
        {/* User Card */}
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-semibold text-sm flex items-center justify-center border border-indigo-500/30 shadow-inner">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-semibold text-white truncate">{user.firstName} {user.lastName}</span>
              <span className="block text-[10px] font-mono text-slate-500 truncate">{user.company}</span>
            </div>
          </div>
          <button 
            onClick={onSignOut}
            className="text-[10px] font-mono text-slate-500 hover:text-rose-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
