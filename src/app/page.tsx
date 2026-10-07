"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function Home() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) {
      router.push("/login");
    } else if (currentUser.role === "admin") {
      router.push("/admin");
    } else if (currentUser.role === "staff") {
      router.push("/staff");
    }
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
