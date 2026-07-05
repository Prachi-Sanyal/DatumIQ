/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend, LineChart, Line
} from "recharts";
import { 
  TrendingUp, TrendingDown, Info, SlidersHorizontal, Share2, 
  Download, Sparkles, AlertCircle, HelpCircle, ArrowRight
} from "lucide-react";
import { AnalysisResults } from "../types";

interface AnalyticsDashboardProps {
  results: AnalysisResults;
  question: string;
}

export default function AnalyticsDashboard({ results, question }: AnalyticsDashboardProps) {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedSegment, setSelectedSegment] = useState("all");

  const colors = ["#1e3b8b", "#3b82f6", "#10b981", "#ef4444"];

  // Custom cohort heat tile colors
  const getCohortColor = (value: number) => {
    if (value >= 90) return "bg-blue-600/90 text-white";
    if (value >= 80) return "bg-blue-500/80 text-blue-100";
    if (value >= 70) return "bg-indigo-500/70 text-indigo-100";
    if (value >= 65) return "bg-indigo-600/50 text-slate-300";
    if (value >= 60) return "bg-indigo-700/30 text-slate-400";
    return "bg-slate-900 text-slate-500";
  };

  return (
    <div id="analytics-view" className="space-y-8 text-left">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-widest">Executive Analytics</span>
          <h2 className="font-display font-bold text-2xl text-white mt-1">EMEA Revenue Anomaly Analysis</h2>
          <p className="text-slate-400 text-xs mt-0.5">Composed by the Visualization Agent • Confidence 97%</p>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => alert("Filters applied!")}
            className="px-3.5 py-1.5 border border-slate-800 hover:bg-slate-900 rounded-lg text-xs font-semibold text-slate-300 flex items-center gap-2"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
          </button>
          <button 
            onClick={() => alert("Report shared!")}
            className="px-3.5 py-1.5 border border-slate-800 hover:bg-slate-900 rounded-lg text-xs font-semibold text-slate-300 flex items-center gap-2"
          >
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
          <button 
            onClick={() => alert("Exported successfully!")}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/10"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* 1. KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue Card */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-850">
          <span className="text-xs text-slate-500 font-medium">Revenue</span>
          <div className="text-3xl font-extrabold text-white mt-1">{results.summary.revenue.value}</div>
          <span className="text-xs text-emerald-400 font-semibold font-mono mt-1.5 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> {results.summary.revenue.change} <span className="text-slate-500">vs model</span>
          </span>
        </div>

        {/* Profit Card */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-850">
          <span className="text-xs text-slate-500 font-medium">Profit</span>
          <div className="text-3xl font-extrabold text-white mt-1">{results.summary.profit.value}</div>
          <span className="text-xs text-emerald-400 font-semibold font-mono mt-1.5 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> {results.summary.profit.change} <span className="text-slate-500">vs model</span>
          </span>
        </div>

        {/* Growth Card */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-850">
          <span className="text-xs text-slate-500 font-medium">Growth</span>
          <div className="text-3xl font-extrabold text-white mt-1">{results.summary.growth.value}</div>
          <span className="text-xs text-emerald-400 font-semibold font-mono mt-1.5 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> {results.summary.growth.change} <span className="text-slate-500">vs model</span>
          </span>
        </div>

        {/* Active Accounts Card */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-850">
          <span className="text-xs text-slate-500 font-medium">Active accounts</span>
          <div className="text-3xl font-extrabold text-white mt-1">{results.summary.activeCustomers.value}</div>
          <span className="text-xs text-rose-400 font-semibold font-mono mt-1.5 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" /> {results.summary.activeCustomers.change} <span className="text-slate-500">vs target</span>
          </span>
        </div>
      </div>

      {/* 2. Top Charts Row: Revenue Trend Area & Segment Mix Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Area chart */}
        <div className="lg:col-span-2 p-5 border border-slate-850 bg-slate-950 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white text-sm">Revenue vs profit</h3>
              <p className="text-xs text-slate-500 mt-0.5">Monthly transactional volumes over the last 12 months</p>
            </div>
            <span className="text-[10px] font-mono text-slate-500">USD Thousands</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={results.charts.revenueTrend}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" />
                <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "8px", color: "#f1f5f9", fontSize: "11px" }} />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Segment Mix Ring/Pie Chart */}
        <div className="p-5 border border-slate-850 bg-slate-950 rounded-2xl space-y-4">
          <div>
            <h3 className="font-semibold text-white text-sm">Segment mix</h3>
            <p className="text-xs text-slate-500 mt-0.5">Share of total subscription revenue</p>
          </div>

          <div className="h-48 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={results.charts.revenueSegment}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {results.charts.revenueSegment.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Summary Label */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Total</span>
              <span className="text-lg font-extrabold text-white">$1.08M</span>
            </div>
          </div>

          {/* Custom Labels list */}
          <div className="flex justify-around text-xs pt-2">
            {results.charts.revenueSegment.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }} />
                <span className="text-slate-400">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Lower Charts: Regional Bar, Discount Margin Scatter Grid, and Cohort Heatmap */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Regional bar chart */}
        <div className="p-5 border border-slate-850 bg-slate-950 rounded-2xl space-y-4">
          <div>
            <h3 className="font-semibold text-white text-sm">Revenue by region</h3>
            <p className="text-xs text-slate-500 mt-0.5">Total bookings across operational regions</p>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results.charts.revenueRegion}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" vertical={false} />
                <XAxis dataKey="region" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} tickFormatter={(v) => `$${v / 1000000}M`} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Discount vs Volume scatter mockup */}
        <div className="p-5 border border-slate-850 bg-slate-950 rounded-2xl space-y-4">
          <div>
            <h3 className="font-semibold text-white text-sm">Discount vs volume</h3>
            <p className="text-xs text-slate-500 mt-0.5">Correlation: high discount decreases margin</p>
          </div>

          {/* High quality customized Scatter visualization mockup to resemble Page 6 */}
          <div className="h-48 relative border border-slate-900 rounded-xl p-4 flex flex-col justify-between overflow-hidden">
            <span className="absolute top-2 right-2 text-[9px] font-mono text-slate-600">Per SKU • size = margin</span>
            
            <div className="flex-1 relative">
              {results.charts.discountVolume.map((item, idx) => (
                <div 
                  key={idx}
                  className="absolute w-2 h-2 rounded-full bg-blue-500/80 animate-pulse"
                  style={{
                    left: `${item.discount * 1.8}%`,
                    top: `${item.volume * 0.8}%`,
                    opacity: 0.6 + (item.margin / 100) * 0.4
                  }}
                />
              ))}
            </div>

            <div className="flex justify-between text-[9px] font-mono text-slate-500 border-t border-slate-900 pt-1.5">
              <span>0% Disc</span>
              <span>25% Disc</span>
              <span>50% Disc</span>
            </div>
          </div>
        </div>

        {/* Cohort Heatmap Heat Tile Grid */}
        <div className="p-5 border border-slate-850 bg-slate-950 rounded-2xl space-y-4">
          <div>
            <h3 className="font-semibold text-white text-sm">Cohort retention heatmap</h3>
            <p className="text-xs text-slate-500 mt-0.5">7 cohorts over 12 weeks retention rate %</p>
          </div>

          <div className="space-y-1.5">
            {results.charts.cohortRetention.map((cohort, idx) => (
              <div key={cohort.cohort} className="flex items-center gap-1 text-[10px]">
                <span className="w-16 truncate font-mono text-slate-500">{cohort.cohort}</span>
                <div className="flex-1 grid grid-cols-12 gap-[2px]">
                  {[cohort.week1, cohort.week2, cohort.week3, cohort.week4, cohort.week5, cohort.week6, cohort.week7, cohort.week8, cohort.week9, cohort.week10, cohort.week11, cohort.week12].map((val, wIdx) => (
                    <div 
                      key={wIdx} 
                      className={`h-4 text-[8px] font-mono rounded-[2px] flex items-center justify-center font-medium ${getCohortColor(val)}`}
                      title={`Week ${wIdx + 1}: ${val}%`}
                    >
                      {val}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 pl-16">
            <span>W1</span>
            <span>W6</span>
            <span>W12</span>
          </div>
        </div>
      </div>

      {/* 4. Forecast Section */}
      <div className="p-5 border border-slate-850 bg-slate-950 rounded-2xl space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-white text-sm">Forecast (next 6 months)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Point estimate with 95% confidence interval</p>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-1.5 rounded uppercase">MAPE 4.2%</span>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={results.charts.forecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" />
              <XAxis dataKey="month" stroke="#475569" fontSize={10} tickLine={false} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip />
              <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2.5} name="Actual" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="forecast" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" name="Forecast" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
