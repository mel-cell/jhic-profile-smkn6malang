// File: src/app/admin/notifikasi-event/tambah/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, ArrowLeft, Send } from 'lucide-react';

// --- KOMPONEN CHECKBOX AUDIENCE ---
const AudienceCheckbox = ({ label, checked, onChange }) => (
    <label className="flex items-center cursor-pointer text-gray-700 font-medium">
        <input 
            type="checkbox" 
            checked={checked} 
            onChange={onChange}
            className="form-checkbox h-5 w-5 text-red-600 rounded border-gray-300 focus:ring-red-500"
        />
        <span className="ml-2">{label}</span>
    </label>
);

// --- HALAMAN UTAMA TAMBAH NOTIFIKASI ---
const AdminTambahNotifikasiPage: React.FC = () => {
    const [targets, setTargets] = useState({
        semua: false,
        pengunjung: false,
        siswa: false,
        industri: false,
    });

    const handleTargetChange = (key: keyof typeof targets) => {
        setTargets(prev => {
            const newTargets = { ...prev, [key]: !prev[key] };
            
            // Logika 'Semua': Jika 'Semua' dipilih, pilih semua yang lain.
            if (key === 'semua' && newTargets.semua) {
                return { semua: true, pengunjung: true, siswa: true, industri: true };
            }
            // Logika: Jika salah satu un-check, 'Semua' harus di-un-check
            if (key !== 'semua' && prev.semua && !newTargets[key]) {
                newTargets.semua = false;
            }
            // Logika: Jika semua selain 'Semua' terpilih, otomatis centang 'Semua'
            const allOthersChecked = newTargets.pengunjung && newTargets.siswa && newTargets.industri;
            if (allOthersChecked) {
                newTargets.semua = true;
            }

            return newTargets;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedTargets = Object.entries(targets)
            .filter(([key, value]) => value)
            .map(([key]) => key);

        if (selectedTargets.length === 0) {
            alert("Pilih minimal satu target audiens untuk mengirim notifikasi.");
            return;
        }

        console.log('Notifikasi akan dikirim ke:', selectedTargets);
        alert(`Notifikasi berhasil dijadwalkan untuk: ${selectedTargets.join(', ')} (Lihat console)`);
        // Lakukan proses submit data ke API
    };

    // Warna tema untuk Notifikasi adalah Merah (sesuai tombol di screenshot)

    return (
        <div className="p-8">
            {/* Header Judul Halaman */}
            <div className="flex items-center mb-8">
                <Link href="/admin/notifikasi-event" className="text-xl font-bold text-gray-900 hover:text-red-600 mr-4">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-3xl font-extrabold text-gray-900">Tambah notifikasi</h1>
            </div>

            {/* Container Form dengan Shadow dan Border */}
            <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200 max-w-4xl mx-auto">
                
                <div className="flex items-center mb-6">
                    <Bell className="w-8 h-8 mr-3 text-red-500" />
                    <h2 className="text-2xl font-bold text-gray-900">Tambah notifikasi</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Judul Notifikasi */}
                    <div className="flex items-center">
                        <label htmlFor="judul-notifikasi" className="w-36 flex-shrink-0 text-gray-700 font-medium">
                            Judul notifikasi :
                        </label>
                        <input
                            id="judul-notifikasi"
                            type="text"
                            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-red-500 focus:border-red-500 shadow-sm ml-2"
                            placeholder="Contoh: Pengumuman Pembukaan Magang"
                            required
                        />
                    </div>
                    
                    {/* Deskripsi Notifikasi */}
                    <div className="flex items-start">
                        <label htmlFor="deskripsi-notifikasi" className="w-36 flex-shrink-0 text-gray-700 font-medium pt-2">
                            Deskripsi :
                        </label>
                        <textarea
                            id="deskripsi-notifikasi"
                            rows={4}
                            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-red-500 focus:border-red-500 shadow-sm ml-2"
                            placeholder="Tuliskan isi pesan notifikasi selengkapnya..."
                            required
                        />
                    </div>

                    {/* Kirim Ke (Target Audiens) */}
                    <div className="flex items-start pt-4">
                        <span className="w-36 flex-shrink-0 text-gray-700 font-medium">
                            Kirim ke :
                        </span>
                        <div className="flex-grow ml-2 grid grid-cols-2 gap-y-3">
                            <AudienceCheckbox 
                                label="Semua" 
                                checked={targets.semua} 
                                onChange={() => handleTargetChange('semua')}
                            />
                            <AudienceCheckbox 
                                label="Pengunjung" 
                                checked={targets.pengunjung} 
                                onChange={() => handleTargetChange('pengunjung')}
                            />
                            <AudienceCheckbox 
                                label="Siswa" 
                                checked={targets.siswa} 
                                onChange={() => handleTargetChange('siswa')}
                            />
                            <AudienceCheckbox 
                                label="Industri" 
                                checked={targets.industri} 
                                onChange={() => handleTargetChange('industri')}
                            />
                        </div>
                    </div>

                    {/* Tanggal Kirim */}
                    <div className="flex items-center pt-4">
                        <label htmlFor="tanggal" className="w-36 flex-shrink-0 text-gray-700 font-medium">
                            Tanggal :
                        </label>
                        <input
                            id="tanggal"
                            type="text" // Menggunakan text untuk placeholder DD/MM/YYYY
                            className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-red-500 focus:border-red-500 shadow-sm ml-2"
                            placeholder="DD / MM / YYYY"
                            required
                        />
                    </div>

                    {/* Tombol Aksi (Footer) */}
                    <div className="flex justify-end items-center space-x-4 pt-6 mt-10 border-t">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="text-gray-600 font-semibold hover:text-gray-800 transition-colors py-2 px-4"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex items-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-8 rounded-lg shadow-md transition-all duration-200 active:scale-95"
                        >
                            <Send className="w-5 h-5 mr-2" /> Upload
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminTambahNotifikasiPage;