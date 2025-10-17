"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { newsAPI } from "@/app/services/api";

interface NewsItem {
  id: string;
  judul: string;
  content: string;
  imagePath?: string;
  kategori?: string;
  createdAt: string;
}

const BeritaLates: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await newsAPI.getAll({ limit: 3 });
        if (response.success) {
          setNews(response.data);
        } else {
          setError("Failed to load news");
          setNews([]);
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news");
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    // Penambahan: Padding Vertikal Lebih Lega dan Background Putih Bersih
    <section className="py-20 pb-20 px-4 md:px-10 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Judul Section - Dibuat Lebih Menonjol dan Ditempatkan di Tengah */}
        <div className="mb-14 flex flex-col items-left animate-fade-in-up delay-100">
          {/* Tag Penekanan */}
          <div className="w-[300px] h-[60px] rounded-full bg-[#5b75a5] flex items-center justify-center text-white font-extrabold text-2xl shadow-xl transform hover:scale-105 transition duration-300">
            {/* Perubahan: Warna background ke biru korporat, ukuran teks lebih besar, dan shadow/hover effect */}
            Berita & Kegiatan
          </div>
        </div>

        {/* Card list */}
        <div className="flex justify-center gap-8 flex-wrap">
          {news.map((item: NewsItem, index: number) => (
            // Penambahan: Efek Hover Dinamis dan Bayangan yang Lebih Tegas
            <div
              key={index}
              className="
                bg-white w-full sm:w-80 min-h-[400px] rounded-3xl 
                shadow-xl overflow-hidden relative flex flex-col 
                transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl card-item
              "
            >
              {/* Image Container - Tambah efek zoom saat hover */}
              <div className="relative w-full h-52 rounded-t-3xl overflow-hidden">
                <Image
                  src={item.imagePath || "/berita1.webp"}
                  alt={item.judul}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 320px"
                  priority={index === 0}
                />
              </div>

              {/* Avatar/Icon Placeholder - Dibuat lebih kontras dan modern */}
              <div className="flex items-center -mt-8 ml-6 z-10 relative">
                <div className="w-16 h-16 rounded-full bg-[#000000] border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-white"></div>
              </div>

              <div className="px-6 pt-4 pb-6 flex-grow">
                <h3 className="text-xl font-extrabold text-[#003087] mb-2">
                  {item.judul}
                </h3>
                {/* Perubahan: Ukuran teks sedikit lebih besar untuk deskripsi */}
                <p className="text-base text-gray-700 leading-normal">
                  {item.content.length > 100 ? `${item.content.substring(0, 100)}...` : item.content}
                </p>
                <a
                  href="#"
                  className="
                    text-[#FF6600] text-sm mt-4 inline-block font-semibold 
                    hover:text-[#FF8800] transition duration-300 
                    border-b-2 border-transparent hover:border-[#FF6600]
                  "
                >
                  {/* Perubahan: Efek underline diganti menjadi border bottom dinamis */}
                  Baca Selengkapnya →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Indicator - Dibuat sedikit lebih besar dan warna yang lebih kontras */}
        <div className="mt-14 flex justify-center space-x-3">
          {/* Titik indikator sekarang diberi hover effect (opsional, jika ini bagian dari carousel) */}
          <span className="w-4 h-4 bg-gray-300 rounded-full transition-colors duration-300 hover:bg-gray-500 cursor-pointer"></span>
          <span className="w-4 h-4 bg-[#003087] rounded-full transition-colors duration-300 cursor-pointer"></span>
          <span className="w-4 h-4 bg-gray-300 rounded-full transition-colors duration-300 hover:bg-gray-500 cursor-pointer"></span>
        </div>
      </div>
    </section>
  );
};

export default BeritaLates;
