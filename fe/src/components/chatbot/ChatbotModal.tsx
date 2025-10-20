// File: components/chatbot/ChatbotModal.tsx

"use client";

import React, { useState, useRef, useEffect } from 'react';
import { X, Maximize2, Send, Paperclip, ExternalLink } from 'lucide-react';
import { getGeminiResponse } from '@/lib/gemini';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface InitialCardProps {
  icon: string;
  text: string;
  onClick?: () => void;
}

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Komponen Card Pilihan Awal
const InitialCard: React.FC<InitialCardProps> = ({ icon, text, onClick }) => (
  <div
    className="flex items-center justify-center p-6 border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition duration-300 cursor-pointer text-gray-700 bg-white"
    onClick={onClick}
  >
    <div className="flex flex-col items-center">
      <span className="text-3xl mb-2">{icon}</span>
      <p className="text-center font-medium">{text}</p>
    </div>
  </div>
);

// Modal Chatbot
const ChatbotModal: React.FC<ChatbotModalProps> = ({ isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showInitialCards, setShowInitialCards] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = async () => {
    if (message.trim() && !isLoading) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        isUser: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setMessage('');
      setIsLoading(true);
      setShowInitialCards(false);

      try {
        const aiResponse = await getGeminiResponse(message.trim());
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponse,
          isUser: false,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCardClick = (cardType: string) => {
    let question = '';
    switch (cardType) {
      case 'jurusan':
        question = 'Tunjukkan informasi jurusan yang ada di SMKN 6 Malang';
        break;
      case 'program':
        question = 'Program apa saja yang ada di SMKN 6 Malang';
        break;
      case 'profile':
        question = 'Jelaskan secara lengkap profile sekolah ini';
        break;
      default:
        question = cardType;
    }
    setMessage(question);
    handleSendMessage();
  };

  return (
    // Backdrop: Overlay hitam transparan - hanya untuk fullscreen
    <div className={`fixed z-[60] transition-all duration-300 ${
      isFullscreen
        ? 'inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'
        : 'inset-0'
    }`}>

      {/* Container Modal Utama */}
      <div className={`bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
        isFullscreen
          ? 'w-full h-full rounded-none'
          : 'fixed right-4 bottom-24 w-96 h-[600px] max-w-[calc(100vw-2rem)]'
      }`}>

        {/* Header Modal */}
        <div className="w-full bg-white shadow-sm p-4 flex items-center justify-between z-10 border-b border-gray-200">
          <span className="text-lg font-bold text-gray-800">Aksata Virtual Assistant</span>
          <div className="flex items-center gap-2">
            {/* Tombol ke Halaman AI */}
            <button
              onClick={() => window.location.href = '/halaman-ai'}
              className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition px-3 py-1 rounded-lg hover:bg-gray-100 text-sm"
              aria-label="Buka Halaman AI"
            >
              <ExternalLink className="w-4 h-4" />
              Halaman AI
            </button>

            {/* Tombol Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-gray-600 hover:text-blue-500 transition p-1"
              aria-label="Toggle Fullscreen"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
            {/* Tombol Tutup */}
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-red-500 transition p-1"
              aria-label="Tutup Chatbot"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Konten Utama Chatbot */}
        <div className="flex-grow overflow-y-auto bg-gray-50">
          {showInitialCards ? (
            <div className="p-4">
              <div className="text-center mb-6">
                <h1 className={`${isFullscreen ? 'text-4xl' : 'text-2xl'} font-extrabold text-gray-900 mb-2`}>
                  Hai, ada yang bisa AVA bantu?
                </h1>
                <p className="text-gray-600 text-sm">
                  Pilih informasi sekolah yang tersedia di bawah, atau ketik pertanyaan lain tentang SMKN 6 Malang
                </p>
              </div>

              {/* Pilihan Card Awal */}
              <div className={`grid grid-cols-1 gap-4 mb-8 ${isFullscreen ? 'md:grid-cols-3' : ''}`}>
                <InitialCard
                  icon="👤"
                  text="Tunjukkan informasi jurusan yang ada di SMKN 6 Malang"
                  onClick={() => handleCardClick('jurusan')}
                />
                <InitialCard
                  icon="📖"
                  text="Program apa saja yang ada di SMKN 6 Malang"
                  onClick={() => handleCardClick('program')}
                />
                <InitialCard
                  icon="📜"
                  text="Jelaskan secara lengkap profile sekolah ini"
                  onClick={() => handleCardClick('profile')}
                />
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.isUser
                        ? 'bg-orange-500 text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    <span className={`text-xs ${msg.isUser ? 'text-orange-100' : 'text-gray-500'} mt-1 block`}>
                      {msg.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Chat - Footer modal */}
        <div className="w-full p-3 bg-white border-t border-gray-200 shadow-inner">
          <div className={`${isFullscreen ? 'max-w-4xl' : 'max-w-full'} mx-auto flex items-center bg-transparent border border-gray-300 rounded-full p-1 pr-1 shadow-md`}>

            {/* Ikon Attach/Klip kertas */}
            <button className="p-2 ml-2 text-gray-500 hover:text-gray-700 transition">
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Input Teks */}
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ketik pesan Anda di sini..."
              className="flex-grow bg-transparent p-2 focus:outline-none text-gray-800"
            />

            {/* Tombol Kirim */}
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className={`p-3 ml-2 rounded-full shadow-lg transition duration-300 ${
                message.trim()
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatbotModal;
