"use client";

import { useState } from "react";
import { useDepotStore } from "@/store/useDepotStore";
import { Database, Truck, Droplet } from "lucide-react";

export default function StaffInventory() {
  const { inventory, settings, addTankHistory, tankHistories } = useDepotStore();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [litersAdded, setLitersAdded] = useState(settings.tankCapacity);
  const [pricePaid, setPricePaid] = useState(0);

  const capacityPct = Math.min(100, (inventory.currentWaterLiters / settings.tankCapacity) * 100);
  
  // Total Keseluruhan Air = Toren + (Galon Terisi * 19L)
  const totalWaterInGallons = (inventory.filledGallons || 0) * 19;
  const totalOverallWater = inventory.currentWaterLiters + totalWaterInGallons;

  const handleAddTank = (e: React.FormEvent) => {
    e.preventDefault();
    if (litersAdded <= 0) return;
    
    addTankHistory({
      date: new Date().toISOString().split('T')[0],
      litersAdded,
      pricePaid
    });
    
    setShowAddForm(false);
    setLitersAdded(settings.tankCapacity);
    setPricePaid(0);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-normal text-slate-900 tracking-tight flex items-center gap-3">
            <Database className="w-8 h-8 text-brand-500" />
            Stok & Tangki Air
          </h1>
          <p className="text-sm text-slate-500 mt-2">Pantau sisa air toren dan total keseluruhan air siap jual.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-full shadow-md transition flex items-center gap-2"
        >
          <Truck className="w-4 h-4" />
          <span>Isi Tangki Masuk</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Toren Visualizer */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center relative overflow-hidden">
          <div className="text-center mb-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sisa Air di Toren</p>
            <p className={`text-4xl font-mono font-bold mt-2 ${capacityPct < 20 ? 'text-rose-500' : 'text-brand-500'}`}>
              {inventory.currentWaterLiters.toLocaleString('id-ID')} <span className="text-2xl">L</span>
            </p>
            <p className="text-xs text-slate-400 mt-2 uppercase tracking-widest">Kapasitas Max: {settings.tankCapacity.toLocaleString('id-ID')} L</p>
          </div>
          
          <div className="relative w-32 h-64 border-4 border-slate-200 rounded-b-3xl rounded-t-sm overflow-hidden bg-slate-50">
            <div 
              className={`absolute bottom-0 w-full transition-all duration-1000 ease-in-out ${capacityPct < 20 ? 'bg-rose-500' : 'bg-brand-500'}`}
              style={{ height: `${capacityPct}%` }}
            >
              <div className="absolute top-0 w-full h-2 bg-white/30"></div>
            </div>
          </div>

          {capacityPct < 20 && (
            <div className="mt-6 text-xs font-bold text-rose-600 bg-rose-50 px-4 py-2 rounded-full text-center">
              Peringatan: Air Toren Menipis!
            </div>
          )}
        </div>

        <div className="md:col-span-1 lg:col-span-2 space-y-8 flex flex-col">
          {/* Total Keseluruhan Air */}
          <div className="bg-sky-50 p-8 rounded-3xl border border-sky-100 flex items-center gap-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
            <div className="w-16 h-16 bg-sky-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
              <Droplet className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs font-bold text-sky-700 uppercase tracking-widest mb-1">Total Air Keseluruhan (Toren + Galon Stock)</p>
              <div className="text-4xl font-mono font-bold text-sky-900">
                {totalOverallWater.toLocaleString('id-ID')} <span className="text-2xl text-sky-600 font-normal">L</span>
              </div>
              <p className="text-sm text-sky-600 mt-1">Air Toren ({inventory.currentWaterLiters}L) + Galon Siap Jual ({totalWaterInGallons}L)</p>
            </div>
          </div>

          {showAddForm && (
            <div className="bg-white p-8 rounded-3xl border border-brand-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)] animate-in fade-in slide-in-from-top-4">
              <h3 className="font-medium text-lg text-brand-700 mb-5 flex items-center gap-2 border-b border-brand-100 pb-3">
                <Truck className="w-5 h-5" /> Catat Truk Tangki Masuk
              </h3>
              <form onSubmit={handleAddTank} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-widest">Jumlah Air Masuk (Liter)</label>
                  <input type="number" min="1" value={litersAdded} onChange={e => setLitersAdded(Number(e.target.value))} required className="w-full p-4 rounded-xl bg-white text-slate-900 border border-slate-200 font-mono focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-widest">Harga Beli Truk (Rp)</label>
                  <input type="number" min="0" value={pricePaid} onChange={e => setPricePaid(Number(e.target.value))} className="w-full p-4 rounded-xl bg-white text-slate-900 border border-slate-200 font-mono focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
                </div>
                <div className="sm:col-span-2 mt-2">
                  <button type="submit" className="w-full py-4 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-full transition shadow-md">Simpan Tangki Masuk</button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden flex-1">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-medium text-lg text-slate-800">Riwayat Pengisian Tangki</h3>
            </div>
            <div className="overflow-x-auto max-h-[300px]">
              <table className="w-full text-left text-sm relative">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 sticky top-0 z-10">
                  <tr>
                    <th className="p-5 font-bold text-xs uppercase tracking-widest">Tanggal</th>
                    <th className="p-5 font-bold text-xs uppercase tracking-widest text-right">Volume (L)</th>
                    <th className="p-5 font-bold text-xs uppercase tracking-widest text-right">Harga (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tankHistories.slice(0, 10).map((h) => (
                    <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-5 font-mono text-slate-500 text-xs">{h.date}</td>
                      <td className="p-5 text-right font-mono font-bold text-brand-500">+{h.litersAdded.toLocaleString('id-ID')}</td>
                      <td className="p-5 text-right font-mono text-slate-600">{h.pricePaid > 0 ? `Rp ${h.pricePaid.toLocaleString('id-ID')}` : '-'}</td>
                    </tr>
                  ))}
                  {tankHistories.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-10 text-center text-slate-500">Belum ada riwayat tangki masuk.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
