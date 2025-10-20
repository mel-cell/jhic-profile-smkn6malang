'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, User, Briefcase, FileText, Activity, Search, Filter, Download, Eye } from 'lucide-react';
import { adminAPI } from '@/app/services/api';

// Activity types for filtering
const ACTIVITY_TYPES = [
  { value: 'all', label: 'Semua Aktivitas', icon: Activity },
  { value: 'user', label: 'Aktivitas User', icon: User },
  { value: 'job', label: 'Lowongan Kerja', icon: Briefcase },
  { value: 'application', label: 'Lamaran', icon: FileText },
  { value: 'news', label: 'Berita', icon: Calendar }
];

// Mock activity data - in real app this would come from API
const mockActivities = [
  {
    id: 1,
    type: 'job',
    action: 'created',
    description: 'Industri PT. Honda membuat lowongan baru "Software Engineer"',
    user: 'PT. Honda',
    timestamp: '2024-01-15T10:30:00Z',
    status: 'pending',
    details: { jobTitle: 'Software Engineer', companyId: 1 }
  },
  {
    id: 2,
    type: 'application',
    action: 'submitted',
    description: 'Siswa Ahmad Fauzi mengajukan lamaran ke lowongan "Web Developer"',
    user: 'Ahmad Fauzi',
    timestamp: '2024-01-15T09:15:00Z',
    status: 'success',
    details: { studentId: 1, jobId: 2 }
  },
  {
    id: 3,
    type: 'user',
    action: 'registered',
    description: 'Industri baru CV. Sekawan Media mendaftar ke platform',
    user: 'CV. Sekawan Media',
    timestamp: '2024-01-14T16:45:00Z',
    status: 'success',
    details: { userId: 3, role: 'COMPANY' }
  },
  {
    id: 4,
    type: 'job',
    action: 'approved',
    description: 'Admin menyetujui lowongan "Data Analyst" dari PT. Venturo',
    user: 'Admin',
    timestamp: '2024-01-14T14:20:00Z',
    status: 'success',
    details: { jobId: 3, approvedBy: 'admin' }
  },
  {
    id: 5,
    type: 'application',
    action: 'reviewed',
    description: 'PT. Honda meninjau lamaran siswa dari jurusan RPL',
    user: 'PT. Honda',
    timestamp: '2024-01-14T11:30:00Z',
    status: 'info',
    details: { applicationsCount: 5, jobId: 1 }
  }
];

const ActivityCard = ({ activity }: { activity: any }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return <User className="w-5 h-5" />;
      case 'job': return <Briefcase className="w-5 h-5" />;
      case 'application': return <FileText className="w-5 h-5" />;
      case 'news': return <Calendar className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'border-green-500 bg-green-50';
      case 'pending': return 'border-yellow-500 bg-yellow-50';
      case 'error': return 'border-red-500 bg-red-50';
      case 'info': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('id-ID'),
      time: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const { date, time } = formatDate(activity.timestamp);

  return (
    <div className={`p-4 rounded-lg border-l-4 ${getStatusColor(activity.status)} bg-white shadow-sm border`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-full ${activity.status === 'success' ? 'bg-green-100 text-green-600' :
            activity.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
            activity.status === 'error' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{activity.description}</p>
            <p className="text-xs text-gray-500 mt-1">Oleh: {activity.user}</p>
            <div className="flex items-center mt-2 text-xs text-gray-400">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{date} pukul {time}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            activity.status === 'success' ? 'bg-green-100 text-green-700' :
            activity.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
            activity.status === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {activity.status === 'success' ? 'Berhasil' :
             activity.status === 'pending' ? 'Menunggu' :
             activity.status === 'error' ? 'Gagal' : 'Info'}
          </span>
          <button className="p-1 text-gray-400 hover:text-gray-600" title="Lihat detail">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminRiwayatPage: React.FC = () => {
  const [activities, setActivities] = useState(mockActivities);
  const [filteredActivities, setFilteredActivities] = useState(mockActivities);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter activities based on search and filters
  useEffect(() => {
    let filtered = activities;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.user.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(activity => activity.type === selectedType);
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(activity => activity.status === selectedStatus);
    }

    setFilteredActivities(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [activities, searchTerm, selectedType, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActivities = filteredActivities.slice(startIndex, endIndex);

  // Fetch real activity data (placeholder for future API integration)
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        // TODO: Implement API call to fetch activity logs
        // const response = await adminAPI.getActivityLogs(token);
        // setActivities(response.data);

        // For now, use mock data
        setTimeout(() => {
          setActivities(mockActivities);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const handleExport = () => {
    // TODO: Implement export functionality
    alert('Fitur export akan diimplementasikan');
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat riwayat aktivitas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Riwayat Aktivitas</h1>
          <p className="text-gray-600 mt-1">Pantau semua aktivitas di platform</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari aktivitas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 pl-10 transition duration-150"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
            >
              {ACTIVITY_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Semua Status</option>
              <option value="success">Berhasil</option>
              <option value="pending">Menunggu</option>
              <option value="error">Gagal</option>
              <option value="info">Info</option>
            </select>
          </div>

          {/* Date Range (placeholder) */}
          <div>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Pilih tanggal"
            />
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {currentActivities.length > 0 ? (
          currentActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada aktivitas ditemukan</h3>
            <p className="text-gray-500">Coba ubah filter pencarian atau tanggal</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            Sebelumnya
          </button>

          <div className="flex space-x-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            Selanjutnya
          </button>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-blue-600">{activities.length}</div>
          <div className="text-sm text-gray-600">Total Aktivitas</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-green-600">
            {activities.filter(a => a.status === 'success').length}
          </div>
          <div className="text-sm text-gray-600">Berhasil</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {activities.filter(a => a.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-600">Menunggu</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-red-600">
            {activities.filter(a => a.status === 'error').length}
          </div>
          <div className="text-sm text-gray-600">Gagal</div>
        </div>
      </div>
    </div>
  );
};

export default AdminRiwayatPage;
