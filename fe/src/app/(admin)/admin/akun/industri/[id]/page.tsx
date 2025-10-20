'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Building, Globe, Edit2, Trash2, FileText, Briefcase, Users } from 'lucide-react';
import { adminAPI } from '@/app/services/api';

interface CompanyDetail {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  industryType: string;
  address: string;
  website: string;
  description: string;
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonPhotoPath?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const AdminCompanyDetailPage: React.FC<{ params: { id: string } }> = ({ params }) => {
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobPostings, setJobPostings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchCompanyDetail = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');

        if (!token) {
          console.error('No auth token found');
          return;
        }

        // Fetch company details
        const companyRes = await adminAPI.getAllUsers(token);
        const allUsers = companyRes.data || [];
        const companyData = allUsers.find((user: any) => user.id === params.id && user.role === 'COMPANY');

        if (companyData) {
          // Transform user data to company format
          const company: CompanyDetail = {
            id: companyData.id,
            companyName: companyData.companyName || 'Nama perusahaan tidak tersedia',
            email: companyData.email,
            phone: companyData.phoneNumber || '',
            industryType: companyData.industryType || '',
            address: companyData.address || '',
            website: companyData.website || '',
            description: companyData.description || '',
            contactPersonName: companyData.contactPersonName || '',
            contactPersonEmail: companyData.contactPersonEmail || '',
            contactPersonPhotoPath: companyData.contactPersonPhotoPath || '',
            status: companyData.status || 'active',
            createdAt: companyData.createdAt || '',
            updatedAt: companyData.updatedAt || ''
          };
          setCompany(company);
        }

        // Fetch company's job postings
        const jobsRes = await adminAPI.getAllJobPostings(token);
        const allJobs = jobsRes.data || [];
        const companyJobs = allJobs.filter((job: any) => job.companyId === params.id);
        setJobPostings(companyJobs);

      } catch (error) {
        console.error('Failed to fetch company details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCompanyDetail();
    }
  }, [params.id]);

  const handleDeleteCompany = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus perusahaan ini? Semua data terkait akan hilang.')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Token tidak ditemukan. Silakan login kembali.');
        return;
      }

      await adminAPI.deleteUser(params.id, token);
      alert('Perusahaan berhasil dihapus.');
      window.location.href = '/admin/akun/industri';
    } catch (error) {
      console.error('Failed to delete company:', error);
      alert('Gagal menghapus perusahaan.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat detail perusahaan...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Perusahaan tidak ditemukan</h2>
          <Link href="/admin/akun/industri" className="text-blue-600 hover:underline">
            Kembali ke daftar perusahaan
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profil', icon: Building },
    { id: 'jobs', label: 'Lowongan', icon: Briefcase }
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/akun/industri"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Detail Perusahaan</h1>
            <p className="text-gray-600 mt-1">{company.companyName}</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <Link
            href={`/admin/akun/industri/edit/${company.id}`}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Link>
          <button
            onClick={handleDeleteCompany}
            className="flex items-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Hapus
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="flex border-b">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200">
                  {company.contactPersonPhotoPath ? (
                    <img
                      src={company.contactPersonPhotoPath}
                      alt={company.contactPersonName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Building className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{company.companyName}</h2>
                  <p className="text-gray-600">{company.industryType}</p>
                  <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full mt-2 ${getStatusColor(company.status)}`}>
                    {company.status}
                  </span>
                </div>
              </div>

              {/* Profile Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Perusahaan</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{company.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Telepon</p>
                          <p className="font-medium">{company.phone || 'Tidak ada'}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Globe className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Website</p>
                          <p className="font-medium">
                            {company.website ? (
                              <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {company.website}
                              </a>
                            ) : 'Tidak ada'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Alamat</p>
                          <p className="font-medium">{company.address || 'Tidak ada'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Kontak Person</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Nama</p>
                          <p className="font-medium">{company.contactPersonName || 'Tidak ada'}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Email Kontak</p>
                          <p className="font-medium">{company.contactPersonEmail || 'Tidak ada'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Akun</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Bergabung sejak</p>
                        <p className="font-medium">{formatDate(company.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Terakhir diperbarui</p>
                        <p className="font-medium">{formatDate(company.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {company.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Deskripsi Perusahaan</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{company.description}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Jobs Tab */}
          {activeTab === 'jobs' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Lowongan Kerja</h2>

              {jobPostings.length > 0 ? (
                <div className="space-y-4">
                  {jobPostings.map((job) => (
                    <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{job.jobTitle}</h3>
                          <p className="text-sm text-gray-600">{job.location || 'Lokasi tidak ditentukan'}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Dibuat: {formatDate(job.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                            job.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                            job.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            job.status === 'EXPIRED' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {job.status === 'ACTIVE' ? 'Aktif' :
                             job.status === 'PENDING' ? 'Menunggu' :
                             job.status === 'EXPIRED' ? 'Kadaluarsa' : 'Ditolak'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Tipe: {job.employmentType || 'Tidak ditentukan'}</span>
                          <span>Gaji: {job.salaryRange || 'Tidak ditentukan'}</span>
                        </div>
                        <Link
                          href={`/admin/lowongan/${job.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Lihat Detail →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada lowongan</h3>
                  <p className="text-gray-600">Perusahaan ini belum membuat lowongan kerja.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCompanyDetailPage;
