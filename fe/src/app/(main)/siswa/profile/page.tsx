// File: src/app/siswa/profile/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, User, Calendar, Trash, Maximize2, FileText, Edit, Download, Eye } from "lucide-react";
import { authAPI, API_BASE_URL } from "@/app/services/api";
import { studentsAPI } from "@/app/services/api";

interface StudentProfile {
    fullName: string;
    nis?: string;
    major?: string;
    address?: string;
    phoneNumber?: string;
    description?: string;
    profilePhotoPath?: string;
    email?: string;
    gender?: string;
    birthDate?: string;
    skills?: string;
    role?: string;
    createdAt?: string;
}

interface CvData {
    id: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    uploadedAt: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [cvs, setCvs] = useState<CvData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileAndCvs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Token tidak ditemukan. Silakan login terlebih dahulu.");
          return;
        }

        // Fetch profile
        const profileResponse = await studentsAPI.getProfile(token);
        if (profileResponse.success) {
          setProfile(profileResponse.data);
        } else {
          setError("Gagal memuat profil");
          return;
        }

        // Fetch CVs
        const cvsResponse = await studentsAPI.getCvs(token);
        if (cvsResponse.success) {
          setCvs(cvsResponse.data);
        } else {
          // CVs are optional, don't set error
          setCvs([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndCvs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pb-16 pt-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat profil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-white pb-16 pt-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600 mb-4">
              {error || "Profil tidak ditemukan"}
            </p>
            <Link href="/siswa" className="text-blue-600 hover:underline">
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- Komponen Kartu Portofolio ---
  const PortfolioCard = ({ item }: { item: CvData | { placeholder: boolean } }) => {
    if ('placeholder' in item && item.placeholder) {
      return (
        <Link href="/siswa/cv/pengajuan">
          <div className="w-full min-h-[250px] flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <span className="text-7xl text-gray-400">+</span>
          </div>
        </Link>
      );
    }

    const cv = item as CvData;
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
        month: 'short',
        day: 'numeric'
      });
    };

    return (
      <div className="w-full min-h-[250px] p-6 border border-gray-200 rounded-xl shadow-sm relative transition-shadow hover:shadow-md">
        <div className="flex justify-between items-start mb-4">
          {/* Icon File */}
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
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
              className="w-8 h-8 flex items-center justify-center cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
              title="Lihat CV"
            >
              <Eye className="w-5 h-5" />
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
              className="w-8 h-8 flex items-center justify-center cursor-pointer text-green-600 hover:text-green-800 transition-colors"
              title="Unduh CV"
            >
              <Download className="w-5 h-5" />
            </button>
            <Link
              href="/siswa/cv/pengajuan"
              className="w-8 h-8 flex items-center justify-center cursor-pointer text-green-600 hover:text-green-800 transition-colors"
              title="Ganti CV"
            >
              <Edit className="w-5 h-5" />
            </Link>
            <Link
              href="/siswa/cv"
              className="w-8 h-8 flex items-center justify-center cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
              title="Kelola CV"
            >
              <Maximize2 className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900 truncate">{cv.fileName}</h4>
          <p className="text-sm text-gray-600">{formatFileSize(cv.fileSize)}</p>
          <p className="text-xs text-gray-500">Diunggah: {formatDate(cv.uploadedAt)}</p>
        </div>

        {/* Download Button */}
        <div className="absolute bottom-4 right-4">
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
            className="flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-3 h-3 mr-1" />
            Unduh
          </button>
        </div>
      </div>
    );
  };

  return (
    // Wrapper Utama: Diberi padding atas (pt-16) untuk ruang dari header
    <div className="min-h-screen bg-white pb-16 pt-50">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Kontainer Utama Profil */}
        <div className="relative flex flex-col lg:flex-row gap-10  bg-white">
          {/* === SIDEBAR BIRU (INFO PROFIL & KONTAK) === */}
          <div
            className="w-full lg:w-[350px] pt-40  bg-blue-600 p-8 relative flex flex-col items-center lg:items-start text-white shadow-xl"
            style={{
              // Bentuk melengkung persis di kanan bawah
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
              borderRadius: "180px 180px 0 100px",
            }}
          >
            {/* Wrapper Foto dan Kelas */}
            <div className="absolute top-[-1px] left-1/2 transform -translate-x-1/2 w-full h-[40%]">
              {/* Outer Border Putih untuk ruang antara sidebar dan foto */}
              <div className="w-full h-full p-2 bg-white rounded-full shadow-lg">
                                {/* Foto Profil dengan Border Hitam Tebal */}
                                <div className="relative w-full h-full border-4 border-black rounded-full overflow-hidden bg-white flex items-center justify-center">
                                    {profile.profilePhotoPath ? (
                                        <Image
                                            src={profile.profilePhotoPath}
                                            alt="Profile"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <span className="text-2xl font-bold text-blue-600">
                                            {profile.fullName.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
              </div>

              {/* Kelas (Kotak Hijau di Bawah Foto) */}
              <div className="absolute bottom-[-5px] left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                {profile.major || "Jurusan belum diisi"}
              </div>
            </div>

            {/* Detail Kontak (diberi padding atas agar tidak tertutup foto) */}
            <div className="w-full space-y-4 pt-[80%] text-sm ">
              {/* NIS */}
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-white" />
                <span className="font-semibold">{profile.nis || "NIS belum diisi"}</span>
              </div>
              {/* Email */}
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-white" />
                <span className="font-semibold">{profile.email || "Email belum diisi"}</span>
              </div>
              {/* Lokasi */}
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-white" />
                <span>{profile.address || "Alamat belum diisi"}</span>
              </div>
              {/* Jenis Kelamin */}
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-white" />
                <span>{profile.gender || "Jenis kelamin belum diisi"}</span>
              </div>
              {/* Tanggal Lahir */}
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-white" />
                <span>{profile.birthDate ? new Date(profile.birthDate).toLocaleDateString('id-ID') : "Tanggal lahir belum diisi"}</span>
              </div>
            </div>

            {/* Social Media Icons - Hidden for now since not in API */}
            <div className="mt-6 flex space-x-5 text-white opacity-50">
              {/* Placeholder icons */}
              <div className="w-6 h-6 bg-white/20 rounded"></div>
              <div className="w-6 h-6 bg-white/20 rounded"></div>
              <div className="w-6 h-6 bg-white/20 rounded"></div>
            </div>
          </div>

          {/* === KONTEN UTAMA === */}
          <div className="lg:flex-1 p-8 lg:p-12 space-y-8 relative">

            {/* Nama, Edit Profile, Status */}
            <div className="pt-2">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-3xl font-extrabold text-gray-800">
                  {profile.fullName}
                </h2>
                {/* Tombol Edit Profile */}
                <Link
                  href="/siswa/profile/edit"
                  className="text-xs text-white bg-orange-500 font-semibold px-3 py-1 rounded-full hover:bg-orange-700 transition-colors"
                >
                  Edit profile
                </Link>

                <Link
                  href="/siswa/cv/pengajuan"
                  className="text-xs text-white bg-orange-500 font-semibold px-3 py-1 rounded-full hover:bg-orange-700 transition-colors"
                >
                  Tambah CV
                </Link>
              </div>

              <p className="text-sm text-gray-600 max-w-xl mb-4">
                {profile.description || "Deskripsi belum diisi"}
              </p>

              {/* Status Online (Dibuat sebagai tag) */}
              <div className="flex items-center text-green-600 text-sm font-semibold space-x-4">
                <div className="flex items-center space-x-2 bg-green-100/70 text-green-700 px-3 py-1 rounded-full border border-green-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Online</span>
                </div>
              </div>
            </div>

            {/* Keahlian */}
            <div className="border-t border-gray-300 pt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Keahlian</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills ? (
                  profile.skills.split(',').map((skill: string, index: number) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {skill.trim()}
                    </span>
                  ))
                ) : (
                  <span className="text-base text-gray-500">Keahlian belum diisi</span>
                )}
              </div>
            </div>

            {/* Portofolio Saya */}
            <div className="border-t border-gray-300 pt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Portofolio saya
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cvs.length > 0 ? (
                  <PortfolioCard item={cvs[0]} />
                ) : (
                  <PortfolioCard item={{ placeholder: true }} />
                )}
              </div>

              {/* Link to CV Management */}
              {cvs.length > 0 && (
                <div className="flex justify-end mt-6">
                  <Link
                    href="/siswa/cv"
                    className="flex items-center text-orange-500 hover:text-orange-700 transition-colors"
                  >
                    <span className="mr-2">Kelola CV</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
