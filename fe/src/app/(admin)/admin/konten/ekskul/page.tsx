'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Users, Calendar, Award, Edit2, Trash2, Search } from 'lucide-react';
import { ekskulAPI } from '@/app/services/api';

// --- KOMPONEN KARTU EKSKUL ---
const EkskulCard = ({ data, onDelete }: { data: any; onDelete: (id: string) => void }) => (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex relative group">

        {/* Gambar Ekskul */}
        <div className="w-24 h-24 flex-shrink-0 mr-4 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
            <Users className="w-12 h-12 text-gray-400" />
        </div>

        {/* Detail Ekskul */}
        <div className="flex-grow">
            <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{data.namaEkskul}</h3>

            <div className="space-y-1 text-sm text-gray-700">
                <p className="flex items-center"><Award className="w-4 h-4 mr-2 text-blue-500" /> {data.kategori || 'Tidak ada kategori'}</p>
                <p className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-orange-500" /> Status: {data.status || 'Aktif'}</p>
                {/* Deskripsi singkat */}
                <p className="ml-6 text-gray-500 text-xs italic line-clamp-2">{data.deskripsi || 'Tidak ada deskripsi'}</p>
            </div>
        </div>

        {/* Tombol Aksi (di pojok kanan bawah seperti pada screenshot) */}
        <div className="absolute bottom-2 right-4 flex space-x-1.5">
            <Link href={`/admin/konten/ekskul/edit/${data.id}`} title="Edit" className="p-1 text-blue-500 hover:text-blue-700 bg-blue-50 rounded-full">
                <Edit2 className="w-4 h-4" />
            </Link>
            <button title="Hapus" className="p-1 text-red-500 hover:text-red-700 bg-red-50 rounded-full" onClick={() => onDelete(data.id)}>
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    </div>
);

// --- HALAMAN UTAMA MANAJEMEN EKSKUL ---
const AdminEkskulPage: React.FC = () => {
    const [ekskulData, setEkskulData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await ekskulAPI.getAll();
                if (response.success) {
                    setEkskulData(response.data || []);
                }
            } catch (error) {
                console.error('Failed to fetch ekskul:', error);
                setEkskulData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus ekskul ini?')) {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    alert('Token tidak ditemukan. Silakan login terlebih dahulu.');
                    return;
                }
                const response = await ekskulAPI.delete(id, token);
                if (response.success) {
                    setEkskulData(prev => prev.filter(item => item.id !== id));
                    alert('Ekskul berhasil dihapus!');
                } else {
                    alert('Gagal menghapus ekskul: ' + response.error);
                }
            } catch (error) {
                console.error('Error deleting ekskul:', error);
                alert('Gagal menghapus ekskul');
            }
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // Filter data berdasarkan search term
    const filteredData = ekskulData.filter((item: any) =>
        item.namaEkskul?.toLowerCase().includes(searchTerm.toLowerCase())
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
            {/* Header Halaman */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
                <h1 className="text-3xl font-extrabold text-gray-900">Ekstrakulikuler</h1>

                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                    <input
                        type="text"
                        placeholder="Cari ekskul..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 pl-10 transition duration-150 shadow-sm"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>

                {/* Tombol Tambah Ekskul (Kuning) */}
                <Link
                    href="/admin/konten/ekskul/tambah"
                    className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-5 rounded-lg shadow-md transition-colors w-full md:w-auto justify-center"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Tambah ekskul
                </Link>
            </div>

            {/* DAFTAR EKSKUL (GRID KARTU) */}
            {/* Menggunakan 2 kolom besar (md:grid-cols-2) sesuai dengan desain screenshot */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredData.length > 0 ? (
                    filteredData.map((item: any) => <EkskulCard key={item.id} data={item} onDelete={handleDelete} />)
                ) : (
                    <p className="col-span-full text-gray-500 text-center">Tidak ada ekskul ditemukan.</p>
                )}
            </div>

            {/* Di sini bisa ditambahkan Pagination jika datanya banyak */}

        </div>
    );
};

export default AdminEkskulPage;
