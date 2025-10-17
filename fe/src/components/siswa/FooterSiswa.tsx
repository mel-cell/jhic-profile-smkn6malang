'use client';

import Link from "next/link";
import React from "react";
import dynamic from "next/dynamic";

import MapWrapper from "../MapWrapper";

export const Map = dynamic(() => import("../Map"), {
  ssr: false, // Disable server-side rendering for the map component
});

// Komponen Footer

const FooterSiswa = () => {
  const position: [number, number] = [-7.966, 112.632]; // Koordinat SMK Negeri 6 Malang
  const zoom = 15; // Zoom level

  return (
    <footer className="bg-yellow-400 text-black px-10 py-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Kiri */}
        <div>
          <h2 className="text-2xl font-semibold">SMK Negeri 6 Malang</h2>
          <p className="text-sm mt-1">Pusat keunggulan Teknik & inovasi</p>
          <div className="mt-6">
            <p className="mb-2">Ikuti kami di sosial media</p>
            <div className="flex space-x-4 text-2xl">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-youtube" />
              </a>
            </div>
          </div>
        </div>

        {/* Tengah - Navigasi */}
        {/* Tengah - Navigasi Horizontal */}
{/* Tengah - Navigasi 2 kolom (3 kiri, 3 kanan) */}
<div className="grid grid-cols-2 gap-y-2 text-sm">
  <Link href="/siswa" className="hover:underline">Beranda</Link>
  <Link href="/siswa/berita" className="hover:underline">Berita</Link>
  <Link href="/siswa/about" className="hover:underline">About</Link>
  <Link href="/siswa/lowongan" className="hover:underline">Lowongan</Link>
  <Link href="/siswa/jurusan" className="hover:underline">Jurusan</Link>
  <Link href="/siswa/profile" className="hover:underline">Profile</Link>
</div>


        {/* Kanan */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Location</h2>
          <div className="mb-2">
            <MapWrapper position={position} zoom={zoom} />
          </div>
          <p className="text-sm">
            Jl. Ki Ageng Gribig<br />
            No.28, Madyopuro, Kec. Kedungkandang, Kota Malang, Jawa Timur
          </p>
        </div>
      </div>

      <div className="border-t border-black mt-6 pt-3 text-center text-sm">
        copyright© 2025 Lumicode. All rights reserved.
      </div>
    </footer>
  );
};

export default FooterSiswa;
