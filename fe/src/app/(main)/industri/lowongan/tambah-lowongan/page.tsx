'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Briefcase, MapPin, DollarSign, Save } from 'lucide-react';
import { jobsAPI } from '../../../../services/api';

const AddJobPage = () => {
    const router = useRouter();
    const [form, setForm] = useState({
        jobTitle: '',
        description: '',
        requirements: '',
        location: '',
        salaryRange: '',
        employmentType: 'Full-time',
        applicationDeadline: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token autentikasi tidak ditemukan. Silakan login terlebih dahulu.');
            }

            const response = await jobsAPI.create({
                jobTitle: form.jobTitle,
                description: form.description || undefined,
                requirements: form.requirements || undefined,
                location: form.location || undefined,
                salaryRange: form.salaryRange || undefined,
                employmentType: form.employmentType,
                applicationDeadline: form.applicationDeadline ? `${form.applicationDeadline}T23:59:59.000Z` : undefined,
                notes: form.notes || undefined
            }, token);

            if (response.success) {
                alert('Lowongan berhasil dibuat! Status awal: Menunggu Persetujuan.');
                router.push('/industri/lowongan');
            } else {
                throw new Error(response.error || 'Gagal membuat lowongan');
            }
        } catch (err: any) {
            setError(err.message || 'Terjadi kesalahan saat membuat lowongan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-30 bg-gray-50 py-10">
            <div className="container mx-auto justify-center max-w-4xl">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <Link
                        href="/industri/lowongan"
                        className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
                    >
                        <ArrowLeft className="w-5 h-5 mr-1" />
                        Kembali
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Tambah Lowongan Baru</h1>
                </div>

                {/* Form */}
                <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 max-w-4xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Job Title */}
                        <div>
                            <label htmlFor="jobTitle" className="block text-sm font-semibold text-gray-700 mb-2">
                                Judul Lowongan <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="jobTitle"
                                name="jobTitle"
                                value={form.jobTitle}
                                onChange={handleChange}
                                placeholder="Contoh: Software Engineer"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                                Deskripsi Pekerjaan
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Deskripsi tugas dan tanggung jawab..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                        </div>

                        {/* Requirements */}
                        <div>
                            <label htmlFor="requirements" className="block text-sm font-semibold text-gray-700 mb-2">
                                Persyaratan
                            </label>
                            <textarea
                                id="requirements"
                                name="requirements"
                                value={form.requirements}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Kualifikasi, pengalaman, dll..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                                Lokasi
                            </label>
                            <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    placeholder="Contoh: Malang, Jawa Timur"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Salary Range */}
                        <div>
                            <label htmlFor="salaryRange" className="block text-sm font-semibold text-gray-700 mb-2">
                                Rentang Gaji
                            </label>
                            <div className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                                <input
                                    type="text"
                                    id="salaryRange"
                                    name="salaryRange"
                                    value={form.salaryRange}
                                    onChange={handleChange}
                                    placeholder="Contoh: Rp 5.000.000 - Rp 7.000.000"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Employment Type */}
                        <div>
                            <label htmlFor="employmentType" className="block text-sm font-semibold text-gray-700 mb-2">
                                Jenis Pekerjaan <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="employmentType"
                                name="employmentType"
                                value={form.employmentType}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>

                        {/* Application Deadline */}
                        <div>
                            <label htmlFor="applicationDeadline" className="block text-sm font-semibold text-gray-700 mb-2">
                                Batas Lamaran
                            </label>
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                <input
                                    type="date"
                                    id="applicationDeadline"
                                    name="applicationDeadline"
                                    value={form.applicationDeadline}
                                    onChange={handleChange}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
                                Catatan Tambahan
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={form.notes}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Informasi tambahan..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex space-x-4 pt-4">
                            <Link
                                href="/industri/lowongan"
                                className="flex-1 flex items-center justify-center border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex-1 flex items-center justify-center font-semibold py-2 px-4 rounded-lg transition-colors ${
                                    loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {loading ? 'Menyimpan...' : 'Simpan Lowongan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddJobPage;
