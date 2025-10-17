// File: src/app/admin/konten/prestasi/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, User, Calendar, Award, Edit2, Trash2 } from 'lucide-react';

// --- DATA DUMMY ---
const PRESTASI_DATA = [
    // Ulangi data untuk mengisi grid (6 item sesuai screenshot)
    { 
        id: 1, 
        title: 'Judul prestasi', 
        student: 'Nama siswa', 
        date: 'Tanggal prestasi', 
        competition: 'Tingkat Lomba', 
        organizer: 'Penyelenggara', 
        image: '/placeholder-prestasi-1.jpg' 
    },
    { 
        id: 2, 
        title: 'Judul prestasi', 
        student: 'Nama siswa', 
        date: 'Tanggal prestasi', 
        competition: 'Tingkat Lomba', 
        organizer: 'Penyelenggara', 
        image: '/placeholder-prestasi-2.jpg' 
    },
    { 
        id: 3, 
        title: 'Judul prestasi', 
        student: 'Nama siswa', 
        date: 'Tanggal prestasi', 
        competition: 'Tingkat Lomba', 
        organizer: 'Penyelenggara', 
        image: '/placeholder-prestasi-3.jpg' 
    },
    { 
        id: 4, 
        title: 'Judul prestasi', 
        student: 'Nama siswa', 
        date: 'Tanggal prestasi', 
        competition: 'Tingkat Lomba', 
        organizer: 'Penyelenggara', 
        image: '/placeholder-prestasi-4.jpg' 
    },
    { 
        id: 5, 
        title: 'Judul prestasi', 
        student: 'Nama siswa', 
        date: 'Tanggal prestasi', 
        competition: 'Tingkat Lomba', 
        organizer: 'Penyelenggara', 
        image: '/placeholder-prestasi-5.jpg' 
    },
    { 
        id: 6, 
        title: 'Judul prestasi', 
        student: 'Nama siswa', 
        date: 'Tanggal prestasi', 
        competition: 'Tingkat Lomba', 
        organizer: 'Penyelenggara', 
        image: '/placeholder-prestasi-6.jpg' 
    },
];

// --- KOMPONEN KARTU PRESTASI ---
const PrestasiCard = ({ data }) => (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex relative group">
        
        {/* Gambar Siswa */}
        <div className="w-24 h-24 flex-shrink-0 mr-4 overflow-hidden rounded-lg">
            <img 
                src={data.image} 
                alt={data.student} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
        </div>

        {/* Detail Prestasi */}
        <div className="flex-grow">
            <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{data.title}</h3>
            
            <div className="space-y-1 text-sm text-gray-700">
                <p className="flex items-center"><User className="w-4 h-4 mr-2 text-red-500" /> {data.student}</p>
                <p className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-orange-500" /> {data.date}</p>
                <p className="flex items-center"><Award className="w-4 h-4 mr-2 text-blue-500" /> {data.competition}</p>
                {/* Penerbit tidak terlihat jelas ikonnya di screenshot, kita gunakan teks biasa */}
                <p className="ml-6 text-gray-500 text-xs italic">{data.organizer}</p>
            </div>
        </div>

        {/* Tombol Aksi (di pojok kanan bawah seperti pada screenshot) */}
        <div className="absolute bottom-2 right-4 flex space-x-1.5">
            <button title="Edit" className="p-1 text-blue-500 hover:text-blue-700 bg-blue-50 rounded-full">
                <Edit2 className="w-4 h-4" />
            </button>
            <button title="Hapus" className="p-1 text-red-500 hover:text-red-700 bg-red-50 rounded-full">
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    </div>
);


// --- HALAMAN UTAMA MANAJEMEN PRESTASI ---
const AdminPrestasiPage: React.FC = () => {
    return (
        <div className="p-8">
            {/* Header Halaman */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Prestasi</h1>
                
                {/* Tombol Tambah Prestasi (Kuning) */}
                <Link
                    href="/admin/konten/prestasi/tambah" 
                    className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-5 rounded-lg shadow-md transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Tambah prestasi
                </Link>
            </div>
            
            {/* DAFTAR PRESTASI (GRID KARTU) */}
            {/* Menggunakan 2 kolom besar (md:grid-cols-2) sesuai dengan desain screenshot */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PRESTASI_DATA.map(item => <PrestasiCard key={item.id} data={item} />)}
            </div>

            {/* Di sini bisa ditambahkan Pagination jika datanya banyak */}
            
        </div>
    );
};

export default AdminPrestasiPage;