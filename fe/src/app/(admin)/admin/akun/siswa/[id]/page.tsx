"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  GraduationCap,
  Edit2,
  Trash2,
  FileText,
  Briefcase,
} from "lucide-react";
import { adminAPI } from "@/app/services/api";


interface StudentDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  nisn: string;
  birthdate: string;
  address: string;
  class: string;
  major: string;
  image?: string;
  cv?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const AdminStudentDetailPage: React.FC<{ params: { id: string } }> = ({
  params,
}) => {
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchStudentDetail = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");

        if (!token) {
          console.error("No auth token found");
          return;
        }

        // Fetch student details
        const studentRes = await adminAPI.getAllUsers(token);
        const allUsers = studentRes.data || [];
        const studentData = allUsers.find((user: any) => user.id === params.id && user.role === 'STUDENT');

        if (studentData) {
          // Transform user data to student format
          const student: StudentDetail = {
            id: studentData.id,
            name: studentData.fullName || studentData.name || 'Nama tidak tersedia',
            email: studentData.email,
            phone: studentData.phoneNumber || '',
            nisn: studentData.nis || '',
            birthdate: studentData.birthDate || '',
            address: studentData.address || '',
            class: studentData.class || '',
            major: studentData.major || '',
            image: studentData.profilePhotoPath || '',
            cv: '', // CV would need separate API call
            status: studentData.status || 'active',
            createdAt: studentData.createdAt || '',
            updatedAt: studentData.updatedAt || ''
          };
          setStudent(student);
        }

        // Fetch student's applications
        const applicationsRes = await adminAPI.getAllApplications(token);
        const allApplications = applicationsRes.data || [];
        const studentApplications = allApplications.filter((app: any) => app.studentId === params.id);
        setApplications(studentApplications);
      } catch (error) {
        console.error("Failed to fetch student details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchStudentDetail();
    }
  }, [params.id]);

  const handleDeleteStudent = async () => {
    if (
      !confirm(
        "Apakah Anda yakin ingin menghapus siswa ini? Semua data terkait akan hilang."
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Token tidak ditemukan. Silakan login kembali.");
        return;
      }

      await adminAPI.deleteUser(params.id, token);
      alert("Siswa berhasil dihapus.");
      window.location.href = "/admin/akun/siswa";
    } catch (error) {
      console.error("Failed to delete student:", error);
      alert("Gagal menghapus siswa.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat detail siswa...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Siswa tidak ditemukan
          </h2>
          <Link
            href="/admin/akun/siswa"
            className="text-blue-600 hover:underline"
          >
            Kembali ke daftar siswa
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "applications", label: "Lamaran", icon: FileText },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/akun/siswa"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Detail Siswa</h1>
            <p className="text-gray-600 mt-1">{student.name}</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <Link
            href={`/admin/akun/siswa/edit/${student.id}`}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Link>
          <button
            onClick={handleDeleteStudent}
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
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200">
                  {student.image ? (
                    <img
                      src={student.image}
                      alt={student.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {student.name}
                  </h2>
                  <p className="text-gray-600">
                    {student.class} - {student.major}
                  </p>
                  <span
                    className={`inline-block px-3 py-1 text-sm font-medium rounded-full mt-2 ${getStatusColor(
                      student.status
                    )}`}
                  >
                    {student.status}
                  </span>
                </div>
              </div>

              {/* Profile Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Informasi Pribadi
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Telepon</p>
                          <p className="font-medium">
                            {student.phone || "Tidak ada"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Tanggal Lahir</p>
                          <p className="font-medium">
                            {formatDate(student.birthdate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className className="text-sm text-gray-600">Alamat</p>
                          <p className="font-medium">
                            {student.address || "Tidak ada"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Informasi Akademik
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <GraduationCap className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">NISN</p>
                          <p className="font-medium">{student.nisn}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Kelas</p>
                          <p className="font-medium">{student.class}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Jurusan</p>
                          <p className="font-medium">{student.major}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Informasi Akun
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Bergabung sejak</p>
                        <p className="font-medium">
                          {formatDate(student.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          Terakhir diperbarui
                        </p>
                        <p className="font-medium">
                          {formatDate(student.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CV Section */}
              {student.cv && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    CV Siswa
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <a
                      href={student.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      Lihat CV Siswa
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === "applications" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Riwayat Lamaran
              </h2>

              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div
                      key={application.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {application.jobTitle}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {application.companyName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Dilamar pada: {formatDate(application.appliedAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                              application.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : application.status === "accepted"
                                ? "bg-green-100 text-green-800"
                                : application.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {application.status === "pending"
                              ? "Menunggu"
                              : application.status === "accepted"
                              ? "Diterima"
                              : application.status === "rejected"
                              ? "Ditolak"
                              : application.status}
                          </span>
                        </div>
                      </div>
                      {application.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                          <p className="text-sm text-gray-700">
                            {application.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Belum ada lamaran
                  </h3>
                  <p className="text-gray-600">
                    Siswa ini belum mengajukan lamaran ke lowongan manapun.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStudentDetailPage;