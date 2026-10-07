"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ChevronRight, ChevronLeft, Droplets, 
  TrendingUp, ShieldCheck, Database, ShoppingCart, 
  Users, Calculator, LayoutDashboard, Zap, Presentation
} from "lucide-react";

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: "title",
      content: (
        <div className="flex flex-col items-center justify-center text-center h-full animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 rounded-full bg-brand-500 mx-auto flex items-center justify-center text-white mb-8 shadow-xl shadow-brand-500/30">
            <Droplets className="w-12 h-12" />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
            DepotPro <span className="text-brand-500">AI</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 max-w-2xl leading-relaxed">
            Solusi Digital Modern untuk Manajemen Depot Air Minum Masa Kini.
          </p>
        </div>
      )
    },
    {
      id: "problem",
      content: (
        <div className="flex flex-col justify-center h-full max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
          <h2 className="text-4xl font-bold text-slate-900 mb-4 border-b border-slate-200 pb-4">Tantangan Usaha Depot</h2>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">Mengelola depot secara manual atau dengan aplikasi jadul menimbulkan banyak masalah fatal:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100">
              <h3 className="text-rose-800 font-bold text-xl mb-2">💸 Piutang Bocor</h3>
              <p className="text-rose-700/80">Catatan "Bon" di buku tulis sering hilang. Penagihan jadi sulit dan canggung.</p>
            </div>
            <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100">
              <h3 className="text-rose-800 font-bold text-xl mb-2">📦 Stok Tidak Sinkron</h3>
              <p className="text-rose-700/80">Galon kosong & isi tercampur. Air toren tiba-tiba habis tanpa peringatan.</p>
            </div>
            <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100">
              <h3 className="text-rose-800 font-bold text-xl mb-2">📉 Laba Palsu</h3>
              <p className="text-rose-700/80">Omzet besar tapi uang kas habis untuk operasional. HPP tidak pernah dihitung detail.</p>
            </div>
            <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100">
              <h3 className="text-rose-800 font-bold text-xl mb-2">🐢 UI yang Rumit</h3>
              <p className="text-rose-700/80">Staff (Kasir) kesulitan input data karena tampilan sistem lama yang kaku & membingungkan.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "solution",
      content: (
        <div className="flex flex-col items-center justify-center text-center h-full max-w-4xl mx-auto animate-in slide-in-from-right-8 duration-500">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-8">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Memperkenalkan DepotPro AI</h2>
          <p className="text-xl text-slate-600 mb-12 leading-relaxed">
            Sebuah platform super ringan, pintar, dan elegan. Dirancang khusus untuk menyelesaikan masalah depot secara otomatis dengan antarmuka yang sangat memanjakan mata.
          </p>
          <div className="flex gap-4">
            <span className="px-6 py-3 bg-slate-100 text-slate-700 rounded-full font-bold">Role Admin & Staff</span>
            <span className="px-6 py-3 bg-slate-100 text-slate-700 rounded-full font-bold">100% Realtime</span>
            <span className="px-6 py-3 bg-slate-100 text-slate-700 rounded-full font-bold">Cloud-Ready</span>
          </div>
        </div>
      )
    },
    {
      id: "feature-1",
      content: (
        <div className="flex flex-col justify-center h-full max-w-5xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-brand-100 text-brand-500 rounded-2xl flex items-center justify-center">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-bold text-slate-900">POS Pintar & Cepat</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <p className="text-lg text-slate-600">Sistem kasir dirancang dengan tombol-tombol raksasa (Pill Design) agar kasir bisa klik dengan cepat tanpa meleset.</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center mt-1 flex-shrink-0">✓</div>
                  <p className="text-slate-700"><strong>Sistem Titip Toko:</strong> Mendukung pengiriman massal ke warung dengan hitungan komisi otomatis.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center mt-1 flex-shrink-0">✓</div>
                  <p className="text-slate-700"><strong>Pilihan Sumber Air:</strong> Kasir bisa memilih apakah mengisi air langsung dari Toren, atau mengambil Galon yang sudah Ready Stock.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center mt-1 flex-shrink-0">✓</div>
                  <p className="text-slate-700"><strong>Struk Cerdas:</strong> Modal Popup yang elegan siap dicetak kapanpun transaksi sukses dilakukan.</p>
                </li>
              </ul>
            </div>
            <div className="bg-slate-100 rounded-3xl p-6 border border-slate-200">
              <img src="/placeholder-pos.png" alt="POS Visual" className="w-full h-auto rounded-2xl opacity-50" />
              <div className="bg-white p-4 rounded-2xl mt-4 shadow-sm">
                <p className="text-xs font-bold text-emerald-600 uppercase">Galon Terisi (Ready)</p>
                <p className="text-2xl font-mono font-bold text-slate-800">45 Pcs</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "feature-2",
      content: (
        <div className="flex flex-col justify-center h-full max-w-5xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-sky-100 text-sky-500 rounded-2xl flex items-center justify-center">
              <Users className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-bold text-slate-900">Manajemen Bon & Retur Canggih</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <p className="text-lg text-slate-600">Tidak perlu lagi mencatat utang di buku tulis. Jika pelanggan berhutang, sistem akan menolak transaksi kecuali nama pelanggan dipilih.</p>
              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
                <h3 className="font-bold text-slate-800 mb-2">Auto-Rekap Pelanggan</h3>
                <p className="text-sm text-slate-600">Semua "Bon" dan "Galon Pinjaman" dijumlah otomatis atas nama masing-masing pelanggan. Pembayaran piutang bisa dicicil (Parsial).</p>
              </div>
              <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl shadow-sm">
                <h3 className="font-bold text-rose-800 mb-2">Sistem Retur (Revert)</h3>
                <p className="text-sm text-rose-700/80">Kasir salah ketik "10 galon" padahal cuma 1? Cukup ke Riwayat Transaksi ➔ klik Retur ➔ masukkan angka 9. Stok Gudang dan Uang Kas akan dikembalikan secara ajaib!</p>
              </div>
            </div>
            <div className="h-full flex items-center justify-center bg-slate-50 rounded-3xl border border-slate-200 p-10">
              <div className="w-full space-y-4">
                <div className="h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center px-4 justify-between">
                  <span className="w-1/3 h-4 bg-slate-200 rounded"></span>
                  <span className="w-16 h-6 bg-rose-100 rounded-full"></span>
                </div>
                <div className="h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center px-4 justify-between">
                  <span className="w-1/2 h-4 bg-slate-200 rounded"></span>
                  <span className="w-16 h-6 bg-emerald-100 rounded-full"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "feature-3",
      content: (
        <div className="flex flex-col justify-center h-full max-w-5xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-2xl flex items-center justify-center">
              <Database className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-bold text-slate-900">Gudang & Toren Realtime</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <Droplets className="w-12 h-12 text-sky-500 mb-4" />
              <h3 className="font-bold text-lg mb-2">Toren & Aset Air</h3>
              <p className="text-sm text-slate-500">Visualisasi ketinggian air dalam toren. Sistem akan berkedip merah jika stok air menipis & butuh truk isi ulang.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <Database className="w-12 h-12 text-emerald-500 mb-4" />
              <h3 className="font-bold text-lg mb-2">Pemisahan Stok Galon</h3>
              <p className="text-sm text-slate-500">Memisahkan secara logis mana Total Aset Galon, Galon Kosong Kotor, dan Galon Terisi yang Siap Jual (Ready).</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <Zap className="w-12 h-12 text-amber-500 mb-4" />
              <h3 className="font-bold text-lg mb-2">Sistem Opname Instan</h3>
              <p className="text-sm text-slate-500">Ada galon pecah atau selisih hitung fisik? Gunakan tombol "Sesuaikan Fisik" tanpa merusak alur transaksi keuangan.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "feature-4",
      content: (
        <div className="flex flex-col justify-center h-full max-w-5xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-purple-100 text-purple-500 rounded-2xl flex items-center justify-center">
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-bold text-slate-900">Bagi Hasil Tanpa Debat</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1 space-y-6">
              <p className="text-lg text-slate-600">Sebagai Pemilik (Admin), Anda disuguhi Dashboard KPI menyeluruh dari Omzet, Beban Operasional (OPEX), hingga Profit Murni.</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center mt-1 flex-shrink-0">✓</div>
                  <p className="text-slate-700"><strong>Kalkulator HPP Dinamis:</strong> Hitung modal air, tutup, segel, dan tisu per-galon untuk mendapatkan margin presisi.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center mt-1 flex-shrink-0">✓</div>
                  <p className="text-slate-700"><strong>Porsi Investor & Pengelola:</strong> Laba bersih otomatis dipotong sesuai persentase yang Anda setel di halaman Setup.</p>
                </li>
              </ul>
            </div>
            <div className="flex-1 bg-slate-900 rounded-3xl p-8 border border-slate-800 text-white shadow-2xl">
              <Calculator className="w-12 h-12 text-brand-500 mb-6" />
              <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Total Omzet</span>
                  <span className="text-emerald-400">Rp 12.000.000</span>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-rose-400">Beban OPEX</span>
                  <span className="text-rose-400">-Rp 3.500.000</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="font-bold text-white">Laba Bersih</span>
                  <span className="font-bold text-brand-400">Rp 8.500.000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "closing",
      content: (
        <div className="flex flex-col items-center justify-center text-center h-full max-w-3xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
          <div className="w-24 h-24 rounded-full bg-brand-100 flex items-center justify-center mb-8 border-4 border-white shadow-lg">
            <TrendingUp className="w-12 h-12 text-brand-600" />
          </div>
          <h2 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-6">Masa Depan Depot Air Minum</h2>
          <p className="text-2xl text-slate-500 mb-12 leading-relaxed">
            Tidak ada lagi catatan hilang. Tidak ada lagi stok selisih. DepotPro AI menghadirkan profesionalisme instan untuk usaha Anda.
          </p>
          <div className="flex gap-4">
            <button onClick={() => setCurrentSlide(0)} className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full transition">
              Mulai Ulang
            </button>
            <Link href="/login" className="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-full shadow-xl shadow-brand-500/20 transition flex items-center gap-2">
              <Presentation className="w-5 h-5" />
              Tutup Presentasi
            </Link>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
      {/* Progress Bar */}
      <div className="h-1.5 bg-slate-200 w-full fixed top-0 z-50">
        <div 
          className="h-full bg-brand-500 transition-all duration-500 ease-out" 
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 p-8 sm:p-12 lg:p-24 overflow-y-auto">
          {slides[currentSlide].content}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-between items-center bg-white/80 backdrop-blur-md border-t border-slate-200">
        <div className="text-slate-500 font-medium text-sm">
          Slide {currentSlide + 1} of {slides.length}
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-slate-100 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-30 disabled:hover:bg-brand-500 shadow-md shadow-brand-500/20 transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
