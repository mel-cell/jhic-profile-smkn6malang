// File: src/app/admin/akun/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    User, Briefcase, Mail, MapPin, Phone, Calendar, ArrowRight,
    GraduationCap, Briefcase as JobIcon, BookOpen, Clock, Settings
} from 'lucide-react';
import { adminAPI } from '@/app/services/api';

// --- KOMPONEN KARTU SISWA ---
const SiswaCard = ({ data }: { data: any }) => (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center text-center">

        {/* Foto Siswa */}
        <div className="w-20 h-20 overflow-hidden rounded-full mb-3 border-4 border-gray-200">
            <img
                src={data.image}
                alt={data.name}
                className="w-full h-full object-cover"
            />
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2">{data.name}</h3>

        {/* Detail Siswa */}
        <div className="text-sm text-gray-700 space-y-1 w-full text-left">
            <p className="flex items-center"><GraduationCap className="w-4 h-4 mr-2 text-gray-500" /> NISN: {data.nisn}</p>
            <p className="flex items-center"><BookOpen className="w-4 h-4 mr-2 text-gray-500" /> {data.class}</p>
            <p className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-gray-500" /> {data.birthdate}</p>
            <p className="flex items-center"><Phone className="w-4 h-4 mr-2 text-gray-500" /> {data.phone}</p>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-between space-x-2 mt-4 w-full">
            <Link
                href={`/admin/akun/siswa/${data.id}`}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg text-sm text-center transition-colors"
            >
                Detail
            </Link>
            <button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
            >
                Hapus
            </button>
        </div>
    </div>
);

// --- KOMPONEN KARTU INDUSTRI ---
const IndustriCard = ({ data }: { data: any }) => (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex flex-col h-full">

        {/* Logo dan Nama Industri */}
        <div className="flex items-center border-b pb-3 mb-3">
            <div className="w-10 h-10 overflow-hidden rounded-full mr-3 border border-gray-200 flex-shrink-0">
                 {/* Asumsi logo ada di public folder */}
                <img src={data.logo} alt={data.name} className="w-full h-full object-contain p-1" />
            </div>
            <h3 className="text-base font-bold text-gray-900 leading-tight">{data.name}</h3>
        </div>

        {/* Detail Industri */}
        <div className="text-xs text-gray-700 space-y-1 flex-grow">
            <p className="flex items-center"><User className="w-3 h-3 mr-2 text-gray-500" /> PIC: {data.pic}</p>
            <p className="flex items-center"><MapPin className="w-3 h-3 mr-2 text-gray-500" /> {data.address}</p>
            <p className="flex items-center"><Mail className="w-3 h-3 mr-2 text-gray-500" /> {data.email}</p>
        </div>

        {/* Status dan Bidang */}
        <div className="flex justify-between items-center text-xs mt-3">
            <div className="flex items-center space-x-1">
                 <Settings className="w-3 h-3 text-gray-500" />
                 <span className="font-semibold">Status akun:</span>
                 <span className={`px-2 py-0.5 rounded-full text-white font-bold ${data.status === 'AKTIF' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {data.status}
                </span>
            </div>
             <div className="flex items-center space-x-1">
                <JobIcon className="w-3 h-3 text-gray-500" />
                <span className="font-semibold">Bidang:</span>
                <span className="text-gray-900">{data.field}</span>
            </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-between space-x-2 mt-4 pt-3 border-t">
            <Link
                href={`/admin/akun/industri/${data.id}/detail`}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg text-sm text-center transition-colors"
            >
                Detail
            </Link>
            <button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
            >
                Hapus
            </button>
        </div>
    </div>
);

// --- UTILITY: Judul Bagian dengan Tombol Panah ---
const SectionHeader = ({ title, link }: { title: string; link: string }) => (
    <div className="flex justify-between items-center mb-6 mt-10 first:mt-0">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            {title}
            <Link href={link} className="flex items-center text-blue-600 hover:text-blue-800 ml-3 text-lg font-semibold transition-colors">
                 <ArrowRight className="w-5 h-5" />
            </Link>
        </h2>
    </div>
);

// --- HALAMAN UTAMA MANAJEMEN AKUN ---
const AdminAkunPage: React.FC = () => {
    const [siswaData, setSiswaData] = useState([]);
    const [industriData, setIndustriData] = useState([]);
    const [loading, setLoading] = useState(true);

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

                // Fetch all users
                const usersRes = await adminAPI.getAllUsers(token);
                const users = usersRes.data || [];

                // Separate students and companies
                const students = users.filter((user: any) => user.role === 'STUDENT');
                const companies = users.filter((user: any) => user.role === 'COMPANY');

                setSiswaData(students);
                setIndustriData(companies);

            } catch (error) {
                console.error('Failed to fetch user data:', error);
                // Fallback to empty arrays
                setSiswaData([]);
                setIndustriData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="p-8">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-10">Manajemen Akun</h1>

            <div className="space-y-12">

                {/* 1. AKUN SISWA */}
                <div>
                    <SectionHeader
                        title="Akun siswa"
                        link="/admin/akun/siswa" // Link ke halaman daftar penuh Akun Siswa
                    />
                    {/* Menggunakan grid 4 kolom sesuai screenshot */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {siswaData.slice(0, 4).map((item: any) => <SiswaCard key={item.id} data={item} />)}
                    </div>
                </div>

                {/* 2. AKUN INDUSTRI */}
                <div>
                    <SectionHeader
                        title="Akun industri"
                        link="/admin/akun/industri" // Link ke halaman daftar penuh Akun Industri
                    />
                    {/* Menggunakan grid 4 kolom sesuai screenshot */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {industriData.slice(0, 4).map((item: any) => <IndustriCard key={item.id} data={item} />)}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminAkunPage;