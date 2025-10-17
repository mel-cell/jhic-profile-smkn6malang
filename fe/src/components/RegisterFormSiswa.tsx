// src/components/RegisterFormSiswa.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { authAPI } from '@/app/services/api';

// Definisikan props untuk menampung daftar jurusan (jika diperlukan)
interface RegisterFormProps {
    userType?: 'siswa' | 'industri' | 'admin';
}

const RegisterFormSiswa: React.FC<RegisterFormProps> = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [selectedJurusan, setSelectedJurusan] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    // Data dummy untuk Jurusan
    const jurusanOptions = [
        { value: 'rpl', label: 'Rekayasa Perangkat Lunak' },
        { value: 'tkj', label: 'Teknik Komputer & Jaringan' },
        { value: 'tpm', label: 'Teknik Pemesinan' },
        // Tambahkan jurusan lain sesuai kebutuhan
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const fullName = formData.get('name') as string;
        const nis = formData.get('nis') as string;
        const major = selectedJurusan;

        try {
            // Call the registration API
            const response = await authAPI.registerStudent({
                email: email,
                password: password,
                fullName: fullName,
                nis: nis,
                major: major
            });

            if (response.success) {
                console.log('Registrasi Sukses!');
                const { token, user } = response.data;
                if (token) {
                    localStorage.setItem('token', token);
                }
                const role = user?.role || 'STUDENT';
                let redirectPath = '/login';
                if (role === 'STUDENT') {
                    redirectPath = '/siswa';
                } else if (role === 'COMPANY') {
                    redirectPath = '/industri';
                } else if (role === 'ADMIN') {
                    redirectPath = '/admin';
                }
                router.push(redirectPath);
            } else {
                throw new Error(response.error || "Registrasi gagal");
            }

        } catch (err: unknown) {
            // Handle API errors
            const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan koneksi.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Wrapper utama dengan background dinamis (sama seperti Login)
        <div className="relative min-h-screen w-full overflow-hidden bg-gray-100 flex items-center justify-center p-4">
            {/* Lingkaran / Bentuk Geometris di Background */}
            <div className="absolute -top-20 -left-20 w-48 h-48 bg-gray-800 rounded-full opacity-70"></div>
            <div className="absolute top-10 -right-20 w-80 h-80 bg-yellow-400 rounded-full opacity-70"></div>
            <div className="absolute -bottom-10 -right-20 w-48 h-48 bg-gray-400 rounded-full opacity-70"></div>
            <div className="absolute bottom-20 -left-10 w-40 h-40 bg-yellow-500 rounded-full opacity-70"></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-yellow-300 rounded-full opacity-70"></div>

            {/* Kontainer Utama Form Registrasi */}
            <div className="relative z-10 w-full max-w-md p-8 bg-white rounded-lg shadow-xl border border-gray-200">
                
                {/* Logo dan Header */}
                <div className="flex flex-col items-center mb-6">
                    <Image
                        src="/logo.webp" // Ganti dengan path logo Anda
                        alt="Logo SMK Negeri 6 Malang"
                        width={80} 
                        height={80} 
                        priority 
                        className="mb-2"
                    />
                    <h1 className="text-xl font-bold text-gray-800">SMK Negeri 6 Malang</h1>
                    <p className="text-sm text-gray-500 text-center">Daftarkan akun siswa untuk mengakses sistem</p>
                </div>

                <form onSubmit={handleSubmit}>
                    
                    {/* 1. Nama Lengkap */}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                            Nama lengkap
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Masukkan nama lengkap"
                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all"
                            required
                        />
                    </div>
                    
                    {/* 2. Jurusan (Menggunakan Select Dropdown) */}
                    <div className="mb-4">
                        <label htmlFor="jurusan" className="block text-sm font-semibold text-gray-700 mb-1">
                            Jurusan
                        </label>
                        <div className="relative">
                            <select
                                id="jurusan"
                                value={selectedJurusan}
                                onChange={(e) => setSelectedJurusan(e.target.value)}
                                className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-500"
                                required
                            >
                                <option value="" disabled>Pilih Jurusan</option>
                                {jurusanOptions.map((jurusan) => (
                                    <option key={jurusan.value} value={jurusan.value} className='text-gray-800'>
                                        {jurusan.label}
                                    </option>
                                ))}
                            </select>
                            {/* Ikon panah kanan seperti di contoh gambar */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* 3. Email Aktif */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                            Email aktif
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="contoh@gmail.com"
                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all"
                            required
                        />
                    </div>

                    {/* 4. Password */}
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Minimal 8 karakter"
                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10 transition-all"
                                required
                                minLength={8}
                            />
                            {/* Tombol show password (gunakan ikon mata yang sama) */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPassword ? (
                                    // Icon mata terbuka
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                ) : (
                                    // Icon mata tertutup
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7 .984 0 1.942.127 2.845.334M17.25 12c-1.33 4.293-5.264 7-9.542 7a9.97 9.97 0 01-2.203-.335m7.9-1.996a3 3 0 00-4.646-4.646m-.918 2.45c.475.297 1.05.474 1.68.474a2.997 2.997 0 002.167-.847m1.527-1.527c.451-.27.854-.582 1.207-.936m2.685-2.685A10.05 10.05 0 0012 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7a9.97 9.97 0 01-2.203-.335m7.9-1.996a3 3 0 00-4.646-4.646m-.918 2.45c.475.297 1.05.474 1.68.474a2.997 2.997 0 002.167-.847m1.527-1.527c.451-.27.854-.582 1.207-.936" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* 5. NIS */}
                    <div className="mb-6">
                        <label htmlFor="nis" className="block text-sm font-semibold text-gray-700 mb-1">
                            NIS
                        </label>
                        <input
                            type="text" // Menggunakan type text untuk NIS agar bisa menerima leading zeros
                            id="nis"
                            name="nis"
                            placeholder="0811111111"
                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all"
                            required
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <p className="text-red-600 text-center text-sm mb-4 border border-red-200 bg-red-50 p-2 rounded">
                            {error}
                        </p>
                    )}


                    {/* Tombol Daftar */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors shadow-lg shadow-blue-500/50 ${
                            isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                Memproses...
                            </span>
                        ) : (
                            'Daftar'
                        )}
                    </button>

                    {/* Link "Sudah punya akun?" */}
                    <div className="mt-4 text-center text-sm">
                        <p className="mt-1 text-gray-600">
                            Sudah punya akun?{' '}
                            <Link href="/login?type=siswa" className="text-blue-600 hover:text-blue-800 font-medium">
                                Login sekarang
                            </Link>
                        </p>
                    </div>

                </form>

                <p className="mt-8 text-center text-xs text-gray-400">
                    copyright@lumicode2025
                </p>
            </div>
        </div>
    );
};

export default RegisterFormSiswa;