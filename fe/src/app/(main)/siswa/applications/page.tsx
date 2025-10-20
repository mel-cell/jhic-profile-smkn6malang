'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { applicationsAPI } from '@/app/services/api';
import { Trash2, Eye, Calendar, Building, FileText } from 'lucide-react';

interface Application {
  id: string;
  status: string;
  notes?: string;
  applicationDate: string;
  lastStatusUpdate?: string;
  jobPosting: {
    id: string;
    jobTitle: string;
    companyProfile: {
      companyName: string;
      industryType: string;
      logoPath?: string;
    };
  };
  studentCv: {
    fileName: string;
    uploadedAt: string;
  };
}

const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Token tidak ditemukan. Silakan login terlebih dahulu.');
        return;
      }

      const response = await applicationsAPI.getMyApplications(token);
      if (response.success) {
        setApplications(response.data || []);
      } else {
        setError('Gagal memuat data lamaran');
      }
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      setError('Gagal memuat data lamaran');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApplication = async (applicationId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus lamaran ini?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await applicationsAPI.delete(applicationId, token);
      if (response.success) {
        setApplications(prev => prev.filter(app => app.id !== applicationId));
        alert('Lamaran berhasil dihapus');
      } else {
        alert('Gagal menghapus lamaran');
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Gagal menghapus lamaran');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'interview':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Menunggu';
      case 'accepted':
        return 'Diterima';
      case 'rejected':
        return 'Ditolak';
      case 'interview':
        return 'Interview';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-36 pb-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data lamaran...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-36 pb-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href="/siswa" className="text-blue-600 hover:underline">
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-36 pb-16">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            Lamaran Saya
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pantau status lamaran pekerjaan yang telah Anda kirim
          </p>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-lg border border-gray-200">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Belum ada lamaran
            </h3>
            <p className="text-gray-500 mb-6">
              Anda belum mengirim lamaran pekerjaan apapun
            </p>
            <Link
              href="/siswa/lowongan"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Cari Lowongan
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div
                key={application.id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  {/* Job Info */}
                  <div className="flex-1 mb-4 lg:mb-0">
                    <div className="flex items-start space-x-4">
                      {/* Company Logo */}
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        {application.jobPosting.companyProfile.logoPath ? (
                          <img
                            src={application.jobPosting.companyProfile.logoPath}
                            alt={application.jobPosting.companyProfile.companyName}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Building className="w-6 h-6 text-gray-400" />
                        )}
                      </div>

                      {/* Job Details */}
                      <div className="flex-1">
                        <Link
                          href={`/siswa/lowongan/${application.jobPosting.id}`}
                          className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {application.jobPosting.jobTitle}
                        </Link>
                        <p className="text-gray-600 font-medium">
                          {application.jobPosting.companyProfile.companyName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {application.jobPosting.companyProfile.industryType}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col lg:flex-row lg:items-center space-y-3 lg:space-y-0 lg:space-x-4">
                    {/* Status */}
                    <div className="text-center lg:text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                        {getStatusText(application.status)}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {application.lastStatusUpdate ? formatDate(application.lastStatusUpdate) : formatDate(application.applicationDate)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Link
                        href={`/siswa/lowongan/${application.jobPosting.id}`}
                        className="flex items-center px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                        title="Lihat Lowongan"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {application.status === 'PENDING' && (
                        <button
                          onClick={() => handleDeleteApplication(application.id)}
                          className="flex items-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                          title="Hapus Lamaran"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Dilamar: {formatDate(application.applicationDate)}
                      </span>
                      <span className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        CV: {application.studentCv.fileName}
                      </span>
                    </div>
                  </div>

                  {application.notes && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Catatan:</strong> {application.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;
