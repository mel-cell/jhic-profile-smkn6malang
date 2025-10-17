// File: src/app/admin/konten/galeri/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Trash2, Edit2 } from 'lucide-react';

// --- DATA DUMMY ---
const GALERI_DATA = [
    // Ulangi data untuk mengisi grid (6 item sesuai screenshot)
    { id: 1, title: 'Kegiatan P5', date: '27 / 05 / 2025', image: '/placeholder-galeri-1.jpg' },
    { id: 2, title: 'Kegiatan P5', date: '27 / 05 / 2025', image: '/placeholder-galeri-2.jpg' },
    { id: 3, title: 'Kegiatan P5', date: '27 / 05 / 2025', image: '/placeholder-galeri-3.jpg' },
    { id: 4, title: 'Kegiatan P5', date: '27 / 05 / 2025', image: '/placeholder-galeri-4.jpg' },
    { id: 5, title: 'Kegiatan P5', date: '27 / 05 / 2025', image: '/placeholder-galeri-5.jpg' },
    { id: 6, title: 'Kegiatan P5', date: '27 / 05 / 2025', image: '/placeholder-galeri-6.jpg' },
];

// --- KOMPONEN KARTU GALERI ---
const GaleriCard = ({ data }) => (
    // Struktur kartu disesuaikan agar sama persis dengan yang ada di screenshot image_9a5375.jpg
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden relative group aspect-video">
        
        {/* Gambar */}
        <img 
            src={data.image} 
            alt={data.title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Overlay Teks Hijau Tua (Sesuai Screenshot) */}
        <div className="absolute bottom-0 left-0 w-full p-3 bg-green-700/80 text-white">
            <h3 className="text-lg font-bold leading-tight">{data.title}</h3>
            <p className="text-sm font-light">{data.date}</p>
        </div>

        {/* Tombol Aksi di pojok kanan atas */}
        <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button title="Edit" className="p-1.5 text-white hover:text-green-200 bg-black/40 rounded-full">
                <Edit2 className="w-4 h-4" />
            </button>
            <button title="Hapus" className="p-1.5 text-white hover:text-red-300 bg-black/40 rounded-full">
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    </div>
);


// --- HALAMAN UTAMA MANAJEMEN GALERI ---
const AdminGaleriPage: React.FC = () => {
    return (
        <div className="p-8">
            {/* Header Halaman */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Galeri</h1>
                
                {/* Tombol Tambah Galeri (Hijau) */}
                <Link
                    href="/admin/konten/galeri/tambah" 
                    className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-5 rounded-lg shadow-md transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Tambah galeri
                </Link>
            </div>
            
            {/* DAFTAR GALERI (GRID KARTU) */}
            {/* Menggunakan 3 kolom (lg:grid-cols-3) agar responsif dan sesuai dengan kerapatan di screenshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {GALERI_DATA.map(item => <GaleriCard key={item.id} data={item} />)}
            </div>

            {/* Di sini bisa ditambahkan Pagination jika datanya banyak */}
            
        </div>
    );
};

export default AdminGaleriPage;