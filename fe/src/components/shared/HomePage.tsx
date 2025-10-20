"use client";

import React, { useEffect, useState } from "react";
import HeroSection from "./Hero";
import AboutSection from "./Aboutsection";
import StatsCarousel from "../pengunjung/dashboard/jurusansection";
import BeritaLates from "../pengunjung/dashboard/cardberita";
import IndustriKolaborasi from "../pengunjung/dashboard/industrikolab";
import ButtonAi from "../chatbot/ButtonAi";
import ChatbotModal from "../chatbot/ChatbotModal";
import KepalaSekolahSambutan from "../pengunjung/dashboard/SambutanKepalaSekolah";

interface HomePageProps {
  context: "pengunjung" | "siswa" | "industri";
}

const HomePage: React.FC<HomePageProps> = ({ context }) => {
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";

    // LOGIKA SCROLL
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 page-fade-in">
      {/* MODAL CHATBOT */}
      <ChatbotModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

      {/* CONTAINER FIXED UNTUK DUA TOMBOL (Flexbox Vertikal Rata Kanan) */}
      <div className="fixed right-4 md:right-8 bottom-4 md:bottom-8 z-50 flex flex-col-reverse items-end gap-3">
        {/* 1. Tombol Back to Top */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors"
            aria-label="Kembali ke atas"
          >
            ↑
          </button>
        )}

        {/* 2. Tombol AI (Chatbot) */}
        <ButtonAi onClick={() => setIsAiOpen(true)} />
      </div>

      <main>
        {/* HERO SECTION */}
        <div id="hero" className="relative">
          <HeroSection />
        </div>

        <div id="sambutan">
          <KepalaSekolahSambutan fotoUrl="/fotokepsek.png" />
        </div>

        {/* SEMUA SECTION LAIN (Tidak ada animasi) */}
        <div id="about">
          <AboutSection />
        </div>

        <div id="jurusan-stats" className="py-16 bg-white">
          <StatsCarousel />
        </div>

        <div id="prestasi">
          <BeritaLates />
        </div>

        <div id="kolaborasi">
          <IndustriKolaborasi />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
