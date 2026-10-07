"use client";

import { useDepotStore } from "@/store/useDepotStore";
import { Settings, RefreshCw, Trash2, DatabaseZap } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminSetup() {
  const { 
    settings, updateSettings, resetData, inventory, updateInventory,
    addTransaction, addExpense, addCustomer, addTankHistory
  } = useDepotStore();
  
  const [pricePickup, setPricePickup] = useState(6000);
  const [priceDelivery, setPriceDelivery] = useState(7000);
  const [priceStore, setPriceStore] = useState(5000);
  const [storeCommission, setStoreCommission] = useState(1000);
  const [totalGallonAsset, setTotalGallonAsset] = useState(100);
  const [tankCapacity, setTankCapacity] = useState(5000);
  const [currentWater, setCurrentWater] = useState(0);

  const [depotName, setDepotName] = useState("DepotPro");
  const [depotAddress, setDepotAddress] = useState("");
  const [picName, setPicName] = useState("");

  useEffect(() => {
    setPricePickup(settings.pricePickup ?? 6000);
    setPriceDelivery(settings.priceDelivery ?? 7000);
    setPriceStore(settings.priceStore ?? 5000);
    setStoreCommission(settings.storeCommission ?? 1000);
    setTotalGallonAsset(settings.totalGallonAsset ?? 100);
    setTankCapacity(settings.tankCapacity ?? 5000);
    setCurrentWater(inventory?.currentWaterLiters ?? 0);
    setDepotName(settings.depotName ?? "DepotPro");
    setDepotAddress(settings.depotAddress ?? "");
    setPicName(settings.picName ?? "");
  }, [settings, inventory]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ pricePickup, priceDelivery, priceStore, storeCommission, totalGallonAsset, tankCapacity, depotName, depotAddress, picName });
    updateInventory(currentWater);
    alert("Pengaturan berhasil disimpan!");
  };

  const handleReset = () => {
    const pass = prompt("AWAS ZONA BAHAYA!\nMasukkan password Admin untuk menghapus SEMUA data:");
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS || "admin123";
    
    if (pass === adminPass) {
      resetData();
      alert("Semua data berhasil di-reset menjadi kosong.");
      window.location.reload();
    } else if (pass !== null) {
      alert("Password salah! Reset dibatalkan.");
    }
  };

  const handleLoadDemo = () => {
    if (confirm("Data saat ini akan direset lalu diisi data demo. Lanjutkan?")) {
      resetData();
      
      // Inject Demo Data
      updateSettings({ pricePickup: 6000, priceDelivery: 7000, priceStore: 5000, storeCommission: 1000, tankCapacity: 5000 });
      updateInventory(3500);
      
      addCustomer({ name: "Warung Bu Siti", phone: "08123" });
      addCustomer({ name: "Kost Bpk Budi", phone: "08124" });
      addCustomer({ name: "Toko Sinar Jaya", phone: "08999" });
      
      // Generate last 30 days dates
      const dates = Array.from({length: 30}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
      }).reverse();
      
      dates.forEach((date, i) => {
        // Transactions
        addTransaction({
          date, time: "09:30", channel: "pickup", qty: 3 + (i%5), customerId: null,
          customerName: "Pelanggan Umum", gallonStatus: "tukar", paymentMethod: "cash",
          totalAmount: (3 + (i%5)) * 6000
        });
        addTransaction({
          date, time: "11:00", channel: "delivery", qty: 2 + (i%3), customerId: "1",
          customerName: "Warung Barokah", gallonStatus: "tukar", paymentMethod: "cash",
          totalAmount: (2 + (i%3)) * 7000
        });
        if (i % 2 === 0) {
          addTransaction({
            date, time: "14:00", channel: "store", qty: 10, customerId: "3",
            customerName: "Toko Sinar Jaya", gallonStatus: "tukar", paymentMethod: "bon",
            totalAmount: 10 * 5000 // harga titip toko
          });
        }
        
        // Expense every 3 days
        if (i % 3 === 0) {
          addExpense({ date, category: "Bensin / Kendaraan", amount: 20000, description: "Bensin Motor" });
        }
        
        // Listrik every 30 days
        if (i === 0) {
          addExpense({ date, category: "Listrik", amount: 150000, description: "Token Listrik" });
        }
      });
      
      // Specific expenses for today
      const today = dates[dates.length - 1];
      addTankHistory({ date: today, litersAdded: 5000, pricePaid: 350000 });
      
      alert("Data Demo berhasil dimuat!");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-4xl font-normal text-slate-900 tracking-tight flex items-center gap-3">
          <Settings className="w-8 h-8 text-brand-500" />
          Pusat Input & Setup
        </h1>
        <p className="text-sm text-slate-500 mt-2">Atur harga jual dasar, komisi, stok toren, dan reset database.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)] md:col-span-2">
          <form onSubmit={handleSave} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-5">
                <h3 className="font-medium text-lg text-slate-800 border-b border-slate-100 pb-3">Harga Jual & Komisi</h3>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-widest">Ambil Sendiri (Rp)</label>
                    <input type="number" value={pricePickup} onChange={e => setPricePickup(Number(e.target.value))} required className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-widest">Diantar (Rp)</label>
                    <input type="number" value={priceDelivery} onChange={e => setPriceDelivery(Number(e.target.value))} required className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-widest">Titip Toko (Rp)</label>
                    <input type="number" value={priceStore} onChange={e => setPriceStore(Number(e.target.value))} required className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-widest">Komisi Toko (Rp)</label>
                    <input type="number" value={storeCommission} onChange={e => setStoreCommission(Number(e.target.value))} required className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <h3 className="font-medium text-lg text-slate-800 border-b border-slate-100 pb-3">Kapasitas Toren & Stok Galon</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-widest">Total Galon Milik Depot</label>
                    <input type="number" value={totalGallonAsset} onChange={e => setTotalGallonAsset(Number(e.target.value))} required className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-widest">Kapasitas Max (L)</label>
                    <input type="number" value={tankCapacity} onChange={e => setTankCapacity(Number(e.target.value))} required className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-widest">Sisa Air Toren (L)</label>
                    <input type="number" value={currentWater} onChange={e => setCurrentWater(Number(e.target.value))} required className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
                  </div>
                </div>
              </div>

              <div className="space-y-5 md:col-span-2">
                <h3 className="font-medium text-lg text-slate-800 border-b border-slate-100 pb-3">Profil & Laporan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-widest">Nama Depot</label>
                    <input type="text" value={depotName} onChange={e => setDepotName(e.target.value)} required placeholder="Misal: Depot Air Berkah" className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-widest">Alamat Lengkap</label>
                    <input type="text" value={depotAddress} onChange={e => setDepotAddress(e.target.value)} required placeholder="Misal: Jl. Mawar No. 12" className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-widest">Penanggung Jawab</label>
                    <input type="text" value={picName} onChange={e => setPicName(e.target.value)} required placeholder="Misal: Budi Santoso" className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
                  </div>
                </div>
              </div>

            </div>
            
            <button type="submit" className="w-full py-4 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-full transition flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" /> Simpan Pengaturan
            </button>
          </form>
        </div>

        <div className="bg-sky-50 p-8 rounded-3xl border border-sky-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <h3 className="font-medium text-sky-800 flex items-center gap-2 mb-3 text-lg">
              <DatabaseZap className="w-5 h-5" /> Data Demo & Testing
            </h3>
            <p className="text-sm text-sky-700 leading-relaxed">
              Gunakan fitur ini untuk <strong>mengisi puluhan data bohongan (dummy)</strong> agar Anda bisa melihat bagaimana tampilan dashboard, grafik HPP, dan tabel riwayat penuh dengan data.
            </p>
          </div>
          <button onClick={handleLoadDemo} className="w-full mt-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-full transition flex items-center justify-center gap-2">
            Isi dengan Data Demo
          </button>
        </div>

        <div className="bg-rose-50 p-8 rounded-3xl border border-rose-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <h3 className="font-medium text-rose-800 flex items-center gap-2 mb-3 text-lg">
              <Trash2 className="w-5 h-5" /> Zona Bahaya (Reset Total)
            </h3>
            <p className="text-sm text-rose-700 leading-relaxed">
              Menghapus SELURUH Riwayat Transaksi, Pelanggan, dan OPEX. <strong>Gunakan tombol ini saat Anda ingin memulai usaha dengan data asli.</strong>
            </p>
          </div>
          <button onClick={handleReset} className="w-full mt-8 py-3 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-full transition flex items-center justify-center gap-2">
            Kosongkan & Mulai Asli
          </button>
        </div>

      </div>
    </div>
  );
}
