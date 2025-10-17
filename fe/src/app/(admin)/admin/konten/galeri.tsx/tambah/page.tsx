// File: src/app/admin/konten/galeri/tambah/page.tsx
'use client';

import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import Link from 'next/link';

// --- HALAMAN UTAMA TAMBAH GALERI ---
const AdminTambahGaleriPage: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Galeri Disimpan');
        // Implementasi nyata: kirim data form dan file ke backend
        alert('Galeri berhasil diunggah (Lihat console)');
    };
    
    // Warna tema untuk Galeri adalah Hijau (sesuai tombol di halaman Galeri)

    return (
        <div className="p-8">
            {/* Header Judul Halaman */}
            <div className="flex items-center mb-8">
                {/* Link Kembali (simulasi panah) */}
                <Link href="/admin/konten/galeri" className="text-xl font-bold text-blue-600 hover:text-blue-800 mr-4">
                    &larr;
                </Link>
                <h1 className="text-3xl font-extrabold text-gray-900">Prestasi baru</h1> {/* Judul di screenshot salah, kita asumsikan ini Galeri baru */}
            </div>

            {/* Container Form dengan Shadow dan Border */}
            <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200 max-w-4xl mx-auto">
                
                {/* Judul Form dan Garis Hijau */}
                <div className="flex items-center border-b pb-4 mb-8 border-green-500">
                    <Camera className="w-8 h-8 text-green-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">Tambah galeri</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Judul Foto */}
                    <div className="flex items-center">
                        <label htmlFor="judul-foto" className="w-32 flex-shrink-0 text-gray-800 font-semibold">
                            Judul foto
                        </label>
                        <span className="mr-4">:</span>
                        <input
                            id="judul-foto"
                            type="text"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-green-500 focus:border-green-500 shadow-sm"
                            placeholder="Contoh: Kegiatan P5 Tahun 2025"
                            required
                        />
                    </div>
                    
                    {/* Tanggal & Upload Foto */}
                    <div className="flex items-center space-x-6">
                        {/* Tanggal */}
                        <div className="flex items-center flex-shrink-0">
                            <label htmlFor="tanggal" className="w-32 flex-shrink-0 text-gray-800 font-semibold">
                                Tanggal
                            </label>
                            <span className="mr-4">:</span>
                            <input
                                id="tanggal"
                                type="text"
                                className="w-40 px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-green-500 focus:border-green-500 shadow-sm"
                                placeholder="DD / MM / YYYY"
                                required
                            />
                        </div>
                        
                        {/* Upload Foto Button */}
                        <div className="flex-1 flex justify-end">
                            <label htmlFor="upload-foto" 
                                className="flex items-center bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors shadow-sm">
                                <Camera className="w-5 h-5 mr-2" />
                                {selectedFile ? selectedFile.name : 'upload foto'}
                                <input
                                    id="upload-foto"
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    required
                                    multiple // Asumsi galeri bisa upload banyak file
                                />
                            </label>
                        </div>
                    </div>


                    {/* Tombol Aksi (Footer) */}
                    <div className="flex justify-end items-center space-x-4 pt-6 mt-10">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="text-gray-600 font-semibold hover:text-gray-800 transition-colors py-2 px-4"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-8 rounded-lg shadow-md transition-all duration-200 active:scale-95"
                        >
                            Upload
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminTambahGaleriPage;