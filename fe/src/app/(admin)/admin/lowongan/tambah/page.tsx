// File: src/app/admin/lowongan-kerja/tambah/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Briefcase, ArrowLeft } from 'lucide-react';

// --- KOMPONEN INPUT RANGE SLIDER (GAJI) ---
const GajiSlider = ({ gaji, setGaji }) => {
    // Fungsi untuk memformat angka menjadi mata uang Rupiah
    const formatRupiah = (angka) => {
        return `Rp. ${new Intl.NumberFormat('id-ID').format(angka)}`;
    };

    return (
        <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Gaji</label>
            <div className="flex justify-between text-gray-500 text-xs">
                <span>0</span>
                <span>100.000.000</span>
            </div>
            
            {/* Range Input */}
            <input
                type="range"
                min="0"
                max="100000000"
                step="500000" // Langkah 500rb
                value={gaji}
                onChange={(e) => setGaji(Number(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer range-lg my-2"
                style={{
                    // Style untuk warna biru pada range yang sudah terisi
                    background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${gaji / 1000000}% , #D1D5DB ${gaji / 1000000}%, #D1D5DB 100%)`
                }}
            />

            {/* Nominal Gaji Display */}
            <div className="mt-2">
                <input
                    type="text"
                    readOnly
                    value={`Nominal: ${formatRupiah(gaji)}`}
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-semibold shadow-sm w-full sm:w-1/2"
                />
            </div>
        </div>
    );
};


// --- HALAMAN UTAMA TAMBAH LOWONGAN ---
const AdminTambahLowonganPage: React.FC = () => {
    const [gaji, setGaji] = useState(0); // State untuk slider gaji

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Lowongan Disimpan dengan Gaji:', gaji);
        alert('Lowongan berhasil ditambahkan (Lihat console)');
    };
    
    // Warna tema untuk Lowongan adalah Kuning / Emas (sesuai garis di screenshot)

    return (
        <div className="p-8">
            {/* Header Judul Halaman */}
            <div className="flex items-center mb-8">
                <Link href="/admin/lowongan" className="text-xl font-bold text-gray-900 hover:text-blue-600 mr-4">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-3xl font-extrabold text-gray-900">Tambah lowongan</h1>
            </div>

            {/* Container Form dengan Shadow dan Border */}
            <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200 max-w-6xl mx-auto">
                
                <form onSubmit={handleSubmit} className="space-y-10">

                    {/* BAGIAN 1: Informasi Lowongan */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 border-b-4 border-yellow-500 pb-2 mb-6">Informasi lowongan</h2>

                        {/* Judul Lowongan */}
                        <div className="mb-4">
                            <label htmlFor="judul-lowongan" className="block text-sm font-medium text-gray-700 mb-1">Judul lowongan</label>
                            <input
                                id="judul-lowongan"
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-yellow-500 focus:border-yellow-500 shadow-sm"
                                placeholder="Contoh: Desainer UI/UX Senior"
                                required
                            />
                        </div>
                        
                        {/* Deskripsi Lowongan */}
                        <div>
                            <label htmlFor="deskripsi-lowongan" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Lowongan</label>
                            <textarea
                                id="deskripsi-lowongan"
                                rows={6}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-yellow-500 focus:border-yellow-500 shadow-sm"
                                placeholder="Jelaskan tanggung jawab dan budaya kerja perusahaan..."
                                required
                            />
                        </div>
                    </section>
                    
                    {/* BAGIAN 2: Jenis Lowongan */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 border-b-4 border-yellow-500 pb-2 mb-6">Jenis lowongan</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Bidang Pekerjaan */}
                            <div>
                                <label htmlFor="bidang-pekerjaan" className="block text-sm font-medium text-gray-700 mb-1">Bidang pekerjaan</label>
                                <input
                                    id="bidang-pekerjaan"
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-yellow-500 focus:border-yellow-500 shadow-sm"
                                    placeholder="Contoh: Teknologi Informasi, Desain Grafis"
                                    required
                                />
                            </div>
                            {/* Jenis Pekerjaan */}
                            <div>
                                <label htmlFor="jenis-pekerjaan" className="block text-sm font-medium text-gray-700 mb-1">Jenis pekerjaan</label>
                                <input
                                    id="jenis-pekerjaan"
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-yellow-500 focus:border-yellow-500 shadow-sm"
                                    placeholder="Contoh: Full Time, Part Time, Remote"
                                    required
                                />
                            </div>
                        </div>

                        {/* Slider Gaji */}
                        <GajiSlider gaji={gaji} setGaji={setGaji} />
                    </section>
                    
                    {/* BAGIAN 3: Kualifikasi Lowongan */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 border-b-4 border-yellow-500 pb-2 mb-6">Kualifikasi lowongan</h2>
                        
                        {/* Kualifikasi Lowongan (Teks Area) */}
                        <div className="mb-4">
                            <label htmlFor="kualifikasi-lowongan" className="block text-sm font-medium text-gray-700 mb-1">Kualifikasi Lowongan</label>
                            <textarea
                                id="kualifikasi-lowongan"
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-yellow-500 focus:border-yellow-500 shadow-sm"
                                placeholder="Tuliskan poin-poin kualifikasi (contoh: Lulusan RPL, Menguasai Figma)..."
                                required
                            />
                        </div>
                        
                        {/* Benefit Lowongan */}
                        <div>
                            <label htmlFor="benefit-lowongan" className="block text-sm font-medium text-gray-700 mb-1">Benefit Lowongan</label>
                            <textarea
                                id="benefit-lowongan"
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-yellow-500 focus:border-yellow-500 shadow-sm"
                                placeholder="Contoh: Gaji kompetitif, Asuransi Kesehatan, Cuti tahunan..."
                            />
                        </div>
                    </section>

                    {/* BAGIAN 4: Tenggat Waktu */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 border-b-4 border-yellow-500 pb-2 mb-6">Tenggat Waktu</h2>
                        
                        <div className="flex space-x-6">
                            {/* Di buka */}
                            <div className="w-1/2">
                                <label htmlFor="tanggal-buka" className="block text-sm font-medium text-gray-700 mb-1">Di buka</label>
                                <input
                                    id="tanggal-buka"
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-yellow-500 focus:border-yellow-500 shadow-sm"
                                    placeholder="DD / MM / YYYY"
                                    required
                                />
                            </div>
                            {/* Di tutup */}
                            <div className="w-1/2">
                                <label htmlFor="tanggal-tutup" className="block text-sm font-medium text-gray-700 mb-1">Di tutup</label>
                                <input
                                    id="tanggal-tutup"
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-yellow-500 focus:border-yellow-500 shadow-sm"
                                    placeholder="DD / MM / YYYY"
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    {/* Tombol Aksi (Footer) */}
                    <div className="flex justify-end items-center space-x-4 pt-6 mt-10 border-t">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="text-gray-600 font-semibold hover:text-gray-800 transition-colors py-2 px-4"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-8 rounded-lg shadow-md transition-all duration-200 active:scale-95"
                        >
                            Upload
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminTambahLowonganPage;