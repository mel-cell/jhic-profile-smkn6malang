// File: src/app/admin/konten/page.tsx (Dipindahkan dari 'konten/berita/page.tsx')
'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Trash2, Edit2, Calendar, User, Award, ArrowRight } from 'lucide-react';

// --- DATA DUMMY ---

// 1. Data Berita (Contoh Gambar Seragam)
const BERITA_DATA = [
    { id: 1, title: 'Judul berita', date: '12, Agustus 2025', image: '/placeholder-berita.jpg' },
    { id: 2, title: 'Judul berita', date: '12, Agustus 2025', image: '/placeholder-berita.jpg' },
    { id: 3, title: 'Judul berita', date: '12, Agustus 2025', image: '/placeholder-berita.jpg' },
];

// 2. Data Galeri (Contoh Kegiatan P5)
const GALERI_DATA = [
    { id: 1, title: 'Kegiatan P5', date: '27 / 05 / 2025', image: '/placeholder-galeri-1.jpg' },
    { id: 2, title: 'Kegiatan P5', date: '27 / 05 / 2025', image: '/placeholder-galeri-2.jpg' },
];

// 3. Data Prestasi
const PRESTASI_DATA = [
    { id: 1, title: 'Judul prestasi', student: 'Nama siswa', date: 'Tanggal prestasi', competition: 'Tingkat Lomba', organizer: 'Penyelenggara', image: '/placeholder-prestasi-1.jpg' },
    { id: 2, title: 'Judul prestasi', student: 'Nama siswa', date: 'Tanggal prestasi', competition: 'Tingkat Lomba', organizer: 'Penyelenggara', image: '/placeholder-prestasi-2.jpg' },
];

// --- KOMPONEN KARTU KONTEN ---

// Kartu untuk Berita
const BeritaCard = ({ data }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden relative group">
        {/* Gambar */}
        <div className="h-36 w-full overflow-hidden">
            <img 
                src={data.image} 
                alt={data.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Overlay untuk Judul Berita (Sesuai Screenshot) */}
            <div className="absolute top-0 left-0 w-full h-full bg-red-500/10 backdrop-blur-[1px]"></div>
        </div>

        <div className="p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{data.title}</h3>
            <div className="flex items-center text-sm text-gray-500 mb-4">
                <Calendar className="w-3 h-3 mr-1" />
                <span>{data.date}</span>
            </div>
            
            {/* Tombol Aksi */}
            <div className="flex justify-end space-x-2 border-t pt-3">
                <button title="Edit" className="p-2 text-blue-500 hover:text-blue-700 bg-blue-50 rounded-full">
                    <Edit2 className="w-4 h-4" />
                </button>
                <button title="Hapus" className="p-2 text-red-500 hover:text-red-700 bg-red-50 rounded-full">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
);

// Kartu untuk Galeri (Lebih fokus pada gambar dan judul)
const GaleriCard = ({ data }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden relative group">
        <div className="h-48 w-full overflow-hidden">
            <img 
                src={data.image} 
                alt={data.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Overlay teks gelap di bawah gambar */}
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gray-900/60 text-white">
                <h3 className="text-lg font-bold">{data.title}</h3>
                <p className="text-sm">{data.date}</p>
            </div>
        </div>
        {/* Tombol Aksi di pojok kanan atas (sesuai screenshot) */}
        <div className="absolute top-2 right-2 flex space-x-2">
            <button title="Edit" className="p-1 text-white hover:text-blue-300 bg-blue-500/70 rounded-full">
                <Edit2 className="w-4 h-4" />
            </button>
            <button title="Hapus" className="p-1 text-white hover:text-red-300 bg-red-500/70 rounded-full">
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    </div>
);

// Kartu untuk Prestasi (Desain lebih fokus pada detail teks)
const PrestasiCard = ({ data }) => (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex">
        {/* Gambar Siswa */}
        <div className="w-24 h-24 flex-shrink-0 mr-4 overflow-hidden rounded-lg">
            <img 
                src={data.image} 
                alt={data.student} 
                className="w-full h-full object-cover"
            />
        </div>

        {/* Detail Prestasi */}
        <div className="flex-grow">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{data.title}</h3>
            <div className="space-y-1 text-sm text-gray-700">
                <p className="flex items-center"><User className="w-4 h-4 mr-2 text-blue-500" /> {data.student}</p>
                <p className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-green-500" /> {data.date}</p>
                <p className="flex items-center"><Award className="w-4 h-4 mr-2 text-yellow-500" /> {data.competition}</p>
                <p className="ml-6 text-gray-500 text-xs italic">({data.organizer})</p>
            </div>
            
            {/* Tombol Aksi */}
            <div className="flex justify-end space-x-2 mt-3">
                <button title="Edit" className="p-1 text-blue-500 hover:text-blue-700">
                    <Edit2 className="w-4 h-4" />
                </button>
                <button title="Hapus" className="p-1 text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
);


// --- HALAMAN UTAMA MANAJEMEN KONTEN (OVERVIEW) ---
const AdminKontenOverviewPage: React.FC = () => {
    
    // --- UTILITY: Judul Bagian dengan Tombol Aksi ---
    const SectionHeader = ({ title, link, actionText }) => (
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                {title}
                <Link href={link} className="flex items-center text-blue-600 hover:text-blue-800 ml-3 text-lg font-semibold transition-colors">
                     <ArrowRight className="w-5 h-5 mr-1" />
                </Link>
            </h2>
            <Link
                href={link + '/tambah'} // Link ke halaman tambah
                className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
            >
                <Plus className="w-5 h-5 mr-2" />
                {actionText}
            </Link>
        </div>
    );

    return (
        <div className="p-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-10">Manajemen konten</h1>
            
            <div className="space-y-12">
                
                {/* 1. BERITA TERBARU */}
                <div>
                    <SectionHeader 
                        title="Berita Terbaru" 
                        link="/admin/konten/berita"
                        actionText="Tambah Berita" 
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {BERITA_DATA.map(item => <BeritaCard key={item.id} data={item} />)}
                    </div>
                </div>

                {/* 2. GALERI */}
                <div>
                    <SectionHeader 
                        title="Galeri" 
                        link="/admin/konten/galeri"
                        actionText="Tambah Foto/Video" 
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {GALERI_DATA.map(item => <GaleriCard key={item.id} data={item} />)}
                    </div>
                </div>

                {/* 3. PRESTASI */}
                <div>
                    <SectionHeader 
                        title="Prestasi" 
                        link="/admin/konten/prestasi"
                        actionText="Tambah Prestasi" 
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {PRESTASI_DATA.map(item => <PrestasiCard key={item.id} data={item} />)}
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default AdminKontenOverviewPage;