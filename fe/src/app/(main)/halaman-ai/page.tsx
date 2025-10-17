// File: src/app/(main)/halaman-ai/page.tsx

"use client";

import React from 'react';
import Link from 'next/link';

// Definisi Props untuk Komponen Card (Optional tapi dianjurkan di TS)
interface InitialCardProps {
  icon: string;
  text: string;
}

// Komponen Card Pilihan Awal
const InitialCard: React.FC<InitialCardProps> = ({ icon, text }) => (
  <div className="flex items-center justify-center p-6 border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition duration-300 cursor-pointer text-gray-700 bg-white">
    <div className="flex flex-col items-center">
      <span className="text-3xl mb-2">{icon}</span>
      <p className="text-center font-medium">{text}</p>
    </div>
  </div>
);

// Ganti nama HalamanAi menjadi HalamanAiPage
const HalamanAiPage: React.FC = () => {
  return (
    // Menggunakan min-h-screen agar halaman mengambil tinggi penuh
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      
      {/* Header Modal/Halaman dengan tombol kembali */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-sm p-4 flex items-center justify-between z-10">
        <div className="flex items-center">
          {/* Tombol kembali ke rute utama /pengunjung */}
          <Link 
            href="/"
            className="text-gray-600 hover:text-gray-800 transition mr-4"
            aria-label="Kembali ke Beranda"
          >
            {/* Ikon panah kembali */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <span className="text-lg font-bold text-gray-800">Aksata Virtual Assistant</span>
        </div>
      </div>

      {/* Konten Utama Chatbot (Halaman Awal) */}
      <div className="w-full max-w-4xl pt-20 pb-10"> 
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Hai, ada yang bisa AVA bantu?
          </h1>
          <p className="text-gray-600">
            Pilih informasi sekolah yang tersedia di bawah, atau ketik pertanyaan lain tentang SMKN 6 Malang
          </p>
        </div>

        {/* Pilihan Card Awal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <InitialCard 
            icon="👤" 
            text="Tunjukkan informasi jurusan yang ada di SMKN 6 Malang" 
          />
          <InitialCard 
            icon="📖" 
            text="Program apa saja yang ada di SMKN 6 Malang" 
          />
          <InitialCard 
            icon="📜" 
            text="Jelaskan secara lengkap profile sekolah ini" 
          />
        </div>

        {/* Input Chat */}
        <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-200 shadow-xl">
          <div className="max-w-4xl mx-auto flex items-center bg-transparent border border-gray-300 rounded-full p-1 pr-1 shadow-md">
            
            {/* Ikon Attach/Klip kertas */}
            <button className="p-2 ml-2 text-gray-500 hover:text-gray-700" aria-label="Lampirkan File">
              <svg className="w-6 h-6 transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486l6.586-6.414" />
              </svg>
            </button>
            
            {/* Input Teks */}
            <input
              type="text"
              placeholder="Ketik pesan Anda di sini..."
              className="flex-grow bg-transparent p-2 focus:outline-none text-gray-800"
            />
            
            {/* Tombol Kirim (Ikon Segitiga/Pesawat Kertas) */}
            <button className="bg-orange-500 hover:bg-orange-600 text-white p-3 ml-2 rounded-full shadow-lg transition duration-300" aria-label="Kirim Pesan">
              <svg className="w-6 h-6 transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HalamanAiPage;