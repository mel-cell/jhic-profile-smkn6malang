"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, GraduationCap, Users, Building2 } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
  color: string;
  icon: React.ReactNode;
}

interface Student {
  id: number;
  img: string;
}

// MENGGUNAKAN DATA STATS DARI KODE ASLI ANDA
const stats: StatItem[] = [
  { label: "Jurusan", value: "10", color: "bg-yellow-400", icon: <GraduationCap className="w-10 h-10" /> },
  { label: "Akreditasi", value: "A+", color: "bg-red-500 text-white", icon: <Building2 className="w-10 h-10" /> },
  { label: "Siswa", value: "1200+", color: "bg-blue-500 text-white", icon: <Users className="w-10 h-10" /> },
];

const students: Student[] = [
  { id: 1, img: "/dummyjurusan.webp" },
  { id: 2, img: "/dummyjurusan.webp" },
  { id: 3, img: "/dummyjurusan.webp" },
];

const StatsCarousel: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const prevslide = () => {
    setCurrent((prev) => (prev === 0 ? students.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === students.length - 1 ? 0 : prev + 1));
  };

  // Logika 3D: Menentukan offset dan skala untuk setiap gambar (sesuai mockup)
  const getSlideStyle = (i: number) => {
    // Jarak translasi yang lebih kecil agar gambar berdekatan
    const sideOffset = 180; 
    const scaleFactor = 0.65; // Skala gambar samping yang lebih kecil
    const zIndexFactor = students.length - Math.abs(current - i);

    if (i === current) {
      // Gambar utama
      return { transform: 'translateX(0px) scale(1)', opacity: 1, zIndex: 30 };
    } 
    if (i === (current - 1 + students.length) % students.length) {
      // Gambar Kiri (sebelumnya)
      return { transform: `translateX(-${sideOffset}px) scale(${scaleFactor})`, opacity: 1, zIndex: 20 };
    }
    if (i === (current + 1) % students.length) {
      // Gambar Kanan (berikutnya)
      return { transform: `translateX(${sideOffset}px) scale(${scaleFactor})`, opacity: 1, zIndex: 20 };
    }
    // Gambar yang sangat jauh (disembunyikan/dijauhkan)
    return { transform: 'translateX(0px) scale(0)', opacity: 0, zIndex: 10 };
  };

  return (
    <div className="w-full flex flex-col items-center gap-10 md:gap-14 animate-fade-in-up delay-100">

      {/* Bagian Stats - MENGGUNAKAN KODE ASLI ANDA */}
      <div className="flex flex-wrap justify-center gap-6 md:gap-15">
        {stats.map((s: StatItem, i: number) => (
          <div
            key={i}
            className={`${s.color} flex items-center gap-3 md:gap-5 pl-6 md:pl-8 pr-6 md:pr-9 py-4 md:py-5 rounded-full shadow-lg text-white font-bold stat-item`}
          >
            <div className="bg-white rounded-full p-2 md:p-3 text-black">{s.icon}</div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg md:text-2xl">{s.label}</span>
              <span className="text-2xl md:text-3xl text-center">{s.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bagian Carousel - Disesuaikan dengan desain mockup (gambar dan latar belakang) */}
      <div className="relative w-full max-w-6xl flex items-center justify-center h-[450px] md:h-[550px] lg:h-[600px] mt-6 md:mt-10 overflow-hidden">

        {/* Latar Belakang Lingkaran Putih Besar untuk Gambar Utama (Menggambarkan bentuk di mockup) */}
        <div className="absolute w-[350px] h-[350px] md:w-[400px] md:h-[400px] lg:w-[550px] lg:h-[550px] bg-white rounded-full shadow-inner"></div>

        {/* Tombol Kiri - Styling Minimalis sesuai mockup */}
        <button
          onClick={prevslide}
          className="absolute left-2 md:left-4 lg:left-10 z-30 text-black p-2 md:p-3 transition duration-300 transform hover:scale-110 active:scale-95"
          aria-label="Previous slide"
        >
          <ChevronLeft size={36} className="md:w-11 md:h-11" />
        </button>

        {/* Gambar Utama (3D Tumpukan) */}
        <div className="flex items-center justify-center overflow-visible relative w-full h-full perspective-1000">
          {students.map((s: Student, i: number) => {
            const style = getSlideStyle(i);
            const isCurrent = i === current;

            return (
              <div
                key={s.id}
                className={`
                  absolute transition-all duration-700 ease-in-out cursor-pointer z-20
                `}
                style={{
                    transform: style.transform,
                    opacity: style.opacity,
                    zIndex: style.zIndex,
                }}
                onClick={() => setCurrent(i)}
              >
                <div className="relative">
                    <Image
                      src={s.img}
                      alt={`Jurusan ${s.id}`}
                      // Ukuran gambar aktif (400) dan samping (300) sesuai mockup
                      width={isCurrent ? 350 : 250}
                      height={isCurrent ? 350 : 250}
                      // Gambar diberi rounded-full untuk menyamarkan batas persegi di mockup
                      className="rounded-full object-cover shadow-lg"
                    />
                    {/* Tanda Kuning di bawah kaki (sesuai mockup) */}
                    <div className={`
                        absolute left-1/2 bottom-0 w-3/4 h-6 md:h-8 bg-yellow-400 rounded-full
                        transform -translate-x-1/2 translate-y-2 z-40 shadow-xl transition-opacity duration-500
                        ${isCurrent ? 'opacity-100' : 'opacity-0'}
                    `}></div>
                    {/* Lingkaran putih di belakang gambar samping (sesuai mockup) */}
                    {!isCurrent && (
                        <div className={`
                            absolute inset-0 w-full h-full bg-white rounded-full z-[-1]
                            transform ${style.transform} scale-110
                        `}></div>
                    )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tombol Kanan - Styling Minimalis sesuai mockup */}
        <button
          onClick={nextSlide}
          className="absolute right-2 md:right-4 lg:right-10 z-30 text-black p-2 md:p-3 transition duration-300 transform hover:scale-110 active:scale-95"
          aria-label="Next slide"
        >
          <ChevronRight size={36} className="md:w-11 md:h-11" />
        </button>
      </div>

    </div>
  );
}

export default StatsCarousel;
