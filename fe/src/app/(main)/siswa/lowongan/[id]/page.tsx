// File: src/app/siswa/lowongan/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { jobsAPI, applicationsAPI, studentsAPI } from "@/app/services/api";

// No dummy data - using API only

// Removed static dummy data - now using API for similar jobs

const DetailLowonganPage: React.FC = () => {
  const params = useParams();
  const [lowongan, setLowongan] = useState<any>(null);
  const [similarJobs, setSimilarJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [cvs, setCvs] = useState<any[]>([]);
  const [selectedCvId, setSelectedCvId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [hasCvs, setHasCvs] = useState(false);
  const [quickApplying, setQuickApplying] = useState(false);
  const [latestCv, setLatestCv] = useState<any>(null);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const id = params.id as string;
        if (!id) {
          setError("ID lowongan tidak valid");
          setLoading(false);
          return;
        }

        // Check if user has already applied and fetch CVs
        const token = localStorage.getItem("authToken");
        if (token) {
          try {
            const applicationsResponse =
              await applicationsAPI.getMyApplications(token);
            if (applicationsResponse.success) {
              const hasAppliedToThisJob = applicationsResponse.data.some(
                (app: any) => app.jobPosting.id === id
              );
              setHasApplied(hasAppliedToThisJob);
            }
          } catch (error) {
            console.error("Failed to check application status:", error);
          }

          // Fetch CVs to check if user has any and get the latest one
          try {
            const cvResponse = await studentsAPI.getCvs(token);
            if (cvResponse.success) {
              const cvList = cvResponse.data || [];
              setHasCvs(cvList.length > 0);
              if (cvList.length > 0) {
                // Sort by uploadedAt to get the latest CV
                const sortedCvs = cvList.sort((a: any, b: any) =>
                  new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
                );
                setLatestCv(sortedCvs[0]);
              }
            }
          } catch (error) {
            console.error("Failed to fetch CVs:", error);
          }
        }

        const [jobResponse, similarResponse] = await Promise.all([
          jobsAPI.getById(id),
          jobsAPI.getSimilar(id, 5),
        ]);

        if (jobResponse.success) {
          // Transform API data to match component structure
          const jobData = jobResponse.data;
          setLowongan({
            id: jobData.id,
            perusahaan: jobData.companyProfile?.companyName || "Perusahaan",
            alamat: jobData.location || "Malang",
            posisi: jobData.jobTitle,
            deskripsi: jobData.description || "Deskripsi tidak tersedia",
            bidangPekerjaan:
              jobData.companyProfile?.industryType || "Bidang Pekerjaan",
            jenisPekerjaan: jobData.employmentType || "Full Time",
            jenisKelamin: "Laki-laki & Perempuan",
            gaji: jobData.salaryRange || "N/A",
            tipePembayaran: "Remote / WFH",
            jumlahOrang: "1 orang",
            kualifikasi: jobData.requirements
              ? jobData.requirements.split("\n")
              : ["Kualifikasi tidak tersedia"],
          });
        } else {
          setError("Gagal memuat data lowongan");
        }

        if (similarResponse.success) {
          setSimilarJobs(similarResponse.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch job detail:", error);
        setError("Gagal memuat data lowongan");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [params.id]);

  const fetchStudentCvs = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Anda belum login. Silakan login terlebih dahulu.");
        return;
      }

      const response = await studentsAPI.getCvs(token);
      if (response.success) {
        const cvList = response.data || [];
        setCvs(cvList);

        if (cvList.length === 0) {
          alert(
            "Anda belum memiliki CV. Silakan buat CV terlebih dahulu sebelum melamar."
          );
          setShowApplyModal(false);
          // Could redirect to CV creation page here
          return;
        }

        if (cvList.length > 0) {
          setSelectedCvId(cvList[0].id);
        }
      } else {
        alert("Gagal memuat data CV. Silakan coba lagi.");
        setShowApplyModal(false);
      }
    } catch (error) {
      console.error("Failed to fetch CVs:", error);
      alert("Terjadi kesalahan saat memuat CV. Silakan coba lagi.");
      setShowApplyModal(false);
    }
  };

  const handleQuickApply = async () => {
    if (!latestCv?.id) {
      alert("Tidak ada CV yang tersedia untuk quick apply. Silakan buat CV terlebih dahulu.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Anda belum login. Silakan login terlebih dahulu.");
      return;
    }

    const jobId = params.id as string;
    if (!jobId) {
      alert("ID lowongan tidak valid");
      return;
    }

    try {
      setQuickApplying(true);

      // Check if student has already applied
      const applicationsResponse = await applicationsAPI.getMyApplications(token);
      if (applicationsResponse.success) {
        const hasAppliedToThisJob = applicationsResponse.data.some(
          (app: any) => app.jobPosting.id === jobId
        );
        if (hasAppliedToThisJob) {
          alert("Anda sudah melamar untuk lowongan ini.");
          setHasApplied(true);
          return;
        }
      }

      // Proceed with quick application using latest CV
      const response = await applicationsAPI.apply(
        jobId,
        { studentCvId: latestCv.id },
        token
      );

      if (response.success) {
        alert("Lamaran berhasil dikirim dengan CV terbaru! Anda akan menerima notifikasi jika ada update status.");
        setHasApplied(true);
      } else {
        const errorMessage = response.error || "Unknown error";
        if (errorMessage.includes("already applied")) {
          alert("Anda sudah melamar untuk lowongan ini.");
          setHasApplied(true);
        } else if (errorMessage.includes("CV not found")) {
          alert("CV yang dipilih tidak valid. Silakan pilih CV lain.");
          setLatestCv(null);
          setHasCvs(false);
        } else if (errorMessage.includes("Job posting is not approved")) {
          alert("Lowongan ini belum disetujui.");
        } else if (errorMessage.includes("Student profile not found")) {
          alert("Profil siswa tidak ditemukan. Silakan lengkapi profil terlebih dahulu.");
        } else {
          alert("Gagal mengirim lamaran: " + errorMessage);
        }
      }
    } catch (error: any) {
      console.error("Failed to quick apply:", error);
      if (error.message?.includes("fetch")) {
        alert("Koneksi internet bermasalah. Silakan coba lagi.");
      } else if (error.message?.includes("401")) {
        alert("Sesi login telah berakhir. Silakan login kembali.");
        localStorage.removeItem("authToken");
      } else {
        alert("Terjadi kesalahan: " + (error?.error || error?.message || "Unknown error"));
      }
    } finally {
      setQuickApplying(false);
    }
  };

  const handleApply = async () => {
    // Check if CV is selected
    if (!selectedCvId) {
      alert("Silakan pilih CV terlebih dahulu");
      return;
    }

    // Check if user is logged in
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Anda belum login. Silakan login terlebih dahulu.");
      return;
    }

    // Check if job ID is valid
    const jobId = params.id as string;
    if (!jobId) {
      alert("ID lowongan tidak valid");
      return;
    }

    try {
      setApplying(true);

      // First, verify that the student has a profile and CVs
      const profileResponse = await studentsAPI.getProfile(token);
      if (!profileResponse.success) {
        alert(
          "Gagal memuat profil siswa. Pastikan Anda sudah melengkapi profil."
        );
        return;
      }

      // Check if CV still exists and belongs to user
      const cvResponse = await studentsAPI.getCvs(token);
      if (!cvResponse.success) {
        alert("Gagal memuat data CV. Silakan coba lagi.");
        return;
      }

      const selectedCv = cvResponse.data.find(
        (cv: any) => cv.id === selectedCvId
      );
      if (!selectedCv) {
        alert("CV yang dipilih tidak ditemukan. Silakan pilih CV yang valid.");
        setSelectedCvId("");
        return;
      }

      // Check if student has already applied
      const applicationsResponse = await applicationsAPI.getMyApplications(
        token
      );
      if (applicationsResponse.success) {
        const hasAppliedToThisJob = applicationsResponse.data.some(
          (app: any) => app.jobPosting.id === jobId
        );
        if (hasAppliedToThisJob) {
          alert("Anda sudah melamar untuk lowongan ini.");
          setHasApplied(true);
          setShowApplyModal(false);
          return;
        }
      }

      // Proceed with application
      const response = await applicationsAPI.apply(
        jobId,
        {
          studentCvId: selectedCvId,
          notes: notes.trim() || undefined,
        },
        token
      );

      if (response.success) {
        alert(
          "Lamaran berhasil dikirim! Anda akan menerima notifikasi jika ada update status."
        );
        setShowApplyModal(false);
        setNotes("");
        setHasApplied(true);
      } else {
        const errorMessage = response.error || "Unknown error";
        if (errorMessage.includes("already applied")) {
          alert("Anda sudah melamar untuk lowongan ini.");
          setHasApplied(true);
        } else if (errorMessage.includes("CV not found")) {
          alert("CV yang dipilih tidak valid. Silakan pilih CV lain.");
          setSelectedCvId("");
        } else if (errorMessage.includes("Job posting is not approved")) {
          alert("Lowongan ini belum disetujui.");
        } else if (errorMessage.includes("Student profile not found")) {
          alert("Profil siswa tidak ditemukan. Silakan lengkapi profil terlebih dahulu.");
        } else {
          alert("Gagal mengirim lamaran: " + errorMessage);
        }
      }
    } catch (error: any) {
      console.error("Failed to apply:", error);

      // Handle network or other errors
      if (error.message?.includes("fetch")) {
        alert("Koneksi internet bermasalah. Silakan coba lagi.");
      } else if (error.message?.includes("401")) {
        alert("Sesi login telah berakhir. Silakan login kembali.");
        localStorage.removeItem("authToken");
        // Redirect to login if needed
      } else if (error.message?.includes("403")) {
        alert("Anda tidak memiliki izin untuk melamar lowongan ini.");
      } else if (error.message?.includes("404")) {
        alert("Lowongan tidak ditemukan.");
      } else {
        alert(
          "Terjadi kesalahan: " +
            (error?.error || error?.message || "Unknown error")
        );
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8 pb-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat detail lowongan...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8 pb-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-red-600">Error..</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link
              href="/siswa/lowongan"
              className="mt-6 inline-block text-blue-600 hover:underline"
            >
              &larr; Kembali ke Daftar Lowongan
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!lowongan) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8 pb-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-red-600">
              Lowongan Tidak Ditemukan 
            </h1>
            <Link
              href="/siswa/lowongan"
              className="mt-6 inline-block text-blue-600 hover:underline"
            >
              &larr; Kembali ke Daftar Lowongan
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- Komponen Kartu Informasi Kecil (Gaji, Bidang, dll) ---
  // Dibuat lebih tipis sesuai desain, menggunakan list-style
  const DetailInfoRow = ({
    title,
    value,
  }: {
    title: string;
    value: string;
  }) => (
    <div className="flex flex-col flex-1 min-w-[150px]">
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <p className="text-sm font-bold text-gray-800">{value}</p>
    </div>
  );

  // --- Komponen Kartu Lowongan Lain ---
  const LowonganLainCard = ({ lowongan }: { lowongan: any }) => (
    <div className="border border-gray-200 rounded-lg p-3 space-y-2 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-2">
        {/* Placeholder Logo Perusahaan */}
        <div className="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0"></div>
        <p className="text-xs text-gray-600 font-medium truncate">
          {lowongan.perusahaan}
        </p>
      </div>

      <h4 className="text-sm font-bold text-gray-800 line-clamp-2">
        {lowongan.posisi}
      </h4>

      <div className="flex flex-wrap gap-1">
        {lowongan.tipe.slice(0, 2).map((t: string, i: number) => (
          <span
            key={i}
            className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[9px] font-medium"
          >
            {t}
          </span>
        ))}
      </div>

      <p className="text-xs text-green-600 font-semibold">{lowongan.gaji}</p>

      <Link href={`/siswa/lowongan/${lowongan.id}`}>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 rounded text-xs transition-colors">
          Lihat Detail
        </button>
      </Link>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-white pb-16 animate-page-load-in">
        <div className="container mx-auto px-6 max-w-7xl pt-35">
          {" "}
          {/* Padding atas disesuaikan */}
          {/* Tombol Kembali */}
          <Link
            href="/siswa/lowongan"
            className="text-red-600 hover:text-red-800 font-medium mb-8 inline-block"
          >
            &larr;Kembali
          </Link>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Kolom KONTEN UTAMA (Detail Lowongan) */}
            <div className="w-full lg:w-3/4 p-10 bg-white rounded-xl shadow-lg border-2 border-gray-100 animate-fade-in-up">
              {/* Header Perusahaan & Posisi */}
              <div className="flex items-start space-x-6 pb-6 mb-4">
                {/* Logo Perusahaan (Kotak) */}
                <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl flex-shrink-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {lowongan.perusahaan.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-600">
                    {lowongan.perusahaan}
                  </h3>
                  <p className="text-sm text-gray-400 flex items-center">
                    <span className="w-3 h-3 mr-1">📍</span>
                    {lowongan.alamat}
                  </p>
                </div>
              </div>

              {/* Posisi, Deskripsi, dan Tombol Lamar */}
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
                  {lowongan.posisi}
                </h1>
                {/* Tombol Melamar - Quick Apply dan Regular Apply */}
                {hasApplied ? (
                  <button
                    disabled
                    className="bg-green-500 text-white font-medium px-6 py-2 rounded-lg flex items-center shadow-md cursor-not-allowed whitespace-nowrap"
                  >
                    <span className="w-4 h-4 mr-1 flex items-center justify-center">
                      ✓
                    </span>{" "}
                    Sudah Melamar
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2">
                    {/* Quick Apply Button - only show if user has CVs */}
                    {hasCvs && latestCv?.id && (
                      <button
                        onClick={handleQuickApply}
                        disabled={quickApplying}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg flex items-center shadow-md transition-colors whitespace-nowrap disabled:opacity-50"
                      >
                        {quickApplying ? "Mengirim..." : "Quick Apply"}
                      </button>
                    )}

                    {/* Regular Apply Button */}
                    <button
                      onClick={async () => {
                        console.log("Apply button clicked"); // Debug log

                        const token = localStorage.getItem("authToken");
                        if (!token) {
                          alert(
                            "Anda belum login. Silakan login terlebih dahulu."
                          );
                          return;
                        }

                        // Check if student has profile
                        try {
                          console.log("Checking profile..."); // Debug log
                          const profileResponse = await studentsAPI.getProfile(
                            token
                          );
                          if (!profileResponse.success) {
                            alert(
                              "Profil siswa belum lengkap. Silakan lengkapi profil terlebih dahulu."
                            );
                            return;
                          }
                          console.log("Profile check passed"); // Debug log
                        } catch (error) {
                          console.error("Profile check error:", error); // Debug log
                          alert("Gagal memeriksa profil. Silakan coba lagi.");
                          return;
                        }

                        // Fetch CVs directly in the click handler
                        try {
                          console.log("Fetching CVs..."); // Debug log
                          const response = await studentsAPI.getCvs(token);
                          if (response.success) {
                            const cvList = response.data || [];
                            console.log("CVs fetched:", cvList.length); // Debug log

                            if (cvList.length === 0) {
                              alert(
                                "Anda belum memiliki CV. Silakan buat CV terlebih dahulu sebelum melamar."
                              );
                              return;
                            }

                            // Update state and show modal
                            setCvs(cvList);
                            setSelectedCvId(cvList[0].id);
                            setShowApplyModal(true);
                            console.log("Modal should open now"); // Debug log
                          } else {
                            alert("Gagal memuat data CV. Silakan coba lagi.");
                          }
                        } catch (error) {
                          console.error("CV fetch error:", error); // Debug log
                          alert(
                            "Terjadi kesalahan saat memuat CV. Silakan coba lagi."
                          );
                        }
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-6 py-2 rounded-lg flex items-center shadow-md transition-colors whitespace-nowrap"
                    >
                      <span className="w-4 h-4 mr-1 flex items-center justify-center">
                        +
                      </span>{" "}
                      Melamar
                    </button>
                  </div>
                )}
              </div>

              {/* Deskripsi */}
              <p className="text-gray-700 leading-relaxed mb-10">
                {lowongan.deskripsi}
              </p>

              {/* Info Cards Grid - Sesuai Layout Desain (3 kolom) */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10 pb-8 border-b border-gray-200">
                {/* Baris 1 */}
                <DetailInfoRow
                  title="Bidang pekerjaan"
                  value={lowongan.bidangPekerjaan}
                />
                <DetailInfoRow
                  title="Jenis pekerjaan"
                  value={lowongan.jenisPekerjaan}
                />
                <DetailInfoRow
                  title="Tipe pekerjaan"
                  value={lowongan.tipePembayaran}
                />
                {/* Baris 2 */}
                <DetailInfoRow
                  title="Jenis Kelamin"
                  value={lowongan.jenisKelamin}
                />
                <DetailInfoRow title="Gaji" value={lowongan.gaji} />
                <DetailInfoRow
                  title="Jumlah orang"
                  value={lowongan.jumlahOrang}
                />
              </div>

              {/* Kualifikasi */}
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Kualifikasi
              </h2>
              <ul className="space-y-3 text-gray-700">
                {lowongan.kualifikasi.map((item: string, index: number) => (
                  // Menggunakan tanda bulat kecil atau custom dot
                  <li key={index} className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kolom Lowongan Lain */}
            <div className="w-full lg:w-1/4 space-y-6 animate-fade-in-up delay-300">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Lowongan Serupa
              </h3>

              {/* Kotak Konten Lowongan Lain - Diberi border luar */}
              <div className="border border-gray-300 rounded-xl p-4 space-y-4">
                {similarJobs.map((job) => (
                  <LowonganLainCard
                    key={job.id}
                    lowongan={{
                      id: job.id,
                      perusahaan:
                        job.companyProfile?.companyName || "Perusahaan",
                      posisi: job.jobTitle,
                      gaji: job.salaryRange || "N/A",
                      tipe: [
                        job.employmentType || "Full-time",
                        job.companyProfile?.industryType || "Umum",
                      ],
                    }}
                  />
                ))}
              </div>

              {similarJobs.length === 0 && (
                <p className="text-gray-500 text-sm">
                  Tidak ada lowongan serupa.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Lamar Pekerjaan</h2>
            <p className="text-gray-600 mb-4">
              Pilih CV Anda untuk melamar pekerjaan ini
            </p>

            {cvs.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-4">Anda belum memiliki CV</p>
                <Link
                  href="/siswa/cv/pengajuan"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                  onClick={() => setShowApplyModal(false)}
                >
                  Buat CV
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih CV
                  </label>
                  <select
                    value={selectedCvId}
                    onChange={(e) => setSelectedCvId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {cvs.map((cv) => (
                      <option key={cv.id} value={cv.id}>
                        {cv.fileName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan (Opsional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tambahkan catatan untuk perusahaan..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowApplyModal(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                    disabled={applying}
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    {applying ? "Mengirim..." : "Kirim Lamaran"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DetailLowonganPage;
