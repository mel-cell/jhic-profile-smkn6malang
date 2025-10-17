// File: src/app/admin/akun/siswa/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
    Search, User, Phone, Calendar, 
    GraduationCap, BookOpen, Trash2, Settings
} from 'lucide-react';

// --- DATA DUMMY ---
const SISWA_DATA = [
    // Ulangi data untuk mengisi grid (8 item sesuai screenshot overview)
    { 
        id: 1, 
        name: 'Yang Jungwon', 
        nisn: '0000000000', 
        class: 'XII RPL 2', 
        birthdate: '27 Juni 2009', 
        phone: '+628XXXXXXXXXX', 
        image: '/placeholder-siswa-1.jpg' 
    },
    { id: 2, name: 'Yang Jungwon', nisn: '0000000000', class: 'XII RPL 2', birthdate: '27 Juni 2009', phone: '+628XXXXXXXXXX', image: '/placeholder-siswa-2.jpg' },
    { id: 3, name: 'Yang Jungwon', nisn: '0000000000', class: 'XII RPL 2', birthdate: '27 Juni 2009', phone: '+628XXXXXXXXXX', image: '/placeholder-siswa-3.jpg' },
    { id: 4, name: 'Yang Jungwon', nisn: '0000000000', class: 'XII RPL 2', birthdate: '27 Juni 2009', phone: '+628XXXXXXXXXX', image: '/placeholder-siswa-4.jpg' },
    { id: 5, name: 'Yang Jungwon', nisn: '0000000000', class: 'XII RPL 2', birthdate: '27 Juni 2009', phone: '+628XXXXXXXXXX', image: '/placeholder-siswa-5.jpg' },
    { id: 6, name: 'Yang Jungwon', nisn: '0000000000', class: 'XII RPL 2', birthdate: '27 Juni 2009', phone: '+628XXXXXXXXXX', image: '/placeholder-siswa-6.jpg' },
    { id: 7, name: 'Yang Jungwon', nisn: '0000000000', class: 'XII RPL 2', birthdate: '27 Juni 2009', phone: '+628XXXXXXXXXX', image: '/placeholder-siswa-7.jpg' },
    { id: 8, name: 'Yang Jungwon', nisn: '0000000000', class: 'XII RPL 2', birthdate: '27 Juni 2009', phone: '+628XXXXXXXXXX', image: '/placeholder-siswa-8.jpg' },
];


// --- KOMPONEN KARTU SISWA ---
const SiswaCard = ({ data }) => (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center text-center">
        
        {/* Foto Siswa */}
        <div className="w-20 h-20 overflow-hidden rounded-full mb-3 border-4 border-gray-200">
            <img 
                src={data.image} 
                alt={data.name} 
                className="w-full h-full object-cover"
            />
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2">{data.name}</h3>
        
        {/* Detail Siswa */}
        <div className="text-sm text-gray-700 space-y-1 w-full text-left">
            <p className="flex items-center"><GraduationCap className="w-4 h-4 mr-2 text-gray-500" /> **NISN**: {data.nisn}</p>
            <p className="flex items-center"><BookOpen className="w-4 h-4 mr-2 text-gray-500" /> **Kelas**: {data.class}</p>
            <p className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-gray-500" /> **Lahir**: {data.birthdate}</p>
            <p className="flex items-center"><Phone className="w-4 h-4 mr-2 text-gray-500" /> **HP**: {data.phone}</p>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-between space-x-2 mt-4 w-full border-t pt-4">
            <Link 
                href={`/admin/akun/siswa/${data.id}/detail`} // Arahkan ke halaman detail siswa
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg text-sm text-center transition-colors"
            >
                Detail
            </Link>
            <button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
            >
                Hapus
            </button>
        </div>
    </div>
);


// --- HALAMAN UTAMA DAFTAR AKUN SISWA ---
const AdminAkunSiswaPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // Filter data berdasarkan search term (contoh: nama siswa)
    const filteredData = SISWA_DATA.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="flex items-center mb-8">
                {/* Link Kembali ke Akun Overview */}
                <Link href="/admin/akun" className="text-xl font-bold text-gray-900 hover:text-blue-600 mr-4">
                    &larr;
                </Link>
                <h1 className="text-3xl font-extrabold text-gray-900">Akun Siswa</h1>
            </div>
            
            {/* HEADER AKSI (Search Bar & Tombol Aksi Tambahan) */}
            <div className="flex justify-between items-center mb-10 space-x-4">
                
                {/* Search Bar */}
                <div className="relative w-full max-w-sm">
                    <input
                        type="text"
                        placeholder="Cari siswa berdasarkan nama atau NISN..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 pl-10 transition duration-150 shadow-sm"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                
                {/* Tombol Aksi Tambahan (Contoh: Bulk Import/Settings) */}
                <button
                    className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors"
                    title="Pengaturan Tambahan Akun"
                >
                    <Settings className="w-5 h-5" />
                </button>
            </div>

            {/* DAFTAR AKUN SISWA (GRID KARTU) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredData.length > 0 ? (
                    filteredData.map(item => <SiswaCard key={item.id} data={item} />)
                ) : (
                    <p className="text-gray-500 col-span-full">Tidak ada akun siswa yang ditemukan.</p>
                )}
            </div>
            
        </div>
    );
};

export default AdminAkunSiswaPage;