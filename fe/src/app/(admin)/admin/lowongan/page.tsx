// File: src/app/admin/lowongan-kerja/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Briefcase, Trash2, DollarSign, ArrowLeft, ArrowRight } from 'lucide-react';
import { adminAPI } from '@/app/services/api';

// --- KOMPONEN KARTU LOWONGAN ---
const LowonganCard = ({ data }: { data: any }) => (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex flex-col justify-between h-full">

        {/* Header (Logo & Nama Perusahaan) */}
        <div className="flex items-center space-x-3 mb-3 border-b pb-3">
            <div className="w-10 h-10 border rounded-full overflow-hidden flex-shrink-0">
                <img src={data.logo} alt="Logo" className="w-full h-full object-contain p-1" />
            </div>
            <p className="text-sm font-semibold text-gray-700 leading-tight">{data.company}</p>
        </div>

        {/* Konten Utama */}
        <div className="flex-grow">
            <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{data.jobTitle}</h3>

            {/* Tipe Pekerjaan & Tags */}
            <div className="flex flex-wrap gap-1 mb-2">
                {data.type?.split(',').map((item: any, index: any) => (
                    <span key={index} className="px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                        {item.trim()}
                    </span>
                ))}
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
                {data.tags?.map((tag: any, index: any) => (
                    <span key={index} className="px-2 py-0.5 text-xs text-gray-600 bg-gray-100 rounded-full">
                        {tag}
                    </span>
                ))}
            </div>

            {/* Gaji */}
            <div className="flex items-center text-sm font-bold text-green-600">
                <DollarSign className="w-4 h-4 mr-1" />
                <span className="text-gray-500 font-normal mr-1">Kisaran Gaji:</span>
                {data.salary}
            </div>
        </div>

        {/* Footer Aksi */}
        <div className="flex justify-between space-x-2 mt-4 pt-3 border-t">
            <Link
                href={`/admin/lowongan/${data.id}`}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg text-sm text-center transition-colors"
            >
                Detail
            </Link>
            <button
                className="w-10 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
                title="Hapus Lowongan"
            >
                <Trash2 className="w-4 h-4 mx-auto" />
            </button>
        </div>
    </div>
);

// --- KOMPONEN FILTER ---
const LowonganFilter = ({ filters, setFilters }: { filters: any; setFilters: any }) => {
    const handleCheck = (type: any) => {
        setFilters((prev: any) => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Filter</h2>

            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tipe Lowongan</label>
                <div className="space-y-2 text-sm">
                    {/* Checkbox PartTime */}
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filters.partTime}
                            onChange={() => handleCheck('partTime')}
                            className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700">Part Time</span>
                    </label>

                    {/* Checkbox FullTime */}
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filters.fullTime}
                            onChange={() => handleCheck('fullTime')}
                            className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700">Full Time</span>
                    </label>

                    {/* Checkbox Magang */}
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filters.internship}
                            onChange={() => handleCheck('internship')}
                            className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700">Magang</span>
                    </label>
                </div>
            </div>

            {/* Di sini bisa ditambahkan filter lain, seperti bidang pekerjaan, gaji, dll. */}
        </div>
    );
};

// --- HALAMAN UTAMA MANAJEMEN LOWONGAN ---
const AdminLowonganKerjaPage: React.FC = () => {
    const [lowonganData, setLowonganData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        partTime: false,
        fullTime: false,
        internship: false,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10; // Sesuai pagination di screenshot

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('authToken');

                if (!token) {
                    console.error('No auth token found');
                    setLoading(false);
                    return;
                }

                // Fetch all job postings
                const jobsRes = await adminAPI.getAllJobPostings(token);
                const jobs = jobsRes.data || [];

                setLowonganData(jobs);

            } catch (error) {
                console.error('Failed to fetch job postings:', error);
                // Fallback to empty array
                setLowonganData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Logika Filter (Sederhana)
    const filteredData = lowonganData.filter((item: any) => {
        if (!filters.partTime && !filters.fullTime && !filters.internship) return true;

        let matches = false;
        const typeLower = item.type?.toLowerCase() || '';
        const tagsLower = item.tags?.map((tag: any) => tag.toLowerCase()) || [];

        if (filters.partTime && typeLower.includes('part time')) matches = true;
        if (filters.fullTime && typeLower.includes('full time')) matches = true;
        if (filters.internship && tagsLower.includes('magang')) matches = true;

        return matches;
    });

    if (loading) {
        return (
            <div className="p-8">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Lowongan Industri</h1>

                {/* Tombol Tambah Lowongan (Ungu) */}
                <Link
                    href="/admin/lowongan/tambah"
                    className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-5 rounded-lg shadow-md transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Tambah lowongan
                </Link>
            </div>

            <div className="flex space-x-8">
                {/* Kolom Kiri: Filter */}
                <div className="w-1/4">
                    <LowonganFilter filters={filters} setFilters={setFilters} />
                </div>

                {/* Kolom Kanan: Daftar Lowongan */}
                <div className="w-3/4">
                    {/* DAFTAR LOWONGAN (GRID KARTU) */}
                    {filteredData.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredData.map((item: any) => <LowonganCard key={item.id} data={item} />)}
                        </div>
                    ) : (
                        <p className="text-gray-500">Tidak ada lowongan yang sesuai dengan filter.</p>
                    )}

                    {/* Pagination */}
                    <div className="flex justify-center items-center mt-8 space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-full border ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>

                        {/* Menampilkan nomor halaman (simulasi) */}
                        <span className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg">1</span>
                        <span className="px-4 py-2 text-gray-700">2</span>
                        <span className="px-4 py-2 text-gray-700">3</span>
                        <span className="px-4 py-2 text-gray-700">...</span>
                        <span className="px-4 py-2 text-gray-700">{totalPages}</span>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-full border ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLowonganKerjaPage;
