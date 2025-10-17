// File: src/app/industri/cv/[id]/CVModal.tsx
'use client';

import React, { useState, useEffect } from 'react'; 
import Image from 'next/image';
import { Mail, Phone, MapPin, X, Briefcase, GraduationCap, Link as LinkIcon, Download } from 'lucide-react';

// --- TIPE DATA SISWA (Harus sesuai dengan page.tsx) ---
interface SiswaDetail {
    id: string;
    nama: string;
    kelas: string;
    fotoUrl: string;
    deskripsiLengkap: string;
    keahlian: string[];
    pendidikan: string;
    pengalamanKerja: string;
    infoKontak: {
        email: string;
        lokasi: string;
        gender: string;
        tanggalLahir: string;
        noTelp: string;
    };
    socialMedia: {
        tiktok?: string;
        instagram?: string;
        facebook?: string;
    };
    portofolio: any[];
}

interface CVModalProps {
    siswa: SiswaDetail;
    onClose: () => void;
}

const CVModal: React.FC<CVModalProps> = ({ siswa, onClose }) => {
    // State untuk mengontrol animasi (true saat modal muncul, false saat mau ditutup)
    const [isVisible, setIsVisible] = useState(false); 
    
    // Efek untuk memicu animasi saat komponen di-mount
    useEffect(() => {
        // Memicu fade-in/slide-up setelah render pertama
        setIsVisible(true); 
        document.body.style.overflow = 'hidden';
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Fungsi untuk menutup dengan animasi fade-out
    const handleClose = () => {
        setIsVisible(false); // Memicu animasi fade-out
        // Tunggu hingga animasi selesai (300ms) baru panggil onClose untuk menghilangkan komponen
        setTimeout(onClose, 300); 
    };

    // Struktur Modal: Full Screen Overlay
    return (
        // **TRANSISI UNTUK OVERLAY (Fade-in/out)**
        <div 
            className={`fixed inset-0 z-50 overflow-y-auto flex justify-center items-start pt-10 pb-10 transition-opacity duration-300
                ${isVisible ? 'bg-black bg-opacity-50 opacity-100' : 'opacity-0 pointer-events-none'}`}
            // Tutup modal jika klik di luar konten
            onClick={handleClose}
        >
            {/* Modal Content */}
            {/* **TRANSISI UNTUK KONTEN (Slide-up/down)** */}
            <div 
                className={`bg-white rounded-xl shadow-2xl w-full max-w-4xl relative transition-all duration-300 ease-out
                    ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                // Menghentikan event click menyebar ke overlay
                onClick={(e) => e.stopPropagation()} 
            >
                
                {/* Tombol Tutup */}
                <button
                    onClick={handleClose} // Panggil handleClose untuk animasi
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 z-10 p-2 bg-white rounded-full shadow-md"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="p-8 md:p-12">
                    
                    {/* CV HEADER: Nama & Foto */}
                    <div className="flex items-center border-b pb-6 mb-6">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0 mr-6">
                            <Image
                                src={siswa.fotoUrl}
                                alt={siswa.nama}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-full"
                            />
                        </div>
                        <div>
                            <h2 className="text-4xl font-extrabold text-gray-900">{siswa.nama}</h2>
                            <p className="text-xl font-medium text-blue-600 mt-1">{siswa.kelas}</p>
                            <p className="text-gray-500 text-sm mt-1">Lulusan Baru / Siap Magang</p>
                        </div>
                        
                        {/* Tombol Download CV */}
                         <button className="ml-auto flex items-center bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-lg shadow-md transition-colors text-sm">
                            <Download className="w-4 h-4 mr-2" /> Download CV
                        </button>
                    </div>

                    {/* CV CONTENT: Dua Kolom */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        
                        {/* KOLOM KIRI (Data Diri, Kontak, Sosmed) */}
                        <div className="md:col-span-1 bg-gray-50 p-6 rounded-lg space-y-6">
                            
                            {/* Kontak */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-1 mb-2">KONTAK</h3>
                                <p className="flex items-center space-x-3 text-sm text-gray-700">
                                    <Mail className="w-4 h-4 text-blue-500" />
                                    <span>{siswa.infoKontak.email}</span>
                                </p>
                                <p className="flex items-center space-x-3 text-sm text-gray-700">
                                    <Phone className="w-4 h-4 text-blue-500" />
                                    <span>{siswa.infoKontak.noTelp}</span>
                                </p>
                                <p className="flex items-start space-x-3 text-sm text-gray-700">
                                    <MapPin className="w-4 h-4 mt-0.5 text-blue-500" />
                                    <span>{siswa.infoKontak.lokasi}</span>
                                </p>
                            </div>

                            {/* Data Diri */}
                            <div className="space-y-3 pt-3 border-t border-gray-200">
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-1 mb-2">DATA DIRI</h3>
                                <p className="text-sm text-gray-700"><span className="font-medium">Gender:</span> {siswa.infoKontak.gender}</p>
                                <p className="text-sm text-gray-700"><span className="font-medium">Lahir:</span> {siswa.infoKontak.tanggalLahir}</p>
                            </div>
                            
                            {/* Media Sosial */}
                            <div className="space-y-3 pt-3 border-t border-gray-200">
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-1 mb-2">SOSIAL MEDIA</h3>
                                <div className="flex space-x-4">
                                    {siswa.socialMedia.instagram && <LinkIcon className="w-5 h-5 text-gray-600 hover:text-pink-600" />}
                                    {siswa.socialMedia.tiktok && <LinkIcon className="w-5 h-5 text-gray-600 hover:text-black" />}
                                    {siswa.socialMedia.facebook && <LinkIcon className="w-5 h-5 text-gray-600 hover:text-blue-700" />}
                                </div>
                            </div>
                        </div>

                        {/* KOLOM KANAN (Tentang, Pendidikan, Pengalaman, Keahlian) */}
                        <div className="md:col-span-2 space-y-8">
                            
                            {/* Tentang Saya (Deskripsi) */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">TENTANG SAYA</h3>
                                <p className="text-gray-700 text-base">{siswa.deskripsiLengkap}</p>
                            </div>

                            {/* Pendidikan */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4 flex items-center"><GraduationCap className="w-5 h-5 mr-2 text-blue-500"/> PENDIDIKAN</h3>
                                <p className="text-gray-700 text-base font-medium">{siswa.pendidikan}</p>
                            </div>
                            
                            {/* Pengalaman Kerja */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4 flex items-center"><Briefcase className="w-5 h-5 mr-2 text-blue-500"/> PENGALAMAN KERJA</h3>
                                <p className="text-gray-700 text-base font-medium">{siswa.pengalamanKerja}</p>
                            </div>

                            {/* Keahlian / Kemampuan */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">KEMAMPUAN</h3>
                                <div className="flex flex-wrap gap-2">
                                    {siswa.keahlian.map((skill, index) => (
                                        <span key={index} className="text-sm font-medium px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CVModal;