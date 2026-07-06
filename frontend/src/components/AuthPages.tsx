import React, { useState } from "react";
import { Mail, Lock, ArrowLeft, ShieldAlert, Sparkles, Building2 } from "lucide-react";
import { UserProfile } from "../types";
import DatumIQLogo from "./DatumIQLogo";
import { login as apiLogin, signup as apiSignup } from "../services/auth";

interface AuthPagesProps {
  initialMode: "login" | "signup" | "forgot";
  onSuccess: (profile: UserProfile) => void;
  onBackToLanding: () => void;
}

export default function AuthPages({ initialMode, onSuccess, onBackToLanding }: AuthPagesProps) {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">(initialMode);
  
  const [firstName, setFirstName] = useState("Alex");
  const [lastName, setLastName] = useState("Liu");
  const [email, setEmail] = useState("alex@acme.com");
  const [company, setCompany] = useState("Acme Inc.");
  const [password, setPassword] = useState("password123");
  const [keepMeSignedIn, setKeepMeSignedIn] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isEightChars = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === "login") {
        const data = await apiLogin(email, password);
        localStorage.setItem("token", data.access_token);
        
        onSuccess({
          firstName: data.user.first_name,
          lastName: data.user.last_name,
          email: data.user.email,
          company: data.user.company,
        });

      } else if (mode === "signup") {
        if (!isEightChars || !hasUppercase || !hasNumber) {
          throw new Error("Password requirements not met.");
        }

        await apiSignup(firstName, lastName, email, password, company);
        alert("Account created successfully! Please sign in.");
        setMode("login");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex">
      <div className="w-full lg:w-[45%] flex flex-col justify-between p-8 sm:p-12 md:p-16 relative">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={onBackToLanding}>
          <DatumIQLogo showText={true} size={28} />
        </div>

        <div className="max-w-md w-full mx-auto my-auto py-12">
          {error && (
            <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

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
                      className="w-full bg-slate-900/60 border border-slate-800 focus:border-blue-500 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none transition-all"
                    />
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Password</label>
                    <button 
                      type="button"
                      onClick={() => { setMode("forgot"); setError(null); }}
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
                      className="w-full bg-slate-900/60 border border-slate-800 focus:border-blue-500 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none transition-all"
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
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-sm font-semibold text-white rounded-lg shadow-lg disabled:opacity-50 transition-all"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <p className="mt-8 text-center text-xs text-slate-500">
                Don't have an account?{" "}
                <button 
                  type="button"
                  onClick={() => { setMode("signup"); setError(null); }}
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
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-sm font-semibold text-white rounded-lg shadow-lg disabled:opacity-50 transition-all"
                >
                  {isLoading ? "Creating..." : "Create workspace"}
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-slate-500">
                Already have an account?{" "}
                <button 
                  type="button"
                  onClick={() => { setMode("login"); setError(null); }}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}