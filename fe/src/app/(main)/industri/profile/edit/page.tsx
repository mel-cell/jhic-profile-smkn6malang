// File: src/app/industri/profil/edit/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Camera, User, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import { companiesAPI } from '@/app/services/api';

// --- Komponen Input Teks Dasar ---
const FormInput = ({ label, id, type = 'text', value, onChange, placeholder = '' }: {
    label: string;
    id: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}) => (
    <div className="mb-6">
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
        </label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 shadow-sm`}
            placeholder={placeholder}
            required
        />
    </div>
);

// --- Komponen Textarea ---
const FormTextarea = ({ label, id, value, onChange }: {
    label: string;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) => (
    <div className="mb-6">
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
        </label>
        <textarea
            id={id}
            rows={5}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 shadow-sm resize-none"
            required
        ></textarea>
    </div>
);

// --- UTILITY COMPONENT: Garis Pemisah dengan Judul ---
const SectionDivider = ({ title }: { title: string }) => (
    <div className="mb-4 pt-6">
        <h2 className="text-2xl font-extrabold text-gray-900">{title}</h2>
        <div className="h-1 w-full bg-yellow-500 mt-2 mb-6"></div>
    </div>
);


// --- HALAMAN UTAMA EDIT PROFIL INDUSTRI ---
const EditProfilePage: React.FC = () => {
    const [form, setForm] = useState({
        companyName: '',
        industryType: '',
        address: '',
        phoneNumber: '',
        website: '',
        description: '',
        contactPersonName: '',
        contactPersonEmail: '',
        logoPath: '/sekawanmedia.jpeg'
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("authToken");
            if (!token) {
                setError("Token tidak ditemukan. Silakan login terlebih dahulu.");
                return;
            }

            const response = await companiesAPI.getProfile(token);
            if (response.success) {
                setForm({
                    companyName: response.data.companyName || '',
                    industryType: response.data.industryType || '',
                    address: response.data.address || '',
                    phoneNumber: response.data.phoneNumber || '',
                    website: response.data.website || '',
                    description: response.data.description || '',
                    contactPersonName: response.data.contactPersonName || '',
                    contactPersonEmail: response.data.contactPersonEmail || '',
                    logoPath: response.data.logoPath || '/sekawanmedia.jpeg'
                });
            } else {
                setError("Gagal memuat profil perusahaan");
            }
        } catch (err: any) {
            console.error("Error fetching profile:", err);
            setError("Gagal memuat data");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({
            ...form,
            [e.target.id]: e.target.value,
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const newUrl = URL.createObjectURL(file);
            setForm({ ...form, logoPath: newUrl });

            // Upload logo to server
            try {
                const token = localStorage.getItem("authToken");
                if (token) {
                    await companiesAPI.uploadLogo(file, token);
                    // Refresh profile data after upload
                    fetchProfile();
                }
            } catch (err: any) {
                console.error("Error uploading logo:", err);
                alert("Gagal mengupload logo");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                alert("Token tidak ditemukan. Silakan login terlebih dahulu.");
                return;
            }

            const response = await companiesAPI.updateProfile({
                companyName: form.companyName,
                industryType: form.industryType,
                address: form.address,
                phoneNumber: form.phoneNumber,
                website: form.website,
                description: form.description,
                contactPersonName: form.contactPersonName,
                contactPersonEmail: form.contactPersonEmail
            }, token);

            if (response.success) {
                alert('Profil berhasil diupdate!');
                // Redirect to profile page
                window.location.href = '/industri/profile';
            } else {
                alert('Gagal mengupdate profil');
            }
        } catch (err: any) {
            console.error("Error updating profile:", err);
            alert('Gagal mengupdate profil');
        }
    };

    return (
        <div className="min-h-screen mt-20 bg-gray-50 py-10 md:py-12">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Profile</h1>

                <form onSubmit={handleSubmit} className="pt-4">
                    
                    {/* --- AREA UPLOAD FOTO PROFIL --- */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start mb-8 border-b pb-8">
                        <div className="relative w-32 h-32 mb-4 sm:mb-0 mr-0 sm:mr-6">
                            <img
                                src={form.logoPath}
                                alt="Logo Perusahaan"
                                className="w-full h-full object-cover rounded-full border-4 border-gray-200 shadow-md"
                            />
                            {/* Tombol Upload File */}
                            <label htmlFor="foto-upload" className="absolute bottom-0 right-0 p-2 bg-yellow-500 rounded-full cursor-pointer hover:bg-yellow-600 transition-colors shadow-lg">
                                <Camera className="w-5 h-5 text-white" />
                                <input
                                    id="foto-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <div className='flex items-center sm:pt-4'>
                            <h2 className="text-xl font-semibold text-gray-900">Ubah foto Profil</h2>
                        </div>
                    </div>

                    
                    {/* --- 1. EDIT AKUN --- */}
                    <SectionDivider title="Edit akun" />
                    
                    <FormInput
                        id="companyName"
                        label="Nama industri"
                        value={form.companyName}
                        onChange={handleChange}
                        placeholder="Nama PT / Perusahaan"
                    />

                    <FormInput
                        id="contactPersonEmail"
                        label="Email"
                        type="email"
                        value={form.contactPersonEmail}
                        onChange={handleChange}
                        placeholder="Email kontak utama"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        <FormInput
                            id="phoneNumber"
                            label="No. Telp"
                            type="tel"
                            value={form.phoneNumber}
                            onChange={handleChange}
                            placeholder="Nomor Telepon Kantor"
                        />
                        <FormInput
                            id="address"
                            label="Alamat Lengkap"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Jalan, Nomor, Kota"
                        />
                    </div>
                    
                    {/* --- 2. EDIT INFORMASI --- */}
                    <SectionDivider title="Edit informasi" />
                    
                    <FormTextarea
                        id="description"
                        label="Deskripsi / bio informasi"
                        value={form.description}
                        onChange={handleChange}
                    />

                    <FormInput
                        id="industryType"
                        label="Bidang industri"
                        value={form.industryType}
                        onChange={handleChange}
                        placeholder="Contoh: Teknologi Informasi, Manufaktur, Jasa"
                    />

                    <FormInput
                        id="website"
                        label="Website"
                        type="url"
                        value={form.website}
                        onChange={handleChange}
                        placeholder="https://www.example.com"
                    />

                    <FormInput
                        id="contactPersonName"
                        label="Nama penanggung jawab akun"
                        value={form.contactPersonName}
                        onChange={handleChange}
                        placeholder="Nama kontak yang dapat dihubungi"
                    />


                    {/* --- Tombol Aksi (Footer) --- */}
                    <div className="flex justify-end items-center space-x-4 pt-6 border-t border-gray-200 mt-10">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="text-gray-600 font-semibold hover:text-gray-800 transition-colors py-2 px-4"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-8 rounded-lg shadow-md transition-all duration-200 active:scale-95"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfilePage;