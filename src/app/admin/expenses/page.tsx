"use client";

import { useState } from "react";
import { useDepotStore } from "@/store/useDepotStore";
import { Receipt, Plus } from "lucide-react";

export default function AdminExpenses() {
  const { expenses, addExpense } = useDepotStore();
  
  const [showAdd, setShowAdd] = useState(false);
  const [category, setCategory] = useState("Listrik");
  const [amount, setAmount] = useState<number | "">("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    addExpense({
      date: new Date().toISOString().split('T')[0],
      category,
      amount: Number(amount),
      description
    });
    setAmount("");
    setDescription("");
    setShowAdd(false);
  };

  const totalOpex = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-8 max-w-5xl relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-normal text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Receipt className="w-8 h-8 text-brand-500" />
            Biaya Operasional (OPEX)
          </h1>
          <p className="text-sm text-slate-500 dark:text-[#a8acb3] mt-2">Catat pengeluaran listrik, gaji, bensin, dll.</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-full shadow-md transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Tambah Pengeluaran
        </button>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-[#16181c] p-8 rounded-3xl border border-slate-200 dark:border-[#2b2d31] shadow-[0_4px_12px_rgba(0,0,0,0.04)] animate-in fade-in slide-in-from-top-4">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-2 uppercase tracking-widest">Kategori</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-4 rounded-xl bg-white dark:bg-[#0a0b0d] text-slate-900 dark:text-white border border-slate-200 dark:border-[#2b2d31] focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition">
                <option value="Listrik">Listrik</option>
                <option value="Gaji Karyawan">Gaji Karyawan</option>
                <option value="Bensin / Kendaraan">Bensin / Kendaraan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-2 uppercase tracking-widest">Jumlah (Rp)</label>
              <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} required className="w-full p-4 rounded-xl bg-white dark:bg-[#0a0b0d] text-slate-900 dark:text-white border border-slate-200 dark:border-[#2b2d31] focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
            </div>
            <div className="md:col-span-2 flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-2 uppercase tracking-widest">Keterangan</label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Misal: Token bulan ini" className="w-full p-4 rounded-xl bg-white dark:bg-[#0a0b0d] text-slate-900 dark:text-white border border-slate-200 dark:border-[#2b2d31] focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
              </div>
              <button type="submit" className="py-4 px-8 bg-slate-900 dark:bg-[#2b2d31] hover:bg-slate-800 dark:hover:bg-[#3f4247] text-white font-medium rounded-full transition">Simpan</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-[#16181c] rounded-3xl border border-slate-200 dark:border-[#2b2d31] shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-[#2b2d31] flex items-center justify-between">
          <h3 className="font-medium text-lg text-slate-800 dark:text-slate-200">Riwayat Pengeluaran</h3>
          <span className="text-sm font-bold text-rose-500">Total: Rp {totalOpex.toLocaleString('id-ID')}</span>
        </div>
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left text-sm relative">
            <thead className="bg-slate-50 dark:bg-transparent text-slate-500 dark:text-[#a8acb3] border-b border-slate-100 dark:border-[#2b2d31] sticky top-0 z-10">
              <tr>
                <th className="p-5 font-bold text-xs uppercase tracking-widest">Tanggal</th>
                <th className="p-5 font-bold text-xs uppercase tracking-widest">Kategori</th>
                <th className="p-5 font-bold text-xs uppercase tracking-widest">Keterangan</th>
                <th className="p-5 font-bold text-xs uppercase tracking-widest text-right">Jumlah (Rp)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#2b2d31]">
              {expenses.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-[#2b2d31]/50 transition-colors">
                  <td className="p-5 font-mono text-slate-500 dark:text-[#a8acb3] text-xs">{e.date}</td>
                  <td className="p-5"><span className="bg-slate-100 dark:bg-[#2b2d31] text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">{e.category}</span></td>
                  <td className="p-5 text-slate-600 dark:text-slate-400">{e.description || '-'}</td>
                  <td className="p-5 text-right font-mono font-medium text-rose-500">{e.amount.toLocaleString('id-ID')}</td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-slate-500 dark:text-[#a8acb3]">Belum ada data pengeluaran.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
