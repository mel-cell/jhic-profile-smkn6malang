// File: src/app/industri/cv/[id]/page.tsx
'use client';

import React, { useState } from 'react'; 
import Image from 'next/image';
import Link from 'next/link';
// Impor ikon yang dibutuhkan
import { Send, ArrowLeft, Trash2, Maximize2, FileText } from 'lucide-react'; 
// Impor komponen Modal
import CVModal from './CVModal'; 

// --- TIPE DATA SISWA (Data lengkap diperlukan di sini) ---
interface SiswaDetail {
    id: string;
    nama: string;
    kelas: string;
    fotoUrl: string;
    online: boolean;
    deskripsiLengkap: string;
    keahlian: string[];
    pendidikan: string;
    pengalamanKerja: string;
    infoKontak: {
        email: string;
        lokasi: string;
        gender: string;
        tanggalLahir: string;
        noTelp: string;
    };
    socialMedia: {
        tiktok?: string;
        instagram?: string;
        facebook?: string;
    };
    portofolio: {
        id: number;
        judul: string;
        deskripsi: string;
    }[];
}

// --- DATA DUMMY SISWA LENGKAP ---
const SISWA_DATA_LENGKAP: SiswaDetail[] = [
    {
        id: '1',
        nama: 'Yang Jungwon',
        kelas: 'XII RPL 2',
        fotoUrl: '/jungwon.jpg',
        online: true,
        deskripsiLengkap: "Seorang pengembang UI/UX dan Front-End yang antusias dengan pengalaman di Figma dan desain grafis. Siap untuk magang dan memiliki dasar yang kuat dalam Rekayasa Perangkat Lunak.",
        infoKontak: { email: 'parkjungwolyucyu09812@gmail.com', lokasi: 'Jl. Harapan Bangsa no 6 Malang, Jawa Timur', gender: 'Laki - laki', tanggalLahir: '09 Feb 2004', noTelp: '+62837472183196' },
        socialMedia: { instagram: '@yangjungwon', },
        keahlian: ['UI/UX desainer', 'DevOps', 'Data Analyst', 'GameDev', 'Figma', 'Graphic design', 'Front end', 'Back end'],
        portofolio: [{ id: 1, judul: 'Desain Aplikasi E-Commerce', deskripsi: 'Desain lengkap untuk aplikasi e-commerce menggunakan Figma, mencakup flow user dan prototipe.' }],
        pendidikan: "SMK Negeri 6 Malang, Jurusan RPL (2022-2025)",
        pengalamanKerja: "Magang di Divisi UI/UX PT. Global Tech (3 Bulan)",
    },
    {
        id: '2', 
        nama: 'Park Sunghoon',
        kelas: 'XI RPL 1',
        fotoUrl: '/sunghoon.jpg',
        online: true,
        deskripsiLengkap: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim nunc faucibus a pellentesque sit amet. Massa eget egestas purus viverra accumsan in nisl nisi scelerisque. Sed adipiscing diam donec adipiscing tristique risus nec feugiat.",
        infoKontak: { email: 'user.demo01@example.com', lokasi: 'Malang, Jawa Timur', gender: 'Laki - Laki', tanggalLahir: '8 Des 2002', noTelp: '081234567890' },
        socialMedia: { tiktok: '@psh_tt', instagram: '@parksunghoon', facebook: 'fb.com/parksunghoon', },
        keahlian: ['GameDev', 'UI / UX', 'Back end', 'Sistem Analyst', 'DevOps'],
        portofolio: [{ id: 1, judul: 'Aplikasi E-Commerce', deskripsi: 'Project pembuatan aplikasi e-commerce sederhana dengan React dan Node.js.' }],
        pendidikan: "SMK Negeri 6 Malang, Jurusan RPL (2021-2024)",
        pengalamanKerja: "Magang Full Stack Developer di Startup X (6 Bulan)",
    },
    {
        id: '3',
        nama: 'Choi San',
        kelas: 'XII TAB 1',
        fotoUrl: '/choisan.jpg', 
        online: true,
        deskripsiLengkap: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim nunc faucibus a pellentesque sit amet. Massa eget egestas purus viverra accumsan in nisl nisi scelerisque. Sed adipiscing diam donec adipiscing tristique risus nec feugiat.",
        infoKontak: { email: 'user.demo01@example.com', lokasi: 'Malang, Jawa Timur', gender: 'Laki - Laki', tanggalLahir: '8 Des 2002', noTelp: '081234567890' },
        socialMedia: { tiktok: '@psh_tt', instagram: '@parksunghoon', facebook: 'fb.com/parksunghoon', },
        keahlian: ['GameDev', 'UI / UX', 'Back end', 'Sistem Analyst', 'DevOps'],
        portofolio: [{ id: 1, judul: 'Aplikasi E-Commerce', deskripsi: 'Project pembuatan aplikasi e-commerce sederhana dengan React dan Node.js.' }],
        pendidikan: "SMK Negeri 6 Malang, Jurusan RPL (2021-2024)",
        pengalamanKerja: "Magang Full Stack Developer di Startup X (6 Bulan)",
    },
    {
        id: '4',
        nama: 'Shin Ryujin',
        kelas: 'XII TAB 1',
        fotoUrl: '/ryujin.jpg', 
        online: true,
        deskripsiLengkap: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim nunc faucibus a pellentesque sit amet. Massa eget egestas purus viverra accumsan in nisl nisi scelerisque. Sed adipiscing diam donec adipiscing tristique risus nec feugiat.",
        infoKontak: { email: 'user.demo01@example.com', lokasi: 'Malang, Jawa Timur', gender: 'Laki - Laki', tanggalLahir: '8 Des 2002', noTelp: '081234567890' },
        socialMedia: { tiktok: '@psh_tt', instagram: '@parksunghoon', facebook: 'fb.com/parksunghoon', },
        keahlian: ['GameDev', 'UI / UX', 'Back end', 'Sistem Analyst', 'DevOps'],
        portofolio: [{ id: 1, judul: 'Aplikasi E-Commerce', deskripsi: 'Project pembuatan aplikasi e-commerce sederhana dengan React dan Node.js.' }],
        pendidikan: "SMK Negeri 6 Malang, Jurusan RPL (2021-2024)",
        pengalamanKerja: "Magang Full Stack Developer di Startup X (6 Bulan)",
    },
    {
        id: '5',
        nama: 'Choi Soobin',
        kelas: 'XII OTO 1',
        fotoUrl: '/soobin.jpg', 
        online: true,
        deskripsiLengkap: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim nunc faucibus a pellentesque sit amet. Massa eget egestas purus viverra accumsan in nisl nisi scelerisque. Sed adipiscing diam donec adipiscing tristique risus nec feugiat.",
        infoKontak: { email: 'user.demo01@example.com', lokasi: 'Malang, Jawa Timur', gender: 'Laki - Laki', tanggalLahir: '8 Des 2002', noTelp: '081234567890' },
        socialMedia: { tiktok: '@psh_tt', instagram: '@parksunghoon', facebook: 'fb.com/parksunghoon', },
        keahlian: ['GameDev', 'UI / UX', 'Back end', 'Sistem Analyst', 'DevOps'],
        portofolio: [{ id: 1, judul: 'Aplikasi E-Commerce', deskripsi: 'Project pembuatan aplikasi e-commerce sederhana dengan React dan Node.js.' }],
        pendidikan: "SMK Negeri 6 Malang, Jurusan RPL (2021-2024)",
        pengalamanKerja: "Magang Full Stack Developer di Startup X (6 Bulan)",
    },
    {
        id: '6',
        nama: 'Gieselle',
        kelas: 'XII OTO 1',
        fotoUrl: '/gieselle.jpg', 
        online: true,
        deskripsiLengkap: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim nunc faucibus a pellentesque sit amet. Massa eget egestas purus viverra accumsan in nisl nisi scelerisque. Sed adipiscing diam donec adipiscing tristique risus nec feugiat.",
        infoKontak: { email: 'user.demo01@example.com', lokasi: 'Malang, Jawa Timur', gender: 'Laki - Laki', tanggalLahir: '8 Des 2002', noTelp: '081234567890' },
        socialMedia: { tiktok: '@psh_tt', instagram: '@parksunghoon', facebook: 'fb.com/parksunghoon', },
        keahlian: ['GameDev', 'UI / UX', 'Back end', 'Sistem Analyst', 'DevOps'],
        portofolio: [{ id: 1, judul: 'Aplikasi E-Commerce', deskripsi: 'Project pembuatan aplikasi e-commerce sederhana dengan React dan Node.js.' }],
        pendidikan: "SMK Negeri 6 Malang, Jurusan RPL (2021-2024)",
        pengalamanKerja: "Magang Full Stack Developer di Startup X (6 Bulan)",
    },
];

// Fungsi untuk mencari data siswa berdasarkan ID
const getSiswaDetail = (id: string): SiswaDetail | undefined => {
    return SISWA_DATA_LENGKAP.find(siswa => siswa.id === id);
};

// --- Komponen Kartu Portofolio Ringkas ---
const PortfolioCard = ({ item }: { item: any }) => (
    // **Animasi: Transisi saat hover dan efek sedikit mengangkat**
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 relative h-48 flex flex-col justify-between transition duration-300 hover:shadow-lg hover:border-orange-300 transform hover:scale-[1.02]">
        <div className="flex items-start space-x-3 mb-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
            <h4 className="text-base font-semibold text-gray-800 truncate flex-1">{item.judul}</h4>
            {/* **Animasi: Transisi warna dan scale saat hover pada ikon** */}
            <button className="text-red-500 hover:text-red-700 transition duration-150 transform hover:scale-110">
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
        <p className="text-sm text-gray-600 line-clamp-3 mb-2 flex-1">{item.deskripsi}</p>
         {/* **Animasi: Transisi warna dan scale saat hover pada ikon** */}
        <button className="self-end text-gray-500 hover:text-gray-700 transition duration-150 transform hover:scale-110">
            <Maximize2 className="w-5 h-5" />
        </button>
    </div>
);


// --- Definisi Props untuk Rute Dinamis [id] ---
interface SiswaCVDetailPageProps {
    params: {
        id: string; 
    };
}


const SiswaCVDetailPage: React.FC<SiswaCVDetailPageProps> = ({ params }) => {
    const { id } = params; 
    const siswa = getSiswaDetail(id); 

    // STATE UNTUK MENGONTROL MODAL
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    if (!siswa) {
        return (
            <div className="flex items-center justify-center min-h-screen pt-20">
                <h1 className="text-3xl font-bold text-gray-800">404 | Siswa dengan ID "{id}" tidak ditemukan</h1>
            </div>
        );
    }

    return (
        // **Animasi: FadeIn untuk seluruh halaman**
        <div className="min-h-screen pb-16 pt-28 bg-white animate-fadeIn"> 
            
            <div className="container mx-auto px-4 max-w-6xl">
                
                {/* Tombol Kembali: Menambahkan transisi dan efek hover subtle */}
                <Link 
                    href="/industri/cvSiswa" 
                    className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors duration-200 hover:translate-x-[-4px]"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Kembali ke Daftar Siswa
                </Link>

                {/* --- HEADER RINGKAS & FOTO --- */}
                <div className="flex items-start mb-10">
                    
                    {/* FOTO: Menambahkan efek shadow dan scale saat hover (opsional) */}
                    <div className="relative w-48 h-48 border-4 border-gray-200 rounded-full overflow-hidden flex-shrink-0 mr-10 transition duration-300 hover:shadow-xl">
                        <Image
                            src={siswa.fotoUrl || '/placeholder.jpg'}
                            alt={siswa.nama}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-full"
                        />
                    </div>

                    {/* DETAIL SINGKAT (Nama, Deskripsi, Tombol) */}
                    <div className="flex-1 pt-4">
                        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">{siswa.nama}</h1>
                        <p className="text-xl font-semibold text-gray-600 mb-3">{siswa.kelas}</p>
                        
                        {/* Status Online */}
                        <span className="text-sm font-semibold px-3 py-1 bg-green-500 text-white rounded-md inline-block mb-4 animate-pulse">
                            {siswa.online ? 'Online' : 'Offline'}
                        </span>

                        {/* Deskripsi/Bio */}
                        <p className="text-gray-700 mb-6 max-w-3xl">
                            {siswa.deskripsiLengkap}
                        </p>

                        {/* Tombol Aksi: LIHAT CV LENGKAP & UNDANG SISWA */}
                        <div className="flex space-x-4 pt-4">
                            {/* Tombol LIHAT CV LENGKAP (Memanggil Modal) - Transisi lebih kuat */}
                            <button 
                                onClick={() => setIsModalOpen(true)} 
                                className="flex items-center bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg active:scale-95"
                            >
                                <FileText className="w-5 h-5 mr-2" /> LIHAT CV LENGKAP
                            </button>
                            
                            {/* Tombol Undang Siswa - Transisi lebih kuat */}
                            <button className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-6 py-3 rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg active:scale-95">
                                <Send className="w-5 h-5 mr-2" /> Undang Siswa
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- BAGIAN KEAHILAN --- */}
                <div className="pt-8 border-t border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Keahlian</h3>
                    <div className="flex flex-wrap gap-3">
                        {siswa.keahlian.map((skill, index) => (
                            // **Animasi: Scale up saat hover pada skill tag**
                            <span 
                                key={index} 
                                className="text-sm font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 transition duration-150 transform hover:bg-gray-200 hover:scale-[1.05] cursor-default"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* --- BAGIAN PORTOFOLIO RINGKAS --- */}
                <div className="pt-10 mb-10">
                    <h3 className="text-2xl font-bold text-gray-800 mb-5">Portofolio Saya</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Portofolio Item (Animasi sudah ditambahkan di komponen PortfolioCard) */}
                        {siswa.portofolio.slice(0, 2).map(item => (
                            <PortfolioCard key={item.id} item={item} /> 
                        ))}
                        
                        {/* Kartu Lihat Semua Portofolio - Transisi dan efek hover kuat */}
                        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-8 h-48 text-gray-500 transition-all duration-300 hover:bg-gray-200 hover:border-gray-400 transform hover:scale-[1.02] cursor-pointer">
                            <span className="text-lg font-medium">Lihat semua ({siswa.portofolio.length})</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- PEMANGGILAN KOMPONEN MODAL --- */}
            {isModalOpen && (
                <CVModal 
                    siswa={siswa} // Kirim data siswa ke Modal
                    onClose={() => setIsModalOpen(false)} // Fungsi untuk menutup modal
                />
            )}
        </div>
    );
};

export default SiswaCVDetailPage;