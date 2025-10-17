// File: src/components/admin/Sidebar.tsx (Kode Diperbarui Tanpa Opacity)
'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home, FileText, User, Briefcase, Bell, ChevronDown, ChevronUp,
    Newspaper, Trophy, Image, Users, Factory, Calendar, History, Settings
} from 'lucide-react';

// Type definitions
interface SubItem {
    name: string;
    link: string;
    icon: React.ComponentType<any>;
}

interface NavItem {
    name: string;
    icon: React.ComponentType<any>;
    link: string;
    dropdown?: SubItem[];
}

// Struktur data untuk item navigasi
const navItems: NavItem[] = [
    { name: 'Beranda', icon: Home, link: '/admin' },
    {
        name: 'Manajemen konten',
        icon: FileText,
        link: '/admin/konten',
        dropdown: [
            { name: 'Berita', link: '/admin/konten/berita', icon: Newspaper },
            { name: 'Prestasi', link: '/admin/konten/prestasi', icon: Trophy },
            { name: 'Galeri', link: '/admin/konten/galeri', icon: Image },
        ],
    },
    {
        name: 'Manajemen Akun',
        icon: User,
        link: '/admin/akun',
        dropdown: [
            { name: 'Akun siswa', link: '/admin/akun/siswa', icon: Users },
            { name: 'Akun Industri', link: '/admin/akun/industri', icon: Factory },
        ],
    },
    { name: 'Lowongan Kerja', icon: Briefcase, link: '/admin/lowongankerja' },
    { name: 'Notifikasi event', icon: Bell, link: '/admin/notifikasi-event' },
    {
        name: 'Riwayat',
        icon: History,
        link: '/admin/riwayat',
        dropdown: [
            { name: 'Riwayat Lowongan', link: '/admin/riwayat/lowongan', icon: Briefcase },
            { name: 'Riwayat Event', link: '/admin/riwayat/event', icon: Calendar },
        ],
    },
    { name: 'Pengaturan', icon: Settings, link: '/admin/pengaturan' },
];

// --- Komponen Item Navigasi Tunggal atau Induk ---
const NavItem = ({ item, activePath }: { item: NavItem; activePath: string }) => {
    // 1. Tentukan apakah item ini/sub-itemnya aktif
    const hasActiveSubItem = item.dropdown ? item.dropdown.some((sub: SubItem) => activePath.startsWith(sub.link)) : false;

    // 2. State untuk membuka dropdown (default terbuka jika ada sub-item aktif)
    const [isOpen, setIsOpen] = useState(hasActiveSubItem);

    // 3. Penentuan item aktif untuk item tunggal (halaman utamanya)
    const isActive = item.link !== '#' && activePath === item.link;

    // 4. Ref untuk mengukur tinggi konten dropdown
    const contentRef = useRef<HTMLDivElement>(null);

    const Icon = item.icon;

    // Menangani klik pada panah (hanya membuka/menutup dropdown)
    const handleToggleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    if (item.dropdown) {
        const isParentActive = isActive || hasActiveSubItem;

        return (
            <div className="mb-1">
                <div className={`flex items-center justify-between w-full p-0 pr-3 rounded-xl transition-colors 
                                ${isParentActive ? 'bg-blue-600' : 'hover:bg-gray-100'}`}>
                    
                    {/* Link Induk */}
                    <Link
                        href={item.link}
                        className={`flex items-center flex-grow p-3 rounded-xl transition-colors
                                    ${isParentActive ? 'text-white' : 'text-gray-800'}`}
                    >
                        <Icon className="w-5 h-5 mr-3" />
                        <span className="font-medium">{item.name}</span>
                    </Link>

                    {/* Tombol Panah (Hanya untuk dropdown) */}
                    <button
                        onClick={handleToggleClick}
                        aria-expanded={isOpen}
                        className={`p-2 rounded-full transition-all duration-300 transform 
                                    ${isParentActive ? 'text-white hover:bg-blue-700' : 'text-gray-800 hover:bg-gray-200'}`}
                    >
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                </div>
                
                {/* Sub-menu Dropdown dengan Animasi max-height */}
                <div 
                    ref={contentRef}
                    style={{
                        // Gunakan max-height untuk animasi, hindari opacity
                        maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px',
                        overflow: 'hidden',
                        transition: 'max-height 0.3s ease-in-out',
                    }}
                    className="pl-4 pt-1 pb-2 space-y-1"
                >
                    {item.dropdown.map((subItem: SubItem) => {
                        const SubIcon = subItem.icon;
                        const isSubActive = activePath.startsWith(subItem.link);
                        
                        return (
                            <Link
                                key={subItem.name}
                                href={subItem.link}
                                className={`flex items-center p-2 rounded-lg text-sm transition-colors 
                                    ${isSubActive ? 'font-semibold text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                {SubIcon && <SubIcon className="w-4 h-4 mr-3 text-gray-500" />}
                                <span>{subItem.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Item Navigasi Tunggal
    return (
        <div className="mb-1">
            <Link
                href={item.link}
                className={`flex items-center w-full p-3 rounded-xl transition-colors 
                            ${isActive ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-gray-100'}`}
            >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.name}</span>
            </Link>
        </div>
    );
};

// --- Komponen Sidebar Utama ---
const Sidebar = () => {
    // Diasumsikan usePathname sudah diimport dari 'next/navigation'
    const activePath = usePathname() || '/admin'; 

    return (
        <div className="flex flex-col h-screen w-64 bg-white border-r border-gray-200 shadow-xl fixed top-0 left-0 z-20">
            
            {/* Header / Logo Sekolah */}
            <div className="p-4 border-b border-gray-200 flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 overflow-hidden">
                    <img src="/logo.webp" alt="Logo Sekolah" className="w-full h-full object-cover" />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-gray-900 leading-tight">SMK Negeri 6 Malang</h2>
                    <p className="text-[10px] text-gray-500">Pusat keunggulan teknik & Inovasi</p>
                </div>
            </div>

            {/* Navigasi Utama */}
            <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <NavItem key={item.name} item={item} activePath={activePath} /> 
                ))}
            </nav>
            
            {/* Footer / Tombol Kembali */}
            <div className="p-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Kembali</p>
                <button
                    onClick={() => console.log('Aksi Kembali / Tombol Utama')}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center"
                >
                    Aksi Utama
                </button>
            </div>
        </div>
    );
};

export default Sidebar;