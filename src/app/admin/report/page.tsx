"use client";

import { useState, useMemo, useEffect } from "react";
import { useDepotStore } from "@/store/useDepotStore";
import { Printer, Filter, Building2, Calendar, Download } from "lucide-react";

export default function AdminReport() {
  const { transactions, expenses, settings } = useDepotStore();
  const [mounted, setMounted] = useState(false);

  // Default to current month
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePresetMonth = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) return;
    const [year, month] = val.split('-');
    const firstDay = new Date(parseInt(year), parseInt(month) - 1, 1).toISOString().split('T')[0];
    const lastDay = new Date(parseInt(year), parseInt(month), 0).toISOString().split('T')[0];
    setStartDate(firstDay);
    setEndDate(lastDay);
  };

  const filteredData = useMemo(() => {
    const sDate = new Date(startDate);
    sDate.setHours(0, 0, 0, 0);
    const eDate = new Date(endDate);
    eDate.setHours(23, 59, 59, 999);

    const tx = transactions.filter(t => {
      const d = new Date(t.date);
      return d >= sDate && d <= eDate;
    });

    const ex = expenses.filter(e => {
      const d = new Date(e.date);
      return d >= sDate && d <= eDate;
    });

    return { tx, ex };
  }, [transactions, expenses, startDate, endDate]);

  const reportPeriodTitle = useMemo(() => {
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    const sMonth = sDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
    const eMonth = eDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

    if (sMonth === eMonth) {
      return `Bulan ${sMonth}`;
    } else {
      return `Periode ${sMonth} - ${eMonth}`;
    }
  }, [startDate, endDate]);

  if (!mounted) return null;

  // Calculations
  const totalOmzet = filteredData.tx.reduce((sum, t) => sum + t.totalAmount, 0);
  const totalGalonSold = filteredData.tx.reduce((sum, t) => sum + t.qty, 0);
  
  // Breakdown Sales
  const qtyPickup = filteredData.tx.filter(t => t.channel === 'pickup').reduce((sum, t) => sum + t.qty, 0);
  const qtyDelivery = filteredData.tx.filter(t => t.channel === 'delivery').reduce((sum, t) => sum + t.qty, 0);
  const qtyStore = filteredData.tx.filter(t => t.channel === 'store').reduce((sum, t) => sum + t.qty, 0);

  // HPP
  const waterPricePerLiter = settings.tankCapacity > 0 ? settings.tankPrice / settings.tankCapacity : 0;
  const costPerGalonAir = waterPricePerLiter * 19;
  const totalModalPerGalon = costPerGalonAir + (settings.capPrice || 0) + (settings.tissuePrice || 0) + (settings.sealPrice || 0);
  const totalHPP = totalGalonSold * totalModalPerGalon;

  const labaKotor = totalOmzet - totalHPP;
  const totalOpex = filteredData.ex.reduce((sum, e) => sum + e.amount, 0);
  const labaBersih = labaKotor - totalOpex;

  const investorShare = labaBersih * ((settings.investorPct || 50) / 100);
  const pengelolaShare = labaBersih - investorShare;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Control Panel - Hidden when printing */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3 mb-4">
              <Download className="w-6 h-6 text-brand-500" />
              Eksport Laporan Keuangan
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Pilih Cepat Bulan</label>
                <select onChange={handlePresetMonth} defaultValue="" className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none">
                  <option value="" disabled>-- Pilih Bulan --</option>
                  {Array.from({length: 12}).map((_, i) => {
                    const d = new Date();
                    d.setMonth(d.getMonth() - i);
                    const val = `${d.getFullYear()}-${d.getMonth() + 1}`;
                    const label = d.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
                    return <option key={val} value={val}>{label}</option>;
                  })}
                </select>
              </div>
              <div className="w-px h-10 bg-slate-200 mx-2 hidden md:block"></div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Mulai Tanggal</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={e => setStartDate(e.target.value)}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>
              <span className="text-slate-400 mt-5 hidden sm:block">-</span>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Sampai Tanggal</label>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={e => setEndDate(e.target.value)}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>
            </div>
          </div>
          <button 
            onClick={handlePrint}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-full transition flex items-center justify-center gap-2 shadow-md"
          >
            <Printer className="w-5 h-5" /> Cetak / Simpan PDF
          </button>
        </div>
      </div>

      {/* Printable Report Page */}
      <div id="printableReport" className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm print:shadow-none print:border-none print:p-0 print:m-0 w-full max-w-[210mm] mx-auto min-h-[297mm]">
        
        {/* Header Kop Surat */}
        <div className="border-b-2 border-slate-900 pb-6 mb-8 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-brand-50 border-4 border-brand-100 flex items-center justify-center text-brand-600 shrink-0">
            <Building2 className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">{settings.depotName || "Depot Air Minum"}</h1>
            <p className="text-slate-600 mt-1">{settings.depotAddress || "Alamat belum diatur (Silakan atur di Pusat Input)"}</p>
          </div>
        </div>

        {/* Report Title */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900 uppercase underline decoration-2 underline-offset-4">Laporan Keuangan & Operasional</h2>
          <p className="text-slate-600 mt-2 font-medium">{reportPeriodTitle}</p>
        </div>

        {/* Section: Penjualan */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-800 bg-slate-100 px-4 py-2 rounded-lg mb-4">1. Rincian Penjualan</h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 px-2 font-bold text-slate-600">Jalur Penjualan</th>
                <th className="text-right py-2 px-2 font-bold text-slate-600">Total Galon</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-2 px-2 text-slate-700">Ambil Sendiri (Pickup)</td>
                <td className="py-2 px-2 text-right font-mono text-slate-800">{qtyPickup}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 px-2 text-slate-700">Diantar (Delivery)</td>
                <td className="py-2 px-2 text-right font-mono text-slate-800">{qtyDelivery}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 px-2 text-slate-700">Titip Toko (Grosir)</td>
                <td className="py-2 px-2 text-right font-mono text-slate-800">{qtyStore}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 font-bold">
                <td className="py-3 px-2 text-slate-900">Total Volume Penjualan</td>
                <td className="py-3 px-2 text-right font-mono text-brand-600 text-base">{totalGalonSold} Galon</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Section: Laba Rugi */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-800 bg-slate-100 px-4 py-2 rounded-lg mb-4">2. Ringkasan Laba Rugi</h3>
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr>
                <td className="py-2 px-2 text-slate-700 font-medium">Total Pendapatan (Omzet)</td>
                <td className="py-2 px-2 text-right font-mono text-emerald-600 font-bold">Rp {Math.round(totalOmzet).toLocaleString('id-ID')}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-2 px-2 text-slate-600">Harga Pokok Penjualan (HPP) *</td>
                <td className="py-2 px-2 text-right font-mono text-rose-600">- Rp {Math.round(totalHPP).toLocaleString('id-ID')}</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="py-3 px-2 text-slate-800 font-bold">Laba Kotor</td>
                <td className="py-3 px-2 text-right font-mono text-slate-800 font-bold text-base">Rp {Math.round(labaKotor).toLocaleString('id-ID')}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-2 px-2 text-slate-600">Total Biaya Operasional (OPEX)</td>
                <td className="py-2 px-2 text-right font-mono text-rose-600">- Rp {Math.round(totalOpex).toLocaleString('id-ID')}</td>
              </tr>
              <tr className="bg-brand-50 border-y-2 border-brand-200">
                <td className="py-4 px-2 text-brand-900 font-extrabold text-lg">LABA BERSIH (NET PROFIT)</td>
                <td className="py-4 px-2 text-right font-mono text-brand-700 font-extrabold text-xl">Rp {Math.round(labaBersih).toLocaleString('id-ID')}</td>
              </tr>
            </tbody>
          </table>
          <p className="text-[10px] text-slate-400 mt-2 italic">* HPP dihitung berdasarkan nilai modal per-galon (Rp {Math.round(totalModalPerGalon).toLocaleString('id-ID')}) dikalikan total volume penjualan.</p>
        </div>

        {/* Section: Bagi Hasil */}
        <div className="mb-12">
          <h3 className="text-lg font-bold text-slate-800 bg-slate-100 px-4 py-2 rounded-lg mb-4">3. Distribusi Bagi Hasil</h3>
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-2 text-slate-700">Porsi Pengelola ({100 - (settings.investorPct || 50)}%)</td>
                <td className="py-3 px-2 text-right font-mono text-slate-800 font-bold">Rp {Math.round(pengelolaShare).toLocaleString('id-ID')}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-2 text-slate-700">Porsi Investor ({settings.investorPct || 50}%)</td>
                <td className="py-3 px-2 text-right font-mono text-slate-800 font-bold">Rp {Math.round(investorShare).toLocaleString('id-ID')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signature Area */}
        <div className="mt-20 flex justify-end">
          <div className="text-center w-64">
            <p className="text-sm text-slate-600 mb-20">
              Dicetak pada: {new Date().toLocaleDateString('id-ID')}
            </p>
            <p className="font-bold text-slate-900 border-b border-slate-400 pb-1 inline-block min-w-[200px]">
              {settings.picName || "( _____________________ )"}
            </p>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Penanggung Jawab</p>
          </div>
        </div>

      </div>
    </div>
  );
}
