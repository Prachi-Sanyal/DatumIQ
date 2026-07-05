/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  lightLogo?: boolean;
}

export default function DatumIQLogo({ className = "", size = 32, showText = true, lightLogo = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* SVG Icon using Blue, Purple, Green */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="logoBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="logoPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6D5EF5" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
          <linearGradient id="logoGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 3 Interlocking glowing nodes in Blue, Purple, Green representing Datasets, AI Agents and Analytics */}
        {/* Node 1: Left-bottom (Blue) */}
        <circle
          cx="32"
          cy="60"
          r="20"
          fill="url(#logoBlueGrad)"
          fillOpacity="0.85"
        />
        {/* Node 2: Top (Purple) */}
        <circle
          cx="50"
          cy="32"
          r="20"
          fill="url(#logoPurpleGrad)"
          fillOpacity="0.85"
        />
        {/* Node 3: Right-bottom (Green) */}
        <circle
          cx="68"
          cy="60"
          r="20"
          fill="url(#logoGreenGrad)"
          fillOpacity="0.85"
        />

        {/* Central connecting core node */}
        <circle
          cx="50"
          cy="54"
          r="8"
          fill="#FFFFFF"
          filter="url(#logoGlow)"
        />

        {/* Interconnecting data neural lines */}
        <line x1="32" y1="60" x2="50" y2="32" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <line x1="50" y1="32" x2="68" y2="60" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <line x1="32" y1="60" x2="68" y2="60" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <line x1="32" y1="60" x2="50" y2="54" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
        <line x1="50" y1="32" x2="50" y2="54" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
        <line x1="68" y1="60" x2="50" y2="54" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
      </svg>
      
      {showText && (
        <div className="text-left leading-none">
          <span className={`font-display font-extrabold text-lg tracking-tight ${lightLogo ? "text-slate-900" : "text-white"}`}>
            Datum<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">IQ</span>
          </span>
          <span className={`block text-[8px] font-mono tracking-widest uppercase mt-0.5 ${lightLogo ? "text-slate-500" : "text-slate-400"}`}>
            FROM DATA TO DECISIONS
          </span>
        </div>
      )}
    </div>
  );
}
