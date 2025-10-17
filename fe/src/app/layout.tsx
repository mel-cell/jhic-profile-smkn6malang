// File: src/app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from 'react'; // Tambahkan ini jika belum ada

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SMK Negeri 6 Malang",
  description: "Website resmi SMK Negeri 6 Malang",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id" className="h-full">
      <body
        // PERBAIKAN: Mengganti h-full menjadi min-h-screen untuk jaminan ketinggian
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-white text-gray-900`}
        suppressHydrationWarning={true}
      >
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
