// File: src/app/admin/akun/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    User, Briefcase, Mail, MapPin, Phone, Calendar, ArrowRight,
    GraduationCap, Briefcase as JobIcon, BookOpen, Clock, Settings, Search
} from 'lucide-react';
import { adminAPI } from '@/app/services/api';

// --- KOMPONEN KARTU SISWA ---
const SiswaCard = ({ data, onDelete }: { data: any; onDelete: (id: string, type: 'student' | 'company') => void }) => (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center text-center">

        {/* Foto Siswa */}
        <div className="w-20 h-20 overflow-hidden rounded-full mb-3 border-4 border-gray-200">
            <img
                src={data.image || '/placeholder-student.jpg'}
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
                onClick={() => onDelete(data.id, 'student')}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
            >
                Hapus
            </button>
        </div>
    </div>
);

// --- KOMPONEN KARTU INDUSTRI ---
const IndustriCard = ({ data, onDelete }: { data: any; onDelete: (id: string, type: 'student' | 'company') => void }) => (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex flex-col h-full">

        {/* Logo dan Nama Industri */}
        <div className="flex items-center border-b pb-3 mb-3">
            <div className="w-10 h-10 overflow-hidden rounded-full mr-3 border border-gray-200 flex-shrink-0">
                 {/* Asumsi logo ada di public folder */}
                <img src={data.logo || '/placeholder-company.jpg'} alt={data.name} className="w-full h-full object-contain p-1" />
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
                onClick={() => onDelete(data.id, 'company')}
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
    const [searchTerm, setSearchTerm] = useState('');

    // Handle delete user
    const handleDeleteUser = async (userId: string, userType: 'student' | 'company') => {
        if (!confirm(`Apakah Anda yakin ingin menghapus akun ${userType} ini?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('Token tidak ditemukan. Silakan login kembali.');
                return;
            }

            await adminAPI.deleteUser(userId, token);

            // Update local state
            if (userType === 'student') {
                setSiswaData(prev => prev.filter((user: any) => user.id !== userId));
            } else {
                setIndustriData(prev => prev.filter((user: any) => user.id !== userId));
            }

            alert('Akun berhasil dihapus.');
        } catch (error) {
            console.error('Failed to delete user:', error);
            alert('Gagal menghapus akun. Silakan coba lagi.');
        }
    };

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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // Filter data berdasarkan search term
    const filteredSiswaData = siswaData.filter((item: any) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredIndustriData = industriData.filter((item: any) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="p-8">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header Halaman */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
                <h1 className="text-3xl font-extrabold text-gray-900">Manajemen Akun</h1>

                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                    <input
                        type="text"
                        placeholder="Cari akun..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 pl-10 transition duration-150 shadow-sm"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
                <button
                    onClick={() => window.location.href = '/admin/akun/tambah-siswa'}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center"
                >
                    <User className="w-4 h-4 mr-2" />
                    Tambah Siswa
                </button>
                <button
                    onClick={() => window.location.href = '/admin/akun/tambah-industri'}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center"
                >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Tambah Industri
                </button>
            </div>

            {/* Layout dengan dua kolom: kiri siswa, kanan industri */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Kolom Kiri: Akun Siswa */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                            <User className="w-6 h-6 mr-2 text-blue-600" />
                            Akun Siswa
                        </h2>
                        <Link
                            href="/admin/akun/siswa"
                            className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors"
                        >
                            Lihat Semua
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>

                    {/* Grid untuk kartu siswa */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredSiswaData.length > 0 ? (
                            filteredSiswaData.map((item: any) => <SiswaCard key={item.id} data={item} onDelete={handleDeleteUser} />)
                        ) : (
                            <p className="col-span-full text-gray-500 text-center py-8">Tidak ada akun siswa ditemukan.</p>
                        )}
                    </div>
                </div>

                {/* Kolom Kanan: Akun Industri */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                            <Briefcase className="w-6 h-6 mr-2 text-green-600" />
                            Akun Industri
                        </h2>
                        <Link
                            href="/admin/akun/industri"
                            className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors"
                        >
                            Lihat Semua
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>

                    {/* Grid untuk kartu industri */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredIndustriData.length > 0 ? (
                            filteredIndustriData.map((item: any) => <IndustriCard key={item.id} data={item} onDelete={handleDeleteUser} />)
                        ) : (
                            <p className="col-span-full text-gray-500 text-center py-8">Tidak ada akun industri ditemukan.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminAkunPage;