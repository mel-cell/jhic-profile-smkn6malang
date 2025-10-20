// File: components/chatbot/ButtonAi.tsx

"use client";

import React, { useState } from 'react';
import { Bot } from 'lucide-react';
import ChatbotModal from './ChatbotModal';

interface ButtonAiProps {
  onClick?: () => void;
}

const ButtonAi: React.FC<ButtonAiProps> = ({ onClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
    if (onClick) onClick();
  };

  return (
    <>
      {/* Modal Chatbot */}
      <ChatbotModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Tombol AI Fixed - Sekarang hanya membuka modal popup */}
      <button
        onClick={handleClick}
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
      </button>
    </>
  );
};

export default ButtonAi;
