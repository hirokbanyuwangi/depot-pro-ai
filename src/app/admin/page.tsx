"use client";

import { useDepotStore } from "@/store/useDepotStore";
import { ArrowDownRight, ArrowUpRight, Filter, TrendingUp, TrendingDown, DollarSign, Package, Droplets } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { transactions, expenses, inventory } = useDepotStore();
  const [filter, setFilter] = useState<"hari_ini" | "7_hari" | "bulan_ini" | "semua">("7_hari");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  // Filtering Logic
  const filteredData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const filterFn = (dateStr: string) => {
      if (filter === "semua") return true;
      if (filter === "hari_ini") return dateStr === todayStr;
      const itemDate = new Date(dateStr);
      if (filter === "7_hari") return itemDate >= sevenDaysAgo && itemDate <= new Date();
      if (filter === "bulan_ini") return itemDate >= firstDayOfMonth;
      return true;
    };

    return { 
      tx: transactions.filter(t => filterFn(t.date)), 
      ex: expenses.filter(e => filterFn(e.date)) 
    };
  }, [transactions, expenses, filter, todayStr]);

  const omzetTotal = filteredData.tx.reduce((sum, t) => sum + t.totalAmount, 0);
  const galonTerjual = filteredData.tx.reduce((sum, t) => sum + t.qty, 0);
  const pengeluaranTotal = filteredData.ex.reduce((sum, e) => sum + e.amount, 0);
  const labaBersihFilter = omzetTotal - (galonTerjual * 1500) - pengeluaranTotal; // mock HPP kotor

  // Chart Data Preparation
  const chartData = useMemo(() => {
    // Generate last 7 days array
    const dataMap: Record<string, { date: string; omzet: number; galon: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      dataMap[dateStr] = { date: d.toLocaleDateString('id-ID', { weekday: 'short' }), omzet: 0, galon: 0 };
    }

    // Populate data
    transactions.forEach(t => {
      if (dataMap[t.date]) {
        dataMap[t.date].omzet += t.totalAmount;
        dataMap[t.date].galon += t.qty;
      }
    });

    return Object.values(dataMap);
  }, [transactions]);

  // Gabungkan semua aktivitas (Pemasukan vs Pengeluaran)
  const history = [
    ...filteredData.tx.map(t => ({
      id: t.id,
      date: t.date,
      time: t.time || "12:00",
      title: `Penjualan ${t.qty} Galon (${t.channel})`,
      type: "IN" as const,
      amount: t.totalAmount,
      desc: `Pelanggan: ${t.customerName}`
    })),
    ...filteredData.ex.map(e => ({
      id: e.id,
      date: e.date,
      time: "00:00",
      title: `Pengeluaran: ${e.category}`,
      type: "OUT" as const,
      amount: e.amount,
      desc: e.description
    }))
  ];
  history.sort((a, b) => Number(b.id) - Number(a.id));

  // Top Customers Data
  const topCustomers = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.tx.forEach(t => {
      if (t.customerName && t.customerName !== 'Pelanggan Umum') {
        counts[t.customerName] = (counts[t.customerName] || 0) + t.qty;
      }
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4);
  }, [filteredData.tx]);

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500  uppercase tracking-widest mb-1">ENTERPRISE MONITORING</p>
          <h1 className="text-4xl font-normal text-slate-900  tracking-tight">System Overview</h1>
        </div>
        
        <div className="flex items-center gap-2 bg-white  px-4 py-2 rounded-full border border-slate-200  shadow-sm">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-transparent text-sm font-medium text-slate-700  focus:outline-none cursor-pointer"
          >
            <option value="hari_ini">Hari Ini</option>
            <option value="7_hari">7 Hari Terakhir</option>
            <option value="bulan_ini">Bulan Ini</option>
            <option value="semua">Semua Waktu</option>
          </select>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white  p-6 rounded-3xl border border-slate-200  shadow-[0_4px_12px_rgba(0,0,0,0.04)] relative overflow-hidden group">
          <p className="text-xs font-bold text-slate-500  uppercase tracking-widest mb-3 flex justify-between">
            Omzet Masuk <DollarSign className="w-4 h-4 text-slate-400" />
          </p>
          <p className="text-3xl font-mono font-medium text-slate-900  mt-1">Rp {omzetTotal.toLocaleString('id-ID')}</p>
        </div>
        
        <div className="bg-white  p-6 rounded-3xl border border-slate-200  shadow-[0_4px_12px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <p className="text-xs font-bold text-slate-500  uppercase tracking-widest mb-3 flex justify-between">
            Laba Bersih <TrendingUp className="w-4 h-4 text-slate-400" />
          </p>
          <p className="text-3xl font-mono font-medium text-emerald-600 mt-1">Rp {labaBersihFilter.toLocaleString('id-ID')}</p>
        </div>
        
        <div className="bg-white  p-6 rounded-3xl border border-slate-200  shadow-[0_4px_12px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <p className="text-xs font-bold text-slate-500  uppercase tracking-widest mb-3 flex justify-between">
            Galon Terjual <Package className="w-4 h-4 text-slate-400" />
          </p>
          <p className="text-3xl font-mono font-medium text-brand-600 mt-1">{galonTerjual}</p>
          <div className="w-full bg-slate-100 h-1.5 mt-4 rounded-full overflow-hidden">
            <div className="bg-brand-500 h-full" style={{ width: '70%' }}></div>
          </div>
        </div>

        <div className="bg-white  p-6 rounded-3xl border border-slate-200  shadow-[0_4px_12px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <p className="text-xs font-bold text-slate-500  uppercase tracking-widest mb-3 flex justify-between">
            Sisa Air Toren <Droplets className="w-4 h-4 text-slate-400" />
          </p>
          <p className="text-3xl font-mono font-medium text-slate-900  mt-1">{inventory.currentWaterLiters.toLocaleString('id-ID')} L</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="bg-white  rounded-3xl border border-slate-200  shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-8 lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-normal text-slate-900  text-2xl tracking-tight">Sales Performance Over Time</h3>
              <p className="text-sm text-slate-500  mt-1">Omzet harian selama 7 hari terakhir</p>
            </div>
            <div className="flex gap-4 text-xs font-bold tracking-widest">
              <span className="flex items-center gap-2 text-slate-500  uppercase">
                <div className="w-2 h-2 rounded-full bg-brand-500"></div> OMZET
              </span>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOmzet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-brand-500)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-brand-500)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} tickFormatter={(val) => `Rp${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', borderRadius: '16px', color: 'var(--text-ink)' }}
                  itemStyle={{ color: 'var(--color-brand-500)' }}
                />
                <Area type="monotone" dataKey="omzet" stroke="var(--color-brand-500)" strokeWidth={3} fillOpacity={1} fill="url(#colorOmzet)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Assets/Customers */}
        <div className="bg-white  rounded-3xl border border-slate-200  shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-8">
          <h3 className="font-normal text-slate-900  text-2xl tracking-tight mb-8">Top Customers</h3>
          <div className="space-y-6">
            {topCustomers.length > 0 ? topCustomers.map(([name, qty], idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-3">
                  <span className="font-medium text-slate-800 ">{name}</span>
                  <span className="font-mono text-slate-500  font-medium">{qty} Galon</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-brand-500 h-full" style={{ width: `${Math.min(100, (qty / 20) * 100)}%` }}></div>
                </div>
              </div>
            )) : (
              <p className="text-sm text-slate-500 ">Belum ada data pelanggan.</p>
            )}
            <div className="pt-6 text-center">
              <button className="text-xs font-bold text-slate-500  hover:text-brand-600 uppercase tracking-widest transition">
                View All Customers
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Riwayat Aktivitas Detail */}
      <div className="bg-white  rounded-3xl border border-slate-200  shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-8 border-b border-slate-100  flex justify-between items-center">
          <h3 className="font-normal text-slate-900  text-2xl tracking-tight">Recent Power Events</h3>
          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Live Feed Active</span>
          </div>
        </div>
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left text-sm relative">
            <thead className="bg-slate-50  text-slate-500  border-b border-slate-100  sticky top-0 z-10">
              <tr>
                <th className="p-6 font-bold text-xs uppercase tracking-widest">Timestamp</th>
                <th className="p-6 font-bold text-xs uppercase tracking-widest">Activity Type</th>
                <th className="p-6 font-bold text-xs uppercase tracking-widest">Description</th>
                <th className="p-6 font-bold text-xs uppercase tracking-widest">Severity</th>
                <th className="p-6 font-bold text-xs uppercase tracking-widest text-right">Nominal (Rp)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.length > 0 ? history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50  transition-colors">
                  <td className="p-6 text-slate-500  font-mono text-xs">
                    {item.date} {item.time !== "00:00" ? item.time : ""}
                  </td>
                  <td className="p-6">
                    <span className="font-medium text-slate-900 ">{item.title}</span>
                  </td>
                  <td className="p-6 text-slate-500  text-sm">{item.desc}</td>
                  <td className="p-6">
                    {item.type === "IN" ? (
                      <span className="text-[10px] font-bold px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full">ROUTINE</span>
                    ) : (
                      <span className="text-[10px] font-bold px-3 py-1.5 bg-rose-50 text-rose-600 rounded-full">CRITICAL</span>
                    )}
                  </td>
                  <td className={`p-6 text-right font-mono font-medium ${item.type === "IN" ? "text-emerald-600" : "text-rose-600"}`}>
                    {item.type === "IN" ? "+" : "-"} {item.amount.toLocaleString('id-ID')}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500 ">
                    <p>No recent events.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
