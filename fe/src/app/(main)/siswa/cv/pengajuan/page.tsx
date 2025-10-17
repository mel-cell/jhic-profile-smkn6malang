"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { studentsAPI } from "@/app/services/api";

const CvUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Hanya file PDF atau DOC/DOCX yang diperbolehkan");
        setFile(null);
        return;
      }

      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("Ukuran file maksimal 5MB");
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Silakan pilih file CV terlebih dahulu");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Token tidak ditemukan. Silakan login terlebih dahulu.");
        return;
      }

      const response = await studentsAPI.uploadCv(file, token);
      if (response.success) {
        router.push("/siswa/profile");
      } else {
        setError("Gagal mengunggah CV");
      }
    } catch (err: any) {
      console.error("Error uploading CV:", err);
      setError(err.message || "Gagal mengunggah CV");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-16 pt-50">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            href="/siswa/profile"
            className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali ke Profil
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Unggah CV</h1>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="cv-file"
              />
              <label htmlFor="cv-file" className="cursor-pointer">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600 mb-2">
                  Klik untuk memilih file CV
                </p>
                <p className="text-sm text-gray-500">
                  Format: PDF, DOC, DOCX (Maksimal 5MB)
                </p>
              </label>
            </div>

            {/* Selected File Info */}
            {file && (
              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <FileText className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-blue-900">{file.name}</p>
                  <p className="text-sm text-blue-700">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!file || loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Mengunggah..." : "Unggah CV"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CvUploadPage;
