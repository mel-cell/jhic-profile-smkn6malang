// File: src/app/admin/konten/berita/tambah/page.tsx
'use client';

import React, { useState } from 'react';
import { Camera, FileText } from 'lucide-react';
import Link from 'next/link';

// --- Komponen Input Teks Dasar ---
const FormInput = ({ label, id, type = 'text', placeholder = '' }: { label: string; id: string; type?: string; placeholder?: string }) => (
    <div className="mb-6">
        <label htmlFor={id} className="block text-base font-medium text-gray-700 mb-2">
            {label}
        </label>
        <input
            id={id}
            type={type}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm"
            placeholder={placeholder}
            required
        />
    </div>
);

// --- Komponen Textarea ---
const FormTextarea = ({ label, id }: { label: string; id: string }) => (
    <div className="mb-6">
        <label htmlFor={id} className="block text-base font-medium text-gray-700 mb-2">
            {label}
        </label>
        <textarea
            id={id}
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm resize-none"
            required
        ></textarea>
    </div>
);


// --- HALAMAN UTAMA TAMBAH BERITA ---
const AdminTambahBeritaPage: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        const judul = (document.getElementById('judul') as HTMLInputElement).value;
        const isi = (document.getElementById('isi') as HTMLTextAreaElement).value;
        const tanggal = (document.getElementById('tanggal') as HTMLInputElement).value;
        const penerbit = (document.getElementById('penerbit') as HTMLInputElement).value;

        if (!judul || !isi || !tanggal || !penerbit) {
            alert('Semua field harus diisi!');
            return;
        }

        formData.append('judul', judul);
        formData.append('content', isi);
        formData.append('kategori', 'Berita'); // Default kategori

        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('Token tidak ditemukan. Silakan login terlebih dahulu.');
                return;
            }

            const response = await fetch('/api/admin/news', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                alert('Berita berhasil dibuat!');
                window.location.href = '/admin/konten/berita';
            } else {
                alert('Gagal membuat berita: ' + result.error);
            }
        } catch (error) {
            console.error('Error creating news:', error);
            alert('Terjadi kesalahan saat membuat berita');
        }
    };

    return (
        <div className="p-8">
            {/* Header Judul Halaman */}
            <div className="flex items-center mb-8">
                {/* Link Kembali (simulasi panah) */}
                <Link href="/admin/konten/berita" className="text-xl font-bold text-blue-600 hover:text-blue-800 mr-4">
                    &larr;
                </Link>
                <h1 className="text-3xl font-extrabold text-gray-900">Berita</h1>
            </div>

            {/* Container Form dengan Shadow dan Border */}
            <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200 max-w-4xl mx-auto">
                
                {/* Judul Form dan Garis Kuning */}
                <div className="flex items-center border-b pb-4 mb-8 border-yellow-500">
                    <FileText className="w-8 h-8 text-gray-800 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">Tambah Berita</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Judul Berita */}
                    <div className="flex items-center">
                        <label htmlFor="judul" className="w-32 flex-shrink-0 text-gray-800 font-semibold">
                            Judul Berita
                        </label>
                        <span className="mr-4">:</span>
                        <input
                            id="judul"
                            type="text"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                            placeholder="Contoh: Juara Lomba Kompetensi Siswa"
                            required
                        />
                    </div>
                    
                    {/* Tanggal & Upload Foto */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0">
                        {/* Tanggal */}
                        <div className="flex items-center w-full sm:w-1/2">
                            <label htmlFor="tanggal" className="w-32 flex-shrink-0 text-gray-800 font-semibold">
                                Tanggal
                            </label>
                            <span className="mr-4">:</span>
                            <input
                                id="tanggal"
                                type="text" // Menggunakan text agar format DD/MM/YYYY mudah diinput
                                className="w-40 px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                placeholder="DD / MM / YYYY"
                                required
                            />
                        </div>
                        
                        {/* Upload Foto Button */}
                        <div className="flex items-center w-full sm:w-1/2 sm:justify-end">
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

                    {/* Penerbit */}
                    <div className="flex items-center">
                        <label htmlFor="penerbit" className="w-32 flex-shrink-0 text-gray-800 font-semibold">
                            Penerbit
                        </label>
                        <span className="mr-4">:</span>
                        <input
                            id="penerbit"
                            type="text"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                            placeholder="Nama Admin atau Divisi"
                            required
                        />
                    </div>

                    {/* Isi Berita */}
                    <div className="flex items-start">
                        <label htmlFor="isi" className="w-32 flex-shrink-0 text-gray-800 font-semibold pt-2">
                            Isi berita
                        </label>
                        <span className="mr-4 pt-2">:</span>
                        <textarea
                            id="isi"
                            rows={10}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 shadow-sm resize-none"
                            required
                        ></textarea>
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
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg shadow-md transition-all duration-200 active:scale-95"
                        >
                            Upload
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminTambahBeritaPage;