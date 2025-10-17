"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { authAPI } from '@/app/services/api';

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Determine the register link based on current path
  const getRegisterLink = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/siswa/login') {
        return '/siswa/register';
      } else if (path === '/industri/login') {
        return '/industri/register';
      } else if (path === '/admin/login') {
        return '/admin/register';
      }
    }
    return 'register'; // fallback
  };

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
          router.push('/'); // Default redirect
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
      {/* Lingkaran / Bentuk Geometris di Background */}
      <div className="absolute -top-20 -left-20 w-48 h-48 bg-gray-800 rounded-full opacity-70"></div>
      <div className="absolute top-10 -right-20 w-80 h-80 bg-yellow-400 rounded-full opacity-70"></div>
      <div className="absolute -bottom-10 -right-20 w-48 h-48 bg-gray-400 rounded-full opacity-70"></div>
      <div className="absolute bottom-20 -left-10 w-40 h-40 bg-yellow-500 rounded-full opacity-70"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-yellow-300 rounded-full opacity-70"></div>

      {/* Kontainer Utama Form */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white rounded-lg shadow-xl border border-gray-200">
        {/* Logo dan Header */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/logo.webp"
            alt="Logo SMK Negeri 6 Malang"
            width={80}
            height={80}
            priority
            className="mb-2"
          />
          <h1 className="text-xl font-bold text-gray-800">SMK Negeri 6 Malang</h1>
          <p className="text-sm text-gray-500 text-center">Silahkan login terlebih dahulu untuk melanjutkan</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Input Email / Username */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
              Email 
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
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
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
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
            className={`w-full text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors shadow-lg shadow-blue-500/50 ${
              isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
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
              Lupa password?
            </Link>
            <p className="mt-1 text-gray-600">
              Tidak punya akun?{' '}
              <Link href={getRegisterLink()} className="text-blue-600 hover:text-blue-800 font-medium">
                Daftar sekarang
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
