"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, Download, Edit, Trash2, ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { studentsAPI } from "@/app/services/api";

interface CvData {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadedAt: string;
}

const CvManagementPage: React.FC = () => {
  const [cvs, setCvs] = useState<CvData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCvs();
  }, []);

  const fetchCvs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Token tidak ditemukan. Silakan login terlebih dahulu.");
        return;
      }

      const response = await studentsAPI.getCvs(token);
      if (response.success) {
        setCvs(response.data);
      } else {
        setError("Gagal memuat CV");
      }
    } catch (err: any) {
      console.error("Error fetching CVs:", err);
      setError("Gagal memuat CV");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cvId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus CV ini?")) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Token tidak ditemukan. Silakan login terlebih dahulu.");
        return;
      }

      const response = await studentsAPI.deleteCv(cvId, token);
      if (response.success) {
        fetchCvs(); // Refresh the list
      } else {
        setError("Gagal menghapus CV");
      }
    } catch (err: any) {
      console.error("Error deleting CV:", err);
      setError("Gagal menghapus CV");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pb-16 pt-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat CV...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white pb-16 pt-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href="/siswa/profile" className="text-blue-600 hover:underline">
              Kembali ke Profil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-16 pt-50">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              href="/siswa/profile"
              className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Kembali ke Profil
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Kelola CV</h1>
          </div>
          <Link
            href="/siswa/cv/pengajuan"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Unggah CV Baru
          </Link>
        </div>

        {/* CV List */}
        {cvs.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Belum ada CV</h2>
            <p className="text-gray-500 mb-4">Unggah CV pertama Anda untuk memulai</p>
            <Link
              href="/siswa/cv/pengajuan"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Unggah CV
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cvs.map((cv) => (
              <div key={cv.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <FileText className="w-10 h-10 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{cv.fileName}</h3>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span>{formatFileSize(cv.fileSize)}</span>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(cv.uploadedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem("authToken");
                          if (!token) return;
                          const response = await studentsAPI.getCvFile(cv.fileName, token, false);
                          const blob = await response.blob();
                          const url = URL.createObjectURL(blob);
                          window.open(url, '_blank');
                        } catch (error) {
                          console.error('Error viewing CV:', error);
                        }
                      }}
                      className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Lihat
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem("authToken");
                          if (!token) return;
                          const response = await studentsAPI.getCvFile(cv.fileName, token, true);
                          const blob = await response.blob();
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = cv.fileName;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        } catch (error) {
                          console.error('Error downloading CV:', error);
                        }
                      }}
                      className="flex items-center px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Unduh
                    </button>
                    <Link
                      href="/siswa/cv/pengajuan"
                      className="flex items-center px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Ganti
                    </Link>
                    <button
                      onClick={() => handleDelete(cv.id)}
                      className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CvManagementPage;
