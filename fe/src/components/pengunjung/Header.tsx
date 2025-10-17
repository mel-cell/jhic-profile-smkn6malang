"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';

const navItems = [
  {
    name: 'Beranda',
    href: '/',
  },
  {
    name: 'About Us',
    href: '/about',
    subMenus: [
      { name: 'Tentang Sekolah', href: '/about/Tentang-Sekolah'},
      { name: 'Visi & Misi', href: '/about/Visi-Misi'},
      { name: 'Denah & Fasilitas', href: '/about/denah-Fasilitas'},
      { name: 'Program Unggulan', href: '/about/program-unggulan'},
      { name: 'Ekstrakulikuler', href: '/about/ekstra'},
      { name: 'Galeri Siswa', href: '/about/galeri-siswa'},
      { name: 'Prestasi Siswa', href: '/about/prestasi-siswa'},
    ],
  },
  {
    name: 'Jurusan',
    href: '/jurusan',
    subMenus: [
      { name: 'RPL', href: '/jurusan/rpl' },
      { name: 'TKJ', href: '/jurusan/tkj' },
      { name: 'SIJA', href: '/jurusan/sija'},
      { name: 'TPM', href: '/jurusan/tpm'},
      { name: 'TAB', href: '/jurusan/tab'},
      { name: 'TKR', href: '/jurusan/tkr'},
      { name: 'OTO', href: '/jurusan/oto'},
      { name: 'TITL', href: '/jurusan/titl'},
      { name: 'DPIB', href: '/jurusan/dpib'},
      { name: 'KJIJ', href: '/jurusan/kjij'},
    ],
  },
  {
    name: 'Berita',
    href: '/berita',
  },
  {
    name: 'Industri',
    href: '/industri',
  },
  {
    name: 'Pendaftaran',
    href: '/Pendaftaran',
  },
];

export default function Header() {
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
    <header className="fixed top-0 z-50 w-full h-[100px] bg-transparent">
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
        <nav className="hidden md:flex items-center bg-white backdrop-blur-sm rounded-full shadow-md px-8 py-2 gap-6">
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
              {item.subMenus && openMenu === idx && (
                <div className="absolute left-0 mt-2 bg-white rounded shadow-lg min-w-[150px] z-10">
                  {item.subMenus.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      className="block px-4 py-2 text-black hover:bg-red-100"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
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