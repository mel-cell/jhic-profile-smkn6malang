// File: src/app/admin/konten/prestasi/tambah/page.tsx
'use client';

import React, { useState } from 'react';
import { Camera, Award } from 'lucide-react';
import Link from 'next/link';

// --- HALAMAN UTAMA TAMBAH PRESTASI ---
const AdminTambahPrestasiPage: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Prestasi Disimpan');
        // Implementasi nyata: kirim data form dan file ke backend
        alert('Prestasi berhasil diunggah (Lihat console)');
    };

    // Komponen input terpisah untuk DRY (Do Not Repeat Yourself)
    const InputField = ({ label, id, placeholder = '' }) => (
        <div className="flex items-center mb-6">
            <label htmlFor={id} className="w-40 flex-shrink-0 text-gray-800 font-semibold">
                {label}
            </label>
            <span className="mr-4">:</span>
            <input
                id={id}
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                placeholder={placeholder}
                required
            />
        </div>
    );

    return (
        <div className="p-8">
            {/* Header Judul Halaman */}
            <div className="flex items-center mb-8">
                {/* Link Kembali (simulasi panah) */}
                <Link href="/admin/konten/prestasi" className="text-xl font-bold text-blue-600 hover:text-blue-800 mr-4">
                    &larr;
                </Link>
                <h1 className="text-3xl font-extrabold text-gray-900">Prestasi baru</h1>
            </div>

            {/* Container Form dengan Shadow dan Border */}
            <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200 max-w-4xl mx-auto">
                
                {/* Judul Form dan Garis Oranye */}
                <div className="flex items-center border-b pb-4 mb-8 border-orange-500">
                    <Award className="w-8 h-8 text-orange-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">Tambah Prestasi</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Judul Prestasi */}
                    <InputField 
                        label="Judul Prestasi" 
                        id="judul" 
                        placeholder="Contoh: Juara 1 Lomba Web Design" 
                    />
                    
                    {/* Tanggal & Upload Foto */}
                    <div className="flex items-center space-x-6">
                        {/* Tanggal */}
                        <div className="flex items-center flex-shrink-0">
                            <label htmlFor="tanggal" className="w-40 flex-shrink-0 text-gray-800 font-semibold">
                                Tanggal
                            </label>
                            <span className="mr-4">:</span>
                            <input
                                id="tanggal"
                                type="text"
                                className="w-40 px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                                placeholder="DD / MM / YYYY"
                                required
                            />
                        </div>
                        
                        {/* Upload Foto Button */}
                        <div className="flex-1 flex justify-end">
                            <label htmlFor="upload-foto" 
                                className="flex items-center bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors shadow-sm">
                                <Camera className="w-5 h-5 mr-2" />
                                {selectedFile ? selectedFile.name : 'Upload foto'}
                                <input
                                    id="upload-foto"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    required
                                />
                            </label>
                        </div>
                    </div>

                    {/* Penerima */}
                    <InputField 
                        label="Penerima" 
                        id="penerima" 
                        placeholder="Nama Siswa/Kelompok" 
                    />

                    {/* Tingkat Lomba */}
                    <InputField 
                        label="Tingkat lomba" 
                        id="tingkat" 
                        placeholder="Contoh: Nasional / Provinsi" 
                    />

                    {/* Penyelenggara */}
                    <InputField 
                        label="Penyelenggara" 
                        id="penyelenggara" 
                        placeholder="Nama Instansi Penyelenggara" 
                    />


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
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-8 rounded-lg shadow-md transition-all duration-200 active:scale-95"
                        >
                            Upload
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminTambahPrestasiPage;