// File: src/app/admin/akun/siswa/[id]/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { 
    User, Phone, Calendar, Mail, GraduationCap, 
    BookOpen, Trash2, ArrowLeft, MoreHorizontal, Settings, FileText 
} from 'lucide-react';

// --- DATA DUMMY ---
const SISWA_DETAIL = {
    id: 123,
    name: 'Yang Jungwon',
    nis: '000000',
    nisn: '0000000000',
    class: 'XII RPL 1',
    major: 'Rekayasa Perangkat Lunak',
    email: 'assdiljskpaj@gmail.com',
    phone: '+6280000000000',
    status: 'Aktif', // Bisa jadi status pendaftaran, kelulusan, dll.
    image: '/placeholder-siswa-1.jpg',
};

// --- KOMPONEN UTAMA DETAIL AKUN SISWA ---
const AdminDetailAkunSiswaPage: React.FC = () => {
    // Di aplikasi nyata, Anda akan mengambil ID dari props (params)
    const data = SISWA_DETAIL; // Menggunakan data dummy

    return (
        <div className="p-8">
            
            {/* Header Halaman */}
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
                Detail akun siswa
            </h1>

            {/* HEADER PROFIL SISWA & Aksi */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
                <div className="flex items-start justify-between">
                    
                    {/* Info Dasar Siswa */}
                    <div className="flex items-center">
                        <div className="w-28 h-28 overflow-hidden rounded-full mr-6 border-4 border-gray-200 flex-shrink-0">
                            <img 
                                src={data.image} 
                                alt={data.name} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">{data.name}</h2>
                            <p className="text-sm text-gray-600 mb-2">
                                ( NISN {data.nisn} / {data.class} )
                            </p>
                            <p className="text-lg font-medium text-gray-700">
                                <Phone className="w-4 h-4 inline mr-1" /> {data.phone}
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
                            href="/admin/akun/siswa" 
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

            {/* DETAIL AKUN & INFORMASI TAMBAHAN */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Kolom Kiri: Detail Akun Utama */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 border-b pb-3 mb-4">Detail akun</h2>
                    
                    <div className="text-base space-y-3">
                        {/* Nama */}
                        <div className="flex">
                            <span className="w-32 font-medium text-gray-600">Nama</span>
                            <span className="mr-3">:</span>
                            <span className="text-gray-900 font-semibold">{data.name}</span>
                        </div>
                        
                        {/* NIS */}
                        <div className="flex">
                            <span className="w-32 font-medium text-gray-600">NIS</span>
                            <span className="mr-3">:</span>
                            <span className="text-gray-900">{data.nis}</span>
                        </div>

                        {/* Kelas */}
                        <div className="flex">
                            <span className="w-32 font-medium text-gray-600">Kelas</span>
                            <span className="mr-3">:</span>
                            <span className="text-gray-900">{data.class}</span>
                        </div>
                        
                        {/* Jurusan */}
                        <div className="flex">
                            <span className="w-32 font-medium text-gray-600">Jurusan</span>
                            <span className="mr-3">:</span>
                            <span className="text-gray-900">{data.major}</span>
                        </div>
                        
                        {/* Email */}
                        <div className="flex">
                            <span className="w-32 font-medium text-gray-600">Email</span>
                            <span className="mr-3">:</span>
                            <span className="text-gray-900">{data.email}</span>
                        </div>
                        
                        {/* No. Telp */}
                        <div className="flex">
                            <span className="w-32 font-medium text-gray-600">No. Telp</span>
                            <span className="mr-3">:</span>
                            <span className="text-gray-900">{data.phone}</span>
                        </div>
                        
                    </div>
                </div>

                {/* Kolom Kanan: Informasi Tambahan/Riwayat */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 border-b pb-3 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-blue-500" /> Riwayat Aksi
                    </h3>
                    
                    {/* Simulasi Card Riwayat File/Catatan */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative">
                        <button className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <p className="text-sm text-gray-700 italic">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis lacinia nibh. Curabitur cursus sem nec nunc ornare.
                        </p>
                        <div className="flex justify-end text-xs text-blue-500 mt-2">
                             <MoreHorizontal className="w-4 h-4" />
                            <span>Lihat selengkapnya</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDetailAkunSiswaPage;