// File: src/app/admin/akun/industri/[id]/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { 
    Mail, MapPin, Briefcase, Phone, Globe, ArrowLeft, Trash2, Settings, DollarSign
} from 'lucide-react';

// --- DATA DUMMY ---
const INDUSTRI_DETAIL = {
    id: 456,
    name: 'PT. Sekawan Media',
    pic: 'Kim Junhee',
    picTitle: 'PIC', // Asumsi "jawab" pada screenshot adalah Penanggung Jawab / PIC
    field: 'IT / Informatika',
    website: 'www.asolole.com.id',
    email: 'assdiljskpaj@gmail.com',
    address: 'JL. Jalani aja dulu no 7',
    status: 'Online',
    logo: '/logo-sekawan.png',
};

// Data Lowongan Pratinjau
const LOWONGAN_PREVIEW = {
    title: 'Desainer UI/UX',
    type: 'Part time, Full time',
    tags: ['Magang', 'Jurusan'],
    salary: '2.500.000 - 3.000.000',
};

// --- KOMPONEN KARTU LOWONGAN PREVIEW ---
const LowonganPreviewCard = ({ data }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-md">
        <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 border rounded-full">
                {/* Logo Perusahaan di dalam card lowongan */}
                <img src="/placeholder-small-logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-900">{INDUSTRI_DETAIL.name}</p>
                <h4 className="text-lg font-bold text-gray-900 leading-tight">{data.title}</h4>
            </div>
        </div>
        
        <div className="text-xs text-gray-600 mb-3 space-y-1">
            <p className="flex items-center space-x-1">
                <Briefcase className="w-3 h-3 text-blue-500" />
                <span>{data.type}</span>
            </p>
            <div className="flex flex-wrap space-x-1">
                {data.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
        
        <p className="text-sm font-bold text-green-600 mb-3 flex items-center">
            <DollarSign className="w-4 h-4 mr-1" />
            {data.salary}
        </p>

        <Link 
            href={`/admin/lowongan/${1}`} // Link ke detail lowongan
            className="w-full block text-center bg-blue-500 hover:bg-blue-600 text-white py-1.5 rounded-lg text-sm transition-colors"
        >
            Detail
        </Link>
    </div>
);


// --- KOMPONEN UTAMA DETAIL AKUN INDUSTRI ---
const AdminDetailAkunIndustriPage: React.FC = () => {
    const data = INDUSTRI_DETAIL; // Menggunakan data dummy

    return (
        <div className="p-8">
            
            {/* Header Halaman */}
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
                Detail akun Industri
            </h1>

            {/* HEADER PROFIL INDUSTRI & Aksi */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
                <div className="flex items-start justify-between">
                    
                    {/* Info Dasar Industri */}
                    <div className="flex items-center">
                        <div className="w-20 h-20 overflow-hidden rounded-lg mr-6 border-4 border-gray-200 flex-shrink-0">
                            <img 
                                src={data.logo} 
                                alt={data.name} 
                                className="w-full h-full object-contain p-1"
                            />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-1">{data.name}</h2>
                            <p className="text-sm text-gray-600 mb-1">
                                {data.pic} / {data.field}
                            </p>
                            <p className="text-base font-medium text-gray-700 flex items-center">
                                <Mail className="w-4 h-4 inline mr-1" /> {data.email}
                            </p>
                            {/* Status Akun */}
                            <span className="inline-flex items-center mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                                <Settings className="w-3 h-3 mr-1" /> {data.status}
                            </span>
                        </div>
                    </div>

                    {/* Tombol Aksi Kanan Atas */}
                    <div className="flex space-x-2">
                        <Link 
                            href="/admin/akun/industri" 
                            className="flex items-center text-gray-600 font-semibold py-2 px-4 rounded-lg border hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali
                        </Link>
                        <button
                            className="flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Hapus
                        </button>
                    </div>
                </div>
            </div>

            {/* DETAIL AKUN & LOWONGAN */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Kolom Kiri: Detail Akun Utama */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 border-b pb-3 mb-4">Detail akun</h2>
                    
                    <div className="text-base space-y-3">
                        {/* Nama Perusahaan */}
                        <div className="flex">
                            <span className="w-40 font-medium text-gray-600">Nama</span>
                            <span className="mr-3">:</span>
                            <span className="text-gray-900 font-semibold">{data.name}</span>
                        </div>
                        
                        {/* PIC */}
                        <div className="flex">
                            <span className="w-40 font-medium text-gray-600">Penanggung Jawab</span>
                            <span className="mr-3">:</span>
                            <span className="text-gray-900">{data.pic}</span>
                        </div>

                        {/* Bidang */}
                        <div className="flex">
                            <span className="w-40 font-medium text-gray-600">Bidang</span>
                            <span className="mr-3">:</span>
                            <span className="text-gray-900">{data.field}</span>
                        </div>
                        
                        {/* Website */}
                        <div className="flex">
                            <span className="w-40 font-medium text-gray-600">Website</span>
                            <span className="mr-3">:</span>
                            <span className="text-blue-600 hover:underline">{data.website}</span>
                        </div>
                        
                        {/* Email */}
                        <div className="flex">
                            <span className="w-40 font-medium text-gray-600">Email</span>
                            <span className="mr-3">:</span>
                            <span className="text-gray-900">{data.email}</span>
                        </div>
                        
                        {/* Alamat */}
                        <div className="flex">
                            <span className="w-40 font-medium text-gray-600">Alamat</span>
                            <span className="mr-3">:</span>
                            <span className="text-gray-900">{data.address}</span>
                        </div>
                        
                    </div>
                </div>

                {/* Kolom Kanan: Lowongan Pratinjau */}
                <div className="lg:col-span-1 p-0">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Lowongan Aktif</h3>
                    <LowonganPreviewCard data={LOWONGAN_PREVIEW} />
                </div>
            </div>
        </div>
    );
};

export default AdminDetailAkunIndustriPage;