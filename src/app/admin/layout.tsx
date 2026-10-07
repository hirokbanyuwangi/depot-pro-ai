"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Sidebar from "@/components/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Use getState() to ensure we check the persisted value from localStorage, avoiding stale closure
    const currentUser = useAuthStore.getState().user;
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login");
    }
  }, [router]);

  if (!mounted || !user || user.role !== "admin") return null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 ">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto w-full p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
