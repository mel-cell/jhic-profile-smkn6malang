import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { studentsAPI } from '@/app/services/api';

interface StudentProfile {
    fullName: string;
    major?: string;
    address?: string;
    phoneNumber?: string;
    description?: string;
}

const ProfileSection: React.FC = () => {
    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                // Get token from localStorage or context
                const token = localStorage.getItem('authToken');
                if (!token) {
                    setError('Token tidak ditemukan. Silakan login terlebih dahulu.');
                    return;
                }

                const response = await studentsAPI.getProfile(token);
                if (response.success) {
                    setProfile(response.data);
                } else {
                    setError('Gagal memuat profil');
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Gagal memuat profil');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Profil Saya</h2>
                            <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error || !profile) {
        return (
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Profil Saya</h2>
                            <p className="text-gray-600">Gagal memuat data profil</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Profil Saya</h2>
                        <p className="text-gray-600">Kelola profil dan portofolio Anda</p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white relative overflow-hidden">
                        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
                            <div className="flex-shrink-0">
                                <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white flex items-center justify-center">
                                    <span className="text-2xl font-bold text-blue-600">
                                        {profile.fullName.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-2xl font-bold mb-2">{profile.fullName}</h3>
                                <p className="text-blue-100 mb-4">{profile.major || 'Jurusan belum diisi'}</p>

                                <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start">
                                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                                        {profile.description || 'Deskripsi belum diisi'}
                                    </span>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                                    <Link href="/siswa/profile">
                                        <button className="bg-white text-blue-600 font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                                            Lihat Profil Lengkap
                                        </button>
                                    </Link>
                                    <Link href="/siswa/profile/edit">
                                        <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors">
                                            Edit Profil
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProfileSection;
