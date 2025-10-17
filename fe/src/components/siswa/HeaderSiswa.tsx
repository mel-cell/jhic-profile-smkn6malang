// File: components/siswa/HeaderSiswa.js (atau HeaderSiswa.tsx)

"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const navItems = [
    {
        name: 'Beranda',
        href: '/siswa',
    },
    {
        name: 'About Us',
        href: '/siswa/about',
        subMenus: [
            { name: 'Tentang Sekolah', href: '/siswa/about/Tentang-Sekolah' },
            { name: 'Visi & Misi', href: '/siswa/about/Visi-Misi' },
            { name: 'Denah & Fasilitas', href: '/siswa/about/denah-Fasilitas' },
            { name: 'Program Unggulan', href: '/siswa/about/program-unggulan' },
            { name: 'Ekstrakulikuler', href: '/siswa/about/ekstra' },
            { name: 'Galeri Siswa', href: '/siswa/about/galeri-siswa' },
            { name: 'Prestasi Siswa', href: '/siswa/about/prestasi-siswa' },
        ],
    },
    {
        name: 'Jurusan',
        href: '/siswa/jurusan',
        subMenus: [
            { name: 'RPL', href: '/siswa/Jurusan/rpl' },
            { name: 'TKJ', href: '/siswa/Jurusan/tkj' },
            { name: 'SIJA', href: '/siswa/Jurusan/sija' },
            { name: 'TPM', href: '/siswa/Jurusan/tpm' },
            { name: 'TAB', href: '/siswa/Jurusan/tab' },
            { name: 'TKR', href: '/siswa/Jurusan/tkr' },
            { name: 'OTO', href: '/siswa/Jurusan/oto' },
            { name: 'TITL', href: '/siswa/Jurusan/titl' },
            { name: 'DPIB', href: '/siswa/Jurusan/dpib' },
            { name: 'KJIJ', href: '/siswa/Jurusan/kjij' },
        ],
    },
    {
        name: 'Berita',
        href: '/siswa/berita',
    },
    {
        name: 'Lowongan',
        href: '/siswa/lowongan',
    },
    {
        name: 'Profile',
        href: '/siswa/profile',
    },
];

export default function HeaderSiswa() {
    const [openMenu, setOpenMenu] = useState<number | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const leaveTimeout = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('authToken');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
        router.push('/siswa/login');
    };

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

                {/* Tombol Contact / Logout */}
                <div className="flex-shrink-0 flex items-center gap-3">
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link href="/siswa/login">
                            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-medium transition-colors">
                                Login
                            </button>
                        </Link>
                    )}
                    <Link href="/kontak">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-colors">
                            Contact
                        </button>
                    </Link>
                </div>
            </div>
        </header>
    );
}