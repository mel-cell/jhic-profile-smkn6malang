// File: src/app/siswa/lowongan/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { jobsAPI } from '@/app/services/api';

// No dummy data - using API only

// Removed static dummy data - now using API for similar jobs

const DetailLowonganPage: React.FC = () => {
    const params = useParams();
    const [lowongan, setLowongan] = useState<any>(null);
    const [similarJobs, setSimilarJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchJobDetail = async () => {
            try {
                const id = params.id as string;
                if (!id) {
                    setError('ID lowongan tidak valid');
                    setLoading(false);
                    return;
                }
                const [jobResponse, similarResponse] = await Promise.all([
                    jobsAPI.getById(id),
                    jobsAPI.getSimilar(id, 5)
                ]);

                if (jobResponse.success) {
                    // Transform API data to match component structure
                    const jobData = jobResponse.data;
                    setLowongan({
                        id: jobData.id,
                        perusahaan: jobData.companyProfile?.companyName || 'Perusahaan',
                        alamat: jobData.location || 'Malang',
                        posisi: jobData.jobTitle,
                        deskripsi: jobData.description || 'Deskripsi tidak tersedia',
                        bidangPekerjaan: jobData.companyProfile?.industryType || 'Bidang Pekerjaan',
                        jenisPekerjaan: jobData.employmentType || 'Full Time',
                        jenisKelamin: 'Laki-laki & Perempuan',
                        gaji: jobData.salaryRange || 'N/A',
                        tipePembayaran: 'Remote / WFH',
                        jumlahOrang: '1 orang',
                        kualifikasi: jobData.requirements ? jobData.requirements.split('\n') : ['Kualifikasi tidak tersedia']
                    });
                } else {
                    setError('Gagal memuat data lowongan');
                }

                if (similarResponse.success) {
                    setSimilarJobs(similarResponse.data || []);
                }
            } catch (error) {
                console.error('Failed to fetch job detail:', error);
                setError('Gagal memuat data lowongan');
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetail();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-8 pb-16">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Memuat detail lowongan...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 pt-8 pb-16">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center py-20">
                        <h1 className="text-3xl font-bold text-red-600">Error 😥</h1>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <Link href="/siswa/lowongan" className="mt-6 inline-block text-blue-600 hover:underline">
                            &larr; Kembali ke Daftar Lowongan
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!lowongan) {
        return (
            <div className="min-h-screen bg-gray-50 pt-8 pb-16">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center py-20">
                        <h1 className="text-3xl font-bold text-red-600">Lowongan Tidak Ditemukan 😥</h1>
                        <Link href="/siswa/lowongan" className="mt-6 inline-block text-blue-600 hover:underline">
                            &larr; Kembali ke Daftar Lowongan
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
    
    // --- Komponen Kartu Informasi Kecil (Gaji, Bidang, dll) ---
    // Dibuat lebih tipis sesuai desain, menggunakan list-style
    const DetailInfoRow = ({ title, value }: { title: string; value: string }) => (
        <div className="flex flex-col flex-1 min-w-[150px]">
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <p className="text-sm font-bold text-gray-800">{value}</p>
        </div>
    );

    // --- Komponen Kartu Lowongan Lain ---
    const LowonganLainCard = ({ lowongan }: { lowongan: any }) => (
        <div className="p-4 border border-gray-300 rounded-xl space-y-3">
            <div className="flex items-center space-x-3 mb-2">
                {/* Placeholder Logo Perusahaan */}
                <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                <p className="text-xs text-gray-600 font-medium">{lowongan.perusahaan}</p>
            </div>

            <h4 className="text-md font-bold text-gray-800">{lowongan.posisi}</h4>

            <div className="flex flex-wrap gap-1 text-[10px] font-semibold">
                {lowongan.tipe.map((t: string, i: number) => (
                    // Menggunakan styling tag yang lebih sederhana
                    <span key={i} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>
                ))}
            </div>

            <p className="text-sm text-green-600 font-semibold">{lowongan.gaji}</p>

            <Link href={`/siswa/lowongan/${lowongan.id}`}>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 rounded-lg text-sm transition-colors">
                    Detail
                </button>
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-white pb-16 animate-page-load-in">
            <div className="container mx-auto px-6 max-w-7xl pt-35"> {/* Padding atas disesuaikan */}
                
                {/* Tombol Kembali */}
                <Link href="/siswa/lowongan" className="text-red-600 hover:text-red-800 font-medium mb-8 inline-block">
                    &larr;Kembali
                </Link>

                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Kolom KONTEN UTAMA (Detail Lowongan) */}
                    <div className="w-full lg:w-3/4 p-10 bg-white rounded-xl shadow-lg border-2 border-gray-100 animate-fade-in-up">
                        
                        {/* Header Perusahaan & Posisi */}
                        <div className="flex items-start space-x-6 pb-6 mb-4">
                            {/* Logo Perusahaan (Kotak) */}
                            <div className="w-20 h-20 bg-white border border-gray-300 rounded-xl flex-shrink-0"></div> 
                            
                            <div>
                                <h3 className="text-lg font-medium text-gray-600">{lowongan.perusahaan}</h3>
                                <p className="text-sm text-gray-400">{lowongan.alamat}</p>
                            </div>
                        </div>

                        {/* Posisi, Deskripsi, dan Tombol Lamar */}
                        <div className="flex justify-between items-start mb-6">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">{lowongan.posisi}</h1>
                            {/* Tombol Melamar Kuning Sesuai Desain */}
                            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-6 py-2 rounded-lg flex items-center shadow-md transition-colors whitespace-nowrap">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg> Melamar
                            </button>
                        </div>
                        
                        {/* Deskripsi */}
                        <p className="text-gray-700 leading-relaxed mb-10">{lowongan.deskripsi}</p>
                        
                        {/* Info Cards Grid - Sesuai Layout Desain (3 kolom) */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10 pb-8 border-b border-gray-200">
                            {/* Baris 1 */}
                            <DetailInfoRow title="Bidang pekerjaan" value={lowongan.bidangPekerjaan} />
                            <DetailInfoRow title="Jenis pekerjaan" value={lowongan.jenisPekerjaan} />
                            <DetailInfoRow title="Tipe pekerjaan" value={lowongan.tipePembayaran} />
                            {/* Baris 2 */}
                            <DetailInfoRow title="Jenis Kelamin" value={lowongan.jenisKelamin} />
                            <DetailInfoRow title="Gaji" value={lowongan.gaji} />
                            <DetailInfoRow title="Jumlah orang" value={lowongan.jumlahOrang} />
                        </div>
                        
                        {/* Kualifikasi */}
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Kualifikasi</h2>
                        <ul className="space-y-3 text-gray-700">
                            {lowongan.kualifikasi.map((item: string, index: number) => (
                                // Menggunakan tanda bulat kecil atau custom dot
                                <li key={index} className="flex items-start">
                                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span className="text-base">{item}</span>
                                </li>
                            ))}
                        </ul>

                    </div>

                        {/* Kolom Lowongan Lain */}
                    <div className="w-full lg:w-1/4 space-y-6 animate-fade-in-up delay-300">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Lowongan Serupa</h3>

                        {/* Kotak Konten Lowongan Lain - Diberi border luar */}
                        <div className=" border-gray-300 rounded-xl ">
                            {similarJobs.map((job) => (
                                <LowonganLainCard key={job.id} lowongan={{
                                    id: job.id,
                                    perusahaan: job.companyProfile?.companyName || 'Perusahaan',
                                    posisi: job.jobTitle,
                                    gaji: job.salaryRange || 'N/A',
                                    tipe: [job.employmentType || 'Full-time', job.companyProfile?.industryType || 'Umum']
                                }} />
                            ))}
                        </div>

                        {similarJobs.length === 0 && (
                            <p className="text-gray-500 text-sm">Tidak ada lowongan serupa.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DetailLowonganPage;