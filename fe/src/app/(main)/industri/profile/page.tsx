// File: src/app/industri/profil/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, MapPin, User, Briefcase, Calendar, ChevronRight, LogOut, Edit, Phone } from 'lucide-react';
import { companiesAPI, jobsAPI } from '../../../services/api';

// --- KOMPONEN KARTU RIWAYAT LOWONGAN ---
const JobHistoryCard = ({ job }: { job: any }) => {
    return (
        <Link
            href={`/industri/lowongan/${job.id}`}
            className="block bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200 h-full"
        >
            <h3 className="text-lg font-bold text-gray-900 mb-3">{job.jobTitle}</h3>

            <div className="flex items-center text-sm text-gray-600 mb-3">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <span>{new Date(job.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>

            <div className="flex justify-between items-center text-sm font-semibold text-blue-600 pt-3 border-t border-gray-100">
                <span>Lihat detail</span>
                <ChevronRight className="w-4 h-4" />
            </div>
        </Link>
    );
};

// --- KOMPONEN HEADER DETAIL ITEM ---
const DetailItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: React.ReactNode }) => (
    <div className="flex items-start text-sm text-gray-700 mb-2">
        <Icon className="w-4 h-4 mr-2 mt-0.5 text-yellow-600 flex-shrink-0" />
        <span className="font-medium mr-1">{label}:</span>
        <span>{value}</span>
    </div>
);


// --- HALAMAN UTAMA PROFIL INDUSTRI ---
const IndustriProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<any>(null);
    const [jobHistory, setJobHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProfileAndJobs();
    }, []);

    const fetchProfileAndJobs = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("authToken");
            if (!token) {
                setError("Token tidak ditemukan. Silakan login terlebih dahulu.");
                return;
            }

            // Fetch company profile
            const profileResponse = await companiesAPI.getProfile(token);
            if (profileResponse.success) {
                setProfile(profileResponse.data);
            } else {
                setError("Gagal memuat profil perusahaan");
            }

            // Fetch job history
            const jobsResponse = await jobsAPI.getMyJobs(token);
            if (jobsResponse.success) {
                setJobHistory(jobsResponse.data);
            } else {
                setError("Gagal memuat riwayat lowongan");
            }
        } catch (err: any) {
            console.error("Error fetching data:", err);
            setError("Gagal memuat data");
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
                        <p className="text-gray-600">Memuat profil...</p>
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

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50 pt-36 pb-16">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center py-20">
                        <p className="text-gray-600">Profil tidak ditemukan</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 md:py-35">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                
                {/* --- 1. HEADER PROFIL PERUSAHAAN --- */}
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 mb-10">
                    <div className="flex flex-col md:flex-row md:items-start border-b pb-6 mb-6">
                        
                        {/* Logo Perusahaan */}
                        <div className="w-24 h-24 bg-gray-100 border border-gray-300 rounded-full flex-shrink-0 mb-4 md:mb-0 md:mr-6 overflow-hidden">
                            <img
                                src={profile.logoPath ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${profile.logoPath}` : '/sekawanmedia.jpeg'}
                                alt={`${profile.companyName} Logo`}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Info Perusahaan */}
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">{profile.companyName}</h1>
                            <p className="text-lg font-semibold text-gray-700 mb-4">{profile.industryType}</p>

                            <DetailItem icon={User} label="Penanggung Jawab" value={profile.contactPersonName} />
                            <DetailItem icon={Mail} label="Email" value={profile.contactPersonEmail} />
                            <DetailItem icon={MapPin} label="Alamat" value={profile.address} />
                            <DetailItem icon={Phone} label="No. Telp" value={profile.phoneNumber || 'N/A'} />
                            <DetailItem icon={Briefcase} label="Website" value={profile.website ? <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{profile.website}</a> : 'N/A'} />
                        </div>
                    </div>

                    {/* Tentang Kami */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Tentang kami</h2>
                        <p className="text-gray-700 leading-relaxed">{profile.description}</p>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex space-x-4 pt-4 border-t border-gray-100">
                        <Link 
                            href="/industri/profile/edit" 
                            className="flex items-center border border-orange-500 text-black font-semibold py-2 px-4 rounded-lg transition-colors hover:bg-orange-500"
                            >
                            {/* Jika Anda ingin menggunakan ikon seperti di kode Profil sebelumnya: */}
                            {/* <Edit className="w-5 h-5 mr-2" /> */}
                            Edit profile
                        </Link>
                        <button
                            onClick={() => {
                                localStorage.removeItem('authToken');
                                localStorage.removeItem('userRole');
                                window.location.href = '/industri/login';
                            }}
                            className="flex items-center border border-red-500 text-black font-semibold py-2 px-4 rounded-lg transition-colors hover:bg-red-500"
                        >
                            <LogOut className="w-5 h-5 mr-2" />
                            Log out
                        </button>
                    </div>
                </div>

                {/* --- 2. RIWAYAT LOWONGAN --- */}
                <div className="mt-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Riwayat Lowongan</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {jobHistory.map(job => (
                            <JobHistoryCard key={job.id} job={job} />
                        ))}

                        {jobHistory.length === 0 && (
                            <div className="col-span-full text-center py-10 text-gray-600 bg-white rounded-xl shadow-md border">
                                <Briefcase className="w-12 h-12 mx-auto mb-4" />
                                <p className="text-xl font-semibold">Belum ada riwayat lowongan.</p>
                                <p className="mt-2">Silakan tambahkan lowongan baru di halaman Lowongan Saya.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination Placeholder (Sesuai Screenshot) */}
                    <div className="flex justify-start mt-8">
                        {/* Placeholder for left arrow/pagination control */}
                        <div className="w-6 h-6 border-b-2 border-orange-500"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IndustriProfilePage;
