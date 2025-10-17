// File: src/app/(main)/halaman-ai/layout.ts

import React from 'react';
import type { Metadata } from 'next';

// Anda bisa menambahkan metadata di sini jika diperlukan
export const metadata: Metadata = {
  title: 'Aksata Virtual Assistant',
  description: 'Chatbot informasi SMKN 6 Malang',
};

interface AiGlobalLayoutProps {
  children: React.ReactNode;
}

// Layout ini menimpa MainLayout dan hanya merender children
export default function AiGlobalLayout({ children }: AiGlobalLayoutProps) {
  return (
    // Pastikan halaman mengambil tinggi penuh
    <div className="min-h-screen">
      {children}
    </div>
  );
}
