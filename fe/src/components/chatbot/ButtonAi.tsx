// File: components/chatbot/ButtonAi.js

"use client";

import React from 'react';
import Link from 'next/link'; // Gunakan Link lagi
import { Bot } from 'lucide-react';

interface ButtonAiProps {
  onClick?: () => void;
}

const ButtonAi: React.FC<ButtonAiProps> = ({ onClick }) => {
  return (
    // Ubah href ke URL baru: /halaman-ai
    <Link 
      href="/halaman-ai" // <--- PERUBAHAN UTAMA DI SINI
      // Styling dipertahankan untuk tombol fixed
      className="
        fixed right-8 bottom-8 z-50 
        bg-yellow-400 text-white 
        w-14 h-14 md:w-16 md:h-16 
        rounded-full shadow-2xl 
        flex items-center justify-center 
        transition duration-300 transform 
        hover:scale-105 hover:rotate-6 active:scale-95
        cursor-pointer
      "
      aria-label="Open Chatbot AI"
    >
      <Bot className="w-10 h-10 md:w-12 md:h-12" strokeWidth={2.5} />
    </Link>
  );
};

export default ButtonAi;