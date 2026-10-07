"use client";

import { useState } from "react";
import { useDepotStore } from "@/store/useDepotStore";
import { Users, UserPlus, CreditCard } from "lucide-react";

export default function StaffCRM() {
  const { customers, addCustomer, updateCustomerDebt } = useDepotStore();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const [paymentCustomerId, setPaymentCustomerId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number | "">("");

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    addCustomer({ name: newName, phone: newPhone });
    setNewName("");
    setNewPhone("");
    setShowAddForm(false);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentCustomerId || !paymentAmount) return;
    // Bayar hutang berarti mengurangi nilai hutang (amountChange negatif)
    updateCustomerDebt(paymentCustomerId, -Number(paymentAmount));
    setPaymentCustomerId(null);
    setPaymentAmount("");
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-normal text-slate-900  tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-brand-500" />
            Pelanggan & Bon
          </h1>
          <p className="text-sm text-slate-500  mt-2">Kelola daftar pelanggan dan pembayaran hutang bon.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-full shadow-md transition flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Pelanggan</span>
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white  p-8 rounded-3xl border border-slate-200  shadow-[0_4px_12px_rgba(0,0,0,0.04)] animate-in fade-in slide-in-from-top-4">
          <h3 className="font-medium text-lg text-slate-800  border-b border-slate-100  pb-3 mb-5">Tambah Pelanggan Baru</h3>
          <form onSubmit={handleAddCustomer} className="flex flex-col sm:flex-row gap-4">
            <input type="text" placeholder="Nama Pelanggan / Warung" value={newName} onChange={e => setNewName(e.target.value)} required className="flex-1 p-4 rounded-xl bg-white  text-slate-900  border border-slate-200  focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
            <input type="text" placeholder="Nomor WA (Opsional)" value={newPhone} onChange={e => setNewPhone(e.target.value)} className="flex-1 p-4 rounded-xl bg-white  text-slate-900  border border-slate-200  focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
            <button type="submit" className="px-8 py-4 bg-slate-900  hover:bg-slate-800 :bg-[#3f4247] text-white font-medium rounded-full whitespace-nowrap transition">Simpan Data</button>
          </form>
        </div>
      )}

      {paymentCustomerId && (
        <div className="fixed inset-0 bg-slate-900/50 /80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white  rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-200 ">
            <h3 className="font-medium text-2xl mb-2 flex items-center gap-3 text-slate-900 ">
              <CreditCard className="w-6 h-6 text-emerald-500" />
              Bayar Hutang Bon
            </h3>
            <p className="text-sm text-slate-500  mb-6 leading-relaxed">
              Pelanggan: <strong className="text-slate-900 ">{customers.find(c => c.id === paymentCustomerId)?.name}</strong><br/>
              Total Hutang: <strong className="text-rose-500 font-mono">Rp {customers.find(c => c.id === paymentCustomerId)?.debtAmount.toLocaleString('id-ID')}</strong>
            </p>
            <form onSubmit={handlePayment} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700  mb-2 uppercase tracking-widest">Jumlah Dibayar (Rp)</label>
                <input type="number" min="1" max={customers.find(c => c.id === paymentCustomerId)?.debtAmount || 100000000} value={paymentAmount} onChange={e => setPaymentAmount(Number(e.target.value))} required className="w-full p-4 rounded-xl bg-white  text-slate-900  border border-slate-200  font-mono focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setPaymentCustomerId(null)} className="flex-1 py-4 bg-slate-100  hover:bg-slate-200 :bg-[#3f4247] text-slate-700  font-medium rounded-full transition">Batal</button>
                <button type="submit" className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-full shadow-md transition">Konfirmasi Pembayaran</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white  rounded-3xl border border-slate-200  shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50  text-slate-500  border-b border-slate-100 ">
              <tr>
                <th className="p-5 font-bold text-xs uppercase tracking-widest">Nama Pelanggan</th>
                <th className="p-5 font-bold text-xs uppercase tracking-widest">Kontak</th>
                <th className="p-5 font-bold text-xs uppercase tracking-widest text-center">Galon Dipinjam</th>
                <th className="p-5 font-bold text-xs uppercase tracking-widest text-right">Hutang (Rp)</th>
                <th className="p-5 font-bold text-xs uppercase tracking-widest text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 ">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 :bg-[#2b2d31]/50 transition-colors">
                  <td className="p-5 font-medium text-slate-900 ">{c.name}</td>
                  <td className="p-5 font-mono text-slate-500  text-xs">{c.phone || '-'}</td>
                  <td className="p-5 text-center font-mono">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${c.borrowedGallons > 0 ? 'bg-amber-50 /10 text-amber-600 ' : 'bg-slate-100  text-slate-500 '}`}>
                      {c.borrowedGallons}
                    </span>
                  </td>
                  <td className="p-5 text-right font-mono font-medium">
                    <span className={c.debtAmount > 0 ? 'text-rose-500' : 'text-slate-500 '}>
                      {c.debtAmount > 0 ? `Rp ${c.debtAmount.toLocaleString('id-ID')}` : '-'}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    {c.debtAmount > 0 && (
                      <button 
                        onClick={() => setPaymentCustomerId(c.id)}
                        className="px-4 py-2 bg-emerald-50 /10 text-emerald-600  hover:bg-emerald-100 :bg-emerald-500/20 rounded-full text-xs font-bold transition-colors"
                      >
                        Bayar Bon
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-500 ">Belum ada pelanggan terdaftar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
