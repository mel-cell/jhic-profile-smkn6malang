// File: src/app/industri/lowongan/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, Briefcase, DollarSign, Users, Clock, Trash2, Edit, ArrowLeft } from 'lucide-react';
import { jobsAPI, studentsAPI } from '@/app/services/api';

// Removed dummy data - now using API for real job data


// Removed utility functions - now using API directly


// --- KOMPONEN KARTU PELAMAR ---
const PelamarCard = ({ pelamar, application }: { pelamar: any; application: any }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleViewCv = async () => {
        if (application.studentCv) {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) return;
                const response = await studentsAPI.getCvFile(application.studentCv.fileName, token, false);
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
            } catch (error) {
                console.error('Error viewing CV:', error);
            }
        }
    };

    const handleDownloadCv = async () => {
        if (application.studentCv) {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) return;
                const response = await studentsAPI.getCvFile(application.studentCv.fileName, token, true);
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = application.studentCv.fileName;
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
        <div className="flex flex-col bg-white p-4 rounded-lg border border-gray-200 shadow-sm w-full">
            <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-3 flex-shrink-0">
                    <img
                        src={pelamar.foto || "/placeholder-avatar.png"}
                        alt={pelamar.nama}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-900 truncate">{pelamar.nama}</h4>
                    <p className="text-xs text-gray-500 truncate">{pelamar.jurusan}</p>
                </div>
            </div>

            <div className="mb-3">
                <p className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Tanggal:</span> {formatDate(pelamar.tanggalLamaran)}
                </p>
                <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(pelamar.status)}`}>
                    {pelamar.status || 'Pending'}
                </span>
            </div>

            {pelamar.notes && (
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    <span className="font-medium">Catatan:</span> {pelamar.notes}
                </p>
            )}

            {application.studentCv ? (
                <div className="flex gap-2">
                    <button
                        onClick={handleViewCv}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-1.5 rounded transition-colors"
                    >
                        Lihat CV
                    </button>
                    <button
                        onClick={handleDownloadCv}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-1.5 rounded transition-colors"
                    >
                        Unduh
                    </button>
                </div>
            ) : (
                <div className="text-center text-xs text-gray-500 py-2">
                    CV tidak tersedia
                </div>
            )}
        </div>
    );
};

// --- KOMPONEN LOWONGAN LAIN ---
const LowonganLainCard = ({ lowongan }: { lowongan: any }) => {
    const getTypeClass = (type: string) => {
        switch (type.toLowerCase()) {
            case 'full time': return 'bg-green-100 text-green-800';
            case 'part time': return 'bg-yellow-100 text-yellow-800';
            case 'magang': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm mb-4">
            <h5 className="font-bold text-base text-gray-900 leading-tight mb-2">{lowongan.posisi}</h5>

            <div className="flex flex-wrap gap-1 mb-3">
                {lowongan.tipe.map((type: string, index: number) => (
                    <span key={index} className={`text-[10px] font-semibold px-2 py-0.5 rounded ${getTypeClass(type)}`}>
                        {type}
                    </span>
                ))}
            </div>

            <p className="text-sm text-gray-600 mb-3">
                <span className="font-semibold text-green-700">{lowongan.gaji}</span>
            </p>
            <Link
                href={`/industri/lowongan/${lowongan.id}`}
                className="block text-center bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-1.5 rounded-lg transition-colors"
            >
                Detail
            </Link>
        </div>
    );
};

// Komponen Pembantu untuk menampilkan info kunci
const InfoItem = ({ title, value, icon: Icon }: { title: string; value: string; icon: any }) => (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
        <p className="text-xs text-gray-500 font-medium mb-1">{title}</p>
        <div className="flex items-center text-gray-800 font-semibold">
            <Icon className="w-4 h-4 mr-1 text-yellow-600" />
            <span>{value}</span>
        </div>
    </div>
);


// --- HALAMAN UTAMA DETAIL LOWONGAN ---
import { useParams } from 'next/navigation';

const JobDetailPage = () => {
    const params = useParams();
    const [job, setJob] = useState<any>(null);
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

                // Get token for authenticated company access
                const token = localStorage.getItem('authToken');
                if (!token) {
                    setError('Token tidak ditemukan. Silakan login terlebih dahulu.');
                    setLoading(false);
                    return;
                }

                const [jobResponse, similarResponse] = await Promise.all([
                    jobsAPI.getByIdForCompany(id, token),
                    jobsAPI.getSimilar(id, 5)
                ]);

                if (jobResponse.success) {
                    const jobData = jobResponse.data;
                    setJob({
                        id: jobData.id,
                        perusahaan: jobData.companyProfile?.companyName || 'Perusahaan',
                        posisi: jobData.jobTitle,
                        deskripsi: jobData.description || 'Deskripsi tidak tersedia',
                        bidang: jobData.companyProfile?.industryType || 'Bidang Pekerjaan',
                        tipePekerjaan: jobData.employmentType || 'Full Time',
                        jenisKelamin: 'Laki-laki & Perempuan',
                        gaji: jobData.salaryRange || 'N/A',
                        lokasi: jobData.location || 'Malang',
                        tipe: [jobData.employmentType || 'Full-time'],
                        pelamar: jobData.jobApplications?.length || 0, // Get actual count from applications
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
            <div className="min-h-screen bg-gray-50 py-10 flex items-center justify-center">
                <p className="text-xl text-gray-700">Memuat detail lowongan...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-10 flex items-center justify-center">
                <p className="text-xl text-red-700">{error}</p>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-gray-50 py-10 flex items-center justify-center">
                <p className="text-xl text-gray-700">Lowongan tidak ditemukan.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 md:py-35">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                
                {/* TOMBOL KEMBALI */}
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6 font-semibold transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Kembali ke Daftar Lowongan
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* --- KOLOM UTAMA (Job Detail, Kualifikasi, Pelamar) --- */}
                    <div className="lg:col-span-3 space-y-8">
                        
                        {/* 1. INFORMASI LOWONGAN (HEADER & DESKRIPSI) */}
                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
                            
                            {/* Logo dan Perusahaan */}
                            <div className="flex items-start mb-6 border-b pb-4">
                                <div className="w-16 h-16 bg-gray-100 border border-gray-300 rounded-xl mr-4 flex-shrink-0"></div>
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">{job.perusahaan}</p>
                                    <div className="flex items-center text-gray-500 text-sm mt-1">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        <span>{job.lokasi}</span> 
                                    </div>
                                </div>
                            </div>
                            
                            {/* Judul */}
                            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{job.posisi}</h1>
                            
                            {/* Deskripsi */}
                            <p className="text-gray-700 leading-relaxed mb-8">{job.deskripsi}</p>
                            
                            {/* Info Kunci Lowongan (Grid) */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <InfoItem title="Bidang pekerjaan" value={job.bidang} icon={Briefcase} />
                                <InfoItem title="Jenis pekerjaan" value={job.tipe.join(', ')} icon={Clock} /> 
                                <InfoItem title="Tipe pekerjaan" value={job.tipePekerjaan} icon={MapPin} />
                                <InfoItem title="Gaji" value={job.gaji} icon={DollarSign} />
                                <InfoItem title="Jenis Kelamin" value={job.jenisKelamin} icon={Users} />
                                <InfoItem title="Pelamar" value={`${job.pelamar}`} icon={Users} />
                            </div>
                        </div>
                        
                        {/* 2. KUALIFIKASI & AKSI */}
                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Kualifikasi</h2>
                            <ul className="list-disc ml-5 space-y-2 text-gray-700">
                                {job.kualifikasi.map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>

                            <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-100">
                                <Link
                                    href={`/industri/lowongan/edit/${job.id}`}
                                    className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors shadow-md active:scale-95"
                                >
                                    <Edit className="w-5 h-5 mr-2" />
                                    Edit lowongan
                                </Link>
                                <button
                                    className="flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md active:scale-95"
                                    onClick={() => alert('Konfirmasi hapus lowongan')}
                                >
                                    <Trash2 className="w-5 h-5 mr-2" />
                                    Hapus lowongan
                                </button>
                            </div>
                        </div>

                        {/* 3. DAFTAR PELAMAR */}
                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pelamar ({job.pelamar})</h2>
                            {job.pelamar > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {job.jobApplications?.map((application: any, index: number) => (
                                        <PelamarCard key={application.id} pelamar={{
                                            nama: application.studentProfile?.fullName || 'Nama tidak tersedia',
                                            jurusan: application.studentProfile?.major || 'Jurusan belum tersedia',
                                            foto: application.studentProfile?.profilePhotoPath,
                                            cv: application.studentCv?.filePath,
                                            cvName: application.studentCv?.fileName,
                                            tanggalLamaran: application.applicationDate,
                                            status: application.status,
                                            notes: application.notes
                                        }} application={application} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Belum ada pelamar untuk lowongan ini.</p>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* --- KOLOM SIDEBAR (Lowongan Serupa) --- */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-20">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-3">Lowongan Serupa</h3>
                            {similarJobs.map((job: any) => (
                                <LowonganLainCard key={job.id} lowongan={{
                                    id: job.id,
                                    perusahaan: job.companyProfile?.companyName || 'Perusahaan',
                                    posisi: job.jobTitle,
                                    gaji: job.salaryRange || 'N/A',
                                    tipe: [job.employmentType || 'Full-time', job.companyProfile?.industryType || 'Umum']
                                }} />
                            ))}
                            {similarJobs.length === 0 && (
                                <p className="text-sm text-gray-500">Tidak ada lowongan serupa yang tersedia.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetailPage;