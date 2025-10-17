// File: src/app/siswa/profile/edit/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Mail, Phone, MapPin, User, Calendar, Facebook, Instagram, Maximize2 } from 'lucide-react';
import { studentsAPI } from '@/app/services/api';

interface StudentProfile {
    fullName: string;
    major?: string;
    address?: string;
    phoneNumber?: string;
    description?: string;
    email?: string;
    gender?: string;
    birthDate?: string;
    skills?: string;
}

const EditProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // State untuk menampung data formulir
    const [formData, setFormData] = useState({
        fotoUrl: '',
        nis: '',
        username: '',
        email: '',
        noTelp: '',
        noAlamat: '',
        deskripsiSingkat: '',
        kelas: '',
        gender: '',
        tanggalLahir: '',
        keahlian: '',
        tiktok: '',
        instagram: '',
        facebook: '',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('authToken');
                if (!token) {
                    setError('Token tidak ditemukan. Silakan login terlebih dahulu.');
                    return;
                }

                const response = await studentsAPI.getProfile(token);
                if (response.success) {
                console.log('Fetched profile data:', response.data);
                const data = response.data;
                setProfile(data);
                setFormData({
                    fotoUrl: data.profilePhotoPath || '',
                    nis: data.nis || '',
                    username: data.fullName || '',
                    email: data.email || '',
                    noTelp: data.phoneNumber || '',
                    noAlamat: data.address || '',
                    deskripsiSingkat: data.description || '',
                    kelas: data.major || '',
                    gender: data.gender || '',
                    tanggalLahir: data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : '',
                    keahlian: data.skills || '',
                    tiktok: '',
                    instagram: '',
                    facebook: '',
                });
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, gender: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('Token tidak ditemukan. Silakan login terlebih dahulu.');
                return;
            }

            // Upload photo if selected
            if (selectedFile) {
                const photoResponse = await studentsAPI.uploadProfilePhoto(selectedFile, token);
                if (!photoResponse.success) {
                    alert('Gagal mengupload foto profil');
                    return;
                }
            }

            // Filter out empty strings and undefined values
            const updateData: any = {};
            if (formData.username.trim()) updateData.fullName = formData.username.trim();
            if (formData.nis.trim()) updateData.nis = formData.nis.trim();
            if (formData.noAlamat.trim()) updateData.address = formData.noAlamat.trim();
            if (formData.noTelp.trim()) updateData.phoneNumber = formData.noTelp.trim();
            if (formData.kelas.trim()) updateData.major = formData.kelas.trim();
            if (formData.deskripsiSingkat.trim()) updateData.description = formData.deskripsiSingkat.trim();
            if (formData.email.trim()) updateData.email = formData.email.trim();
            if (formData.gender.trim()) updateData.gender = formData.gender.trim();
            if (formData.tanggalLahir.trim()) updateData.birthDate = formData.tanggalLahir.trim();
            if (formData.keahlian.trim()) updateData.skills = formData.keahlian.trim();

            console.log('Form data before submit:', formData);
            console.log('Filtered update data being sent:', updateData);
            console.log('Token:', token);

            // Only send if there's data to update
            if (Object.keys(updateData).length === 0) {
                alert('Tidak ada data yang diubah. Silakan isi setidaknya satu field.');
                return;
            }

            const response = await studentsAPI.updateProfile(updateData, token);
            if (response.success) {
                alert('Profil berhasil diperbarui!');
                // Redirect back to profile page
                window.location.href = '/siswa/profile';
            } else {
                alert('Gagal memperbarui profil');
            }
        } catch (err: any) {
            console.error('Error updating profile:', err);
            const errorMessage = err?.error || err?.message || 'Terjadi kesalahan saat memperbarui profil';
            alert(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-35 pb-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 shadow-lg rounded-xl">
                    <h1 className="text-2xl font-bold text-gray-800 mb-8 border-b border-gray-200 pb-2">
                        Edit Profile
                    </h1>

                    {/* --- BAGIAN FOTO PROFIL --- */}
                    <div className="flex items-center space-x-6 mb-10 border-b border-gray-200 pb-8">
                        {/* Foto Saat Ini */}
                        <div className="relative w-28 h-28 border-4 border-black rounded-full overflow-hidden shadow-md">
                            {formData.fotoUrl ? (
                                <Image
                                    src={formData.fotoUrl}
                                    alt="Foto Profil"
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-full"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-full">
                                    <User className="w-12 h-12 text-gray-400" />
                                </div>
                            )}
                        </div>
                        
                        {/* Tombol Ubah Foto */}
                        <label className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors">
                            Ubah foto Profil
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setSelectedFile(file);
                                        const reader = new FileReader();
                                        reader.onload = (e) => {
                                            setFormData(prev => ({ ...prev, fotoUrl: e.target?.result as string }));
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                        </label>
                    </div>

                    {/* --- BAGIAN EDIT AKUN --- */}
                    <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-orange-500 pb-2">
                        Edit akun
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <div className="flex flex-col mb-4 md:col-span-2">
                            <label htmlFor="username" className="text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder="Masukkan username"
                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="flex flex-col mb-4">
                            <label htmlFor="nis" className="text-sm font-medium text-gray-700 mb-1">
                                NIS (Nomor Induk Siswa)
                            </label>
                            <input
                                type="text"
                                id="nis"
                                name="nis"
                                value={formData.nis}
                                onChange={handleInputChange}
                                placeholder="Masukkan NIS"
                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="flex flex-col mb-4 md:col-span-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Masukkan email"
                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="flex flex-col mb-4">
                            <label htmlFor="noTelp" className="text-sm font-medium text-gray-700 mb-1">
                                No. Telp
                            </label>
                            <input
                                type="tel"
                                id="noTelp"
                                name="noTelp"
                                value={formData.noTelp}
                                onChange={handleInputChange}
                                placeholder="Masukkan nomor telepon"
                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="flex flex-col mb-4">
                            <label htmlFor="noAlamat" className="text-sm font-medium text-gray-700 mb-1">
                                No. Alamat
                            </label>
                            <input
                                type="text"
                                id="noAlamat"
                                name="noAlamat"
                                value={formData.noAlamat}
                                onChange={handleInputChange}
                                placeholder="Masukkan alamat"
                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* --- BAGIAN EDIT INFORMASI --- */}
                    <h2 className="text-xl font-bold text-gray-800 mt-8 mb-6 border-b border-orange-500 pb-2">
                        Edit informasi
                    </h2>

                    <div className="flex flex-col mb-4">
                        <label htmlFor="deskripsiSingkat" className="text-sm font-medium text-gray-700 mb-1">
                            Deskripsi / bio informasi
                        </label>
                        <textarea
                            id="deskripsiSingkat"
                            name="deskripsiSingkat"
                            value={formData.deskripsiSingkat}
                            onChange={handleInputChange}
                            placeholder="Tulis deskripsi singkat Anda di sini..."
                            rows={5}
                            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                        />
                    </div>

                    {/* Kelas Dropdown */}
                    <div className="flex flex-col mb-4">
                        <label htmlFor="kelas" className="text-sm font-medium text-gray-700 mb-1">
                            Kelas
                        </label>
                        <select
                            id="kelas"
                            name="kelas"
                            value={formData.kelas}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                            <option value="">Pilih Jurusan</option>
                            <option value="RPL">Rekayasa Perangkat Lunak (RPL)</option>
                            <option value="TKJ">Teknik Komputer dan Jaringan (TKJ)</option>
                            <option value="MM">Multimedia (MM)</option>
                            <option value="BDP">Bisnis Daring dan Pemasaran (BDP)</option>
                            <option value="AK">Akuntansi (AK)</option>
                            <option value="AP">Administrasi Perkantoran (AP)</option>
                            <option value="OTKP">Otomatisasi dan Tata Kelola Perkantoran (OTKP)</option>
                            <option value="DKV">Desain Komunikasi Visual (DKV)</option>
                            <option value="TB">Tata Boga (TB)</option>
                            <option value="ATP">Agribisnis Tanaman Pangan (ATP)</option>
                        </select>
                    </div>

                    {/* Keahlian Textarea */}
                    <div className="flex flex-col mb-4">
                        <label htmlFor="keahlian" className="text-sm font-medium text-gray-700 mb-1">
                            Keahlian
                        </label>
                        <textarea
                            id="keahlian"
                            name="keahlian"
                            value={formData.keahlian}
                            onChange={handleChange}
                            placeholder="Cth: UI/UX desainer, Data Analyst (pisahkan dengan koma)"
                            rows={3}
                            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                        />
                    </div>

                    {/* Gender dan Tanggal Lahir (Dibuat dalam satu baris) */}
                    <div className="flex flex-col md:flex-row md:space-x-8 mb-4 mt-6">
                        {/* Gender */}
                        <div className="mb-4 md:mb-0">
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Gender</label>
                            <div className="flex space-x-6">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Laki-laki"
                                        checked={formData.gender === 'Laki-laki'}
                                        onChange={handleGenderChange}
                                        className="form-radio text-blue-600"
                                    />
                                    <span>Laki - laki</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Perempuan"
                                        checked={formData.gender === 'Perempuan'}
                                        onChange={handleGenderChange}
                                        className="form-radio text-blue-600"
                                    />
                                    <span>Perempuan</span>
                                </label>
                            </div>
                        </div>

                        {/* Tanggal Lahir */}
                        <div className="flex-1">
                            <label htmlFor="tanggalLahir" className="text-sm font-medium text-gray-700 mb-1 block">
                                Ulang tahun
                            </label>
                            <input
                                type="date"
                                id="tanggalLahir"
                                name="tanggalLahir"
                                value={formData.tanggalLahir}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* --- BAGIAN SOCIAL MEDIA --- */}
                    <h2 className="text-xl font-bold text-gray-800 mt-8 mb-6 border-b border-orange-500 pb-2">
                        Social media
                    </h2>

                    {/* TikTok */}
                    <div className="flex items-center space-x-4 mb-4">
                        <svg className="w-6 h-6 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12.553 17.653a1.536 1.536 0 01-1.094-1.55 7.422 7.422 0 00-2.853-2.924V8.508h1.83a.473.473 0 00.473-.473v-2.06a.473.473 0 00-.473-.473H7.818V3.424h2.245c1.17 0 2.274.7 2.76 1.83a5.558 5.558 0 01.326 2.38v.89a.473.473 0 00.473.473h3.048V10.27a.473.473 0 00-.473.473v1.86a.473.473 0 00.473.473h.97a.473.473 0 00.473-.473v-2.148a.473.473 0 00-.473-.473h-2.164a.473.473 0 00-.473.473v1.517a.473.473 0 00.473.473h.363c1.76 0 3.25 1.55 3.125 3.32-.12 1.71-1.63 3.01-3.32 3.01h-2.934z"/></svg>
                        <div className="flex flex-col flex-1 mb-0">
                            <label htmlFor="tiktok" className="text-sm font-medium text-gray-700 mb-1">
                                Tiktok
                            </label>
                            <input
                                type="text"
                                id="tiktok"
                                name="tiktok"
                                value={formData.tiktok}
                                onChange={handleInputChange}
                                placeholder="@username_tiktok"
                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Instagram */}
                    <div className="flex items-center space-x-4 mb-4">
                        <Instagram className="w-6 h-6 text-gray-500 flex-shrink-0" />
                        <div className="flex flex-col flex-1 mb-0">
                            <label htmlFor="instagram" className="text-sm font-medium text-gray-700 mb-1">
                                Instagram
                            </label>
                            <input
                                type="text"
                                id="instagram"
                                name="instagram"
                                value={formData.instagram}
                                onChange={handleInputChange}
                                placeholder="@username_instagram"
                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Facebook */}
                    <div className="flex items-center space-x-4 mb-4">
                        <Facebook className="w-6 h-6 text-gray-500 flex-shrink-0" />
                        <div className="flex flex-col flex-1 mb-0">
                            <label htmlFor="facebook" className="text-sm font-medium text-gray-700 mb-1">
                                Facebook
                            </label>
                            <input
                                type="text"
                                id="facebook"
                                name="facebook"
                                value={formData.facebook}
                                onChange={handleInputChange}
                                placeholder="Link atau username Facebook"
                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>


                    {/* --- BAGIAN TOMBOL --- */}
                    <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200 mt-10">
                        <button
                            type="button"
                            onClick={() => window.location.href = '/siswa/profile'}
                            className="text-gray-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-2 rounded-lg shadow-md transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Updating...' : 'Update'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EditProfilePage;