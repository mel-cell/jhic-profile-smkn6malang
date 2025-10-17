// src/app/prestasi-siswa/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/pengunjung/Header";
import Footer from "@/components/shared/Footer";
import { Trophy, ArrowUp } from "lucide-react";

// Data dummy (Dipertahankan di sini untuk kelengkapan)
const dummyPrestasi = [
  {
    namaSiswa: "Ahmad Rifai",
    prestasi: "Juara 1 LKS Web Technology",
    tahun: "2024",
    deskripsi:
      "Meraih juara pertama dalam Lomba Kompetensi Siswa (LKS) tingkat provinsi di bidang pengembangan website.",
  },
  {
    namaSiswa: "Bunga Melati",
    prestasi: "Medali Emas Olimpiade Sains Nasional (OSN)",
    tahun: "2023",
    deskripsi:
      "Memenangkan medali emas dalam Olimpiade Sains Nasional (OSN) untuk mata pelajaran Fisika Terapan.",
  },
  {
    namaSiswa: "Candra Kirana",
    prestasi: "Juara 3 Kompetisi IoT Nasional",
    tahun: "2024",
    deskripsi:
      "Meraih juara ketiga dalam kompetisi Internet of Things (IoT) yang diadakan oleh Kementerian Industri.",
  },
  {
    namaSiswa: "Daffa Ramadhan",
    prestasi: "Finalis FLS2N Desain Grafis",
    tahun: "2023",
    deskripsi:
      "Berhasil menjadi finalis pada Festival dan Lomba Seni Siswa Nasional (FLS2N) kategori Desain Grafis.",
  },
  {
    namaSiswa: "Erika Putri",
    prestasi: "Juara Harapan 1 Debate Bahasa Inggris",
    tahun: "2022",
    deskripsi:
      "Menjadi juara harapan satu dalam lomba debat Bahasa Inggris tingkat kota/kabupaten.",
  },
  {
    namaSiswa: "Fajar Wicaksono",
    prestasi: "Lolos Seleksi Duta Lingkungan Provinsi",
    tahun: "2024",
    deskripsi:
      "Terpilih sebagai Duta Lingkungan Provinsi Jawa Timur berkat proyek pengelolaan sampah berbasis teknologi.",
  },
];

// --- KOMPONEN ITEM PRESTASI (Sub-komponen untuk grid) ---
interface PrestasiItemProps {
  namaSiswa: string;
  prestasi: string;
  tahun: string;
  deskripsi: string;
}

const PrestasiItem: React.FC<PrestasiItemProps> = ({
  namaSiswa,
  prestasi,
  tahun,
  deskripsi,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-red-600 transition duration-300 hover:shadow-xl hover:scale-[1.01]">
    <div className="flex items-start mb-3">
      <div className="p-3 mr-4 rounded-full bg-yellow-100 text-yellow-600 flex-shrink-0">
        <Trophy className="w-6 h-6" />
      </div>

      <div className="text-left">
        {/* Nama Siswa: Baris 1 - Ukuran besar, tebal */}
        <h4 className="text-xl font-bold text-gray-800 leading-snug">
          {namaSiswa}
        </h4>

        {/* Prestasi dan Tahun: Baris 2 - Digabung dengan pemisah */}
        <p className="text-base text-red-600 font-medium leading-snug mt-0.5">
          {prestasi}
          <span className="text-gray-500 font-normal mx-2">|</span>
          <span className="text-gray-500 font-normal italic">{tahun}</span>
        </p>
      </div>
    </div>

    {/* Deskripsi */}
    <p className="text-gray-700 leading-relaxed text-base pt-3 border-t border-gray-100 mt-2">
      {deskripsi}
    </p>
  </div>
);
// -----------------------------------------------------------------

const PrestasiSiswaPage: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Kelas Transisi DITIRU PERSIS dari VisiMisi Anda
  const heroTransitionClass = `transition-all duration-1000 ease-out transform ${
    isMounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
  }`;
  const contentTransitionClass = `transition-all duration-1000 ease-out transform delay-300 ${
    isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
  }`;

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* 1. HERO SECTION: DITIRU PERSIS DARI KODE VISI DAN MISI */}
        <section
          className={`relative w-full h-[40vh] md:h-[60vh] flex items-center justify-center overflow-hidden ${heroTransitionClass}`}
        >
          <Image
            // PATH GAMBAR DITIRU PERSIS
            src="/aboutbg.webp"
            alt="Prestasi Siswa Background"
            fill
            className="object-cover brightness-[0.6] scale-110 transition-transform duration-[1500ms] ease-out"
            priority
            sizes="(max-width: 768px) 100vw, 100vw"
          />

          {/* JUDUL HERO: DITIRU PERSIS DENGAN PERUBAHAN TULISAN */}
          <h1
            className="
                            absolute left-0 bottom-4 md:bottom-8 lg:bottom-12 
                            ml-4 md:ml-8 lg:ml-12 
                            z-20 
                            text-white font-black 
                            text-4xl md:text-5xl lg:text-6xl 
                            tracking-wide drop-shadow-lg"
          >
            Prestasi Siswa
          </h1>
          {/* CATATAN: TIDAK ADA bottom border tambahan di sini, sesuai permintaan Anda */}
        </section>

        {/* 2. KONTEN PRESTASI GRID */}
        <section className={`py-20 bg-gray-50 ${contentTransitionClass}`}>
          <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-red-600 mb-2">
              Daftar Prestasi
            </h2>
            <p className="text-gray-600 mb-12 text-lg">
              Siswa siswi yang telah mencetak prestasi akademik dan non akademik
            </p>

            {/* Grid Prestasi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {dummyPrestasi.map((item, index) => (
                <PrestasiItem
                  key={index}
                  namaSiswa={item.namaSiswa}
                  prestasi={item.prestasi}
                  tahun={item.tahun}
                  deskripsi={item.deskripsi}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition duration-300 z-40"
        aria-label="Kembali ke atas"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
};

export default PrestasiSiswaPage;
