"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useDepotStore } from "@/store/useDepotStore";
import Sidebar from "@/components/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [mounted, setMounted] = useState(false);
  const { isLoaded, initData } = useDepotStore();

  useEffect(() => {
    setMounted(true);
    const currentUser = useAuthStore.getState().user;
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login");
    } else {
      if (!isLoaded) {
        initData();
      }
    }
  }, [router, isLoaded, initData]);

  if (!mounted || !user || user.role !== "admin") return null;
  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-medium">Memuat data dari Cloud...</div>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 print:block print:min-h-0 print:bg-white print:h-auto">
      <div className="print:hidden">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto print:overflow-visible print:block print:h-auto">
        <div className="max-w-6xl mx-auto w-full p-4 md:p-8 print:p-0">
          {children}
        </div>
      </main>
    </div>
  );
}
