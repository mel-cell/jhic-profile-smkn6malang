// File: src/app/siswa/lowongan/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { jobsAPI } from '@/app/services/api';

interface Job {
    id: string;
    jobTitle: string;
    companyName?: string;
    salaryRange?: string;
    employmentType?: string;
    location?: string;
    createdAt?: string;
}

const tipeLowongan = ['PartTime', 'FullTime', 'Magang'];
const jurusanList = ['RPL', 'TAB', 'DPIB', 'TKRO', 'TKJ'];

const LowonganPage: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- State Pagination ---
    const itemsPerPage = 9;
    const [currentPage, setCurrentPage] = useState(1);
    const totalItems = jobs.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentLowongan = jobs.slice(startIndex, endIndex);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const response = await jobsAPI.getAll();
                if (response.success) {
                    setJobs(response.data || []);
                } else {
                    setError('Gagal memuat data lowongan');
                }
            } catch (err) {
                console.error('Error fetching jobs:', err);
                setError('Gagal memuat data lowongan');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const paginate = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    
    // --- Komponen Card ---
    const LowonganCard = ({ lowongan, delay }: { lowongan: Job; delay: number }) => (
        <div
            key={lowongan.id}
            className={`
                bg-white rounded-xl shadow-md border border-gray-100 p-4
                hover:shadow-xl transition-all duration-300
                animate-fade-in-up
            `}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex justify-between items-center mb-1">
                <h3 className="text-xs text-gray-700 font-semibold">{lowongan.companyName || 'Perusahaan'}</h3>
                <div className="w-4 h-4 rounded-full border border-gray-300"></div>
            </div>

            <h2 className="text-lg font-bold text-gray-800 mb-1">{lowongan.jobTitle}</h2>

            <div className="flex flex-wrap gap-1 text-[10px] font-semibold mb-3">
                <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{lowongan.employmentType || 'Full Time'}</span>
                <span className="bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">{lowongan.location || 'Malang'}</span>
            </div>

            <p className="text-sm font-medium text-gray-600 mb-4">Kisaran Gaji (IDR): {lowongan.salaryRange || 'N/A'}</p>

            <Link href={`/siswa/lowongan/${lowongan.id}`}>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition-colors">
                    Detail
                </button>
            </Link>
        </div>
    );

    // --- Komponen Filter (Search Bar dipindahkan ke sini) ---
    const FilterSection = () => (
        <div className="w-full lg:w-[250px] mb-8 lg:mb-0 space-y-8">
            
            {/* Search Bar */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-red-600 focus:border-red-600"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>

            {/* Filter Tipe Lowongan */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Filter Tipe Lowongan</h3>
                <div className="space-y-2">
                    {tipeLowongan.map(tipe => (
                        <label key={tipe} className="flex items-center text-gray-600 cursor-pointer">
                            <input type="checkbox" className="form-checkbox text-red-600 h-4 w-4 rounded" />
                            <span className="ml-3">{tipe}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Filter Jurusan */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Jurusan</h3>
                <div className="space-y-2">
                    {jurusanList.map(jurusan => (
                        <label key={jurusan} className="flex items-center text-gray-600 cursor-pointer">
                            <input type="checkbox" className="form-checkbox text-red-600 h-4 w-4 rounded" />
                            <span className="ml-3">{jurusan}</span>
                        </label>
                    ))}
                </div>
            </div>
            
        </div>
    );

    // --- Komponen Pagination (Dibiarkan tidak berubah) ---
    const Pagination = () => {
        const renderPages = () => {
            const pages = [];
            const maxVisiblePages = 5; 
            
            let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

            if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(
                    <button
                        key={i}
                        onClick={() => paginate(i)}
                        className={`
                            px-4 py-2 rounded-full font-medium transition-colors 
                            ${i === currentPage 
                                ? 'bg-red-600 text-white' 
                                : 'text-gray-700 hover:bg-gray-200'
                            }
                        `}
                    >
                        {i}
                    </button>
                );
            }

            if (totalPages > maxVisiblePages && endPage < totalPages) {
                pages.push(<span key="dots-end" className="px-4 py-2 text-gray-500">...</span>);
                if (endPage < totalPages) {
                     pages.push(
                        <button
                            key={totalPages}
                            onClick={() => paginate(totalPages)}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-full font-medium transition-colors"
                        >
                            {totalPages}
                        </button>
                    );
                }
            }

            return pages;
        };

        return (
            <div className="flex justify-center items-center mt-12 space-x-2">
                
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`
                        p-3 rounded-full transition-colors 
                        ${currentPage === 1 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-gray-700 hover:bg-gray-200'
                        }
                    `}
                >
                    <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>

                <div className="flex space-x-1">
                    {renderPages()}
                </div>

                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`
                        p-3 rounded-full transition-colors 
                        ${currentPage === totalPages 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-gray-700 hover:bg-gray-200'
                        }
                    `}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-16 pt-35"> 
            <div className="container mx-auto px-6">
                <div className="max-w-7xl mx-auto">
                    
                    {/* JUDUL LOWONGAN KERJA (BERADA DI ATAS FILTER DAN CARD) */}
                    <h1 className="text-4xl  font-extrabold text-gray-800 mb-12 animate-fade-in-up">
                        Lowongan Industri
                    </h1>

                    {/* Flex Container untuk Filter dan Lowongan */}
                    <div className="flex flex-col lg:flex-row gap-8">
                        
                        {/* Kolom Filter (Diberi margin agar sejajar dengan search bar) */}
                        <FilterSection />

                        {/* Kolom Lowongan */}
                        <div className="w-full lg:flex-1">
                            
                            {/* Lowongan Grid */}
                            {loading ? (
                                <div className="flex justify-center py-16">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : error ? (
                                <div className="text-center py-16">
                                    <p className="text-gray-500 text-lg">{error}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {currentLowongan.map((lowongan, index) => (
                                            <LowonganCard
                                                key={lowongan.id}
                                                lowongan={lowongan}
                                                delay={(index * 150) + 100}
                                            />
                                        ))}
                                    </div>

                                    {currentLowongan.length === 0 && (
                                        <div className="text-center py-16">
                                            <p className="text-gray-500 text-lg">Belum ada lowongan kerja tersedia saat ini.</p>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Komponen Pagination */}
                            <Pagination />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default LowonganPage;