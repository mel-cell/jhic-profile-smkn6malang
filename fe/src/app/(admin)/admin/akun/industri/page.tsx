// File: src/app/admin/akun/industri/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
    Search, User, Briefcase, Mail, MapPin, Phone, ArrowLeft, Settings
} from 'lucide-react';

// --- DATA DUMMY ---
const INDUSTRI_DATA = [
    // Ulangi data untuk mengisi grid (8 item sesuai screenshot)
    { 
        id: 1, 
        name: 'PT. Sekawan Media', 
        pic: 'Kim Junhee', 
        address: 'JL. Jakari aja dulu No 7, Surabaya', 
        phone: '+628XXXXXXXXXX', 
        email: 'sajgjakak@gmail.com', 
        status: 'AKTIF',
        field: 'IT',
        logo: '/logo-sekawan.png' // Asumsi logo PT Sekawan Media
    },
    { id: 2, name: 'PT. Sekawan Media', pic: 'Kim Junhee', address: 'JL. Jakari aja dulu No 7, Surabaya', phone: '+628XXXXXXXXXX', email: 'sajgjakak@gmail.com', status: 'AKTIF', field: 'IT', logo: '/logo-sekawan.png' },
    { id: 3, name: 'PT. Sekawan Media', pic: 'Kim Junhee', address: 'JL. Jakari aja dulu No 7, Surabaya', phone: '+628XXXXXXXXXX', email: 'sajgjakak@gmail.com', status: 'AKTIF', field: 'IT', logo: '/logo-sekawan.png' },
    { id: 4, name: 'PT. Sekawan Media', pic: 'Kim Junhee', address: 'JL. Jakari aja dulu No 7, Surabaya', phone: '+628XXXXXXXXXX', email: 'sajgjakak@gmail.com', status: 'AKTIF', field: 'IT', logo: '/logo-sekawan.png' },
    { id: 5, name: 'PT. Sekawan Media', pic: 'Kim Junhee', address: 'JL. Jakari aja dulu No 7, Surabaya', phone: '+628XXXXXXXXXX', email: 'sajgjakak@gmail.com', status: 'AKTIF', field: 'IT', logo: '/logo-sekawan.png' },
    { id: 6, name: 'PT. Sekawan Media', pic: 'Kim Junhee', address: 'JL. Jakari aja dulu No 7, Surabaya', phone: '+628XXXXXXXXXX', email: 'sajgjakak@gmail.com', status: 'AKTIF', field: 'IT', logo: '/logo-sekawan.png' },
    { id: 7, name: 'PT. Sekawan Media', pic: 'Kim Junhee', address: 'JL. Jakari aja dulu No 7, Surabaya', phone: '+628XXXXXXXXXX', email: 'sajgjakak@gmail.com', status: 'AKTIF', field: 'IT', logo: '/logo-sekawan.png' },
    { id: 8, name: 'PT. Sekawan Media', pic: 'Kim Junhee', address: 'JL. Jakari aja dulu No 7, Surabaya', phone: '+628XXXXXXXXXX', email: 'sajgjakak@gmail.com', status: 'AKTIF', field: 'IT', logo: '/logo-sekawan.png' },
];

// --- KOMPONEN KARTU INDUSTRI ---
const IndustriCard = ({ data }) => (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex flex-col h-full">
        
        {/* Logo dan Nama Industri */}
        <div className="flex items-center border-b pb-3 mb-3">
            <div className="w-10 h-10 overflow-hidden rounded-full mr-3 border border-gray-200 flex-shrink-0">
                 {/* Logo Sekawan Media dari screenshot */}
                <img src={data.logo} alt={data.name} className="w-full h-full object-contain p-1" />
            </div>
            <h3 className="text-base font-bold text-gray-900 leading-tight">{data.name}</h3>
        </div>

        {/* Detail Industri */}
        <div className="text-xs text-gray-700 space-y-1 flex-grow">
            <p className="flex items-center"><User className="w-3 h-3 mr-2 text-gray-500" /> {data.pic}</p>
            <p className="flex items-center"><MapPin className="w-3 h-3 mr-2 text-gray-500" /> {data.address}</p>
            <p className="flex items-center"><Phone className="w-3 h-3 mr-2 text-gray-500" /> {data.phone}</p>
            <p className="flex items-center"><Mail className="w-3 h-3 mr-2 text-gray-500" /> {data.email}</p>
        </div>
        
        {/* Status dan Bidang */}
        <div className="text-xs mt-3 space-y-1">
            <div className="flex items-center space-x-2">
                 <span className="font-semibold text-gray-600">Status akun:</span>
                 <span className={`px-2 py-0.5 rounded-full text-white font-bold ${data.status === 'AKTIF' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {data.status}
                </span>
            </div>
             <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-600">Bidang:</span>
                <span className="text-gray-900">{data.field}</span>
            </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-between space-x-2 mt-4 pt-3 border-t">
            <Link 
                href={`/admin/akun/industri/${data.id}`} // Arahkan ke halaman detail industri
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


// --- HALAMAN UTAMA DAFTAR AKUN INDUSTRI ---
const AdminAkunIndustriPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // Filter data berdasarkan search term (contoh: nama industri)
    const filteredData = INDUSTRI_DATA.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.pic.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="flex items-center mb-8">
                {/* Link Kembali ke Akun Overview */}
                <Link href="/admin/akun" className="text-xl font-bold text-gray-900 hover:text-blue-600 mr-4">
                    &larr;
                </Link>
                <h1 className="text-3xl font-extrabold text-gray-900">Akun Industri</h1>
            </div>
            
            {/* HEADER AKSI (Search Bar & Tombol Aksi Tambahan) */}
            <div className="flex justify-between items-center mb-10 space-x-4">
                
                {/* Search Bar */}
                <div className="relative w-full max-w-sm">
                    <input
                        type="text"
                        placeholder="Cari industri berdasarkan nama atau PIC..."
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

            {/* DAFTAR AKUN INDUSTRI (GRID KARTU) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredData.length > 0 ? (
                    filteredData.map(item => <IndustriCard key={item.id} data={item} />)
                ) : (
                    <p className="text-gray-500 col-span-full">Tidak ada akun industri yang ditemukan.</p>
                )}
            </div>
            
        </div>
    );
};

export default AdminAkunIndustriPage;