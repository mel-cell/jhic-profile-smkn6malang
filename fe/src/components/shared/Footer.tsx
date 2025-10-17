  'use client';

import Link from "next/link";
import React from "react";
import dynamic from "next/dynamic";
import { usePathname } from 'next/navigation';

import MapWrapper from "../MapWrapper";

export const Map = dynamic(() => import("../Map"), {
  ssr: false, // Disable server-side rendering for the map component
});

const Footer = () => {
  const pathname = usePathname();
  const context = pathname.startsWith('/siswa') ? 'siswa' : pathname.startsWith('/industri') ? 'industri' : 'pengunjung';
  const position: [number, number] = [-7.966, 112.632]; // Koordinat SMK Negeri 6 Malang
  const zoom = 15; // Zoom level

  const getNavLinks = (context: string) => {
    const baseLinks = [
      { name: 'Beranda', href: context === 'pengunjung' ? '/' : `/${context}` },
      { name: 'About', href: context === 'pengunjung' ? '/about' : `/${context}/about` },
      { name: 'Jurusan', href: context === 'pengunjung' ? '/jurusan' : `/${context}/jurusan` },
      { name: 'Berita', href: context === 'pengunjung' ? '/berita' : `/${context}/berita` },
    ];

    if (context === 'pengunjung') {
      baseLinks.push(
        { name: 'Industri', href: '/industri' },
        { name: 'PPDB', href: '/Pendaftaran' }
      );
    } else if (context === 'siswa') {
      baseLinks.push(
        { name: 'Lowongan', href: '/siswa/lowongan' },
        { name: 'Profile', href: '/siswa/profile' }
      );
    } else if (context === 'industri') {
      baseLinks.push(
        { name: 'CV Siswa', href: '/industri/cvSiswa' },
        { name: 'Lowongan', href: '/industri/lowongan' },
        { name: 'Profile', href: '/industri/profile' }
      );
    }

    return baseLinks;
  };

  const navLinks = getNavLinks(context);

  return (
    <footer className="bg-yellow-400 text-black px-4 md:px-6 lg:px-10 py-6 md:py-8 lg:py-10">
      <div className="max-w-7xl justify-center mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
        {/* Kiri */}
        <div className="space-y-4 ">
          <h2 className="text-xl md:text-2xl font-semibold">SMK Negeri 6 Malang</h2>
          <p className="text-sm md:text-base">Pusat keunggulan Teknik & inovasi</p>
          <div className="space-y-2">
            <p className="text-sm md:text-base">Ikuti kami di sosial media</p>
            <div className="flex space-x-4 text-xl md:text-2xl">
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
        <div className="grid grid-cols-2 gap-y-2 text-sm md:text-base">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="hover:underline">
              {link.name}
            </Link>
          ))}
        </div>

        {/* Kanan */}
        <div className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold">Location</h2>
          <div className="mb-2">
            <MapWrapper position={position} zoom={zoom} />
          </div>
          <p className="text-sm md:text-base">
            Jl. Ki Ageng Gribig<br />
            No.28, Madyopuro, Kec. Kedungkandang, Kota Malang, Jawa Timur
          </p>
        </div>
      </div>

      <div className="border-t border-black mt-6 md:mt-8 pt-3 text-center text-sm md:text-base">
        copyright© 2025 Lumicode. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
