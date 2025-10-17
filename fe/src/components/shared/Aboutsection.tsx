// src/components/pengunjung/dashboard/AboutSection.tsx

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const AboutSection: React.FC = () => {
  return (
    <section className="w-full bg-white py-20 px-4 md:px-0 pb-50"> 
      <div className="w-full max-w-7xl pt-20 mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-10 items-center">
        {/* Teks - Menggunakan class kustom content-reveal */}
        <div
          className="
            md:pr-8
            opacity-100 content-reveal delay-500 /* <== CLASS BARU */
          "
        >
          <p className="text-red-600 font-bold mb-3 tracking-wider uppercase text-sm animate-fade-in-up delay-100">Sedikit tentang kami</p>

          <h2 className="text-3xl md:text-4xl font-extrabold text-[#003087] leading-tight mb-5 border-l-4 border-red-600 pl-4 animate-fade-in-up delay-200">
            SMKN 6 Malang – menjadi pilar keunggulan Teknik dan teknologi
          </h2>

          <p className="text-gray-800 text-lg leading-relaxed mb-8 animate-fade-in-up delay-300">
            <strong>SMKN 6 Malang</strong> adalah sekolah kejuruan negeri yang
            berlokasi strategis di Kota Malang, fokus pada pengembangan
            keterampilan praktis, karakter unggul, dan kesiapan kerja siswa.
            Dengan fasilitas modern, pengajar profesional, serta jaringan mitra
            industri yang luas.
          </p>
          <Link href="/prestasi">
            <button
              className="
                bg-red-600 hover:bg-red-700 text-white font-semibold
                px-8 py-4 rounded-full transition duration-300
                shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                animate-fade-in-up delay-400
              "
            >
              Lihat Prestasi Kami →
            </button>
          </Link>
        </div>
         {/* Gambar - Menggunakan class kustom content-reveal */}
        <div
          className="
            grid grid-cols-2 gap-4 shadow-xl rounded-3xl p-1 bg-white transition duration-500
            opacity-100 content-reveal delay-300 /* <== CLASS BARU */
          "
        >

          <div
            className="row-span-2 overflow-hidden rounded-tl-3xl rounded-bl-3xl
            transform transition duration-300 hover:scale-[1.03] hover:shadow-2xl cursor-pointer"
          >
            <Image
              src="/foto3.webp"
              alt="Kunjungan Industri"
              width={500}
              height={500}
              className="object-cover w-full h-full transition duration-500 hover:brightness-105"
            />
          </div>

          <div
            className="overflow-hidden rounded-tr-3xl rounded-bl-3xl
            transform transition duration-300 hover:scale-[1.03] hover:shadow-2xl cursor-pointer"
          >
            <Image
              src="/foto1.webp"
              alt="Kelas Industri"
              width={250}
              height={240}
              className="object-cover w-full h-full shadow-md transition duration-500 hover:shadow-xl"
            />
          </div>

          <div
            className="overflow-hidden rounded-br-3xl rounded-tl-xl
            transform transition duration-300 hover:scale-[1.03] hover:shadow-2xl cursor-pointer"
          >
            <Image
              src="/foto2.webp"
              alt="Praktikum Teknik"
              width={250}
              height={240}
              className="object-cover w-full h-full shadow-md transition duration-500 hover:shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;