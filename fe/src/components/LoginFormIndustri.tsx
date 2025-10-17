// src/components/LoginFormIndustri.tsx
"use client";

import React, { useState } from 'react'; // Tambahkan useState untuk toggle password
import Image from 'next/image'; // Import komponen Image dari Next.js
import Link from 'next/link'; // Gunakan Link dari Next.js untuk navigasi internal
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { authAPI } from '@/app/services/api';

// Definisikan props untuk komponen login (sesuai kebutuhan)
interface LoginFormProps {
    userType: 'siswa' | 'industri' | 'admin'; // Untuk membedakan teks atau validasi jika perlu
}

const LoginForm: React.FC<LoginFormProps> = ({ userType }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    // Anda bisa menyesuaikan teks, misalnya:
    const headerText = userType === 'siswa'
        ? "Silakan login terlebih dahulu untuk melanjutkan"
        : "Silakan login terlebih dahulu untuk melanjutkan";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // Call the authentication API
            const response = await authAPI.login({
                email: email,
                password: password
            });

            if (response.success) {
                // Store the token in localStorage
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('userRole', response.data.user.role);
                localStorage.setItem('userId', response.data.user.id);

                console.log('Login Sukses!');

                // Redirect based on user role
                if (response.data.user.role === 'STUDENT') {
                    router.push('/siswa');
                } else if (response.data.user.role === 'COMPANY') {
                    router.push('/industri');
                } else if (response.data.user.role === 'ADMIN') {
                    router.push('/admin');
                } else {
                    router.push('/industri');
                }
            } else {
                throw new Error(response.error || "Login gagal");
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
        // Wrapper utama dengan background dinamis
        <div className="relative min-h-screen w-full overflow-hidden bg-gray-100 flex items-center justify-center p-4">
            {/* Lingkaran / Bentuk Geometris di Background (sesuai gambar) */}
            <div className="absolute -top-20 -left-20 w-48 h-48 bg-gray-800 rounded-full opacity-70"></div>
            <div className="absolute top-10 -right-20 w-80 h-80 bg-yellow-400 rounded-full opacity-70"></div>
            <div className="absolute -bottom-10 -right-20 w-48 h-48 bg-gray-400 rounded-full opacity-70"></div>
            <div className="absolute bottom-20 -left-10 w-40 h-40 bg-yellow-500 rounded-full opacity-70"></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-yellow-300 rounded-full opacity-70"></div>
            {/* ... tambahkan lebih banyak jika perlu untuk mengisi area */}

            {/* Kontainer Utama Form */}
            <div className="relative z-10 w-full max-w-md p-8 bg-white rounded-lg shadow-xl border border-gray-200">
                {/* Logo dan Header */}
                <div className="flex flex-col items-center mb-8">
                    <Image
                        src="/logo.webp" // Ganti dengan path logo Anda
                        alt="Logo SMK Negeri 6 Malang"
                        width={80} // Sesuaikan ukuran logo
                        height={80} // Sesuaikan ukuran logo
                        priority // Untuk memprioritaskan pemuatan logo
                        className="mb-4"
                    />
                    <h1 className="text-xl font-bold mt-2 text-gray-800">SMK Negeri 6 Malang</h1>
                    <p className="text-sm text-gray-500 text-center">{headerText}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Input Email / Username */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                            Email / Username
                        </label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Masukkan Email / username"
                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all"
                            required
                        />
                    </div>

                    {/* Input Password */}
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Masukkan password"
                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10 transition-all"
                                required
                            />
                            {/* Tombol show password */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)} // Toggle state
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

                    {/* Pesan Error */}
                    {error && (
                        <p className="text-red-600 text-center text-sm mb-4 border border-red-200 bg-red-50 p-2 rounded">
                            {error}
                        </p>
                    )}

                    {/* Tombol Masuk */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors ${
                            isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                Memproses...
                            </span>
                        ) : (
                            'Masuk'
                        )}
                    </button>

                    {/* Link tambahan */}
                    <div className="mt-4 text-center text-sm">
                        <Link href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                            Lupa password ?
                        </Link>
                        <p className="mt-1 text-gray-600">
                            Tidak punya akun?{' '}
                            <Link href="/register/industri" className="text-blue-600 hover:text-blue-800 font-medium">
                                Register terlebih dahulu
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

export default LoginForm;