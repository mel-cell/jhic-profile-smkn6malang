// File: src/app/industri/lowongan/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Briefcase, DollarSign, MapPin, Plus } from 'lucide-react';
import { jobsAPI } from '../../../services/api';

// --- KOMPONEN FILTER ---
const FilterSidebar = ({ selectedTypes, setSelectedTypes }: { selectedTypes: string[], setSelectedTypes: (types: string[]) => void }) => {
    const jobTypes = ['Part Time', 'Full Time', 'Magang'];

    const handleCheckboxChange = (type: string) => {
        setSelectedTypes(
            selectedTypes.includes(type)
                ? selectedTypes.filter(t => t !== type)
                : [...selectedTypes, type]
        );
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 sticky top-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Filter</h2>
            
            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="tipe-lowongan-select">
                    Tipe Lowongan
                </label>
                <div id="tipe-lowongan-select" className="space-y-2">
                    {jobTypes.map(type => (
                        <div key={type} className="flex items-center">
                            <input
                                id={`filter-${type}`}
                                type="checkbox"
                                checked={selectedTypes.includes(type)}
                                onChange={() => handleCheckboxChange(type)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor={`filter-${type}`} className="ml-3 text-sm text-gray-600">
                                {type}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            {/* Filter tambahan bisa ditambahkan di sini, misalnya berdasarkan Bidang */}
        </div>
    );
};

// --- KOMPONEN KARTU LOWONGAN ---
const JobCard = ({ job }: { job: any }) => {
    // Fungsi untuk menentukan warna tag
    const getTypeClass = (type: string) => {
        switch (type.toLowerCase()) {
            case 'full time': return 'bg-green-100 text-green-800';
            case 'part time': return 'bg-yellow-100 text-yellow-800';
            case 'magang': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
            {/* Logo Perusahaan (Placeholder) */}
            <div className="w-12 h-12 bg-gray-100 rounded-full mb-3 border border-gray-300"></div>

            <h3 className="text-lg font-bold text-gray-900 leading-tight">{job.jobTitle}</h3>
            <p className="text-sm text-gray-600 mb-3">{job.company?.companyName || 'Perusahaan'}</p>

            {/* Tag Tipe Pekerjaan */}
            <div className="flex flex-wrap gap-1 mb-3">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getTypeClass(job.employmentType || 'Full Time')}`}>
                    {job.employmentType || 'Full Time'}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                    Jurusan
                </span>
            </div>

            {/* Detail Gaji & Lokasi */}
            <div className="space-y-1 mb-4 text-sm text-gray-700">
                <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                    <span className="font-semibold">{job.salaryRange || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                    <span>{job.location || 'N/A'}</span>
                </div>
            </div>

            {/* Tombol Detail */}
            <Link
                href={`/industri/lowongan/${job.id}`}
                className="block text-center bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg transition-colors mt-auto"
            >
                Detail
            </Link>
        </div>
    );
};


// --- HALAMAN UTAMA DAFTAR LOWONGAN SAYA ---
const JobListPage: React.FC = () => {
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("authToken");
            if (!token) {
                setError("Token tidak ditemukan. Silakan login terlebih dahulu.");
                return;
            }

            const response = await jobsAPI.getMyJobs(token);
            if (response.success) {
                setJobs(response.data);
            } else {
                setError("Gagal memuat lowongan");
            }
        } catch (err: any) {
            console.error("Error fetching jobs:", err);
            setError("Gagal memuat data");
        } finally {
            setLoading(false);
        }
    };

    // Logic Filtering Data
    const filteredJobs = useMemo(() => {
        if (selectedTypes.length === 0) {
            return jobs;
        }
        return jobs.filter(job =>
            selectedTypes.includes(job.employmentType || 'Full Time')
        );
    }, [selectedTypes, jobs]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-10 md:py-35">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Memuat lowongan...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-10 md:py-35">
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

    return (
        <div className="min-h-screen bg-gray-50 py-10 md:py-35">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">

                {/* Header Halaman */}
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                    <h1 className="text-3xl font-bold text-gray-900">Lowongan Saya</h1>
                    <Link
                        href="/industri/lowongan/tambah-lowongan"
                        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Tambah lowongan
                    </Link>
                </div>

                {/* Layout Grid: Sidebar Filter (1 kolom) dan Daftar Lowongan (3 kolom) */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* Kolom Filter */}
                    <div className="lg:col-span-1">
                        <FilterSidebar
                            selectedTypes={selectedTypes}
                            setSelectedTypes={setSelectedTypes}
                        />
                    </div>

                    {/* Kolom Daftar Lowongan */}
                    <div className="lg:col-span-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredJobs.map(job => (
                                <JobCard key={job.id} job={job} />
                            ))}

                            {filteredJobs.length === 0 && (
                                <div className="col-span-full text-center py-10 text-gray-600">
                                    <Briefcase className="w-12 h-12 mx-auto mb-4" />
                                    <p className="text-xl font-semibold">Tidak ada lowongan yang ditemukan.</p>
                                    <p className="mt-2">Coba hapus beberapa filter atau tambahkan lowongan baru.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default JobListPage;