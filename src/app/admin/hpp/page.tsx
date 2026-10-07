"use client";

import { useDepotStore } from "@/store/useDepotStore";
import { Calculator, Save } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminHPP() {
  const { settings, updateSettings, transactions, expenses } = useDepotStore();

  const [tankCapacity, setTankCapacity] = useState(5000);
  const [tankPrice, setTankPrice] = useState(350000);
  const [capPrice, setCapPrice] = useState(100);
  const [tissuePrice, setTissuePrice] = useState(50);
  const [sealPrice, setSealPrice] = useState(50);
  const [investorPct, setInvestorPct] = useState(50);

  // Sync state after hydration to avoid "reset on refresh" bug
  useEffect(() => {
    setTankCapacity(settings.tankCapacity ?? 5000);
    setTankPrice(settings.tankPrice ?? 350000);
    setCapPrice(settings.capPrice ?? 100);
    setTissuePrice(settings.tissuePrice ?? 50);
    setSealPrice(settings.sealPrice ?? 50);
    setInvestorPct(settings.investorPct ?? 50);
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ tankCapacity, tankPrice, capPrice, tissuePrice, sealPrice, investorPct });
    alert("Variabel HPP berhasil disimpan!");
  };

  const totalRevenue = transactions.reduce((sum, tx) => sum + tx.totalAmount, 0);
  const totalGalonSold = transactions.reduce((sum, tx) => sum + tx.qty, 0);
  
  // Hitung modal per galon
  const waterPricePerLiter = tankCapacity > 0 ? tankPrice / tankCapacity : 0;
  const costPerGalonAir = waterPricePerLiter * 19;
  const totalModalPerGalon = costPerGalonAir + capPrice + tissuePrice + sealPrice;

  // Laba Kotor
  const hppTotalGalon = totalGalonSold * totalModalPerGalon;
  const labaKotor = totalRevenue - hppTotalGalon;

  // Biaya Operasional & Tangki
  const totalOpex = expenses ? expenses.reduce((sum, e) => sum + e.amount, 0) : 0;
  
  // Laba Bersih
  const labaBersih = labaKotor - totalOpex;

  // Bagi Hasil
  const investorShare = labaBersih * (investorPct / 100);
  const pengelolaShare = labaBersih - investorShare;

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-normal text-slate-900 tracking-tight flex items-center gap-3">
            <Calculator className="w-8 h-8 text-brand-500" />
            Kalkulator HPP & Bagi Hasil
          </h1>
          <p className="text-sm text-slate-500 mt-2">Laporan estimasi margin dan Harga Pokok Penjualan. Sesuaikan nilai aslinya di sini.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Form Variabel HPP */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)] md:col-span-2">
          <form onSubmit={handleSave} className="space-y-6">
            <h3 className="font-medium text-lg text-slate-800 border-b border-slate-100 pb-3">Variabel Harga Dasar (Real-Time)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-widest">Harga 1 Truk</label>
                <input type="number" value={tankPrice} onChange={e => setTankPrice(Number(e.target.value))} required className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-widest">Kapasitas (L)</label>
                <input type="number" value={tankCapacity} onChange={e => setTankCapacity(Number(e.target.value))} required className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-widest">Tutup Galon</label>
                <input type="number" value={capPrice} onChange={e => setCapPrice(Number(e.target.value))} required className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-widest">Tisu</label>
                <input type="number" value={tissuePrice} onChange={e => setTissuePrice(Number(e.target.value))} required className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-widest">Segel Plastik</label>
                <input type="number" value={sealPrice} onChange={e => setSealPrice(Number(e.target.value))} required className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-widest">Porsi Investor (%)</label>
                <input type="number" value={investorPct} onChange={e => setInvestorPct(Number(e.target.value))} required className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
              </div>
            </div>
            <button type="submit" className="w-full mt-4 py-4 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-full transition flex items-center justify-center gap-2">
              <Save className="w-5 h-5" /> Terapkan ke Kalkulator
            </button>
          </form>
        </div>

        {/* Rincian Modal Per Galon */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
          <h3 className="font-medium text-lg text-slate-800 border-b border-slate-100 pb-3 mb-5">Analisis Modal (HPP / Galon)</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Air (19 L x Rp {Math.round(waterPricePerLiter)})</span>
              <span className="font-mono">Rp {Math.round(costPerGalonAir).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Tutup Galon</span>
              <span className="font-mono">Rp {capPrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Tisu Pembersih</span>
              <span className="font-mono">Rp {tissuePrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Segel Plastik</span>
              <span className="font-mono">Rp {sealPrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 pt-4 border-t border-slate-100">
              <span>Total HPP per Galon</span>
              <span className="font-mono text-lg text-brand-500">Rp {Math.round(totalModalPerGalon).toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* Laba Rugi Global */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
          <h3 className="font-medium text-lg text-slate-800 border-b border-slate-100 pb-3 mb-5">Laporan Laba Rugi Keseluruhan</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between font-medium text-slate-700">
              <span>Total Omzet Penjualan ({totalGalonSold} Galon)</span>
              <span className="font-mono text-emerald-600">Rp {totalRevenue.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-rose-600">
              <span>Total HPP Barang</span>
              <span className="font-mono">- Rp {Math.round(hppTotalGalon).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-800 pt-3 border-t border-slate-100">
              <span>Laba Kotor</span>
              <span className="font-mono text-lg">Rp {Math.round(labaKotor).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-rose-600">
              <span>Biaya Operasional (OPEX)</span>
              <span className="font-mono">- Rp {totalOpex.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between font-normal text-slate-900 text-xl pt-3 border-t border-slate-200">
              <span>Laba Bersih</span>
              <span className={`font-mono font-bold ${labaBersih >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                Rp {Math.round(labaBersih).toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* Bagi Hasil */}
        <div className="md:col-span-2 bg-[#0a0b0d] p-8 rounded-3xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] text-white border border-[#2b2d31]">
          <h3 className="font-normal text-2xl text-white tracking-tight pb-4 mb-6 text-center">Bagi Hasil Profit</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#16181c] border border-[#2b2d31] p-6 rounded-3xl flex flex-col items-center text-center hover:border-brand-500 transition-colors">
              <p className="text-xs text-[#a8acb3] uppercase tracking-widest font-bold mb-3">Porsi Investor ({investorPct}%)</p>
              <p className="text-3xl font-mono font-bold text-emerald-500">Rp {Math.round(investorShare).toLocaleString('id-ID')}</p>
            </div>
            <div className="bg-[#16181c] border border-[#2b2d31] p-6 rounded-3xl flex flex-col items-center text-center hover:border-brand-500 transition-colors">
              <p className="text-xs text-[#a8acb3] uppercase tracking-widest font-bold mb-3">Porsi Pengelola ({100 - investorPct}%)</p>
              <p className="text-3xl font-mono font-bold text-brand-500">Rp {Math.round(pengelolaShare).toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
