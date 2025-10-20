// File: src/app/industri/cv/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, ArrowLeft, FileText, Download } from 'lucide-react';
import Link from 'next/link';
import { studentsAPI } from '@/app/services/api';

interface Student {
  id: string;
  fullName: string;
  major?: string;
  profilePhotoPath?: string;
  skills?: string;
  user: {
    email: string;
  };
  studentCvs: Array<{
    id: string;
    fileName: string;
    uploadedAt: string;
  }>;
}

// --- Komponen Kartu CV Siswa ---
const SiswaCard = ({ siswa, index }: { siswa: Student; index: number }) => {
    const delay = `${index * 50}ms`; // Staggered delay

    const handleViewCv = async () => {
        if (siswa.studentCvs.length > 0) {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) return;
                const response = await studentsAPI.getCvFile(siswa.studentCvs[0].fileName, token, false);
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
            } catch (error) {
                console.error('Error viewing CV:', error);
            }
        }
    };

    const handleDownloadCv = async () => {
        if (siswa.studentCvs.length > 0) {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) return;
                const response = await studentsAPI.getCvFile(siswa.studentCvs[0].fileName, token, true);
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = siswa.studentCvs[0].fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error downloading CV:', error);
            }
        }
    };

    return (
        <div
            className="p-5 border-2 border-gray-200 rounded-2xl shadow-lg bg-white
                        transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02]
                        animate-fadeIn"
            style={{
                animationDelay: delay,
            }}
        >

            {/* Foto, Nama, Jurusan */}
            <div className="flex flex-col items-start mb-4">
                <div className="relative w-16 h-16 border-2 border-black rounded-full overflow-hidden mb-3">
                    <Image
                        src={siswa.profilePhotoPath || '/default-avatar.png'}
                        alt={siswa.fullName}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
                    />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900">{siswa.fullName}</h3>
                <p className="text-xs text-gray-500 mt-1">{siswa.major || 'Jurusan tidak tersedia'}</p>
            </div>

            {/* Keahlian/Tags */}
            <div className="pt-2">
                <p className="text-sm font-bold text-gray-800 mb-2">Keahlian</p>
                <div className="flex flex-wrap gap-2">
                    {siswa.skills ? siswa.skills.split(',').slice(0, 5).map((skill, key) => (
                        <span key={key} className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-700 rounded-lg whitespace-nowrap transition-colors hover:bg-gray-200 hover:text-gray-800">
                            {skill.trim()}
                        </span>
                    )) : (
                        <span className="text-xs text-gray-500">Tidak ada keahlian tercatat</span>
                    )}
                </div>
            </div>

            {/* CV Actions */}
            {siswa.studentCvs.length > 0 ? (
                <div className="mt-5 flex gap-2">
                    <button
                        onClick={handleViewCv}
                        className="flex-1 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-all duration-200 shadow-md transform hover:scale-[1.01] active:scale-95"
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Lihat CV
                    </button>
                    <button
                        onClick={handleDownloadCv}
                        className="flex-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-all duration-200 shadow-md transform hover:scale-[1.01] active:scale-95"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Unduh CV
                    </button>
                </div>
            ) : (
                <div className="mt-5 w-full text-center bg-gray-100 text-gray-500 font-semibold py-2 rounded-lg">
                    CV belum tersedia
                </div>
            )}
        </div>
    );
};

// --- Komponen Tombol Filter Jurusan/Tipe ---
const FilterButton = ({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap transform hover:scale-[1.03] active:scale-95 ${
            isActive
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
        }`}
    >
        {label}
    </button>
);


const CVListPage: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('');

    useEffect(() => {
        fetchStudents();
    }, [searchQuery, activeFilter]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("authToken");
            if (!token) {
                setError("Token tidak ditemukan. Silakan login terlebih dahulu.");
                return;
            }

            const response = await studentsAPI.getStudentsForCompanies(token, searchQuery, activeFilter);
            if (response.success) {
                setStudents(response.data);
            } else {
                setError("Gagal memuat data siswa");
            }
        } catch (err: any) {
            console.error("Error fetching students:", err);
            setError("Gagal memuat data siswa");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-36 pb-16">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Memuat data siswa...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 pt-36 pb-16">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center py-20">
                        <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <Link href="/industri" className="text-blue-600 hover:underline">
                            Kembali ke Dashboard Industri
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // FUNGSI TOGGLE FILTER: Klik yang sama akan mereset filter
    const handleFilterClick = (filterValue: string) => {
        if (activeFilter === filterValue) {
            setActiveFilter(''); // Reset ke 'SEMUA'
        } else {
            setActiveFilter(filterValue);
        }
    };
    
    // --- Data Filter Jurusan/Tipe ---
    const filterOptions = [
        { label: 'RPL', value: 'RPL' },
        { label: 'OTO', value: 'OTO' },
        { label: 'DPIB', value: 'DPIB' },
        { label: 'TAB', value: 'TAB' },
        { label: 'TPM', value: 'TPM' },
        { label: 'TKR', value: 'TKR' },
        { label: 'TKJ', value: 'TKJ' },
        { label: 'SIJA', value: 'SIJA' },
        { label: 'KJIJ', value: 'KJIJ' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-36 pb-16 animate-fadeIn"> 
            <div className="container mx-auto px-6 max-w-7xl">
                
                {/* --- HEADER --- */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
                        Portofolio Siswa Kami
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Temukan profil lengkap dan CV dari para siswa terbaik dan siap kerja di berbagai bidang dan kompetensi keahlian
                    </p>
                    
                    {/* Info Jumlah Siswa */}
                    <p className="mt-4 text-sm text-gray-500 flex items-center justify-center space-x-2 transition-opacity duration-500">
                        <ArrowLeft className="w-5 h-5 text-orange-500 transform rotate-180 transition-transform duration-500 hover:text-red-500"/>
                        <span>{students.length} siswa</span>
                        <span className="h-1 w-1 bg-gray-400 rounded-full mx-1"></span>
                        <span>SMK Negeri 6 malang</span>
                    </p>
                </div>

                {/* --- SEARCH DAN FILTER --- */}
                <div className="p-4 bg-gray-100/70 rounded-xl shadow-lg mb-12 border border-gray-200 transition-shadow duration-300">
                    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                        
                        {/* Kolom Pencarian */}
                        <div className="flex-1 w-full relative">
                            <input
                                type="text"
                                placeholder="Cari berdasarkan nama, jurusan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-5 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-red-500 focus:border-red-500 transition-all duration-200 shadow-sm hover:shadow-md"
                            />
                            <Search className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors" />
                        </div>

                        {/* Tombol Filter */}
                        <div className="flex gap-3 p-3 bg-red-100/70 rounded-xl shadow-inner border border-red-300/50 w-full md:w-auto overflow-x-auto whitespace-nowrap scroll-smooth">

                        {/* Tombol 'SEMUA' */}
                        <FilterButton
                            label="SEMUA"
                            isActive={activeFilter === ''} // Aktif jika tidak ada filter
                            onClick={() => setActiveFilter('')} // Reset filter
                        />
                        {filterOptions.map(option => (
                            <FilterButton
                                key={option.value}
                                label={option.label}
                                isActive={activeFilter === option.value}
                                onClick={() => handleFilterClick(option.value)} // Menggunakan fungsi toggle
                            />
                        ))}
                        </div>
                    </div>
                </div>

                {/* --- GRID KARTU CV SISWA --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {students.filter(siswa => siswa.studentCvs.length > 0).map((siswa, index) => (
                        <SiswaCard
                            key={siswa.id}
                            siswa={siswa}
                            index={index} // Kirim index untuk staggered delay
                        />
                    ))}
                    {students.filter(siswa => siswa.studentCvs.length > 0).length === 0 && (
                        <div className="col-span-full text-center py-10 bg-white rounded-xl shadow-lg border border-gray-200">
                            <p className="text-xl font-semibold text-gray-700">
                                Maaf, tidak ada siswa dengan CV di jurusan {activeFilter} saat ini.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default CVListPage;