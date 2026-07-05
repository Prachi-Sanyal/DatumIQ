/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Mail, Lock, ArrowLeft, Chrome, ShieldAlert, Sparkles, User, Building2 } from "lucide-react";
import { UserProfile } from "../types";
import DatumIQLogo from "./DatumIQLogo";

interface AuthPagesProps {
  initialMode: "login" | "signup" | "forgot";
  onSuccess: (profile: UserProfile) => void;
  onBackToLanding: () => void;
}

export default function AuthPages({ initialMode, onSuccess, onBackToLanding }: AuthPagesProps) {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">(initialMode);
  
  // Form fields
  const [firstName, setFirstName] = useState("Alex");
  const [lastName, setLastName] = useState("Liu");
  const [email, setEmail] = useState("alex@acme.com");
  const [company, setCompany] = useState("Acme Inc.");
  const [password, setPassword] = useState("password123");
  const [keepMeSignedIn, setKeepMeSignedIn] = useState(true);

  // Password checklist state (for signup)
  const isEightChars = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess({
      firstName,
      lastName,
      email,
      company,
      avatarUrl: undefined,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex">
      {/* Left Form Pane */}
      <div className="w-full lg:w-[45%] flex flex-col justify-between p-8 sm:p-12 md:p-16 relative">
        {/* Top Header */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={onBackToLanding}>
          <DatumIQLogo showText={true} size={28} />
        </div>

        {/* Center Card */}
        <div className="max-w-md w-full mx-auto my-auto py-12">
          {mode === "login" && (
            <div>
              <h2 className="font-display font-bold text-3xl tracking-tight text-white mb-2">Welcome back</h2>
              <p className="text-sm text-slate-400 mb-8">Sign in to your workspace to continue.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Work email</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com" 
                      className="w-full bg-slate-900/60 border border-slate-800 focus:border-blue-500 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Password</label>
                    <button 
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-slate-900/60 border border-slate-800 focus:border-blue-500 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  </div>
                </div>

                <div className="flex items-center gap-2 py-1">
                  <input 
                    type="checkbox" 
                    id="keep-signed-in"
                    checked={keepMeSignedIn}
                    onChange={(e) => setKeepMeSignedIn(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-800 text-blue-500 focus:ring-0 focus:ring-offset-0 w-4 h-4"
                  />
                  <label htmlFor="keep-signed-in" className="text-xs text-slate-400 cursor-pointer select-none">
                    Keep me signed in for 30 days
                  </label>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-sm font-semibold text-white rounded-lg shadow-lg shadow-blue-500/10 transition-all"
                >
                  Sign in
                </button>
              </form>

              <div className="relative my-6 text-center">
                <span className="absolute inset-x-0 top-3 h-[1px] bg-slate-900" />
                <span className="relative bg-slate-950 px-3 text-xs text-slate-500 uppercase tracking-widest">or continue with</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={handleSubmit}
                  className="flex items-center justify-center gap-2 py-2.5 border border-slate-800 hover:bg-slate-900 rounded-lg text-xs text-slate-300 font-medium transition-colors"
                >
                  <Chrome className="w-4 h-4 text-red-400" /> Google
                </button>
                <button 
                  type="button"
                  onClick={handleSubmit}
                  className="flex items-center justify-center gap-2 py-2.5 border border-slate-800 hover:bg-slate-900 rounded-lg text-xs text-slate-300 font-medium transition-colors"
                >
                  <Building2 className="w-4 h-4 text-blue-400" /> SSO
                </button>
              </div>

              <p className="mt-8 text-center text-xs text-slate-500">
                Don't have an account?{" "}
                <button 
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Create one
                </button>
              </p>
            </div>
          )}

          {mode === "signup" && (
            <div>
              <h2 className="font-display font-bold text-3xl tracking-tight text-white mb-2">Create your workspace</h2>
              <p className="text-sm text-slate-400 mb-6">Create your enterprise-grade secure workspace instantly.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">First name</label>
                    <input 
                      type="text" 
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Alex" 
                      className="w-full bg-slate-900/60 border border-slate-800 focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Last name</label>
                    <input 
                      type="text" 
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Liu" 
                      className="w-full bg-slate-900/60 border border-slate-800 focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Work email</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com" 
                      className="w-full bg-slate-900/60 border border-slate-800 focus:border-blue-500 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none"
                    />
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Company</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Acme Inc." 
                      className="w-full bg-slate-900/60 border border-slate-800 focus:border-blue-500 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none"
                    />
                    <Building2 className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Password</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-slate-900/60 border border-slate-800 focus:border-blue-500 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none"
                    />
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  </div>
                </div>

                {/* Password Strength Checklist */}
                <div className="space-y-1.5 py-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`w-1.5 h-1.5 rounded-full ${isEightChars ? "bg-emerald-500" : "bg-slate-700"}`} />
                    <span className={isEightChars ? "text-emerald-400" : "text-slate-500"}>8+ characters</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`w-1.5 h-1.5 rounded-full ${hasUppercase ? "bg-emerald-500" : "bg-slate-700"}`} />
                    <span className={hasUppercase ? "text-emerald-400" : "text-slate-500"}>One uppercase letter</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`w-1.5 h-1.5 rounded-full ${hasNumber ? "bg-emerald-500" : "bg-slate-700"}`} />
                    <span className={hasNumber ? "text-emerald-400" : "text-slate-500"}>One number</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-sm font-semibold text-white rounded-lg shadow-lg shadow-blue-500/10 transition-all"
                >
                  Create workspace
                </button>
              </form>

              <div className="relative my-6 text-center">
                <span className="absolute inset-x-0 top-3 h-[1px] bg-slate-900" />
                <span className="relative bg-slate-950 px-3 text-xs text-slate-500 uppercase tracking-widest">or</span>
              </div>

              <button 
                type="button"
                onClick={handleSubmit}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-800 hover:bg-slate-900 rounded-lg text-xs text-slate-300 font-medium transition-colors"
              >
                <Chrome className="w-4 h-4 text-red-400" /> Continue with Google
              </button>

              <p className="mt-4 text-[10px] text-slate-500 leading-relaxed text-center">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </p>

              <p className="mt-6 text-center text-xs text-slate-500">
                Already have an account?{" "}
                <button 
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}

          {mode === "forgot" && (
            <div>
              <h2 className="font-display font-bold text-3xl tracking-tight text-white mb-2">Reset your password</h2>
              <p className="text-sm text-slate-400 mb-8">Enter the email tied to your workspace. We'll send you a secure link.</p>

              <form onSubmit={(e) => { e.preventDefault(); alert("Reset link sent! In this MVP, you can now return to login."); setMode("login"); }} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Email</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com" 
                      className="w-full bg-slate-900/60 border border-slate-800 focus:border-blue-500 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none"
                    />
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-sm font-semibold text-white rounded-lg shadow-lg shadow-blue-500/10 transition-all"
                >
                  Send reset link
                </button>

                <div className="text-center pt-2">
                  <button 
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 mx-auto"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-[11px] text-slate-600 flex items-center justify-between">
          <span>© 2026 DatumIQ, Inc.</span>
          <span className="flex items-center gap-1 text-emerald-500/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live agent workspace
          </span>
        </div>
      </div>

      {/* Right Testimonial/Graphic Pane (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-[55%] bg-slate-900/50 border-l border-slate-900 relative flex-col justify-between p-16 overflow-hidden">
        {/* Subtle background tech matrix graphics */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
        <div className="absolute top-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex items-center justify-center relative z-10 w-fit">
          <DatumIQLogo showText={false} size={44} />
        </div>

        <div className="relative z-10 max-w-lg my-auto flex flex-col gap-8">
          {/* Main big testimonial */}
          <div>
            <div className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Customer validation
            </div>
            <blockquote className="text-2xl font-display font-medium text-slate-100 leading-relaxed mb-4">
              "DatumIQ collapsed our monthly board prep from three days to twenty minutes."
            </blockquote>
            <cite className="not-italic text-sm text-slate-400 block">
              <strong className="text-slate-200">Sofia Álvarez</strong> — CFO at Helio Group
            </cite>
          </div>

          {/* Quick Metrics display matching mockup */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Q3 Revenue</span>
              <div className="text-lg font-bold text-white mt-1">$4.82M</div>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">MoM Growth</span>
              <div className="text-lg font-bold text-emerald-400 mt-1">+18.4%</div>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Gross margin</span>
              <div className="text-lg font-bold text-white mt-1">62.1%</div>
            </div>
          </div>
        </div>

        {/* Empty lower spacer to balance layout */}
        <div className="h-10" />
      </div>
    </div>
  );
}
