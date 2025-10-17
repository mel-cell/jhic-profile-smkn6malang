// File: components/chatbot/ChatbotModal.js (Gantikan HalamanAiPage sebelumnya)

"use client";

import React from 'react';
import { X } from 'lucide-react'; // Import ikon tutup

interface InitialCardProps {
  icon: string;
  text: string;
}

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
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

// Terima 'isOpen' dan 'onClose' dari HomeView
const ChatbotModal: React.FC<ChatbotModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Jika tidak terbuka, jangan render apa-apa

  return (
    // Backdrop: Overlay hitam transparan (menggunakan z-index tinggi)
    <div className="fixed inset-0 z-[60] bg-black bg-opacity-50 flex items-center justify-center p-4">
      
      {/* Container Modal Utama */}
      <div className="relative w-full max-w-4xl h-full md:h-[90vh] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header Modal - Gantikan Header page.js sebelumnya */}
        <div className="w-full bg-white shadow-sm p-4 flex items-center justify-between z-10 border-b border-gray-200">
          <span className="text-lg font-bold text-gray-800">Aksata Virtual Assistant</span>
          {/* Tombol Tutup */}
          <button 
            onClick={onClose} 
            className="text-gray-600 hover:text-red-500 transition"
            aria-label="Tutup Chatbot"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Konten Utama Chatbot */}
        <div className="flex-grow p-6 overflow-y-auto bg-gray-50">
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
                <InitialCard icon="👤" text="Tunjukkan informasi jurusan yang ada di SMKN 6 Malang" />
                <InitialCard icon="📖" text="Program apa saja yang ada di SMKN 6 Malang" />
                <InitialCard icon="📜" text="Jelaskan secara lengkap profile sekolah ini" />
            </div>
        </div>

        {/* Input Chat - Tidak lagi fixed, kini berada di footer modal */}
        <div className="w-full p-4 bg-white border-t border-gray-200 shadow-inner">
          <div className="max-w-4xl mx-auto flex items-center bg-transparent border border-gray-300 rounded-full p-1 pr-1 shadow-md">
            
            {/* Ikon Attach/Klip kertas */}
            <button className="p-2 ml-2 text-gray-500 hover:text-gray-700">
              {/* SVG Anda */}
            </button>
            
            {/* Input Teks */}
            <input
              type="text"
              placeholder="Ketik pesan Anda di sini..."
              className="flex-grow bg-transparent p-2 focus:outline-none text-gray-800"
            />
            
            {/* Tombol Kirim */}
            <button className="bg-orange-500 hover:bg-orange-600 text-white p-3 ml-2 rounded-full shadow-lg transition duration-300">
              {/* SVG Anda */}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatbotModal;