"use client";

import { useDepotStore } from "@/store/useDepotStore";
import { ScrollText, ArrowDownLeft, Trash2, Calendar } from "lucide-react";
import { useState } from "react";

export default function StaffHistory() {
  const { transactions, revertTransaction } = useDepotStore();
  
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState<"all" | "today" | "week" | "month">("all");
  
  const [revertTxId, setRevertTxId] = useState<string | null>(null);
  const [revertQty, setRevertQty] = useState<number>(1);

  const handleRevert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revertTxId || revertQty <= 0) return;
    revertTransaction(revertTxId, revertQty);
    setRevertTxId(null);
    setRevertQty(1);
    alert("Berhasil me-revert transaksi sebagian!");
  };

  const getFilteredTransactions = () => {
    let filtered = [...transactions];
    const today = new Date();
    
    if (filterDate) {
      filtered = filtered.filter(t => t.date === filterDate);
    } else if (filterType === "today") {
      const dateStr = today.toISOString().split("T")[0];
      filtered = filtered.filter(t => t.date === dateStr);
    } else if (filterType === "week") {
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);
      filtered = filtered.filter(t => new Date(t.date) >= lastWeek);
    } else if (filterType === "month") {
      const lastMonth = new Date();
      lastMonth.setMonth(today.getMonth() - 1);
      filtered = filtered.filter(t => new Date(t.date) >= lastMonth);
    }

    return filtered;
  };

  const displayedTransactions = getFilteredTransactions();

  return (
    <div className="space-y-8 max-w-6xl relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-normal text-slate-900 tracking-tight flex items-center gap-3">
            <ScrollText className="w-8 h-8 text-brand-500" />
            Riwayat Transaksi
          </h1>
          <p className="text-sm text-slate-500 mt-2">Daftar lengkap seluruh transaksi penjualan dengan fitur sortir dan Retur (Revert).</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-widest">Sortir Waktu</label>
          <div className="flex gap-2">
            <button onClick={() => {setFilterType("all"); setFilterDate("")}} className={`px-4 py-2 rounded-xl font-medium text-sm transition ${filterType === "all" && !filterDate ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>Semua</button>
            <button onClick={() => {setFilterType("today"); setFilterDate("")}} className={`px-4 py-2 rounded-xl font-medium text-sm transition ${filterType === "today" && !filterDate ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>Hari Ini</button>
            <button onClick={() => {setFilterType("week"); setFilterDate("")}} className={`px-4 py-2 rounded-xl font-medium text-sm transition ${filterType === "week" && !filterDate ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>7 Hari</button>
            <button onClick={() => {setFilterType("month"); setFilterDate("")}} className={`px-4 py-2 rounded-xl font-medium text-sm transition ${filterType === "month" && !filterDate ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>30 Hari</button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-widest">Atau Pilih Tanggal</label>
          <input type="date" value={filterDate} onChange={(e) => {setFilterDate(e.target.value); setFilterType("all");}} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left text-sm relative">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 sticky top-0 z-10">
              <tr>
                <th className="p-5 font-bold text-xs uppercase tracking-widest">Waktu</th>
                <th className="p-5 font-bold text-xs uppercase tracking-widest">Pelanggan</th>
                <th className="p-5 font-bold text-xs uppercase tracking-widest">Tipe</th>
                <th className="p-5 font-bold text-xs uppercase tracking-widest">Status / Layan</th>
                <th className="p-5 font-bold text-xs uppercase tracking-widest text-center">Qty</th>
                <th className="p-5 font-bold text-xs uppercase tracking-widest text-right">Total (Rp)</th>
                <th className="p-5 font-bold text-xs uppercase tracking-widest text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-5 font-mono text-slate-500 text-xs">{tx.date} <br/> <span className="text-[10px]">{tx.time}</span></td>
                  <td className="p-5 font-medium text-slate-900">{tx.customerName}</td>
                  <td className="p-5">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${tx.paymentMethod === 'bon' ? 'bg-rose-50 text-rose-600' : (tx.paymentMethod === 'qris' ? 'bg-sky-50 text-sky-600' : 'bg-emerald-50 text-emerald-600')}`}>
                      {tx.paymentMethod}
                    </span>
                  </td>
                  <td className="p-5 text-slate-600 text-xs">
                    {tx.gallonStatus.toUpperCase()} <br/> <span className="text-slate-400">{tx.channel}</span>
                  </td>
                  <td className="p-5 text-center font-mono font-bold text-brand-500 text-lg">{tx.qty}</td>
                  <td className="p-5 text-right font-mono font-medium text-slate-900">Rp {tx.totalAmount.toLocaleString('id-ID')}</td>
                  <td className="p-5 text-center">
                    {tx.qty > 0 ? (
                      <button 
                        onClick={() => {setRevertTxId(tx.id); setRevertQty(1);}}
                        className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-full text-xs font-bold transition-colors"
                      >
                        Retur
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-bold">Dibatalkan</span>
                    )}
                  </td>
                </tr>
              ))}
              {displayedTransactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-500">Tidak ada transaksi pada periode ini.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {revertTxId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-slate-200">
            <h3 className="font-medium text-2xl mb-2 flex items-center gap-3 text-slate-900">
              <ArrowDownLeft className="w-6 h-6 text-rose-500" />
              Retur Transaksi
            </h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Berapa banyak galon yang ingin diretur (revert) dari transaksi ini? Uang dan stok akan dikembalikan secara proporsional.
            </p>
            <form onSubmit={handleRevert} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-widest">Jumlah Galon Diretur</label>
                <input type="number" min="1" max={transactions.find(t => t.id === revertTxId)?.qty || 1} value={revertQty} onChange={e => setRevertQty(Number(e.target.value))} required className="w-full p-4 rounded-xl bg-white text-slate-900 border border-slate-200 font-mono focus:ring-1 focus:ring-rose-500 focus:border-rose-500 outline-none transition" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setRevertTxId(null)} className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-full transition">Batal</button>
                <button type="submit" className="flex-1 py-4 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-full shadow-md transition">Konfirmasi Retur</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
