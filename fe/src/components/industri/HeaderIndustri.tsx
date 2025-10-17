// File: components/industri/HeaderIndustri.js (atau HeaderIndustri.tsx)

"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';

const navItems = [
  {
    name: 'Beranda',
    href: '/industri',
  },
  {
  name: 'About Us',
  href: '/industri/about',
  subMenus: [
    { name: 'Tentang Sekolah', href: '/industri/about/Tentang-Sekolah'},
    { name: 'Visi & Misi', href: '/industri/about/Visi-Misi'},
    { name: 'Denah & Fasilitas', href:'/industri/about/denah-Fasilitas'},
    { name: 'Program Unggulan', href:'/industri/about/program-unggulan'},
    { name: 'Ekstrakulikuler', href:'/industri/about/ekstra'},
    { name: 'Galeri Siswa', href:'/industri/about/galeri-siswa'},
    { name: 'Prestasi Siswa', href:'/industri/about/prestasi-siswa'},
  ],
},
  {
    name: 'Jurusan',
    href: '/industri/jurusan',
    subMenus: [
      { name: 'RPL', href: '/industri/Jurusan/rpl' },
      { name: 'TKJ', href: '/industri/Jurusan/tkj' },
      { name: 'SIJA', href: '/industri/Jurusan/sija'},
      { name: 'TPM', href: '/industri/Jurusan/tpm'},
      { name: 'TAB', href: '/industri/Jurusan/tab'},
      { name: 'TKR', href: '/industri/Jurusan/tkr'},
      { name: 'OTO', href: '/industri/Jurusan/oto'},
      { name: 'TITL', href: '/industri/Jurusan/titl'},
      { name: 'DPIB', href: '/industri/Jurusan/dpib'},
      { name: 'KJIJ', href: '/industri/Jurusan/kjij'},
    ],
  },
  {
    name: 'Berita',
    href: '/industri/berita',
  },
  {
    name: 'CV Siswa',
    href: '/industri/cvSiswa',
  },
  {
    name: 'Lowongan',
    href: '/industri/lowongan',
  },
  {
    name: 'Profile',
    href: '/industri/profile',
  },
];

export default function HeaderIndustri() {
    const [openMenu, setOpenMenu] = useState<number | null>(null);
    const leaveTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = (idx: number) => {
        if (leaveTimeout.current) {
            clearTimeout(leaveTimeout.current);
            leaveTimeout.current = null;
        }
        setOpenMenu(idx);
    };

    const handleMouseLeave = () => {
        leaveTimeout.current = setTimeout(() => {
            setOpenMenu(null);
        }, 700);
    };

    return (
        // PERBAIKAN: Menggunakan bg-white dan shadow-md untuk tampilan solid dan profesional
        <header className="fixed top-0 z-50 w-full h-[100px] bg-transparent ">
            {/* CONTAINER: flex items-center h-full memastikan semua sejajar vertikal di tengah */}
            <div className="container mx-auto h-full px-6 flex items-center justify-between">

                {/* Logo */}
                <div className="flex-shrink-0">
                    <Link href="/">
                        <Image
                            src="/logo.webp"
                            alt="Logo Sekolah"
                            width={59}
                            height={59}
                            className="object-contain"
                        />
                    </Link>
                </div>

                {/* Navigasi */}
                <nav className="hidden md:flex items-center bg-white rounded-full shadow-md px-8 py-2 gap-6">
                    {navItems.map((item, idx) => (
                        <div
                            key={item.name}
                            className="relative"
                            onMouseEnter={() => handleMouseEnter(idx)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link
                                href={item.href}
                                className="text-black hover:text-red-600 font-medium px-2 py-1"
                            >
                                {item.name}
                            </Link>
                        </div>
                    ))}
                </nav>

                {/* Tombol Contact */}
                <div className="flex-shrink-0">
                    <Link href="/kontak">
                        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-medium transition-colors">
                            Contact
                        </button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
