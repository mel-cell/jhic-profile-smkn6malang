// File: src/app/admin/konten/berita/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Calendar, Edit2, Trash2 } from 'lucide-react';
import { newsAPI } from '@/app/services/api';

// --- KOMPONEN KARTU BERITA ---
const BeritaCard = ({ data }: { data: any }) => (
    // Struktur kartu disesuaikan agar sama persis dengan yang ada di screenshot image_9a65e5.jpg
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden relative group">
        {/* Gambar */}
        <div className="h-40 w-full overflow-hidden relative">
            <img 
                src={data.image || '/placeholder-berita.jpg'} 
                alt={data.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Teks 'JUARA 1' yang menempel di gambar (Overlay Merah Muda) - hardcoded for demo, make dynamic if needed */}
            <div className="absolute top-0 right-0 p-1 px-3 bg-red-500 text-white font-bold text-xs transform -rotate-45 translate-x-1/2 translate-y-2 shadow-lg"
                 style={{ minWidth: '80px', textAlign: 'center' }}>
                JUARA 1
            </div>
        </div>

        <div className="p-3">
            <h3 className="text-base font-bold text-gray-900 mb-3 leading-tight">{data.title}</h3>
            
            {/* Detail dan Aksi */}
            <div className="flex justify-between items-center text-sm">
                
                {/* Info Tanggal (Hijau) */}
                <div className="flex items-center text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full font-semibold">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{data.date || 'N/A'}</span>
                </div>
                
                {/* Tombol Aksi */}
                <div className="flex space-x-1.5">
                    <button title="Edit" className="p-1 text-blue-500 hover:text-blue-700 bg-blue-50 rounded-full">
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button title="Hapus" className="p-1 text-red-500 hover:text-red-700 bg-red-50 rounded-full">
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    </div>
);

// --- HALAMAN UTAMA MANAJEMEN BERITA ---
const AdminBeritaPage: React.FC = () => {
    const [beritaData, setBeritaData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Use public news API for fetching all news (admin can access all)
                const news = await newsAPI.getAll();
                setBeritaData(news);
            } catch (error) {
                console.error('Failed to fetch news:', error);
                // Fallback to empty array
                setBeritaData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // Filter data berdasarkan search term
    const filteredData = beritaData.filter((item: any) =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="p-8">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Berita</h1>
            
            {/* HEADER AKSI (Tambah Berita & Search Bar) */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 space-y-4 md:space-y-0">
                
                {/* Tombol Tambah Berita (Biru) */}
                <Link
                    href="/admin/konten/berita/tambah" 
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition-colors w-full md:w-auto justify-center"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Tambah Berita
                </Link>

                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                    <input
                        type="text"
                        placeholder="Cari berita..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 pl-10 transition duration-150 shadow-sm"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* DAFTAR BERITA (GRID KARTU) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredData.length > 0 ? (
                    filteredData.map((item: any) => <BeritaCard key={item.id} data={item} />)
                ) : (
                    <p className="col-span-full text-gray-500 text-center">Tidak ada berita ditemukan.</p>
                )}
            </div>

            {/* Pagination can be added here in future */}
        </div>
    );
};

export default AdminBeritaPage;
