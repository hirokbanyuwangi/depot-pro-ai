"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Droplets, LogIn, Info } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const adminUser = process.env.NEXT_PUBLIC_ADMIN_USER || "admin";
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS || "admin123";
    const staffUser = process.env.NEXT_PUBLIC_STAFF_USER || "staff";
    const staffPass = process.env.NEXT_PUBLIC_STAFF_PASS || "staff123";

    if (username === adminUser && password === adminPass) {
      login("Admin Utama", "admin");
      router.push("/admin");
    } else if (username === staffUser && password === staffPass) {
      login("Kasir 1", "staff");
      router.push("/staff");
    } else {
      setError("Username atau password salah!");
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative">
      <Link 
        href="/presentation" 
        className="absolute top-4 right-4 sm:top-8 sm:right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-brand-500 hover:bg-brand-50 border border-slate-200 shadow-sm transition-all group"
        title="Presentasi dimulai"
      >
        <Info className="w-5 h-5" />
        <span className="absolute right-14 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Mulai Presentasi
        </span>
      </Link>

      <div className="bg-white rounded-3xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-slate-200 p-10 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-brand-500 mx-auto flex items-center justify-center text-white mb-6">
            <Droplets className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-normal text-slate-900 tracking-tight">DepotPro <span className="text-brand-500 font-medium">AI</span></h1>
          <p className="text-sm text-slate-500 mt-2">Silakan login untuk melanjutkan</p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm font-medium mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full p-4 rounded-xl bg-white text-slate-900 border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-colors"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-4 rounded-xl bg-white text-slate-900 border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-colors"
              required 
            />
          </div>
          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full py-4 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-full transition flex items-center justify-center gap-2 shadow-md"
            >
              <LogIn className="w-5 h-5" />
              <span>Masuk</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
