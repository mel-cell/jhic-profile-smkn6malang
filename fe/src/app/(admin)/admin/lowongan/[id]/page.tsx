'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building, MapPin, Calendar, DollarSign, Users, FileText, Edit2, Trash2, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { adminAPI } from '@/app/services/api';

interface JobDetail {
  id: string;
  jobTitle: string;
  description: string;
  requirements: string;
  location: string;
  salaryRange: string;
  employmentType: string;
  applicationDeadline: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  companyName: string;
  companyEmail: string;
  applicationsCount: number;
}

const AdminJobDetailPage: React.FC<{ params: { id: string } }> = ({ params }) => {
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');

        if (!token) {
          console.error('No auth token found');
          return;
        }

        // Fetch all job postings
        const jobsRes = await adminAPI.getAllJobPostings(token);
        const allJobs = jobsRes.data || [];
        const jobData = allJobs.find((j: any) => j.id === params.id);

        if (jobData) {
          // Transform job data
          const job: JobDetail = {
            id: jobData.id,
            jobTitle: jobData.jobTitle,
            description: jobData.description || '',
            requirements: jobData.requirements || '',
            location: jobData.location || '',
            salaryRange: jobData.salaryRange || '',
            employmentType: jobData.employmentType || '',
            applicationDeadline: jobData.applicationDeadline || '',
            status: jobData.status || 'PENDING',
            createdAt: jobData.createdAt || '',
            updatedAt: jobData.updatedAt || '',
            companyId: jobData.companyId,
            companyName: jobData.company?.companyName || 'Perusahaan tidak ditemukan',
            companyEmail: jobData.company?.email || '',
            applicationsCount: jobData._count?.applications || 0
          };
          setJob(job);
        }

        // Fetch applications for this job
        const applicationsRes = await adminAPI.getAllApplications(token);
        const allApplications = applicationsRes.data || [];
        const jobApplications = allApplications.filter((app: any) => app.jobId === params.id);
        setApplications(jobApplications);

      } catch (error) {
        console.error('Failed to fetch job details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchJobDetail();
    }
  }, [params.id]);

  const handleUpdateJobStatus = async (newStatus: string) => {
    if (!job) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Token tidak ditemukan. Silakan login kembali.');
        return;
      }

      await adminAPI.updateJobPostingStatus(job.id, newStatus, token);

      // Update local state
      setJob(prev => prev ? { ...prev, status: newStatus } : null);

      alert(`Status lowongan berhasil diubah menjadi ${newStatus === 'ACTIVE' ? 'Aktif' : newStatus === 'REJECTED' ? 'Ditolak' : 'Pending'}`);
    } catch (error) {
      console.error('Failed to update job status:', error);
      alert('Gagal mengubah status lowongan.');
    }
  };

  const handleDeleteJob = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus lowongan ini? Semua lamaran terkait akan hilang.')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Token tidak ditemukan. Silakan login kembali.');
        return;
      }

      // Note: We need to add deleteJobPosting method to adminAPI
      // For now, we'll use a placeholder
      alert('Fitur hapus lowongan akan diimplementasikan');
      // await adminAPI.deleteJobPosting(job.id, token);
      // window.location.href = '/admin/lowongan';
    } catch (error) {
      console.error('Failed to delete job:', error);
      alert('Gagal menghapus lowongan.');
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
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'EXPIRED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Aktif';
      case 'PENDING': return 'Menunggu Persetujuan';
      case 'REJECTED': return 'Ditolak';
      case 'EXPIRED': return 'Kadaluarsa';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat detail lowongan...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Lowongan tidak ditemukan</h2>
          <Link href="/admin/lowongan" className="text-blue-600 hover:underline">
            Kembali ke daftar lowongan
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'details', label: 'Detail Lowongan', icon: FileText },
    { id: 'applications', label: 'Lamaran', icon: Users }
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/lowongan"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Detail Lowongan</h1>
            <p className="text-gray-600 mt-1">{job.jobTitle}</p>
          </div>
        </div>

        <div className="flex space-x-3">
          {job.status === 'PENDING' && (
            <>
              <button
                onClick={() => handleUpdateJobStatus('ACTIVE')}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Setujui
              </button>
              <button
                onClick={() => handleUpdateJobStatus('REJECTED')}
                className="flex items-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Tolak
              </button>
            </>
          )}
          <Link
            href={`/admin/lowongan/edit/${job.id}`}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Link>
          <button
            onClick={handleDeleteJob}
            className="flex items-center bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Hapus
          </button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-6">
        <span className={`inline-block px-4 py-2 text-sm font-medium rounded-full ${getStatusColor(job.status)}`}>
          {getStatusText(job.status)}
        </span>
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
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Job Header */}
              <div className="border-b pb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{job.jobTitle}</h2>
                <div className="flex items-center text-gray-600 mb-4">
                  <Building className="w-5 h-5 mr-2" />
                  <span>{job.companyName}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <span>{job.location || 'Lokasi tidak ditentukan'}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                    <span>{job.salaryRange || 'Gaji tidak ditentukan'}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    <span>{job.employmentType || 'Tipe tidak ditentukan'}</span>
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Deskripsi Pekerjaan</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-line">{job.description || 'Deskripsi tidak tersedia'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Persyaratan</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-line">{job.requirements || 'Persyaratan tidak tersedia'}</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Perusahaan</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Building className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Nama Perusahaan</p>
                        <p className="font-medium">{job.companyName}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Email Perusahaan</p>
                        <p className="font-medium">{job.companyEmail}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Lowongan</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Deadline Lamaran</p>
                        <p className="font-medium">{job.applicationDeadline ? formatDate(job.applicationDeadline) : 'Tidak ada deadline'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Jumlah Lamaran</p>
                        <p className="font-medium">{job.applicationsCount} lamaran</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Dibuat pada</p>
                      <p className="font-medium">{formatDate(job.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Daftar Lamaran</h2>
                <span className="text-sm text-gray-600">{applications.length} lamaran diterima</span>
              </div>

              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{application.student?.fullName || 'Nama siswa tidak tersedia'}</h3>
                          <p className="text-sm text-gray-600">{application.student?.email || 'Email tidak tersedia'}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Melamar pada: {formatDate(application.appliedAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                            application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {application.status === 'pending' ? 'Menunggu' :
                             application.status === 'accepted' ? 'Diterima' :
                             application.status === 'rejected' ? 'Ditolak' : application.status}
                          </span>
                        </div>
                      </div>
                      {application.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                          <p className="text-sm text-gray-700"><strong>Catatan:</strong> {application.notes}</p>
                        </div>
                      )}
                      <div className="mt-3 flex justify-end">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          Lihat CV
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada lamaran</h3>
                  <p className="text-gray-600">Belum ada siswa yang melamar lowongan ini.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminJobDetailPage;
