"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  LayoutDashboard, ShoppingCart, Users, Database, 
  Calculator, Receipt, Settings, LogOut, Droplets, Menu, X, ScrollText, Warehouse
} from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const role = user?.role;
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const adminLinks = [
    { name: "Dashboard KPI", href: "/admin", icon: LayoutDashboard },
    { name: "Kasir & POS", href: "/admin/pos", icon: ShoppingCart },
    { name: "Riwayat Transaksi", href: "/admin/history", icon: ScrollText },
    { name: "Pelanggan & Bon", href: "/admin/crm", icon: Users },
    { name: "Stock Gudang", href: "/admin/warehouse", icon: Warehouse },
    { name: "Stok & Tangki Air", href: "/admin/inventory", icon: Database },
    { name: "Kalkulator HPP", href: "/admin/hpp", icon: Calculator },
    { name: "Biaya OPEX", href: "/admin/expenses", icon: Receipt },
    { name: "Pusat Input & Setup", href: "/admin/setup", icon: Settings },
    { name: "Cetak Laporan", href: "/admin/report", icon: ScrollText },
  ];

  const staffLinks = [
    { name: "Kasir & POS", href: "/staff", icon: ShoppingCart },
    { name: "Riwayat Transaksi", href: "/staff/history", icon: ScrollText },
    { name: "Pelanggan & Bon", href: "/staff/crm", icon: Users },
    { name: "Stock Gudang", href: "/staff/warehouse", icon: Warehouse },
    { name: "Stok & Tangki Air", href: "/staff/inventory", icon: Database },
  ];

  const links = role === "admin" ? adminLinks : staffLinks;

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 p-4 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <Droplets className="w-6 h-6 text-brand-600" />
          <h1 className="font-extrabold text-slate-900">DepotPro <span className="text-brand-600">AI</span></h1>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-900/50 z-30" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 hidden md:flex">
          <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white shadow-sm">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight">DepotPro <span className="text-brand-600">AI</span></h1>
            <p className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full inline-block mt-0.5 font-medium">
              {role === "admin" ? "Admin Mode" : "Staff Mode"}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-full transition ${
                  isActive 
                    ? "bg-slate-100 text-brand-600 font-bold" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-brand-600" : "text-slate-400"}`} />
                <span className="text-sm">{link.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="mb-4 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
            <div className="overflow-hidden">
              <p className="text-xs text-slate-500">Login sebagai:</p>
              <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-full text-rose-600 hover:bg-rose-50 font-bold transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}
