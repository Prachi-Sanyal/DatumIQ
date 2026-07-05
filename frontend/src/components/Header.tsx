/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Plus, Sparkles, Laptop, ShieldCheck, Cpu } from "lucide-react";
import { UserProfile } from "../types";

interface HeaderProps {
  user: UserProfile;
  onNewAnalysis: () => void;
  onSearch: (query: string) => void;
}

export default function Header({ user, onNewAnalysis, onSearch }: HeaderProps) {
  const [searchVal, setSearchVal] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className="h-16 border-b border-slate-900 bg-slate-950 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Search Input bar */}
      <div className="w-96 relative">
        <input 
          type="text"
          value={searchVal}
          onChange={handleSearchChange}
          placeholder="Search datasets, insights, reports..."
          className="w-full bg-slate-900/60 border border-slate-800/80 focus:border-blue-500/80 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-200 focus:outline-none transition-all placeholder:text-slate-500"
        />
        <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
      </div>

      {/* Action / Indicators panel */}
      <div className="flex items-center gap-5">
        {/* Multi-agent Status Badges */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold font-mono text-blue-400">
            <Cpu className="w-3 h-3" /> Gemini Powered
          </div>
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold font-mono text-purple-400">
            <Sparkles className="w-3 h-3" /> Multi-Agent
          </div>
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold font-mono text-emerald-400">
            <ShieldCheck className="w-3 h-3" /> Privacy Checked
          </div>
        </div>

        {/* New analysis button */}
        <button
          onClick={onNewAnalysis}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-lg shadow-lg shadow-blue-500/15 hover:shadow-blue-500/30 transition-all flex items-center gap-1.5 group"
        >
          <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
          <span>New analysis</span>
        </button>

        {/* User initials widget */}
        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center border border-indigo-500/20 shadow">
          {user.firstName[0]}{user.lastName[0]}
        </div>
      </div>
    </header>
  );
}
