'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Trophy, Calendar, User, Building, Edit2, Trash2, Search, Filter, Eye } from 'lucide-react';
import { adminAPI } from '@/app/services/api';

interface Prestasi {
  id: string;
  title: string;
  studentId: string;
  studentName: string;
  competitionLevel: string;
  organizer: string;
  date: string;
  imagePath?: string;
  createdAt: string;
}

const AdminPrestasiPage: React.FC = () => {
  const [prestasi, setPrestasi] = useState<Prestasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const competitionLevels = [
    { value: 'all', label: 'Semua Tingkat' },
    { value: 'kabupaten', label: 'Kabupaten' },
    { value: 'provinsi', label: 'Provinsi' },
    { value: 'nasional', label: 'Nasional' },
    { value: 'internasional', label: 'Internasional' }
  ];

  useEffect(() => {
    const fetchPrestasi = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');

        if (!token) {
          console.error('No auth token found');
          return;
        }

        // Fetch prestasi data - using mock data for now
        // TODO: Implement getAllPrestasi API
        const mockPrestasi: Prestasi[] = [
          {
            id: '1',
            title: 'Juara 1 Lomba Matematika Tingkat Kabupaten',
            studentId: '1',
            studentName: 'Ahmad Fauzi',
            competitionLevel: 'kabupaten',
            organizer: 'Dinas Pendidikan Kabupaten Malang',
            date: '2024-01-15',
            imagePath: '/prestasi1.jpg',
            createdAt: '2024-01-16T00:00:00Z'
          },
          {
            id: '2',
            title: 'Juara 2 Olimpiade Sains Nasional',
            studentId: '2',
            studentName: 'Siti Nurhaliza',
            competitionLevel: 'nasional',
            organizer: 'Kementerian Pendidikan dan Kebudayaan',
            date: '2024-01-10',
            imagePath: '/prestasi2.jpg',
            createdAt: '2024-01-11T00:00:00Z'
          },
          {
            id: '3',
            title: 'Juara 3 Lomba Karya Tulis Ilmiah Provinsi',
            studentId: '3',
            studentName: 'Budi Santoso',
            competitionLevel: 'provinsi',
            organizer: 'Universitas Negeri Malang',
            date: '2024-01-05',
            imagePath: '/prestasi3.jpg',
            createdAt: '2024-01-06T00:00:00Z'
          }
        ];

        setPrestasi(mockPrestasi);
      } catch (error) {
        console.error('Failed to fetch prestasi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrestasi();
  }, []);

  // Filter prestasi based on search and level
  const filteredPrestasi = prestasi.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.organizer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel = selectedLevel === 'all' || item.competitionLevel === selectedLevel;

    return matchesSearch && matchesLevel;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPrestasi.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPrestasi = filteredPrestasi.slice(startIndex, endIndex);

  const handleDeletePrestasi = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus prestasi ini?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Token tidak ditemukan. Silakan login kembali.');
        return;
      }

      // TODO: Implement deletePrestasi API
      // await adminAPI.deletePrestasi(id, token);

      setPrestasi(prev => prev.filter(item => item.id !== id));
      alert('Prestasi berhasil dihapus.');
    } catch (error) {
      console.error('Failed to delete prestasi:', error);
      alert('Gagal menghapus prestasi.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'kabupaten': return 'bg-blue-100 text-blue-800';
      case 'provinsi': return 'bg-green-100 text-green-800';
      case 'nasional': return 'bg-yellow-100 text-yellow-800';
      case 'internasional': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'kabupaten': return 'Kabupaten';
      case 'provinsi': return 'Provinsi';
      case 'nasional': return 'Nasional';
      case 'internasional': return 'Internasional';
      default: return level;
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data prestasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Prestasi</h1>
          <p className="text-gray-600 mt-1">Kelola data prestasi siswa</p>
        </div>
        <Link
          href="/admin/konten/prestasi/tambah"
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Prestasi
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari prestasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 pl-10 transition duration-150"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          {/* Level Filter */}
          <div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
            >
              {competitionLevels.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>

          {/* Placeholder for additional filters */}
          <div></div>
        </div>
      </div>

      {/* Prestasi List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {currentPrestasi.length > 0 ? (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b font-semibold text-gray-700">
              <div className="col-span-4">Prestasi</div>
              <div className="col-span-2">Siswa</div>
              <div className="col-span-2">Tingkat</div>
              <div className="col-span-2">Tanggal</div>
              <div className="col-span-2">Aksi</div>
            </div>

            {/* Table Body */}
            {currentPrestasi.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 transition-colors">
                <div className="col-span-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {item.imagePath ? (
                        <img src={item.imagePath} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                      <p className="text-xs text-gray-500 truncate">{item.organizer}</p>
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{item.studentName}</span>
                  </div>
                </div>

                <div className="col-span-2">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(item.competitionLevel)}`}>
                    {getLevelLabel(item.competitionLevel)}
                  </span>
                </div>

                <div className="col-span-2">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{formatDate(item.date)}</span>
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/konten/prestasi/${item.id}`}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Lihat detail"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/konten/prestasi/edit/${item.id}`}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeletePrestasi(item.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="text-center py-12">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada data prestasi</h3>
            <p className="text-gray-600 mb-4">Belum ada prestasi yang ditambahkan</p>
            <Link
              href="/admin/konten/prestasi/tambah"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Prestasi Pertama
            </Link>
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
          <div className="text-2xl font-bold text-blue-600">{prestasi.length}</div>
          <div className="text-sm text-gray-600">Total Prestasi</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-green-600">
            {prestasi.filter(p => p.competitionLevel === 'kabupaten').length}
          </div>
          <div className="text-sm text-gray-600">Kabupaten</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {prestasi.filter(p => p.competitionLevel === 'provinsi').length}
          </div>
          <div className="text-sm text-gray-600">Provinsi</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-purple-600">
            {prestasi.filter(p => p.competitionLevel === 'nasional' || p.competitionLevel === 'internasional').length}
          </div>
          <div className="text-sm text-gray-600">Nasional+</div>
        </div>
      </div>
    </div>
  );
};

export default AdminPrestasiPage;
