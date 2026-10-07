"use client";

import { useState } from "react";
import { useDepotStore } from "@/store/useDepotStore";
import { Warehouse, Plus, ArrowUpRight, ArrowDownRight, RefreshCcw } from "lucide-react";

export default function StaffWarehouse() {
  const { inventory, settings, updateWarehouse, addWarehouseHistory, warehouseHistories } = useDepotStore();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [amountChange, setAmountChange] = useState<number>(0);
  const [type, setType] = useState<"isi" | "kosong">("isi");
  const [description, setDescription] = useState("");

  const handleUpdateStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountChange === 0) return;
    
    // Simpan riwayat
    addWarehouseHistory({
      date: new Date().toISOString().split('T')[0],
      type,
      amountChange,
      description: description || (amountChange > 0 ? "Penambahan Stok" : "Pengurangan Stok")
    });
    
    setShowAddForm(false);
    setAmountChange(0);
    setDescription("");
  };

  // Sinkronisasi sinkron / manual jika ada perbedaan fisik (Stok Opname)
  const handleSyncOpname = (e: React.FormEvent, typeOpname: "isi" | "kosong", currentSystem: number) => {
    e.preventDefault();
    const input = prompt(`Masukkan jumlah FISIK galon ${typeOpname} saat ini (Sistem: ${currentSystem}):`, currentSystem.toString());
    if (input !== null) {
      const actual = parseInt(input, 10);
      if (!isNaN(actual) && actual >= 0) {
        const diff = actual - currentSystem;
        if (diff !== 0) {
          addWarehouseHistory({
            date: new Date().toISOString().split('T')[0],
            type: typeOpname,
            amountChange: diff,
            description: "Stok Opname (Penyesuaian Fisik)"
          });
          alert(`Stok Galon ${typeOpname} berhasil disesuaikan!`);
        }
      }
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-normal text-slate-900 tracking-tight flex items-center gap-3">
            <Warehouse className="w-8 h-8 text-brand-500" />
            Stock Gudang
          </h1>
          <p className="text-sm text-slate-500 mt-2">Monitor total galon terisi, kosong, dan total aset galon.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-full shadow-md transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Input Stok / Retur</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Total Aset Galon */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Warehouse className="w-32 h-32 text-slate-900" />
          </div>
          <div className="relative z-10">
            <h3 className="font-medium text-lg text-slate-800 mb-2">Total Galon Keseluruhan</h3>
            <p className="text-sm text-slate-500 mb-6">Total aset galon milik depot</p>
            <div className="text-6xl font-mono font-bold text-slate-800 mb-8">
              {settings.totalGallonAsset || 0} <span className="text-2xl text-slate-400 font-normal">Pcs</span>
            </div>
            <p className="text-xs font-medium text-slate-500">Edit di Pusat Input & Setup</p>
          </div>
        </div>
        
        {/* Status Galon Terisi */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Warehouse className="w-32 h-32 text-emerald-500" />
          </div>
          <div className="relative z-10">
            <h3 className="font-medium text-lg text-slate-800 mb-2">Total Galon Berisi Air</h3>
            <p className="text-sm text-slate-500 mb-6">Galon siap jual (Gudang/Toko)</p>
            <div className="text-6xl font-mono font-bold text-emerald-500 mb-8">
              {inventory?.filledGallons || 0} <span className="text-2xl text-slate-400 font-normal">Pcs</span>
            </div>
            <button onClick={(e) => handleSyncOpname(e, "isi", inventory?.filledGallons || 0)} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600 transition">
              <RefreshCcw className="w-4 h-4" /> Sesuaikan Fisik (Opname)
            </button>
          </div>
        </div>

        {/* Status Galon Kosong */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Warehouse className="w-32 h-32 text-amber-500" />
          </div>
          <div className="relative z-10">
            <h3 className="font-medium text-lg text-slate-800 mb-2">Total Galon Kosong</h3>
            <p className="text-sm text-slate-500 mb-6">Galon kotor yang siap diisi ulang / cuci</p>
            <div className="text-6xl font-mono font-bold text-amber-500 mb-8">
              {inventory?.emptyGallons || 0} <span className="text-2xl text-slate-400 font-normal">Pcs</span>
            </div>
            <button onClick={(e) => handleSyncOpname(e, "kosong", inventory?.emptyGallons || 0)} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-amber-600 transition">
              <RefreshCcw className="w-4 h-4" /> Sesuaikan Fisik (Opname)
            </button>
          </div>
        </div>

      </div>

      {showAddForm && (
        <div className="bg-white p-8 rounded-3xl border border-brand-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)] animate-in fade-in slide-in-from-top-4">
          <h3 className="font-medium text-lg text-brand-700 mb-5 flex items-center gap-2 border-b border-brand-100 pb-3">
            <Plus className="w-5 h-5" /> Catat Pergerakan Stok Manual
          </h3>
          <form onSubmit={handleUpdateStock} className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-widest">Jenis Galon</label>
              <select value={type} onChange={e => setType(e.target.value as any)} className="w-full p-4 rounded-xl bg-white text-slate-900 border border-slate-200 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition">
                <option value="isi">Galon Isi Air</option>
                <option value="kosong">Galon Kosong</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-widest">Jumlah (+/-)</label>
              <input type="number" value={amountChange} onChange={e => setAmountChange(Number(e.target.value))} required placeholder="-10 atau 20" className="w-full p-4 rounded-xl bg-white text-slate-900 border border-slate-200 font-mono focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
            </div>
            <div className="md:col-span-2 flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-widest">Keterangan / Alasan</label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Contoh: Galon pecah / Retur Pabrik" required className="w-full p-4 rounded-xl bg-white text-slate-900 border border-slate-200 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
              </div>
              <button type="submit" className="py-4 px-8 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-full shadow-md transition">Simpan</button>
            </div>
          </form>
          <p className="text-xs text-slate-500 mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">Tips: Gunakan angka minus (contoh: -5) untuk mengurangi stok, dan angka positif (contoh: 10) untuk menambah stok.</p>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-medium text-lg text-slate-800">Riwayat Pergerakan Gudang</h3>
        </div>
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left text-sm relative">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 sticky top-0 z-10">
              <tr>
                <th className="p-5 font-bold text-xs uppercase tracking-widest">Tanggal</th>
                <th className="p-5 font-bold text-xs uppercase tracking-widest">Jenis Galon</th>
                <th className="p-5 font-bold text-xs uppercase tracking-widest">Keterangan</th>
                <th className="p-5 font-bold text-xs uppercase tracking-widest text-right">Perubahan (Qty)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(warehouseHistories || []).slice(0, 15).map((h) => (
                <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-5 font-mono text-slate-500 text-xs">{h.date}</td>
                  <td className="p-5">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${h.type === 'isi' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {h.type}
                    </span>
                  </td>
                  <td className="p-5 text-slate-600">{h.description}</td>
                  <td className="p-5 text-right font-mono font-bold text-lg">
                    {h.amountChange > 0 ? (
                      <span className="text-emerald-500 flex items-center justify-end gap-1"><ArrowUpRight className="w-4 h-4"/> +{h.amountChange}</span>
                    ) : (
                      <span className="text-rose-500 flex items-center justify-end gap-1"><ArrowDownRight className="w-4 h-4"/> {h.amountChange}</span>
                    )}
                  </td>
                </tr>
              ))}
              {(!warehouseHistories || warehouseHistories.length === 0) && (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-slate-500">Belum ada riwayat pergerakan gudang manual atau opname.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
