"use client";

import { useState } from "react";
import { useDepotStore } from "@/store/useDepotStore";
import { ShoppingCart, PackageCheck, Printer, XCircle } from "lucide-react";

export default function StaffDashboard() {
  const { settings, customers, inventory, addTransaction } = useDepotStore();
  
  const [channel, setChannel] = useState<'pickup' | 'delivery' | 'store'>('pickup');
  const [qty, setQty] = useState(1);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [gallonStatus, setGallonStatus] = useState<'tukar' | 'pinjam' | 'kembali' | 'baru'>('tukar');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | 'bon'>('cash');
  const [useStock, setUseStock] = useState<boolean>(false);
  
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [lastTx, setLastTx] = useState<any>(null);

  const unitPrice = channel === 'pickup' ? settings.pricePickup : (channel === 'delivery' ? settings.priceDelivery : settings.priceStore);
  const totalAmount = unitPrice * qty;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((paymentMethod === 'bon' || channel === 'store') && !customerId) {
      alert("Pilih pelanggan jika menggunakan fitur Titip Toko atau pembayaran Bon!");
      return;
    }

    const customer = customers.find(c => c.id === customerId);

    const tx = {
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      channel,
      qty,
      customerId,
      customerName: customer?.name || "Pelanggan Umum",
      gallonStatus,
      paymentMethod,
      totalAmount,
      useStock
    };

    addTransaction(tx);
    setLastTx({ ...tx, id: Date.now().toString() });
    setShowPrintModal(true);
    
    // Reset Form
    setQty(1);
    setCustomerId(null);
    setPaymentMethod('cash');
    setGallonStatus('tukar');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-normal text-slate-900 tracking-tight flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-brand-500" />
            Kasir Penjualan
          </h1>
          <p className="text-sm text-slate-500 mt-2">Input transaksi galon baru secara real-time.</p>
        </div>
        
        {/* Info Widget */}
        <div className="bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-100 flex items-center gap-4">
          <div>
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Galon Terisi (Ready)</p>
            <p className="text-2xl font-mono font-bold text-emerald-600">{inventory?.filledGallons || 0} <span className="text-sm">Pcs</span></p>
          </div>
          <div className="h-10 w-px bg-emerald-200"></div>
          <div>
            <p className="text-xs font-bold text-sky-700 uppercase tracking-widest">Sisa Toren</p>
            <p className="text-2xl font-mono font-bold text-sky-600">{inventory?.currentWaterLiters || 0} <span className="text-sm">L</span></p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-3 uppercase tracking-widest">1. Pilih Layanan</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className={`cursor-pointer p-5 rounded-2xl border-2 text-center transition ${channel === 'pickup' ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-slate-200 hover:border-brand-300'}`}>
                <input type="radio" name="channel" value="pickup" checked={channel === 'pickup'} onChange={() => setChannel('pickup')} className="hidden" />
                <div className="font-bold text-lg">Ambil Sendiri</div>
                <div className="text-sm text-slate-500 mt-1 font-mono">Rp {settings.pricePickup?.toLocaleString('id-ID')}</div>
              </label>
              <label className={`cursor-pointer p-5 rounded-2xl border-2 text-center transition ${channel === 'delivery' ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-slate-200 hover:border-brand-300'}`}>
                <input type="radio" name="channel" value="delivery" checked={channel === 'delivery'} onChange={() => setChannel('delivery')} className="hidden" />
                <div className="font-bold text-lg">Diantar Kurir</div>
                <div className="text-sm text-slate-500 mt-1 font-mono">Rp {settings.priceDelivery?.toLocaleString('id-ID')}</div>
              </label>
              <label className={`cursor-pointer p-5 rounded-2xl border-2 text-center transition ${channel === 'store' ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-slate-200 hover:border-brand-300'}`}>
                <input type="radio" name="channel" value="store" checked={channel === 'store'} onChange={() => setChannel('store')} className="hidden" />
                <div className="font-bold text-lg">Titip Toko</div>
                <div className="text-sm text-slate-500 mt-1 font-mono">Rp {settings.priceStore?.toLocaleString('id-ID')}</div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-3 uppercase tracking-widest">2. Jumlah Galon</label>
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="w-14 h-14 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 transition font-medium text-2xl">-</button>
              <input type="number" min="1" value={qty} onChange={(e) => setQty(Number(e.target.value) || 1)} className="flex-1 text-center font-mono font-medium text-3xl p-3 rounded-full bg-white text-slate-900 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition" />
              <button type="button" onClick={() => setQty(qty + 1)} className="w-14 h-14 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 transition font-medium text-2xl">+</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-3 uppercase tracking-widest">3. Pelanggan / Toko</label>
              <select value={customerId || ''} onChange={(e) => setCustomerId(e.target.value || null)} required={channel === 'store'} className="w-full p-4 rounded-xl bg-white text-slate-900 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition">
                <option value="">{channel === 'store' ? "-- Pilih Toko Tujuan --" : "Pelanggan Umum"}</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-3 uppercase tracking-widest">4. Status Galon</label>
              <select value={gallonStatus} onChange={(e) => setGallonStatus(e.target.value as any)} className="w-full p-4 rounded-xl bg-white text-slate-900 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition">
                <option value="tukar">Tukar Galon Kosong</option>
                <option value="pinjam">Pinjam Galon (+)</option>
                <option value="kembali">Kembalikan Pinjaman (-)</option>
                <option value="baru">Beli Galon Baru</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-3 uppercase tracking-widest">Sumber Air</label>
              <select value={useStock ? "stock" : "toren"} onChange={(e) => setUseStock(e.target.value === "stock")} disabled={gallonStatus === 'kembali'} className="w-full p-4 rounded-xl bg-white text-slate-900 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition disabled:opacity-50 disabled:bg-slate-50">
                <option value="toren">Isi Langsung (Toren)</option>
                <option value="stock">Ambil Galon Stock Ready</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-3 uppercase tracking-widest">5. Metode Pembayaran</label>
            <div className="grid grid-cols-3 gap-4">
              {['cash', 'qris', 'bon'].map(method => (
                <label key={method} className={`cursor-pointer p-4 rounded-xl border-2 text-center text-sm font-bold uppercase tracking-wider transition ${paymentMethod === method ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-slate-200 text-slate-700 hover:border-brand-300'}`}>
                  <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method as any)} className="hidden" />
                  {method}
                </label>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <span className="text-slate-500 font-medium text-lg">Total Pembayaran:</span>
              <span className="text-4xl font-mono font-medium text-emerald-500">Rp {totalAmount.toLocaleString('id-ID')}</span>
            </div>
            <button type="submit" className="w-full py-4 bg-brand-500 hover:bg-brand-600 text-white font-medium text-lg rounded-full shadow-md transition">
              Simpan Transaksi
            </button>
          </div>

        </form>
      </div>

      {/* Print Modal */}
      {showPrintModal && lastTx && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-slate-200 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <PackageCheck className="w-8 h-8" />
            </div>
            <h3 className="font-medium text-2xl text-slate-900 mb-2">Transaksi Berhasil!</h3>
            <p className="text-slate-500 mb-6 font-mono text-xl">Rp {lastTx.totalAmount.toLocaleString('id-ID')}</p>
            
            <div className="flex flex-col gap-3">
              <button onClick={handlePrint} className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-full shadow-md transition flex items-center justify-center gap-2">
                <Printer className="w-5 h-5" /> Cetak Struk
              </button>
              <button onClick={() => setShowPrintModal(false)} className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-full transition flex items-center justify-center gap-2">
                <XCircle className="w-5 h-5" /> Selesai & Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Receipt Element for Printing */}
      {lastTx && (
        <div id="printableReceipt" className="hidden print:block bg-white text-black p-6 font-mono text-xs w-[80mm] mx-auto border-2 border-black border-dashed">
          <div className="text-center border-b border-black pb-2 mb-2">
            <h2 className="text-lg font-bold">DepotPro AI</h2>
            <p>Air Minum RO & UV</p>
          </div>
          
          <div className="mb-2">
            <p>Tgl: {lastTx.date} {lastTx.time}</p>
            <p>Kasir: Staff / Admin</p>
            <p>Plg: {lastTx.customerName}</p>
          </div>
          
          <table className="w-full mb-2 border-b border-black pb-2">
            <tbody>
              <tr>
                <td className="py-1">{lastTx.qty}x Galon ({lastTx.channel})</td>
                <td className="py-1 text-right">Rp {lastTx.totalAmount.toLocaleString('id-ID')}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-600">Status: {lastTx.gallonStatus}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
          
          <div className="flex justify-between font-bold text-sm mb-4">
            <span>TOTAL</span>
            <span>Rp {lastTx.totalAmount.toLocaleString('id-ID')}</span>
          </div>
          
          <div className="text-center mb-2">
            <p>Pembayaran: {lastTx.paymentMethod.toUpperCase()}</p>
          </div>
          
          <div className="text-center pt-2 border-t border-black text-[10px]">
            <p>Terima Kasih!</p>
            <p>Layanan Pelanggan: 0812-xxxx-xxxx</p>
          </div>
        </div>
      )}
    </div>
  );
}
