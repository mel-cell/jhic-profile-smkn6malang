// File: src/app/admin/notifikasi-event/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Bell, Edit2, Trash2 } from 'lucide-react';

// --- DATA DUMMY NOTIFIKASI ---
const NOTIFIKASI_DATA = [
    // Ulangi data untuk mengisi grid (6 item sesuai screenshot)
    { 
        id: 1, 
        title: 'My god my universe', 
        date: '03 / 04 / 2025', 
        status: 'Aktif',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eget elit ultrices, fringilla elit eu, tempor neque.',
    },
    { id: 2, title: 'My god my universe', date: '03 / 04 / 2025', status: 'Aktif', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eget elit ultrices, fringilla elit eu, tempor neque.' },
    { id: 3, title: 'My god my universe', date: '03 / 04 / 2025', status: 'Aktif', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eget elit ultrices, fringilla elit eu, tempor neque.' },
    { id: 4, title: 'My god my universe', date: '03 / 04 / 2025', status: 'Aktif', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eget elit ultrices, fringilla elit eu, tempor neque.' },
    { id: 5, title: 'My god my universe', date: '03 / 04 / 2025', status: 'Aktif', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eget elit ultrices, fringilla elit eu, tempor neque.' },
    { id: 6, title: 'My god my universe', date: '03 / 04 / 2025', status: 'Aktif', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eget elit ultrices, fringilla elit eu, tempor neque.' },
];

// --- KOMPONEN KARTU NOTIFIKASI ---
const NotifikasiCard = ({ data }) => (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex flex-col justify-between h-full relative">
        
        {/* Indikator Status (Hijau) */}
        <div className="absolute top-4 left-4 w-3 h-3 bg-green-500 rounded-full" title={data.status}></div>

        {/* Konten */}
        <div className="pt-2 pl-6 pb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{data.title}</h3>
            <p className="text-sm text-gray-500 mb-2">{data.date}</p>
            <p className="text-sm text-gray-700 line-clamp-3">{data.content}</p>
        </div>

        {/* Tombol Aksi (Edit & Hapus) */}
        <div className="flex justify-end space-x-2 border-t pt-3">
            <Link
                    href={`/admin/notifikasi-event/${data.id}/edit`} // Arahkan ke halaman tambah notifikasi
                    className="p-2 rounded-full text-blue-500 hover:bg-blue-50 transition-colors"
                    title='Edit Notifikasi'
                >
                    <Edit2 className="w-4 h-4" />
            </Link>
            <button
                className="p-2 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                title="Hapus Notifikasi"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    </div>
);


// --- HALAMAN UTAMA MANAJEMEN NOTIFIKASI ---
const AdminNotifikasiEventPage: React.FC = () => {
    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Manajemen notifikasi</h1>
                
                {/* Tombol Tambah Notifikasi (Merah) */}
                <Link
                    href="/admin/notifikasi-event/tambah" // Arahkan ke halaman tambah notifikasi
                    className="flex items-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-5 rounded-lg shadow-md transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Tambah notifikasi
                </Link>
            </div>

            {/* DAFTAR NOTIFIKASI (GRID KARTU) */}
            {NOTIFIKASI_DATA.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {NOTIFIKASI_DATA.map(item => <NotifikasiCard key={item.id} data={item} />)}
                </div>
            ) : (
                <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
                    <Bell className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-500">Belum ada notifikasi yang dibuat.</p>
                </div>
            )}
            
        </div>
    );
};

export default AdminNotifikasiEventPage;