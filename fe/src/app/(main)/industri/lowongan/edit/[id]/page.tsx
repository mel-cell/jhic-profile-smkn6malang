'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';
import { jobsAPI } from '@/app/services/api';

const EditJobPage = () => {
    const router = useRouter();
    const [jobId, setJobId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        jobTitle: '',
        description: '',
        requirements: '',
        location: '',
        salaryRange: '',
        employmentType: 'Full Time',
        applicationDeadline: ''
    });

    useEffect(() => {
        // Get job ID from URL
        const pathSegments = window.location.pathname.split('/');
        const id = pathSegments[pathSegments.length - 1];
        if (id) {
            setJobId(id);
            fetchJobData(id);
        }
    }, []);

    const fetchJobData = async (id: string) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('Token tidak ditemukan. Silakan login terlebih dahulu.');
                setLoading(false);
                return;
            }

            const response = await jobsAPI.getByIdForCompany(id, token);
            if (response.success && response.data) {
                const job = response.data;
                setFormData({
                    jobTitle: job.jobTitle || '',
                    description: job.description || '',
                    requirements: job.requirements || '',
                    location: job.location || '',
                    salaryRange: job.salaryRange || '',
                    employmentType: job.employmentType || 'Full Time',
                    applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : ''
                });
            } else {
                setError('Gagal memuat data lowongan');
            }
        } catch (error) {
            console.error('Failed to fetch job data:', error);
            setError('Gagal memuat data lowongan');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('Token tidak ditemukan. Silakan login terlebih dahulu.');
                return;
            }

            const updateData = {
                ...formData,
                applicationDeadline: formData.applicationDeadline ? new Date(formData.applicationDeadline).toISOString() : null
            };

            const response = await jobsAPI.update(jobId, updateData, token);
            if (response.success) {
                router.push(`/industri/lowongan/${jobId}`);
            } else {
                setError('Gagal memperbarui lowongan');
            }
        } catch (error) {
            console.error('Failed to update job:', error);
            setError('Gagal memperbarui lowongan');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-10 flex items-center justify-center">
                <p className="text-xl text-gray-700">Memuat data lowongan...</p>
            </div>
        );
    }

    if (error && !saving) {
        return (
            <div className="min-h-screen bg-gray-50 py-10 flex items-center justify-center">
                <p className="text-xl text-red-700">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-30 bg-gray-50 py-10">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-gray-600 hover:text-gray-900 font-semibold transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Kembali
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Lowongan</h1>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Job Title */}
                        <div>
                            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
                                Judul Pekerjaan *
                            </label>
                            <input
                                type="text"
                                id="jobTitle"
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Masukkan judul pekerjaan"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Deskripsi Pekerjaan *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Jelaskan detail pekerjaan, tanggung jawab, dan informasi lainnya"
                            />
                        </div>

                        {/* Requirements */}
                        <div>
                            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                                Persyaratan
                            </label>
                            <textarea
                                id="requirements"
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Masukkan persyaratan yang dibutuhkan (satu per baris)"
                            />
                        </div>

                        {/* Location and Employment Type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                    Lokasi
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Masukkan lokasi kerja"
                                />
                            </div>
                            <div>
                                <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipe Pekerjaan
                                </label>
                                <select
                                    id="employmentType"
                                    name="employmentType"
                                    value={formData.employmentType}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Full Time">Full Time</option>
                                    <option value="Part Time">Part Time</option>
                                    <option value="Internship">Magang</option>
                                    <option value="Contract">Kontrak</option>
                                </select>
                            </div>
                        </div>

                        {/* Salary Range and Deadline */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="salaryRange" className="block text-sm font-medium text-gray-700 mb-2">
                                    Kisaran Gaji
                                </label>
                                <input
                                    type="text"
                                    id="salaryRange"
                                    name="salaryRange"
                                    value={formData.salaryRange}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Contoh: Rp 5.000.000 - Rp 10.000.000"
                                />
                            </div>
                            <div>
                                <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700 mb-2">
                                    Batas Lamaran
                                </label>
                                <input
                                    type="date"
                                    id="applicationDeadline"
                                    name="applicationDeadline"
                                    value={formData.applicationDeadline}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex items-center px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditJobPage;
