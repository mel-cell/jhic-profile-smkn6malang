// src/components/KepalaSekolahSambutan.tsx
"use client";

import React from "react";
import Image from "next/image";

interface KepalaSekolahSambutanProps {
  namaKepalaSekolah?: string;
  jabatan?: string;
  sambutanText?: string;
  fotoUrl: string;
}

const KepalaSekolahSambutan: React.FC<KepalaSekolahSambutanProps> = ({
  namaKepalaSekolah = "Dr. [Nama Kepala Sekolah]",
  jabatan = "Kepala SMK Negeri 6 Malang",
  sambutanText = "",
  fotoUrl = "/fotokepsek.png",
}) => {
  // Logic penanganan teks sambutan
  const defaultSambutan = `Assalamualaikum Wr. Wb. Selamat datang di portal resmi SMK Negeri 6 Malang.
Kami berkomitmen untuk menjadi pilar keunggulan teknik dan teknologi, mencetak lulusan yang profesional, berkarakter unggul, dan siap kerja.
Dengan fasilitas modern dan kurikulum yang adaptif, kami siap menjadi jembatan sukses bagi masa depan siswa dan mendukung pertumbuhan industri di Malang dan sekitarnya. Mari bergabung bersama kami.`;

  const finalSambutanText = sambutanText.trim() === "" ? defaultSambutan : sambutanText;

  return (
    <section className="w-full bg-white py-20 px-4 md:px-0 pb-40">
      <div className="w-full max-w-7xl pt-30 mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-10 items-center">
        {/* Gambar - Menggunakan class kustom content-reveal */}
        <div
          className="
            grid grid-cols-1 gap-4 shadow-xl rounded-3xl p-1 bg-white transition duration-500
            opacity-100 content-reveal delay-300
          "
        >
          <div
            className="overflow-hidden rounded-3xl
            transform transition duration-300 hover:scale-120 hover:-translate-y-10 hover:z-10 cursor-pointer"
          >
            <Image
              src={fotoUrl}
              alt={namaKepalaSekolah}
              width={600}
              height={600}
                className="w-full h-auto object-contain max-h-90 md:max-h-96 shadow-lg rounded-md"
              
            />
          </div>
        </div>
        {/* Teks - Menggunakan class kustom content-reveal */}
        <div
          className="
            md:pr-8
            opacity-100 content-reveal delay-500 /* <== CLASS BARU */
          "
        >
          <p className="text-red-600 font-bold mb-3 tracking-wider uppercase text-sm animate-fade-in-up delay-100">Sambutan Kepala Sekolah</p>

          <h2 className="text-3xl md:text-4xl font-extrabold text-[#003087] leading-tight mb-5 border-l-4 border-red-600 pl-4 animate-fade-in-up delay-200">
            {namaKepalaSekolah} - {jabatan}
          </h2>

          <p className="text-gray-800 text-lg leading-relaxed mb-8 animate-fade-in-up delay-300">
            {finalSambutanText}
          </p>
        </div>
      </div>
    </section>
  );
};

export default KepalaSekolahSambutan;
